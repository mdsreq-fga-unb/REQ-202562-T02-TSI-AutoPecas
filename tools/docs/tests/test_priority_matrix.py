from copy import deepcopy
from html.parser import HTMLParser
import importlib.util
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch
import unittest

from scripts.backlog import priority, read_base
from scripts.priority_render import render_matrix


class MatrixEntries(HTMLParser):
    def __init__(self):
        super().__init__()
        self.entries = {}

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("data-matrix-us"):
            self.entries[attrs["data-matrix-us"]] = attrs


class PriorityMatrixTests(unittest.TestCase):
    def test_matrix_contains_every_story_in_its_calculated_quadrant(self):
        base = read_base()
        html = render_matrix(base)
        parser = MatrixEntries()
        parser.feed(html)
        self.assertEqual(set(parser.entries), {s["us"] for s in base["stories"]})
        for story in base["stories"]:
            entry = parser.entries[story["us"]]
            self.assertEqual(entry["data-quadrant"], priority(story["priority"])[2])
            self.assertEqual(entry["href"], "../requisitos-de-software/#" + story["us"].lower())
        self.assertIn("US02", html)
        self.assertIn("Score 3", html)
        self.assertIn("MVP", html)
        self.assertNotIn("<script", html)
        self.assertNotIn("<iframe", html)


    def test_matrix_recalculates_positions_from_source(self):
        base = deepcopy(read_base())
        base["stories"][0]["priority"].update(vn=1, ei=4, ca=4, lc=4)
        parser = MatrixEntries()
        html = render_matrix(base)
        parser.feed(html)
        self.assertEqual(parser.entries["US01"]["data-quadrant"], "Q4")
        self.assertIn("VN 1, ET 4", html)

    def test_hook_replaces_only_target_page_and_requires_one_marker(self):
        path = Path(__file__).resolve().parents[1] / "hooks/backlog.py"
        spec = importlib.util.spec_from_file_location("test_priority_matrix_hook", path)
        hook = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(hook)
        page = SimpleNamespace(file=SimpleNamespace(src_uri="visao-produto/priorizacao.md"))
        marker = "<!-- PRIORIZACAO:MATRIZ -->"
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
