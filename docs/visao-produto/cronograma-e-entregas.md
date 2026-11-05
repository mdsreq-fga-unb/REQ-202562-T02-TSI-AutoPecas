# <span id="6-cronograma-e-entregas"></span>Cronograma e entregas {#cronograma-e-entregas}


A partir da estratégia de desenvolvimento ágil estabelecida para o projeto **TSI Peças**, o semestre foi organizado em sprints de duas semanas, ancoradas nas quintas-feiras em semanas alternadas. A Sprint 0 é excepcional, com 17 dias, por cobrir a formação da equipe, a descoberta do domínio e a elaboração do documento de visão. O planejamento é preliminar e será atualizado ao final de cada sprint com base no progresso real e no feedback do cliente.

O desenvolvimento do produto começa na Sprint 3 e é planejado por **histórias de usuário (US)**, que detalham os **13 requisitos funcionais (RFs) selecionados para o MVP** na [priorização](priorizacao.md) (Score ≥ 4). Cada US mantém o número do RF de origem (por exemplo, US01 detalha o RF01) e está registrada no campo *Intenção e valor* do [registro do requisito](requisitos-de-software.md#registros-dos-requisitos-funcionais). Os RFs condicionados à capacidade da equipe foram retirados do cronograma, para evitar sobrecarga, e os demais RFs permanecem como evolução futura. A declaração vigente de cada RF está no [Catálogo de requisitos](requisitos-de-software.md).

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
<td data-label="Status"><span class="delivery-status schedule-status--active">Em andamento</span></td>
</tr>
<tr>
<td data-label="Sprint"><a href="#sprint-4" data-sprint-link>Sprint 4</a></td>
<td data-label="Período"><time datetime="2026-10-23">23/10/2026</time><br>a <time datetime="2026-11-05">05/11/2026</time></td>
<td data-label="Foco">Catálogo, importação, entradas e saldo</td>
<td data-label="Status"><span class="delivery-status">Planejada</span></td>
</tr>
<tr>
<td data-label="Sprint"><a href="#sprint-5" data-sprint-link>Sprint 5</a></td>
<td data-label="Período"><time datetime="2026-11-06">06/11/2026</time><br>a <time datetime="2026-11-19">19/11/2026</time></td>
<td data-label="Foco">Movimentações, vendas e validação do MVP</td>
<td data-label="Status"><span class="delivery-status">Planejada</span></td>
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

**Trabalho previsto**

- Documento de Visão do Produto e Projeto (seções 1 a 7 do template original)
- Rich Picture
- repositório estruturados

**Entregáveis**

- [Documento de Visão do Produto](index.md)
- Rich Picture
- repositório

**Validação com o cliente**

Validação da viabilidade do projeto: o proprietário confirma que os problemas e as necessidades descritos refletem a realidade da loja

</div>
</details>

<details class="sprint-details" id="sprint-1" markdown="1">
<summary><span class="sprint-details__title">Sprint 1</span><span class="sprint-details__period"><time datetime="2026-09-11">11/09/2026</time> a <time datetime="2026-09-24">24/09/2026</time></span><span class="delivery-status delivery-status--done">Concluída</span></summary>
<div class="sprint-details__body" markdown="1">

**Objetivo**

Correção dos feedbacks do professor; elicitar, analisar e declarar os requisitos do sistema a partir das características de produto (CPs) revisadas

**Histórias previstas**

—

**Trabalho previsto**

- Documento de Visão de produto corrigido
- Catálogo de requisitos funcionais e não funcionais
- funcionalidades derivadas das CPs

**Entregáveis**

- [Requisitos de software](requisitos-de-software.md)

**Validação com o cliente**

Apresentação dos requisitos e funcionalidades levantados ao proprietário para alinhamento

</div>
</details>

<details class="sprint-details" id="sprint-2" markdown="1">
<summary><span class="sprint-details__title">Sprint 2</span><span class="sprint-details__period"><time datetime="2026-09-25">25/09/2026</time> a <time datetime="2026-10-08">08/10/2026</time></span><span class="delivery-status delivery-status--done">Concluída</span></summary>
<div class="sprint-details__body" markdown="1">

**Objetivo**

Consolidar os requisitos e o backlog priorizado e definir os padrões técnicos do projeto, sem desenvolvimento de funcionalidades

**Histórias previstas**

—

**Trabalho previsto**

- [Requisitos funcionais e não funcionais](requisitos-de-software.md)
- [escopo priorizado com MVP definido (13 RFs)](mvp.md)
- padrão de codificação definido e adotado pela equipe

**Entregáveis**

- [Catálogo de requisitos](requisitos-de-software.md)
- [Priorização](priorizacao.md)
- [MVP](mvp.md)

**Validação com o cliente**

Validação do escopo e dos critérios de aceite do MVP com o proprietário

</div>
</details>

<details class="sprint-details" id="sprint-3" markdown="1">
<summary><span class="sprint-details__title">Sprint 3</span><span class="sprint-details__period"><time datetime="2026-10-09">09/10/2026</time> a <time datetime="2026-10-22">22/10/2026</time></span><span class="delivery-status schedule-status--active">Em andamento</span></summary>
<div class="sprint-details__body" markdown="1">

**Objetivo**

Definir o DoR e o DoD; Correção dos feedbacks do professor; Iniciar o catálogo de peças com cadastro, edição e status

**Histórias previstas**

[US01](requisitos-de-software.md#rf01), [US05](requisitos-de-software.md#rf05), [US06](requisitos-de-software.md#rf06)

**Trabalho previsto**

- Entregas da unidade 2 corrigidas
- DoR e DoD definidos e adotados pela equipe
- US01: cadastro de peça
- US05: edição de peça
- US06: alteração de status (ativo/inativo)
- testes unitários escritos antes da implementação
- relatório de cobertura de testes como critério do DoD

**Entregáveis**

- DoR e DoD
- cadastro, edição e alteração de status de peças

**Validação com o cliente**

Sprint Review: demonstração do cadastro e da edição de peças com dados reais da loja

</div>
</details>

<details class="sprint-details" id="sprint-4" markdown="1">
<summary><span class="sprint-details__title">Sprint 4</span><span class="sprint-details__period"><time datetime="2026-10-23">23/10/2026</time> a <time datetime="2026-11-05">05/11/2026</time></span><span class="delivery-status">Planejada</span></summary>
<div class="sprint-details__body" markdown="1">

**Objetivo**

Concluir o catálogo de peças, importar peças em lote e iniciar o controle de estoque com entradas e saldo

**Histórias previstas**

[US03](requisitos-de-software.md#rf03), [US04](requisitos-de-software.md#rf04), [US02](requisitos-de-software.md#rf02), [US08](requisitos-de-software.md#rf08), [US12](requisitos-de-software.md#rf12)

**Trabalho previsto**

- US03: associação de aplicações por veículo (marca, modelo e ano)
- US04: busca por código do fabricante, nome, categoria ou veículo
- US02: importação de cadastros de peças via planilha .xlsx
- US08: registro de entrada de peças
- US12: consulta de saldo
- testes unitários das regras de saldo escritos via TDD
- ensaio da carga inicial com uma amostra da planilha e definição do procedimento de registro dos saldos
- refatoração dos débitos técnicos da sprint anterior

**Entregáveis**

- Associação por veículo
- busca de peças
- importação por planilha
- entrada de peças
- consulta de saldo
- procedimento de carga inicial

**Validação com o cliente**

Sprint Review: demonstração do catálogo completo, das entradas e do saldo; o proprietário testa a importação com uma amostra da planilha atual

</div>
</details>

<details class="sprint-details" id="sprint-5" markdown="1">
<summary><span class="sprint-details__title">Sprint 5</span><span class="sprint-details__period"><time datetime="2026-11-06">06/11/2026</time> a <time datetime="2026-11-19">19/11/2026</time></span><span class="delivery-status">Planejada</span></summary>
<div class="sprint-details__body" markdown="1">

**Objetivo**

Completar as movimentações e as vendas do MVP e validá-lo com o proprietário

**Histórias previstas**

[US09](requisitos-de-software.md#rf09), [US10](requisitos-de-software.md#rf10), [US14](requisitos-de-software.md#rf14), [US15](requisitos-de-software.md#rf15), [US16](requisitos-de-software.md#rf16)

**Trabalho previsto**

- US09: registro de saída manual
- US10: ajuste de inventário
- US14: filtro do histórico de movimentações por período
- US15: registro de venda com canal, peças, quantidades e preço, com baixa automática do estoque
- US16: cancelamento de venda com reversão da baixa
- testes de sistema do fluxo cadastro → entrada → venda → cancelamento → saldo
- testes de aceitação executados com o proprietário
- preparação da configuração de produção e das instruções de implantação, com verificação do procedimento pela equipe
- rotina de backup preparada e restauração testada antes da implantação
- versão preliminar do manual do proprietário e documentação técnica
- refatoração final antes da implantação

**Entregáveis**

- Saída manual
- ajuste de inventário
- histórico filtrado por período
- registro e cancelamento de vendas
- MVP validado com o proprietário
- instruções de implantação
- procedimento de backup e restauração testado
- manual preliminar

**Validação com o cliente**

Sessão de aceitação com dados de teste baseados em uma amostra dos dados da loja: o proprietário simula os fluxos do MVP, inclusive venda e cancelamento, e confere os saldos resultantes

</div>
</details>

<details class="sprint-details" id="sprint-6" markdown="1">
<summary><span class="sprint-details__title">Sprint 6</span><span class="sprint-details__period"><time datetime="2026-11-20">20/11/2026</time> a <time datetime="2026-12-03">03/12/2026</time></span><span class="delivery-status">Planejada</span></summary>
<div class="sprint-details__body" markdown="1">

**Objetivo**

Implantar o MVP em produção, realizar a carga inicial dos cadastros de peças e dos saldos de estoque, treinar o proprietário e estabilizar o sistema

**Histórias previstas**

—

**Trabalho previsto**

- Deploy do MVP em produção no início da sprint, após os testes e a validação com o proprietário
- ativação e verificação da rotina de backup em produção
- carga inicial dos cadastros de peças via US02, com correção de duplicidades e campos incompletos
- registro dos saldos iniciais conforme o procedimento validado nas sprints anteriores e conferência com o estoque físico junto ao proprietário antes do início da operação real
- treinamento do proprietário com o manual finalizado em linguagem simples
- janela de estabilização para correção de problemas encontrados em uso real
- guia de manutenção finalizado
- vídeo de demonstração com o sistema em produção

**Entregáveis**

- MVP em produção
- backup ativo
- cadastros de peças e saldos iniciais conferidos
- manual final
- guia de manutenção
- vídeo de demonstração
- termo de aceite

**Validação com o cliente**

Conferência dos cadastros e saldos iniciais, acompanhamento dos fluxos em produção e aceite formal do produto pelo proprietário

</div>
</details>

</div>

## Princípios do cronograma

- **Cadência quinzenal nas quintas-feiras:** as sprints de 1 a 6 possuem duração padrão de 14 dias, encerrando sempre em uma quinta-feira em semanas alternadas. A Sprint 0 é excepcional, com 17 dias, por cobrir a formação da equipe e a elaboração do documento de visão.
- **Planejamento por US do MVP:** as 13 US do MVP ([US01](requisitos-de-software.md#rf01), [US02](requisitos-de-software.md#rf02), [US03](requisitos-de-software.md#rf03), [US04](requisitos-de-software.md#rf04), [US05](requisitos-de-software.md#rf05), [US06](requisitos-de-software.md#rf06), [US08](requisitos-de-software.md#rf08), [US09](requisitos-de-software.md#rf09), [US10](requisitos-de-software.md#rf10), [US12](requisitos-de-software.md#rf12), [US14](requisitos-de-software.md#rf14), [US15](requisitos-de-software.md#rf15) e [US16](requisitos-de-software.md#rf16)) estão distribuídas pelas sprints 3 a 5, agrupadas por dependência lógica: catálogo de peças → movimentações e saldo → vendas. As US seguem a numeração dos RFs de origem; os RFs condicionados (RF11, RF13, RF21, RF22 e RF25), que ainda não possuem US, e os demais RFs de menor prioridade ficam fora do cronograma, como evolução futura, e só serão reavaliados se houver folga após a Sprint 5.
- **Validação do cliente foca em negócio:** o proprietário valida se o produto atende à operação da loja; decisões técnicas são responsabilidade da equipe.
- **Carga inicial com escopo definido:** serão transferidos os cadastros de peças e estabelecidos os saldos iniciais de estoque. A US02 importa os cadastros; os saldos serão registrados pelas funcionalidades de entrada (US08) e, quando necessário, ajuste de inventário (US10), conforme procedimento ensaiado com dados de teste para evitar contagem duplicada. O proprietário confere os saldos antes do início da operação real. A importação do histórico de vendas e movimentações não integra essa carga inicial.
- **Responsabilidade coletiva:** todas as entregas de cada sprint são responsabilidade de toda a equipe. O Product Owner coordena as validações com o cliente ao final de cada sprint. A atribuição individual de tarefas ocorre no planejamento interno de cada sprint, registrada no GitHub Projects.
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
