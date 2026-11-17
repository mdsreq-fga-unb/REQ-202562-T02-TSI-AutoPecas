"""Evita repetir redações equivalentes sem esconder vínculos ou condições distintas."""
import unittest
from scripts.backlog import merge, read_base
from scripts.backlog_render import render_story
from tests.test_backlog import issue, snapshot


def record(base_text, issue_text):
    base = read_base()
    base["stories"][0]["dependencies"] = base_text
    snap = snapshot(issue())
    snap["stories"]["US01"]["dependencies"] = issue_text
    return render_story(merge(base, snap)["stories"][0])


class DependencyDisplayTests(unittest.TestCase):
    def test_equivalent_absence_of_dependencies_has_only_one_row(self):
        for text in ["Nenhuma.", "Nenhuma dependência funcional identificada na declaração.",
                     "SEM DEPENDÊNCIAS FUNCIONAIS.", "  Nenhuma dependência identificada na declaração.  "]:
            with self.subTest(text=text):
                html = record("nenhuma dependência identificada na declaração.", text)
                self.assertNotIn("Issue: dependências", html)
                self.assertIn("Nenhuma dependência funcional.", html)

    def test_rf_and_us_references_are_equivalent_for_display(self):
        html = record("RF02 - peça cadastrada.", "US02 - peça cadastrada.")
        self.assertNotIn("Issue: dependências", html)
        self.assertIn('href="#us02"', html)

    def test_different_references_are_preserved(self):
        self.assertIn("Issue: dependências", record("RF02", "US03"))
        self.assertIn("Issue: dependências", record("RF02", "US02 ou US03"))

    def test_absence_does_not_hide_real_dependency_or_condition(self):
        for text in ["US02", "Nenhuma dependência de autenticação; depende de US02."]:
            self.assertIn("Issue: dependências", record("Nenhuma.", text))
        self.assertIn("Issue: dependências", record("RF02 - peça cadastrada.", "US02 - integração ainda pendente."))

    def test_unreported_issue_dependencies_do_not_invent_a_disagreement(self):
        self.assertNotIn("Issue: dependências", record("RF02", ""))


if __name__ == "__main__": unittest.main()
