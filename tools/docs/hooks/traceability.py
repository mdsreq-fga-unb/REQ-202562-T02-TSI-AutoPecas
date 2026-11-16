"""Publica a alternativa textual da árvore a partir da base versionada."""
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from scripts.backlog import read_base
from scripts.traceability_render import render_tree

MARKER = "<!-- RASTREABILIDADE:ARVORE -->"


def on_page_markdown(markdown, page, config, files):
    if page.file.src_uri != "visao-produto/rastreabilidade.md":
        return markdown
    if markdown.count(MARKER) != 1:
        raise ValueError("A árvore textual deve possuir exatamente um ponto de geração.")
    return markdown.replace(MARKER, render_tree(read_base()))
