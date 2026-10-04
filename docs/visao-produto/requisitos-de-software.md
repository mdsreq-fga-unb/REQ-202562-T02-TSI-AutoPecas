# Requisitos de software

## 8 Requisitos de software

Este documento apresenta os requisitos funcionais (RF) e não funcionais (RNF) do sistema TSI Peças, derivados das características de produto definidas na etapa de elicitação. Os requisitos estão organizados por característica de produto de origem e serão utilizados como base para o planejamento das sprints e para a validação com o cliente.

### 8.1 Lista de requisitos funcionais

#### CP1 — Gestão do catálogo de peças

<div class="requirements-table-wrap requirements-table--rf" markdown="1">

| Código | Nome                        | Descrição                                                                                                                                                                                                                                                            | Rastreabilidade |
| :----: | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------: |
|  RF01  | Cadastrar peça              | O sistema deve permitir que utilizadores com perfil Administrador ou Operador cadastrem uma peça, com preenchimento obrigatório do código do fabricante, do nome e da categoria; e preenchimento opcional da descrição técnica, da localização física e de uma foto. |       CP1       |
|  RF02  | Importar peças via planilha | O sistema deve permitir ao perfil Administrador selecionar uma planilha .xlsx de peças, validar os registros e cadastrá-los em lote, sem sobrescrever peças já cadastradas com o mesmo código do fabricante.                                                         |       CP1       |
|  RF03  | Associar veículo à peça     | O sistema deve permitir a associação de uma ou mais aplicações por veículo a uma peça cadastrada, com registo de marca, modelo e ano de compatibilidade.                                                                                                             |       CP1       |
|  RF04  | Buscar peça                 | O sistema deve permitir a localização de peças no catálogo por ao menos um dos seguintes filtros: código do fabricante, nome, categoria ou aplicação por veículo (marca, modelo ou ano).                                                                             |       CP1       |
|  RF05  | Editar peça                 | O sistema deve permitir a edição de qualquer campo do cadastro de uma peça já registrada, com exceção do código do fabricante, que é imutável após o cadastro inicial.                                                                                               |       CP1       |
|  RF06  | Alterar status da peça      | O sistema deve permitir que o usuário altere o status de uma peça, alternando entre "ativo" e "inativo".                                                                                                                                                             |       CP1       |

</div>

#### CP2 — Controle de movimentações e saldo do estoque

<div class="requirements-table-wrap requirements-table--rf" markdown="1">

| Código | Nome                                 | Descrição                                                                                                                                                                                                       | Rastreabilidade |
| :----: | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------: |
|  RF07  | Cadastrar fornecedor                 | O sistema deve permitir o cadastro de fornecedores.                                                                                                                                                             |       CP2       |
|  RF08  | Registar entrada de peças            | O sistema deve permitir o registo da entrada de um lote de peças no stock, com informação da peça, da quantidade, da data, do fornecedor e do preço de custo unitário.                                          |       CP2       |
|  RF09  | Registar saída manual                | O sistema deve permitir que utilizadores com perfil Administrador ou Operador registrem uma saída manual de peças do stock, com informação da peça, da quantidade, da data e do motivo.                         |       CP2       |
|  RF10  | Registar ajuste de inventário        | O sistema deve permitir que apenas o perfil Administrador realize o registo de um ajuste de inventário, com informação da peça, da diferença de quantidade (positiva ou negativa) e da justificativa do ajuste. |       CP2       |
|  RF11  | Registar devolução de peça           | O sistema deve permitir que o usuário registre a devolução de uma peça, restabelecendo a quantidade ao saldo do estoque.                                                                                        |       CP2       |
|  RF12  | Consultar saldo de peça              | O sistema deve exibir o saldo atual da peça (quantidade física total disponível).                                                                                                                               |       CP2       |
|  RF13  | Consultar histórico de movimentações | O sistema deve exibir no ecrã o histórico de movimentações da peça.                                                                                                                                             |       CP2       |
|  RF14  | Filtrar histórico por período        | O sistema deve permitir que o utilizador aplique um filtro de período (data) na listagem do histórico de movimentações.                                                                                         |       CP2       |

</div>

#### CP3 — Registro de vendas e recebimentos

<div class="requirements-table-wrap requirements-table--rf" markdown="1">

| Código | Nome                            | Descrição                                                                                                                                                                                                                                                                                                                                                        | Rastreabilidade |
| :----: | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------: |
|  RF15  | Registrar venda                 | O sistema deve permitir a utilizadores com perfil Administrador ou Operador o registro de uma venda com informação do canal de origem, das peças vendidas, das quantidades e do preço. Ao confirmar, o sistema deve deduzir automaticamente as quantidades vendidas do saldo em estoque.                                                                         |       CP3       |
|  RF16  | Cancelar venda                  | O sistema deve permitir ao Administrador cancelar uma venda registrada previamente, revertendo a baixa de estoque correspondente.                                                                                                                                                                                                                                |       CP3       |
|  RF17  | Registrar encargos da venda     | O sistema deve permitir o registro dos valores de desconto concedido, frete cobrado e taxas aplicadas (ex: comissão do marketplace) para uma venda já criada.                                                                                                                                                                                                    |       CP3       |
|  RF18  | Gerenciar status de recebimento | O sistema deve permitir que o usuário registre o recebimento (total ou parcial) de uma venda e a forma de pagamento por meio de um botão dropdown, com as opções de status de recebimento. O status de novas vendas deve iniciar como "a receber", podendo o utilizador com perfil Administrador ou Operador atualizar esse status de forma autónoma ao registo. |       CP3       |
|  RF19  | Exibir total consolidado        | O sistema deve exibir uma página com o total consolidado de valores a receber, listando as vendas pendentes.                                                                                                                                                                                                                                                     |       CP3       |
|  RF20  | Filtrar página de recebíveis    | O sistema deve permitir que o usuário aplique filtros por período e canal na página de recebíveis.                                                                                                                                                                                                                                                               |       CP3       |

</div>

#### CP4 — Planejamento de compras e reposição

<div class="requirements-table-wrap requirements-table--rf" markdown="1">

| Código | Nome                                | Descrição                                                                                                                                                                                                                                                                                                          | Rastreabilidade |
| :----: | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------: |
|  RF21  | Definir estoque mínimo por peça     | O sistema deve permitir a configuração de uma quantidade mínima de estoque para cada peça, abaixo da qual o item é considerado em estado crítico.                                                                                                                                                                  |       CP4       |
|  RF22  | Consultar painel de estoque crítico | O sistema deve exibir um painel consolidado com todas as peças em estado crítico (saldo abaixo do mínimo ou zerado), com indicação do saldo atual e do mínimo configurado.                                                                                                                                         |       CP4       |
|  RF23  | Criar lista de compras              | O sistema deve permitir a criação de uma lista de compras para a próxima remessa, com adição manual das peças desejadas e das quantidades a pedir.                                                                                                                                                                 |       CP4       |
|  RF24  | Confirmar recebimento de remessa    | O sistema deve permitir a confirmação do recebimento de uma remessa vinculada a uma lista de compras, aceitando recebimentos parciais ou totais. Caso a quantidade recebida seja divergente da lista, o sistema deve exigir uma justificativa. Ao confirmar, o saldo em estoque deve ser atualizado imediatamente. |       CP4       |

</div>

#### CP5 — Análise de desempenho do estoque e das vendas

<div class="requirements-table-wrap requirements-table--rf" markdown="1">

| Código | Nome                          | Descrição                                                                                                                                                                                                                                               | Rastreabilidade |
| :----: | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------: |
|  RF25  | Listar itens mais vendidos    | O sistema deve fornecer uma interface de consulta, permitindo filtrar e ordenar itens por: volume de vendas (maior/menor) e itens sem movimentação (indicando dias desde a última saída), com período de tempo configurável.                            |       CP5       |
|  RF26  | Analisar desempenho por canal | O sistema deve gerar um consolidado de vendas (volume de peças e valor financeiro total), agrupado por canal de origem (balcão, Mercado Livre e contato direto), a partir de um período de tempo configurável.                                          |       CP5       |
|  RF27  | Exportar relatórios           | O sistema deve permitir a exportação do relatório de movimentações do estoque e do relatório de vendas, ambos gerados em um período configurável e visualizáveis em tela, nos formatos PDF e .xlsx (Excel), preservando os filtros e os dados exibidos. |       CP5       |

</div>

#### CP6 — Visão financeira e de capital de giro

<div class="requirements-table-wrap requirements-table--rf" markdown="1">

| Código | Nome                               | Descrição                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Rastreabilidade |
| :----: | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------: |
|  RF28  | Registrar despesa operacional      | O sistema deve permitir ao administrador registrar uma despesa da operação (ex.: aluguel, embalagens ou frete de compra), informando data, categoria e valor.                                                                                                                                                                                                                                                                                                 |       CP6       |
|  RF29  | Editar despesa operacional         | O sistema deve permitir ao administrador selecionar uma despesa operacional já registrada e alterar sua data, categoria e valor, salvando as alterações no mesmo registro.                                                                                                                                                                                                                                                                                    |       CP6       |
|  RF30  | Excluir despesa operacional        | O sistema deve permitir ao administrador selecionar uma despesa operacional já registrada e excluí-la após confirmar a exclusão.                                                                                                                                                                                                                                                                                                                              |       CP6       |
|  RF31  | Consultar demonstrativo financeiro | O sistema deve disponibilizar ao administrador uma página de demonstrativo financeiro com campos de data inicial e data final. Ao solicitar a consulta, a página deve exibir o total dos valores líquidos das vendas cuja data esteja no período informado, o total das despesas operacionais cuja data esteja no mesmo período e o saldo entre esses totais (receitas menos despesas), com detalhamento das receitas por canal e das despesas por categoria. |       CP6       |

</div>

#### CP7 — Apoio à emissão fiscal e à expedição

<div class="requirements-table-wrap requirements-table--rf" markdown="1">

| Código | Nome                              | Descrição                                                                                                                                                                                                                                                                 | Rastreabilidade |
| :----: | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------: |
|  RF32  | Registrar dados fiscais da peça   | O sistema deve permitir ao administrador registrar no cadastro da peça: NCM, unidade tributável, alíquotas, origem da mercadoria e CST ou CSOSN, conforme aplicável. Esses dados pertencem à peça; o CFOP depende da operação fiscal e não é um dado fixo desse cadastro. |       CP7       |
|  RF33  | Editar dados fiscais da peça      | O sistema deve permitir ao administrador alterar, no cadastro de uma peça, os dados fiscais já registrados: código NCM, unidade tributável, alíquotas, origem da mercadoria e CST ou CSOSN, conforme aplicável.                                                           |       CP7       |
|  RF34  | Vincular documento fiscal à venda | O sistema deve permitir vincular a uma venda concluída o número e a data de um documento fiscal já emitido (NF-e, NFC-e ou cupom fiscal). Essas informações ficam associadas à venda.                                                                                     |       CP7       |
|  RF35  | Registrar envio de peças          | O sistema deve permitir o registro, para uma venda com entrega, da modalidade de envio, do código de rastreio e da data de despacho.                                                                                                                                      |       CP7       |
|  RF36  | Consultar expedições do período   | O sistema deve exibir as vendas com entrega de um período, com o status de cada envio (a enviar / enviado / entregue) e os dados de rastreio registrados.                                                                                                                 |       CP7       |

</div>

#### CP8 — Gestão de acesso e usuários

<div class="requirements-table-wrap requirements-table--rf" markdown="1">

| Código | Nome               | Descrição                                                                                                                                                                       | Rastreabilidade |
| :----: | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------: |
|  RF37  | Autenticar usuário | O sistema deve exigir autenticação por credenciais (e-mail e senha) para acesso a qualquer funcionalidade, bloqueando o acesso após cinco tentativas consecutivas malsucedidas. |       CP8       |
|  RF38  | Cadastrar usuário  | O sistema deve permitir ao administrador cadastrar um usuário, informando e-mail, senha inicial e perfil de acesso (administrador ou operador).                                 |       CP8       |
|  RF39  | Editar usuário     | O sistema deve permitir ao administrador alterar o e-mail e o perfil de acesso de um usuário ativo, mantendo o histórico de operações desse usuário.                            |       CP8       |
|  RF40  | Desativar usuário  | O sistema deve permitir ao administrador desativar uma conta de usuário, impedindo novos acessos dessa conta sem apagar seus registros históricos.                              |       CP8       |

</div>

### 8.2 Lista de requisitos não funcionais

<article class="requirement-card" markdown="1">

#### RNF01 — Responsividade da interface em dispositivos móveis

A interface web do sistema deve ser responsiva e operável por toque em dispositivos móveis com largura de viewport a partir de 360 pixels CSS em orientação retrato, cobrindo a faixa de 360px a 428px CSS, garantindo ergonomia para as rotinas operacionais da loja (consulta de saldo, registro de movimentação e consulta de vendas).

**Classificação:** usabilidade (URPS+) / produto — usabilidade (Sommerville).

**Critério verificável:** Conformidade com **WCAG 2.1 AA** — área de toque mínima de **44×44 pixels CSS** para todos os elementos interativos, nas larguras de viewport de 360px, 390px e 414px CSS em orientação retrato.

</article>

<article class="requirement-card" markdown="1">

#### RNF02 — Tolerância a Falhas de Conexão

Em caso de perda de conexão de rede durante o processamento de uma operação entre cliente e servidor, o sistema deve garantir a recuperabilidade do estado e a tolerância a falhas sem perda ou duplicidade de dados.

**Classificação:** confiabilidade (URPS+) / produto — confiabilidade (Sommerville).

**Critério verificável:** **0% de perda ou duplicidade de dados** em operações interrompidas por queda de conexão, garantido por chave de idempotência de requisição.

</article>

<article class="requirement-card" markdown="1">

#### RNF03 — Compatibilidade com navegadores web

O sistema deve operar corretamente nos navegadores web modernos Google Chrome, Mozilla Firefox, Microsoft Edge e Apple Safari, nas duas versões mais recentes de cada um, sem exigir instalação de software adicional, extensões ou plugins no dispositivo do usuário.

**Classificação:** suportabilidade/compatibilidade (URPS+) / produto — portabilidade (Sommerville).

**Critério verificável:** Execução sem erros bloqueantes nas **2 versões mais recentes** de Chrome, Firefox, Edge e Safari — sem quebras de layout e com persistência íntegra dos dados.

</article>

<article class="requirement-card" markdown="1">

#### RNF04 — Desempenho de resposta

As consultas ao catálogo, ao saldo de estoque e aos relatórios devem apresentar os resultados em até três segundos para 95% das requisições (P95), sob conexão de ao menos 10 Mbps e carga de dois usuários simultâneos, em ambiente de produção com banco de dados contendo até 5.000 peças cadastradas e 20.000 movimentações.

**Classificação:** desempenho (URPS+) / produto — eficiência (Sommerville).

**Critério verificável:** **P95 ≤ 3 segundos** para consultas ao catálogo, saldo de estoque e relatórios analíticos, sob carga de 2 usuários simultâneos e conexão mínima de 10 Mbps.

</article>

<article class="requirement-card" markdown="1">

#### RNF05 — Segurança de dados

As senhas dos usuários devem ser armazenadas obrigatoriamente utilizando função de hash criptográfico com salt (bcrypt), sendo vedado o armazenamento de credenciais em texto simples. Todo o tráfego de dados entre cliente e servidor deve ser protegido pelo protocolo HTTPS com TLS 1.2 ou superior em todos os ambientes operacionais.

**Classificação:** segurança (URPS+) / produto — segurança da informação (Sommerville).

**Critério verificável:** **100% das senhas** armazenadas com hash bcrypt com salt; todo o tráfego protegido por **TLS 1.2 ou superior**, sem fallback para HTTP.

</article>



## Versionamento

| Versão |    Data    | Descrição                                                                                                                                                  | Autor(es/as)                               |
| :----: | :--------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
|  1.0   | 04/09/2026 | Iniciação do documento                                                                                                                                     | [Thiago Gomes](https://github.com/thgomxs) |
|  1.1   | 24/09/2026 | Formatação dos requisitos funcionais em tabelas e dos não funcionais em cartões                                                                            | [Thiago Gomes](https://github.com/thgomxs) |
|  1.2   | 30/09/2026 | Atualização dos RFs e RNFs conforme a versão atual dos requisitos                                                                                          | Equipe                                     |
|  1.3   | 02/10/2026 | Separação das operações de despesas, esclarecimento do demonstrativo financeiro e correção da sobreposição dos dados fiscais conforme feedback da monitora | Equipe                                     |
