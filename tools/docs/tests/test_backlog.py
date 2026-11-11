import contextlib
from copy import deepcopy
import io
import json
from pathlib import Path
from html.parser import HTMLParser
import tempfile
import unittest
from unittest.mock import patch

from scripts.backlog import (BacklogError, BASE, GitHub, collect, identifiers,
                             issue_references, main, merge, parse_story, priority,
                             read_base, sections, validate_base)
from scripts.backlog_render import render_catalog, render_story
from scripts.check_links import check as check_links


def issue(body=None, title="US01 - Cadastrar peça", number=27):
    return {"number": number, "title": title, "body": body if body is not None else (
        "**Como** operador, **quero** cadastrar uma peça para organizar o catálogo.\n\n"
        "**Origem:** RF01 · CP1.\n**RNFs:** RNF01, RNF02, RNF03 e RNF05.\n"
        "**Dependências:** acesso autenticado.\n\n### Critérios de aceitação\n"
        "Dado um cadastro válido\nQuando salvar\nEntão registrar a peça.\n\n### A refinar\nDuplicidade."),
        "state": "open", "updated_at": "2026-11-05T10:00:00Z", "created_at": "2026-10-12T10:00:00Z",
        "html_url": f"https://github.com/owner/repo/issues/{number}", "labels": [{"name": "user-story"}], "assignees": []}


def form(status="Não iniciado", confirmation="", evidence=""):
    return ("### Identificação da US\nUS01\n\n### RF de origem\nRF01\n\n"
            "### Épico\nEP01 - Catálogo\n\n### Narrativa\nComo operador, quero cadastrar uma peça.\n\n"
            "### Critérios de aceitação\nDado / Quando / Então.\n\n### A refinar\n_No response_\n\n"
            f"### Situação do desenvolvimento\n{status}\n\n### Confirmação de conclusão\n{confirmation}\n\n"
            f"### Evidência de conclusão\n{evidence}")


def snapshot(item):
    parsed = parse_story(item)
    parsed["parent"] = "EP01"
    return {"repository": read_base()["repository"], "fetched_at": "2026-11-05T10:00:00Z", "stories": {"US01": parsed}}


class BacklogTests(unittest.TestCase):
    def test_base_preserves_complete_inventory_and_cut(self):
        base = read_base()
        self.assertEqual({s["us"] for s in base["stories"]}, {f"US{i:02}" for i in range(1, 41)})
        self.assertEqual([sum(s["delivery"] == cut for s in base["stories"]) for cut in
                          ["MVP", "Condicionado", "Evolução futura"]], [13, 5, 22])

    def test_conditioned_stories_have_no_sprint_assigned(self):
        stories = [s for s in read_base()['stories'] if s['delivery'] == 'Condicionado']
        self.assertEqual(len(stories), 5)
        self.assertTrue(all(s['sprint'] is None for s in stories))

    def test_rf_us_relation_and_epic_cp_are_validated(self):
        base = read_base()
        base["stories"][0]["us"] = "US99"
        with self.assertRaises(BacklogError):
            validate_base(base)
        base = read_base()
        base["stories"][0]["epic"] = "EP02"
        with self.assertRaises(BacklogError):
            validate_base(base)

    def test_inverse_rnf_links_are_derived_from_a_single_source(self):
        base = read_base()
        base["stories"][0]["rnfs"].remove("RNF01")
        validate_base(base)
        data = merge(base)
        rnf = next(r for r in data["non_functional"] if r["id"] == "RNF01")
        self.assertNotIn("RF01", rnf["applies_to"])
        self.assertIn("RF02", rnf["applies_to"])
        base["stories"][0]["rnfs"].append("RNF99")
        with self.assertRaises(BacklogError):
            validate_base(base)

    def test_rounded_effort_and_scores(self):
        self.assertEqual(priority({"ei": 3, "ca": 3, "lc": 1, "vn": 4, "moscow": "Must Have"}), (2, 5, "Q1"))
        self.assertEqual(priority({"ei": 4, "ca": 4, "lc": 4, "vn": 0, "moscow": "Won't Have"}), (4, -4, "Q4"))

    def test_delivery_exception_is_visible_without_changing_calculated_score(self):
        base = read_base()
        item = base["stories"][1]
        item["priority"]["vn"] = 2
        item["delivery_reason"] = "MVP por exceção: decisão do cliente; Score abaixo de 4."
        item["priority_note"] = "Modelo da planilha <a definir>, sem novas notas de esforço."
        record = merge(base)["stories"][1]
        html = render_story(record)
        self.assertEqual(priority(record["priority"]), (2, 3, "Q3"))
        self.assertEqual(record["delivery"], "MVP")
        self.assertIn("Score 3", html)
        self.assertIn("Decisão de entrega", html)
        self.assertIn(item["delivery_reason"], html)
        self.assertIn("&lt;a definir&gt;", html)
        self.assertNotIn("<a definir>", html)

    def test_dependency_display_uses_us_and_preserves_rf_origin_and_anchor(self):
        record = merge(read_base())["stories"][1]
        html = render_story(record)
        dependency_row = html.split("<dt>Dependências</dt>", 1)[1].split("</dd>", 1)[0]
        self.assertIn('href="#us01"', dependency_row)
        self.assertNotIn('href="#rf01"', dependency_row)
        self.assertIn('id="rf02"', html)
        self.assertIn("Declaração de origem - RF02", html)

    def test_legacy_issue_is_imported_without_recreation(self):
        data = parse_story(issue())
        self.assertEqual((data["us"], data["rf"], data["cp"], data["number"]), ("US01", "RF01", "CP1", 27))
        self.assertIn("Como", data["narrative"])
        self.assertIn("Então registrar", data["criteria"])
        self.assertEqual(data["refinement"], "Duplicidade.")

    def test_new_form_parses_and_ignores_missing_optional_answers(self):
        data = parse_story(issue(form()))
        self.assertTrue(data["structured"])
        self.assertEqual(data["epic"], "EP01")
        self.assertEqual(data["refinement"], "")

    def test_inconsistent_identity_is_rejected(self):
        with self.assertRaises(BacklogError):
            parse_story(issue(form().replace("### RF de origem\nRF01", "### RF de origem\nRF02")))
        with self.assertRaises(BacklogError):
            parse_story(issue(form(), title="US02 - Outra história"))

    def test_duplicate_sections_are_rejected(self):
        with self.assertRaises(BacklogError):
            sections("### Narrativa\nUm\n### Narrativa\nOutro")

    def test_acceptance_subheadings_are_not_lost(self):
        parsed = sections("### Critérios de aceitação\n#### CA01\nDado A\n#### CA02\nDado B\n### A refinar\nRegra X")
        self.assertIn("Dado B", parsed["criterios de aceitacao"])

    def test_ids_use_project_numbering(self):
        self.assertEqual(identifiers("CP01 e CP2", "CP"), ["CP1", "CP2"])
        self.assertEqual(identifiers("US1 e US01", "US"), ["US01"])

    def test_missing_issue_keeps_story_visible_and_does_not_invent_narrative(self):
        stories = merge(read_base())["stories"]
        self.assertEqual(len(stories), 40)
        self.assertTrue(all(not s["narrative"] and s["issue"] is None for s in stories))
        self.assertEqual(stories[6]["status"], "Não iniciado")

    def test_issue_content_updates_in_same_record_without_mutating_base(self):
        base = read_base()
        original = deepcopy(base)
        data = merge(base, snapshot(issue(form(status="Em andamento"))))
        self.assertEqual(len(data["stories"]), 40)
        self.assertEqual(data["stories"][0]["status"], "Em andamento")
        self.assertEqual(base, original)

    def test_closed_issue_does_not_automatically_mean_completed(self):
        item = issue()
        item["state"] = "closed"
        result = merge(read_base(), snapshot(item))["stories"][0]
        self.assertNotEqual(result["status"], "Concluído")

    def test_merged_pr_does_not_automatically_mean_completed(self):
        data = snapshot(issue())
        data["evidence"] = {"US01": {"pulls": [{"state": "Integrado"}], "commits": []}}
        self.assertNotEqual(merge(read_base(), data)["stories"][0]["status"], "Concluído")

    def test_done_requires_confirmation_and_evidence(self):
        incomplete = merge(read_base(), snapshot(issue(form("Concluído"))))["stories"][0]
        self.assertEqual(incomplete["status"], "Conclusão a confirmar")
        complete = merge(read_base(), snapshot(issue(form("Concluído", "- [x] A DoD foi atendida", "https://example.com/ata"))))["stories"][0]
        self.assertEqual(complete["status"], "Concluído")

    def test_mvp_authentication_conflict_is_not_silently_overwritten(self):
        result = merge(read_base(), snapshot(issue()))["stories"][0]
        self.assertTrue(any("autenticação" in w for w in result["warnings"]))

    def test_mvp_dependency_outside_cut_remains_visible(self):
        result = merge(read_base())['stories'][7]
        self.assertTrue(any('US07' in w for w in result['warnings']))

    def test_configured_project_status_has_precedence_over_form(self):
        snap = snapshot(issue(form('Não iniciado')))
        snap['project_statuses'] = {read_base()['repository'] + '#27': 'In progress'}
        story = merge(read_base(), snap)['stories'][0]
        self.assertEqual(story['status'], 'Em andamento')
        self.assertEqual(story['status_source'], 'GitHub Projects')

    def test_wrong_repository_snapshot_rejected(self):
        with self.assertRaises(BacklogError):
            merge(read_base(), {"repository": "other/repository"})

    def test_refs_are_exact_and_repository_aware(self):
        refs = issue_references("Closes #27; refs #270; owner/other#27; https://github.com/x/y/issues/9", "owner/repo")
        self.assertEqual(refs, {("owner/repo", 27), ("owner/repo", 270), ("owner/other", 27), ("x/y", 9)})

    def test_duplicate_issue_for_same_us_stops_collection(self):
        class Fake:
            def pages(self, path):
                return [issue(), issue(number=99)]
        with self.assertRaisesRegex(BacklogError, "US duplicada"):
            collect(read_base(), Fake())

    def test_pagination_reads_more_than_first_page(self):
        class Fake(GitHub):
            def request(self, path):
                return list(range(100)) if '&page=1' in path else [100]
        self.assertEqual(len(Fake().pages("repos/a/b/issues?state=all")), 101)

    def test_collection_links_parent_pull_and_commits_without_duplicating_evidence(self):
        base = read_base()
        repo = base["repository"]
        story = issue()
        epic = {**issue(number=41, title="EP01 - Catálogo"), "labels": [],
                "body": "## Objetivo\nOrganizar peças\n## CP relacionado\nCP1"}
        pr = {"number": 80, "title": "Implementa cadastro", "state": "closed", "body": "Closes #27",
              "html_url": f"https://github.com/{repo}/pull/80"}
        commit = {"sha": "a" * 40, "html_url": f"https://github.com/{repo}/commit/" + "a" * 40,
                  "commit": {"message": "Refs #27"}}
        class Fake:
            def pages(self, path):
                if '/issues?state=' in path: return [story, epic]
                if '/41/sub_issues' in path: return [story]
                if '/pulls?state=' in path: return [pr]
                if '/pulls/80/commits' in path or '/commits?since=' in path: return [commit]
                return []
            def request(self, path):
                return {"merged_at": "2026-11-05T10:00:00Z"}
        result = collect(base, Fake())
        self.assertEqual(result['stories']['US01']['parent'], 'EP01')
        self.assertEqual(len(result['evidence']['US01']['commits']), 1)
        self.assertEqual(result['evidence']['US01']['pulls'][0]['state'], 'Integrado')
        self.assertNotEqual(merge(base, result)['stories'][0]['status'], 'Concluído')

    def test_failed_collection_does_not_overwrite_previous_snapshot(self):
        with tempfile.TemporaryDirectory() as tmp:
            cache = Path(tmp) / 'github.json'
            cache.write_text('{"previous":true}')
            with patch('sys.argv', ['backlog.py', 'sync', '--data', str(BASE), '--cache', str(cache)]), patch('scripts.backlog.collect', side_effect=BacklogError('indisponível')), contextlib.redirect_stderr(io.StringIO()):
                self.assertEqual(main(), 1)
            self.assertEqual(cache.read_text(), '{"previous":true}')

    def test_generated_catalog_has_all_stories_no_general_table_and_safe_issue_text(self):
        item = issue(form().replace('Como operador, quero cadastrar uma peça.', '<script>alert(1)</script>'))
        snap = snapshot(item)
        html = render_catalog(merge(read_base(), snap), snap)
        self.assertEqual(html.count('class="req-record" id="rf'), 40)
        self.assertEqual(html.count('class="req-record req-record--rnf"'), 5)
        self.assertNotIn('<table', html)
        self.assertNotIn('<script>', html)
        self.assertIn('&lt;script&gt;', html)
        self.assertIn('id="us40"', html)
        self.assertIn('CP a definir', html)


    def test_filter_metadata_distinguishes_linked_and_undetailed_stories(self):
        class Records(HTMLParser):
            def __init__(self):
                super().__init__()
                self.records = {}
            def handle_starttag(self, tag, attrs):
                attrs = dict(attrs)
                if tag == 'details' and attrs.get('id', '').startswith('rf'):
                    self.records[attrs['id']] = attrs
        snap = snapshot(issue(form()))
        parser = Records()
        parser.feed(render_catalog(merge(read_base(), snap), snap))
        self.assertEqual(parser.records['rf01']['data-issue'], 'linked')
        self.assertEqual(parser.records['rf01']['data-detail'], 'described')
        self.assertEqual(parser.records['rf07']['data-issue'], 'missing')
        self.assertEqual(parser.records['rf07']['data-detail'], 'incomplete')
        self.assertEqual(parser.records['rf07']['data-sprint'], 'none')
        self.assertEqual(parser.records['rf07']['data-epic'], 'EP02')

    def test_filter_options_include_all_epics_rnfs_and_refinement_states(self):
        html = render_catalog(merge(read_base()), None)
        for field in ['cut', 'epic', 'status', 'sprint', 'rnf', 'moscow', 'quadrant', 'issue', 'detail', 'warning', 'evidence']:
            self.assertEqual(html.count('data-backlog-filter="' + field + '"'), 1)
        self.assertIn('<option value="EP07">', html)
        self.assertNotIn('data-backlog-filter="epic" data-backlog-epic', html)
        self.assertIn('<option value="RNF05">', html)
        self.assertIn('data-backlog-reset', html)
        self.assertIn('aria-live="polite"', html)

    def test_link_checker_supports_project_site_prefix(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / 'index.html').write_text('<a href="/project/page.html#target">link</a>')
            (root / 'page.html').write_text('<h1 id="target">Destino</h1>')
            self.assertEqual(check_links(root, prefix='/project/'), [])

    def test_link_checker_rejects_missing_target_and_duplicate_id(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / 'index.html').write_text('<a href="#missing">link</a><i id="same"></i><i id="same"></i>')
            errors = check_links(root, prefix='/project/')
            self.assertTrue(any('âncora inexistente' in e for e in errors))
            self.assertTrue(any('ID duplicado' in e for e in errors))


if __name__ == '__main__':
    unittest.main()
