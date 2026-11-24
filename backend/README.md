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

## Estado atual do incremento

Nesta branch estão disponíveis cadastro e edição de peças, alteração de status,
importação XLSX, aplicações por veículo, busca, entrada de estoque e consulta de saldo.
A US05 também permite corrigir e remover aplicações existentes. US09, US10, US15 e
US16 continuam previstas para os próximos incrementos.

Os registros datados abaixo preservam as verificações de cada etapa; as referências
antigas a funcionalidades ainda ausentes devem ser lidas no contexto dessas datas.
Consulte a [complementação da US05](#correção-e-remoção-de-aplicações--us05-refs-31)
para os contratos e os resultados da revisão de 23/11/2026.

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
cadastrais. A US08 já bloqueia entradas para peças inativas, e a US12 permite
consultar seu saldo sem reativá-las. Saídas, ajustes e vendas deverão aplicar o
mesmo bloqueio quando as US09, US10 e US15 forem integradas.

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

## Aplicações por veículo — US03

Implementação dos critérios fornecidos pelo solicitante em 16/11/2026, vinculados
a RF03, CP1, OE1 e EP01. A peça pode receber várias aplicações, cada uma com marca,
modelo e um único ano. Correção e remoção dessas associações são atendidas pela US05, descrita ao final deste documento.

| Rota | Contrato |
| --- | --- |
| `POST /parts/{id}/vehicle-applications` | `{ "brand": "Fiat", "model": "Uno", "year": "2010" }` e `Idempotency-Key` UUID; 201 |
| `GET /parts/{id}/vehicle-applications?offset=0&limit=20` | `items` e `total`; paginação de 1 a 100 registros |

Marca e modelo recebem trim e não aceitam vazio. O ano é uma string de quatro
dígitos ASCII, sem intervalos, texto livre ou faixa cronológica adicional.
Validação retorna 422 com identificação dos campos; peça inexistente retorna 404.
A mesma marca/modelo/ano pode existir em peças diferentes. Na mesma peça, a chave
normalizada com `casefold()` e trim impede duplicidade e retorna 409 com
`existing_application`. Acentos, pontuação e espaços internos são preservados.
Peças inativas continuam disponíveis para associação cadastral.

A revisão `0004_vehicle_applications` cria `vehicle_applications` e
`vehicle_application_requests`, sem alterar o cadastro de peças. Aplique
`uv run alembic upgrade head` antes de iniciar a API atualizada. Em um Compose
já iniciado, execute `docker compose exec backend uv run alembic upgrade head`.
O downgrade desta revisão remove as aplicações e o histórico de tentativas;
não é uma forma de desfazer associações individuais.

O serviço bloqueia a peça durante a transação PostgreSQL. Associação e resposta
idempotente são confirmadas juntas; uma falha desfaz ambas. A restrição única no
banco também protege contra conflitos após a consulta inicial. Repetir a chave
com os mesmos dados devolve a resposta original, inclusive após reinício;
outros dados ou outra peça com a mesma chave retornam 409.

### Testes e evidências — 16/11/2026

Ciclos TDD observados em `tests/test_vehicle_applications.py`:

| Etapa | Falha observada antes da implementação | Resultado após implementação |
| --- | --- | --- |
| Associação válida | POST retornava 404 | 201 e vínculo com a peça — CA03.1 |
| Múltiplas aplicações/listagem | GET retornava 405 | Associações preservadas e paginação — CA03.2 |
| Obrigatórios | Vazio/espaços retornavam 201 | 422 por campo — CA03.3 |
| Representação do ano | Formatos inválidos retornavam 201 | Apenas quatro dígitos — CA03.4 |
| Peça inexistente | POST retornava 201 | 404 |
| Duplicidade no PostgreSQL | Repetições, inclusive concorrentes, retornavam 201 | Um registro e conflito identificado — CA03.5 |
| Idempotência/atomicidade | Reenvio retornava 409; chave ausente/reutilizada e falha de gravação retornavam 201 | Reenvio estável, validação da chave e rollback — RNF02 |

Os testes complementares de concorrência com a mesma chave/anos distintos,
restrição única após a consulta, migração com dados existentes e preservação de
acentos/espaços internos reforçam a verificação; não são alegados como TDD retroativo.

- Python 3.13.14: `.venv/Scripts/python.exe -m pytest -q --cov --cov-report=term-missing`:
  **97 aprovados e 3 ignorados**, cobertura combinada de **96%**. Os três ignorados
  exigem PostgreSQL. `ruff check .` e `ruff format --check .` aprovados.
- PostgreSQL **17**, contêiner local exclusivo `tsi-us03-test-db`, banco
  `tsi_us03_test`, porta **55433**: **36 testes aprovados**, incluindo os três
  de concorrência. Cada teste usa um schema exclusivo, criado e removido pela
  fixture. Foram verificados upgrade/downgrade com peça existente e
  `alembic check`, sem diferença entre os modelos e as migrações.
- A CI passa a disponibilizar PostgreSQL e executar esse módulo após a regressão
  padrão. A alteração da CI foi inspecionada localmente; execução remota pendente.
- Permanece o aviso existente de depreciação de `httpx` no TestClient do Starlette.
  As lacunas de cobertura incluem recuperação após conflito de chave no commit
  entre peças diferentes e erros de configuração; cobertura não comprova TDD.

Para reproduzir no PowerShell, com Docker disponível, a partir de `backend/`:

```powershell
docker run --detach --name tsi-us03-test-db --env POSTGRES_USER=tsi --env POSTGRES_PASSWORD=tsi_us03_local --env POSTGRES_DB=tsi_us03_test --publish 127.0.0.1:55433:5432 postgres:17-alpine
docker exec tsi-us03-test-db pg_isready -U tsi -d tsi_us03_test
$env:US03_TEST_DATABASE_URL = 'postgresql+psycopg://tsi:tsi_us03_local@127.0.0.1:55433/tsi_us03_test'
uv run pytest tests/test_vehicle_applications.py -q
Remove-Item Env:US03_TEST_DATABASE_URL
docker stop tsi-us03-test-db
```

A credencial acima pertence exclusivamente ao banco descartável. A fixture rejeita
outro nome de banco ou host remoto; não aponte testes para dados operacionais.
Se o contêiner já existir, inicie-o com `docker start tsi-us03-test-db`.
A regressão das outras US continua usando SQLite; a validação concorrente em
PostgreSQL registrada aqui cobre especificamente a US03.

Status: implementação verificada localmente. Revisão por outro integrante e aceite
do cliente permanecem pendentes. Nenhuma issue foi fechada, e nenhuma migração foi
aplicada ao banco operacional ou ao Supabase. RNF05 mantém credenciais no back-end
e erros sem detalhes internos; HTTPS/TLS depende da implantação, não validada
pelo ambiente HTTP local. Autenticação não foi acrescentada a este recorte.

### Migração e execução no Docker local — 16/11/2026

A pedido do solicitante, o banco local do Compose foi atualizado de `0001_parts`
para `0004_vehicle_applications`, incluindo as revisões intermediárias. A peça
existente foi preservada (uma antes e uma depois); nenhuma aplicação de teste foi
inserida nesse banco.

- `docker compose config --quiet`: aprovado.
- `docker compose up --build -d --wait --wait-timeout 180`: imagens reconstruídas;
  banco, API e front-end saudáveis, mantidos em execução para teste do solicitante.
- `docker compose exec -T backend alembic current`: `0004_vehicle_applications (head)`.
- `docker compose exec -T backend alembic check`: sem alterações pendentes.
- `/health`, catálogo e listagem de aplicações da peça existente responderam
  corretamente. Front-end em `http://localhost:5173/` e módulo da US03: HTTP 200.

O comando de início da API no Compose já executa `alembic upgrade head` antes do
Uvicorn. Em outra máquina, após obter esta versão completa do código (incluindo a
nova migração), `docker compose up --build -d` constrói as imagens e aplica as
revisões pendentes ao iniciar a API. Atualizar arquivos com os contêineres já
rodando não reaplica automaticamente migrações: reconstrua/inicie o Compose ou
execute explicitamente `docker compose exec backend alembic upgrade head`.
A migração distribui a estrutura do banco; os cadastros continuam em cada volume
local. As alterações desta entrega ainda precisam de commit/push para chegarem
aos demais integrantes pelo Git; esta execução não realizou publicação remota.

## Busca de peças — US04 (Refs #30)

`GET /parts/search` recebe `code`, `name`, `category`, `brand`, `model` e `year`,
além de `offset` (padrão 0) e `limit` (padrão 20, máximo 100). Retorna `items` e
`total`. A listagem geral `GET /parts` continua disponível. Os critérios estão na
[issue #30](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/30).

- Código principal ou equivalente, categoria e ano usam correspondência exata.
  Nome, marca e modelo usam trecho literal: `%`, `_` e barras não são curingas.
- Busca ignora caixa e espaços nas extremidades. Zeros, separadores, acentos e
  espaços internos continuam significativos. Isso não altera a unicidade do cadastro.
- Todos os filtros preenchidos são combinados com AND. Marca/modelo/ano precisam
  corresponder à mesma aplicação; uma peça aparece uma vez, mesmo com várias aplicações.
- Ano aceita quatro dígitos ASCII. Busca sem filtros válidos retorna 422 antes de
  consultar o repositório; nenhum resultado retorna 200 com lista vazia e total 0.
- Peças inativas permanecem nos resultados com seu status. Paginação usa ordem
  estável por criação e ID. Credenciais continuam exclusivas do back-end.

A consulta utiliza `EXISTS` sobre códigos e aplicações. Não houve mudança de
estrutura: a revisão continua `0004_vehicle_applications`. O ensaio local abaixo
não indicou necessidade de índices adicionais. Todas as migrações existentes
continuam versionadas e aplicadas pelo comando de início do Compose.

### TDD e verificação — 16/11/2026

| Etapa | Falha observada antes da implementação | Resultado após implementação |
| --- | --- | --- |
| Identificação e ausência de resultado | `/search` retornava 422 como ID inválido | 5 testes aprovados — CA04.1/CA04.3 |
| Normalização, trechos literais, busca vazia e limites | 17 falhas de correspondência/validação | 25 testes aprovados — CA04.4/CA04.6 |
| Veículos e combinação na mesma aplicação | 13 falhas, incluindo falsos positivos e ano inválido aceito | 40 testes aprovados no PostgreSQL — CA04.2/CA04.5 |

Os testes adicionais de paginação, inativas (CA04.7), preservação de códigos e
unicidade que já passaram ao serem adicionados são verificações complementares,
sem alegação retroativa de TDD. A fixture compartilhada migra cada banco/schema
descartável até a revisão real do projeto e remove apenas o schema do teste.

- `.venv/Scripts/python.exe -m pytest -q --cov --cov-report=term-missing`:
  **136 aprovados, 4 ignorados**, cobertura combinada de **96%**. Os quatro casos
  ignorados dependem de PostgreSQL (concorrência e comparação de Unicode).
- Com `US03_TEST_DATABASE_URL` apontando ao PostgreSQL 17 local descartável:
  `uv run pytest tests/test_part_search.py tests/test_vehicle_applications.py -q`:
  **76 aprovados**, incluindo todos os 40 da US04 e os 36 da US03.
- `ruff check .` e `ruff format --check .`: aprovados. Permanecem avisos de
  depreciação do TestClient; a execução concorrente também emitiu aviso do Pydantic
  sobre metadado `alias`, sem falha de teste.
- A CI foi estendida para executar ambas as histórias no PostgreSQL. A execução
  remota depende da publicação destas alterações, não realizada nesta entrega.

### Ensaio reproduzível de desempenho

Use o banco descartável descrito na US03, nunca o banco operacional. Na pasta
`backend/`, com `US03_TEST_DATABASE_URL` configurada, execute:

```bash
uv run python -m tools.benchmark_part_search
```

O script cria um schema exclusivo, aplica migrações e insere 5.000 peças, 15.000
códigos, 15.000 aplicações e 20.000 movimentações. A API temporária recebe
200 requisições de busca (US04) e 200 consultas de saldo (US12), com dois usuários
concorrentes em cada medição. O ensaio verifica o saldo retornado para cada peça
consultada, incluindo ativas, inativas e peças com saldo zero, e registra os planos
de execução da busca.

| Consulta | P95 local (24/11/2026) | Maior tempo observado |
| --- | ---: | ---: |
| Busca de peças (US04) | 48,54 ms | 81,71 ms |
| Saldo de estoque (US12) | 33,31 ms | 36,64 ms |

As 400 requisições foram concluídas em HTTP por loopback, com PostgreSQL 17 em
Docker. Para verificar o RNF04 de ponta a ponta, ainda é necessário repetir o
ensaio no ambiente publicado, sob a condição de rede definida no requisito.
O relatório fica em `.cache/us04-performance.json`, fora do Git. Ao terminar,
o script encerra a API temporária e remove somente o schema do ensaio.

TLS em produção, matriz completa de navegadores, revisão por outro integrante
e aceite do cliente permanecem pendentes. A DoD não é declarada concluída.

## Entrada de estoque — US08 (Refs #33)

`POST /parts/{id}/stock-entries` recebe `quantity` (inteiro positivo),
`entry_date` (data ISO) e `unit_cost` (decimal, inclusive zero, até duas casas).
O cabeçalho `Idempotency-Key` deve conter um UUID. Não exige fornecedor.
`GET /parts/{id}/stock-balance` consulta o saldo vigente.

A migração `0005_stock_entries` acrescenta o saldo às peças existentes com valor
inicial zero e cria movimentações e respostas idempotentes. O Compose aplica
`alembic upgrade head` antes da API; todos os ambientes devem usar a mesma revisão
versionada. Não execute alterações manuais de estrutura para instalar esta US.

O serviço bloqueia a peça com `SELECT FOR UPDATE`, compartilhando a ordem de
serialização com a inativação. Movimento, saldo e resposta são confirmados na
mesma transação. Uma entrada retroativa soma ao saldo vigente sem reprocessar o
passado. A data máxima usa o calendário `America/Sao_Paulo`.

Reenvios com a mesma chave e dados devolvem a resposta original, inclusive após
reinício ou inativação. Outra peça ou outros dados com a mesma chave retornam
409. O saldo dessa resposta é histórico: consulte a rota de saldo para obter o
valor atual. Concorrência entre peças com a mesma chave desfaz integralmente a
transação perdedora. Não há cálculo monetário com ponto flutuante no back-end.

Os testes `tests/test_stock_entries.py` cobrem os seis critérios, rollback,
reenvio, concorrência e migração. O PostgreSQL usa o banco descartável já adotado
nos testes da US03, com um schema exclusivo por teste; nunca o banco operacional.
A revisão por outro integrante e o aceite do cliente permanecem etapas humanas.

### Evidências TDD da US08

Os comportamentos foram trabalhados individualmente, com execução da falha antes
da implementação e nova execução aprovada. Na API, os ciclos observaram:
registro ausente (404); saldo ausente na resposta; aceitação indevida de peça
inativa, quantidade zero/booleana, custo negativo/com três casas e data futura;
reenvio duplicando o saldo; mesma chave aceitando outro conteúdo; representações
monetárias equivalentes produzindo conflito; concorrência entre peças retornando
503 em vez de 409; ausência da restrição SQL de quantidade positiva. Cada falha
foi corrigida antes de iniciar o comportamento seguinte.

Os cenários que já passaram na primeira execução são verificações complementares:
preservação das outras peças, quantidade negativa/fracionária, rollback, fuso,
campos obrigatórios, custo zero, retroatividade, reinício, migração e serialização
com inativação. Eles não são apresentados como ciclos RED/GREEN novos.

Verificação em 16/11/2026: 29 testes da US08 aprovados no PostgreSQL; regressão
conjunta de `test_vehicle_applications.py`, `test_part_search.py` e
`test_stock_entries.py`: 105 aprovados. `ruff check .` e `ruff format --check .`
aprovados. O teste histórico da US03 passou a preparar e comparar dados com as
colunas da revisão 0003, sem usar o modelo atual contra uma estrutura antiga.

Resultado final: regressão do backend no Docker com `pytest -q`: 161 aprovados
e 8 cenários de PostgreSQL ignorados nessa execução SQLite. Os 105 testes das
US03/US04/US08 passaram separadamente no PostgreSQL. No banco operacional,
`alembic current` indicou `0005_stock_entries (head)` e `alembic check` não
identificou divergências. Os três serviços do Compose permaneceram saudáveis.

## Consulta de saldo — US12 (Refs #36)

Reutiliza `GET /parts/{id}/stock-balance`, que retorna `part_id` e `stock_balance`
do registro persistido. A consulta funciona também para peças inativas, não muda
status, não grava movimentações e não recalcula o saldo. Não exige migração nova.
Respostas confirmadas passam a enviar `Cache-Control: no-store`, para impedir
reutilização do saldo por caches HTTP. Peça inexistente retorna 404 e falha no
banco retorna 503, sem representar a indisponibilidade como saldo zero.

### Evidências — 18/11/2026

`tests/test_stock_balance.py` verifica saldo inicial zero (CA12.2/CA12.4), consultas
após entradas de 5 e 3 unidades (CA12.1/CA12.3), leitura repetida de peça inativa
sem alteração de status/saldo e com entrada ainda rejeitada (CA12.5), peça ausente
e falha de banco sem exposição de detalhes internos (CA12.6), e controle de cache.
Os três primeiros testes protegem comportamento existente. O teste de cache
falhou pela ausência do cabeçalho antes da alteração no router; depois, os quatro
testes passaram com Python 3.13.14 e banco SQLite descartável migrado pela suíte.

A UI foi integrada à API local usando outro SQLite temporário e peças fictícias.
A consulta usa o mesmo saldo que a US08 atualiza na transação. Importação cadastral,
saídas, ajustes, vendas e cancelamentos ainda não têm implementação nesta branch;
seus testes de integração deverão garantir o saldo inicial zero ou a atualização
desse mesmo campo, conforme CA12.3/CA12.4. Não foram simuladas essas funcionalidades
como se estivessem entregues. RNF04 em produção, HTTPS/TLS, revisão da equipe e
aceite do cliente permanecem pendentes; a DoD não foi declarada concluída.

Regressão desta entrega: `.venv/Scripts/python.exe -m pytest -q --cov
--cov-report=term-missing` aprovou **165 testes**, com **8 ignorados** que exigem
PostgreSQL e cobertura combinada de **96%**. `ruff check .` e
`ruff format --check .` aprovados. Permanece o aviso de depreciação do TestClient
já existente. A integração PostgreSQL não foi reexecutada nesta entrega.

## US02 — Importação cadastral por planilha (Refs #28)

Implementação vinculada a RF02 · CP1 · OE1, conforme os critérios fornecidos para
a US02. Mantém router → service → repository, valida os registros com `PartCreate`
da US01 e usa uma transação para gravar todo o lote. A implementação da US12 foi
preservada; a importação agora cobre sua integração de saldo inicial zero.

- `GET /part-imports/template`: baixa `modelo-pecas.xlsx`, com os cinco cabeçalhos
  previstos e a coluna de códigos formatada como texto.
- `POST /part-imports`, com `Idempotency-Key` UUID e JSON
  `{ "filename": "pecas.xlsx", "content": "<arquivo em base64>" }`: retorna 201
  com `{ "imported_count": 2 }` quando o lote inteiro é confirmado.
- Erros de validação retornam 422 com `detail.message` e, quando aplicável,
  `detail.issues`, contendo `row` (linha da planilha, iniciando em 1) e `message`.
  Reutilizar uma chave confirmada com outros dados retorna 409. Falhas de banco
  retornam 503 sem detalhes internos: o cliente deve reenviar a mesma tentativa.
- A migração `0006_part_imports` cria `part_import_requests`. Sua chave única
  serializa reenvios concorrentes; fingerprint e confirmação são persistidos no
  mesmo commit das peças. Falhas revertem também essa confirmação. O resultado
  pode ser recuperado após reinício da API; o arquivo não é armazenado no banco.

Use `uv sync --locked` e `uv run alembic upgrade head` antes de iniciar a API.
As dependências `openpyxl` e `defusedxml` estão registradas no `uv.lock`.
A proteção XML segue a [orientação do openpyxl](https://openpyxl.readthedocs.io/en/stable/#security).
Arquivos não são executados nem extraídos para o sistema de arquivos.

### Critérios e limites da carga

| Critério | Comportamento verificado em `tests/test_part_imports.py` |
| --- | --- |
| CA02.1 | Importação em lote; mesmos campos, limites e normalização da US01; zeros e separadores preservados. |
| CA02.2 / CA02.3 | Conflitos com códigos principais/equivalentes e campos inválidos identificam linhas; nenhuma peça do lote é criada e o catálogo existente permanece intacto. |
| CA02.5 | Cabeçalhos obrigatórios, colunas extras com dados e cabeçalhos repetidos são reportados; abas e linhas vazias são ignoradas; exige uma aba preenchida com registros. |
| CA02.6 | Todas as linhas com códigos repetidos após trim são identificadas, inclusive quando uma delas tem outro campo inválido. |
| CA02.7 / RNF02 | Rollback após falha na segunda gravação, conflito após validação, reenvio após reinício e concorrência real em PostgreSQL. |
| CA02.8 | Rejeição de arquivo incompatível/corrompido, código numérico, booleano ou fórmula; sem conversão numérica silenciosa. |
| CA02.9 / CA12.4 | Apenas os cinco campos cadastrais; sem equivalentes/foto e saldo inicial zero consultado pelo endpoint da US12. |

O formato aceito para códigos é o valor textual da célula, mesmo que o editor
mostre o estilo Geral; números com máscara de zeros continuam sendo números e
são rejeitados. Fórmulas não são aceitas nos campos importados. A unicidade segue
a US01, sem inventar normalização de maiúsculas/minúsculas.

Limites técnicos por arquivo: 2 MiB compactados, 32 MiB após descompactação e
200.000 células na leitura das abas com conteúdo, incluindo espaços entre registros
e formatação. Abas sem conteúdo são ignoradas antes da expansão de células e do
limite de dimensões, mesmo quando possuem formatação distante. Os limites de
tamanho compactado e descompactado continuam valendo para o arquivo inteiro.
Lotes que excedem esses limites são rejeitados com orientação, sem carga parcial.
Metadados incorretos de dimensões não podem truncar silenciosamente os registros.
Esses limites protegem memória/processamento; não alteram os limites dos campos
nem representam uma regra de negócio aprovada pelo cliente.

### Evidências de desenvolvimento e verificação — 18/11/2026

Os ciclos TDD observaram, antes das implementações correspondentes: rota ausente
(404), validação de campo sem relatório, colunas/abas sem validação, duplicidades
não reportadas, formatos/códigos incompatíveis aceitos, reenvio rejeitado (422),
conflito de gravação sem identificação (503), modelo ausente (404), ausência de
limite de expansão e truncamento de duas linhas para uma. Após cada correção,
os testes afetados passaram. Os testes de rollback e de concorrência real
complementaram a cobertura de comportamento já implementado; não são apresentados
como novos ciclos vermelho/verde.

- `.venv/Scripts/python.exe -m pytest -q --cov --cov-report=term-missing`, com
  `US03_TEST_DATABASE_URL` apontando para PostgreSQL 17 descartável local:
  **209 aprovados**, sem skips, incluindo **36 testes da US02**; cobertura combinada
  **96%**. O fixture cria e remove um schema exclusivo por teste.
- `ruff check .` e `ruff format --check .`: aprovados.
- Permanece o aviso preexistente de depreciação do TestClient/httpx.
- A UI foi verificada contra outra API temporária no mesmo PostgreSQL isolado:
  rejeição de duplicidades, importação válida de duas peças e consulta de saldo
  zero pela US12. O banco da aplicação em uso não recebeu dados de teste.

HTTPS/TLS em homologação, matriz completa de navegadores, revisão por outro
integrante via PR e validação com Antônio Marcos permanecem pendentes. Estas
evidências não declaram a DoD concluída nem substituem aceite do cliente.

### Correção do CA02.5 — Abas vazias formatadas

A revisão reproduziu uma rejeição indevida: uma aba sem valores, apenas com a
célula `XFD20` formatada, fazia um arquivo de aproximadamente 5,4 KB atingir o
limite de dimensões e retornar 422. Removendo essa aba, o mesmo cadastro era aceito.

O ciclo TDD adicionou três cenários, com duas abas vazias formatadas em `XFD20`,
`A200001` ou `XFD1048576`. Todos falharam com 422 antes da correção e passaram
após o ajuste. O leitor agora inspeciona o XML de cada aba com `defusedxml`, sem
expandir posições vazias, antes de aplicar os limites de células. O acesso à fonte
XML do leitor openpyxl fica isolado em `_worksheet_has_content`.

Quatro testes complementares garantem que zero, booleano, fórmula e espaço em
outra aba não sejam confundidos com ausência de conteúdo. Os testes existentes
continuam protegendo os limites de expansão/dimensões de abas preenchidas, erros
por linha, idempotência e saldo inicial zero. Nenhum arquivo específico da US12
foi alterado nesta correção.

Verificação da correção em 18/11/2026:

- `.venv/Scripts/python.exe -m pytest -q --cov --cov-report=term-missing`, com
  `US03_TEST_DATABASE_URL` apontando para PostgreSQL 17 local descartável:
  **216 testes aprovados**, sem skips, incluindo **43 da US02**; cobertura combinada
  **96%**. Permanece somente o aviso preexistente do TestClient/httpx.
- `ruff check .` e `ruff format --check .`: aprovados.
- O próprio arquivo usado na revisão (`aba-vazia-formatada.xlsx`) foi reenviado
  a uma API com SQLite temporário: retornou **201**, cadastrou uma peça e a consulta
  da US12 confirmou **saldo zero**. Os bancos de teste foram encerrados após o uso.
- Frontend com Node 22.23.4, `node node_modules/vitest/vitest.mjs run
  --maxWorkers=1 --testTimeout=60000`: **89 testes aprovados em 10 arquivos**,
  incluindo os **13 da US12**. Nenhum arquivo frontend precisou ser alterado para
  esta correção.


## Correção e remoção de aplicações — US05 (Refs #31)

Complementação dos critérios CA05.5 e CA05.7 em 23/11/2026. Os contratos usam a
mesma validação de marca, modelo e ano da US03:

| Rota | Contrato |
| --- | --- |
| `PATCH /parts/{part_id}/vehicle-applications/{application_id}` | Marca, modelo e ano completos, com `Idempotency-Key`; retorna 200 com a aplicação atualizada. |
| `DELETE /parts/{part_id}/vehicle-applications/{application_id}` | Sem corpo, com `Idempotency-Key`; retorna 200 com os dados do vínculo removido. |

A alteração exige que a aplicação pertença à peça informada. Editar não troca o
identificador nem altera os outros vínculos; remover preserva a peça, seu saldo,
status e demais aplicações. Aplicações de peças inativas continuam editáveis, pois
essas operações não são movimentações de estoque. Duplicidades são comparadas por
marca/modelo normalizados e ano, permitindo manter os próprios dados.

A trava da peça e a transação serializam as operações. Os resultados confirmados
são guardados na tabela existente de tentativas, com identificação da operação,
peça, aplicação e dados. Repetir a chave retorna o resultado original, sem
reaplicar uma edição antiga ou remover outra associação. Reutilizar a chave para
outros dados ou operações retorna 409; falhas durante a gravação desfazem toda a
transação. Não houve alteração de estrutura nem nova migração.

### Desenvolvimento com TDD

- Edição isolada: o primeiro teste retornou 404 antes da rota; passou após a implementação.
- Duplicidade: o teste encontrou 503 antes do tratamento e passou com conflito 409, identificando a aplicação existente.
- Remoção: o teste retornou 405 antes da rota; passou com remoção apenas do vínculo selecionado.
- Reenvio após reiniciar a API: os testes detectaram reaplicação da edição e 404 na repetição da remoção; passaram após persistir o resultado da tentativa.
- Restrição de unicidade no banco: a revisão reproduziu erro genérico quando a pré-verificação não encontrava o conflito; após rollback e nova consulta, o teste recebeu 409.

Os testes complementares cobrem campos inválidos, isolamento entre peças, saldo e
status preservados, rollback, chaves incompatíveis e concorrência em PostgreSQL.
Falhas de diretório/configuração na preparação do ambiente não foram contadas como
etapas de teste falhando do TDD. A CI inclui os testes de edição/remoção, importação
e consulta de saldo na etapa PostgreSQL, além das histórias já verificadas.

### Verificação local — 23/11/2026

- Python 3.13.7, `pytest -q --cov --cov-report=term-missing`, com PostgreSQL 17
  descartável em `US03_TEST_DATABASE_URL`: **238 testes aprovados**, sem skips,
  incluindo **22 novos testes de edição/remoção**; cobertura combinada **96%**.
- `ruff check .` e `ruff format --check .`: aprovados. Permanece o aviso
  preexistente de depreciação do TestClient/httpx.
- Interface e API foram exercitadas juntas com PostgreSQL isolado: edição,
  desistência/remoção e recuperação após perda da resposta depois do commit.
  A repetição devolveu o resultado original; os demais vínculos, a peça e o saldo
  de cinco unidades foram preservados. O banco da aplicação em uso não foi alterado.

A ampliação do workflow foi preparada e os cenários foram executados localmente;
não há execução remota destas mudanças registrada. Revisão por outro integrante,
validação com o cliente e verificação em homologação HTTPS continuam pendentes.
Esses resultados não declaram a DoD concluída.
