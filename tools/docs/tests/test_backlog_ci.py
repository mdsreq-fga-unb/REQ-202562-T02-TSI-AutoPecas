"""Checks do commit associado: evidência técnica, sem inferência de aceite."""
import unittest
from scripts.backlog import collect, read_base, merge
from scripts.backlog_render import render_story
from tests.test_backlog import issue


class GitHubFixture:
    def pages(self, path):
        if "/issues?state=" in path: return [issue()]
        if "/pulls?state=" in path:
            return [{"number": 65, "title": "Implementa cadastro", "state": "closed", "body": "Refs #27", "html_url": "https://github.com/owner/repo/pull/65"}]
        return []

    def request(self, path):
        if "/pulls/65" in path:
            return {"merged_at": "2026-11-12T00:00:00Z", "head": {"sha": "a" * 40}}
        if "/check-runs" in path:
            return {"check_runs": [{"name": "frontend <check>", "status": "completed", "conclusion": "success", "html_url": "https://github.com/owner/repo/actions/runs/99"}]}
        raise AssertionError(path)


class CITests(unittest.TestCase):
    def test_pr_checks_are_collected_and_rendered_without_declaring_acceptance(self):
        base = read_base()
        snapshot = collect(base, GitHubFixture())
        record = merge(base, snapshot)["stories"][0]
        self.assertEqual(record["evidence"]["pulls"][0]["checks"][0]["conclusion"], "success")
        html = render_story(record)
        self.assertIn("actions/runs/99", html)
        self.assertIn("frontend &lt;check&gt;", html)
        self.assertNotEqual(record["status"], "Concluído")

    def test_checks_pagination_does_not_stop_at_first_hundred(self):
        class Paginated(GitHubFixture):
            def request(self, path):
                if "/check-runs" in path:
                    n = 100 if "&page=1" in path else 1
                    return {"check_runs": [{"name": str(i), "status": "in_progress", "html_url": "https://example.com/check"} for i in range(n)]}
                return super().request(path)
        data = collect(read_base(), Paginated())
        self.assertEqual(len(data["evidence"]["US01"]["pulls"][0]["checks"]), 101)

    def test_failed_check_is_visible_and_does_not_mean_completion(self):
        class Failed(GitHubFixture):
            def request(self, path):
                data = super().request(path)
                if "/check-runs" in path: data["check_runs"][0]["conclusion"] = "failure"
                return data
        base = read_base()
        record = merge(base, collect(base, Failed()))["stories"][0]
        self.assertIn("Falhou", render_story(record))
        self.assertNotEqual(record["status"], "Concluído")


if __name__ == "__main__": unittest.main()
