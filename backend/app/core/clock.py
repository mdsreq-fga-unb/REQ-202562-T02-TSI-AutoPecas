from datetime import UTC, date, datetime
from zoneinfo import ZoneInfo


def utc_now() -> datetime:
    return datetime.now(UTC)


def store_today() -> date:
    return utc_now().astimezone(ZoneInfo("America/Sao_Paulo")).date()
