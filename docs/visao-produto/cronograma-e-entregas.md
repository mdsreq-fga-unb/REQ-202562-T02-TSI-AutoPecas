---
icon: material/calendar-clock
---

# <span id="6-cronograma-e-entregas"></span><span id="cronograma-e-entregas"></span>Cronograma {#cronograma}


A partir da estratégia de desenvolvimento ágil estabelecida para o projeto **TSI Peças**, o semestre foi organizado em sprints de duas semanas, ancoradas nas quintas-feiras em semanas alternadas. A Sprint 0 é excepcional, com 17 dias, por cobrir a formação da equipe, a descoberta do domínio e a elaboração do documento de visão. O planejamento é preliminar e será atualizado ao final de cada sprint com base no progresso real e no feedback do cliente.

O desenvolvimento do produto começa na Sprint 3 e é planejado por **histórias de usuário (US)**, que detalham os **13 requisitos funcionais (RFs) selecionados para o MVP** na [priorização](priorizacao.md) (Score ≥ 4). Cada US mantém o número do RF de origem (por exemplo, US01 detalha o RF01) e está registrada no campo *Narrativa da US* do [registro do requisito](requisitos-de-software.md#registros-dos-requisitos-funcionais). As USs dos RFs condicionados à capacidade da equipe foram retiradas do cronograma, para evitar sobrecarga, e os demais RFs permanecem como evolução futura. A declaração vigente de cada RF está no [Catálogo de requisitos](requisitos-de-software.md).

Para separar o que foi planejado do que já foi executado e verificado, o detalhamento de cada sprint distingue **Atividades planejadas**, **Resultados comprovados e evidências** (com links diretos para documentos, PRs, workflows de CI, atas e identificação de quem acompanha cada entrega) e, nas sprints em andamento ou futuras, **Entregas previstas (a comprovar)**.

<div class="schedule-page" markdown="1">

## Visão geral

Selecione uma sprint para consultar seu planejamento completo.

<table class="schedule-overview">
<thead><tr><th scope="col">Sprint</th><th scope="col">Período</th><th scope="col">Foco</th><th scope="col">Status</th></tr></thead>
<tbody>
<tr>
<td data-label="Sprint"><a href="#sprint-0" data-sprint-link>Sprint 0</a></td>
<td data-label="Período"><time datetime="2026-08-24">24/08/2026</time><br>a <time datetime="2026-09-10">10/09/2026</time></td>
<td data-label="Foco">Descoberta do negócio e preparação do projeto</td>
<td data-label="Status"><span class="delivery-status delivery-status--done">Concluída</span></td>
</tr>
<tr>
<td data-label="Sprint"><a href="#sprint-1" data-sprint-link>Sprint 1</a></td>
<td data-label="Período"><time datetime="2026-09-11">11/09/2026</time><br>a <time datetime="2026-09-24">24/09/2026</time></td>
<td data-label="Foco">Revisão da visão e levantamento de requisitos</td>
<td data-label="Status"><span class="delivery-status delivery-status--done">Concluída</span></td>
</tr>
<tr>
<td data-label="Sprint"><a href="#sprint-2" data-sprint-link>Sprint 2</a></td>
<td data-label="Período"><time datetime="2026-09-25">25/09/2026</time><br>a <time datetime="2026-10-08">08/10/2026</time></td>
<td data-label="Foco">Priorização do MVP e padrões técnicos</td>
<td data-label="Status"><span class="delivery-status delivery-status--done">Concluída</span></td>
</tr>
<tr>
<td data-label="Sprint"><a href="#sprint-3" data-sprint-link>Sprint 3</a></td>
<td data-label="Período"><time datetime="2026-10-09">09/10/2026</time><br>a <time datetime="2026-10-22">22/10/2026</time></td>
<td data-label="Foco">Cadastro, edição e status das peças</td>
<td data-label="Status"><span class="delivery-status schedule-status--debt">Parcial</span></td>
</tr>
<tr>
<td data-label="Sprint"><a href="#sprint-4" data-sprint-link>Sprint 4</a></td>
<td data-label="Período"><time datetime="2026-10-23">23/10/2026</time><br>a <time datetime="2026-11-05">05/11/2026</time></td>
<td data-label="Foco">Catálogo, importação, entradas e saldo</td>
<td data-label="Status"><span class="delivery-status schedule-status--debt">Parcial</span></td>
</tr>
<tr>
<td data-label="Sprint"><a href="#sprint-5" data-sprint-link>Sprint 5</a></td>
<td data-label="Período"><time datetime="2026-11-06">06/11/2026</time><br>a <time datetime="2026-11-19">19/11/2026</time></td>
<td data-label="Foco">Movimentações, vendas e validação do MVP</td>
<td data-label="Status"><span class="delivery-status schedule-status--active">Em andamento</span></td>
</tr>
<tr>
<td data-label="Sprint"><a href="#sprint-6" data-sprint-link>Sprint 6</a></td>
<td data-label="Período"><time datetime="2026-11-20">20/11/2026</time><br>a <time datetime="2026-12-03">03/12/2026</time></td>
<td data-label="Foco">Implantação, carga inicial e treinamento</td>
<td data-label="Status"><span class="delivery-status">Planejada</span></td>
</tr>
</tbody>
</table>

## Detalhamento por sprint

<div class="schedule-controls">
<button type="button" class="schedule-toggle" data-schedule-toggle aria-expanded="false" aria-controls="sprint-0 sprint-1 sprint-2 sprint-3 sprint-4 sprint-5 sprint-6" hidden>Expandir todas as sprints</button>
</div>

<details class="sprint-details" id="sprint-0" markdown="1">
<summary><span class="sprint-details__title">Sprint 0</span><span class="sprint-details__period"><time datetime="2026-08-24">24/08/2026</time> a <time datetime="2026-09-10">10/09/2026</time></span><span class="delivery-status delivery-status--done">Concluída</span></summary>
<div class="sprint-details__body" markdown="1">

**Objetivo**

Compreender o domínio de autopeças, definir o escopo do produto e preparar o ambiente de desenvolvimento

**Histórias previstas**

—

**Atividades planejadas**

- Elaboração do Documento de Visão do Produto e Projeto (seções 1 a 7 do template original)
- Elaboração do Rich Picture e da análise de causas (Ishikawa) do cenário operacional da loja
- Estruturação inicial do repositório Git/GitHub e publicação da documentação no GitHub Pages

**Resultados comprovados e evidências**

- [Documento de Visão do Produto e Projeto](index.md) e [Entrega 1](../entregas/entrega-1.md) — *Acompanhamento: João Melo (coordenação/PO), Leonardo Lopes, Rodrigo Barbosa e Bruno Ferreira*
- [Rich Picture e Diagrama de Ishikawa](cenario-problema-e-desafios.md#rich-picture) — *Acompanhamento: João Melo*
- [Repositório estruturado no GitHub](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas) e workflow de publicação da documentação ([`docs.yml`](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/blob/main/.github/workflows/docs.yml)) — *Acompanhamento: Thiago Gomes e Luiz Moreira*

**Validação com o cliente**

Validação da viabilidade do projeto: o proprietário confirma que os problemas e as necessidades descritos refletem a realidade da loja — *Acompanhamento: João Melo (PO)*

**Registro da sprint:** [Ata da Sprint 0](../atas/sprint-0.md)

</div>
</details>

<details class="sprint-details" id="sprint-1" markdown="1">
<summary><span class="sprint-details__title">Sprint 1</span><span class="sprint-details__period"><time datetime="2026-09-11">11/09/2026</time> a <time datetime="2026-09-24">24/09/2026</time></span><span class="delivery-status delivery-status--done">Concluída</span></summary>
<div class="sprint-details__body" markdown="1">

**Objetivo**

Correção dos feedbacks do professor; elicitar, analisar e declarar os requisitos do sistema a partir das características de produto (CPs) revisadas

**Histórias previstas**

—

**Atividades planejadas**

- Correção dos apontamentos da Unidade 1 no Documento de Visão do Produto
- Revisão dos Objetivos Específicos (OE1 a OE6) e das Características de Produto (CP1 a CP9)
- Elicitação, análise e declaração dos requisitos funcionais e não funcionais derivados das CPs

**Resultados comprovados e evidências**

- [Correções da Unidade 1 rastreadas por issue e PR (PRs #11 a #18)](../entregas/entrega-2.md) — *Acompanhamento: João Melo (#11, #16), Bruno Ferreira (#13), Thiago Gomes (#14), Luiz Moreira (#15), Leonardo Lopes (#17) e Rodrigo Barbosa (#18)*
- [Objetivos específicos e características de produto revisados](solucao-e-caracteristicas.md#objetivos-especificos-oe-do-produto) — *Acompanhamento: João Melo e Thiago Gomes*
- [Catálogo de requisitos funcionais e não funcionais](requisitos-de-software.md) — *Acompanhamento: Thiago Gomes e Luiz Moreira*

**Validação com o cliente**

Apresentação dos requisitos e funcionalidades levantados ao proprietário para alinhamento — *Acompanhamento: João Melo (PO) e Equipe*

**Registro da sprint:** [Ata da Sprint 1](../atas/sprint-1.md)

</div>
</details>

<details class="sprint-details" id="sprint-2" markdown="1">
<summary><span class="sprint-details__title">Sprint 2</span><span class="sprint-details__period"><time datetime="2026-09-25">25/09/2026</time> a <time datetime="2026-10-08">08/10/2026</time></span><span class="delivery-status delivery-status--done">Concluída</span></summary>
<div class="sprint-details__body" markdown="1">

**Objetivo**

Consolidar os requisitos e o backlog priorizado e definir os padrões técnicos do projeto, sem desenvolvimento de funcionalidades

**Histórias previstas**

—

**Atividades planejadas**

- Consolidação dos requisitos funcionais (RF01 a RF40) e não funcionais (RNF01 a RNF05)
- Priorização do backlog e definição do escopo do MVP (13 RFs)
- Definição e adoção do padrão de codificação, nomenclatura, arquitetura em camadas e convenções de Git
- Preparação inicial do pipeline de integração contínua (CI)

**Resultados comprovados e evidências**

- [Catálogo de requisitos](requisitos-de-software.md), [Priorização](priorizacao.md) e [MVP definido com 13 RFs](requisitos-de-software.md#objetivo-do-incremento) — *Acompanhamento: Luiz Moreira (consolidação de VN e MoSCoW), Thiago Gomes (matriz e catálogo) e João Melo (PO)*
- [Padrões de codificação, arquitetura e versionamento](padroes-de-codificacao.md) (também publicados no [`README.md`](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas#padr%C3%B5es-de-codifica%C3%A7%C3%A3o)) — *Acompanhamento: Bruno Ferreira, Luiz Moreira e Rodrigo Barbosa*
- Automação de publicação da documentação ([`docs.yml`](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/blob/main/.github/workflows/docs.yml)) e pipeline de CI da aplicação ([`app-check.yml`](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/blob/main/.github/workflows/app-check.yml), consolidado via [PR #57](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/57)) — *Acompanhamento: Thiago Gomes, Bruno Ferreira e Luiz Moreira*

**Validação com o cliente**

Validação do escopo e dos critérios de aceite do MVP com o proprietário — *Acompanhamento: João Melo (PO) e Luiz Moreira*

**Registro da sprint:** [Ata da Sprint 2](../atas/sprint-2.md)

</div>
</details>

<details class="sprint-details" id="sprint-3" markdown="1">
<summary><span class="sprint-details__title">Sprint 3</span><span class="sprint-details__period"><time datetime="2026-10-09">09/10/2026</time> a <time datetime="2026-10-22">22/10/2026</time></span><span class="delivery-status schedule-status--debt">Parcial</span></summary>
<div class="sprint-details__body" markdown="1">

**Objetivo**

Definir o DoR e o DoD; corrigir os apontamentos da Unidade 2; iniciar o catálogo de peças com cadastro, edição e status

**Histórias previstas**

[US01](requisitos-de-software.md#rf01), [US05](requisitos-de-software.md#rf05), [US06](requisitos-de-software.md#rf06)

**Atividades planejadas**

- Consolidação da [Entrega 2](../entregas/entrega-2.md) e das correções solicitadas pelo professor
- Definição e adoção de DoR e DoD pela equipe
- Desenvolvimento de US01 (cadastro de peça), US05 (edição de peça) e US06 (alteração de status ativo/inativo) com testes unitários escritos antes da implementação (TDD)
- Relatório de cobertura de testes como critério de verificação da DoD

**Resultados comprovados e evidências**

- [DoR e DoD definidos e publicados](dor-e-dod.md) — *Acompanhamento: Leonardo Lopes (DoR), João Melo (DoD) e Thiago Gomes (revisão)*
- [Entrega 2 consolidada e correções da Unidade 1 rastreadas](../entregas/entrega-2.md) — *Acompanhamento: Thiago Gomes e João Melo*
- Estruturação dos 3 épicos (`#41` a `#43`) e das 13 histórias de usuário do MVP (`#27` a `#39`) no [GitHub Issues e GitHub Projects](interacao-equipe-cliente.md#evidencias) — *Acompanhamento: Thiago Gomes, Rodrigo Barbosa e Luiz Moreira*
- [Validação assíncrona do papel de Gerente de projeto / Product Owner com o cliente](../atas/validacao-papel-po.md) — *Acompanhamento: Luiz Moreira e João Melo*

**Débito transferido para a Sprint 5**

- A implementação de [US01](requisitos-de-software.md#rf01) ([Issue #27](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/27)), [US05](requisitos-de-software.md#rf05) ([Issue #31](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/31)) e [US06](requisitos-de-software.md#rf06) ([Issue #32](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/32)), bem como a validação da cobertura de testes na CI e a demonstração dessas telas ao cliente, não foram concluídas no período e foram reprogramadas como débito para a [Sprint 5](#sprint-5) — *Acompanhamento: Bruno Ferreira, Luiz Moreira, Rodrigo Barbosa e Leonardo Lopes*

**Validação com o cliente**

Confirmação da lista final de 13 RFs do MVP ([Ata da Sprint 3](../atas/sprint-3.md)) e [validação do papel de PO](../atas/validacao-papel-po.md); demonstração das telas de cadastro, edição e status transferida como débito para a Sprint 5 — *Acompanhamento: João Melo (PO) e Luiz Moreira*

**Registro da sprint:** [Ata da Sprint 3](../atas/sprint-3.md) · [Validação assíncrona do papel de PO](../atas/validacao-papel-po.md)

</div>
</details>

<details class="sprint-details" id="sprint-4" markdown="1">
<summary><span class="sprint-details__title">Sprint 4</span><span class="sprint-details__period"><time datetime="2026-10-23">23/10/2026</time> a <time datetime="2026-11-05">05/11/2026</time></span><span class="delivery-status schedule-status--debt">Parcial</span></summary>
<div class="sprint-details__body" markdown="1">

**Objetivo**

Concluir o catálogo de peças, importar peças em lote e iniciar o controle de estoque com entradas e saldo

**Histórias previstas**

[US03](requisitos-de-software.md#rf03), [US04](requisitos-de-software.md#rf04), [US02](requisitos-de-software.md#rf02), [US08](requisitos-de-software.md#rf08), [US12](requisitos-de-software.md#rf12)

**Atividades planejadas**

- US03: associação de aplicações por veículo (marca, modelo e ano)
- US04: busca por código do fabricante, nome, categoria ou veículo
- US02: importação de cadastros de peças via planilha .xlsx
- US08: registro de entrada de peças
- US12: consulta de saldo
- Testes unitários das regras de saldo escritos via TDD
- Ensaio da carga inicial com uma amostra da planilha e definição do procedimento de registro dos saldos
- Refatoração dos débitos técnicos da sprint anterior

**Resultados comprovados e evidências**

- Consolidação do escopo em um [Catálogo de requisitos integrado](requisitos-de-software.md) com fonte única em [`tools/docs/data/backlog.json`](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/blob/main/tools/docs/data/backlog.json) e [Organização e atualização dos requisitos](historico-de-evolucao.md) ([PR #56](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/56)) — *Acompanhamento: Thiago Gomes*
- Formulários padronizados de issues para histórias e épicos ([`.github/ISSUE_TEMPLATE/`](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/tree/main/.github/ISSUE_TEMPLATE)) e automação de coleta e validação do backlog ([`backlog.py`](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/blob/main/tools/docs/scripts/backlog.py) e workflow [`backlog-check.yml`](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/blob/main/.github/workflows/backlog-check.yml)) — *Acompanhamento: Thiago Gomes e Bruno Ferreira*

**Débito transferido para a Sprint 5**

- Como o esforço da sprint concentrou-se na reestruturação e automação do catálogo único e da rastreabilidade ([PR #56](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/56)), a implementação das histórias [US03](requisitos-de-software.md#rf03) ([Issue #29](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/29)), [US04](requisitos-de-software.md#rf04) ([Issue #30](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/30)), [US02](requisitos-de-software.md#rf02) ([Issue #28](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/28)), [US08](requisitos-de-software.md#rf08) ([Issue #33](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/33)) e [US12](requisitos-de-software.md#rf12) ([Issue #36](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/36)) e o ensaio da carga inicial foram transferidos como débito para a [Sprint 5](#sprint-5) — *Acompanhamento: Bruno Ferreira, Luiz Moreira, Rodrigo Barbosa e Leonardo Lopes*

**Validação com o cliente**

A demonstração do catálogo completo, da importação e do saldo com amostra da planilha foi reprogramada para ocorrer junto à validação da Sprint 5 — *Acompanhamento: João Melo (PO)*

</div>
</details>

<details class="sprint-details" id="sprint-5" markdown="1">
<summary><span class="sprint-details__title">Sprint 5</span><span class="sprint-details__period"><time datetime="2026-11-06">06/11/2026</time> a <time datetime="2026-11-19">19/11/2026</time></span><span class="delivery-status schedule-status--active">Em andamento</span></summary>
<div class="sprint-details__body" markdown="1">

**Objetivo**

Quitar os débitos técnicos e de implementação das Sprints 3 e 4, completar as movimentações e as vendas do MVP e validá-lo com o proprietário

**Histórias previstas**

- **Previstas na Sprint 5:** [US09](requisitos-de-software.md#rf09), [US10](requisitos-de-software.md#rf10), [US14](requisitos-de-software.md#rf14), [US15](requisitos-de-software.md#rf15), [US16](requisitos-de-software.md#rf16)
- **Débito recebido das Sprints 3 e 4:** [US01](requisitos-de-software.md#rf01), [US05](requisitos-de-software.md#rf05), [US06](requisitos-de-software.md#rf06), [US03](requisitos-de-software.md#rf03), [US04](requisitos-de-software.md#rf04), [US02](requisitos-de-software.md#rf02), [US08](requisitos-de-software.md#rf08), [US12](requisitos-de-software.md#rf12)

**Atividades planejadas**

- Estruturação do monorepo da aplicação (`frontend/` e `backend/`), containerização Docker e configuração do pipeline de CI da aplicação com cobertura de testes (quitação do débito técnico de infraestrutura)
- Quitação do débito de desenvolvimento da Sprint 3: cadastro ([US01](requisitos-de-software.md#rf01)), edição ([US05](requisitos-de-software.md#rf05)) e alteração de status de peça ([US06](requisitos-de-software.md#rf06))
- Quitação do débito de desenvolvimento da Sprint 4: associação por veículo ([US03](requisitos-de-software.md#rf03)), busca ([US04](requisitos-de-software.md#rf04)), importação via planilha `.xlsx` ([US02](requisitos-de-software.md#rf02)), entrada de peças ([US08](requisitos-de-software.md#rf08)), consulta de saldo ([US12](requisitos-de-software.md#rf12)) e ensaio da carga inicial
- Escopo original da Sprint 5: saída manual ([US09](requisitos-de-software.md#rf09)), ajuste de inventário ([US10](requisitos-de-software.md#rf10)), filtro do histórico por período ([US14](requisitos-de-software.md#rf14)), registro de venda com baixa automática ([US15](requisitos-de-software.md#rf15)) e cancelamento de venda com reversão ([US16](requisitos-de-software.md#rf16))
- Testes unitários via TDD e testes de sistema do fluxo cadastro → entrada → venda → cancelamento → saldo
- Preparação da configuração de produção, teste de backup e restauração e elaboração do manual preliminar do proprietário
- Sessão de aceitação executada com o proprietário

**Resultados já comprovados na sprint (evidências)**

- Base do monorepo (`frontend/` em React/Vite, `backend/` em FastAPI, `compose.yaml` e `render.yaml`) integrada e verificada via [PR #57](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/57) — *Acompanhamento: Bruno Ferreira, Luiz Moreira e Rodrigo Barbosa*
- Pipeline de CI da aplicação ([`app-check.yml`](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/blob/main/.github/workflows/app-check.yml)) ativo e validado em [execuções no GitHub Actions](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/actions/workflows/app-check.yml), verificando lint, formatação, testes, build e contêineres ([PR #57](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/57)) — *Acompanhamento: Bruno Ferreira e Luiz Moreira*
- Suítes de teste (`pytest` e `Vitest`), publicação automática dos relatórios de cobertura (`coverage-frontend` e `coverage-backend`) na CI e validação de diretrizes de TDD ([`agent-check.yml`](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/blob/main/.github/workflows/agent-check.yml)) integradas via [PR #58](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/58) — *Acompanhamento: Leonardo Lopes, Thiago Gomes e Bruno Ferreira*

**Entregas em execução na sprint (a comprovar)**

- Catálogo de peças ([EP01](requisitos-de-software.md#ep01) — [US01](requisitos-de-software.md#rf01), [US02](requisitos-de-software.md#rf02), [US03](requisitos-de-software.md#rf03), [US04](requisitos-de-software.md#rf04), [US05](requisitos-de-software.md#rf05), [US06](requisitos-de-software.md#rf06)) — *Acompanhamento: Bruno Ferreira e Luiz Moreira (Back-end), Rodrigo Barbosa (Front-end), Leonardo Lopes e Thiago Gomes (QA/Requisitos)*
- Movimentações e saldo ([EP02](requisitos-de-software.md#ep02) — [US08](requisitos-de-software.md#rf08), [US09](requisitos-de-software.md#rf09), [US10](requisitos-de-software.md#rf10), [US12](requisitos-de-software.md#rf12), [US14](requisitos-de-software.md#rf14)) — *Acompanhamento: Bruno Ferreira e Luiz Moreira (Back-end), Rodrigo Barbosa (Front-end) e Leonardo Lopes (QA)*
- Registro e cancelamento de vendas ([EP03](requisitos-de-software.md#ep03) — [US15](requisitos-de-software.md#rf15), [US16](requisitos-de-software.md#rf16)) — *Acompanhamento: Luiz Moreira (Back-end), Rodrigo Barbosa (Front-end), Leonardo Lopes (QA) e João Melo (PO)*
- Ensaio da carga inicial, procedimento de backup/restauração testado, instruções de implantação, manual preliminar e homologação do MVP — *Acompanhamento: Bruno Ferreira e Luiz Moreira (infraestrutura/backup), Thiago Gomes e Leonardo Lopes (manual e roteiro de aceitação) e João Melo (validação com o cliente)*

**Validação com o cliente**

Sessão de aceitação prevista com dados de teste baseados em uma amostra dos dados da loja: o proprietário valida o catálogo, a importação por planilha e os fluxos de entrada, venda, cancelamento e conferência de saldo — *Acompanhamento: João Melo (PO) e Leonardo Lopes (QA)*

</div>
</details>

<details class="sprint-details" id="sprint-6" markdown="1">
<summary><span class="sprint-details__title">Sprint 6</span><span class="sprint-details__period"><time datetime="2026-11-20">20/11/2026</time> a <time datetime="2026-12-03">03/12/2026</time></span><span class="delivery-status">Planejada</span></summary>
<div class="sprint-details__body" markdown="1">

**Objetivo**

Implantar o MVP em produção, realizar a carga inicial dos cadastros de peças e dos saldos de estoque, treinar o proprietário e estabilizar o sistema

**Histórias previstas**

—

**Atividades planejadas**

- Deploy do MVP em produção no início da sprint, após os testes e a validação com o proprietário
- Ativação e verificação da rotina de backup em produção
- Carga inicial dos cadastros de peças via US02, com correção de duplicidades e campos incompletos
- Registro dos saldos iniciais conforme o procedimento validado nas sprints anteriores e conferência com o estoque físico junto ao proprietário antes do início da operação real
- Treinamento do proprietário com o manual finalizado em linguagem simples
- Janela de estabilização para correção de problemas encontrados em uso real
- Guia de manutenção finalizado
- Vídeo de demonstração com o sistema em produção

**Resultados comprovados e evidências**

— *(sprint planejada; links do ambiente em produção, registros de carga inicial, manuais, vídeo final e termo de aceite serão vinculados na conclusão da sprint)*

**Entregas previstas (a comprovar)**

- MVP em produção (Vercel, Render e Supabase) com backup ativo — *Acompanhamento: Bruno Ferreira, Luiz Moreira e Rodrigo Barbosa*
- Cadastros de peças e saldos iniciais conferidos com o estoque físico — *Acompanhamento: João Melo, Luiz Moreira e Thiago Gomes*
- Manual final, guia de manutenção, treinamento do proprietário, vídeo de demonstração e termo de aceite — *Acompanhamento: Leonardo Lopes e Thiago Gomes (manuais), Rodrigo Barbosa (vídeo) e João Melo (treinamento e aceite)*

**Validação com o cliente**

Conferência prevista dos cadastros e saldos iniciais, acompanhamento dos fluxos em produção e aceite formal do produto pelo proprietário — *Acompanhamento: João Melo (PO) e Equipe*

</div>
</details>

</div>

## Princípios do cronograma

- **Cadência quinzenal nas quintas-feiras:** as sprints de 1 a 6 possuem duração padrão de 14 dias, encerrando sempre em uma quinta-feira em semanas alternadas. A Sprint 0 é excepcional, com 17 dias, por cobrir a formação da equipe e a elaboração do documento de visão.
- **Planejamento por US do MVP:** as 13 US do MVP ([US01](requisitos-de-software.md#rf01), [US02](requisitos-de-software.md#rf02), [US03](requisitos-de-software.md#rf03), [US04](requisitos-de-software.md#rf04), [US05](requisitos-de-software.md#rf05), [US06](requisitos-de-software.md#rf06), [US08](requisitos-de-software.md#rf08), [US09](requisitos-de-software.md#rf09), [US10](requisitos-de-software.md#rf10), [US12](requisitos-de-software.md#rf12), [US14](requisitos-de-software.md#rf14), [US15](requisitos-de-software.md#rf15) e [US16](requisitos-de-software.md#rf16)) estão distribuídas pelas sprints 3 a 5, agrupadas por dependência lógica: catálogo de peças → movimentações e saldo → vendas. As US seguem a numeração dos RFs de origem; os RFs condicionados (RF11, RF13, RF21, RF22 e RF25), cujas USs ainda não foram detalhadas, e os demais RFs de menor prioridade ficam fora do cronograma, como evolução futura, e só serão reavaliados se houver folga após a Sprint 5.
- **Validação do cliente foca em negócio:** o proprietário valida se o produto atende à operação da loja; decisões técnicas são responsabilidade da equipe.
- **Carga inicial com escopo definido:** serão transferidos os cadastros de peças e estabelecidos os saldos iniciais de estoque. A US02 importa os cadastros; os saldos serão registrados pelas funcionalidades de entrada (US08) e, quando necessário, ajuste de inventário (US10), conforme procedimento ensaiado com dados de teste para evitar contagem duplicada. O proprietário confere os saldos antes do início da operação real. A importação do histórico de vendas e movimentações não integra essa carga inicial.
- **Propriedade coletiva do código e acompanhamento nominal por tarefa:** conforme a prática de XP adotada em [Estratégias de engenharia de software](estrategias-engenharia-de-software.md#xp), qualquer desenvolvedor pode evoluir e revisar qualquer parte do código seguindo os [Padrões de codificação](padroes-de-codificacao.md). Essa propriedade coletiva não substitui a identificação nominal de quem acompanha cada tarefa: cada entregável da sprint registra os integrantes responsáveis pelo seu acompanhamento neste cronograma, e cada história de usuário possui seus responsáveis (*Assignees*) atribuídos nas issues do GitHub, refletidos no [Catálogo de requisitos](requisitos-de-software.md) e no quadro [GitHub Projects](interacao-equipe-cliente.md#evidencias). O Product Owner (João Melo) coordena as validações com o cliente ao final de cada sprint.
- **Requisitos não funcionais transversais:** RNF01 a RNF05 (responsividade, tolerância a falhas de conexão, compatibilidade com navegadores, desempenho e segurança de dados) não ocupam uma sprint isolada; orientam as decisões técnicas e de interface em todas as sprints de desenvolvimento, garantindo consistência dos dados de estoque e uso adequado em diferentes dispositivos durante a operação da loja.

## Versionamento

| Versão | Data | Descrição | Autor(es/as) |
| :----: | :--: | --- | --- |
| 1.0 | 04/09/2026 | Iniciação do documento | [Thiago Gomes](https://github.com/thgomxs) |
| 1.1 | 07/09/2026 | Adição da tabela de Cronograma de Sprints | [Bruno Ferreira](https://github.com/brunnf) |
| 1.2 | 25/09/2026 | Reestruturação completa do cronograma: cadência quinzenal nas quintas-feiras, agrupamento das CPs por dependência, inclusão de atividades de implantação e marco de especificação; atualização das CPs com base nas características revisadas | [Bruno Ferreira](https://github.com/brunnf) |
| 1.3 | 11/10/2026 | Substituição das CPs por RFs do MVP e reorganização do cronograma | [Bruno Ferreira](https://github.com/brunnf) |
| 1.4 | 12/10/2026 | Substituição dos RFs pelas User Stories (US) do MVP, com links para o Backlog de produto | [Bruno Ferreira](https://github.com/brunnf) |
| 1.5 | 13/10/2026 | Correção do link para a seção de histórias de usuário após a renumeração do backlog. | [Thiago Gomes](https://github.com/thgomxs) |
| 1.6 | 04/11/2026 | Remoção da numeração estrutural e ajuste da hierarquia dos títulos, com links estáveis e preservação das âncoras anteriores. | [Thiago Gomes](https://github.com/thgomxs) |
| 1.7 | 04/11/2026 | Reorganização visual do cronograma em resumo responsivo e detalhes expansíveis por sprint, preservando períodos, objetivos, histórias, entregáveis e validações. | [Thiago Gomes](https://github.com/thgomxs) |
| 1.8 | 05/11/2026 | Acesso direto pela aba Cronograma, simplificação do título e inclusão de links para as atas preenchidas e a entrega citada no planejamento. | [Thiago Gomes](https://github.com/thgomxs) |
| 1.9 | 09/11/2026 | Atualização do andamento até a Sprint 5, distinção entre atividades planejadas, resultados comprovados, débitos transferidos e entregas previstas, inclusão das evidências técnicas (padrão de codificação e CI da aplicação) e identificação nominal de acompanhamento por entrega. | [Bruno Ferreira](https://github.com/brunnf) |
