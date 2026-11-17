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
</style>

<div class="delivery-page" markdown="1">

# Entrega 3

## Vídeo da apresentação

<div class="video-embed">
  <iframe
    src="https://www.youtube.com/embed/MXImPMmzAfM"
    title="Vídeo da apresentação da Entrega 3"
    loading="lazy"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen>
  </iframe>
</div>

[Assistir ao vídeo diretamente no YouTube](https://youtu.be/MXImPMmzAfM){ .md-button .md-button--primary target="_blank" rel="noopener" }

## Documentação

A Entrega 3 destaca **organização e atualização**, **verificação e validação** e **representação de requisitos**. Reúne também o incremento inicial do software e as correções da Unidade 2 solicitadas pelo professor.

### Organização e atualização dos requisitos

- [Backlog](../visao-produto/requisitos-de-software.md): registros agrupados por épicos e histórias de usuário, com origem em CP/RF, RNFs, dependências, priorização, recorte de entrega e acompanhamento. As 40 US permanecem no mesmo inventário, com indicação das 12 selecionadas para o MVP.
- [Organização e atualização](../visao-produto/historico-de-evolucao.md): fontes de cada informação, rotina de manutenção, histórico das decisões e automação. O detalhamento vem das issues; o andamento, do Projects; os PRs e checks, dos vínculos de implementação registrados no GitHub.
- [Rastreabilidade](../visao-produto/rastreabilidade.md): relações entre objetivos, características, épicos, requisitos e US, com árvore no Miro e alternativa textual derivada da base.
- [Priorização](../visao-produto/priorizacao.md): memória de cálculo, procedência das classificações, exceções ao corte e justificativas do MVP, mantendo US13 e US14 separadas e condicionadas.

### Verificação e validação dos requisitos

- [DoR e DoD](../visao-produto/dor-e-dod.md): acordos de prontidão e conclusão, checklists nas issues e aplicação documentada na US01.
- [Interação entre equipe e cliente](../visao-produto/interacao-equipe-cliente.md#processo-de-validacao): procedimento de revisão, validação e registro de evidências.
- [Validação das funções iniciais com o cliente](../atas/validacao-us-cliente.md): registro assíncrono de 16/11/2026, com a mensagem enviada ao proprietário e sua resposta sobre as funções relacionadas. O registro refere-se ao escopo da mensagem.
- [Evidências de ESW na issue #45](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/45#issuecomment-6935348810) e [evidências de ER na issue #46](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/46#issuecomment-6935373319): relação entre práticas, artefatos e resultados. O registro de ER também explicita lacunas de evidência em análise documental, análise de tarefas e avaliação DEEP.

### Representação dos requisitos

- [Protótipos do MVP](../prototipos/index.md): cinco grupos de telas navegáveis, com dados fictícios e vínculos com as 12 US selecionadas: cadastro e manutenção, importação, busca, estoque e vendas.
- [Roteiros de avaliação](../prototipos/avaliacao.md): tarefas, resultados esperados e orientação para registrar observações e decisões com o cliente.
- [Árvore de histórias](../visao-produto/rastreabilidade.md#arvore-de-historias-de-usuario) e [matriz de valor e esforço](../visao-produto/priorizacao.md#matriz-de-valor-de-negocio-esforco-tecnico): visualizações complementares dos vínculos e da priorização mantidos no backlog.

### Incremento de software e evidências técnicas

O [PR #65](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/65) integra as primeiras funcionalidades do catálogo:

<div class="delivery-stories" markdown="1">

| US | Funcionalidade apresentada | Issue |
| --- | --- | :---: |
| [US01](../visao-produto/requisitos-de-software.md#us01) | Cadastro de peças, validação dos dados, unicidade dos códigos e recuperação de tentativas pendentes. | [#27](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/27) |
| [US05](../visao-produto/requisitos-de-software.md#us05) | Edição dos dados cadastrais, preservando o código principal e os campos não alterados. | [#31](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/31) |
| [US06](../visao-produto/requisitos-de-software.md#us06) | Ativação e inativação de peças, com persistência do status e preservação dos dados cadastrais. | [#32](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/32) |

</div>

As integrações com aplicações por veículo, estoque e vendas são acompanhadas nas respectivas issues e não são integralmente implementadas pelo PR #65.

- **Scrum:** acompanhamento das histórias, incremento e distribuição das próximas entregas no [Cronograma](../visao-produto/cronograma-e-entregas.md), conforme as [estratégias do projeto](../visao-produto/estrategias-engenharia-de-software.md).
- **XP:** registros de TDD, refatoração e revisão nos [relatos do frontend](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/blob/main/frontend/README.md) e do [backend](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/blob/main/backend/README.md). A [CI do PR #65](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/actions/runs/43621478818) aprovou 33 testes de frontend, 64 de backend e as verificações de contêineres, com relatórios de cobertura.
- **Automação da documentação:** o [workflow de publicação](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/blob/main/.github/workflows/docs.yml) coleta as informações do backlog e publica o site; a CI da aplicação é executada pelo [workflow de testes e build](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/blob/main/.github/workflows/app-check.yml).

### Correções da Unidade 2

A tabela relaciona os documentos revisados, as issues do professor e os PRs incorporados à `main` ou registros de evidências publicados.

<div class="delivery-corrections" markdown="1">

| Documentação e correção | Issue | PRs e evidências |
| --- | :---: | :---: |
| [Visão do produto](../visao-produto/intervencao-social.md): distinção entre benefícios do MVP e do produto completo. | [#44](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/44) | [#60](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/60) |
| [Estratégias de ESW](../visao-produto/estrategias-engenharia-de-software.md): execução do incremento e registros de TDD, CI, refatoração e revisão. | [#45](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/45) | [#65](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/65); [evidências](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/45#issuecomment-6935348810) |
| [Processo de ER](../visao-produto/engenharia-de-requisitos.md): protótipos, checklists e identificação das práticas executadas e das lacunas de registro. | [#46](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/46) | [#62](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/62); [evidências](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/46#issuecomment-6935373319) |
| [Rastreabilidade](../visao-produto/rastreabilidade.md): revisão dos vínculos, histórico das decisões e alternativa textual da árvore; atualização do quadro do Miro. | [#47](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/47) | [#67](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/67), [#73](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/73), [#74](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/74) |
| [US13 e US14](../visao-produto/requisitos-de-software.md#rf14): justificativa para manter consulta e filtro do histórico como requisitos separados; esclarecimento do relatório da US25. | [#48](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/48) | [#70](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/70), [#64](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/64) |
| [RNFs](../visao-produto/requisitos-de-software.md#registros-dos-requisitos-nao-funcionais): fundamentação do RNF01, resultados esperados do RNF02 e critérios de backup e recuperação no RNF06. | [#49](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/49) | [#72](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/72) |
| [DoR](../visao-produto/dor-e-dod.md#definition-of-ready-dor): revisão da prontidão e aplicação documentada na US01. | [#50](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/50) | [#69](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/69) |
| [DoD](../visao-produto/dor-e-dod.md#definition-of-done-dod): distinção entre verificações técnicas, evidências e validação com o cliente. | [#51](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/51) | [#69](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/69) |
| [Backlog](../visao-produto/requisitos-de-software.md) e [protótipo de estoque](../prototipos/04-estoque.md): entrada de peças sem exigir cadastro de fornecedor; histórico e filtro fora do MVP; contextualização da captura anterior do Projects. | [#52](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/52) | [#63](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/63), [#71](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/71) |
| [Priorização](../visao-produto/priorizacao.md) e [decisões com o cliente](../visao-produto/cliente-e-negocio.md): memória de cálculo, procedência do MoSCoW, exceções ao corte, definição do acesso e MVP de 12 US. | [#53](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/53) | [#63](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/63), [#75](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/75) |
| [Cronograma](../visao-produto/cronograma-e-entregas.md): alinhamento ao recorte vigente e distinção entre planejamento, resultados comprovados e próximas entregas. | [#54](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/54) | [#59](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/59) |
| [Navegação de requisitos](../requisitos/index.md), [priorização](../visao-produto/priorizacao.md) e [intervenção social](../visao-produto/intervencao-social.md): organização das páginas, redução de repetições e alternativa textual da matriz. | [#55](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/55) | [#68](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/68) |

</div>

## Versionamento

| Versão | Data | Descrição | Autor(es/as) |
| :----: | :--: | --- | --- |
| 1.0 | 06/09/2026 | Iniciação do documento | [Thiago Gomes](https://github.com/thgomxs) |
| 1.1 | 16/11/2026 | Inclusão do vídeo, dos artefatos de organização e atualização, verificação e validação e representação, do incremento inicial e das correções da Unidade 2. | [Thiago Gomes](https://github.com/thgomxs) |

</div>
