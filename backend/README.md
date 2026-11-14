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

## Status da peça — US06 (Refs #32)

A regra adotada para a US06 segue o [PR #63](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/63):
peças inativas permanecem visíveis no catálogo e nas buscas, identificadas como
inativas, mas não podem receber novas movimentações de estoque nem vendas.
Inativar preserva o cadastro, o saldo e os registros existentes; reativar permite
novamente essas operações.

A implementação atual contempla a alternância de status e a preservação dos dados
já disponíveis. Peças novas e existentes começam ativas e a edição cadastral
continua disponível para peças inativas. Os fluxos de estoque e vendas ainda não
foram implementados: seus serviços deverão verificar o status e rejeitar novas
operações para peças inativas quando esses fluxos forem adicionados. A preservação
do saldo também deverá ser testada nessa integração.

Alinhamento de escopo registrado em 12/11/2026, sem antecipar a implementação dos
módulos dependentes. Os critérios de alternância estão na
[issue #32](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/32),
cujo texto de refinamento ainda aguarda atualização para refletir essa regra.

`PATCH /parts/{id}` aceita `status: "active"` ou `status: "inactive"`, com a mesma
`Idempotency-Key` e transação da edição. Omitir status preserva seu valor; `null`
ou valores diferentes retornam 422. Enviar somente status preserva ID, códigos,
nome, categoria, localização, descrição e foto. Apenas status e data de atualização
podem mudar; repetir uma tentativa antiga retorna sua resposta sem reaplicá-la.
Respostas idempotentes armazenadas antes da US06 recebem `active` na leitura,
mantendo a compatibilidade do histórico sem alterar o estado atual da peça.

A revisão `0003_part_status` acrescenta a coluna com padrão `active` e restrição
de valores no banco. Aplique a migração antes de executar esta versão da API.

### Evidências — 12/11/2026

Status local: implementação verificada; revisão por outro integrante e aceite
do cliente pendentes. Não houve alteração remota da issue ou do banco.

- TDD: três cenários de transição, repetição e rollback falharam com 422 antes
  da implementação. O cenário de padrão ativo/edição de inativas falhou pela
  ausência do campo. A migração falhou no teste pela coluna inexistente. Todos
  passaram após a implementação. Casos inválidos já eram rejeitados antes;
  compatibilidade do histórico e preservação de códigos na migração receberam
  testes complementares, sem alegação retroativa de TDD.
- `.venv/Scripts/python.exe -m pytest --cov --cov-report=term-missing`:
  **64 testes aprovados**, Python **3.13.14**, cobertura combinada de **96%**.
  Permanece apenas o aviso já existente de depreciação de `httpx` pelo TestClient.
- `.venv/Scripts/ruff.exe check .` e `.venv/Scripts/ruff.exe format --check .`:
  aprovados. Ambiente existente sincronizado com o lockfile, sem novas dependências.
- `.venv/Scripts/python.exe -m alembic upgrade head` e
  `.venv/Scripts/python.exe -m alembic check`: aprovados em SQLite descartável.
  Teste automatizado cobre upgrade com peça existente, restrição de status,
  preservação do ID/código/dados e downgrade para `0002_part_updates`.
- `.venv/Scripts/python.exe -m alembic upgrade 0002_part_updates:head --sql`:
  SQL PostgreSQL inspecionado offline, com coluna, padrão e restrição esperados.
- CA06.1/CA06.2 cobertos por transições persistidas; CA06.3 coberto para os dados
  existentes, inclusive conteúdo da foto. O módulo de saldo ainda não existe:
  sua preservação deve ser verificada ao integrar estoque. Concorrência efetiva
  em PostgreSQL e disputa simultânea da mesma chave continuam pendentes.

### Revisão da US06 — 12/11/2026 (Refs #32)

- Revisados todos os arquivos alterados e novos da API, migração e testes,
  incluindo os contratos da US05 reutilizados pelo status. Não foram encontrados
  problemas adicionais que exigissem alteração de código. Preservados o recorte
  confirmado, as camadas, a validação no banco, a transação e a idempotência.
- Reexecutados `.venv/Scripts/python.exe -m pytest --cov --cov-report=term-missing`,
  `.venv/Scripts/ruff.exe check .` e `.venv/Scripts/ruff.exe format --check .`:
  **64 testes aprovados**, cobertura de **96%**, lint e formatação aprovados com
  Python **3.13.14**. Permanece o aviso de depreciação do TestClient já registrado.
- Reexecutados `alembic upgrade head` e `alembic check` pelo Python da `.venv`
  em novo SQLite descartável: aprovados, sem diferenças com os modelos.
  O teste da migração também verificou novamente upgrade e downgrade com dados.
- As evidências anteriores de SQL PostgreSQL offline foram consultadas. Naquele
  momento, a execução em PostgreSQL ainda estava pendente; a aplicação no Docker
  local foi verificada na correção de ambiente registrada abaixo. Concorrência,
  saldo de estoque e aceite permanecem pendentes.

### Correção do ambiente Docker — 12/11/2026 (Refs #32)

O solicitante relatou falha ao cadastrar e abrir o catálogo em `localhost:5173`.
`GET http://localhost:8000/parts?limit=1` reproduziu HTTP **503**, com a mensagem
"Não foi possível confirmar a operação. Tente novamente com os mesmos dados."
Os contêineres estavam saudáveis, mas `docker compose exec -T backend alembic current`
retornou `0002_part_updates`. A consulta a `information_schema.columns` confirmou
a ausência de `parts.status`. Havia **2 peças** no banco antes da correção.

A recarga do Uvicorn havia carregado o código da US06 sem executar a nova migração.
As validações anteriores usaram bancos descartáveis e não atualizaram esse
PostgreSQL local já em execução. A correção foi de ambiente, sem mudança de código:

```bash
docker compose exec -T backend alembic upgrade head
docker compose exec -T backend alembic current
docker compose exec -T backend alembic check
```

- Revisão confirmada: **`0003_part_status (head)`**; `alembic check` sem diferenças.
- Contagem após a migração: **2 peças**, ambas com status **`active`**.
- A mesma consulta HTTP passou a retornar **200**, com `total: 2`.
- Cadastro validado pelo `PartService` dentro do contêiner, usando o PostgreSQL
  local e uma transação externa com savepoint: a peça temporária foi criada com
  status `active` e a contagem chegou a 3 dentro da transação. O rollback externo
  desfez a gravação e a tentativa idempotente; a contagem final permaneceu em 2.
  Essa verificação não foi um POST HTTP nem um cadastro pelo navegador.
- Não houve remoção de volumes, cadastros de teste persistidos, alteração em banco
  remoto ou deploy. O procedimento para migrações com Docker em execução está no
  [README de migrações](migrations/README.md#migração-nova-com-o-docker-já-em-execução).

As suítes de 64 testes de back-end e 27 de front-end com Node 22.23.4 são as da
revisão anterior; não foram repetidas para esta correção de ambiente. A execução
local em PostgreSQL acima não substitui testes de concorrência, integração com
saldo, matriz de navegadores ou aceite do cliente, que continuam pendentes.

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
