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
| `GET /parts/{id}` | Consulta uma peça salva, ou retorna 404 |
| `GET /parts/{id}/photo` | Retorna a imagem validada, ou 404 quando ausente |

Código do fabricante, nome e categoria são obrigatórios. Descrição técnica,
localização física, códigos equivalentes e foto são opcionais. Consulte os
campos e limites no OpenAPI. A foto é enviada como data URL em `photo_data`.

O recorte segue as regras do PR #63 autorizadas para esta implementação:
códigos principais e equivalentes compartilham uma restrição de unicidade em
`part_codes`. Conflitos retornam 409 com a peça existente, sem sobrescrever dados.
Espaços nas extremidades são removidos; não há conversão de maiúsculas, pontuação
ou códigos de fabricantes. Perfis de acesso, edição e exclusão ficam fora desta
entrega. As rotas atuais não exigem autenticação.

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
