# Requisitos de software

## 8 Requisitos de software

Este documento apresenta os requisitos funcionais (RF) e não funcionais (RNF) do sistema TSI Peças, derivados das características de produto definidas na etapa de elicitação. Os requisitos estão organizados por característica de produto de origem e serão utilizados como base para o planejamento das sprints e para a validação com o cliente.

### 8.1 Lista de requisitos funcionais

#### CP1 — Gestão do catálogo de peças

| Código | Nome | Descrição | Rastreabilidade |
| :---- | :---- | :---- | :---: |
| RF01 | Cadastrar peça | O sistema deve permitir que utilizadores com perfil Administrador ou Operador cadastrem uma peça, com preenchimento obrigatório do código do fabricante, do nome e da categoria; e preenchimento opcional da descrição técnica, da localização física e de uma foto. | CP1 |
| RF02 | Importar peças via planilha | O sistema deve permitir ao perfil Administrador selecionar uma planilha .xlsx de peças, validar os registros e cadastrá-los em lote, sem sobrescrever peças já cadastradas com o mesmo código do fabricante. | CP1 |
| RF03 | Associar veículo à peça | O sistema deve permitir a associação de uma ou mais aplicações por veículo a uma peça cadastrada, com registo de marca, modelo e ano de compatibilidade. | CP1 |
| RF04 | Buscar peça | O sistema deve permitir a localização de peças no catálogo por ao menos um dos seguintes filtros: código do fabricante, nome, categoria ou aplicação por veículo (marca, modelo ou ano). | CP1 |
| RF05 | Editar peça | O sistema deve permitir a edição de qualquer campo do cadastro de uma peça já registrada, com exceção do código do fabricante, que é imutável após o cadastro inicial. | CP1 |
| RF06 | Alterar status da peça | O sistema deve permitir que o usuário altere o status de uma peça, alternando entre "ativo" e "inativo". | CP1 |

#### CP2 — Controle de movimentações e saldo do estoque

| Código | Nome | Descrição | Rastreabilidade |
| :---- | :---- | :---- | :---: |
| RF07 | Registar entrada de peças | O sistema deve permitir o cadastro de fornecedores e o registo da entrada de um lote de peças no stock, com informação da peça, da quantidade, da data, do fornecedor e do preço de custo unitário. | CP2 |
| RF08 | Registar saída manual | O sistema deve permitir que utilizadores com perfil Administrador ou Operador registrem uma saída manual de peças do stock, com informação da peça, da quantidade, da data e do motivo. | CP2 |
| RF09 | Registar ajuste de inventário | O sistema deve permitir que apenas o perfil Administrador realize o registo de um ajuste de inventário, com informação da peça, da diferença de quantidade (positiva ou negativa) e da justificativa do ajuste. | CP2 |
| RF10 | Registar devolução de peça | O sistema deve permitir que o usuário registre a devolução de uma peça, restabelecendo a quantidade ao saldo do estoque. | CP2 |
| RF11 | Consultar saldo de peça | O sistema deve exibir o saldo atual da peça (quantidade física total disponível). | CP2 |
| RF12 | Consultar histórico de movimentações | O sistema deve exibir no ecrã o histórico de movimentações da peça. | CP2 |
| RF13 | Filtrar histórico por período | O sistema deve permitir que o utilizador aplique um filtro de período (data) na listagem do histórico de movimentações. | CP2 |

#### CP3 — Vinculação do estoque aos anúncios dos canais de venda

| Código | Nome | Descrição | Rastreabilidade |
| :---: | :---- | :---- | :---: |
| RF14 | Associar anúncio a peça | O sistema deve permitir a associação de um ou mais anúncios do Mercado Livre a uma peça cadastrada, mediante informação do identificador do anúncio e confirmação da vinculação. | CP3 |

#### CP4 — Registro de vendas e recebimentos

| Código | Nome | Descrição | Rastreabilidade |
| :---: | :---- | :---- | :---: |
| RF15 | Registrar venda | O sistema deve permitir a utilizadores com perfil Administrador ou Operador o registro de uma venda com informação do canal de origem, das peças vendidas, das quantidades e do preço. Ao confirmar, o sistema deve deduzir automaticamente as quantidades vendidas do saldo em estoque. | CP4 |
| RF16 | Cancelar venda | O sistema deve permitir ao Administrador cancelar uma venda registrada previamente, revertendo a baixa de estoque correspondente. | CP4 |
| RF17 | Registrar encargos da venda | O sistema deve permitir o registro dos valores de desconto concedido, frete cobrado e taxas aplicadas (ex: comissão do marketplace) para uma venda já criada. | CP4 |
| RF18 | Registrar recebimento de venda | O sistema deve permitir que o usuário registre o recebimento (total ou parcial) de uma venda e a forma de pagamento. O status de novas vendas deve iniciar como "a receber". | CP4 |
| RF19 | Exibir total consolidado | O sistema deve exibir uma página com o total consolidado de valores a receber, listando as vendas pendentes. | CP4 |
| RF20 | Atualizar status de recebimento | O sistema deve permitir que o utilizador com perfil Administrador ou Operador atualize o status de recebimento de forma autónoma ao registo. | CP4 |
| RF21 | Filtrar página de recebíveis | O sistema deve permitir que o usuário aplique filtros por período e canal na página de recebíveis. | CP4 |

#### CP5 — Planejamento de compras e reposição

| Código | Nome | Descrição | Rastreabilidade |
| :---: | :---- | :---- | :---: |
| RF22 | Definir estoque mínimo por peça | O sistema deve permitir a configuração de uma quantidade mínima de estoque para cada peça, abaixo da qual o item é considerado em estado crítico. | CP5 |
| RF23 | Consultar painel de estoque crítico | O sistema deve exibir um painel consolidado com todas as peças em estado crítico (saldo abaixo do mínimo ou zerado), com indicação do saldo atual e do mínimo configurado. | CP5 |
| RF24 | Criar lista de compras | O sistema deve permitir a criação de uma lista de compras para a próxima remessa, com adição manual das peças desejadas e das quantidades a pedir. | CP5 |
| RF25 | Confirmar recebimento de remessa | O sistema deve permitir a confirmação do recebimento de uma remessa vinculada a uma lista de compras, aceitando recebimentos parciais ou totais. Caso a quantidade recebida seja divergente da lista, o sistema deve exigir uma justificativa. Ao confirmar, o saldo em estoque deve ser atualizado imediatamente. | CP5 |

#### CP6 — Análise de desempenho do estoque e das vendas

| Código | Nome | Descrição | Rastreabilidade |
| :---: | :---- | :---- | :---: |
| RF26 | Gerar relatório de movimentações | O sistema deve gerar e exportar um relatório de movimentações do estoque em um período configurável, exibindo data, tipo, peça, quantidade e motivo, com filtro por tipo. O relatório deve ser visualizável em tela e exportável nos formatos PDF e .xlsx (Excel). | CP6 |
| RF27 | Gerar relatório de vendas | O sistema deve gerar e exportar um relatório de vendas em um período configurável, exibindo data, canal, peças vendidas, quantidades, valor bruto e valor líquido. O relatório deve ser visualizável em tela e exportável nos formatos PDF e .xlsx (Excel). | CP6 |
| RF28 | Listar itens mais vendidos | O sistema deve fornecer uma interface de consulta, permitindo filtrar e ordenar itens por: volume de vendas (maior/menor) e itens sem movimentação (indicando dias desde a última saída), com período de tempo configurável. | CP6 |
| RF29 | Analisar desempenho por canal | O sistema deve gerar um consolidado de vendas (volume de peças e valor financeiro total), agrupado por canal de origem (balcão, Mercado Livre e contato direto), a partir de um período de tempo configurável. | CP6 |
| RF30 | Exportar relatório em PDF | O sistema deve permitir a exportação de qualquer relatório gerado em formato PDF, preservando os filtros e os dados exibidos na tela. | CP6 |

#### CP7 — Visão financeira e de capital de giro

| Código | Nome | Descrição | Rastreabilidade |
| :---: | :---- | :---- | :---: |
| RF31 | Gerenciar despesa operacional | O sistema deve permitir que utilizadores com perfil Administrador registrem, editem ou excluam despesas da operação (ex: aluguel, embalagens, frete de compra), com informação de data, categoria e valor. | CP7 |
| RF32 | Consultar demonstrativo financeiro | O sistema deve permitir ao administrador informar uma data inicial e uma data final para consultar o total dos valores líquidos das vendas com data no período, o total das despesas operacionais com data no mesmo período e o saldo entre esses totais (receitas menos despesas), com detalhamento das receitas por canal e das despesas por categoria. | CP7 |

#### CP8 — Apoio à emissão fiscal e à expedição

| Código | Nome | Descrição | Rastreabilidade |
| :---: | :---- | :---- | :---: |
| RF33 | Registrar dados fiscais da peça | Registrar e editar dados fiscais da peça. O sistema deve permitir o registro e a edição das informações fiscais necessárias para a emissão de notas. Devem ser especificadas e mantidas as informações de código NCM, unidade tributável, alíquotas, origem da mercadoria, CST e CSOSN (aplicável ao Simples Nacional). O CFOP não deve ser tratado como um atributo estático do cadastro da peça, mas sim selecionável de acordo com a natureza da operação no momento da emissão. | CP8 |
| RF34 | Editar dados fiscais da peça | O sistema deve permitir ao administrador alterar o código NCM, o CFOP, a unidade tributável e as alíquotas aplicáveis de uma peça já cadastrada. | CP8 |
| RF35 | Registrar documento fiscal da venda | O sistema deve permitir o registro, para uma venda concluída, do número e da data do documento fiscal emitido (NF-e, NFC-e ou cupom fiscal). | CP8 |
| RF36 | Registrar envio de peças | O sistema deve permitir o registro, para uma venda com entrega, da modalidade de envio, do código de rastreio e da data de despacho. | CP8 |
| RF37 | Consultar expedições do período | O sistema deve exibir as vendas com entrega de um período, com o status de cada envio (a enviar / enviado / entregue) e os dados de rastreio registrados. | CP8 |

#### CP10 — Gestão de acesso e usuários

| Código | Nome | Descrição | Rastreabilidade |
| :---: | :---- | :---- | :---: |
| RF38 | Autenticar usuário | O sistema deve exigir autenticação por credenciais (e-mail e senha) para acesso a qualquer funcionalidade, bloqueando o acesso após cinco tentativas consecutivas malsucedidas. | CP10 |
| RF39 | Cadastrar usuário | O sistema deve permitir ao administrador cadastrar um usuário, informando e-mail, senha inicial e perfil de acesso (administrador ou operador). | CP10 |
| RF40 | Editar usuário | O sistema deve permitir ao administrador alterar o e-mail e o perfil de acesso de um usuário ativo, mantendo o histórico de operações desse usuário. | CP10 |
| RF41 | Desativar usuário | O sistema deve permitir ao administrador desativar uma conta de usuário, impedindo novos acessos dessa conta sem apagar seus registros históricos. | CP10 |

### 8.2 Lista de requisitos não funcionais

#### RNF01 — Responsividade da interface em dispositivos móveis

A interface web do sistema deve ser responsiva e operável por toque em dispositivos móveis com largura de viewport a partir de 360 pixels CSS em orientação retrato, cobrindo a faixa de 360px a 428px CSS, garantindo ergonomia para as rotinas operacionais da loja (consulta de saldo, registro de movimentação e consulta de vendas).

**Classificação:** usabilidade (URPS+) / produto — usabilidade (Sommerville).

**Critério verificável:** nas telas de consulta de saldo, registro de movimentações e consulta de vendas, testadas nas larguras de viewport de 360px, 390px e 414px CSS em orientação retrato:

1. Nenhum elemento visual ou textual deve se sobrepor a outro;  
2. Nenhuma rolagem horizontal deve ser exibida ou necessária;  
3. Todos os botões, campos de entrada e links interativos devem apresentar área de toque mínima de 44 × 44 pixels CSS (WCAG 2.1 AA), acionáveis por toque sem necessidade de aproximação (*zoom*).

#### RNF02 — Tolerância a Falhas de Conexão

Em caso de perda de conexão de rede durante o processamento de uma operação entre cliente e servidor, o sistema deve garantir a recuperabilidade do estado e a tolerância a falhas sem perda ou duplicidade de dados: se a transação foi confirmada no servidor antes da queda de conexão, o resultado persistido deve ser mantido e exibido após a reconexão; se não foi confirmada, nenhum dado parcial deve permanecer no estoque.

**Classificação:** confiabilidade (URPS+) / produto — confiabilidade (Sommerville).

**Critério verificável:** interrompida a conexão no envio de uma movimentação ou venda:

1. Caso a requisição tenha sido confirmada no servidor antes da queda de rede, ao restabelecer a conexão o sistema deve identificar o estado e exibir a confirmação da operação com o saldo atualizado correspondente;  
2. Caso a transação não tenha sido completada no servidor, o saldo deve permanecer inalterado;  
3. O reenvio da mesma operação pelo usuário deve ser protegido por chave de idempotência de requisição, impedindo que a mesma saída ou venda seja gravada em duplicidade após a reconexão.

#### RNF03 — Compatibilidade com navegadores web

O sistema deve operar corretamente nos navegadores web modernos Google Chrome, Mozilla Firefox, Microsoft Edge e Apple Safari, nas duas versões mais recentes de cada um, sem exigir instalação de software adicional, extensões ou plugins no dispositivo do usuário.

**Classificação:** suportabilidade/compatibilidade (URPS+) / produto — portabilidade (Sommerville).

**Critério verificável:** a conformidade deve ser validada pela execução com sucesso do fluxo principal de aceitação (autenticação de usuário, busca de peças no catálogo, registro de movimentação de estoque e registro de venda) nas duas versões mais recentes dos quatro navegadores listados, sem erros bloqueantes no console, sem quebras de layout e com persistência íntegra dos dados.

#### RNF04 — Desempenho de resposta

As consultas ao catálogo, ao saldo de estoque e aos relatórios devem apresentar os resultados em até três segundos para 95% das requisições (P95), sob conexão de ao menos 10 Mbps e carga de dois usuários simultâneos, em ambiente de produção com banco de dados contendo até 5.000 peças cadastradas e 20.000 movimentações.

**Classificação:** desempenho (URPS+) / produto — eficiência (Sommerville).

**Critério verificável:** executada uma bateria de testes de desempenho com a volumetria e concorrência especificadas, avaliada separadamente para cada categoria de consulta:

1. **Consultas ao catálogo:** 100 requisições consecutivas de busca por código, nome ou aplicação — ao menos 95 devem responder em até 3 segundos;  
2. **Consultas de saldo de estoque:** 100 requisições consecutivas de consulta pontual de saldo — ao menos 95 devem responder em até 3 segundos;  
3. **Relatórios analíticos:** 100 requisições consecutivas de geração de relatórios de movimentações e vendas com filtros por período — ao menos 95 devem responder em até 3 segundos.

#### RNF05 — Segurança de dados

As senhas dos usuários devem ser armazenadas obrigatoriamente utilizando função de hash criptográfico com salt (bcrypt), sendo vedado o armazenamento de credenciais em texto simples. Todo o tráfego de dados entre cliente e servidor deve ser protegido pelo protocolo HTTPS com TLS 1.2 ou superior em todos os ambientes operacionais.

**Classificação:** segurança (URPS+) / produto — segurança da informação (Sommerville).

**Critério verificável:**

1. 100% das senhas salvas no banco de dados devem utilizar hash criptográfico com salt (bcrypt), sendo verificada a ausência de senhas em texto simples no banco ou em logs da aplicação;  
2. Tentativas de requisição não criptografadas (HTTP) devem ser rejeitadas ou redirecionadas automaticamente para HTTPS;  
3. Todas as rotas autenticadas da aplicação devem trafegar exclusivamente sobre HTTPS com certificado digital válido.

#### RNF06 — Tolerância a Falhas na Integração (Mercado Livre)

Em caso de indisponibilidade ou instabilidade da API do Mercado Livre, o sistema deve registrar o erro, notificar o operador e manter os registros operacionais locais intactos, retomando a sincronização e operações dependentes automaticamente quando a API estiver restabelecida, sem causar travamentos no sistema interno.

**Classificação:** confiabilidade (URPS+) / produto — confiabilidade (Sommerville).

**Critério verificável:**

1. Ao simular queda de resposta da API do Mercado Livre, as funções internas do sistema devem continuar operando sem interrupção.  
2. Nenhuma perda de dados local deve ocorrer devido a timeouts na integração.

## Versionamento

| Versão | Data | Descrição | Autor(es/as) |
| :---: | :---: | :---- | :---- |
| 1.0 | 21/09/2026 | Versão inicial dos requisitos do projeto | Bruno Ferreira |
| 1.1 | 24/09/2026 | Formatação dos requisitos funcionais em tabelas e dos não funcionais em cartões | Thiago Gomes |
| 1.2 | 29/09/2026 | Remoção de requisitos descartados e renumeração sequencial contínua | Equipe |