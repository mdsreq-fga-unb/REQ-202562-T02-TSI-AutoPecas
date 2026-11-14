"""Uma única apresentação, compacta e sem cópia manual dos campos das issues."""
from html import escape, unescape
import re

from scripts.backlog import WEIGHTS, priority


def link(url, label):
    if not (url.startswith("https://") or url.startswith("../") or url.startswith("#")):
        return escape(label)
    return f'<a href="{escape(url, quote=True)}">{escape(label)}</a>'


def ref(identifier):
    if identifier.startswith("CP"):
        return link("../solucao-e-caracteristicas/#" + identifier.lower(), identifier)
    if identifier.startswith("OE"):
        return link("../solucao-e-caracteristicas/#" + identifier.lower(), identifier)
    return link("#" + identifier.lower(), identifier)


def text(value):
    # O corpo de uma issue é dado, nunca HTML, código ou comando executável.
    value = re.sub(r"\[([^\]]+)\]\((https://[^\s)]+)\)", r"\1 (\2)", value or "")
    result = []
    for token in re.split(r"(https://[^\s<>]+|\b(?:RF|US|EP|CP|OE|RNF)\d{1,3}\b)", value):
        if token.startswith("https://"):
            result.append(link(token.rstrip(".,)"), token.rstrip(".,)")) + escape(token[len(token.rstrip(".,)")):]))
        elif re.fullmatch(r"(?:RF|US|EP|CP|OE|RNF)\d{1,3}", token):
            result.append(ref(token))
        else:
            safe = escape(token)
            safe = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", safe)
            result.append(safe)
    return "".join(result)


def paragraphs(value, missing="Não informado."):
    return "".join('<p>' + text(p).replace("\n", "<br>") + '</p>'
                   for p in re.split(r"\n\s*\n", value or missing) if p.strip())


def row(label, value):
    return f'<div class="backlog-row"><dt>{escape(label)}</dt><dd>{value}</dd></div>'


def chip(label, kind=""):
    return f'<span class="req-chip {escape(kind)}">{escape(label)}</span>'


def aliases(*ids):
    return "".join(f'<span id="{escape(i)}" class="backlog-anchor"></span>' for i in ids)


def render_story(story):
    p = story["priority"]
    et, score, quadrant = priority(p)
    us, rf = story["us"], story["id"]
    issue = story["issue"]
    cut = story["delivery"]
    badges = chip(cut, "req-chip--mvp" if cut == "MVP" else "req-chip--condicionado" if cut == "Condicionado" else "") + chip(story["status"])
    if not issue:
        badges += chip("Sem issue")
    search = escape(" ".join([us, rf, story["name"], story["cp"], story["epic"]]), quote=True)
    attributes = {
        "cut": cut, "epic": story["epic"], "status": story["status"],
        "sprint": str(story["sprint"]) if story["sprint"] is not None else "none",
        "rnfs": " ".join(story["rnfs"]), "moscow": p["moscow"], "quadrant": quadrant,
        "issue": "linked" if issue else "missing",
        "detail": "described" if story["narrative"].strip() and story["criteria"].strip() else "incomplete",
        "refining": "yes" if story["refinement"].strip() else "no",
        "warning": "yes" if story["warnings"] else "no",
        "evidence": " ".join(k for k, key in [("pr", "pulls"), ("commit", "commits")] if story["evidence"][key]),
    }
    metadata = " ".join(f'data-{key}="{escape(value, quote=True)}"' for key, value in attributes.items())
    out = [f'<details class="req-record" id="{rf.lower()}" {metadata} data-search="{search}">',
           f'<summary><span class="req-record__id">{us} <small class="backlog-rf-origin">({rf})</small></span><span class="req-record__name">{escape(story["name"])}</span><span class="req-record__chips">{badges}</span></summary>',
           '<div class="req-record__body">', aliases(us.lower()),
           '<dl class="backlog-facts">' + row("Origem", ref(rf) + " · " + ref(story["cp"]) + " · " + ref(story["epic"]))]
    if story.get("oe"):
        out.append(row("Objetivo", ref("OE" + story["oe"])))
    sprint = link("../cronograma-e-entregas/#sprint-" + str(story["sprint"]), "Sprint " + str(story["sprint"])) if story["sprint"] is not None else "Sem sprint atribuída"
    out.extend([row("Planejamento", sprint + " · " + escape(cut)),
                row("Situação", escape(story["status"]) + f' <small>({escape(story["status_source"])})</small>'), '</dl>'])
    out.append('<section class="backlog-text"><p class="backlog-label">Narrativa da US</p>' + paragraphs(story["narrative"], "Narrativa ainda não detalhada" if not issue else "Narrativa não informada na issue") + '</section>')
    out.append('<section class="backlog-text"><p class="backlog-label">Declaração de origem - ' + rf + '</p>' + paragraphs(story["declaration"]) + '</section>')
    out.append('<section class="backlog-text"><p class="backlog-label">Critérios de aceitação</p>' + paragraphs(story["criteria"], "A definir no refinamento, conforme a DoR.") + '</section>')
    out.append('<dl class="backlog-facts">' + row("RNFs", " · ".join(ref(i) for i in story["rnfs"]) or "Nenhum vínculo registrado"))
    out.append(row("Dependências", text(re.sub(r"\bRF(\d{2,})\b", r"US\1", story["dependencies"]))))
    if issue and issue.get("dependencies") and issue["dependencies"].casefold().rstrip(".") != story["dependencies"].casefold().rstrip("."):
        out.append(row("Issue: dependências", text(re.sub(r"\bRF(\d{2,})\b", r"US\1", issue["dependencies"]))))
    if issue and issue.get("rnfs") is not None and set(issue["rnfs"]) != set(story["rnfs"]):
        out.append(row("Issue: RNFs", " · ".join(ref(i) for i in issue["rnfs"]) or "Nenhum informado"))
    out.append('</dl>')
    out.append('<section class="backlog-priority"><p class="backlog-label">Priorização</p>'
               f'<p class="backlog-score">VN {p["vn"]} + {escape(p["moscow"])} ({WEIGHTS[p["moscow"]]}) - ET {et} = <strong>Score {score}</strong> · <strong>{quadrant}</strong></p>'
               f'<p><small>ET = arred(({p["ei"]} + {p["ca"]} + {p["lc"]}) / 3) = {et}. Notas: EI {p["ei"]}, CA {p["ca"]}, LC {p["lc"]}. '
               + link('../priorizacao/', 'Critérios e escalas') + '</small></p>'
               + (paragraphs(story['priority_note']) if story.get('priority_note') else '')
               + ('<dl class="backlog-facts">' + row('Decisão de entrega', text(story['delivery_reason'])) + '</dl>'
                  if story.get('delivery_reason') else '') + '</section>')
    out.append('<section class="backlog-text"><p class="backlog-label">A refinar</p>' + paragraphs(story["refinement"], "Detalhamento pendente" if not issue else "Nenhum ponto informado na issue") + '</section>')
    if story["warnings"]:
        out.append('<aside class="backlog-pending"><strong>Alinhamentos pendentes</strong><ul>' + ''.join('<li>' + text(w) + '</li>' for w in story["warnings"]) + '</ul></aside>')
    proofs = story["evidence"]
    out.append('<dl class="backlog-facts backlog-tracking">')
    if issue:
        out.append(row("GitHub", link(issue["url"], "Issue #" + str(issue["number"])) + ' · ' + ("Aberta" if issue["state"] == "open" else "Encerrada")))
        out.append(row("Responsáveis", ', '.join(escape(a) for a in issue['assignees']) or 'Não atribuídos'))
        if issue.get("milestone"):
            out.append(row("Marco", escape(issue["milestone"])))
        if issue.get("completion_evidence"):
            out.append(row("Aceite / DoD", text(issue["completion_evidence"])))
    else:
        out.append(row("GitHub", "Issue ainda não vinculada"))
    out.append(row("PRs", '<span class="backlog-links">' + (' · '.join(link(p["url"], '#' + str(p["number"]) + ' - ' + p["state"]) for p in proofs["pulls"]) or 'Nenhum vínculo registrado') + '</span>'))
    out.append(row("Commits", '<span class="backlog-links">' + (' · '.join(link(c["url"], c["sha"][:7]) for c in proofs["commits"]) or 'Nenhum vínculo registrado') + '</span>'))
    out.append('</dl>')
    if story["history"]:
        out.append('<details class="backlog-history"><summary>Evolução do registro</summary><ul>' + ''.join('<li>' + text(h.lstrip('- ')) + '</li>' for h in story['history']) + '</ul></details>')
    out.append('</div></details>')
    return '\n'.join(out)


def render_rnf(rnf):
    cp = rnf["cp"]
    out = [f'<details class="req-record req-record--rnf" id="{rnf["anchor"]}">',
           '<summary><span class="req-record__id">' + rnf["id"] + '</span><span class="req-record__name">' + escape(rnf["name"]) + '</span><span class="req-record__chips">' + chip(cp or "CP a definir") + '</span></summary>',
           '<div class="req-record__body">', aliases(rnf["id"].lower()), paragraphs(rnf["declaration"]),
           '<section class="backlog-priority"><p class="backlog-label">Critério verificável</p>' + paragraphs(rnf["criterion"]) + '</section>',
           '<dl class="backlog-facts">', row("Classificação", escape(rnf["classification"])),
           row("CP de origem", ref(cp) if cp else 'Pendente de definição no refinamento'),
           row("Aplica-se a", '<span class="backlog-links">' + ' · '.join(ref(x.replace('RF', 'US', 1)) for x in rnf['applies_to']) + '</span>'),
           '</dl></div></details>']
    return '\n'.join(out)



def select_filter(key, label, options, empty="Todos"):
    choices = '<option value="">' + escape(empty) + '</option>'
    choices += ''.join(f'<option value="{escape(value, quote=True)}">{escape(title)}</option>' for value, title in options)
    alias = ' data-backlog-cut' if key == 'cut' else ''
    return (f'<label>{escape(label)}<select data-backlog-filter="{key}"{alias}>'
            + choices + '</select></label>')


def render_controls(data):
    statuses = ["Não iniciado", "Em andamento", "Em revisão", "Bloqueado", "Concluído"]
    statuses += sorted({s["status"] for s in data["stories"]} - set(statuses))
    sprints = sorted({s["sprint"] for s in data["stories"] if s["sprint"] is not None})
    primary = [
        '<label class="backlog-search-label">Buscar<input type="search" data-backlog-search placeholder="ID, nome ou conteúdo" aria-label="Buscar histórias pelo ID, nome ou conteúdo"></label>',
        select_filter("cut", "Entrega", [(v, v) for v in ["MVP", "Condicionado", "Evolução futura"]], "Todas"),
        select_filter("epic", "Épico", [(e["id"], e["id"] + ' - ' + e["name"]) for e in data["epics"]]),
        select_filter("status", "Situação", [(v, v) for v in statuses], "Todas"),
    ]
    advanced = [
        select_filter("sprint", "Sprint", [(str(n), 'Sprint ' + str(n)) for n in sprints] + [("none", "Sem sprint atribuída")], "Todas"),
        select_filter("rnf", "RNF vinculado", [(r["id"], r["id"] + ' - ' + r["name"]) for r in data["non_functional"]]),
        select_filter("moscow", "MoSCoW", [(v, v) for v in WEIGHTS]),
        select_filter("quadrant", "Quadrante", [(v, v) for v in ["Q1", "Q2", "Q3", "Q4"]]),
        select_filter("issue", "Issue no GitHub", [("linked", "Com issue vinculada"), ("missing", "Sem issue vinculada")]),
        select_filter("detail", "Detalhamento", [("described", "Narrativa e critérios preenchidos"), ("incomplete", "Narrativa ou critérios pendentes"), ("refining", "Com anotação em A refinar")]),
        select_filter("warning", "Alinhamentos", [("yes", "Com alertas de alinhamento"), ("no", "Sem alertas detectados")]),
        select_filter("evidence", "Evidências", [("pr", "Com PR vinculado"), ("commit", "Com commit vinculado"), ("none", "Sem PR ou commit vinculado")]),
    ]
    return ('<div class="catalog-controls backlog-controls"><div class="backlog-filter-grid backlog-filter-primary">'
            + ''.join(primary) + '</div><details class="backlog-filter-options"><summary>Mais filtros<span data-backlog-extra-count></span></summary>'
            + '<div class="backlog-filter-grid">' + ''.join(advanced) + '</div></details>'
            + '<div class="backlog-filter-actions"><button type="button" class="catalog-toggle">Expandir registros</button>'
            + '<button type="button" data-backlog-reset>Limpar filtros</button>'
            + f'<output data-backlog-count aria-live="polite">{len(data["stories"])} de {len(data["stories"])} histórias</output></div>'
            + '<p class="backlog-filter-hint">Combine os filtros para localizar histórias. Os RNFs permanecem disponíveis abaixo.</p></div>')


def render_catalog(data, snapshot):
    stories = data["stories"]
    counts = {cut: sum(s["delivery"] == cut for s in stories) for cut in ("MVP", "Condicionado", "Evolução futura")}
    out = ['<div class="backlog-catalog" markdown="1">', aliases('81-conteudo-de-cada-registro', 'conteudo-de-cada-registro', '82-papel-das-declaracoes-rf-us-caso-de-uso-e-cenario', 'papel-das-declaracoes-rf-us-caso-de-uso-e-cenario', 'papel-das-declaracoes-rf-e-us', '83-indice-dos-registros', 'indice-dos-registros'),
           f'<p class="backlog-overview"><strong>{len(stories)} histórias</strong> · {counts["MVP"]} no MVP · {counts["Condicionado"]} condicionadas · {counts["Evolução futura"]} como evolução futura. '
           + (f'Dados do GitHub consultados em <time datetime="{escape(snapshot["fetched_at"])}">{escape(snapshot["fetched_at"].replace("T", " ").split(".")[0])} UTC</time>.' if snapshot else 'GitHub ainda não consultado nesta cópia local; os campos remotos estão identificados como pendentes.') + '</p>',
           render_controls(data),
           '<p data-backlog-empty hidden>Nenhuma história corresponde aos filtros.</p>',
           aliases('84-registros-dos-requisitos-funcionais', '103-epicos-do-incremento', 'epicos-do-incremento', '104-quadro-de-acompanhamento-da-entrega', 'quadro-de-acompanhamento-da-entrega'),
           '<h2 id="registros-dos-requisitos-funcionais">Épicos e histórias de usuário</h2>']
    for epic in data["epics"]:
        group = [s for s in stories if s["epic"] == epic["id"]]
        done = sum(s['status'] == 'Concluído' for s in group)
        remote = (snapshot or {}).get('epics', {}).get(epic['id'])
        out.extend([f'<section class="backlog-epic" data-backlog-epic markdown="1"><h3 id="{epic["id"].lower()}">{epic["id"]} - {escape(epic["name"])}</h3>',
                    '<p class="backlog-epic-meta">Origem: ' + ref(epic['cp']) + ' - ' + escape(data['characteristics'][epic['cp']]) + f' · {done}/{len(group)} histórias concluídas · {sum(s["delivery"] == "MVP" for s in group)} no MVP'
                    + (' · ' + link(remote['url'], 'Issue #' + str(remote['number'])) if remote else ' · Épico ainda sem issue vinculada') + '</p>',
                    paragraphs(remote.get('objective', '') if remote else '', 'Objetivo do épico a detalhar; capacidade de origem disponível na CP.'),
                    *[render_story(s) for s in group], '</section>'])
    out.extend([aliases('85-registros-dos-requisitos-nao-funcionais'), '<h2 id="registros-dos-requisitos-nao-funcionais">Requisitos não funcionais</h2>', '<p>CP7 e CP8 são detalhadas pelas condições de qualidade abaixo. Seus vínculos apontam para as histórias da mesma lista.</p>'])
    for cp in ['CP7', 'CP8', None]:
        out.append(f'<h3 id="rnfs-da-{cp.lower()}">{cp} - {escape(data["characteristics"][cp])}</h3>' if cp else '<h3 id="rnf-com-origem-a-definir">Origem de CP a definir</h3>')
        out.extend(render_rnf(r) for r in data['non_functional'] if r['cp'] == cp)
    scope = data['scope']
    out.extend([aliases('10-definicao-e-composicao-do-mvp', 'definicao-e-composicao-do-mvp'), '<h2 id="objetivo-do-incremento">Recorte e validação do MVP</h2>', aliases('101-objetivo-do-incremento'), paragraphs(scope['objective']), paragraphs(scope['success']), '<p>Objetivos atendidos: ' + ' · '.join(ref(i) for i in scope['objectives']) + '.</p>', '<details class="backlog-scope"><summary>Justificativa, limites e validação do recorte</summary>', aliases('102-justificativa-do-recorte', 'justificativa-do-recorte'), '<dl class="backlog-facts">'])
    out.extend(row(a, text(b)) for a, b in scope['rationale'])
    out.extend(['</dl>', paragraphs(scope['limits']), aliases('105-validacao-do-mvp', 'validacao-do-mvp'), '<dl class="backlog-facts">'])
    out.extend(row(a, text(b)) for a, b in scope['validation'])
    out.extend(['</dl></details>', aliases('106-pontos-em-aberto-do-recorte'), '<h3 id="pontos-em-aberto-do-recorte">Pontos em aberto do recorte</h3>', '<ul>' + ''.join('<li>' + text(v) + '</li>' for v in scope['pending']) + '</ul>', '</div>'])
    output = '\n\n'.join(out)
    return re.sub(r'<h([23]) id="([^"]+)">(.*?)</h\1>',
                  lambda m: '\n\n' + '#' * int(m[1]) + ' ' + unescape(m[3]) + ' {#' + m[2] + '}\n\n', output)
