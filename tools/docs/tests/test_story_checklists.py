"""Contrato de migração: checklists reais, Projects e apresentação segura."""
from copy import deepcopy
from pathlib import Path
import unittest
import re
import yaml
from scripts.backlog import merge, parse_story, read_base, sections
from scripts.backlog_render import render_story
from tests.test_backlog import issue, snapshot

ROOT = Path(__file__).resolve().parents[3]
DOC = (ROOT / "docs/visao-produto/dor-e-dod.md").read_text(encoding="utf-8")
DOR, DOD = DOC.split("## <span id=\"92-definition-of-done-dod\"></span>")[0], DOC.split("## <span id=\"92-definition-of-done-dod\"></span>")[1]
plain = lambda s: re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", s).replace("**", "")
DOR = [plain(line[6:]) for line in DOR.splitlines() if line.startswith("- [ ] ")]
DOD = [plain(line[6:]) for line in DOD.splitlines() if line.startswith("- [ ] ")]


def body(checked=False, evidence="https://example.com/validacao"):
    tasks = lambda items: "\n".join("- [" + ("x" if checked else " ") + "] " + s for s in items)
    return ("### Identificação da US\nUS01\n### RF de origem\nRF01 · CP1\n"
            "### Épico\nEP01 - Catálogo\n### Narrativa\nComo usuário, quero cadastrar.\n"
            "### Critérios de aceitação\n#### CA01.1\nDado / Quando / Então.\n"
            "### RNFs aplicáveis\nRNF01, RNF02, RNF03, RNF05\n"
            "### Dependências\nNenhuma.\n### Checklist de DoR\n" + tasks(DOR) +
            "\n### Checklist de DoD\n" + tasks(DOD) + "\n### Evidências\n" + evidence)


def composed(text, project=None):
    snap = snapshot(issue(text))
    if project:
        snap["project_statuses"] = {read_base()["repository"] + "#27": project}
    return merge(read_base(), snap)["stories"][0]


class StoryChecklistTests(unittest.TestCase):
    def test_new_sections_are_independent_and_keep_acceptance_subheadings(self):
        fields = sections(body())
        self.assertEqual(fields["dependencias"], "Nenhuma.")
        self.assertIn("#### CA01.1", fields["criterios de aceitacao"])
        self.assertNotIn("Checklist", fields["dependencias"])
        parsed = parse_story(issue(body()))
        self.assertEqual(len(parsed["dor"]["items"]), 12)
        self.assertEqual(len(parsed["dod"]["items"]), 5)
        self.assertEqual(parsed["completion_evidence"], "https://example.com/validacao")

    def test_unknown_peer_section_does_not_leak_into_criteria(self):
        fields = sections("### Critérios de aceitação\nDado A\n### Observações\nTexto extra\n### RNFs aplicáveis\nRNF01")
        self.assertEqual(fields["criterios de aceitacao"], "Dado A")

    def test_all_dod_items_and_evidence_are_required_for_project_done(self):
        self.assertEqual(composed(body(), "Done")["status"], "Conclusão a confirmar")
        self.assertEqual(composed(body(True), "Done")["status"], "Concluído")
        self.assertEqual(composed(body(True, "https://"), "Done")["status"], "Conclusão a confirmar")
        self.assertEqual(composed(body(True, "http://example.com/ata"), "Done")["status"], "Conclusão a confirmar")
        partial = body(True).replace("- [x] " + DOD[-1], "- [ ] " + DOD[-1])
        self.assertEqual(composed(partial, "Done")["status"], "Conclusão a confirmar")

    def test_removed_or_duplicate_tasks_cannot_confirm_completion(self):
        removed = body(True).replace("- [x] " + DOD[-1], "")
        self.assertEqual(composed(removed, "Done")["status"], "Conclusão a confirmar")
        duplicate = body(True).replace(DOD[-1], DOD[0])
        self.assertEqual(composed(duplicate, "Done")["status"], "Conclusão a confirmar")

    def test_new_format_never_falls_back_to_legacy_status_or_confirmation(self):
        text = body() + "\n### Situação do desenvolvimento\nConcluído\n### Confirmação de conclusão\n- [x] A DoD foi atendida."
        self.assertEqual(composed(text)["status"], "Status do Projects indisponível")
        self.assertEqual(composed(text, "Done")["status"], "Conclusão a confirmar")

    def test_dod_does_not_change_project_progress(self):
        self.assertEqual(composed(body(True), "In progress")["status"], "Em andamento")
        record = composed(body(True))
        self.assertEqual(record["status"], "Status do Projects indisponível")
        self.assertTrue(record["warnings"])

    def test_dor_is_reported_without_retroactive_approval(self):
        record = composed(body(), "In progress")
        self.assertTrue(any("DoR" in w for w in record["warnings"]))
        self.assertFalse(record["issue"]["dor"]["complete"])

    def test_checklists_render_compact_readonly_and_no_empty_refinement(self):
        html = render_story(composed(body(True), "Done"))
        self.assertIn("DoR: 12/12", html)
        self.assertIn("DoD: 5/5", html)
        self.assertIn("disabled", html)
        self.assertIn("Evidências", html)
        self.assertNotIn("A refinar", html)

    def test_issue_text_remains_escaped_in_checklists(self):
        text = body().replace(DOD[0], "<script>alert(1)</script>")
        html = render_story(composed(text))
        self.assertNotIn("<script>", html)
        self.assertIn("&lt;script&gt;", html)

    def test_template_matches_documented_checklists_without_old_fields(self):
        template = yaml.safe_load((ROOT / ".github/ISSUE_TEMPLATE/historia-de-usuario.yml").read_text(encoding="utf-8"))
        fields = {f["attributes"].get("label"): f for f in template["body"]}
        for label, expected in [("Checklist de DoR", DOR), ("Checklist de DoD", DOD)]:
            self.assertEqual([o["label"] for o in fields[label]["attributes"]["options"]], expected)
        self.assertIn("Evidências", fields)
        for label in ["A refinar", "Situação do desenvolvimento", "Confirmação de conclusão"]:
            self.assertNotIn(label, fields)

    def test_rnfs_are_a_bullet_relationship_not_a_verification_checklist(self):
        text = body().replace("RNF01, RNF02, RNF03, RNF05", "- RNF01 - Responsividade\n- RNF02 - Falhas\n- RNF03 - Navegadores\n- RNF05 - Segurança")
        parsed = parse_story(issue(text))
        self.assertEqual(parsed["rnfs"], ["RNF01", "RNF02", "RNF03", "RNF05"])
        html = render_story(composed(text))
        relation = html.split('<dt>RNFs</dt>', 1)[1].split('</dd>', 1)[0]
        self.assertIn('<ul class="backlog-rnf-list">', relation)
        self.assertEqual(relation.count('<li>'), 4)
        self.assertIn('href="#rnf02"', relation)
        self.assertNotIn('checkbox', relation)
        template = yaml.safe_load((ROOT / ".github/ISSUE_TEMPLATE/historia-de-usuario.yml").read_text(encoding="utf-8"))
        field = next(f for f in template["body"] if f.get("id") == "rnfs")
        self.assertEqual(field["type"], "textarea")
        self.assertIn('- RNF01', field["attributes"]["placeholder"])


if __name__ == "__main__":
    unittest.main()
