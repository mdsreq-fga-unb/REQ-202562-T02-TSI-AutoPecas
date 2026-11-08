"""Exercita formulários reais com coleta, composição e geração offline do catálogo."""

import re
import sys
import unittest
from copy import deepcopy
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "tools/docs"))
from scripts.backlog import collect, merge, read_base  # noqa: E402
from scripts.backlog_render import render_catalog  # noqa: E402


def form_body(filename, values):
    text = (ROOT / ".github/ISSUE_TEMPLATE" / filename).read_text(encoding="utf-8")
    labels = re.findall(r"^    label: (.+)$", text, re.M)
    return "\n\n".join(
        "### " + label + "\n\n" + values.get(label, "_No response_") for label in labels
    )


def story(base, **changes):
    values = {
        "Identificação da US": "US01",
        "RF de origem": "RF01",
        "Épico": "EP01 - " + base["epics"][0]["name"],
        "Narrativa": "Como operador, quero cadastrar uma peça para consultar suas informações.",
        "Critérios de aceitação": "Dado um cadastro válido\nQuando salvar\nEntão registrar a peça.",
        "RNFs aplicáveis": ", ".join(base["stories"][0]["rnfs"]),
        "Dependências": base["stories"][0]["dependencies"],
        "Situação do desenvolvimento": "Em andamento",
    }
    values.update(changes)
    return {
        "number": 27,
        "title": "US01 - Cadastrar peça",
        "body": form_body("historia-de-usuario.yml", values),
        "html_url": f"https://github.com/{base['repository']}/issues/27",
        "state": "open",
        "updated_at": "2026-11-08T12:00:00Z",
        "created_at": "2026-10-11T12:00:00Z",
        "assignees": [],
        "labels": [{"name": "user-story"}],
    }


class GitHubFixture:
    def __init__(self, base, item, with_pull=False):
        self.base, self.item, self.with_pull = base, item, with_pull

    def pages(self, path):
        repo = self.base["repository"]
        if path == f"repos/{repo}/issues?state=all":
            epic = {
                "number": 41,
                "title": "EP01 - Catálogo",
                "labels": [],
                "html_url": f"https://github.com/{repo}/issues/41",
                "body": form_body(
                    "epico.yml",
                    {
                        "Identificação do épico": "EP01",
                        "CP de origem": "CP1",
                        "Objetivo": "Organizar o catálogo da loja.",
                    },
                ),
            }
            return [self.item, epic]
        if path == f"repos/{repo}/issues/41/sub_issues":
            return [self.item]
        if path == f"repos/{repo}/pulls?state=all":
            return (
                [
                    {
                        "number": 80,
                        "title": "Corrige cadastro",
                        "state": "closed",
                        "body": "Refs #27",
                        "html_url": f"https://github.com/{repo}/pull/80",
                    }
                ]
                if self.with_pull
                else []
            )
        if path == f"repos/{repo}/issues/27/timeline":
            return []
        if path == f"repos/{repo}/pulls/80/commits" or "/commits?since=" in path:
            return (
                [
                    {
                        "sha": "a" * 40,
                        "html_url": f"https://github.com/{repo}/commit/" + "a" * 40,
                        "commit": {"message": "test: reproduz falha de cadastro (Refs #27)"},
                    }
                ]
                if self.with_pull
                else []
            )
        raise AssertionError("Consulta não prevista no cenário: " + path)

    def request(self, path):
        if path.endswith("/pulls/80"):
            return {"merged_at": "2026-11-08T12:30:00Z"}
        raise AssertionError("Consulta não prevista no cenário: " + path)


class BacklogWorkflowTests(unittest.TestCase):
    def test_implementation_details_from_real_form_reach_existing_story(self):
        base = read_base()
        original = deepcopy(base)
        item = story(base)
        snapshot = collect(base, GitHubFixture(base, item))
        data = merge(base, snapshot)
        record = data["stories"][0]
        self.assertEqual(record["narrative"], snapshot["stories"]["US01"]["narrative"])
        self.assertIn("Então registrar a peça.", record["criteria"])
        self.assertEqual(record["status"], "Em andamento")
        self.assertEqual(record["issue"]["parent"], "EP01")
        html = render_catalog(data, snapshot)
        self.assertIn(record["narrative"], html)
        self.assertEqual(html.count('id="rf01"'), 1)
        self.assertEqual(len(data["stories"]), len(base["stories"]))
        self.assertEqual(base, original)

    def test_bugfix_evidence_links_to_issue_without_assuming_acceptance(self):
        base = read_base()
        item = story(base, **{"Situação do desenvolvimento": "Em revisão"})
        snapshot = collect(base, GitHubFixture(base, item, with_pull=True))
        record = merge(base, snapshot)["stories"][0]
        self.assertEqual(record["evidence"]["pulls"][0]["number"], 80)
        self.assertEqual(len(record["evidence"]["commits"]), 1)
        self.assertEqual(record["status"], "Em revisão")
        self.assertNotEqual(record["status"], "Concluído")
        self.assertIn("/pull/80", render_catalog(merge(base, snapshot), snapshot))

    def test_requirement_change_preserves_origins_and_keeps_history_explicit(self):
        base = read_base()
        original = deepcopy(base)
        revised = deepcopy(base)
        revised["stories"][0]["declaration"] = "Declaração revisada após decisão registrada."
        revised["stories"][0]["history"].append(
            "08/11/2026 - Revisão aprovada no cenário de teste."
        )
        item = story(
            revised,
            **{
                "Narrativa": "Como operador, quero dados revisados para consultar a peça.",
                "RNFs aplicáveis": "RNF01",
            },
        )
        snapshot = collect(revised, GitHubFixture(revised, item))
        record = merge(revised, snapshot)["stories"][0]
        self.assertEqual(record["rnfs"], original["stories"][0]["rnfs"])
        self.assertTrue(record["warnings"])
        self.assertEqual(record["history"], revised["stories"][0]["history"])
        self.assertIn("dados revisados", record["narrative"])
        html = render_catalog(merge(revised, snapshot), snapshot)
        self.assertIn("Declaração revisada", html)
        self.assertIn("Revisão aprovada no cenário", html)
        self.assertEqual(html.count('id="rf01"'), 1)
        self.assertEqual(base, original)

    def test_completion_from_form_requires_dod_and_evidence(self):
        base = read_base()
        item = story(base, **{"Situação do desenvolvimento": "Concluído"})
        snapshot = collect(base, GitHubFixture(base, item))
        self.assertEqual(merge(base, snapshot)["stories"][0]["status"], "Conclusão a confirmar")
        item = story(
            base,
            **{
                "Situação do desenvolvimento": "Concluído",
                "Confirmação de conclusão": (
                    "- [x] A DoD foi atendida e a validação aplicável foi registrada."
                ),
                "Evidência de conclusão": "https://example.com/validacao",
            },
        )
        snapshot = collect(base, GitHubFixture(base, item))
        self.assertEqual(merge(base, snapshot)["stories"][0]["status"], "Concluído")
