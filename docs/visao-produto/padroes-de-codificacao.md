# Padrões de codificação {#padroes-de-codificacao}

Estes padrões valem para todo o código do projeto **TSI Peças**, conforme a prática de XP definida em [Estratégias de engenharia de software](estrategias-engenharia-de-software.md#xp) e verificada na [Definition of Done (DoD)](dor-e-dod.md#definition-of-done-dod). O objetivo é que o código pareça escrito por uma só pessoa, facilitando revisões de Pull Request, manutenção e a propriedade coletiva do código.

## 1. Princípios gerais {#principios-gerais}

- **Código simples e legível** antes de código "esperto". Prefira nomes claros a comentários.
- **Funções pequenas**, com uma única responsabilidade.
- **Sem duplicação:** repetiu a mesma lógica pela terceira vez, extraia.
- **Comentários explicam o porquê**, não o quê. Código comentado e `print`/`console.log` de depuração não vão para a `main`.
- **Regras de negócio ficam no back-end** (saldo, baixa de estoque, cancelamento). O front-end apenas exibe e envia dados.
- **Idioma:** identificadores no código em **inglês** (`part`, `stock_balance`); textos de interface, mensagens ao usuário, documentação e commits em **português**.

## 2. Nomenclatura e vocabulário do domínio {#nomenclatura}

| Elemento | Python (back-end) | JavaScript/React (front-end) |
| --- | --- | --- |
| Variáveis e funções | `snake_case` | `camelCase` |
| Classes e tipos | `PascalCase` | `PascalCase` |
| Componentes React | — | `PascalCase` (arquivo `PartForm.jsx`) |
| Constantes | `UPPER_SNAKE_CASE` | `UPPER_SNAKE_CASE` |
| Arquivos e módulos | `snake_case.py` | `camelCase.js` e `PascalCase.jsx` (componentes) |
| Hooks | — | prefixo `use` (`usePartSearch`) |
| Booleanos | prefixo `is_`, `has_`, `can_` | prefixo `is`, `has`, `can` |

Os termos do domínio mantêm um vocabulário único em todo o sistema:

| Termo de negócio | Identificador |
| --- | --- |
| Peça | `part` |
| Código do fabricante | `manufacturer_code` |
| Aplicação por veículo | `vehicle_application` |
| Saldo de estoque | `stock_balance` |
| Movimentação | `stock_movement` (tipos: `entry`, `exit`, `adjustment`, `return`) |
| Venda | `sale` |

## 3. Back-end (Python / FastAPI) {#back-end}

- **Estilo:** PEP 8, com formatação e lint automáticos via `ruff` (`ruff format` e `ruff check`), verificados no pipeline [`app-check.yml`](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/blob/main/.github/workflows/app-check.yml). Linhas com no máximo 100 caracteres.
- **Tipagem:** *type hints* em todas as funções públicas. Modelos de entrada e saída da API com Pydantic.
- **Organização em camadas:** `routers` (HTTP) → `services` (regras de negócio) → `repositories` (acesso a dados) → `models`/`schemas`. Um router nunca acessa o banco diretamente.
- **Valores monetários** com `Decimal`, nunca `float`. Quantidades de estoque como inteiros.
- **Datas e horas** em UTC, no formato ISO 8601.
- **Erros:** levantar exceções de domínio nas camadas internas e traduzi-las em respostas HTTP com status adequado (`400`, `404`, `409`, `422`). Nunca expor detalhes internos ao usuário.
- **Operações de escrita** (entradas, saídas, vendas) executadas em transação, com suporte a chave de idempotência, para atender ao [RNF02](requisitos-de-software.md#rnf02) (sem perda ou duplicidade de dados em falhas de conexão).
- **Segurança:** segredos apenas em variáveis de ambiente, nunca no repositório. Senhas com hash `bcrypt` ([RNF05](requisitos-de-software.md#rnf05)). Toda comunicação por HTTPS.

## 4. Front-end (React / Vite) {#front-end}

- **Estilo:** ESLint e Prettier (`pnpm lint` e `pnpm format:check`), verificados automaticamente na CI. Aspas simples, ponto e vírgula, 2 espaços de indentação.
- **Componentes funcionais** com hooks, um componente por arquivo. Componentes pequenos e reutilizáveis.
- **Separação de responsabilidades:** componentes cuidam da apresentação; chamadas à API ficam em uma camada própria (`services/`), nunca espalhadas pelos componentes.
- **Estado:** manter o estado o mais próximo possível de onde é usado. Evitar estado global sem necessidade.
- **Interface:** responsiva a partir de 360 px, com áreas de toque de pelo menos 44×44 px ([RNF01](requisitos-de-software.md#rnf01)). Mensagens de erro e validação claras, em português.
- **Compatibilidade** com Chrome, Firefox, Edge e Safari, nas duas versões mais recentes ([RNF03](requisitos-de-software.md#rnf03)).

## 5. API REST {#api}

- **REST** com recursos no plural e em minúsculas, separados por hífen: `/parts`, `/stock-movements`, `/sales`.
- **Verbos HTTP:** `GET` leitura, `POST` criação, `PUT`/`PATCH` alteração, `DELETE` exclusão.
- **JSON** com campos em `snake_case`. Respostas de listagem paginadas.
- A documentação interativa (OpenAPI/Swagger) do FastAPI deve estar sempre atualizada.

## 6. Banco de dados {#banco-de-dados}

- Tabelas no **plural** e em `snake_case` (`parts`, `stock_movements`); colunas em `snake_case`.
- Chave primária `id`; chaves estrangeiras no formato `<entidade>_id` (`part_id`).
- Todas as tabelas com `created_at` e `updated_at`.
- Alterações de esquema **sempre por migração versionada**, nunca manualmente no banco.
- O código do fabricante da peça é imutável após o cadastro ([RF05](requisitos-de-software.md#rf05)).

## 7. Testes (TDD) e cobertura {#testes-tdd}

- **Escreva o teste antes da implementação** (TDD): teste falhando → código mínimo → refatoração.
- **Back-end:** `pytest`. **Front-end:** `Vitest` com Testing Library.
- As **regras de saldo e de venda** (entrada, saída, ajuste, devolução, cancelamento) exigem testes unitários, pois a divergência de estoque é a dor central do cliente.
- Nome dos testes descreve o comportamento: `test_exit_reduces_stock_balance`.
- Cada teste é independente e não depende de ordem de execução nem de dados reais.
- Antes de abrir um Pull Request, todos os testes devem passar localmente. O pipeline [`app-check.yml`](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/blob/main/.github/workflows/app-check.yml) executa as suítes e publica os artefatos de cobertura (`coverage-frontend` e `coverage-backend`).

## 8. Git e colaboração {#git-e-colaboracao}

### Branches

| Padrão | Uso |
| --- | --- |
| `main` | Versão estável e publicada. Não se faz push direto |
| `dev` | Integração do trabalho em andamento |
| `feat/<descricao>` | Nova funcionalidade |
| `fix/<descricao>` | Correção. Para issues: `fix/issue-<n>-<descricao>` |
| `docs/<descricao>` | Alteração de documentação |

### Commits

Mensagens em português, no formato *Conventional Commits*, no imperativo e referenciando a issue quando houver (`Refs #<issue>` ou `(#<issue>)`):

```text
<tipo>(<escopo opcional>): <descrição curta> (#<issue>)
```

Tipos adotados: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.

```text
feat(estoque): registra entrada de peças com atualização de saldo (#33)
fix(vendas): reverte a baixa de estoque ao cancelar venda (#39)
docs: corrige cronograma (#54)
```

### Pull Requests

- Todo código entra na `main`/`dev` por Pull Request, **revisado por pelo menos 1 integrante** que não seja o autor.
- O PR descreve o que mudou e por quê, e referencia a issue (`Refs #n` ou `Closes #n`).
- PRs pequenos e focados em uma única mudança.
- Conflitos são resolvidos pelo autor do PR.
- O trabalho segue a [Definition of Done (DoD)](dor-e-dod.md#definition-of-done-dod) definida pela equipe.

## 9. Revisão de código {#revisao-de-codigo}

O revisor verifica, no mínimo, se:

- o código segue este padrão e é compreensível sem explicação oral;
- há testes cobrindo a mudança, principalmente nas regras de negócio;
- não há segredos, dados pessoais ou código de depuração no commit;
- a mudança atende aos critérios de aceitação da issue.

## Versionamento

| Versão | Data | Descrição | Autor(es/as) |
| :----: | :--: | --- | --- |
| 1.0 | 05/10/2026 | Definição dos padrões de codificação, nomenclatura, arquitetura, testes (TDD) e fluxo Git no README do repositório. | Equipe |
| 1.1 | 09/11/2026 | Publicação dos padrões de codificação na documentação do projeto (MkDocs), com vínculos para os RNFs, RF05, DoD e pipeline de CI. | [Bruno Ferreira](https://github.com/brunnf) |
