# Cronograma e entregas

## 6 Cronograma e entregas

A proposta de cronograma da **TSI Peças** organiza o semestre **2026.2** em ciclos de desenvolvimento e marcos de entrega da disciplina. A organização do trabalho utiliza elementos do Scrum, e as práticas técnicas selecionadas do XP estão detalhadas na seção 6.2.

### 6.1 Scrum — organização dos ciclos

| Ciclo | Período | Duração | Objetivo Principal e CPs | Entregas Esperadas | Validação do Cliente |
| --- | --- | --- | --- | --- | --- |
| **Preparação (Sprint 0)** | 24/08/2026 a 07/09/2026 | 15 dias | Definição do escopo, visão do produto e projeto; decisões de arquitetura e ferramentas; levantamento inicial de requisitos (Entrega U1)<br>**CPs:** — | Documento de Visão do Produto e Projeto; Rich Picture; Mapa de Stakeholders; Decisão de arquitetura documentada; Stack definida; Ambiente configurado | Validação do documento de visão, arquitetura e ferramentas pelo cliente e professor |
| **Sprint 1** | 08/09/2026 a 19/09/2026 | 12 dias | Cadastro de peças<br>**CPs:** CP01 | Funcionalidade CP01 implementada e testada; User Stories da CP01 atendendo ao DoD; Testes unitários da CP01 | Revisão da sprint com o cliente; validação da CP01 |
| **Sprint 2** | 20/09/2026 a 01/10/2026 | 12 dias | Classificação e busca de peças<br>**CPs:** CP02 | Funcionalidade CP02 implementada e testada; Integração CP02 com CP01 validada; Testes unitários da CP02 | Demonstração da CP02 ao cliente; validação da integração com CP01 |
| **Sprint 3** | 02/10/2026 a 12/10/2026 | 11 dias | Controle de movimentação de estoque e consolidação do MVP (Entrega U2)<br>**CPs:** CP03 | Funcionalidade CP03 implementada e testada; MVP consolidado (CP01 + CP02 + CP03); Backlog refinado para próximas fases; Testes de integração do MVP | Validação do MVP completo com o cliente antes da apresentação da U2 |
| **Sprint 4** | 13/10/2026 a 29/10/2026 | 17 dias | Consulta de disponibilidade e alertas<br>**CPs:** CP04 | Funcionalidade CP04 implementada e testada; Integração com CP01–CP03 validada; Correções de bugs apontados na U2; Testes unitários da CP04 | Revisão da sprint com o cliente; validação da CP04 e das correções |
| **Sprint 5** | 30/10/2026 a 16/11/2026 | 18 dias | Agilização do cadastro e da consulta e Validação de Requisitos (Entrega U3)<br>**CPs:** CP05 | Funcionalidade CP05 implementada e testada; Integração completa do produto validada; Testes de sistema; Documentação técnica atualizada | Homologação da CP05 e da integração geral com o cliente |
| **Sprint 6** | 17/11/2026 a 30/11/2026 | 14 dias | Relatórios de movimentação, polimento final e entrega (Entrega U4)<br>**CPs:** CP06 | Funcionalidade CP06 implementada e testada; Produto final entregável (CP01–CP06); Testes de aceitação; Documentação completa (manual do usuário + técnica); Vídeo de demonstração; Apresentação final | Aceite formal do produto pelo cliente; validação da apresentação final |

As durações incluem as datas de início e fim. Os ciclos 1 a 6 variam entre **11 e 18 dias**, conforme o calendário acadêmico; a preparação inicial é apresentada separadamente. O Scrum prevê sprints de duração fixa: manter esses intervalos representa uma adaptação do projeto, sem equivalência a sprints quinzenais regulares.

- **Planejamento:** no início de cada ciclo, definir uma meta, selecionar os itens do backlog e reservar capacidade para testes, integração, revisão e facilitação.
- **Inspeção e adaptação:** acompanhar o progresso diariamente; realizar revisão com o cliente e retrospectiva ao final de cada ciclo, registrando decisões e melhorias.
- **Marcos acadêmicos:** os ciclos de U1, U2, U3 e U4 encerram, respectivamente, em 07/09, 12/10, 16/11 e 30/11, antes dos prazos da disciplina. As demais revisões seguem o encerramento de seus próprios ciclos.

### 6.2 XP — práticas previstas por sprint

| Sprint | Aplicação prevista | Evidências a registrar |
| --- | --- | --- |
| **1 — CP01** | Configurar a CI da aplicação com testes e build; iniciar TDD nas regras críticas de cadastro e manter o design focado no MVP. | Pipeline executado, testes e PRs com o ciclo teste–implementação–refatoração descrito. |
| **2 — CP02** | Aplicar TDD às regras de busca; testar a integração com o cadastro e refatorar duplicações identificadas. | Testes de busca e integração aprovados na CI; PRs de refatoração. |
| **3 — CP03** | Aplicar TDD ao saldo, às entradas, saídas e baixa por venda; realizar pareamento pontual nessas regras e refatorar com os testes aprovados. | Registro da sessão com participantes e PR associado; testes das movimentações e da integração do MVP na CI. |
| **4 — CP04** | Aplicar TDD às regras de disponibilidade e alertas; criar testes de regressão para defeitos corrigidos e refatorar quando necessário. | Testes de regras e regressão aprovados na CI; alterações de comportamento e refatorações identificadas nos PRs. |
| **5 — CP05** | Testar os fluxos de cadastro e consulta; aplicar TDD a novas regras de negócio, se houver, e simplificar o código existente. | Testes de sistema e integração na CI; PRs com as melhorias e refatorações realizadas. |
| **6 — CP06** | Aplicar TDD às regras de consolidação dos relatórios e executar testes de integração, aceitação e regressão. | Testes dos relatórios e da aplicação aprovados; registros de aceitação e execuções da CI. |

- **Práticas contínuas:** integrar mudanças pequenas durante todos os ciclos de desenvolvimento, manter padrões comuns e compartilhar a responsabilidade pelo código. Refatoração preserva comportamento; correção de bugs altera o comportamento incorreto.
- **Pareamento pontual:** dois desenvolvedores trabalharão juntos na sessão prevista para a Sprint 3, com horário definido no planejamento. A agenda acadêmica limita a adoção contínua; impedimentos e eventual reagendamento serão registrados.
- **Revisão complementar:** cada PR será revisado por outro desenvolvedor. Essa revisão não equivale à programação em pares.
- **Situação das evidências:** a tabela registra o planejamento. Testes, PRs, sessões e execuções da CI deverão ser vinculados às tarefas e atas quando ocorrerem.

## Versionamento

| Versão | Data | Descrição | Autor(es/as) |
| :----: | :--: | --- | --- |
| 1.0 | 04/09/2026 | Iniciação do documento | [Thiago Gomes](https://github.com/thgomxs) |
| 1.1 | 07/09/2026 | Adição da tabela de Cronograma de Sprints | [Bruno Ferreira](https://github.com/brunnf) |
| 1.2 | 15/09/2026 | Issue #6: datas preservadas, duração dos ciclos explicitada e planejamento das práticas de XP por sprint | [Thiago Gomes](https://github.com/thgomxs) |
