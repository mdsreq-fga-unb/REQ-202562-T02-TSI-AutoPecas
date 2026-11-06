"""Renderiza o backlog em memória durante o build; nunca reescreve a fonte Markdown."""
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from scripts.backlog import CACHE, merge, read_base
from scripts.backlog_render import render_catalog

MARKER = "<!-- BACKLOG:GERADO -->"


def on_page_markdown(markdown, page, config, files):
    if page.file.src_uri != "visao-produto/requisitos-de-software.md":
        return markdown
    if markdown.count(MARKER) != 1:
        raise ValueError("O catálogo deve possuir exatamente um ponto de geração.")
    snapshot = json.loads(CACHE.read_text(encoding="utf-8")) if CACHE.exists() else None
    return markdown.replace(MARKER, render_catalog(merge(read_base(), snapshot), snapshot))
