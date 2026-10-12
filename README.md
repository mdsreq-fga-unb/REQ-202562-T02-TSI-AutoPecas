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

O escopo do MVP, com 13 requisitos funcionais, e o cronograma estão na documentação:

| Documento | Conteúdo |
| --- | --- |
| [Visão do produto e projeto](docs/visao-produto/index.md) | Contexto, problema, solução, requisitos e planejamento |
| [Requisitos de software](docs/visao-produto/requisitos-de-software.md) | Requisitos funcionais (RF) e não funcionais (RNF) |
| [Backlog de produto](docs/visao-produto/backlog-de-produto.md) | Priorização e definição do MVP |
| [Cronograma e entregas](docs/visao-produto/cronograma-e-entregas.md) | Sprints, entregas e validações com o cliente |
| [Atas](docs/atas/index.md) | Registro das reuniões de cada sprint |
| [Entregas](docs/entregas/index.md) | Entregas da disciplina |

## Tecnologias

| Componente | Tecnologia |
| --- | --- |
| Front-end | React com Vite |
| Back-end | Python com FastAPI |
| Banco de dados | PostgreSQL por meio do Supabase |
| Publicação do front-end | Vercel |
| Publicação do back-end | Render |
| Ambiente de desenvolvimento | Docker |
| Controle de versão | Git e GitHub |
| Documentação | MkDocs com o tema Material |

## Processo de desenvolvimento

- **Processo:** ScrumXP, com sprints de 14 dias que terminam às quintas-feiras.
- **Backlog e tarefas:** GitHub Issues e GitHub Projects (quadro Kanban).
- **Validação:** revisão com o cliente ao final de cada sprint, com registro em ata.
- **Práticas técnicas do XP:** TDD, refatoração contínua, design simples, programação em pares e propriedade coletiva do código.

## Executando a documentação localmente

Requisitos: Python 3.

```bash
pip install mkdocs-material
python -m mkdocs serve
```

O site fica disponível em `http://127.0.0.1:8000/REQ-202562-T02-TSI-AutoPecas/`, com recarregamento automático. A publicação no GitHub Pages é feita por GitHub Actions a cada push na `main`.

---

## Padrões de codificação

Estas regras valem para todo o código do projeto. O objetivo é que o código pareça escrito por uma só pessoa, o que facilita revisões, programação em pares e a propriedade coletiva.

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
- O trabalho segue a **Definition of Done** definida pela equipe. Código crítico é preferencialmente desenvolvido em **programação em pares**.

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
