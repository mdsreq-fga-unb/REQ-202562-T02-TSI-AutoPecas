<style>
.md-typeset .backlog-page {
  min-width: 0;
  max-width: 100%;
  overflow-wrap: anywhere;
}
.md-typeset .backlog-page .md-typeset__scrollwrap,
.md-typeset .backlog-page .md-typeset__table {
  display: block;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  margin: 0;
  overflow: visible;
}
.md-typeset .backlog-page .backlog-table {
  display: table;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  margin: 1rem 0;
  font-size: .7rem;
}
.md-typeset .backlog-page .backlog-table th,
.md-typeset .backlog-page .backlog-table td {
  padding: .55rem .4rem;
  min-width: 0;
  vertical-align: top;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: normal;
}
.md-typeset .backlog-page .backlog-table--general th:nth-child(1) { width: 8%; }
.md-typeset .backlog-page .backlog-table--general th:nth-child(2) { width: 23%; }
.md-typeset .backlog-page .backlog-table--general th:nth-child(3) { width: 69%; }
.md-typeset .backlog-page .backlog-table--business th:nth-child(1) { width: 12%; }
.md-typeset .backlog-page .backlog-table--business th:nth-child(2) { width: 10%; }
.md-typeset .backlog-page .backlog-table--business th:nth-child(3) { width: 78%; }
.md-typeset .backlog-page .backlog-table--priority { font-size: .65rem; }
.md-typeset .backlog-page .backlog-table--priority th:nth-child(1) { width: 8%; }
.md-typeset .backlog-page .backlog-table--priority th:nth-child(2) { width: 30%; }
.md-typeset .backlog-page .backlog-table--priority th:nth-child(3),
.md-typeset .backlog-page .backlog-table--priority th:nth-child(5) { width: 6%; }
.md-typeset .backlog-page .backlog-table--priority th:nth-child(4) { width: 15%; }
.md-typeset .backlog-page .backlog-table--priority th:nth-child(6) { width: 7%; }
.md-typeset .backlog-page .backlog-table--priority th:nth-child(7) { width: 10%; }
.md-typeset .backlog-page .backlog-table--priority th:nth-child(8) { width: 14%; }
.md-typeset .backlog-page .backlog-table--epics th:nth-child(1) { width: 38%; }
.md-typeset .backlog-page .backlog-table--epics th:nth-child(2) { width: 30%; }
.md-typeset .backlog-page .backlog-table--epics th:nth-child(3) { width: 32%; }
.md-typeset .backlog-page .backlog-table--stories th:nth-child(1),
.md-typeset .backlog-page .backlog-table--stories th:nth-child(2),
.md-typeset .backlog-page .backlog-table--stories th:nth-child(5) { width: 10%; }
.md-typeset .backlog-page .backlog-table--stories th:nth-child(3) { width: 22%; }
.md-typeset .backlog-page .backlog-table--stories th:nth-child(4) { width: 48%; }
.md-typeset .backlog-page .backlog-table--mvp th:nth-child(1) { width: 10%; }
.md-typeset .backlog-page .backlog-table--mvp th:nth-child(2) { width: 40%; }
.md-typeset .backlog-page .backlog-table--mvp th:nth-child(3) { width: 20%; }
.md-typeset .backlog-page .backlog-table--mvp th:nth-child(4) { width: 10%; }
.md-typeset .backlog-page .backlog-table--mvp th:nth-child(5) { width: 20%; }
.md-typeset .backlog-page .backlog-rnfs {
  display: block;
  margin-top: .5rem;
  font-size: .65rem;
}
.md-typeset .backlog-page .backlog-equation {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  box-sizing: border-box;
  margin: 1rem 0;
  padding: 1rem .5rem;
  border: 1px solid var(--md-default-fg-color--lightest, #ddd);
  border-radius: .75rem;
  background: color-mix(in srgb, var(--tsi-red) 4%, var(--tsi-surface));
  font-size: clamp(16px, 2vw, 24px);
}
.md-typeset .backlog-page iframe {
  display: block;
  width: 100%;
  max-width: 100%;
  border: 0;
  border-radius: .75rem;
}
@media (max-width: 640px) {
  .md-typeset .backlog-page .backlog-table,
  .md-typeset .backlog-page .backlog-table tbody,
  .md-typeset .backlog-page .backlog-table tr,
  .md-typeset .backlog-page .backlog-table td {
    display: block;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }
  .md-typeset .backlog-page .backlog-table thead { display: none; }
  .md-typeset .backlog-page .backlog-table { border: 0; overflow: visible; }
  .md-typeset .backlog-page .backlog-table tr {
    margin-bottom: .75rem;
    border: 1px solid var(--md-default-fg-color--lightest, #ddd);
    border-radius: .5rem;
  }
  .md-typeset .backlog-page .backlog-table td { border: 0; }
  .md-typeset .backlog-page .backlog-table td::before {
    content: attr(data-label) ": ";
    font-weight: 700;
  }
  .md-typeset .backlog-page .backlog-equation { font-size: 16px; }
}
</style>

<div class="backlog-page" markdown="1">

# Backlog de produto

## 10 Backlog de produto

### 10.1 Backlog geral

A página apresenta, nesta ordem:

- **Lista de requisitos:** requisitos previstos e RNFs vinculados.
- **Priorização:** avaliação de valor, esforço e importância para definir o MVP.
- **Épicos:** agrupamentos de histórias com um objetivo comum.
- **Histórias de usuário:** necessidades descritas pela perspectiva do usuário.
- **Árvore:** vínculos entre OE, CP, RF e US.
- **Quadro MVP:** acompanhamento do status, PRs e commits das histórias selecionadas.

<table class="backlog-table backlog-table--general">
<thead><tr>
<th scope="col">ID</th>
<th scope="col">Nome</th>
<th scope="col">Descrição do requisito</th>
</tr></thead>
<tbody>
<tr>
<td data-label="ID">RF01</td>
<td data-label="Nome">Cadastrar peça</td>
<td data-label="Descrição do requisito">O sistema deve permitir que utilizadores com perfil Administrador ou Operador cadastrem uma peça, com preenchimento obrigatório do código do fabricante, do nome e da categoria; e preenchimento opcional da descrição técnica, da localização física e de uma foto.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF02</td>
<td data-label="Nome">Importar peças via planilha</td>
<td data-label="Descrição do requisito">O sistema deve permitir ao perfil Administrador selecionar uma planilha .xlsx de peças, validar os registros e cadastrá-los em lote, sem sobrescrever peças já cadastradas com o mesmo código do fabricante.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF03</td>
<td data-label="Nome">Associar veículo à peça</td>
<td data-label="Descrição do requisito">O sistema deve permitir a associação de uma ou mais aplicações por veículo a uma peça cadastrada, com registo de marca, modelo e ano de compatibilidade.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF04</td>
<td data-label="Nome">Buscar peça</td>
<td data-label="Descrição do requisito">O sistema deve permitir a localização de peças no catálogo por ao menos um dos seguintes filtros: código do fabricante, nome, categoria ou aplicação por veículo (marca, modelo ou ano).<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf04-desempenho-de-resposta">RNF04</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF05</td>
<td data-label="Nome">Editar peça</td>
<td data-label="Descrição do requisito">O sistema deve permitir a edição de qualquer campo do cadastro de uma peça já registrada, com exceção do código do fabricante, que é imutável após o cadastro inicial.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF06</td>
<td data-label="Nome">Alterar status da peça</td>
<td data-label="Descrição do requisito">O sistema deve permitir que o usuário altere o status de uma peça, alternando entre &quot;ativo&quot; e &quot;inativo&quot;.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF07</td>
<td data-label="Nome">Cadastrar fornecedor</td>
<td data-label="Descrição do requisito">O sistema deve permitir o cadastro de fornecedores.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF08</td>
<td data-label="Nome">Registar entrada de peças</td>
<td data-label="Descrição do requisito">O sistema deve permitir o registo da entrada de um lote de peças no stock, com informação da peça, da quantidade, da data, do fornecedor e do preço de custo unitário.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF09</td>
<td data-label="Nome">Registar saída manual</td>
<td data-label="Descrição do requisito">O sistema deve permitir que utilizadores com perfil Administrador ou Operador registrem uma saída manual de peças do stock, com informação da peça, da quantidade, da data e do motivo.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF10</td>
<td data-label="Nome">Registar ajuste de inventário</td>
<td data-label="Descrição do requisito">O sistema deve permitir que apenas o perfil Administrador realize o registo de um ajuste de inventário, com informação da peça, da diferença de quantidade (positiva ou negativa) e da justificativa do ajuste.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF11</td>
<td data-label="Nome">Registar devolução de peça</td>
<td data-label="Descrição do requisito">O sistema deve permitir que o usuário registre a devolução de uma peça vinculada a uma venda, restabelecendo a quantidade devolvida ao saldo do estoque.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF12</td>
<td data-label="Nome">Consultar saldo de peça</td>
<td data-label="Descrição do requisito">O sistema deve exibir o saldo atual da peça (quantidade física total disponível).<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf04-desempenho-de-resposta">RNF04</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF13</td>
<td data-label="Nome">Consultar histórico de movimentações</td>
<td data-label="Descrição do requisito">O sistema deve exibir no ecrã o histórico de movimentações da peça.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF14</td>
<td data-label="Nome">Filtrar histórico por período</td>
<td data-label="Descrição do requisito">O sistema deve permitir que o utilizador aplique um filtro de período (data) na listagem do histórico de movimentações.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF15</td>
<td data-label="Nome">Registrar venda</td>
<td data-label="Descrição do requisito">O sistema deve permitir a utilizadores com perfil Administrador ou Operador o registro de uma venda com informação do canal de origem, das peças vendidas, das quantidades e do preço, atualizando o saldo em estoque.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF16</td>
<td data-label="Nome">Cancelar venda</td>
<td data-label="Descrição do requisito">O sistema deve permitir ao Administrador cancelar uma venda registrada previamente, revertendo a baixa de estoque correspondente.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF17</td>
<td data-label="Nome">Registrar encargos da venda</td>
<td data-label="Descrição do requisito">O sistema deve permitir o registro dos valores de desconto concedido, frete cobrado e taxas aplicadas (ex: comissão do marketplace) para uma venda já criada.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF18</td>
<td data-label="Nome">Gerenciar status de recebimento</td>
<td data-label="Descrição do requisito">O sistema deve permitir que o usuário registre o recebimento (total ou parcial) de uma venda e a forma de pagamento por meio de um botão dropdown, com as opções de status de recebimento. O status de novas vendas deve iniciar como &quot;a receber&quot;, podendo o utilizador com perfil Administrador ou Operador atualizar esse status de forma autónoma ao registo.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF19</td>
<td data-label="Nome">Exibir total consolidado</td>
<td data-label="Descrição do requisito">O sistema deve exibir uma página com o total consolidado de valores a receber, listando as vendas pendentes.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF20</td>
<td data-label="Nome">Filtrar página de recebíveis</td>
<td data-label="Descrição do requisito">O sistema deve permitir que o usuário aplique filtros por período e canal na página de recebíveis.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF21</td>
<td data-label="Nome">Definir estoque mínimo por peça</td>
<td data-label="Descrição do requisito">O sistema deve permitir a configuração de uma quantidade mínima de estoque para cada peça, abaixo da qual o item é considerado em estado crítico.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF22</td>
<td data-label="Nome">Consultar painel de estoque crítico</td>
<td data-label="Descrição do requisito">O sistema deve exibir um painel consolidado com todas as peças em estado crítico (saldo abaixo do mínimo ou zerado), com indicação do saldo atual e do mínimo configurado.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf04-desempenho-de-resposta">RNF04</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF23</td>
<td data-label="Nome">Criar lista de compras</td>
<td data-label="Descrição do requisito">O sistema deve permitir a criação de uma lista de compras para a próxima remessa, com adição manual das peças desejadas e das quantidades a pedir.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF24</td>
<td data-label="Nome">Confirmar recebimento de remessa</td>
<td data-label="Descrição do requisito">O sistema deve permitir a confirmação do recebimento de uma remessa vinculada a uma lista de compras, aceitando recebimentos parciais ou totais. Caso a quantidade recebida seja divergente da lista, o sistema deve exigir uma justificativa. Ao confirmar, o saldo em estoque deve ser atualizado imediatamente.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF25</td>
<td data-label="Nome">Listar itens mais vendidos</td>
<td data-label="Descrição do requisito">O sistema deve fornecer uma interface de consulta, permitindo filtrar e ordenar itens por: volume de vendas (maior/menor) e itens sem movimentação (indicando dias desde a última saída), com período de tempo configurável.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf04-desempenho-de-resposta">RNF04</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF26</td>
<td data-label="Nome">Analisar desempenho por canal</td>
<td data-label="Descrição do requisito">O sistema deve gerar um consolidado de vendas (volume de peças e valor financeiro total), agrupado por canal de origem (balcão, Mercado Livre e contato direto), a partir de um período de tempo configurável.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf04-desempenho-de-resposta">RNF04</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF27</td>
<td data-label="Nome">Exportar relatórios</td>
<td data-label="Descrição do requisito">O sistema deve permitir a exportação do relatório de movimentações do estoque e do relatório de vendas, ambos gerados em um período configurável e visualizáveis em tela, nos formatos PDF e .xlsx (Excel), preservando os filtros e os dados exibidos.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf04-desempenho-de-resposta">RNF04</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF28</td>
<td data-label="Nome">Registrar despesa operacional</td>
<td data-label="Descrição do requisito">O sistema deve permitir ao administrador registrar uma despesa da operação (ex.: aluguel, embalagens ou frete de compra), informando data, categoria e valor.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF29</td>
<td data-label="Nome">Editar despesa operacional</td>
<td data-label="Descrição do requisito">O sistema deve permitir ao administrador selecionar uma despesa operacional já registrada e alterar sua data, categoria e valor, salvando as alterações no mesmo registro.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF30</td>
<td data-label="Nome">Excluir despesa operacional</td>
<td data-label="Descrição do requisito">O sistema deve permitir ao administrador selecionar uma despesa operacional já registrada e excluí-la após confirmar a exclusão.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF31</td>
<td data-label="Nome">Consultar demonstrativo financeiro</td>
<td data-label="Descrição do requisito">O sistema deve disponibilizar ao administrador uma página de demonstrativo financeiro com campos de data inicial e data final. Ao solicitar a consulta, a página deve exibir o total dos valores líquidos das vendas cuja data esteja no período informado, o total das despesas operacionais cuja data esteja no mesmo período e o saldo entre esses totais (receitas menos despesas), com detalhamento das receitas por canal e das despesas por categoria.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf04-desempenho-de-resposta">RNF04</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF32</td>
<td data-label="Nome">Registrar dados fiscais da peça</td>
<td data-label="Descrição do requisito">O sistema deve permitir ao administrador registrar no cadastro da peça: NCM, unidade tributável, alíquotas, origem da mercadoria e CST ou CSOSN, conforme aplicável. Esses dados pertencem à peça; o CFOP depende da operação fiscal e não é um dado fixo desse cadastro.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF33</td>
<td data-label="Nome">Editar dados fiscais da peça</td>
<td data-label="Descrição do requisito">O sistema deve permitir ao administrador alterar, no cadastro de uma peça, os dados fiscais já registrados: código NCM, unidade tributável, alíquotas, origem da mercadoria e CST ou CSOSN, conforme aplicável.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF34</td>
<td data-label="Nome">Vincular documento fiscal à venda</td>
<td data-label="Descrição do requisito">O sistema deve permitir vincular a uma venda concluída o número e a data de um documento fiscal já emitido (NF-e, NFC-e ou cupom fiscal). Essas informações ficam associadas à venda.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF35</td>
<td data-label="Nome">Registrar envio de peças</td>
<td data-label="Descrição do requisito">O sistema deve permitir o registro, para uma venda com entrega, da modalidade de envio, do código de rastreio e da data de despacho.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF36</td>
<td data-label="Nome">Consultar expedições do período</td>
<td data-label="Descrição do requisito">O sistema deve exibir as vendas com entrega de um período, com o status de cada envio (a enviar / enviado / entregue) e os dados de rastreio registrados.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF37</td>
<td data-label="Nome">Autenticar usuário</td>
<td data-label="Descrição do requisito">O sistema deve exigir autenticação por credenciais (e-mail e senha) para acesso a qualquer funcionalidade, bloqueando o acesso após cinco tentativas consecutivas malsucedidas.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF38</td>
<td data-label="Nome">Cadastrar usuário</td>
<td data-label="Descrição do requisito">O sistema deve permitir ao administrador cadastrar um usuário, informando e-mail, senha inicial e perfil de acesso (administrador ou operador).<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF39</td>
<td data-label="Nome">Editar usuário</td>
<td data-label="Descrição do requisito">O sistema deve permitir ao administrador alterar o e-mail e o perfil de acesso de um usuário ativo, mantendo o histórico de operações desse usuário.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
<tr>
<td data-label="ID">RF40</td>
<td data-label="Nome">Desativar usuário</td>
<td data-label="Descrição do requisito">O sistema deve permitir ao administrador desativar uma conta de usuário, impedindo novos acessos dessa conta sem apagar seus registros históricos.<span class="backlog-rnfs"><strong>RNFs vinculados:</strong> <a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></span></td>
</tr>
</tbody>
</table>

### 10.2 Priorização

#### Avaliação do valor do negócio

Para cada RF, responda às quatro perguntas abaixo com o cliente. **Cada “Sim” acrescenta 1 ponto; cada “Não” acrescenta 0.** A soma das respostas forma o **Valor de Negócio (VN)**, de **0 a 4 pontos**.

<table class="backlog-table ">
<thead><tr>
<th scope="col">Critério</th>
<th scope="col">Pergunta</th>
<th scope="col">Pontuação</th>
</tr></thead>
<tbody>
<tr>
<td data-label="Critério">Essencialidade</td>
<td data-label="Pergunta">O sistema deixa de resolver o problema principal sem essa funcionalidade?</td>
<td data-label="Pontuação"><strong>Sim: +1</strong><br>Não: 0</td>
</tr>
<tr>
<td data-label="Critério">Frequência</td>
<td data-label="Pergunta">A funcionalidade será utilizada rotineiramente na operação?</td>
<td data-label="Pontuação"><strong>Sim: +1</strong><br>Não: 0</td>
</tr>
<tr>
<td data-label="Critério">Impacto na dor</td>
<td data-label="Pergunta">Sua ausência mantém perdas de tempo ou dinheiro?</td>
<td data-label="Pontuação"><strong>Sim: +1</strong><br>Não: 0</td>
</tr>
<tr>
<td data-label="Critério">Urgência</td>
<td data-label="Pergunta">A funcionalidade é indispensável para a primeira versão?</td>
<td data-label="Pontuação"><strong>Sim: +1</strong><br>Não: 0</td>
</tr>
</tbody>
</table>

**Exemplo:** três respostas “Sim” e uma “Não” resultam em **VN = 3**. As justificativas dos RFs abaixo devem ser confirmadas pelo cliente.

#### Avaliação do esforço técnico

A equipe atribui notas de **1 a 4** aos três critérios. Quanto maior a nota, maior a dificuldade.

- **Esforço de Implementação (EI):** trabalho necessário para construir, testar e integrar a funcionalidade.
- **Complexidade Arquitetural (CA):** relações entre componentes, dependências e incertezas técnicas.
- **Lacuna de Capacidade (LC):** aprendizagem ou recursos adicionais necessários à equipe.

<table class="backlog-table ">
<thead><tr>
<th scope="col">Nota</th>
<th scope="col">Esforço de Implementação (EI)</th>
<th scope="col">Complexidade Arquitetural (CA)</th>
<th scope="col">Lacuna de Capacidade (LC)</th>
</tr></thead>
<tbody>
<tr>
<td data-label="Nota">1</td>
<td data-label="Esforço de Implementação (EI)">Operação simples ou alteração pontual.</td>
<td data-label="Complexidade Arquitetural (CA)">Solução conhecida, com poucas dependências.</td>
<td data-label="Lacuna de Capacidade (LC)">Conhecimentos necessários dominados.</td>
</tr>
<tr>
<td data-label="Nota">2</td>
<td data-label="Esforço de Implementação (EI)">Fluxo com validações e persistência integrada.</td>
<td data-label="Complexidade Arquitetural (CA)">Alguma investigação ou integração.</td>
<td data-label="Lacuna de Capacidade (LC)">Pouca aprendizagem adicional.</td>
</tr>
<tr>
<td data-label="Nota">3</td>
<td data-label="Esforço de Implementação (EI)">Processamento em lote ou múltiplos fluxos relacionados.</td>
<td data-label="Complexidade Arquitetural (CA)">Várias dependências ou incertezas.</td>
<td data-label="Lacuna de Capacidade (LC)">Aprendizagem relevante necessária.</td>
</tr>
<tr>
<td data-label="Nota">4</td>
<td data-label="Esforço de Implementação (EI)">Trabalho extenso ou integração crítica.</td>
<td data-label="Complexidade Arquitetural (CA)">Elevada incerteza ou tecnologia não dominada.</td>
<td data-label="Lacuna de Capacidade (LC)">Conhecimentos ou recursos ainda indisponíveis.</td>
</tr>
</tbody>
</table>

O **Esforço Técnico (ET)** é a média dos três critérios, arredondada ao inteiro mais próximo:

<div class="backlog-equation" role="math" aria-label="ET igual à média de EI, CA e LC, arredondada ao inteiro mais próximo">
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
<mrow><mi>ET</mi><mo>=</mo><mtext>arred</mtext><mo>(</mo><mfrac><mrow><mi>EI</mi><mo>+</mo><mi>CA</mi><mo>+</mo><mi>LC</mi></mrow><mn>3</mn></mfrac><mo>)</mo></mrow>
</math>
</div>

**Exemplo:** RF03 recebeu EI = 3, CA = 3 e LC = 1. A média é 2,33, resultando em **ET = 2**.

<table class="backlog-table ">
<thead><tr>
<th scope="col">ID</th>
<th scope="col">Esforço de Implementação (EI)</th>
<th scope="col">Complexidade Arquitetural (CA)</th>
<th scope="col">Lacuna de Capacidade (LC)</th>
<th scope="col">Esforço Técnico (ET)</th>
</tr></thead>
<tbody>
<tr>
<td data-label="ID">RF01</td>
<td data-label="Esforço de Implementação (EI)">3</td>
<td data-label="Complexidade Arquitetural (CA)">2</td>
<td data-label="Lacuna de Capacidade (LC)">1</td>
<td data-label="Esforço Técnico (ET)">2</td>
</tr>
<tr>
<td data-label="ID">RF02</td>
<td data-label="Esforço de Implementação (EI)">2</td>
<td data-label="Complexidade Arquitetural (CA)">2</td>
<td data-label="Lacuna de Capacidade (LC)">1</td>
<td data-label="Esforço Técnico (ET)">2</td>
</tr>
<tr>
<td data-label="ID">RF03</td>
<td data-label="Esforço de Implementação (EI)">3</td>
<td data-label="Complexidade Arquitetural (CA)">3</td>
<td data-label="Lacuna de Capacidade (LC)">1</td>
<td data-label="Esforço Técnico (ET)">2</td>
</tr>
<tr>
<td data-label="ID">RF04</td>
<td data-label="Esforço de Implementação (EI)">2</td>
<td data-label="Complexidade Arquitetural (CA)">2</td>
<td data-label="Lacuna de Capacidade (LC)">1</td>
<td data-label="Esforço Técnico (ET)">2</td>
</tr>
<tr>
<td data-label="ID">RF05</td>
<td data-label="Esforço de Implementação (EI)">1</td>
<td data-label="Complexidade Arquitetural (CA)">1</td>
<td data-label="Lacuna de Capacidade (LC)">1</td>
<td data-label="Esforço Técnico (ET)">1</td>
</tr>
<tr>
<td data-label="ID">RF06</td>
<td data-label="Esforço de Implementação (EI)">3</td>
<td data-label="Complexidade Arquitetural (CA)">3</td>
<td data-label="Lacuna de Capacidade (LC)">1</td>
<td data-label="Esforço Técnico (ET)">2</td>
</tr>
<tr>
<td data-label="ID">RF07</td>
<td data-label="Esforço de Implementação (EI)">1</td>
<td data-label="Complexidade Arquitetural (CA)">1</td>
<td data-label="Lacuna de Capacidade (LC)">1</td>
<td data-label="Esforço Técnico (ET)">1</td>
</tr>
<tr>
<td data-label="ID">RF08</td>
<td data-label="Esforço de Implementação (EI)">1</td>
<td data-label="Complexidade Arquitetural (CA)">1</td>
<td data-label="Lacuna de Capacidade (LC)">1</td>
<td data-label="Esforço Técnico (ET)">1</td>
</tr>
<tr>
<td data-label="ID">RF09</td>
<td data-label="Esforço de Implementação (EI)">2</td>
<td data-label="Complexidade Arquitetural (CA)">2</td>
<td data-label="Lacuna de Capacidade (LC)">2</td>
<td data-label="Esforço Técnico (ET)">2</td>
</tr>
<tr>
<td data-label="ID">RF10</td>
<td data-label="Esforço de Implementação (EI)">2</td>
<td data-label="Complexidade Arquitetural (CA)">2</td>
<td data-label="Lacuna de Capacidade (LC)">2</td>
<td data-label="Esforço Técnico (ET)">2</td>
</tr>
<tr>
<td data-label="ID">RF11</td>
<td data-label="Esforço de Implementação (EI)">2</td>
<td data-label="Complexidade Arquitetural (CA)">2</td>
<td data-label="Lacuna de Capacidade (LC)">2</td>
<td data-label="Esforço Técnico (ET)">2</td>
</tr>
<tr>
<td data-label="ID">RF12</td>
<td data-label="Esforço de Implementação (EI)">1</td>
<td data-label="Complexidade Arquitetural (CA)">1</td>
<td data-label="Lacuna de Capacidade (LC)">2</td>
<td data-label="Esforço Técnico (ET)">1</td>
</tr>
<tr>
<td data-label="ID">RF13</td>
<td data-label="Esforço de Implementação (EI)">2</td>
<td data-label="Complexidade Arquitetural (CA)">1</td>
<td data-label="Lacuna de Capacidade (LC)">2</td>
<td data-label="Esforço Técnico (ET)">2</td>
</tr>
<tr>
<td data-label="ID">RF14</td>
<td data-label="Esforço de Implementação (EI)">1</td>
<td data-label="Complexidade Arquitetural (CA)">1</td>
<td data-label="Lacuna de Capacidade (LC)">2</td>
<td data-label="Esforço Técnico (ET)">1</td>
</tr>
<tr>
<td data-label="ID">RF15</td>
<td data-label="Esforço de Implementação (EI)">2</td>
<td data-label="Complexidade Arquitetural (CA)">2</td>
<td data-label="Lacuna de Capacidade (LC)">1</td>
<td data-label="Esforço Técnico (ET)">2</td>
</tr>
<tr>
<td data-label="ID">RF16</td>
<td data-label="Esforço de Implementação (EI)">2</td>
<td data-label="Complexidade Arquitetural (CA)">2</td>
<td data-label="Lacuna de Capacidade (LC)">1</td>
<td data-label="Esforço Técnico (ET)">2</td>
</tr>
<tr>
<td data-label="ID">RF17</td>
<td data-label="Esforço de Implementação (EI)">2</td>
<td data-label="Complexidade Arquitetural (CA)">2</td>
<td data-label="Lacuna de Capacidade (LC)">1</td>
<td data-label="Esforço Técnico (ET)">2</td>
</tr>
<tr>
<td data-label="ID">RF18</td>
<td data-label="Esforço de Implementação (EI)">2</td>
<td data-label="Complexidade Arquitetural (CA)">2</td>
<td data-label="Lacuna de Capacidade (LC)">2</td>
<td data-label="Esforço Técnico (ET)">2</td>
</tr>
<tr>
<td data-label="ID">RF19</td>
<td data-label="Esforço de Implementação (EI)">2</td>
<td data-label="Complexidade Arquitetural (CA)">1</td>
<td data-label="Lacuna de Capacidade (LC)">1</td>
<td data-label="Esforço Técnico (ET)">1</td>
</tr>
<tr>
<td data-label="ID">RF20</td>
<td data-label="Esforço de Implementação (EI)">1</td>
<td data-label="Complexidade Arquitetural (CA)">2</td>
<td data-label="Lacuna de Capacidade (LC)">1</td>
<td data-label="Esforço Técnico (ET)">1</td>
</tr>
<tr>
<td data-label="ID">RF21</td>
<td data-label="Esforço de Implementação (EI)">1</td>
<td data-label="Complexidade Arquitetural (CA)">1</td>
<td data-label="Lacuna de Capacidade (LC)">1</td>
<td data-label="Esforço Técnico (ET)">1</td>
</tr>
<tr>
<td data-label="ID">RF22</td>
<td data-label="Esforço de Implementação (EI)">2</td>
<td data-label="Complexidade Arquitetural (CA)">3</td>
<td data-label="Lacuna de Capacidade (LC)">2</td>
<td data-label="Esforço Técnico (ET)">2</td>
</tr>
<tr>
<td data-label="ID">RF23</td>
<td data-label="Esforço de Implementação (EI)">2</td>
<td data-label="Complexidade Arquitetural (CA)">1</td>
<td data-label="Lacuna de Capacidade (LC)">1</td>
<td data-label="Esforço Técnico (ET)">1</td>
</tr>
<tr>
<td data-label="ID">RF24</td>
<td data-label="Esforço de Implementação (EI)">2</td>
<td data-label="Complexidade Arquitetural (CA)">2</td>
<td data-label="Lacuna de Capacidade (LC)">2</td>
<td data-label="Esforço Técnico (ET)">2</td>
</tr>
<tr>
<td data-label="ID">RF25</td>
<td data-label="Esforço de Implementação (EI)">2</td>
<td data-label="Complexidade Arquitetural (CA)">3</td>
<td data-label="Lacuna de Capacidade (LC)">2</td>
<td data-label="Esforço Técnico (ET)">2</td>
</tr>
<tr>
<td data-label="ID">RF26</td>
<td data-label="Esforço de Implementação (EI)">2</td>
<td data-label="Complexidade Arquitetural (CA)">2</td>
<td data-label="Lacuna de Capacidade (LC)">2</td>
<td data-label="Esforço Técnico (ET)">2</td>
</tr>
<tr>
<td data-label="ID">RF27</td>
<td data-label="Esforço de Implementação (EI)">1</td>
<td data-label="Complexidade Arquitetural (CA)">1</td>
<td data-label="Lacuna de Capacidade (LC)">1</td>
<td data-label="Esforço Técnico (ET)">1</td>
</tr>
<tr>
<td data-label="ID">RF28</td>
<td data-label="Esforço de Implementação (EI)">1</td>
<td data-label="Complexidade Arquitetural (CA)">2</td>
<td data-label="Lacuna de Capacidade (LC)">1</td>
<td data-label="Esforço Técnico (ET)">1</td>
</tr>
<tr>
<td data-label="ID">RF29</td>
<td data-label="Esforço de Implementação (EI)">1</td>
<td data-label="Complexidade Arquitetural (CA)">1</td>
<td data-label="Lacuna de Capacidade (LC)">1</td>
<td data-label="Esforço Técnico (ET)">1</td>
</tr>
<tr>
<td data-label="ID">RF30</td>
<td data-label="Esforço de Implementação (EI)">1</td>
<td data-label="Complexidade Arquitetural (CA)">1</td>
<td data-label="Lacuna de Capacidade (LC)">1</td>
<td data-label="Esforço Técnico (ET)">1</td>
</tr>
<tr>
<td data-label="ID">RF31</td>
<td data-label="Esforço de Implementação (EI)">2</td>
<td data-label="Complexidade Arquitetural (CA)">2</td>
<td data-label="Lacuna de Capacidade (LC)">2</td>
<td data-label="Esforço Técnico (ET)">2</td>
</tr>
<tr>
<td data-label="ID">RF32</td>
<td data-label="Esforço de Implementação (EI)">1</td>
<td data-label="Complexidade Arquitetural (CA)">1</td>
<td data-label="Lacuna de Capacidade (LC)">1</td>
<td data-label="Esforço Técnico (ET)">1</td>
</tr>
<tr>
<td data-label="ID">RF33</td>
<td data-label="Esforço de Implementação (EI)">1</td>
<td data-label="Complexidade Arquitetural (CA)">1</td>
<td data-label="Lacuna de Capacidade (LC)">1</td>
<td data-label="Esforço Técnico (ET)">1</td>
</tr>
<tr>
<td data-label="ID">RF34</td>
<td data-label="Esforço de Implementação (EI)">2</td>
<td data-label="Complexidade Arquitetural (CA)">2</td>
<td data-label="Lacuna de Capacidade (LC)">1</td>
<td data-label="Esforço Técnico (ET)">2</td>
</tr>
<tr>
<td data-label="ID">RF35</td>
<td data-label="Esforço de Implementação (EI)">2</td>
<td data-label="Complexidade Arquitetural (CA)">1</td>
<td data-label="Lacuna de Capacidade (LC)">1</td>
<td data-label="Esforço Técnico (ET)">1</td>
</tr>
<tr>
<td data-label="ID">RF36</td>
<td data-label="Esforço de Implementação (EI)">2</td>
<td data-label="Complexidade Arquitetural (CA)">2</td>
<td data-label="Lacuna de Capacidade (LC)">2</td>
<td data-label="Esforço Técnico (ET)">2</td>
</tr>
<tr>
<td data-label="ID">RF37</td>
<td data-label="Esforço de Implementação (EI)">2</td>
<td data-label="Complexidade Arquitetural (CA)">2</td>
<td data-label="Lacuna de Capacidade (LC)">1</td>
<td data-label="Esforço Técnico (ET)">2</td>
</tr>
<tr>
<td data-label="ID">RF38</td>
<td data-label="Esforço de Implementação (EI)">2</td>
<td data-label="Complexidade Arquitetural (CA)">2</td>
<td data-label="Lacuna de Capacidade (LC)">1</td>
<td data-label="Esforço Técnico (ET)">2</td>
</tr>
<tr>
<td data-label="ID">RF39</td>
<td data-label="Esforço de Implementação (EI)">2</td>
<td data-label="Complexidade Arquitetural (CA)">2</td>
<td data-label="Lacuna de Capacidade (LC)">1</td>
<td data-label="Esforço Técnico (ET)">2</td>
</tr>
<tr>
<td data-label="ID">RF40</td>
<td data-label="Esforço de Implementação (EI)">2</td>
<td data-label="Complexidade Arquitetural (CA)">2</td>
<td data-label="Lacuna de Capacidade (LC)">1</td>
<td data-label="Esforço Técnico (ET)">2</td>
</tr>
</tbody>
</table>

#### MoSCoW

MoSCoW classifica a importância de cada requisito para a versão do produto e atribui o peso utilizado no cálculo da prioridade.

<table class="backlog-table ">
<thead><tr>
<th scope="col">Categoria</th>
<th scope="col">Significado</th>
<th scope="col">Peso</th>
</tr></thead>
<tbody>
<tr>
<td data-label="Categoria">Must Have</td>
<td data-label="Significado">Indispensável à viabilidade do produto.</td>
<td data-label="Peso">3</td>
</tr>
<tr>
<td data-label="Categoria">Should Have</td>
<td data-label="Significado">Importante, com contorno temporário possível.</td>
<td data-label="Peso">2</td>
</tr>
<tr>
<td data-label="Categoria">Could Have</td>
<td data-label="Significado">Desejável, podendo ser adiado.</td>
<td data-label="Peso">1</td>
</tr>
<tr>
<td data-label="Categoria">Won’t Have</td>
<td data-label="Significado">Fora do escopo desta versão.</td>
<td data-label="Peso">0</td>
</tr>
</tbody>
</table>

#### Cálculo da prioridade final

A prioridade final (**Score**) combina o Valor de Negócio (VN), o peso MoSCoW e o Esforço Técnico (ET):

<div class="backlog-equation" role="math" aria-label="Score igual a VN mais peso MoSCoW menos ET">
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
<mrow><mtext>Score</mtext><mo>=</mo><mi>VN</mi><mo>+</mo><msub><mtext>Peso</mtext><mtext>MoSCoW</mtext></msub><mo>−</mo><mi>ET</mi></mrow>
</math>
</div>

- **Score ≥ 4:** selecionado para o MVP.
- **Score de 2 a 3:** condicionado à capacidade da equipe.
- **Score ≤ 1:** evolução futura.

A seleção final considera também dependências, viabilidade e validação com o cliente. Um Must Have não deve ser excluído apenas pelo esforço, e um Won’t Have permanece fora desta versão.

#### Classificação na Matriz de Esforço Técnico

Nos dois eixos, **0–2 pontos representam baixo** e **3–4 pontos representam alto**. A posição utiliza VN e ET.

<table class="backlog-table ">
<thead><tr>
<th scope="col">Quadrante</th>
<th scope="col">Característica</th>
</tr></thead>
<tbody>
<tr>
<td data-label="Quadrante">Q1</td>
<td data-label="Característica">Alto valor e menor esforço.</td>
</tr>
<tr>
<td data-label="Quadrante">Q2</td>
<td data-label="Característica">Alto valor e maior esforço.</td>
</tr>
<tr>
<td data-label="Quadrante">Q3</td>
<td data-label="Característica">Baixo valor e menor esforço.</td>
</tr>
<tr>
<td data-label="Quadrante">Q4</td>
<td data-label="Característica">Baixo valor e maior esforço.</td>
</tr>
</tbody>
</table>

#### Tabela de Priorização

Os RFs estão ordenados por Score decrescente. **Cond.** significa condicionado à capacidade. A seleção indica **13 RFs para o MVP**, **5 condicionados** e **22 para evolução futura**.

<table class="backlog-table backlog-table--priority">
<thead><tr>
<th scope="col">ID</th>
<th scope="col">Nome</th>
<th scope="col">VN</th>
<th scope="col">MoSCoW</th>
<th scope="col">ET</th>
<th scope="col">Score</th>
<th scope="col">Quadrante</th>
<th scope="col">MVP</th>
</tr></thead>
<tbody>
<tr>
<td data-label="ID">RF05</td>
<td data-label="Nome">Editar peça</td>
<td data-label="VN">4</td>
<td data-label="MoSCoW">Must Have</td>
<td data-label="ET">1</td>
<td data-label="Score">6</td>
<td data-label="Quadrante">Q1</td>
<td data-label="MVP">Sim</td>
</tr>
<tr>
<td data-label="ID">RF08</td>
<td data-label="Nome">Registar entrada de peças</td>
<td data-label="VN">4</td>
<td data-label="MoSCoW">Must Have</td>
<td data-label="ET">1</td>
<td data-label="Score">6</td>
<td data-label="Quadrante">Q1</td>
<td data-label="MVP">Sim</td>
</tr>
<tr>
<td data-label="ID">RF01</td>
<td data-label="Nome">Cadastrar peça</td>
<td data-label="VN">4</td>
<td data-label="MoSCoW">Must Have</td>
<td data-label="ET">2</td>
<td data-label="Score">5</td>
<td data-label="Quadrante">Q1</td>
<td data-label="MVP">Sim</td>
</tr>
<tr>
<td data-label="ID">RF02</td>
<td data-label="Nome">Importar peças via planilha</td>
<td data-label="VN">4</td>
<td data-label="MoSCoW">Must Have</td>
<td data-label="ET">2</td>
<td data-label="Score">5</td>
<td data-label="Quadrante">Q1</td>
<td data-label="MVP">Sim</td>
</tr>
<tr>
<td data-label="ID">RF03</td>
<td data-label="Nome">Associar veículo à peça</td>
<td data-label="VN">4</td>
<td data-label="MoSCoW">Must Have</td>
<td data-label="ET">2</td>
<td data-label="Score">5</td>
<td data-label="Quadrante">Q1</td>
<td data-label="MVP">Sim</td>
</tr>
<tr>
<td data-label="ID">RF04</td>
<td data-label="Nome">Buscar peça</td>
<td data-label="VN">4</td>
<td data-label="MoSCoW">Must Have</td>
<td data-label="ET">2</td>
<td data-label="Score">5</td>
<td data-label="Quadrante">Q1</td>
<td data-label="MVP">Sim</td>
</tr>
<tr>
<td data-label="ID">RF06</td>
<td data-label="Nome">Alterar status da peça</td>
<td data-label="VN">4</td>
<td data-label="MoSCoW">Must Have</td>
<td data-label="ET">2</td>
<td data-label="Score">5</td>
<td data-label="Quadrante">Q1</td>
<td data-label="MVP">Sim</td>
</tr>
<tr>
<td data-label="ID">RF09</td>
<td data-label="Nome">Registar saída manual</td>
<td data-label="VN">4</td>
<td data-label="MoSCoW">Must Have</td>
<td data-label="ET">2</td>
<td data-label="Score">5</td>
<td data-label="Quadrante">Q1</td>
<td data-label="MVP">Sim</td>
</tr>
<tr>
<td data-label="ID">RF10</td>
<td data-label="Nome">Registar ajuste de inventário</td>
<td data-label="VN">4</td>
<td data-label="MoSCoW">Must Have</td>
<td data-label="ET">2</td>
<td data-label="Score">5</td>
<td data-label="Quadrante">Q1</td>
<td data-label="MVP">Sim</td>
</tr>
<tr>
<td data-label="ID">RF12</td>
<td data-label="Nome">Consultar saldo de peça</td>
<td data-label="VN">3</td>
<td data-label="MoSCoW">Must Have</td>
<td data-label="ET">1</td>
<td data-label="Score">5</td>
<td data-label="Quadrante">Q1</td>
<td data-label="MVP">Sim</td>
</tr>
<tr>
<td data-label="ID">RF15</td>
<td data-label="Nome">Registrar venda</td>
<td data-label="VN">4</td>
<td data-label="MoSCoW">Must Have</td>
<td data-label="ET">2</td>
<td data-label="Score">5</td>
<td data-label="Quadrante">Q1</td>
<td data-label="MVP">Sim</td>
</tr>
<tr>
<td data-label="ID">RF14</td>
<td data-label="Nome">Filtrar histórico por período</td>
<td data-label="VN">3</td>
<td data-label="MoSCoW">Should Have</td>
<td data-label="ET">1</td>
<td data-label="Score">4</td>
<td data-label="Quadrante">Q1</td>
<td data-label="MVP">Sim</td>
</tr>
<tr>
<td data-label="ID">RF16</td>
<td data-label="Nome">Cancelar venda</td>
<td data-label="VN">4</td>
<td data-label="MoSCoW">Should Have</td>
<td data-label="ET">2</td>
<td data-label="Score">4</td>
<td data-label="Quadrante">Q1</td>
<td data-label="MVP">Sim</td>
</tr>
<tr>
<td data-label="ID">RF11</td>
<td data-label="Nome">Registar devolução de peça</td>
<td data-label="VN">3</td>
<td data-label="MoSCoW">Should Have</td>
<td data-label="ET">2</td>
<td data-label="Score">3</td>
<td data-label="Quadrante">Q1</td>
<td data-label="MVP">Cond.</td>
</tr>
<tr>
<td data-label="ID">RF21</td>
<td data-label="Nome">Definir estoque mínimo por peça</td>
<td data-label="VN">2</td>
<td data-label="MoSCoW">Should Have</td>
<td data-label="ET">1</td>
<td data-label="Score">3</td>
<td data-label="Quadrante">Q3</td>
<td data-label="MVP">Cond.</td>
</tr>
<tr>
<td data-label="ID">RF25</td>
<td data-label="Nome">Listar itens mais vendidos</td>
<td data-label="VN">3</td>
<td data-label="MoSCoW">Should Have</td>
<td data-label="ET">2</td>
<td data-label="Score">3</td>
<td data-label="Quadrante">Q1</td>
<td data-label="MVP">Cond.</td>
</tr>
<tr>
<td data-label="ID">RF13</td>
<td data-label="Nome">Consultar histórico de movimentações</td>
<td data-label="VN">3</td>
<td data-label="MoSCoW">Could Have</td>
<td data-label="ET">2</td>
<td data-label="Score">2</td>
<td data-label="Quadrante">Q1</td>
<td data-label="MVP">Cond.</td>
</tr>
<tr>
<td data-label="ID">RF22</td>
<td data-label="Nome">Consultar painel de estoque crítico</td>
<td data-label="VN">2</td>
<td data-label="MoSCoW">Should Have</td>
<td data-label="ET">2</td>
<td data-label="Score">2</td>
<td data-label="Quadrante">Q3</td>
<td data-label="MVP">Cond.</td>
</tr>
<tr>
<td data-label="ID">RF23</td>
<td data-label="Nome">Criar lista de compras</td>
<td data-label="VN">1</td>
<td data-label="MoSCoW">Could Have</td>
<td data-label="ET">1</td>
<td data-label="Score">1</td>
<td data-label="Quadrante">Q3</td>
<td data-label="MVP">Não</td>
</tr>
<tr>
<td data-label="ID">RF31</td>
<td data-label="Nome">Consultar demonstrativo financeiro</td>
<td data-label="VN">2</td>
<td data-label="MoSCoW">Could Have</td>
<td data-label="ET">2</td>
<td data-label="Score">1</td>
<td data-label="Quadrante">Q3</td>
<td data-label="MVP">Não</td>
</tr>
<tr>
<td data-label="ID">RF19</td>
<td data-label="Nome">Exibir total consolidado</td>
<td data-label="VN">0</td>
<td data-label="MoSCoW">Could Have</td>
<td data-label="ET">1</td>
<td data-label="Score">0</td>
<td data-label="Quadrante">Q3</td>
<td data-label="MVP">Não</td>
</tr>
<tr>
<td data-label="ID">RF20</td>
<td data-label="Nome">Filtrar página de recebíveis</td>
<td data-label="VN">0</td>
<td data-label="MoSCoW">Could Have</td>
<td data-label="ET">1</td>
<td data-label="Score">0</td>
<td data-label="Quadrante">Q3</td>
<td data-label="MVP">Não</td>
</tr>
<tr>
<td data-label="ID">RF28</td>
<td data-label="Nome">Registrar despesa operacional</td>
<td data-label="VN">1</td>
<td data-label="MoSCoW">Won&#x27;t Have</td>
<td data-label="ET">1</td>
<td data-label="Score">0</td>
<td data-label="Quadrante">Q3</td>
<td data-label="MVP">Não</td>
</tr>
<tr>
<td data-label="ID">RF29</td>
<td data-label="Nome">Editar despesa operacional</td>
<td data-label="VN">1</td>
<td data-label="MoSCoW">Won&#x27;t Have</td>
<td data-label="ET">1</td>
<td data-label="Score">0</td>
<td data-label="Quadrante">Q3</td>
<td data-label="MVP">Não</td>
</tr>
<tr>
<td data-label="ID">RF30</td>
<td data-label="Nome">Excluir despesa operacional</td>
<td data-label="VN">1</td>
<td data-label="MoSCoW">Won&#x27;t Have</td>
<td data-label="ET">1</td>
<td data-label="Score">0</td>
<td data-label="Quadrante">Q3</td>
<td data-label="MVP">Não</td>
</tr>
<tr>
<td data-label="ID">RF07</td>
<td data-label="Nome">Cadastrar fornecedor</td>
<td data-label="VN">0</td>
<td data-label="MoSCoW">Won&#x27;t Have</td>
<td data-label="ET">1</td>
<td data-label="Score">-1</td>
<td data-label="Quadrante">Q3</td>
<td data-label="MVP">Não</td>
</tr>
<tr>
<td data-label="ID">RF27</td>
<td data-label="Nome">Exportar relatórios</td>
<td data-label="VN">0</td>
<td data-label="MoSCoW">Won&#x27;t Have</td>
<td data-label="ET">1</td>
<td data-label="Score">-1</td>
<td data-label="Quadrante">Q3</td>
<td data-label="MVP">Não</td>
</tr>
<tr>
<td data-label="ID">RF32</td>
<td data-label="Nome">Registrar dados fiscais da peça</td>
<td data-label="VN">0</td>
<td data-label="MoSCoW">Won&#x27;t Have</td>
<td data-label="ET">1</td>
<td data-label="Score">-1</td>
<td data-label="Quadrante">Q3</td>
<td data-label="MVP">Não</td>
</tr>
<tr>
<td data-label="ID">RF33</td>
<td data-label="Nome">Editar dados fiscais da peça</td>
<td data-label="VN">0</td>
<td data-label="MoSCoW">Won&#x27;t Have</td>
<td data-label="ET">1</td>
<td data-label="Score">-1</td>
<td data-label="Quadrante">Q3</td>
<td data-label="MVP">Não</td>
</tr>
<tr>
<td data-label="ID">RF35</td>
<td data-label="Nome">Registrar envio de peças</td>
<td data-label="VN">0</td>
<td data-label="MoSCoW">Won&#x27;t Have</td>
<td data-label="ET">1</td>
<td data-label="Score">-1</td>
<td data-label="Quadrante">Q3</td>
<td data-label="MVP">Não</td>
</tr>
<tr>
<td data-label="ID">RF17</td>
<td data-label="Nome">Registrar encargos da venda</td>
<td data-label="VN">0</td>
<td data-label="MoSCoW">Won&#x27;t Have</td>
<td data-label="ET">2</td>
<td data-label="Score">-2</td>
<td data-label="Quadrante">Q3</td>
<td data-label="MVP">Não</td>
</tr>
<tr>
<td data-label="ID">RF18</td>
<td data-label="Nome">Gerenciar status de recebimento</td>
<td data-label="VN">0</td>
<td data-label="MoSCoW">Won&#x27;t Have</td>
<td data-label="ET">2</td>
<td data-label="Score">-2</td>
<td data-label="Quadrante">Q3</td>
<td data-label="MVP">Não</td>
</tr>
<tr>
<td data-label="ID">RF24</td>
<td data-label="Nome">Confirmar recebimento de remessa</td>
<td data-label="VN">0</td>
<td data-label="MoSCoW">Won&#x27;t Have</td>
<td data-label="ET">2</td>
<td data-label="Score">-2</td>
<td data-label="Quadrante">Q3</td>
<td data-label="MVP">Não</td>
</tr>
<tr>
<td data-label="ID">RF26</td>
<td data-label="Nome">Analisar desempenho por canal</td>
<td data-label="VN">0</td>
<td data-label="MoSCoW">Won&#x27;t Have</td>
<td data-label="ET">2</td>
<td data-label="Score">-2</td>
<td data-label="Quadrante">Q3</td>
<td data-label="MVP">Não</td>
</tr>
<tr>
<td data-label="ID">RF34</td>
<td data-label="Nome">Vincular documento fiscal à venda</td>
<td data-label="VN">0</td>
<td data-label="MoSCoW">Won&#x27;t Have</td>
<td data-label="ET">2</td>
<td data-label="Score">-2</td>
<td data-label="Quadrante">Q3</td>
<td data-label="MVP">Não</td>
</tr>
<tr>
<td data-label="ID">RF36</td>
<td data-label="Nome">Consultar expedições do período</td>
<td data-label="VN">0</td>
<td data-label="MoSCoW">Won&#x27;t Have</td>
<td data-label="ET">2</td>
<td data-label="Score">-2</td>
<td data-label="Quadrante">Q3</td>
<td data-label="MVP">Não</td>
</tr>
<tr>
<td data-label="ID">RF37</td>
<td data-label="Nome">Autenticar usuário</td>
<td data-label="VN">0</td>
<td data-label="MoSCoW">Won&#x27;t Have</td>
<td data-label="ET">2</td>
<td data-label="Score">-2</td>
<td data-label="Quadrante">Q3</td>
<td data-label="MVP">Não</td>
</tr>
<tr>
<td data-label="ID">RF38</td>
<td data-label="Nome">Cadastrar usuário</td>
<td data-label="VN">0</td>
<td data-label="MoSCoW">Won&#x27;t Have</td>
<td data-label="ET">2</td>
<td data-label="Score">-2</td>
<td data-label="Quadrante">Q3</td>
<td data-label="MVP">Não</td>
</tr>
<tr>
<td data-label="ID">RF39</td>
<td data-label="Nome">Editar usuário</td>
<td data-label="VN">0</td>
<td data-label="MoSCoW">Won&#x27;t Have</td>
<td data-label="ET">2</td>
<td data-label="Score">-2</td>
<td data-label="Quadrante">Q3</td>
<td data-label="MVP">Não</td>
</tr>
<tr>
<td data-label="ID">RF40</td>
<td data-label="Nome">Desativar usuário</td>
<td data-label="VN">0</td>
<td data-label="MoSCoW">Won&#x27;t Have</td>
<td data-label="ET">2</td>
<td data-label="Score">-2</td>
<td data-label="Quadrante">Q3</td>
<td data-label="MVP">Não</td>
</tr>
</tbody>
</table>

#### Matriz de Valor de negócio × Esforço técnico

<iframe width="100%" height="900" src="https://miro.com/app/live-embed/uXjVEfU_HbE=/?embedMode=view_only_without_ui&moveToViewport=5543,1432,3508,3730&embedId=91070939469" frameborder="0" scrolling="no" allow="fullscreen; clipboard-read; clipboard-write" allowfullscreen></iframe>

### 10.3 Épicos

Os épicos agrupam as histórias de usuário do MVP por uma necessidade ampla do produto, mantendo o vínculo com a característica de produto (CP) de origem.

<table class="backlog-table backlog-table--epics">
<thead><tr>
<th scope="col">Épico</th>
<th scope="col">CP de origem</th>
<th scope="col">US vinculadas</th>
</tr></thead>
<tbody>
<tr>
<td data-label="Épico"><strong id="ep01">EP01</strong><br>Gestão do catálogo de peças</td>
<td data-label="CP de origem"><a href="../requisitos-de-software/#cp1-gestao-do-catalogo-de-pecas">CP1</a><br>Gestão do catálogo de peças</td>
<td data-label="US vinculadas"><a href="#us01">US01</a>, <a href="#us02">US02</a>, <a href="#us03">US03</a>, <a href="#us04">US04</a>, <a href="#us05">US05</a>, <a href="#us06">US06</a></td>
</tr>
<tr>
<td data-label="Épico"><strong id="ep02">EP02</strong><br>Controle de movimentações e saldo</td>
<td data-label="CP de origem"><a href="../requisitos-de-software/#cp2-controle-de-movimentacoes-e-saldo-do-estoque">CP2</a><br>Controle de movimentações e saldo do estoque</td>
<td data-label="US vinculadas"><a href="#us08">US08</a>, <a href="#us09">US09</a>, <a href="#us10">US10</a>, <a href="#us12">US12</a>, <a href="#us14">US14</a></td>
</tr>
<tr>
<td data-label="Épico"><strong id="ep03">EP03</strong><br>Registro e cancelamento de vendas</td>
<td data-label="CP de origem"><a href="../requisitos-de-software/#cp3-registro-de-vendas-e-recebimentos">CP3</a><br>Registro de vendas e recebimentos</td>
<td data-label="US vinculadas"><a href="#us15">US15</a>, <a href="#us16">US16</a></td>
</tr>
</tbody>
</table>

### 10.4 Histórias de usuário

As 13 histórias de usuário (US) detalham os requisitos funcionais selecionados para o MVP. A tabela apresenta sua origem, os requisitos não funcionais aplicáveis e as dependências.

<table class="backlog-table backlog-table--stories">
<thead><tr>
<th scope="col">US</th>
<th scope="col">RF de origem</th>
<th scope="col">RNFs vinculados</th>
<th scope="col">Dependências</th>
<th scope="col">CP de origem</th>
</tr></thead>
<tbody>
<tr>
<td data-label="US"><strong id="us01" title="Cadastrar peça">US01</strong></td>
<td data-label="RF de origem"><a href="../requisitos-de-software/#cp1-gestao-do-catalogo-de-pecas">RF01</a></td>
<td data-label="RNFs vinculados"><a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></td>
<td data-label="Dependências">acesso autenticado com um dos perfis previstos no RF.</td>
<td data-label="CP de origem"><a href="../requisitos-de-software/#cp1-gestao-do-catalogo-de-pecas">CP1</a></td>
</tr>
<tr>
<td data-label="US"><strong id="us02" title="Importar peças via planilha">US02</strong></td>
<td data-label="RF de origem"><a href="../requisitos-de-software/#cp1-gestao-do-catalogo-de-pecas">RF02</a></td>
<td data-label="RNFs vinculados"><a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></td>
<td data-label="Dependências">dados do cadastro de peças definidos em <a href="../requisitos-de-software/#cp1-gestao-do-catalogo-de-pecas">RF01</a>; sua entrada manual não precisa ser executada para cada peça importada.</td>
<td data-label="CP de origem"><a href="../requisitos-de-software/#cp1-gestao-do-catalogo-de-pecas">CP1</a></td>
</tr>
<tr>
<td data-label="US"><strong id="us03" title="Associar veículo à peça">US03</strong></td>
<td data-label="RF de origem"><a href="../requisitos-de-software/#cp1-gestao-do-catalogo-de-pecas">RF03</a></td>
<td data-label="RNFs vinculados"><a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></td>
<td data-label="Dependências">uma peça cadastrada por <a href="#us01">US01</a> ou <a href="#us02">US02</a>.</td>
<td data-label="CP de origem"><a href="../requisitos-de-software/#cp1-gestao-do-catalogo-de-pecas">CP1</a></td>
</tr>
<tr>
<td data-label="US"><strong id="us04" title="Buscar peça">US04</strong></td>
<td data-label="RF de origem"><a href="../requisitos-de-software/#cp1-gestao-do-catalogo-de-pecas">RF04</a></td>
<td data-label="RNFs vinculados"><a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf04-desempenho-de-resposta">RNF04</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></td>
<td data-label="Dependências">catálogo com peças de <a href="#us01">US01</a> ou <a href="#us02">US02</a>; associações de <a href="#us03">US03</a> para a pesquisa por aplicação.</td>
<td data-label="CP de origem"><a href="../requisitos-de-software/#cp1-gestao-do-catalogo-de-pecas">CP1</a></td>
</tr>
<tr>
<td data-label="US"><strong id="us05" title="Editar peça">US05</strong></td>
<td data-label="RF de origem"><a href="../requisitos-de-software/#cp1-gestao-do-catalogo-de-pecas">RF05</a></td>
<td data-label="RNFs vinculados"><a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></td>
<td data-label="Dependências">uma peça cadastrada por <a href="#us01">US01</a> ou <a href="#us02">US02</a>.</td>
<td data-label="CP de origem"><a href="../requisitos-de-software/#cp1-gestao-do-catalogo-de-pecas">CP1</a></td>
</tr>
<tr>
<td data-label="US"><strong id="us06" title="Alterar status da peça">US06</strong></td>
<td data-label="RF de origem"><a href="../requisitos-de-software/#cp1-gestao-do-catalogo-de-pecas">RF06</a></td>
<td data-label="RNFs vinculados"><a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></td>
<td data-label="Dependências">uma peça cadastrada por <a href="#us01">US01</a> ou <a href="#us02">US02</a>.</td>
<td data-label="CP de origem"><a href="../requisitos-de-software/#cp1-gestao-do-catalogo-de-pecas">CP1</a></td>
</tr>
<tr>
<td data-label="US"><strong id="us08" title="Registrar entrada de peças">US08</strong></td>
<td data-label="RF de origem"><a href="../requisitos-de-software/#cp2-controle-de-movimentacoes-e-saldo-do-estoque">RF08</a></td>
<td data-label="RNFs vinculados"><a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></td>
<td data-label="Dependências">peça cadastrada em <a href="#us01">US01</a> ou <a href="#us02">US02</a>. A identificação do fornecedor é informada na própria entrada.</td>
<td data-label="CP de origem"><a href="../requisitos-de-software/#cp2-controle-de-movimentacoes-e-saldo-do-estoque">CP2</a></td>
</tr>
<tr>
<td data-label="US"><strong id="us09" title="Registrar saída manual">US09</strong></td>
<td data-label="RF de origem"><a href="../requisitos-de-software/#cp2-controle-de-movimentacoes-e-saldo-do-estoque">RF09</a></td>
<td data-label="RNFs vinculados"><a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></td>
<td data-label="Dependências">uma peça cadastrada e um saldo conhecido.</td>
<td data-label="CP de origem"><a href="../requisitos-de-software/#cp2-controle-de-movimentacoes-e-saldo-do-estoque">CP2</a></td>
</tr>
<tr>
<td data-label="US"><strong id="us10" title="Registrar ajuste de inventário">US10</strong></td>
<td data-label="RF de origem"><a href="../requisitos-de-software/#cp2-controle-de-movimentacoes-e-saldo-do-estoque">RF10</a></td>
<td data-label="RNFs vinculados"><a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></td>
<td data-label="Dependências">uma peça cadastrada e seu saldo anterior conhecido.</td>
<td data-label="CP de origem"><a href="../requisitos-de-software/#cp2-controle-de-movimentacoes-e-saldo-do-estoque">CP2</a></td>
</tr>
<tr>
<td data-label="US"><strong id="us12" title="Consultar saldo de peça">US12</strong></td>
<td data-label="RF de origem"><a href="../requisitos-de-software/#cp2-controle-de-movimentacoes-e-saldo-do-estoque">RF12</a></td>
<td data-label="RNFs vinculados"><a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf04-desempenho-de-resposta">RNF04</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></td>
<td data-label="Dependências">uma peça cadastrada e seu saldo conhecido; movimentações concluídas fornecem os dados usados na consulta.</td>
<td data-label="CP de origem"><a href="../requisitos-de-software/#cp2-controle-de-movimentacoes-e-saldo-do-estoque">CP2</a></td>
</tr>
<tr>
<td data-label="US"><strong id="us14" title="Filtrar histórico por período">US14</strong></td>
<td data-label="RF de origem"><a href="../requisitos-de-software/#cp2-controle-de-movimentacoes-e-saldo-do-estoque">RF14</a></td>
<td data-label="RNFs vinculados"><a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></td>
<td data-label="Dependências">peça cadastrada em <a href="#us01">US01</a> ou <a href="#us02">US02</a> e acesso aos registros das movimentações disponíveis no MVP (<a href="#us08">US08</a>, <a href="#us09">US09</a>, <a href="#us10">US10</a>, <a href="#us15">US15</a> e <a href="#us16">US16</a>), conforme forem entregues. A listagem filtrada integra esta história.</td>
<td data-label="CP de origem"><a href="../requisitos-de-software/#cp2-controle-de-movimentacoes-e-saldo-do-estoque">CP2</a></td>
</tr>
<tr>
<td data-label="US"><strong id="us15" title="Registrar venda">US15</strong></td>
<td data-label="RF de origem"><a href="../requisitos-de-software/#cp3-registro-de-vendas-e-recebimentos">RF15</a></td>
<td data-label="RNFs vinculados"><a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></td>
<td data-label="Dependências">peças cadastradas e seus saldos conhecidos.</td>
<td data-label="CP de origem"><a href="../requisitos-de-software/#cp3-registro-de-vendas-e-recebimentos">CP3</a></td>
</tr>
<tr>
<td data-label="US"><strong id="us16" title="Cancelar venda">US16</strong></td>
<td data-label="RF de origem"><a href="../requisitos-de-software/#cp3-registro-de-vendas-e-recebimentos">RF16</a></td>
<td data-label="RNFs vinculados"><a href="../requisitos-de-software/#rnf01-responsividade-da-interface-em-dispositivos-moveis">RNF01</a>, <a href="../requisitos-de-software/#rnf02-tolerancia-a-falhas-de-conexao">RNF02</a>, <a href="../requisitos-de-software/#rnf03-compatibilidade-com-navegadores-web">RNF03</a>, <a href="../requisitos-de-software/#rnf05-seguranca-de-dados">RNF05</a></td>
<td data-label="Dependências">uma venda registrada por <a href="#us15">US15</a>, com as peças e quantidades que deram origem à baixa de estoque.</td>
<td data-label="CP de origem"><a href="../requisitos-de-software/#cp3-registro-de-vendas-e-recebimentos">CP3</a></td>
</tr>
</tbody>
</table>

### 10.5 Árvore de histórias de usuário

Rastreabilidade entre objetivos específicos (OE), características de produto (CP), requisitos funcionais (RF) e histórias de usuário (US).

<iframe width="768" height="432" title="Árvore de histórias de usuário: OE, CP, RF e US" src="https://miro.com/app/live-embed/uXjVEbdGrpI=/?embedMode=view_only_without_ui&moveToViewport=-803,-1669,5237,2757&embedId=541076974290" frameborder="0" scrolling="no" allow="fullscreen; clipboard-read; clipboard-write" allowfullscreen></iframe>

### 10.6 Quadro MVP

<table class="backlog-table backlog-table--mvp">
<thead><tr>
<th scope="col">ID</th>
<th scope="col">Nome</th>
<th scope="col">Status</th>
<th scope="col">PR</th>
<th scope="col">Commit</th>
</tr></thead>
<tbody>
<tr>
<td data-label="ID"><a href="#us01">US01</a></td>
<td data-label="Nome">Cadastrar peça</td>
<td data-label="Status">Não iniciado</td>
<td data-label="PR"></td>
<td data-label="Commit"></td>
</tr>
<tr>
<td data-label="ID"><a href="#us02">US02</a></td>
<td data-label="Nome">Importar peças via planilha</td>
<td data-label="Status">Não iniciado</td>
<td data-label="PR"></td>
<td data-label="Commit"></td>
</tr>
<tr>
<td data-label="ID"><a href="#us03">US03</a></td>
<td data-label="Nome">Associar veículo à peça</td>
<td data-label="Status">Não iniciado</td>
<td data-label="PR"></td>
<td data-label="Commit"></td>
</tr>
<tr>
<td data-label="ID"><a href="#us04">US04</a></td>
<td data-label="Nome">Buscar peça</td>
<td data-label="Status">Não iniciado</td>
<td data-label="PR"></td>
<td data-label="Commit"></td>
</tr>
<tr>
<td data-label="ID"><a href="#us05">US05</a></td>
<td data-label="Nome">Editar peça</td>
<td data-label="Status">Não iniciado</td>
<td data-label="PR"></td>
<td data-label="Commit"></td>
</tr>
<tr>
<td data-label="ID"><a href="#us06">US06</a></td>
<td data-label="Nome">Alterar status da peça</td>
<td data-label="Status">Não iniciado</td>
<td data-label="PR"></td>
<td data-label="Commit"></td>
</tr>
<tr>
<td data-label="ID"><a href="#us08">US08</a></td>
<td data-label="Nome">Registrar entrada de peças</td>
<td data-label="Status">Não iniciado</td>
<td data-label="PR"></td>
<td data-label="Commit"></td>
</tr>
<tr>
<td data-label="ID"><a href="#us09">US09</a></td>
<td data-label="Nome">Registrar saída manual</td>
<td data-label="Status">Não iniciado</td>
<td data-label="PR"></td>
<td data-label="Commit"></td>
</tr>
<tr>
<td data-label="ID"><a href="#us10">US10</a></td>
<td data-label="Nome">Registrar ajuste de inventário</td>
<td data-label="Status">Não iniciado</td>
<td data-label="PR"></td>
<td data-label="Commit"></td>
</tr>
<tr>
<td data-label="ID"><a href="#us12">US12</a></td>
<td data-label="Nome">Consultar saldo de peça</td>
<td data-label="Status">Não iniciado</td>
<td data-label="PR"></td>
<td data-label="Commit"></td>
</tr>
<tr>
<td data-label="ID"><a href="#us14">US14</a></td>
<td data-label="Nome">Filtrar histórico por período</td>
<td data-label="Status">Não iniciado</td>
<td data-label="PR"></td>
<td data-label="Commit"></td>
</tr>
<tr>
<td data-label="ID"><a href="#us15">US15</a></td>
<td data-label="Nome">Registrar venda</td>
<td data-label="Status">Não iniciado</td>
<td data-label="PR"></td>
<td data-label="Commit"></td>
</tr>
<tr>
<td data-label="ID"><a href="#us16">US16</a></td>
<td data-label="Nome">Cancelar venda</td>
<td data-label="Status">Não iniciado</td>
<td data-label="PR"></td>
<td data-label="Commit"></td>
</tr>
</tbody>
</table>

## Versionamento

<table class="backlog-table ">
<thead><tr>
<th scope="col">Versão</th>
<th scope="col">Data</th>
<th scope="col">Descrição</th>
<th scope="col">Autor(es/as)</th>
</tr></thead>
<tbody>
<tr>
<td data-label="Versão">1.0</td>
<td data-label="Data">04/09/2026</td>
<td data-label="Descrição">Iniciação do documento</td>
<td data-label="Autor(es/as)"><a href="https://github.com/thgomxs">Thiago Gomes</a></td>
</tr>
<tr>
<td data-label="Versão">1.1</td>
<td data-label="Data">05/10/2026</td>
<td data-label="Descrição">Backlog com RNFs vinculados, critérios de avaliação, priorização e matriz 2×2.</td>
<td data-label="Autor(es/as)"><a href="https://github.com/thgomxs">Thiago Gomes</a></td>
</tr>
<tr>
<td data-label="Versão">1.2</td>
<td data-label="Data">12/10/2026</td>
<td data-label="Descrição">Inclusão dos três épicos e da rastreabilidade das 13 histórias de usuário do MVP, com CPs, RFs, RNFs e dependências alinhadas ao escopo selecionado.</td>
<td data-label="Autor(es/as)"><a href="https://github.com/thgomxs">Thiago Gomes</a></td>
</tr>
<tr>
<td data-label="Versão">1.3</td>
<td data-label="Data">12/10/2026</td>
<td data-label="Descrição">Inclusão da árvore de histórias de usuário no Miro, relacionando OE, CP, RF e US.</td>
<td data-label="Autor(es/as)"><a href="https://github.com/thgomxs">Thiago Gomes</a></td>
</tr>
<tr>
<td data-label="Versão">1.4</td>
<td data-label="Data">12/10/2026</td>
<td data-label="Descrição">Inclusão do Quadro MVP com as 13 histórias de usuário, status inicial e espaço para PRs e commits de implementação.</td>
<td data-label="Autor(es/as)"><a href="https://github.com/thgomxs">Thiago Gomes</a></td>
</tr>
</tbody>
</table>

</div>
