"""Gera ou confere entradas do Claude a partir das instruções compartilhadas."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[2]
SCOPES = ("", "frontend", "backend", "tools/docs")


def metadata(path: Path) -> dict[str, str]:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n") or "\n---\n" not in text[4:]:
        raise ValueError(f"Frontmatter ausente ou incompleto: {path}")
    header, body = text[4:].split("\n---\n", 1)
    result = {}
    for key in ("name", "description"):
        values = re.findall(rf"^{key}:\s*(.+)$", header, re.M)
        if len(values) != 1:
            raise ValueError(f"Campo {key} deve aparecer uma vez em {path}")
        value = values[0].strip()
        if value.startswith('"'):
            value = json.loads(value)
        elif value.startswith("'") and value.endswith("'"):
            value = value[1:-1].replace("''", "'")
        if not isinstance(value, str) or not value.strip() or value in ("|", ">"):
            raise ValueError(f"Use {key} como texto não vazio em uma linha: {path}")
        result[key] = value
    name = result["name"]
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", name) or len(name) > 64:
        raise ValueError(f"Nome de skill inválido: {path}")
    if name != path.parent.name or len(result["description"]) > 1024 or not body.strip():
        raise ValueError(f"Nome, descrição ou corpo incompatível: {path}")
    return result


def check_links(path: Path, root: Path) -> None:
    for match in re.finditer(r"\[[^\]]*\]\(([^)]+)\)", path.read_text(encoding="utf-8")):
        destination = urlsplit(match[1])
        if destination.scheme or destination.netloc or not destination.path:
            continue
        target = (path.parent / unquote(destination.path)).resolve()
        if not target.is_relative_to(root) or not target.exists():
            raise ValueError(f"Referência local inválida em {path.relative_to(root)}: {match[1]}")


def adapter(fields: dict[str, str]) -> str:
    name = fields["name"]
    return (
        "---\nname: "
        + name
        + "\ndescription: "
        + json.dumps(fields["description"], ensure_ascii=False)
        + "\n---\n\n"
        + f"Leia integralmente [a skill compartilhada](../../../.agents/skills/{name}/SKILL.md) "
        + "antes de executar a tarefa e siga seu procedimento. Resolva os recursos relativos "
        + "à pasta da skill compartilhada.\n\n"
        + "Entrada gerada por `python tools/agents/sync_skills.py`; "
        + "edite a fonte em `.agents/skills/`.\n"
    )


def synchronize(root: Path, *, check_only: bool) -> list[str]:
    root = root.resolve()
    skills = sorted((root / ".agents/skills").glob("*/SKILL.md"))
    if not skills:
        raise ValueError("Nenhuma skill compartilhada encontrada em .agents/skills/.")
    expected = {}
    for skill in skills:
        fields = metadata(skill)
        check_links(skill, root)
        expected[root / ".claude/skills" / fields["name"] / "SKILL.md"] = adapter(fields)
    for scope in SCOPES:
        source = root / scope / "AGENTS.md"
        if not source.is_file():
            raise ValueError(f"Instruções ausentes: {source.relative_to(root)}")
        check_links(source, root)
        expected[root / scope / "CLAUDE.md"] = "@AGENTS.md\n"
    extras = sorted(set((root / ".claude/skills").glob("*/SKILL.md")) - expected.keys())
    if extras:
        raise ValueError(
            "Adaptadores sem fonte compartilhada: "
            + ", ".join(str(p.relative_to(root)) for p in extras)
        )
    errors = []
    for path, content in expected.items():
        if path.is_file() and path.read_text(encoding="utf-8") == content:
            continue
        if check_only:
            errors.append(f"Entrada ausente ou desatualizada: {path.relative_to(root)}")
        else:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(content, encoding="utf-8")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Confere sem escrever arquivos.")
    parser.add_argument("--root", type=Path, default=ROOT, help=argparse.SUPPRESS)
    args = parser.parse_args()
    try:
        errors = synchronize(args.root, check_only=args.check)
        if errors:
            print("\n".join(errors))
            return 1
        print(
            "Skills, referências e entradas do Claude conferidas."
            if args.check
            else "Entradas compartilhadas do Claude sincronizadas."
        )
        return 0
    except (OSError, ValueError) as exc:
        print(f"Skills: {exc}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
