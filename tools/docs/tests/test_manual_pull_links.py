"""Apenas vínculos atuais de Development associam PRs à história."""
import unittest
from scripts.backlog import BacklogError, collect, read_base, merge
from scripts.backlog_render import render_story
from tests.test_backlog import issue

REPO = read_base()["repository"]
URL = f"https://github.com/{REPO}/pull/65"


def manual(kind="connected", number=65):
    return {"event": kind, "subject": {"type": "pull_request", "number": number,
            "repository": {"full_name": REPO}}}


def linked(number=65, repository=REPO):
    return {"number": number, "repository": {"nameWithOwner": repository}}


def connection(nodes, more=False, cursor=None):
    return {"data": {"repository": {"issue": {"closedByPullRequestsReferences": {
        "nodes": nodes, "pageInfo": {"hasNextPage": more, "endCursor": cursor}}}}}}


class Fixture:
    def __init__(self, events=None, evidence="", pr_body=None, links=None):
        self.events, self.evidence, self.pr_body = events or [], evidence, pr_body
        self.links = links or []
        self.detail_reads = 0
        self.queries = []

    def pages(self, path):
        if "/issues?state=" in path:
            return [issue(issue()["body"] + "\n### Evidências\n" + self.evidence)]
        if "/pulls?state=" in path:
            return [{"number": 65, "title": "Cadastro", "state": "closed",
                     "body": self.pr_body, "html_url": URL}]
        if "/issues/27/timeline" in path:
            return self.events
        if "/pulls/" in path and path.endswith("/commits"):
            return [{"sha": "a" * 40, "html_url": f"https://github.com/{REPO}/commit/" + "a" * 40}]
        return []

    def request(self, path, payload=None):
        if path == "graphql":
            self.queries.append(payload)
            return connection(self.links)
        if "/pulls/" in path:
            self.detail_reads += 1
            number = int(path.rsplit("/", 1)[1])
            return {"number": number, "title": "Cadastro", "state": "closed",
                    "html_url": f"https://github.com/{REPO}/pull/{number}",
                    "merged_at": "2026-11-14T17:33:32Z", "head": {"sha": "a" * 40}}
        if "/check-runs" in path:
            return {"check_runs": [{"name": "backend", "status": "completed", "conclusion": "success",
                                   "html_url": "https://github.com/owner/repo/actions/runs/1"}]}
        raise AssertionError(path)


class ManualPullLinkTests(unittest.TestCase):
    def test_direct_link_after_merge_imports_pr_commits_and_checks(self):
        base = read_base()
        client = Fixture(events=[manual()], links=[linked()])
        result = collect(base, client)
        proof = result["evidence"]["US01"]
        self.assertEqual(len(proof["pulls"]), 1)
        self.assertEqual(proof["pulls"][0]["state"], "Integrado")
        self.assertEqual(proof["pulls"][0]["checks"][0]["conclusion"], "success")
        self.assertEqual(len(proof["commits"]), 1)
        record = merge(base, result)["stories"][0]
        self.assertIn("actions/runs/1", render_story(record))
        self.assertNotEqual(record["status"], "Concluído")

    def test_pr_description_mention_alone_does_not_associate(self):
        for body in ("Refs #27", "Closes #27", f"https://github.com/{REPO}/issues/27"):
            with self.subTest(body=body):
                client = Fixture(pr_body=body)
                proof = collect(read_base(), client)["evidence"]["US01"]
                self.assertEqual(proof["pulls"], [])
                self.assertEqual(proof["commits"], [])
                self.assertEqual(client.detail_reads, 0)

    def test_cross_reference_from_pr_or_comment_does_not_associate(self):
        event = {"event": "cross-referenced", "source": {"issue": {"html_url": URL, "pull_request": {}}}}
        client = Fixture(events=[event])
        self.assertEqual(collect(read_base(), client)["evidence"]["US01"]["pulls"], [])
        self.assertEqual(client.detail_reads, 0)

    def test_evidence_url_remains_text_without_associating_pr(self):
        result = collect(read_base(), Fixture(evidence=f"[Implementação]({URL})"))
        self.assertEqual(result["evidence"]["US01"]["pulls"], [])
        self.assertIn(URL, result["stories"]["US01"]["completion_evidence"])

    def test_unlinked_pr_stays_absent_despite_mentions_and_evidence(self):
        client = Fixture(events=[manual(), manual("disconnected")], evidence=URL, pr_body="Refs #27")
        proof = collect(read_base(), client)["evidence"]["US01"]
        self.assertEqual(proof["pulls"], [])
        self.assertEqual(proof["commits"], [])
        self.assertEqual(client.detail_reads, 0)

    def test_current_links_take_precedence_over_historical_timeline(self):
        client = Fixture(events=[manual()], links=[])
        self.assertEqual(collect(read_base(), client)["evidence"]["US01"]["pulls"], [])

    def test_reconnected_pr_is_collected_once(self):
        client = Fixture(events=[manual(), manual("disconnected"), manual()],
                         links=[linked(), linked()], evidence=URL, pr_body="Refs #27")
        proof = collect(read_base(), client)["evidence"]["US01"]
        self.assertEqual(len(proof["pulls"]), 1)
        self.assertEqual(len(proof["commits"]), 1)
        self.assertEqual(client.detail_reads, 1)

    def test_links_outside_allowed_repositories_are_ignored(self):
        client = Fixture(links=[linked(repository="other/repo")])
        self.assertEqual(collect(read_base(), client)["evidence"]["US01"]["pulls"], [])
        self.assertEqual(client.detail_reads, 0)

    def test_repository_matching_is_case_insensitive(self):
        client = Fixture(events=[manual()], links=[linked(repository=REPO.lower())])
        self.assertEqual(len(collect(read_base(), client)["evidence"]["US01"]["pulls"]), 1)

    def test_direct_links_are_paginated_and_include_closed_prs(self):
        class Paginated(Fixture):
            def request(self, path, payload=None):
                if path == "graphql":
                    self.queries.append(payload)
                    if payload["variables"]["cursor"] is None:
                        return connection([linked()] * 100, True, "next")
                    return connection([linked(66)])
                return super().request(path, payload)
        client = Paginated()
        proof = collect(read_base(), client)["evidence"]["US01"]
        self.assertEqual([p["number"] for p in proof["pulls"]], [65, 66])
        self.assertEqual(len(client.queries), 2)
        self.assertIn("includeClosedPrs:true", client.queries[0]["query"].replace(" ", ""))
        self.assertEqual(client.queries[1]["variables"]["cursor"], "next")

    def test_missing_link_response_fails_instead_of_publishing_empty_evidence(self):
        class Unavailable(Fixture):
            def request(self, path, payload=None):
                if path == "graphql":
                    return {"data": {"repository": {"issue": None}}}
                return super().request(path, payload)
        with self.assertRaises(BacklogError):
            collect(read_base(), Unavailable())


if __name__ == "__main__":
    unittest.main()
