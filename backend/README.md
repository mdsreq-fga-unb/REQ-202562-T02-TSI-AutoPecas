# API da TSI Peças

Python 3.13, FastAPI e uv. Execute os comandos a partir de `backend/`.

```bash
uv sync --locked
cp .env.example .env
uv run alembic upgrade head
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

No PowerShell, use `Copy-Item .env.example .env` para copiar o exemplo.
A API atende em <http://localhost:8000/health> e a documentação OpenAPI em
<http://localhost:8000/docs>.

Configure `DATABASE_URL` antes da migração. Para usar o PostgreSQL local, execute
`docker compose up -d database` na raiz; o exemplo de ambiente conecta à porta
5433. O Compose completo aplica as migrações antes de iniciar a API.

```bash
uv run pytest
uv run ruff check .
uv run ruff format --check .
```

Para gerar cobertura por linhas e ramificações:

```bash
uv run pytest --cov --cov-report=term-missing --cov-report=html --cov-report=xml
```

Os relatórios ficam em `coverage/html/index.html` e `coverage/coverage.xml`.
Eles são publicados como artefatos da CI e ignorados pelo Git. Não há percentual
mínimo definido; revise as lacunas dos comportamentos exigidos pela história.

A organização segue `routers` (HTTP), `services` (regras), `repositories` (dados)
e `models`/`schemas` (persistência e contratos). `core` reúne configuração,
conexões e erros compartilhados. `/health` confirma a aplicação, sem consultar
o banco. Sem `DATABASE_URL`, o cadastro responde 503 e `/health` continua disponível.

## Persistência e cadastro de peças

A US01 (issue #27) usa SQLAlchemy 2, driver psycopg e migrações Alembic para
PostgreSQL/Supabase. Os serviços controlam a transação; os repositórios concentram
as consultas. Não há criação automática de tabelas ao iniciar a API.

| Rota | Contrato |
| --- | --- |
| `POST /parts` | JSON de cadastro e cabeçalho `Idempotency-Key` UUID; retorna 201 |
| `GET /parts?offset=0&limit=20` | Lista paginada com `items` e `total`; limite de 1 a 100 |
| `GET /parts/{id}` | Consulta uma peça salva, ou retorna 404 |
| `PATCH /parts/{id}` | JSON dos campos editáveis e `Idempotency-Key` UUID; retorna 200 |
| `GET /parts/{id}/photo` | Retorna a imagem validada, ou 404 quando ausente |

Código do fabricante, nome e categoria são obrigatórios. Descrição técnica,
localização física, códigos equivalentes e foto são opcionais. Consulte os
campos e limites no OpenAPI. A foto é enviada como data URL em `photo_data`.

O recorte segue as regras do PR #63 autorizadas para esta implementação:
códigos principais e equivalentes compartilham uma restrição de unicidade em
`part_codes`. Conflitos retornam 409 com a peça existente, sem sobrescrever dados.
Espaços nas extremidades são removidos; não há conversão de maiúsculas, pontuação
ou códigos de fabricantes. Perfis de acesso e exclusão ficam fora desta entrega.
As rotas atuais não exigem autenticação.

Peça, códigos, foto e resposta idempotente são gravados na mesma transação.
`part_creation_requests` guarda a chave, a impressão dos dados e o resultado.
Reenviar a mesma chave com os mesmos dados devolve a resposta original, inclusive
após reinício; usar a chave com outros dados retorna 409. Uma falha antes do commit
desfaz toda a operação. A restrição de unicidade protege também a inserção que
encontre um conflito após a consulta inicial.

A foto fica em uma coluna binária carregada apenas quando solicitada. Essa escolha
mantém a gravação atômica neste recorte; uma futura migração para armazenamento
de objetos deve tratar a consistência entre arquivo e registro. O limite técnico
atual é de 2 MiB e 12 megapixels, em JPEG, PNG ou WebP. Pillow verifica o conteúdo
e reencodifica a imagem para remover metadados. Esses limites são de implementação,
não uma nova decisão de escopo do cliente.

Os testes usam banco SQLite descartável criado pela migração real. Cobrem campos
obrigatórios, foto, colisões entre códigos, rollback e repetição após reinício.
SQLite não substitui a verificação de concorrência e implantação em PostgreSQL.

## Evidências da implementação da US01

Verificação local em 11/11/2026, vinculada à issue #27:

- `pytest --cov --cov-report=term-missing`: 29 testes aprovados com Python 3.13;
  a migração real cria cada banco descartável. Cobertura combinada de linhas e
  ramificações: 95%, sem um mínimo definido pelo projeto.
- `ruff check .` e `ruff format --check .`: aprovados.
- `alembic check`: sem diferenças entre modelos e migração, em SQLite.
- `alembic upgrade head --sql`: SQL PostgreSQL gerado sem conexão remota.
- `docker compose config --quiet`: configuração válida. O serviço Docker estava
  inativo; build de contêineres, execução PostgreSQL e concorrência real nesse
  banco ainda precisam ser conferidos.

O ciclo inicial observou 22 testes de cadastro falhando com 404 antes das rotas
serem implementadas; depois ficaram verdes. Os testes adicionais de migração,
rollback e reinício reforçam a verificação posterior, sem constituir evidência
retroativa de TDD. Permanecem lacunas em erros de foto ausente, limites de pixels
e disputa simultânea da mesma chave. Há um aviso de depreciação de `httpx` pelo
TestClient do Starlette. Revisão por outro integrante e aceite do cliente pendentes.

## Edição de peças — US05 (Refs #31)

O recorte confirmado pelo solicitante em 12/11/2026 permite editar nome, categoria,
equivalentes, localização, descrição e foto, preservando o código do fabricante.
Aplicações por veículo e dados fiscais ficam fora deste incremento. Os critérios
e RNFs vêm da [issue #31](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/31).

`PATCH /parts/{id}` altera o mesmo registro. Campos omitidos são preservados;
nome e categoria não aceitam vazio ou `null`. `equivalent_codes` substitui a lista,
inclusive por `[]`, sem permitir repetições ou colisões com outras peças. O código
principal não pode ser enviado no PATCH. Localização e descrição aceitam vazio ou
`null` para limpar. `photo_data` omitido preserva a foto; `null` remove; uma data URL
válida substitui a imagem. A rota de foto usa `Cache-Control: private, no-store`.

A revisão `0002_part_updates` adiciona `part_update_requests`. A chave idempotente,
o ID da peça, os dados normalizados e a resposta permitem repetir a tentativa,
inclusive após reinício, sem reaplicar uma edição antiga sobre dados mais recentes.
Reutilizar a chave com dados ou peça diferentes retorna 409. O serviço bloqueia a
linha durante a escrita em PostgreSQL e confirma campos, códigos, foto e resposta
na mesma transação. Falhas desfazem a operação; a restrição única continua sendo a
garantia final contra códigos duplicados. A listagem paginada permite escolher uma
peça para edição; busca e filtros não foram implementados neste recorte.

### Evidências — 12/11/2026

Status local: implementação verificada, com revisão por outro integrante e aceite
do cliente pendentes. A issue não foi fechada nem teve seu status alterado.

- TDD: 19 novos cenários da US05 falharam com 405 antes da implementação das rotas.
  Depois foram aprovados, incluindo CA05.1 (mesmo registro), CA05.2 (código
  imutável) e CA05.3 (nome/categoria obrigatórios). Três cenários adicionais de
  rollback, conflito após a consulta e campos opcionais foram acrescentados na
  revisão, sem alegar TDD retroativo.
- `uv sync --locked`: ambiente sincronizado com Python **3.13.14**. A execução local
  usou `.venv/Scripts/python.exe -m pytest --cov --cov-report=term-missing`:
  **51 testes aprovados**, cobertura combinada de linhas e ramificações de **96%**.
  Permanece o aviso já existente de depreciação de `httpx` pelo TestClient.
- `.venv/Scripts/ruff.exe check .` e `.venv/Scripts/ruff.exe format --check .`:
  aprovados.
- `.venv/Scripts/python.exe -m alembic upgrade head` e `alembic check` em SQLite
  descartável: migrações aplicadas, sem diferenças com os modelos.
- `.venv/Scripts/python.exe -m alembic upgrade head --sql`: SQL PostgreSQL gerado
  offline. Nenhuma migração foi aplicada em banco remoto.
- Fluxo real integrado ao front-end: cadastro, edição e consulta dos dados salvos
  conferidos em banco descartável. Os testes automatizados também cobrem foto,
  colisão de códigos, rollback completo e repetição após reiniciar a API.

Concorrência efetiva em PostgreSQL, disputa simultânea da mesma chave e a matriz
de navegadores continuam pendentes. O teste de conflito após a consulta verifica
a restrição única e o rollback, mas não simula duas transações PostgreSQL simultâneas.

### Revisão da US05 — 12/11/2026 (Refs #31)

- Revisados schemas, rotas, serviço, repositório, modelos e migração. Preservadas
  validações, imutabilidade do código, transação e idempotência. Não foi necessária
  mudança na implementação da API nesta revisão.
- Acrescentado teste de regressão que confirma a preservação de alterações
  anteriores em outros campos e de equivalentes com separadores em PATCHs parciais.
  Esse teste já passou com a API existente; a correção correspondente foi no front-end.
- `.venv/Scripts/python.exe -m pytest --cov --cov-report=term-missing`:
  **52 testes aprovados** com Python **3.13.14**, cobertura de **96%** e o mesmo aviso
  de depreciação de `httpx` já registrado. `.venv/Scripts/ruff.exe check .` e
  `.venv/Scripts/ruff.exe format --check .` aprovados.
- `.venv/Scripts/python.exe -m alembic upgrade head` e
  `.venv/Scripts/python.exe -m alembic check`: aprovados em novo SQLite descartável,
  sem diferenças entre os modelos e as migrações. Mantidas as pendências de
  concorrência PostgreSQL e aceite descritas acima.

## Ambiente e publicação

`DATABASE_URL` é uma configuração exclusiva do back-end. `CORS_ORIGINS` recebe
uma lista JSON com os endereços do front-end autorizados. Em produção, configure
o domínio da Vercel nesse campo. As variáveis reais não são versionadas.

O Dockerfile tem os alvos `development` (com ferramentas e recarga) e `production`
(com dependências de execução). O alvo padrão é `production`, pronto para ser
usado pelo Render. A porta de produção utiliza a variável `PORT` da hospedagem.

Antes de liberar uma versão em produção, aplique `alembic upgrade head` usando
a conexão de migração do ambiente e confira `alembic current`. A imagem contém
as migrações, mas o comando de produção não as executa automaticamente. A API
acessa o PostgreSQL diretamente; não habilite acesso público às tabelas pelo
Data API do Supabase. Configure HTTPS na hospedagem. Nenhum deploy ou alteração
do banco remoto foi realizado nesta entrega.
