# <span id="9-priorizacao-de-requisitos"></span>Priorização de requisitos {#priorizacao-de-requisitos}


Esta página descreve **como** a equipe prioriza os requisitos e **quais decisões gerais** resultaram
desse método. A prioridade de cada requisito — valor de negócio, esforço técnico, MoSCoW, Score e
quadrante — é mantida na base versionada e exibida no registro correspondente do
[Backlog](requisitos-de-software.md). A matriz abaixo é uma visão derivada dessa mesma base, sem outra especificação para manter.

!!! tip "Consultar a prioridade vigente"
    O [backlog](requisitos-de-software.md#registros-dos-requisitos-funcionais) reúne as histórias
    por épico, com VN, ET, Score e recorte de entrega no próprio registro.

## <span id="91-avaliacao-do-valor-de-negocio-vn"></span>Avaliação do valor de negócio (VN) {#avaliacao-do-valor-de-negocio-vn}

Para cada requisito funcional, a equipe responde às quatro perguntas abaixo com o cliente.
**Cada "Sim" acrescenta 1 ponto; cada "Não" acrescenta 0.** A soma forma o **Valor de Negócio (VN)**,
de **0 a 4 pontos**.

| Critério | Pergunta | Pontuação |
| --- | --- | :---: |
| Essencialidade | O sistema deixa de resolver o problema principal sem essa funcionalidade? | Sim: +1 / Não: 0 |
| Frequência | A funcionalidade será utilizada rotineiramente na operação? | Sim: +1 / Não: 0 |
| Impacto na dor | Sua ausência mantém perdas de tempo ou dinheiro? | Sim: +1 / Não: 0 |
| Urgência | A funcionalidade é indispensável para a primeira versão? | Sim: +1 / Não: 0 |

**Exemplo:** três respostas "Sim" e uma "Não" resultam em VN = 3.

!!! warning "Situação de confirmação"
    As pontuações de valor de negócio vigentes foram atribuídas pela equipe a partir das conversas
    de elicitação e **aguardam confirmação formal do proprietário**. Cada registro do backlog
    exibe essa situação no campo *Priorização*. A confirmação está prevista para a próxima sessão
    de validação de escopo com o cliente.

!!! info "Origem das pontuações"
    As pontuações de valor de negócio foram registradas nas sessões de 30/09/2026 e 05/10/2026
    ([Sprint 2](../atas/sprint-2.md) e [Sprint 3](../atas/sprint-3.md)). As atas usam a
    numeração anterior dos requisitos (RF1 a RF41); a correspondência com os identificadores atuais
    está na [rastreabilidade](rastreabilidade.md). O "RF26 — relatório de movimentações" (VN 4/4) da
    ata de 30/09 refere-se à numeração anterior; o RF26 atual (desempenho por canal) é outro
    requisito e tem VN 0.

### Memória de cálculo do VN

A pontuação de cada requisito é a soma das respostas do cliente às quatro perguntas. Exemplo
completo, o RF02 (importar peças via planilha):

| Momento | Essencialidade | Frequência | Impacto na dor | Urgência | VN |
| --- | :---: | :---: | :---: | :---: | :---: |
| 30/09/2026 | Não | Não | Não | Sim | 1 |
| 05/10/2026 | Não | **Sim** | Não | Sim | 2 |

Em 05/10 o cliente explicou que já tem cerca de 90% dos dados em planilhas e no Mercado Livre, e a
equipe passou a resposta de frequência de uso para "sim". O resultado final é VN 2, e não 4 como
constava antes. Com *Must Have* e ET 2, o Score é 3, abaixo do corte de 4, e o requisito
permanece no MVP por exceção (ver [exceções ao corte](#excecoes-ao-corte)).

O bloco de saldo, histórico e filtro por período teve as respostas sim, não, sim, sim na sessão de
30/09, o que resulta em VN 3 para o RF12, o RF13 e o RF14.

## <span id="92-avaliacao-do-esforco-tecnico-et"></span>Avaliação do esforço técnico (ET) {#avaliacao-do-esforco-tecnico-et}

A equipe atribui notas de **1 a 4** aos três critérios. Quanto maior a nota, maior a dificuldade.

- **Esforço de Implementação (EI):** trabalho necessário para construir, testar e integrar a funcionalidade.
- **Complexidade Arquitetural (CA):** relações entre componentes, dependências e incertezas técnicas.
- **Lacuna de Capacidade (LC):** aprendizagem ou recursos adicionais necessários à equipe.

| Nota | Esforço de Implementação (EI) | Complexidade Arquitetural (CA) | Lacuna de Capacidade (LC) |
| :--: | --- | --- | --- |
| 1 | Operação simples ou alteração pontual. | Solução conhecida, com poucas dependências. | Conhecimentos necessários dominados. |
| 2 | Fluxo com validações e persistência integrada. | Alguma investigação ou integração. | Pouca aprendizagem adicional. |
| 3 | Processamento em lote ou múltiplos fluxos relacionados. | Várias dependências ou incertezas. | Aprendizagem relevante necessária. |
| 4 | Trabalho extenso ou integração crítica. | Elevada incerteza ou tecnologia não dominada. | Conhecimentos ou recursos ainda indisponíveis. |

O **Esforço Técnico (ET)** é a média dos três critérios, arredondada ao inteiro mais próximo:

<div class="priority-equation" role="math" aria-label="ET igual à média de EI, CA e LC, arredondada ao inteiro mais próximo">
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
<mrow><mi>ET</mi><mo>=</mo><mtext>arred</mtext><mo>(</mo><mfrac><mrow><mi>EI</mi><mo>+</mo><mi>CA</mi><mo>+</mo><mi>LC</mi></mrow><mn>3</mn></mfrac><mo>)</mo></mrow>
</math>
</div>

**Exemplo:** o [RF03](requisitos-de-software.md#rf03) recebeu EI = 3, CA = 3 e LC = 1. A média é
2,33, resultando em ET = 2. As três notas de cada requisito ficam registradas no campo
*Priorização* do seu registro.

## <span id="93-classificacao-moscow"></span>Classificação MoSCoW {#classificacao-moscow}

MoSCoW classifica a importância de cada requisito para esta versão do produto e atribui o peso
utilizado no cálculo da prioridade.

| Categoria | Significado | Peso |
| --- | --- | :--: |
| Must Have | Indispensável à viabilidade do produto. | 3 |
| Should Have | Importante, com contorno temporário possível. | 2 |
| Could Have | Desejável, podendo ser adiado. | 1 |
| Won't Have | Fora do escopo desta versão. | 0 |

### Procedência das classificações

O MoSCoW entrou na sessão de 30/09/2026 como pergunta complementar. Os pesos finais foram
definidos pela equipe ao fechar a lista, e o cliente confirmou a lista do MVP em 05/10/2026. Seis
requisitos constam na ata de 30/09 como *Could Have* e hoje têm peso maior:

| Requisito | Ata de 30/09 | Hoje | Decisão |
| --- | :---: | :---: | --- |
| RF12 — Consultar saldo de peça | Could | Must | O cliente considerou a consulta de saldo essencial; o requisito consta da lista final do MVP confirmada em 05/10/2026. |
| RF14 — Filtrar histórico por período | Could | Should | Peso definido pela equipe; fora do MVP por decisão do cliente em 04/11/2026 (ver [exceções ao corte](#excecoes-ao-corte)). |
| RF11 — Registrar devolução de peça | Could | Should | Útil, mas definido com o cliente como item que pode esperar além do MVP; condicionado à capacidade. |
| RF21 — Definir estoque mínimo por peça | Could | Should | Idem RF11. |
| RF22 — Consultar painel de estoque crítico | Could | Should | Idem RF11. |
| RF25 — Listar itens mais vendidos | Could | Should | Idem RF11. |

## <span id="94-calculo-da-prioridade-final-score"></span>Cálculo da prioridade final (Score) {#calculo-da-prioridade-final-score}

A prioridade final combina o Valor de Negócio, o peso MoSCoW e o Esforço Técnico:

<div class="priority-equation" role="math" aria-label="Score igual a VN mais peso MoSCoW menos ET">
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
<mrow><mtext>Score</mtext><mo>=</mo><mi>VN</mi><mo>+</mo><msub><mtext>Peso</mtext><mtext>MoSCoW</mtext></msub><mo>−</mo><mi>ET</mi></mrow>
</math>
</div>

| Faixa de Score | Decisão de entrega |
| --- | --- |
| Score ≥ 4 | Selecionado para o MVP. |
| Score de 2 a 3 | Condicionado à capacidade da equipe. |
| Score ≤ 1 | Evolução futura. |

A seleção final considera também dependências, viabilidade e validação com o cliente. Um
*Must Have* não é excluído apenas pelo esforço, e um *Won't Have* permanece fora desta versão.

### Exceções ao corte {#excecoes-ao-corte}

O Score define o recorte, exceto quando o cliente decide de outra forma e a decisão está registrada:

| Requisito | Score | Recorte | Decisão |
| --- | :---: | --- | --- |
| RF02 | 3 | MVP | Mantido como *Must Have* por decisão do cliente em 05/10/2026, pelo reaproveitamento dos dados existentes. |
| RF14 | 4 | Condicionado | O cliente respondeu "Não faz" para o histórico por período na primeira versão (04/11/2026), e o RF14 depende do RF13, também condicionado. |

As evidências de 04/11/2026 estão em [Validação do cliente](cliente-e-negocio.md#validacao-do-cliente).

### Sobreposição entre VN e MoSCoW

VN e MoSCoW partem de perguntas parecidas: essencialidade e urgência pesam nos dois, e isso pode
reforçar duas vezes os mesmos fatores. O efeito aparece em um caso: o RF12 teria Score 3 como
*Could Have* e ficaria condicionado; entra no MVP por ser *Must Have*. Essa classificação foi
confirmada pelo cliente na lista final de 05/10/2026, e o recorte do MVP não depende de nenhuma
outra reclassificação.

## <span id="95-matriz-de-valor-de-negocio-esforco-tecnico"></span>Matriz de Valor de negócio × Esforço técnico {#matriz-de-valor-de-negocio-esforco-tecnico}

Nos dois eixos, **0–2 pontos representam baixo** e **3–4 pontos representam alto**. A posição de
cada requisito utiliza VN e ET e está registrada no campo *Priorização* do seu registro.

| Quadrante | Característica |
| :--: | --- |
| Q1 | Alto valor e menor esforço. |
| Q2 | Alto valor e maior esforço. |
| Q3 | Baixo valor e menor esforço. |
| Q4 | Baixo valor e maior esforço. |

[Abrir a matriz diretamente no Miro](https://miro.com/app/board/uXjVEfU_HbE=/?moveToViewport=5543,1432,3508,3730)
· [Consultar a matriz textual](#alternativa-textual-da-matriz).

<iframe width="100%" height="900" title="Matriz de Valor de negócio × Esforço técnico" src="https://miro.com/app/live-embed/uXjVEfU_HbE=/?embedMode=view_only_without_ui&moveToViewport=5543,1432,3508,3730&embedId=91070939469" frameborder="0" scrolling="no" allow="fullscreen; clipboard-read; clipboard-write" allowfullscreen></iframe>

<details class="diagram-alternative" id="alternativa-textual-da-matriz">
<summary>Ver alternativa textual da matriz</summary>
<div class="diagram-alternative__body">
<p>Histórias agrupadas por valor de negócio e esforço técnico.</p>

<!-- PRIORIZACAO:MATRIZ -->

</div>
</details>

## <span id="96-decisoes-gerais-da-priorizacao"></span>Decisões gerais da priorização {#decisoes-gerais-da-priorizacao}

O recorte de cada história é exibido no [backlog](requisitos-de-software.md#registros-dos-requisitos-funcionais),
com os totais calculados a partir da base vigente. Os critérios utilizados são:

| Recorte de entrega | Critério aplicado |
| --- | --- |
| MVP | Score ≥ 4 |
| Condicionado à capacidade | Score de 2 a 3 |
| Evolução futura | Score ≤ 1 |

As faixas são critérios gerais, não uma lista automática de entrega. Conforme o
[PR #63](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/63),
o recorte vigente tem **12 US**: US02 permanece no MVP por exceção documentada,
mesmo com Score 3; US13 e US14 continuam separadas, condicionadas e sem sprint.
As justificativas e ressalvas de estimativa estão nos registros do catálogo.

Decisões gerais acordadas pela equipe ao aplicar o método:

- **A integração automática com o Mercado Livre ficou fora desta versão.** O esforço e a incerteza
  técnica da integração são incompatíveis com o prazo do semestre, e o problema central — saldo de
  estoque confiável — é resolvido sem ela. A decisão foi registrada como evolução futura na
  [Solução e características](solucao-e-caracteristicas.md).
- **O núcleo do MVP concentra-se nas CP1, CP2 e CP3** (backlog, movimentações e vendas). São as
  características que sustentam os objetivos [OE1](solucao-e-caracteristicas.md#oe1),
  [OE2](solucao-e-caracteristicas.md#oe2) e [OE6](solucao-e-caracteristicas.md#oe6), ligados
  diretamente à dor relatada pelo proprietário.
- **O MVP não tem login nem perfis de acesso.** A loja opera hoje com um único usuário, o
  proprietário, que abre o sistema direto, sem e-mail e senha; as histórias falam em "usuário"
  porque há apenas um. O cliente confirmou essa regra em 04/11/2026, ciente de que quem tiver o
  endereço consegue abrir o sistema; por isso a equipe não divulga o endereço de produção a
  terceiros ([evidência](cliente-e-negocio.md#validacao-do-cliente)). Login, perfis e cadastro de
  funcionários (CP9) ficam para quando houver contratação. O recorte é uma decisão de escopo, não
  uma dispensa de segurança: os critérios do
  [RNF05](requisitos-de-software.md#rnf05-seguranca-de-dados) continuam aplicáveis a todos os
  requisitos entregues.
- **Fornecedor e histórico entram na decisão final.** A entrada de peças (RF08) não depende do
  fornecedor (RF07): o cliente respondeu que não faz diferença. O filtro por período (RF14)
  depende do histórico (RF13), que ficou condicionado; por isso os dois ficam fora do MVP.
- **As histórias condicionadas permanecem no backlog, sem sprint atribuída.** Seu detalhamento
  e sua inclusão na entrega dependem de refinamento e reavaliação de capacidade após a Sprint 5.
- **Esforço não exclui um *Must Have*.** Nenhum requisito classificado como indispensável foi
  retirado do MVP por causa da nota de esforço; o maior ET entre os requisitos do MVP é 2.

## <span id="97-quando-a-priorizacao-e-revisada"></span>Quando a priorização é revisada {#quando-a-priorizacao-e-revisada}

A prioridade registrada não é definitiva. Ela é reavaliada quando:

- o proprietário confirma ou altera o valor de negócio de um requisito;
- o refinamento revela um esforço técnico diferente do estimado;
- uma dependência identificada no backlog muda a ordem viável de implementação;
- a revisão de uma sprint traz feedback que altera a importância de um requisito.

Em qualquer desses casos, a alteração é feita **na fonte do campo afetado** (base versionada ou issue), e o motivo
é registrado na issue ou no campo de evolução da base, conforme a fonte alterada, e no
[Organização e atualização](historico-de-evolucao.md).

## Versionamento

| Versão | Data | Descrição | Autor(es/as) |
| :----: | :--: | --- | --- |
| 1.0 | 05/10/2026 | Critérios de avaliação, priorização e matriz 2×2, originalmente publicados na seção 10.3 do Backlog de produto | [Thiago Gomes](https://github.com/thgomxs) |
| 2.0 | 03/11/2026 | Página dedicada ao **método e às decisões gerais** de priorização. A tabela de priorização por requisito foi incorporada ao [Catálogo de requisitos](requisitos-de-software.md), eliminando a lista paralela | Equipe |
| 2.1 | 04/11/2026 | Remoção da numeração estrutural e ajuste da hierarquia dos títulos, com links estáveis e preservação das âncoras anteriores. | [Thiago Gomes](https://github.com/thgomxs) |
| 2.2 | 14/11/2026 | Matriz textual derivada da base, link direto ao Miro e referência ao recorte vigente com suas exceções, sem lista paralela de requisitos (#55). | [Thiago Gomes](https://github.com/thgomxs) |
| 2.3 | 16/11/2026 | Memória de cálculo do VN (RF02), procedência das classificações MoSCoW, exceções ao corte (RF02 e RF14), definição de acesso sem login e perfis, dependências de fornecedor e histórico e reflexão sobre a sobreposição entre VN e MoSCoW (issue #53). | [João Melo](https://github.com/jot4-ge) |
