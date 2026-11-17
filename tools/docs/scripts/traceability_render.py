"""Visão textual derivada do catálogo, sem manter outra especificação."""
from html import escape


def catalog(identifier):
    return f'<a href="../requisitos-de-software/#{identifier.lower()}">{escape(identifier)}</a>'


def origin(identifier):
    return f'<a href="../solucao-e-caracteristicas/#{identifier.lower()}">{escape(identifier)}</a>'


def render_tree(base):
    stories = [s for s in base["stories"] if s["delivery"] == "MVP"]
    out = [
        '<div class="diagram-tables">',
        '<table class="diagram-table traceability-table--stories"><caption>Árvore textual do recorte vigente</caption><thead><tr>'
        '<th scope="col">OE principal</th><th scope="col">CP</th><th scope="col">Épico</th>'
        '<th scope="col">História</th><th scope="col">RF de origem</th>'
        '<th scope="col">RNFs aplicáveis</th></tr></thead><tbody>',
    ]
    for story in stories:
        oe = origin('OE' + story['oe']) if story.get('oe') else 'OE a definir'
        cp = origin(story['cp']) + '<span class="diagram-name">' + escape(base['characteristics'][story['cp']]) + '</span>'
        rnfs = '<span class="diagram-links">' + ''.join(catalog(rnf) for rnf in story['rnfs']) + '</span>' if story['rnfs'] else 'Nenhum vínculo registrado'
        out.append(
            '<tr data-tree-us="' + escape(story['us'], quote=True) + '"><td data-label="OE principal">' + oe
            + '</td><td data-label="CP">' + cp + '</td><td data-label="Épico">' + catalog(story['epic'])
            + '</td><td data-label="História">' + catalog(story['us'])
            + '<span class="diagram-name">' + escape(story['name']) + '</span>'
            + '</td><td data-label="RF de origem">' + catalog(story['id'])
            + '</td><td data-label="RNFs aplicáveis">' + rnfs + '</td></tr>'
        )
    out.extend([
        '</tbody></table>',
        '<table class="diagram-table traceability-table--rnfs"><caption>Origem dos RNFs e aplicação ao MVP</caption><thead><tr>'
        '<th scope="col">RNF</th><th scope="col">CP de origem</th>'
        '<th scope="col">Histórias condicionadas pelo RNF</th></tr></thead><tbody>',
    ])
    for rnf in base['non_functional']:
        cp = origin(rnf['cp']) if rnf['cp'] else 'CP a definir'
        applies = ''.join(catalog(s['us']) for s in stories if rnf['id'] in s['rnfs'])
        out.append('<tr><td data-label="RNF">' + catalog(rnf['id'])
                   + '</td><td data-label="CP de origem">' + cp
                   + '</td><td data-label="Histórias condicionadas">'
                   + ('<span class="diagram-links">' + applies + '</span>'
                      if applies else 'Nenhuma história do recorte') + '</td></tr>')
    out.append('</tbody></table></div>')
    return '\n'.join(out)
