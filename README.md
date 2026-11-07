# TSI Peças

> Sistema web de cadastro de peças e controle de estoque para a **TSI Peças**, microempresa do setor de autopeças.
> Projeto da equipe **Umbra** para a disciplina de **Requisitos de Software (REQ-T2) — 2026.2**.

📖 **Documentação:** <https://mdsreq-fga-unb.github.io/REQ-202562-T02-TSI-AutoPecas/>

---

## Sobre o projeto

A operação de cadastro, vendas e controle de estoque da TSI Peças é conduzida por um único proprietário e ainda depende de planilhas e registros manuais, o que gera divergências entre o estoque registrado e o estoque real.

O produto propõe uma solução digital simples e confiável para:

- organizar e padronizar o cadastro de peças, usando o código do fabricante e a aplicação por veículo;
- registrar entradas, saídas, ajustes e vendas com saldo de estoque sempre atualizado;
- reduzir o tempo gasto em tarefas operacionais repetitivas.

O escopo do MVP e o cronograma estão na documentação:

| Documento | Conteúdo |
| --- | --- |
| [Visão do produto e projeto](docs/visao-produto/index.md) | Contexto, problema, solução e estratégias do projeto |
| [Requisitos](docs/requisitos/index.md) | Especificação, priorização, MVP, rastreabilidade e evolução do escopo |
| [Cronograma](docs/visao-produto/cronograma-e-entregas.md) | Períodos, objetivos, histórias previstas e validações de cada sprint |
| [Catálogo de requisitos](docs/visao-produto/requisitos-de-software.md) | Registro único de cada RF e RNF, com origem, condições, priorização, entrega e situação |
| [Priorização](docs/visao-produto/priorizacao.md) | Método de priorização e decisões gerais de escopo |
| [Rastreabilidade](docs/visao-produto/rastreabilidade.md) | Tipos de vínculo entre os elementos do escopo |
| [Organização e atualização](docs/visao-produto/historico-de-evolucao.md) | Rotina de atualização e decisões que alteraram o escopo |
| [Atas](docs/atas/index.md) | Registro das reuniões de cada sprint |
| [Entregas](docs/entregas/index.md) | Entregas da disciplina |

## Tecnologias

| Componente | Tecnologia |
| --- | --- |
| Front-end | React com Vite e pnpm |
| Back-end | Python com FastAPI e uv |
| Banco de dados | PostgreSQL por meio do Supabase |
| Publicação do front-end | Vercel |
| Publicação do back-end | Render |
| Ambiente de desenvolvimento | Docker |
| Controle de versão | Git e GitHub |
| Documentação | MkDocs com o tema Material |

## Organização do repositório

```text
.github/          Formulários de issues e workflows
backend/          FastAPI, testes, migrações e Dockerfile
frontend/         React/Vite, testes e Dockerfile
docs/             Páginas e recursos publicados no MkDocs
tools/docs/       Dados, scripts, hooks, tema e testes da documentação
compose.yaml      Ambiente local conjunto
render.yaml       Configuração de deploy da API
mkdocs.yml        Configuração do site
```

Os arquivos `frontend/pnpm-lock.yaml` e `backend/uv.lock` são versionados.
Dependências instaladas, ambientes virtuais, builds, caches e arquivos `.env`
são locais e estão cobertos pelo `.gitignore`. Os exemplos `.env.example` são
versionados sem credenciais reais. Ambientes Linux/WSL e Windows devem instalar
suas próprias dependências; não compartilhe `node_modules` ou `.venv` entre eles.

## Executando a aplicação

Com Docker Desktop/Engine e Docker Compose 2.24 ou superior, na raiz:

```bash
docker compose up --build
```

- Front-end: <http://localhost:5173>.
- API: <http://localhost:8000/health>.
- OpenAPI: <http://localhost:8000/docs>.

Os exemplos de ambiente têm valores locais padrão; os arquivos `.env` são opcionais
no Compose. Os diretórios de código são montados para permitir recarga automática.
Após alterar dependências, execute novamente `docker compose up --build`.
Para encerrar o ambiente, use `docker compose down`.

Para executar sem Docker, siga [Front-end](frontend/README.md) e
[Back-end](backend/README.md). Use Node conforme `frontend/.nvmrc`, pnpm conforme
`frontend/package.json` e Python 3.13 com uv. A base inicial verifica a comunicação
entre os serviços; as funcionalidades do MVP serão implementadas pelas US.

## Documentação e automação do backlog

O conteúdo publicado permanece em `docs/`. A base do catálogo fica em
`tools/docs/data/backlog.json`; narrativa e critérios vêm das issues. Os formulários
continuam em `.github/ISSUE_TEMPLATE/`. Consulte
[Organização e atualização](docs/visao-produto/historico-de-evolucao.md).

Crie e ative um ambiente Python exclusivo da documentação em `tools/docs/.venv`
antes de instalar os pacotes abaixo. Na raiz:

```bash
python -m pip install -r tools/docs/requirements.txt
python tools/docs/scripts/backlog.py sync
python tools/docs/scripts/backlog.py check
python -m unittest discover -s tools/docs/tests -t tools/docs -v
python -m mkdocs serve
```

O site local atende em
<http://127.0.0.1:8000/REQ-202562-T02-TSI-AutoPecas/>. Se a API estiver usando a porta
8000, execute `python -m mkdocs serve -a 127.0.0.1:8002`.
A coleta é somente de leitura e o snapshot descartável fica em
`.cache/docs/backlog/github.json`. Sem coleta, o catálogo mantém as 40 US com os
campos remotos identificados como pendentes. As dependências de documentação e API
são instaladas em ambientes separados.

## Publicação

| Parte | Configuração |
| --- | --- |
| Documentação | GitHub Actions e GitHub Pages, mantendo `mkdocs.yml` na raiz |
| Front-end | Vercel: diretório `frontend/`, Node 22, `ENABLE_EXPERIMENTAL_COREPACK=1` e `VITE_API_BASE_URL` com a URL HTTPS da API |
| API | Render: Blueprint `render.yaml`, com build do Dockerfile de produção em `backend/` |
| Banco | PostgreSQL no Supabase; conexão e migrações serão implementadas nas histórias de persistência |

No Render, informe `CORS_ORIGINS` como lista JSON dos domínios autorizados da Vercel
e `DATABASE_URL` com a conexão do banco. A API respeita a variável `PORT` do serviço.
Credenciais do banco ficam somente no back-end; variáveis `VITE_` são públicas.
Nenhum deploy é executado pela criação desses arquivos.

O workflow de aplicação valida testes, lint, formatação, build e contêineres, sem
publicar imagens. O workflow da documentação continua independente e preserva os
gatilhos de atualização do backlog por issues, PRs e reconciliação periódica.

## Processo de desenvolvimento

- **Scrum:** papéis, eventos, artefatos e ciclos adaptados conforme as
  [estratégias do projeto](docs/visao-produto/estrategias-engenharia-de-software.md).
- **XP:** TDD, refatoração, integração contínua, padrões de código, design simples,
  propriedade coletiva e testes de aceitação, conforme as práticas adotadas.
- **Organização do trabalho:** GitHub Issues e GitHub Projects.
- **Validação:** revisão com o cliente, com registro em ata.

---

## Padrões de codificação

Estas regras valem para todo o código do projeto. O objetivo é que o código pareça escrito por uma só pessoa, facilitando revisões e a propriedade coletiva.

### 1. Princípios gerais

- **Código simples e legível** antes de código "esperto". Prefira nomes claros a comentários.
- **Funções pequenas**, com uma única responsabilidade.
- **Sem duplicação:** repetiu a mesma lógica pela terceira vez, extraia.
- **Comentários explicam o porquê**, não o quê. Código comentado e `print`/`console.log` de depuração não vão para a `main`.
- **Regras de negócio ficam no back-end** (saldo, baixa de estoque, cancelamento). O front-end apenas exibe e envia dados.
- **Idioma:** identificadores no código em **inglês** (`part`, `stock_balance`); textos de interface, mensagens ao usuário, documentação e commits em **português**.

### 2. Nomenclatura

| Elemento | Python (back-end) | JavaScript/React (front-end) |
| --- | --- | --- |
| Variáveis e funções | `snake_case` | `camelCase` |
| Classes e tipos | `PascalCase` | `PascalCase` |
| Componentes React | — | `PascalCase` (arquivo `PartForm.jsx`) |
| Constantes | `UPPER_SNAKE_CASE` | `UPPER_SNAKE_CASE` |
| Arquivos e módulos | `snake_case.py` | `camelCase.js` e `PascalCase.jsx` (componentes) |
| Hooks | — | prefixo `use` (`usePartSearch`) |
| Booleanos | prefixo `is_`, `has_`, `can_` | prefixo `is`, `has`, `can` |

Termos do domínio mantêm um vocabulário único em todo o sistema:

| Termo de negócio | Identificador |
| --- | --- |
| Peça | `part` |
| Código do fabricante | `manufacturer_code` |
| Aplicação por veículo | `vehicle_application` |
| Saldo de estoque | `stock_balance` |
| Movimentação | `stock_movement` (tipos: `entry`, `exit`, `adjustment`, `return`) |
| Venda | `sale` |

### 3. Back-end (Python / FastAPI)

- **Estilo:** PEP 8, com formatação e lint automáticos via `ruff` (`ruff format` e `ruff check`). Linhas com no máximo 100 caracteres.
- **Tipagem:** *type hints* em todas as funções públicas. Modelos de entrada e saída da API com Pydantic.
- **Organização em camadas:** `routers` (HTTP) → `services` (regras de negócio) → `repositories` (acesso a dados) → `models`/`schemas`. Um router nunca acessa o banco diretamente.
- **Valores monetários** com `Decimal`, nunca `float`. Quantidades de estoque como inteiros.
- **Datas e horas** em UTC, no formato ISO 8601.
- **Erros:** levantar exceções de domínio nas camadas internas e traduzi-las em respostas HTTP com status adequado (`400`, `404`, `409`, `422`). Nunca expor detalhes internos ao usuário.
- **Operações de escrita** (entradas, saídas, vendas) executadas em transação, com suporte a chave de idempotência, para atender ao RNF02 (sem perda ou duplicidade de dados em falhas de conexão).
- **Segurança:** segredos apenas em variáveis de ambiente, nunca no repositório. Senhas com hash `bcrypt` (RNF05). Toda comunicação por HTTPS.

### 4. Front-end (React / Vite)

- **Estilo:** ESLint e Prettier. Aspas simples, ponto e vírgula, 2 espaços de indentação.
- **Componentes funcionais** com hooks, um componente por arquivo. Componentes pequenos e reutilizáveis.
- **Separação de responsabilidades:** componentes cuidam da apresentação; chamadas à API ficam em uma camada própria (`services/`), nunca espalhadas pelos componentes.
- **Estado:** manter o estado o mais próximo possível de onde é usado. Evitar estado global sem necessidade.
- **Interface:** responsiva a partir de 360 px, com áreas de toque de pelo menos 44×44 px (RNF01). Mensagens de erro e validação claras, em português.
- **Compatibilidade** com Chrome, Firefox, Edge e Safari, nas duas versões mais recentes (RNF03).

### 5. API

- **REST** com recursos no plural e em minúsculas, separados por hífen: `/parts`, `/stock-movements`, `/sales`.
- **Verbos HTTP:** `GET` leitura, `POST` criação, `PUT`/`PATCH` alteração, `DELETE` exclusão.
- **JSON** com campos em `snake_case`. Respostas de listagem paginadas.
- A documentação interativa (OpenAPI/Swagger) do FastAPI deve estar sempre atualizada.

### 6. Banco de dados

- Tabelas no **plural** e em `snake_case` (`parts`, `stock_movements`); colunas em `snake_case`.
- Chave primária `id`; chaves estrangeiras no formato `<entidade>_id` (`part_id`).
- Todas as tabelas com `created_at` e `updated_at`.
- Alterações de esquema **sempre por migração versionada**, nunca manualmente no banco.
- O código do fabricante da peça é imutável após o cadastro (RF05).

### 7. Testes (TDD)

- **Escreva o teste antes da implementação** (TDD): teste falhando → código mínimo → refatoração.
- **Back-end:** `pytest`. **Front-end:** `Vitest` com Testing Library.
- As **regras de saldo e de venda** (entrada, saída, ajuste, devolução, cancelamento) exigem testes unitários, pois a divergência de estoque é a dor central do cliente.
- Nome dos testes descreve o comportamento: `test_exit_reduces_stock_balance`.
- Cada teste é independente e não depende de ordem de execução nem de dados reais.
- Antes de abrir um Pull Request, todos os testes devem passar localmente.

### 8. Git e colaboração

**Branches**

| Padrão | Uso |
| --- | --- |
| `main` | Versão estável e publicada. Não se faz push direto |
| `dev` | Integração do trabalho em andamento |
| `feat/<descricao>` | Nova funcionalidade |
| `fix/<descricao>` | Correção. Para issues: `fix/issue-<n>-<descricao>` |
| `docs/<descricao>` | Alteração de documentação |

**Commits**: mensagens em português, no formato *Conventional Commits*, no imperativo e referenciando a issue quando houver:

```text
<tipo>(<escopo opcional>): <descrição curta> (#<issue>)
```

Tipos: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.

```text
feat(estoque): registra entrada de peças com atualização de saldo (#21)
fix(vendas): reverte a baixa de estoque ao cancelar venda (#34)
docs: corrige cronograma
```

**Pull Requests**

- Todo código entra na `main`/`dev` por Pull Request, **revisado por pelo menos 1 integrante** que não seja o autor.
- O PR descreve o que mudou e por quê, e referencia a issue (`Closes #n`).
- PRs pequenos e focados em uma única mudança.
- Conflitos são resolvidos pelo autor do PR.
- O trabalho segue a **Definition of Done** definida pela equipe.

### 9. Revisão de código

O revisor verifica, no mínimo, se:

- o código segue este padrão e é compreensível sem explicação oral;
- há testes cobrindo a mudança, principalmente nas regras de negócio;
- não há segredos, dados pessoais ou código de depuração no commit;
- a mudança atende aos critérios de aceitação da issue.

---

## Equipe

| Integrante | Papel | GitHub |
| --- | --- | --- |
| João Guilherme Amancio de Melo | Gerente de projeto / Product Owner | [@jot4-ge](https://github.com/jot4-ge) |
| Luiz Henrique Tomaz Moreira | Desenvolvedor back-end / Scrum Master | [@luizhtmoreira](https://github.com/luizhtmoreira) |
| Bruno Ferreira Dornelas | Desenvolvedor back-end | [@brunnf](https://github.com/brunnf) |
| Rodrigo Carvalho Barbosa | Desenvolvedor front-end | [@RodrigoCBarbosa](https://github.com/RodrigoCBarbosa) |
| Leonardo da Silva Lopes Júnior | Analista de QA | [@LeonardoLopesJr](https://github.com/LeonardoLopesJr) |
| Thiago Gomes Pereira de Abreu | Analista de requisitos | [@thgomxs](https://github.com/thgomxs) |

Todos os integrantes também atuam como analistas de requisitos.
