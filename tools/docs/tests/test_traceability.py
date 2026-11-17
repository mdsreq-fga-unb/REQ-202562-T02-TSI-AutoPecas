from copy import deepcopy
from html.parser import HTMLParser
import importlib.util
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch
import unittest

from scripts.backlog import read_base
from scripts.traceability_render import render_tree


class TreeLinks(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stories = []
        self.links = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("data-tree-us"):
            self.stories.append(attrs["data-tree-us"])
        if tag == "a":
            self.links.append(attrs.get("href"))


class TraceabilityTests(unittest.TestCase):
    def test_text_tree_contains_exact_mvp_and_complete_origin_links(self):
        base = read_base()
        html = render_tree(base)
        parser = TreeLinks()
        parser.feed(html)
        expected = [s["us"] for s in base["stories"] if s["delivery"] == "MVP"]
        self.assertEqual(parser.stories, expected)
        self.assertEqual(len(expected), 12)
        self.assertNotIn("US13", parser.stories)
        self.assertNotIn("US14", parser.stories)
        for story in (s for s in base["stories"] if s["delivery"] == "MVP"):
            for target in (
                "../solucao-e-caracteristicas/#oe" + story["oe"],
                "../solucao-e-caracteristicas/#" + story["cp"].lower(),
                "../requisitos-de-software/#" + story["epic"].lower(),
                "../requisitos-de-software/#" + story["id"].lower(),
                "../requisitos-de-software/#" + story["us"].lower(),
            ):
                self.assertIn(target, parser.links)
        self.assertIn("RNF04", html)
        self.assertIn("CP a definir", html)
        self.assertNotIn("<script", html)
        self.assertNotIn("<iframe", html)


    def test_tree_tracks_changes_in_source_and_escapes_names(self):
        base = deepcopy(read_base())
        base["stories"][0]["delivery"] = "Condicionado"
        base["stories"][1]["name"] = '<script>alert("nome")</script>'
        parser = TreeLinks()
        html = render_tree(base)
        parser.feed(html)
        self.assertEqual(len(parser.stories), 11)
        self.assertNotIn("US01", parser.stories)
        self.assertIn("&lt;script&gt;", html)
        self.assertNotIn("<script>", html)

    def test_hook_replaces_only_target_page_and_requires_one_marker(self):
        path = Path(__file__).resolve().parents[1] / "hooks/traceability.py"
        spec = importlib.util.spec_from_file_location("test_traceability_hook", path)
        hook = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(hook)
        page = SimpleNamespace(file=SimpleNamespace(src_uri="visao-produto/rastreabilidade.md"))
        marker = "<!-- RASTREABILIDADE:ARVORE -->"
        with patch.object(hook, "read_base", return_value=read_base()):
            result = hook.on_page_markdown(marker, page, None, None)
            self.assertNotIn(marker, result)
            self.assertIn("US01", result)
            for invalid in ("", marker + marker):
                with self.assertRaises(ValueError):
                    hook.on_page_markdown(invalid, page, None, None)
        other = SimpleNamespace(file=SimpleNamespace(src_uri="index.md"))
        self.assertEqual(hook.on_page_markdown(marker, other, None, None), marker)


if __name__ == "__main__":
    unittest.main()
