# <span id="9-priorizacao-de-requisitos"></span>Priorização de requisitos {#priorizacao-de-requisitos}


Esta página descreve **como** a equipe prioriza os requisitos e **quais decisões gerais** resultaram
desse método. A prioridade de cada requisito — valor de negócio, esforço técnico, MoSCoW, Score e
quadrante — é mantida no registro correspondente do
[Catálogo de requisitos](requisitos-de-software.md), e não é repetida aqui.

!!! tip "Consultar a prioridade vigente"
    O [índice do catálogo](requisitos-de-software.md#indice-dos-registros) lista todos os
    requisitos com VN, ET e Score, ordenáveis pela leitura. A justificativa de cada pontuação está
    no campo *Priorização* do registro do requisito.

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
    de elicitação e **aguardam confirmação formal do proprietário**. Cada registro do catálogo
    exibe essa situação no campo *Priorização*. A confirmação está prevista para a próxima sessão
    de validação de escopo com o cliente.

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

## <span id="95-matriz-de-valor-de-negocio-esforco-tecnico"></span>Matriz de Valor de negócio × Esforço técnico {#matriz-de-valor-de-negocio-esforco-tecnico}

Nos dois eixos, **0–2 pontos representam baixo** e **3–4 pontos representam alto**. A posição de
cada requisito utiliza VN e ET e está registrada no campo *Priorização* do seu registro.

| Quadrante | Característica |
| :--: | --- |
| Q1 | Alto valor e menor esforço. |
| Q2 | Alto valor e maior esforço. |
| Q3 | Baixo valor e menor esforço. |
| Q4 | Baixo valor e maior esforço. |

<iframe width="100%" height="900" title="Matriz de Valor de negócio × Esforço técnico" src="https://miro.com/app/live-embed/uXjVEfU_HbE=/?embedMode=view_only_without_ui&moveToViewport=5543,1432,3508,3730&embedId=91070939469" frameborder="0" scrolling="no" allow="fullscreen; clipboard-read; clipboard-write" allowfullscreen></iframe>

## <span id="96-decisoes-gerais-da-priorizacao"></span>Decisões gerais da priorização {#decisoes-gerais-da-priorizacao}

A aplicação do método aos 40 requisitos funcionais produziu a seguinte distribuição. Os números
são uma leitura dos registros do catálogo; a composição nominal de cada grupo é consultada no
[índice do catálogo](requisitos-de-software.md#indice-dos-registros), pela coluna *Entrega*.

| Recorte de entrega | Quantidade | Critério aplicado |
| --- | :--: | --- |
| MVP | 13 | Score ≥ 4 |
| Condicionado à capacidade | 5 | Score de 2 a 3 |
| Evolução futura | 22 | Score ≤ 1 |

Decisões gerais acordadas pela equipe ao aplicar o método:

- **A integração automática com o Mercado Livre ficou fora desta versão.** O esforço e a incerteza
  técnica da integração são incompatíveis com o prazo do semestre, e o problema central — saldo de
  estoque confiável — é resolvido sem ela. A decisão foi registrada como evolução futura na
  [Solução e características](solucao-e-caracteristicas.md).
- **O núcleo do MVP concentra-se nas CP1, CP2 e CP3** (catálogo, movimentações e vendas). São as
  características que sustentam os objetivos [OE1](solucao-e-caracteristicas.md#oe1),
  [OE2](solucao-e-caracteristicas.md#oe2) e [OE6](solucao-e-caracteristicas.md#oe6), ligados
  diretamente à dor relatada pelo proprietário.
- **Autenticação e gestão de usuários (CP9) ficaram fora do MVP.** A loja opera hoje com um único
  usuário, o proprietário; a delegação de tarefas é uma necessidade futura, condicionada a uma
  contratação. O recorte é uma decisão de escopo, não uma dispensa de segurança: os critérios do
  [RNF05](requisitos-de-software.md#rnf05-seguranca-de-dados) continuam aplicáveis a todos os
  requisitos entregues.
- **Os 5 requisitos condicionados não receberam história de usuário nem sprint.** Entram no escopo
  apenas se houver folga de capacidade após a Sprint 5, e serão repriorizados antes disso.
- **Esforço não exclui um *Must Have*.** Nenhum requisito classificado como indispensável foi
  retirado do MVP por causa da nota de esforço; o maior ET entre os requisitos do MVP é 2.

## <span id="97-quando-a-priorizacao-e-revisada"></span>Quando a priorização é revisada {#quando-a-priorizacao-e-revisada}

A prioridade registrada não é definitiva. Ela é reavaliada quando:

- o proprietário confirma ou altera o valor de negócio de um requisito;
- o refinamento revela um esforço técnico diferente do estimado;
- uma dependência identificada no catálogo muda a ordem viável de implementação;
- a revisão de uma sprint traz feedback que altera a importância de um requisito.

Em qualquer desses casos, a alteração é feita **no registro do requisito** no catálogo, e o motivo
é anotado no campo *Evolução* do próprio registro e no
[Histórico de evolução](historico-de-evolucao.md).

## Versionamento

| Versão | Data | Descrição | Autor(es/as) |
| :----: | :--: | --- | --- |
| 1.0 | 05/10/2026 | Critérios de avaliação, priorização e matriz 2×2, originalmente publicados na seção 10.3 do Backlog de produto | [Thiago Gomes](https://github.com/thgomxs) |
| 2.0 | 03/11/2026 | Página dedicada ao **método e às decisões gerais** de priorização. A tabela de priorização por requisito foi incorporada ao [Catálogo de requisitos](requisitos-de-software.md), eliminando a lista paralela | Equipe |
| 2.1 | 04/11/2026 | Remoção da numeração estrutural e ajuste da hierarquia dos títulos, com links estáveis e preservação das âncoras anteriores. | [Thiago Gomes](https://github.com/thgomxs) |
