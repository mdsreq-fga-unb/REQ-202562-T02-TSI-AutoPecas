"""Backlog: base versionada + campos das issues + evidências explícitas do GitHub.

Somente leitura na API. A coleta é atômica e a cópia local é descartável.
"""
from __future__ import annotations

import argparse
from copy import deepcopy
from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP
import json
import os
from pathlib import Path
import re
import sys
import unicodedata
import urllib.error
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "data/backlog.json"
CACHE = ROOT / ".cache/backlog/github.json"
WEIGHTS = {"Must Have": 3, "Should Have": 2, "Could Have": 1, "Won't Have": 0}
STATUSES = {"Não iniciado", "Em andamento", "Em revisão", "Bloqueado", "Concluído"}


class BacklogError(ValueError):
    pass


def normalize(value):
    return "".join(c for c in unicodedata.normalize("NFD", value.lower())
                   if unicodedata.category(c) != "Mn").strip()


def read_base(path=BASE):
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    validate_base(data)
    return data


def priority(values):
    et = int((sum(Decimal(values[k]) for k in ("ei", "ca", "lc")) / 3)
             .quantize(Decimal("1"), rounding=ROUND_HALF_UP))
    score = values["vn"] + WEIGHTS[values["moscow"]] - et
    quadrant = ("Q1" if et <= 2 else "Q2") if values["vn"] >= 3 else ("Q3" if et <= 2 else "Q4")
    return et, score, quadrant


def validate_base(data):
    epics = {e["id"]: e for e in data["epics"]}
    if len(epics) != len(data["epics"]):
        raise BacklogError("Épico duplicado na base.")
    rfs = {s["id"] for s in data["stories"]}
    uss = {s["us"] for s in data["stories"]}
    rnfs = {r["id"] for r in data["non_functional"]}
    if len(rfs) != len(data["stories"]) or len(uss) != len(rfs):
        raise BacklogError("RF ou US duplicado na base.")
    for story in data["stories"]:
        if not re.fullmatch(r"RF\d{2,}", story["id"]) or story["us"] != story["id"].replace("RF", "US", 1):
            raise BacklogError("Relação RF/US deve ser 1:1 e preservar o número.")
        epic = epics.get(story["epic"])
        if not epic or epic["cp"] != story["cp"]:
            raise BacklogError(f"Épico incompatível com a CP de {story['us']}.")
        if set(story["rnfs"]) - rnfs or set(identifiers(story["dependencies"], "RF")) - rfs:
            raise BacklogError(f"Vínculo inexistente em {story['us']}.")
        p = story["priority"]
        if p["moscow"] not in WEIGHTS or not 0 <= p["vn"] <= 4 or any(not 1 <= p[k] <= 4 for k in ("ei", "ca", "lc")):
            raise BacklogError(f"Pontuação inválida em {story['us']}.")
    if len(rnfs) != len(data["non_functional"]):
        raise BacklogError("RNF duplicado na base.")
    for rnf in data["non_functional"]:
        if rnf["cp"] and rnf["cp"] not in data["characteristics"]:
            raise BacklogError(f"CP inexistente em {rnf['id']}.")


def sections(body):
    result = {}
    names = {"identificacao da us", "rf de origem", "epico", "narrativa", "criterios de aceitacao",
             "a refinar", "rnfs aplicaveis", "dependencias", "situacao do desenvolvimento",
             "confirmacao de conclusao", "evidencia de conclusao", "objetivo", "cp de origem",
             "cp relacionado", "identificacao do epico", "us vinculadas"}
    matches = [m for m in re.finditer(r"^#{2,4}\s+(.+?)\s*$", body or "", re.M)
               if normalize(m[1]) in names]
    for index, match in enumerate(matches):
        key = normalize(match[1])
        if key in result:
            raise BacklogError(f"Seção duplicada na issue: {match[1]}.")
        end = matches[index + 1].start() if index + 1 < len(matches) else len(body)
        text = body[match.end():end].strip()
        result[key] = "" if text in ("_No response_", "_Sem resposta_", "Não informado") else text
    return result


def inline(body, label):
    match = re.search(r"^\*\*" + re.escape(label) + r":\*\*\s*(.+)$", body, re.M | re.I)
    return match[1].strip() if match else ""


def identifiers(text, prefix):
    return list(dict.fromkeys(prefix + (str(int(n)) if prefix in ("CP", "OE") else f"{int(n):02}") for n in re.findall(
        rf"\b{prefix}\s*0*(\d+)\b", text, re.I)))


def parse_story(issue):
    body = issue.get("body") or ""
    fields = sections(body)
    ids = identifiers(fields.get("identificacao da us", ""), "US") or identifiers(issue["title"], "US")
    if not ids:
        return None
    if len(ids) != 1:
        raise BacklogError(f"Issue #{issue['number']} identifica várias US.")
    form = "identificacao da us" in fields
    origin = fields.get("rf de origem", "") or inline(body, "Origem")
    rf = identifiers(origin, "RF")
    if len(rf) != 1 or rf[0].replace("RF", "US", 1) != ids[0]:
        raise BacklogError(f"Origem RF/US inválida na issue #{issue['number']}.")
    title_ids = identifiers(issue["title"], "US")
    if title_ids and title_ids != ids:
        raise BacklogError(f"Título e identificação divergem na issue #{issue['number']}.")
    narrative = fields.get("narrativa", "")
    if not narrative and not form:
        narrative = re.split(r"^\*\*Origem:", re.split(r"^###\s", body, maxsplit=1, flags=re.M)[0], maxsplit=1, flags=re.M)[0].strip()
    if form and not narrative:
        raise BacklogError(f"Narrativa obrigatória ausente na issue #{issue['number']}.")
    selected_epic = identifiers(fields.get("epico", ""), "EP")
    if form and len(selected_epic) != 1:
        raise BacklogError(f"Épico obrigatório ausente na issue #{issue['number']}.")
    status = fields.get("situacao do desenvolvimento", "")
    if status and status not in STATUSES:
        raise BacklogError(f"Situação inválida na issue #{issue['number']}.")
    rnfs_text = fields.get("rnfs aplicaveis", "") or inline(body, "RNFs")
    dependencies = fields.get("dependencias", "") or inline(body, "Dependências")
    return {"us": ids[0], "rf": rf[0], "number": issue["number"], "url": issue["html_url"],
            "title": issue["title"], "state": issue["state"], "state_reason": issue.get("state_reason"),
            "updated_at": issue["updated_at"], "narrative": narrative,
            "criteria": fields.get("criterios de aceitacao", ""),
            "refinement": fields.get("a refinar", ""), "dependencies": dependencies,
            "rnfs": identifiers(rnfs_text, "RNF") if rnfs_text else None,
            "epic": selected_epic[0] if selected_epic else None,
            "cp": (identifiers(origin, "CP") or [None])[0], "status": status,
            "done": bool(re.search(r"\[x\]", fields.get("confirmacao de conclusao", ""), re.I)),
            "completion_evidence": fields.get("evidencia de conclusao", ""),
            "assignees": [u["login"] for u in issue.get("assignees", [])],
            "milestone": (issue.get("milestone") or {}).get("title"),
            "labels": [l["name"] for l in issue.get("labels", [])], "structured": form}


class GitHub:
    def __init__(self, token=""):
        self.token = token

    def request(self, path, payload=None):
        url = path if path.startswith("https://api.github.com/") else "https://api.github.com/" + path.lstrip("/")
        if not url.startswith("https://api.github.com/"):
            raise BacklogError("Endpoint GitHub inválido.")
        headers = {"Accept": "application/vnd.github+json", "User-Agent": "tsi-backlog-readonly",
                   "X-GitHub-Api-Version": "2022-11-28"}
        if self.token:
            headers["Authorization"] = "Bearer " + self.token
        data = json.dumps(payload).encode() if payload is not None else None
        if data:
            headers["Content-Type"] = "application/json"
        req = urllib.request.Request(url, headers=headers, data=data)
        try:
            with urllib.request.urlopen(req, timeout=30) as response:
                result = json.load(response)
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            raise BacklogError(f"Falha ao consultar {urllib.parse.urlsplit(url).path}: {exc}") from exc
        if isinstance(result, dict) and result.get("errors"):
            raise BacklogError("Consulta ao Projects recusada ou inválida.")
        return result

    def pages(self, path):
        result = []
        for page in range(1, 501):
            values = self.request(path + ("&" if "?" in path else "?") + f"per_page=100&page={page}")
            if not isinstance(values, list):
                raise BacklogError("Resposta paginada inesperada do GitHub.")
            result.extend(values)
            if len(values) < 100:
                return result
        raise BacklogError("Paginação excedida; coleta incompleta não será publicada.")


def issue_references(text, repository):
    """Referências exatas; #27 não pode casar com #270 nem com outro repo."""
    refs = set()
    pattern = r"https://github\.com/([\w.-]+/[\w.-]+)/issues/(\d+)\b|(?<![\w/])([\w.-]+/[\w.-]+)?#(\d+)\b"
    for m in re.finditer(pattern, text or ""):
        refs.add((m[1] or m[3] or repository, int(m[2] or m[4])))
    return refs


def project_statuses(client, project):
    statuses = {}
    cursor = None
    query = """query($owner:String!,$number:Int!,$cursor:String){organization(login:$owner){projectV2(number:$number){items(first:100,after:$cursor){pageInfo{hasNextPage endCursor} nodes{content{... on Issue{number repository{nameWithOwner}}} fieldValueByName(name:"Status"){... on ProjectV2ItemFieldSingleSelectValue{name}}}}}}}"""
    while True:
        response = client.request("graphql", {"query": query, "variables": {"owner": project["owner"], "number": project["number"], "cursor": cursor}})
        try:
            items = response["data"]["organization"]["projectV2"]["items"]
        except (KeyError, TypeError) as exc:
            raise BacklogError("Project não encontrado ou token sem acesso de leitura.") from exc
        for item in items["nodes"]:
            content = item.get("content") or {}
            value = item.get("fieldValueByName") or {}
            if "number" in content and value.get("name"):
                statuses[f"{content['repository']['nameWithOwner']}#{content['number']}"] = value["name"]
        if not items["pageInfo"]["hasNextPage"]:
            return statuses
        cursor = items["pageInfo"]["endCursor"]


def collect(base, client, project_client=None):
    repo = base["repository"]
    all_items = client.pages(f"repos/{repo}/issues?state=all")
    known = {s["us"]: s for s in base["stories"]}
    parsed = {}
    epic_issues = {}
    for item in all_items:
        if "pull_request" in item:
            continue
        labels = [x["name"] for x in item.get("labels", [])]
        if "user-story" in labels or re.match(r"^US\s*\d+\b", item["title"], re.I) or "### Identificação da US" in (item.get("body") or ""):
            issue = parse_story(item)
            if not issue or issue["us"] not in known:
                raise BacklogError(f"História não cadastrada na base: issue #{item['number']}.")
            if issue["us"] in parsed:
                raise BacklogError(f"US duplicada: {issue['us']} possui mais de uma issue.")
            expected = known[issue["us"]]
            if issue["epic"] and issue["epic"] != expected["epic"]:
                raise BacklogError(f"Épico da issue #{issue['number']} diverge do vínculo da base.")
            if issue["cp"] and issue["cp"] != expected["cp"]:
                raise BacklogError(f"CP da issue #{issue['number']} diverge da origem do RF.")
            if issue["rnfs"] is not None and set(issue["rnfs"]) - {r["id"] for r in base["non_functional"]}:
                raise BacklogError(f"RNF inexistente na issue #{issue['number']}.")
            issue["parent"] = None
            parsed[issue["us"]] = issue
        ep_fields = sections(item.get("body") or "")
        ids = identifiers(ep_fields.get("identificacao do epico", ""), "EP") or identifiers(item["title"], "EP")
        if ids:
            if len(ids) != 1 or ids[0] not in {e["id"] for e in base["epics"]} or ids[0] in epic_issues:
                raise BacklogError("Identificação de épico duplicada ou desconhecida nas issues.")
            ep_cps = identifiers(ep_fields.get("cp de origem", ep_fields.get("cp relacionado", "")), "CP")
            expected = next(e for e in base["epics"] if e["id"] == ids[0])
            if ep_cps and ep_cps != [expected["cp"]]:
                raise BacklogError(f"CP divergente no épico {ids[0]}.")
            epic_issues[ids[0]] = {"number": item["number"], "url": item["html_url"], "objective": ep_fields.get("objetivo", "")}
    number_to_us = {i["number"]: us for us, i in parsed.items()}
    for epic, item in epic_issues.items():
        for child in client.pages(f"repos/{repo}/issues/{item['number']}/sub_issues"):
            us = number_to_us.get(child["number"])
            if us:
                if known[us]["epic"] != epic:
                    raise BacklogError(f"Parentesco de {us} diverge do épico previsto.")
                parsed[us]["parent"] = epic
    pulls = {}
    associations = {us: set() for us in parsed}
    for source in base["implementation_repositories"]:
        if not re.fullmatch(r"[\w.-]+/[\w.-]+", source):
            raise BacklogError("Repositório de implementação inválido.")
        for pr in client.pages(f"repos/{source}/pulls?state=all"):
            key = f"{source}#{pr['number']}"
            refs = issue_references(pr.get("body") or "", source)
            pulls[key] = (source, pr)
            for number, us in number_to_us.items():
                if (repo, number) in refs:
                    associations[us].add(key)
    for us, issue in parsed.items():
        for event in client.pages(f"repos/{repo}/issues/{issue['number']}/timeline"):
            src = (event.get("source") or {}).get("issue") or {}
            if event.get("event") == "cross-referenced" and "pull_request" in src:
                url = src.get("html_url", "")
                match = re.fullmatch(r"https://github.com/([\w.-]+/[\w.-]+)/pull/(\d+)", url)
                key = f"{match[1]}#{match[2]}" if match else ""
                if key in pulls:
                    associations[us].add(key)
    evidence = {us: {"pulls": [], "commits": []} for us in parsed}
    for key in sorted(set().union(*associations.values()) if associations else []):
        source, pr = pulls[key]
        detail = client.request(f"repos/{source}/pulls/{pr['number']}")
        commits = client.pages(f"repos/{source}/pulls/{pr['number']}/commits")
        proof = {"number": pr["number"], "url": pr["html_url"], "repository": source,
                 "title": pr["title"], "state": "Integrado" if detail.get("merged_at") else "Aberto" if pr["state"] == "open" else "Fechado sem integração"}
        for us, keys in associations.items():
            if key in keys:
                evidence[us]["pulls"].append(proof)
                evidence[us]["commits"].extend({"sha": c["sha"], "url": c["html_url"], "repository": source} for c in commits)
    created = [i["created_at"] for i in all_items if i["number"] in number_to_us]
    if created:
        since = urllib.parse.quote(min(created), safe="")
        for source in base["implementation_repositories"]:
            for commit in client.pages(f"repos/{source}/commits?since={since}"):
                refs = issue_references(commit["commit"]["message"], source)
                for number, us in number_to_us.items():
                    if (repo, number) in refs:
                        evidence[us]["commits"].append({"sha": commit["sha"], "url": commit["html_url"], "repository": source})
    for proof in evidence.values():
        proof["commits"] = list({(c["repository"], c["sha"]): c for c in proof["commits"]}.values())
    statuses = project_statuses(project_client, base["project"]) if project_client else {}
    return {"schema_version": 1, "repository": repo, "fetched_at": datetime.now(timezone.utc).isoformat(),
            "stories": parsed, "epics": epic_issues, "evidence": evidence,
            "project_statuses": statuses, "project_enabled": project_client is not None}


def merge(base, snapshot=None):
    data = deepcopy(base)
    if snapshot and snapshot.get("repository") != base["repository"]:
        raise BacklogError("Snapshot pertence a outro repositório.")
    issues = (snapshot or {}).get("stories", {})
    for rnf in data["non_functional"]:
        rnf["applies_to"] = [s["id"] for s in data["stories"] if rnf["id"] in s["rnfs"]]
    for story in data["stories"]:
        issue = issues.get(story["us"])
        story["dependency_ids"] = identifiers(story["dependencies"], "RF")
        story.update(issue=issue, warnings=[], narrative="", criteria="", refinement="",
                     status=story["planned_status"], status_source="Planejamento registrado",
                     evidence=(snapshot or {}).get("evidence", {}).get(story["us"], {"pulls": [], "commits": []}))
        outside = [s['us'] for s in data['stories'] if s['id'] in story['dependency_ids'] and s['delivery'] != 'MVP']
        if story['delivery'] == 'MVP' and outside:
            story['warnings'].append('Dependência do planejamento fora do MVP: ' + ', '.join(outside) + '. Revisar o recorte antes de implementar.')
        if not issue:
            continue
        for field in ("narrative", "criteria", "refinement"):
            story[field] = issue[field]
        if issue.get("parent") is None:
            story["warnings"].append("A issue ainda não está vinculada ao épico como sub-issue.")
        if issue.get("rnfs") is not None and set(issue["rnfs"]) != set(story["rnfs"]):
            story["warnings"].append("RNFs informados na issue divergem dos vínculos aprovados; revisar antes de alterar a base.")
        if issue.get("dependencies") and re.search(r"autentic|login", normalize(issue["dependencies"])) and story["delivery"] == "MVP":
            story["warnings"].append("A issue menciona autenticação, que permanece fora do MVP no planejamento aprovado.")
        known_us = {s["us"] for s in data["stories"]}
        mentioned = identifiers(issue.get("dependencies", ""), "US")
        if set(mentioned) - known_us:
            story["warnings"].append("A issue cita dependência em uma US inexistente na base.")
        outside = [s['us'] for s in data['stories'] if s['us'] in mentioned and s['delivery'] != 'MVP']
        if story['delivery'] == 'MVP' and outside:
            story['warnings'].append('A issue depende de história fora do MVP: ' + ', '.join(outside) + '.')
        project = (snapshot or {}).get("project_statuses", {}).get(f"{base['repository']}#{issue['number']}")
        project_map = {"todo": "Não iniciado", "backlog": "Não iniciado", "in progress": "Em andamento", "in review": "Em revisão", "done": "Concluído", "blocked": "Bloqueado"}
        status = project_map.get(normalize(project), project) if project else issue.get("status")
        if status:
            if status not in STATUSES:
                story["warnings"].append(f"Status do Projects não reconhecido: {status}.")
                story["status"] = "Situação não informada"
            elif status == "Concluído" and not (issue.get("done") and re.search(r"https://", issue.get("completion_evidence", ""))):
                story["status"] = "Conclusão a confirmar"
                story["warnings"].append("Conclusão indicada sem confirmação da DoD e link de evidência; não contabilizada como concluída.")
            else:
                story["status"] = status
            story["status_source"] = "GitHub Projects" if project else "Issue"
        elif issue["state"] == "closed":
            story["status"] = "Encerrada sem conclusão confirmada"
            story["status_source"] = "GitHub Issues"
        elif story["evidence"]["pulls"]:
            story["status"] = "Em revisão" if any(p["state"] == "Aberto" for p in story["evidence"]["pulls"]) else "Implementação registrada"
            story["status_source"] = "Evidências do GitHub; aceite não inferido"
        elif story["evidence"]["commits"]:
            story["status"] = "Em andamento"
            story["status_source"] = "Commits vinculados"
    return data


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=["sync", "check"])
    parser.add_argument("--data", type=Path, default=BASE)
    parser.add_argument("--cache", type=Path, default=CACHE)
    args = parser.parse_args()
    try:
        base = read_base(args.data)
        if args.command == "sync":
            client = GitHub(os.environ.get("GITHUB_TOKEN", ""))
            project_token = os.environ.get("BACKLOG_PROJECT_TOKEN", "")
            snapshot = collect(base, client, GitHub(project_token) if project_token else None)
            merge(base, snapshot)
            args.cache.parent.mkdir(parents=True, exist_ok=True)
            temporary = args.cache.with_suffix(".tmp")
            temporary.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            temporary.replace(args.cache)
            print(f"Coleta concluída: {len(snapshot['stories'])} issues de US; {len(base['stories'])} registros preservados.")
        else:
            snapshot = json.loads(args.cache.read_text()) if args.cache.exists() else None
            merge(base, snapshot)
            print(f"Base válida: {len(base['stories'])} USs, {len(base['epics'])} épicos e {len(base['non_functional'])} RNFs.")
    except (BacklogError, OSError, KeyError) as exc:
        print(f"Backlog: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
