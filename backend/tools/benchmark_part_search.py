"""Medição HTTP da US04 e US12 em PostgreSQL descartável, com dois usuários concorrentes."""

import json
import math
import os
import socket
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import date
from decimal import Decimal
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import urlopen
from uuid import uuid4

from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine, insert, text
from sqlalchemy.engine import make_url
from sqlalchemy.schema import CreateSchema, DropSchema

from app.models.part import Part, PartCode
from app.models.stock import StockMovement
from app.models.vehicle_application import VehicleApplication


def main() -> None:
    url = make_url(os.environ["US03_TEST_DATABASE_URL"])
    if url.host not in {"localhost", "127.0.0.1"} or url.database != "tsi_us03_test":
        raise ValueError("Use somente o banco local descartável tsi_us03_test.")
    schema = f"us04_bench_{uuid4().hex}"
    admin = create_engine(url)
    engine = None
    server = None
    previous_url = os.environ.get("DATABASE_URL")
    with admin.begin() as connection:
        connection.execute(CreateSchema(schema))
    try:
        scoped = url.update_query_dict({"options": f"-csearch_path={schema}"})
        os.environ["DATABASE_URL"] = scoped.render_as_string(hide_password=False)
        command.upgrade(Config("alembic.ini"), "head")
        engine = create_engine(scoped)
        parts, codes, applications, movements = [], [], [], []
        for index in range(5000):
            part_id = uuid4()
            code = f"BENCH-{index:05}"
            movement_count = 0 if index % 5 == 1 else 5
            quantity = index % 13 + 1
            movements.extend(
                {
                    "part_id": part_id,
                    "quantity": quantity,
                    "entry_date": date(2026, 1, day),
                    "unit_cost": Decimal("10.00"),
                }
                for day in range(1, movement_count + 1)
            )
            parts.append(
                {
                    "id": part_id,
                    "manufacturer_code": code,
                    "name": f"Filtro de óleo {index}" if index % 2 == 0 else f"Pastilha {index}",
                    "category": "Filtros" if index % 2 == 0 else "Freios",
                    "status": "inactive" if index % 10 == 0 else "active",
                    "stock_balance": movement_count * quantity,
                }
            )
            codes.extend(
                {"part_id": part_id, "code": value}
                for value in [code, f"EQ-A-{index:05}", f"EQ-B-{index:05}"]
            )
            for year in range(2010, 2013):
                brand, model = ("Fiat", "Uno") if index % 2 == 0 else ("Volkswagen", "Gol")
                applications.append(
                    {
                        "part_id": part_id,
                        "brand": brand,
                        "model": model,
                        "brand_key": brand.casefold(),
                        "model_key": model.casefold(),
                        "year": str(year),
                    }
                )
        with engine.begin() as connection:
            connection.execute(insert(Part), parts)
            connection.execute(insert(PartCode), codes)
            connection.execute(insert(VehicleApplication), applications)
            connection.execute(insert(StockMovement), movements)
            for table in ("parts", "part_codes", "vehicle_applications", "stock_movements"):
                connection.execute(text(f"ANALYZE {table}"))
        with socket.socket() as listener:
            listener.bind(("127.0.0.1", 0))
            port = listener.getsockname()[1]
        server = subprocess.Popen(
            [
                sys.executable,
                "-m",
                "uvicorn",
                "app.main:app",
                "--host",
                "127.0.0.1",
                "--port",
                str(port),
                "--no-access-log",
                "--log-level",
                "warning",
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0,
        )
        base = f"http://127.0.0.1:{port}"
        deadline = time.monotonic() + 60
        while True:
            if server.poll() is not None:
                raise RuntimeError("A API de benchmark não iniciou.")
            try:
                with urlopen(f"{base}/health", timeout=1) as response:
                    assert json.load(response)["status"] == "ok"
                break
            except OSError:
                if time.monotonic() >= deadline:
                    raise TimeoutError("A API de benchmark não ficou pronta.") from None
                time.sleep(0.2)
        scenarios = [
            {"code": "bench-00042"},
            {"code": "EQ-A-00042"},
            {"name": "ÓLEO"},
            {"category": "Filtros"},
            {"brand": "fia"},
            {"model": "ol"},
            {"year": "2011"},
            {"name": "filtro", "brand": "Fiat", "model": "Uno", "year": "2010"},
            {"code": "INEXISTENTE"},
            {"name": "Pastilha", "offset": "200"},
        ]

        def measure(filters):
            query = urlencode({"offset": 0, "limit": 20, **filters})
            start = time.perf_counter()
            with urlopen(f"{base}/parts/search?{query}", timeout=30) as response:
                result = json.load(response)
            assert isinstance(result["total"], int) and len(result["items"]) <= 20
            return {"filters": filters, "ms": (time.perf_counter() - start) * 1000}

        cold = [measure(filters) for filters in scenarios]
        with ThreadPoolExecutor(max_workers=2) as pool:
            measurements = list(pool.map(measure, scenarios * 20))

        def measure_balance(part):
            part_id = str(part["id"])
            start = time.perf_counter()
            with urlopen(f"{base}/parts/{part_id}/stock-balance", timeout=30) as response:
                result = json.load(response)
            elapsed_ms = (time.perf_counter() - start) * 1000
            assert result == {"part_id": part_id, "stock_balance": part["stock_balance"]}
            return elapsed_ms

        # Peças ativas, inativas, com saldo e sem movimentos.
        balance_scenarios = [parts[index] for index in range(0, len(parts), 499)]
        balance_scenarios.append(parts[1])
        with ThreadPoolExecutor(max_workers=2) as pool:
            balance_times = sorted(pool.map(measure_balance, (balance_scenarios * 20)[:200]))
        balance_p95 = balance_times[math.ceil(len(balance_times) * 0.95) - 1]
        times = sorted(item["ms"] for item in measurements)
        p95 = times[math.ceil(len(times) * 0.95) - 1]
        plans = {}
        queries = {
            "code": "SELECT count(*) FROM parts p WHERE EXISTS "
            "(SELECT 1 FROM part_codes c WHERE c.part_id=p.id AND lower(c.code)=:value)",
            "name": "SELECT count(*) FROM parts WHERE lower(name) LIKE :value",
            "vehicle": "SELECT count(*) FROM parts p WHERE EXISTS "
            "(SELECT 1 FROM vehicle_applications a WHERE a.part_id=p.id "
            "AND a.brand_key LIKE :value AND a.model_key LIKE '%uno%' AND a.year='2010')",
        }
        with engine.connect() as connection:
            for name, query in queries.items():
                value = {"code": "eq-a-00042", "name": "%óleo%", "vehicle": "%fiat%"}[name]
                plans[name] = list(
                    connection.scalars(
                        text(f"EXPLAIN (ANALYZE, BUFFERS) {query}"), {"value": value}
                    )
                )
        report = {
            "parts": 5000,
            "codes": 15000,
            "applications": len(applications),
            "movements": len(movements),
            "concurrency": 2,
            "requests": len(times),
            "p95_ms": round(p95, 2),
            "max_ms": round(max(times), 2),
            "local_target_met": p95 <= 3000,
            "stock_balance": {
                "requests": len(balance_times),
                "p95_ms": round(balance_p95, 2),
                "max_ms": round(max(balance_times), 2),
                "local_target_met": balance_p95 <= 3000,
                "measurements_ms": balance_times,
            },
            "conditions": (
                "HTTP real por loopback; PostgreSQL em Docker local. "
                "Não representa produção ou rede limitada a 10 Mbps."
            ),
            "first_requests": cold,
            "measurements": measurements,
            "plans": plans,
        }
        report_path = Path("../.cache/us04-performance.json")
        report_path.parent.mkdir(exist_ok=True)
        report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
        print(
            json.dumps(
                {
                    key: value
                    for key, value in report.items()
                    if key not in {"first_requests", "measurements", "plans", "stock_balance"}
                },
                ensure_ascii=False,
            )
        )
        print(
            json.dumps(
                {
                    "stock_balance": {
                        key: value
                        for key, value in report["stock_balance"].items()
                        if key != "measurements_ms"
                    }
                }
            )
        )
        if max(p95, balance_p95) > 3000:
            raise SystemExit("P95 local excedeu 3 segundos; examine o relatório.")
    finally:
        if server is not None:
            server.terminate()
            try:
                server.wait(timeout=10)
            except subprocess.TimeoutExpired:
                server.kill()
                server.wait(timeout=10)
        if engine is not None:
            engine.dispose()
        with admin.begin() as connection:
            connection.execute(DropSchema(schema, cascade=True))
        admin.dispose()
        if previous_url is None:
            os.environ.pop("DATABASE_URL", None)
        else:
            os.environ["DATABASE_URL"] = previous_url


if __name__ == "__main__":
    main()
