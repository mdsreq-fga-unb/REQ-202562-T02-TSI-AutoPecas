<style>
.md-typeset .delivery-page .md-typeset__scrollwrap,
.md-typeset .delivery-page .md-typeset__table {
  display: block;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  margin: 0;
  overflow: visible;
}
.md-typeset .delivery-page table {
  display: table;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  table-layout: fixed;
  margin: 1rem 0;
  font-size: .7rem;
}
.md-typeset .delivery-page table th,
.md-typeset .delivery-page table td {
  padding: .55rem .4rem;
  vertical-align: top;
  white-space: normal;
  overflow-wrap: anywhere;
}
.md-typeset .delivery-page .delivery-corrections th:nth-child(1) { width: 64%; }
.md-typeset .delivery-page .delivery-corrections th:nth-child(2),
.md-typeset .delivery-page .delivery-corrections th:nth-child(3) { width: 18%; }
.md-typeset .delivery-page .delivery-stories th:nth-child(1) { width: 15%; }
.md-typeset .delivery-page .delivery-stories th:nth-child(2) { width: 65%; }
.md-typeset .delivery-page .delivery-stories th:nth-child(3) { width: 20%; }
.md-typeset .delivery-page .delivery-blocks th:nth-child(1) { width: 28%; }
.md-typeset .delivery-page .delivery-blocks th:nth-child(2) { width: 52%; }
.md-typeset .delivery-page .delivery-blocks th:nth-child(3) { width: 20%; }
</style>

<div class="delivery-page" markdown="1">

# Entrega 4

## Vídeo da apresentação

_Link do YouTube a adicionar._

## Documentação

A Entrega 4 trata da **correspondência entre o que está registrado e o que o
repositório comprova**. Em vez de acrescentar requisitos, a entrega revisa as
evidências já produzidas: relaciona as práticas do processo de Engenharia de
Requisitos aos resultados que elas geraram, revisa as regras de aplicação por
veículo e de busca nas histórias correspondentes e esclarece a situação de
atendimento dos requisitos funcionais, separando o que está implementado e
verificado do que depende de integração com outras histórias.

- [Processo de ER](../visao-produto/engenharia-de-requisitos.md): técnicas
  declaradas passam a apresentar o resultado obtido, incluindo a análise
  documental, a análise de tarefas e a avaliação DEEP do backlog.
- [Levantamento de dados da loja](../atas/levantamento-dados-loja.md): ata de
  26/11/2026, fonte da análise documental e da análise de tarefas. O registro
  declara que não valida critério de aceitação e não substitui a validação com o
  cliente prevista na [DoD](../visao-produto/dor-e-dod.md#definition-of-done-dod).
- [Backlog](../visao-produto/requisitos-de-software.md): histórico dos registros
  atualizado com as decisões desta unidade, mantendo as 40 US e o recorte de 12
  para o MVP.

### Incremento de software e evidências técnicas

O [PR #65](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/65),
apresentado na [Entrega 3](entrega-3.md), não comprova por si as histórias
completas. A tabela separa o que aquele PR apresentou do que foi completado
depois, pelo
[PR #77](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/77).

<div class="delivery-stories" markdown="1">

| US | O que cada PR comprova | Issue |
| --- | --- | :---: |
| [US05](../visao-produto/requisitos-de-software.md#us05) | O PR #65 apresentou a edição dos campos cadastrais, com o código principal preservado. A correção e a remoção de aplicações por veículo (CA05.5 e CA05.7) foram completadas pelo PR #77, nos commits `fa7d613`, na API, e `53fe514`, na interface. A evidência por critério está em `backend/tests/test_vehicle_application_updates.py`, em dois testes `test_ca055_...` e um `test_ca057_...`. | [#31](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/31) |
| [US06](../visao-produto/requisitos-de-software.md#us06) | O PR #65 apresentou a ativação e a inativação da peça, com persistência do status e preservação dos dados. O CA06.5 está **parcialmente verificado**: dos quatro bloqueios exigidos para a peça inativa, apenas um existe no código. A visibilidade da peça inativa (CA06.4) está verificada por `test_ca047_inactive_parts_remain_searchable_and_pagination_is_filtered`. | [#32](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/32) |

</div>

Inventário dos quatro bloqueios exigidos pelo CA06.5:

<div class="delivery-blocks" markdown="1">

| Operação bloqueada | Situação | Depende de |
| --- | --- | :---: |
| Entrada de estoque | Implementada, em `backend/app/services/stock.py`. | — |
| Saída manual | Não verificada; em implementação. | [US09](../visao-produto/requisitos-de-software.md#us09) |
| Ajuste de inventário | Não implementada. | [US10](../visao-produto/requisitos-de-software.md#us10) |
| Venda | Não integrada; o PR #96 permanece aberto. | [US15](../visao-produto/requisitos-de-software.md#us15) |

</div>

Enquanto esses fluxos não forem implementados e verificados, o RF06 é tratado
como **parcialmente implementado**. Um PR integrado é evidência técnica e não
equivale ao aceite do cliente; a conclusão depende dos itens da
[DoD](../visao-produto/dor-e-dod.md#definition-of-done-dod).

### Correções da Unidade 3

A tabela relaciona os documentos revisados, as issues do professor e os PRs
correspondentes. Nenhum PR desta unidade foi aberto até a publicação desta
versão.

<div class="delivery-corrections" markdown="1">

| Documentação e correção | Issue | PRs e evidências |
| --- | :---: | :---: |
| [Processo de ER](../visao-produto/engenharia-de-requisitos.md): seção de resultados das práticas declaradas, com a análise documental e a análise de tarefas derivadas da [ata de 26/11/2026](../atas/levantamento-dados-loja.md) e a avaliação DEEP do backlog; registro da decisão no histórico do RF02. | [#79](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/79) | a preencher na abertura do PR |
| [Backlog](../visao-produto/requisitos-de-software.md): revisão das regras de aplicação por veículo e de busca, com registro no histórico do [RF03](../visao-produto/requisitos-de-software.md#rf03) e do [RF04](../visao-produto/requisitos-de-software.md#rf04). | [#85](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/85) | a preencher na abertura do PR |
| [Backlog](../visao-produto/requisitos-de-software.md): consistência do atendimento dos RFs. No [RF05](../visao-produto/requisitos-de-software.md#rf05), atribuição do atendimento do CA05.5 e do CA05.7 ao PR #77 e aos testes por critério, e não ao PR #65. No [RF06](../visao-produto/requisitos-de-software.md#rf06), registro do atendimento parcial do CA06.5, com o inventário dos quatro bloqueios e a dependência das US09, US10 e US15. | [#81](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/81) | a preencher na abertura do PR |

</div>

## Versionamento

| Versão | Data | Descrição | Autor(es/as) |
| :----: | :--: | --- | --- |
| 1.0 | 06/09/2026 | Iniciação do documento | [Thiago Gomes](https://github.com/thgomxs) |
| 1.1 | 27/11/2026 | Inclusão da documentação da entrega, da separação entre o que o PR #65 apresentou e o que o PR #77 completou, do inventário dos bloqueios do CA06.5 e das correções da Unidade 3. | [Luiz Henrique](https://github.com/luizhtmoreira) |

</div>
