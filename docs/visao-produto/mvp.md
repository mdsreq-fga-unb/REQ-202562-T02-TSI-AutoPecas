# <span id="10-definicao-e-composicao-do-mvp"></span>Definição e composição do MVP {#definicao-e-composicao-do-mvp}


Esta página registra **o objetivo do incremento**, **a justificativa do recorte** e **como o MVP
será validado** com o cliente. A composição nominal do MVP — quais requisitos entram, com que
prioridade e em que situação — é consultada no
[Catálogo de requisitos](requisitos-de-software.md), pela coluna *Entrega* do
[índice dos registros](requisitos-de-software.md#indice-dos-registros).

## <span id="101-objetivo-do-incremento"></span>Objetivo do incremento {#objetivo-do-incremento}

O MVP entrega o **núcleo que substitui o controle em planilhas**: um catálogo de peças padronizado,
um saldo de estoque confiável e o registro das vendas que movimentam esse saldo.

O incremento é considerado bem-sucedido se o proprietário conseguir, apenas no sistema, percorrer o
ciclo completo da sua rotina: **cadastrar uma peça → registrar a entrada do lote → vender →
consultar o saldo resultante**, com o saldo exibido correspondendo à contagem física.

Os objetivos específicos atendidos pelo recorte são
[OE1](solucao-e-caracteristicas.md#oe1) (cadastro padronizado),
[OE2](solucao-e-caracteristicas.md#oe2) (informação confiável de disponibilidade) e
[OE6](solucao-e-caracteristicas.md#oe6) (sistema como fonte única de dados).

## <span id="102-justificativa-do-recorte"></span>Justificativa do recorte {#justificativa-do-recorte}

O recorte resultou da aplicação do método descrito em [Priorização](priorizacao.md), combinada com
as restrições do projeto.

| Decisão | Justificativa |
| --- | --- |
| Entram as características **CP1, CP2 e CP3** | Concentram os requisitos de Score ≥ 4 e cobrem, juntas, o ciclo operacional completo da loja. Sem as três, o proprietário continuaria dependendo da planilha para alguma etapa da rotina. |
| Ficam fora **CP4, CP5 e CP6** (análise, financeiro, fiscal e expedição) | São capacidades de apoio à decisão e à retaguarda. Dependem de um histórico de dados que só existe depois que o núcleo estiver em uso, e sua ausência não impede a operação diária. |
| Fica fora a **CP9** (autenticação e gestão de usuários) | A loja opera com um único usuário. A delegação de tarefas é uma necessidade futura, condicionada a uma contratação. |
| Fica fora a **integração automática com o Mercado Livre** | Maior incerteza técnica do escopo e incompatível com o prazo do semestre. O saldo confiável — o problema real — é resolvido sem ela. |
| As **CP7 e CP8** não geram requisitos funcionais | São realizadas pelos RNFs, que se aplicam a **todos** os requisitos entregues no MVP. Estar fora da lista de RFs não significa estar fora do incremento. |
| **5 requisitos ficam condicionados** | Têm Score entre 2 e 3. Não receberam história de usuário nem sprint; entram apenas se houver folga de capacidade após a Sprint 5. |

**Limites explícitos do MVP.** O incremento não emite nota fiscal, não sincroniza estoque com
canais de venda on-line, não controla despesas nem gera relatórios analíticos, e não distingue
perfis de acesso. Esses limites estão registrados nos requisitos correspondentes do catálogo, com
recorte *Evolução futura*.

## <span id="103-epicos-do-incremento"></span>Épicos do incremento {#epicos-do-incremento}

Os épicos agrupam as histórias do MVP por uma necessidade ampla do produto, mantendo o vínculo com
a característica de produto de origem.

| Épico | CP de origem | Histórias vinculadas |
| --- | --- | --- |
| <strong id="ep01">EP01</strong> — Gestão do catálogo de peças | [CP1 — Cadastro e Catálogo de Peças](solucao-e-caracteristicas.md#cp1) | [US01](requisitos-de-software.md#rf01), [US02](requisitos-de-software.md#rf02), [US03](requisitos-de-software.md#rf03), [US04](requisitos-de-software.md#rf04), [US05](requisitos-de-software.md#rf05), [US06](requisitos-de-software.md#rf06) |
| <strong id="ep02">EP02</strong> — Controle de movimentações e saldo | [CP2 — Controle e Movimentação de Estoque](solucao-e-caracteristicas.md#cp2) | [US08](requisitos-de-software.md#rf08), [US09](requisitos-de-software.md#rf09), [US10](requisitos-de-software.md#rf10), [US12](requisitos-de-software.md#rf12), [US14](requisitos-de-software.md#rf14) |
| <strong id="ep03">EP03</strong> — Registro e cancelamento de vendas | [CP3 — Registro de Vendas e Recebimentos](solucao-e-caracteristicas.md#cp3) | [US15](requisitos-de-software.md#rf15), [US16](requisitos-de-software.md#rf16) |

Cada história é mantida no campo *Intenção e valor* do registro do seu requisito de origem. A
numeração da US acompanha a do RF — a US01 detalha o RF01 —, e os números ausentes (US07, US11,
US13) correspondem a requisitos que não entraram no MVP.

## <span id="104-quadro-de-acompanhamento-da-entrega"></span>Quadro de acompanhamento da entrega {#quadro-de-acompanhamento-da-entrega}

Visão da execução das histórias do MVP, derivada dos registros do catálogo. A **situação** aqui e a
situação no registro do requisito são a mesma informação: ao atualizar uma, atualize a outra.
As colunas de PR e commit registram a evidência de implementação, que não pertence ao registro do
requisito.

<table class="mvp-board">
<thead><tr>
<th scope="col">Sprint</th><th scope="col">História</th><th scope="col">Requisito</th>
<th scope="col">Situação</th><th scope="col">PR</th><th scope="col">Commit</th>
</tr></thead>
<tbody>
<tr><td data-label="Sprint">3</td><td data-label="História">US01 — Cadastrar peça</td><td data-label="Requisito"><a href="../requisitos-de-software/#rf01">RF01</a></td><td data-label="Situação">Não iniciado</td><td data-label="PR"></td><td data-label="Commit"></td></tr>
<tr><td data-label="Sprint">3</td><td data-label="História">US05 — Editar peça</td><td data-label="Requisito"><a href="../requisitos-de-software/#rf05">RF05</a></td><td data-label="Situação">Não iniciado</td><td data-label="PR"></td><td data-label="Commit"></td></tr>
<tr><td data-label="Sprint">3</td><td data-label="História">US06 — Alterar status da peça</td><td data-label="Requisito"><a href="../requisitos-de-software/#rf06">RF06</a></td><td data-label="Situação">Não iniciado</td><td data-label="PR"></td><td data-label="Commit"></td></tr>
<tr><td data-label="Sprint">4</td><td data-label="História">US02 — Importar peças via planilha</td><td data-label="Requisito"><a href="../requisitos-de-software/#rf02">RF02</a></td><td data-label="Situação">Não iniciado</td><td data-label="PR"></td><td data-label="Commit"></td></tr>
<tr><td data-label="Sprint">4</td><td data-label="História">US03 — Associar veículo à peça</td><td data-label="Requisito"><a href="../requisitos-de-software/#rf03">RF03</a></td><td data-label="Situação">Não iniciado</td><td data-label="PR"></td><td data-label="Commit"></td></tr>
<tr><td data-label="Sprint">4</td><td data-label="História">US04 — Buscar peça</td><td data-label="Requisito"><a href="../requisitos-de-software/#rf04">RF04</a></td><td data-label="Situação">Não iniciado</td><td data-label="PR"></td><td data-label="Commit"></td></tr>
<tr><td data-label="Sprint">4</td><td data-label="História">US08 — Registrar entrada de peças</td><td data-label="Requisito"><a href="../requisitos-de-software/#rf08">RF08</a></td><td data-label="Situação">Não iniciado</td><td data-label="PR"></td><td data-label="Commit"></td></tr>
<tr><td data-label="Sprint">4</td><td data-label="História">US12 — Consultar saldo de peça</td><td data-label="Requisito"><a href="../requisitos-de-software/#rf12">RF12</a></td><td data-label="Situação">Não iniciado</td><td data-label="PR"></td><td data-label="Commit"></td></tr>
<tr><td data-label="Sprint">5</td><td data-label="História">US09 — Registrar saída manual</td><td data-label="Requisito"><a href="../requisitos-de-software/#rf09">RF09</a></td><td data-label="Situação">Não iniciado</td><td data-label="PR"></td><td data-label="Commit"></td></tr>
<tr><td data-label="Sprint">5</td><td data-label="História">US10 — Registrar ajuste de inventário</td><td data-label="Requisito"><a href="../requisitos-de-software/#rf10">RF10</a></td><td data-label="Situação">Não iniciado</td><td data-label="PR"></td><td data-label="Commit"></td></tr>
<tr><td data-label="Sprint">5</td><td data-label="História">US14 — Filtrar histórico por período</td><td data-label="Requisito"><a href="../requisitos-de-software/#rf14">RF14</a></td><td data-label="Situação">Não iniciado</td><td data-label="PR"></td><td data-label="Commit"></td></tr>
<tr><td data-label="Sprint">5</td><td data-label="História">US15 — Registrar venda</td><td data-label="Requisito"><a href="../requisitos-de-software/#rf15">RF15</a></td><td data-label="Situação">Não iniciado</td><td data-label="PR"></td><td data-label="Commit"></td></tr>
<tr><td data-label="Sprint">5</td><td data-label="História">US16 — Cancelar venda</td><td data-label="Requisito"><a href="../requisitos-de-software/#rf16">RF16</a></td><td data-label="Situação">Não iniciado</td><td data-label="PR"></td><td data-label="Commit"></td></tr>
</tbody>
</table>

A distribuição das histórias pelas sprints e os marcos de cada entrega estão em
[Cronograma](cronograma-e-entregas.md).

## <span id="105-validacao-do-mvp"></span>Validação do MVP {#validacao-do-mvp}

A validação é incremental e acontece em três níveis.

| Momento | Como o incremento é validado | Evidência registrada |
| --- | --- | --- |
| Refinamento de cada história | A história só entra na sprint se atender à [DoR](dor-e-dod.md), com critérios de confirmação acordados. | Critérios no campo *Condições e avaliação* do registro |
| Sprint Review (sprints 3, 4 e 5) | O proprietário usa o incremento com dados reais da loja e aponta divergências. | [Atas](../atas/index.md) da sprint e campo *Evolução* dos registros afetados |
| Sessão de aceitação (Sprint 5) | O proprietário percorre o ciclo completo — cadastro, entrada, venda, cancelamento — com uma amostra dos dados reais e confere os saldos resultantes. | Ata da sessão e situação dos registros no catálogo |

O MVP é considerado aceito quando o ciclo completo da rotina é percorrido sem recorrer à planilha e
o saldo exibido corresponde à contagem física das peças usadas no teste.

## <span id="106-pontos-em-aberto-do-recorte"></span>Pontos em aberto do recorte {#pontos-em-aberto-do-recorte}

Pendências identificadas na revisão do escopo que ainda não foram decididas com o cliente.

- **Dependência do RF14 em um requisito condicionado.** A
  [US14](requisitos-de-software.md#rf14) (filtrar histórico por período) está no MVP, mas o
  [RF13](requisitos-de-software.md#rf13) (consultar histórico de movimentações), que produz a
  listagem a ser filtrada, está classificado como condicionado. O recorte precisa ser resolvido:
  ou o RF13 entra no MVP, ou o RF14 sai. A equipe levará o ponto à próxima sessão de priorização
  com o proprietário.
- **Confirmação do valor de negócio.** As pontuações de VN que sustentam o recorte ainda não foram
  confirmadas formalmente pelo proprietário, conforme registrado em
  [Priorização](priorizacao.md#avaliacao-do-valor-de-negocio-vn).

## Versionamento

| Versão | Data | Descrição | Autor(es/as) |
| :----: | :--: | --- | --- |
| 1.0 | 12/10/2026 | Épicos, histórias de usuário e quadro MVP, originalmente publicados nas seções 10.4, 10.5 e 10.7 do Backlog de produto | [Thiago Gomes](https://github.com/thgomxs) |
| 2.0 | 03/11/2026 | Página dedicada ao **objetivo, à justificativa do recorte e à validação** do MVP. As narrativas das histórias foram incorporadas aos registros do [Catálogo de requisitos](requisitos-de-software.md); o quadro passou a acompanhar a execução. Registrada a dependência em aberto entre RF14 e RF13 | Equipe |
| 2.1 | 04/11/2026 | Remoção da numeração estrutural e ajuste da hierarquia dos títulos, com links estáveis e preservação das âncoras anteriores. | [Thiago Gomes](https://github.com/thgomxs) |
