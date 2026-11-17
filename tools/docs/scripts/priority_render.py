"""Projeção acessível da matriz VN × ET a partir do catálogo único."""
from html import escape

from scripts.backlog import priority


def render_matrix(base):
    groups = {key: [] for key in ('Q1', 'Q2', 'Q3', 'Q4')}
    for story in base['stories']:
        effort, score, quadrant = priority(story['priority'])
        us = escape(story['us'], quote=True)
        label = ('VN ' + str(story['priority']['vn'])
                 + ', ET ' + str(effort) + ', Score ' + str(score)
                 + '; ' + escape(story['delivery']))
        groups[quadrant].append(
            f'<li><a data-matrix-us="{us}" data-quadrant="{quadrant}" '
            f'href="../requisitos-de-software/#{us.lower()}">{us}<span class="diagram-name">{label}</span></a></li>'
        )
    ranges = {
        'Q1': 'VN 3–4; ET 0–2', 'Q2': 'VN 3–4; ET 3–4',
        'Q3': 'VN 0–2; ET 0–2', 'Q4': 'VN 0–2; ET 3–4',
    }
    out = [
        '<div class="diagram-tables"><table class="diagram-table priority-matrix-table"><caption>Matriz textual de valor de negócio e esforço técnico</caption>'
        '<thead><tr><th scope="col">Quadrante</th><th scope="col">Faixas dos eixos</th>'
        '<th scope="col">Histórias e posição vigente</th></tr></thead><tbody>',
    ]
    for quadrant, stories in groups.items():
        entries = '<ul class="priority-matrix-stories">' + ''.join(stories) + '</ul>' if stories else 'Nenhuma história'
        out.append('<tr><th scope="row" data-label="Quadrante">' + quadrant
                   + '</th><td data-label="Faixas dos eixos">' + ranges[quadrant]
                   + '</td><td data-label="Histórias">' + entries + '</td></tr>')
    out.append('</tbody></table></div>')
    return '\n'.join(out)
