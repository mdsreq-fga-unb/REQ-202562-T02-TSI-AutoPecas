"""Vínculos posteriores ao merge, evidências e desconexões na timeline real."""
import unittest
from scripts.backlog import collect, read_base, merge
from scripts.backlog_render import render_story
from tests.test_backlog import issue

REPO = read_base()["repository"]
URL = f"https://github.com/{REPO}/pull/65"


def manual(kind="connected", number=65):
    return {"event": kind, "created_at": "2026-11-14T17:34:50Z", "subject": {
        "type": "pull_request", "number": number, "state": "merged",
        "repository": {"full_name": REPO}, "merged_at": "2026-11-14T17:33:32Z"}}


class Fixture:
    def __init__(self, events=None, evidence="", pr_body=None):
        self.events, self.evidence, self.pr_body = events or [], evidence, pr_body
        self.detail_reads = 0

    def pages(self, path):
        if "/issues?state=" in path:
            return [issue(issue()["body"] + "\n### Evidências\n" + self.evidence)]
        if "/pulls?state=" in path:
            return [{"number": 65, "title": "Cadastro", "state": "closed", "body": self.pr_body, "html_url": URL}]
        if "/issues/27/timeline" in path: return self.events
        if "/pulls/65/commits" in path:
            return [{"sha": "a" * 40, "html_url": f"https://github.com/{REPO}/commit/" + "a" * 40}]
        return []

    def request(self, path):
        if "/pulls/65" in path:
            self.detail_reads += 1
            return {"merged_at": "2026-11-14T17:33:32Z", "head": {"sha": "a" * 40}}
        if "/check-runs" in path:
            return {"check_runs": [{"name": "backend", "status": "completed", "conclusion": "success", "html_url": "https://github.com/owner/repo/actions/runs/1"}]}
        raise AssertionError(path)


class ManualPullLinkTests(unittest.TestCase):
    def test_manual_link_after_merge_imports_pr_commits_and_checks(self):
        base = read_base()
        result = collect(base, Fixture(events=[manual()]))
        proof = result["evidence"]["US01"]
        self.assertEqual(len(proof["pulls"]), 1)
        self.assertEqual(proof["pulls"][0]["state"], "Integrado")
        self.assertEqual(proof["pulls"][0]["checks"][0]["conclusion"], "success")
        self.assertEqual(len(proof["commits"]), 1)
        record = merge(base, result)["stories"][0]
        self.assertIn("actions/runs/1", render_story(record))
        self.assertNotEqual(record["status"], "Concluído")

    def test_evidence_link_alone_works_with_empty_pr_description(self):
        result = collect(read_base(), Fixture(evidence=f"[Implementação]({URL})"))
        self.assertEqual(result["evidence"]["US01"]["pulls"][0]["number"], 65)

    def test_sources_are_deduplicated(self):
        event = {"event": "cross-referenced", "source": {"issue": {"html_url": URL, "pull_request": {}}}}
        client = Fixture(events=[manual(), event], evidence=URL + " " + URL, pr_body="Refs #27")
        proof = collect(read_base(), client)["evidence"]["US01"]
        self.assertEqual(client.detail_reads, 1)
        self.assertEqual(len(proof["pulls"]), 1)
        self.assertEqual(len(proof["commits"]), 1)

    def test_disconnected_link_is_not_treated_as_active(self):
        client = Fixture(events=[manual(), manual("disconnected")])
        self.assertEqual(collect(read_base(), client)["evidence"]["US01"]["pulls"], [])

    def test_disconnection_preserves_independent_evidence_reference(self):
        client = Fixture(events=[manual(), manual("disconnected")], evidence=URL)
        self.assertEqual(len(collect(read_base(), client)["evidence"]["US01"]["pulls"]), 1)

    def test_reconnection_and_url_suffixes_are_recognized(self):
        client = Fixture(events=[manual(), manual("disconnected"), manual()])
        self.assertEqual(len(collect(read_base(), client)["evidence"]["US01"]["pulls"]), 1)
        client = Fixture(evidence=URL.lower() + "/files#diff-123")
        self.assertEqual(len(collect(read_base(), client)["evidence"]["US01"]["pulls"]), 1)

    def test_unregistered_or_malformed_references_are_ignored(self):
        bad = manual(); bad["subject"]["repository"]["full_name"] = "other/repo"
        for value in [URL + "evil", URL + "0", "https://github.com.evil.test/" + REPO + "/pull/65", "https://github.com/other/repo/pull/65"]:
            with self.subTest(value=value):
                client = Fixture(events=[bad], evidence=value)
                self.assertEqual(collect(read_base(), client)["evidence"]["US01"]["pulls"], [])
                self.assertEqual(client.detail_reads, 0)


if __name__ == "__main__": unittest.main()
