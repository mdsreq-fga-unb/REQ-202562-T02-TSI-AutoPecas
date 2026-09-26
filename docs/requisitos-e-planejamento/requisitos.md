# Requisitos de software

## 8 Requisitos de software

Este documento apresenta os requisitos funcionais (RF) e não funcionais (RNF) do sistema TSI Peças, derivados das características de produto definidas na etapa de elicitação. Os requisitos estão organizados por característica de produto de origem e serão utilizados como base para o planejamento das sprints e para a validação com o cliente.

### 8.1 Lista de requisitos funcionais

#### CP1 — Gestão do catálogo de peças

<div class="requirements-table-wrap requirements-table--rf" markdown="1">

| Código | Nome | Descrição | Rastreabilidade |
| :---: | --- | --- | :---: |
| RF01 | Cadastrar peça | O sistema deve permitir o cadastro de uma peça, com preenchimento obrigatório do código do fabricante, do nome e da categoria; e preenchimento opcional da descrição técnica, da localização física (prateleira ou gaveta) e de uma foto. | CP1 |
| RF02 | Associar veículo à peça | O sistema deve permitir a associação de uma ou mais aplicações por veículo a uma peça cadastrada, com registro de marca, modelo e ano de compatibilidade. | CP1 |
| RF03 | Buscar peça | O sistema deve permitir a localização de peças no catálogo por ao menos um dos seguintes filtros: código do fabricante, nome, categoria ou aplicação por veículo (marca, modelo ou ano). | CP1 |
| RF04 | Editar peça | O sistema deve permitir a edição de qualquer campo do cadastro de uma peça já registrada, com exceção do código do fabricante, que é imutável após o cadastro inicial. | CP1 |
| RF05 | Inativar peça | O sistema deve permitir a inativação de uma peça cadastrada, tornando-a invisível nas consultas de estoque ativo sem removê-la do histórico de movimentações e vendas. | CP1 |

</div>

#### CP2 — Controle de movimentações e saldo do estoque

<div class="requirements-table-wrap requirements-table--rf" markdown="1">

| Código | Nome | Descrição | Rastreabilidade |
| :---: | --- | --- | :---: |
| RF06 | Registrar entrada de peças | O sistema deve permitir o registro da entrada de um lote de peças no estoque, com informação da peça, da quantidade, da data, do fornecedor e do preço de custo unitário. | CP2 |
| RF07 | Registrar saída manual | O sistema deve permitir o registro de uma saída manual de peças do estoque, com informação da peça, da quantidade, da data e do motivo (ex: descarte, uso interno, perda). | CP2 |
| RF08 | Registrar ajuste de inventário | O sistema deve permitir o registro de um ajuste de inventário, com informação da peça, da diferença de quantidade (positiva ou negativa) em relação ao saldo atual e da justificativa do ajuste. | CP2 |
| RF09 | Registrar devolução de peça | O sistema deve permitir o registro da devolução de uma peça ao estoque. Quando a venda de origem estiver registrada no sistema, a devolução deve ser vinculada a ela; quando não houver venda identificada, o saldo deve ser atualizado sem vinculação. Em ambos os casos, a quantidade devolvida é restabelecida ao saldo. | CP2 |
| RF10 | Consultar saldo de peça | O sistema deve exibir o saldo atual de qualquer peça cadastrada, atualizado após a última movimentação registrada. | CP2 |
| RF11 | Consultar histórico de movimentações | O sistema deve exibir o histórico completo de movimentações de uma peça, com data, tipo de movimentação, quantidade e motivo, filtrável por período. | CP2 |
| RF12 | Bloquear saída com saldo insuficiente | O sistema deve impedir o registro de saídas manuais, ajustes negativos ou vendas cujas quantidades excedam o saldo disponível da peça, exibindo uma mensagem de erro explicativa. | CP2 |

</div>

#### CP3 — Vinculação do estoque aos anúncios dos canais de venda

<div class="requirements-table-wrap requirements-table--rf" markdown="1">

| Código | Nome | Descrição | Rastreabilidade |
| :---: | --- | --- | :---: |
| RF13 | Associar anúncio a peça | O sistema deve permitir a associação de um ou mais anúncios do Mercado Livre a uma peça cadastrada, mediante informação do identificador do anúncio e confirmação da vinculação. | CP3 |
| RF14 | Realizar baixa automática por venda no ML | O sistema deve detectar, via integração com a API do Mercado Livre, as vendas concluídas nos anúncios associados e registrar automaticamente a saída da peça correspondente no estoque. | CP3 |
| RF15 | Consultar status da sincronização | O sistema deve exibir o status da integração com o Mercado Livre, incluindo data e hora da última sincronização bem-sucedida e registro dos erros ocorridos. | CP3 |
| RF16 | Sinalizar esgotamento de estoque nos anúncios | O sistema deve sinalizar automaticamente quando o saldo de uma peça vinculada a anúncios atingir zero, indicando que os anúncios associados precisam ser verificados ou pausados. | CP3 |

</div>

#### CP4 — Registro de vendas e recebimentos

<div class="requirements-table-wrap requirements-table--rf" markdown="1">

| Código | Nome | Descrição | Rastreabilidade |
| :---: | --- | --- | :---: |
| RF17 | Registrar venda | O sistema deve permitir o registro de uma venda com informação do canal de origem (balcão, Mercado Livre ou contato direto), das peças vendidas, das quantidades e do preço unitário de cada item. | CP4 |
| RF18 | Realizar baixa automática de estoque na venda | O sistema deve decrementar automaticamente o saldo de cada peça no estoque no momento em que uma venda for confirmada, com base nas quantidades registradas. | CP4 |
| RF19 | Registrar encargos da venda | O sistema deve permitir o registro dos valores de desconto concedido, frete cobrado e taxas aplicadas (ex: comissão do marketplace) para uma venda já criada. | CP4 |
| RF20 | Calcular valor líquido da venda | O sistema deve calcular e exibir automaticamente o valor líquido de cada venda, aplicando a fórmula: valor bruto − desconto + frete + taxas. | CP4 |
| RF21 | Controlar recebimento de venda | O sistema deve permitir o registro e a atualização do status de recebimento de cada venda, alternando entre "recebido" e "a receber". Ao marcar uma venda como "recebida", o registro da data de recebimento é obrigatório. | CP4 |
| RF22 | Consultar recebíveis pendentes | O sistema deve exibir o total consolidado de valores a receber, com listagem das vendas pendentes de recebimento, filtrável por período e canal. | CP4 |

</div>

#### CP5 — Planejamento de compras e reposição

<div class="requirements-table-wrap requirements-table--rf" markdown="1">

| Código | Nome | Descrição | Rastreabilidade |
| :---: | --- | --- | :---: |
| RF23 | Definir estoque mínimo por peça | O sistema deve permitir a configuração de uma quantidade mínima de estoque para cada peça, abaixo da qual o item é considerado em estado crítico. | CP5 |
| RF24 | Emitir alerta de estoque crítico | O sistema deve emitir um alerta quando o saldo de uma peça atingir ou ficar abaixo da quantidade mínima configurada, identificando a peça e o saldo atual. | CP5 |
| RF25 | Consultar painel de estoque crítico | O sistema deve exibir um painel consolidado com todas as peças em estado crítico (saldo abaixo do mínimo ou zerado), com indicação do saldo atual e do mínimo configurado. | CP5 |
| RF26 | Criar lista de compras | O sistema deve permitir a criação de uma lista de compras para a próxima remessa, com adição manual das peças desejadas e das quantidades a pedir. | CP5 |
| RF27 | Sugerir peças para reposição | O sistema deve sugerir automaticamente, na criação de uma lista de compras, as peças com alertas de estoque crítico ativos, com quantidade sugerida baseada no estoque mínimo e no giro calculado. | CP5 |
| RF28 | Calcular giro de peças | O sistema deve calcular o giro de cada peça em um período configurável, expresso como a quantidade total vendida no período. | CP5 |
| RF29 | Confirmar recebimento de remessa | O sistema deve permitir a confirmação do recebimento de uma remessa a partir de uma lista de compras existente, com registro das quantidades efetivamente recebidas e atualização automática do saldo do estoque. | CP5 |

</div>

#### CP6 — Análise de desempenho do estoque e das vendas

<div class="requirements-table-wrap requirements-table--rf" markdown="1">

| Código | Nome | Descrição | Rastreabilidade |
| :---: | --- | --- | :---: |
| RF30 | Gerar relatório de movimentações | O sistema deve gerar um relatório das movimentações do estoque em um período configurável, exibindo data, tipo, peça, quantidade e motivo de cada movimentação, com filtro por tipo. | CP6 |
| RF31 | Gerar relatório de vendas | O sistema deve gerar um relatório de vendas em um período configurável, exibindo data, canal, peças vendidas, quantidades, valor bruto e valor líquido de cada venda. | CP6 |
| RF32 | Listar itens mais vendidos | O sistema deve identificar e listar as peças com maior volume de vendas em um período configurável, ordenadas da mais vendida para a menos vendida, com exibição da quantidade total vendida. | CP6 |
| RF33 | Listar itens sem movimentação | O sistema deve identificar e listar as peças sem nenhuma movimentação de saída em um período configurável, indicando o saldo atual e a data da última movimentação registrada. | CP6 |
| RF34 | Analisar desempenho por canal | O sistema deve apresentar, em um período configurável, o volume de vendas e o valor total desagregado por canal de origem (balcão, Mercado Livre e contato direto). | CP6 |
| RF35 | Exportar relatório em PDF | O sistema deve permitir a exportação de qualquer relatório gerado em formato PDF, preservando os filtros e os dados exibidos na tela. | CP6 |

</div>

#### CP7 — Visão financeira e de capital de giro

<div class="requirements-table-wrap requirements-table--rf" markdown="1">

| Código | Nome | Descrição | Rastreabilidade |
| :---: | --- | --- | :---: |
| RF36 | Registrar despesa operacional | O sistema deve permitir o registro de despesas da operação (ex: aluguel, embalagens, frete de compra), com informação de data, categoria e valor. | CP7 |
| RF37 | Consolidar apuração financeira do período | O sistema deve consolidar, em um período configurável, o total de receitas de vendas, o total de despesas registradas e o resultado operacional (receita − despesa). | CP7 |
| RF38 | Calcular capital necessário para o giro | O sistema deve estimar o capital necessário para repor o estoque no próximo período, com base no custo médio das peças vendidas no período anterior e no prazo de reposição configurado. | CP7 |
| RF39 | Consultar demonstrativo financeiro | O sistema deve exibir um demonstrativo financeiro do período, com a composição das receitas por canal, das despesas por categoria e do resultado líquido. | CP7 |

</div>

#### CP8 — Apoio à emissão fiscal e à expedição

<div class="requirements-table-wrap requirements-table--rf" markdown="1">

| Código | Nome | Descrição | Rastreabilidade |
| :---: | --- | --- | :---: |
| RF40 | Manter dados fiscais da peça | O sistema deve permitir o registro e a edição, no cadastro de cada peça, dos dados exigidos para a emissão de nota fiscal: código NCM, CFOP, unidade tributável e alíquotas aplicáveis. | CP8 |
| RF41 | Registrar documento fiscal da venda | O sistema deve permitir o registro, para uma venda concluída, do número e da data do documento fiscal emitido (NF-e, NFC-e ou cupom fiscal). | CP8 |
| RF42 | Registrar envio de peças | O sistema deve permitir o registro, para uma venda com entrega, da modalidade de envio, do código de rastreio e da data de despacho. | CP8 |
| RF43 | Consultar expedições do período | O sistema deve exibir as vendas com entrega de um período, com o status de cada envio (a enviar / enviado / entregue) e os dados de rastreio registrados. | CP8 |

</div>

#### CP10 — Gestão de acesso e usuários

<div class="requirements-table-wrap requirements-table--rf" markdown="1">

| Código | Nome | Descrição | Rastreabilidade |
| :---: | --- | --- | :---: |
| RF44 | Autenticar usuário | O sistema deve exigir autenticação por credenciais (e-mail e senha) para acesso a qualquer funcionalidade, bloqueando o acesso após cinco tentativas consecutivas malsucedidas. | CP10 |
| RF45 | Gerenciar perfis de acesso | O sistema deve permitir a criação, edição e desativação de usuários, com atribuição de perfil de acesso que delimita as funcionalidades disponíveis (ex: administrador e operador). | CP10 |

</div>

### 8.2 Lista de requisitos não funcionais

<article class="requirement-card" markdown="1">

#### RNF01 — Resiliência da integração com o Mercado Livre

Em caso de indisponibilidade da API do Mercado Livre, o sistema deve registrar o erro, notificar o operador e retomar a sincronização automaticamente quando a API estiver disponível, sem perda de dados de venda.

**Classificação:** confiabilidade (URPS+) / produto — confiabilidade (Sommerville).

**Critério verificável:** após restauração da API, todas as vendas ocorridas durante a indisponibilidade devem ser sincronizadas e baixadas do estoque sem intervenção manual.

*Rastreabilidade: CP3*

</article>

<article class="requirement-card" markdown="1">

#### RNF02 — Atomicidade de operações de estoque

Toda operação que altere o saldo do estoque (entrada, saída, ajuste, venda ou devolução) deve ser atômica: em caso de falha durante o processamento, nenhuma alteração parcial deve ser persistida no banco de dados.

**Classificação:** confiabilidade (URPS+) / produto — confiabilidade (Sommerville).

**Critério verificável:** simulada uma falha no meio de uma operação de saída, o saldo deve permanecer idêntico ao valor anterior à tentativa.

*Rastreabilidade: CP9*

</article>

<article class="requirement-card" markdown="1">

#### RNF03 — Controle de concorrência no estoque

O sistema deve garantir a consistência do saldo de estoque em operações concorrentes, impedindo que dois processos simultâneos (ex: venda no balcão e baixa automática do ML) resultem em saldo incorreto ou negativo.

**Classificação:** confiabilidade (URPS+) / produto — confiabilidade (Sommerville).

**Critério verificável:** executadas duas saídas simultâneas da mesma peça com saldo exato para apenas uma delas, apenas a primeira deve ser aceita e a segunda deve ser bloqueada.

*Rastreabilidade: CP9*

</article>

<article class="requirement-card" markdown="1">

#### RNF04 — Responsividade da interface em dispositivos móveis

A interface do sistema deve ser responsiva em smartphones com tela de ao menos 5 polegadas, garantindo que as telas de consulta de saldo, registro de movimentação e consulta de vendas sejam operáveis por toque, sem rolagem horizontal, sem elementos sobrepostos e com áreas de toque de ao menos 44 × 44 pixels.

**Classificação:** usabilidade (URPS+) / produto — usabilidade (Sommerville).

**Critério verificável:** nas três telas citadas, testadas em smartphone com tela de 5 polegadas em orientação retrato, nenhum elemento deve se sobrepor a outro, nenhuma rolagem horizontal deve ser necessária e todos os botões e campos devem ser acionáveis por toque sem zoom.

*Rastreabilidade: CP9*

</article>

<article class="requirement-card" markdown="1">

#### RNF05 — Consistência em caso de interrupção de conexão

Em caso de perda de conexão durante o processamento de uma operação, o sistema deve garantir que o estado do estoque permaneça consistente, sem registrar movimentações parciais.

**Classificação:** confiabilidade (URPS+) / produto — confiabilidade (Sommerville).

**Critério verificável:** interrompida a conexão no meio de uma operação de registro, o saldo deve ser idêntico ao estado anterior à tentativa após a reconexão.

*Rastreabilidade: CP9*

</article>

<article class="requirement-card" markdown="1">

#### RNF06 — Compatibilidade com navegadores web

O sistema deve operar corretamente nos navegadores web modernos Chrome, Firefox, Edge e Safari, nas duas versões mais recentes de cada um, sem exigir instalação de software adicional ou extensões no dispositivo do usuário.

**Classificação:** suportabilidade/compatibilidade (URPS+) / produto — portabilidade (Sommerville).

**Critério verificável:** todas as funcionalidades do sistema devem operar corretamente nos quatro navegadores e versões listados, sem exigir extensões ou plugins.

*Rastreabilidade: CP9*

</article>

<article class="requirement-card" markdown="1">

#### RNF07 — Tempo de resposta das consultas

As consultas ao catálogo, ao saldo de estoque e aos relatórios devem apresentar os resultados em até três segundos para 95% das requisições, medidas com um catálogo de até 5.000 peças cadastradas e até dois usuários simultâneos, em ambiente de produção com conexão de ao menos 10 Mbps.

**Classificação:** desempenho (URPS+) / produto — desempenho (Sommerville).

**Critério verificável:** executadas 100 requisições consecutivas de consulta ao catálogo em ambiente de produção, com o banco contendo 5.000 peças e dois usuários ativos, ao menos 95 devem ser concluídas em até 3 segundos, medidas do envio da requisição até a exibição dos resultados na tela.

*Rastreabilidade: CP9*

</article>

<article class="requirement-card" markdown="1">

#### RNF08 — Segurança de autenticação

As senhas dos usuários devem ser armazenadas utilizando função de hash com salt (ex: bcrypt). O tráfego entre cliente e servidor deve ser protegido por HTTPS em todos os ambientes.

**Classificação:** segurança (URPS+) / produto — segurança da informação (Sommerville).

**Critério verificável:** nenhuma senha deve ser armazenada em texto simples no banco de dados; todas as comunicações devem ocorrer exclusivamente sobre HTTPS.

*Rastreabilidade: CP10*

</article>

<article class="requirement-card" markdown="1">

#### RNF09 — Rastreabilidade das operações

O sistema deve registrar automaticamente o identificador do usuário responsável, a data e a hora em toda movimentação de estoque, venda ou ajuste realizado.

**Classificação:** suportabilidade/auditabilidade (URPS+) / produto — segurança da informação (Sommerville).

**Critério verificável:** toda movimentação, venda ou ajuste registrado deve conter, de forma não editável, o identificador do usuário, a data e a hora da operação.

*Rastreabilidade: CP10*

</article>

## Versionamento

| Versão | Data | Descrição | Autor(es/as) |
| :----: | :--: | --- | --- |
| 1.0 | 21/09/2026 | Versão inicial do requisitos do projeto | [Bruno Ferreira](https://github.com/brunnf) |
| 1.1 | 24/09/2026 | Formatação dos requisitos funcionais em tabelas e dos não funcionais em cartões | [Thiago Gomes](https://github.com/thgomxs) |
