import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

MODULE_PATH = Path(__file__).resolve().parents[1] / "sync_skills.py"
spec = importlib.util.spec_from_file_location("sync_skills", MODULE_PATH)
sync = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sync)


def fixture(root):
    for folder in ("", "frontend", "backend", "tools/docs"):
        p = root / folder / "AGENTS.md"
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text("# Orientações\n", encoding="utf-8")
    skill = root / ".agents/skills/tsi-tdd/SKILL.md"
    skill.parent.mkdir(parents=True)
    skill.write_text(
        "---\nname: tsi-tdd\ndescription: "
        + json.dumps("Aplicar TDD às regras do produto.", ensure_ascii=False)
        + "\n---\n\nEscrever um teste e observar a falha.\n",
        encoding="utf-8",
    )
    return skill


class SkillCompatibilityTests(unittest.TestCase):
    def test_check_detects_missing_adapters_without_writing_files(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            fixture(root)
            before = sorted(p.relative_to(root) for p in root.rglob("*") if p.is_file())
            errors = sync.synchronize(root, check_only=True)
            self.assertTrue(errors, "A verificação deve detectar os adaptadores ausentes.")
            self.assertEqual(
                before, sorted(p.relative_to(root) for p in root.rglob("*") if p.is_file())
            )


class SkillGenerationTests(unittest.TestCase):
    def test_generation_shares_content_and_preserves_metadata(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = fixture(root)
            self.assertEqual(sync.synchronize(root, check_only=False), [])
            target = root / ".claude/skills/tsi-tdd/SKILL.md"
            self.assertEqual(sync.metadata(source), sync.metadata(target))
            self.assertNotIn(
                "Escrever um teste e observar a falha.", target.read_text(encoding="utf-8")
            )
            link = next(
                sync.re.finditer(r"\[[^\]]*\]\(([^)]+)\)", target.read_text(encoding="utf-8"))
            )
            self.assertEqual((target.parent / link[1]).resolve(), source.resolve())
            self.assertEqual(sync.synchronize(root, check_only=True), [])
            for folder in sync.SCOPES:
                self.assertEqual(
                    (root / folder / "CLAUDE.md").read_text(encoding="utf-8"), "@AGENTS.md\n"
                )

    def test_source_description_change_requires_adapter_update(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = fixture(root)
            sync.synchronize(root, check_only=False)
            source.write_text(
                source.read_text(encoding="utf-8").replace("Aplicar TDD", "Executar TDD"),
                encoding="utf-8",
            )
            self.assertTrue(sync.synchronize(root, check_only=True))
            sync.synchronize(root, check_only=False)
            self.assertEqual(sync.synchronize(root, check_only=True), [])

    def test_invalid_identity_stops_generation_before_writing(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = fixture(root)
            source.write_text(
                source.read_text(encoding="utf-8").replace("name: tsi-tdd", "name: outro-nome"),
                encoding="utf-8",
            )
            with self.assertRaises(ValueError):
                sync.synchronize(root, check_only=False)
            self.assertFalse((root / ".claude").exists())
            self.assertFalse((root / "CLAUDE.md").exists())

    def test_missing_local_reference_is_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = fixture(root)
            source.write_text(
                source.read_text(encoding="utf-8") + "\n[Referência](inexistente.md)\n",
                encoding="utf-8",
            )
            with self.assertRaises(ValueError):
                sync.synchronize(root, check_only=False)
            self.assertFalse((root / ".claude").exists())

    def test_orphan_adapter_is_reported_without_deleting_it(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            fixture(root)
            orphan = root / ".claude/skills/local/SKILL.md"
            orphan.parent.mkdir(parents=True)
            orphan.write_text("Conteúdo local", encoding="utf-8")
            with self.assertRaises(ValueError):
                sync.synchronize(root, check_only=False)
            self.assertEqual(orphan.read_text(encoding="utf-8"), "Conteúdo local")


if __name__ == "__main__":
    unittest.main()
