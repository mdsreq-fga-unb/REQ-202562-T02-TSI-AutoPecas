"""Verifica destinos locais e âncoras, inclusive nos registros gerados como HTML."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
import json
import sys
from urllib.parse import unquote, urljoin, urlsplit


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.links = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('id'):
            self.ids.append(attrs['id'])
        self.links.extend(attrs[k] for k in ('href', 'src') if attrs.get(k))


def check(site, prefix=None):
    site = Path(site).resolve()
    if prefix is None:
        base = json.loads((Path(__file__).resolve().parents[1] / "data/backlog.json").read_text())
        prefix = "/" + base["repository"].split("/")[-1] + "/"
    pages = {}
    for file in site.rglob('*.html'):
        page = Page()
        page.feed(file.read_text(encoding='utf-8'))
        pages[file] = page
    if not pages:
        return ['Nenhuma página HTML encontrada.']
    errors = []
    for file, page in pages.items():
        name = file.relative_to(site).as_posix()
        for identifier, count in Counter(page.ids).items():
            if count > 1:
                errors.append(f'{name}: ID duplicado {identifier}')
        for value in page.links:
            if value.startswith(prefix):
                value = '/' + value[len(prefix):]
            parts = urlsplit(value)
            if parts.scheme or parts.netloc:
                continue
            target = urlsplit(urljoin('https://local/' + name, value))
            path = site / unquote(target.path).lstrip('/')
            if path.is_dir() or target.path.endswith('/'):
                path = path / 'index.html'
            if not path.is_file():
                errors.append(f'{name}: destino inexistente {value}')
            elif target.fragment and path.suffix == '.html' and unquote(target.fragment) not in pages[path.resolve()].ids:
                errors.append(f'{name}: âncora inexistente {value}')
    return errors


if __name__ == '__main__':
    problems = check(sys.argv[1] if len(sys.argv) > 1 else 'site')
    if problems:
        print('\n'.join(problems), file=sys.stderr)
        raise SystemExit(1)
    print('Links internos, âncoras e IDs verificados.')
