# Solução e características

## 2 Solução proposta

### 2.1 Objetivo geral do produto

Facilitar a gestão da TSI Peças por meio de uma solução digital de controle de estoque e cadastro de peças, substituindo o uso de planilhas do Excel por um sistema organizado e confiável.

A solução visa reduzir as perdas de vendas causadas por informações de estoque desatualizadas e diminuir o tempo gasto pelo proprietário em tarefas operacionais repetitivas, permitindo que ele dedique mais atenção ao atendimento e ao negócio.

### 2.2 Objetivos específicos (OE) do produto

- **OE1:** organizar e padronizar o cadastro de peças, utilizando o código do fabricante e a aplicação por veículo.
- **OE2:** disponibilizar informações confiáveis e atualizadas sobre a disponibilidade das peças, reduzindo perdas causadas por divergências no estoque.
- **OE3:** reduzir o tempo gasto em tarefas operacionais repetitivas.
- **OE4:** facilitar as decisões de compra e de precificação, com base no desempenho do estoque e das vendas.
- **OE5:** aumentar a previsibilidade financeira do negócio, facilitando o controle da necessidade de caixa.

### 2.3 Características de produto mapeadas com os objetivos específicos

A solução proposta deverá contemplar, de forma preliminar, as características a seguir. O mapeamento distingue o objetivo específico principal de cada característica e sua contribuição secundária.

#### Mapeamento entre características e objetivos

| ID | Característica | OE principal | Contribuição secundária |
| --- | --- | :---: | :---: |
| CP1 | Cadastro e Catálogo de Peças | OE1 | OE3 |
| CP2 | Controle e Movimentação de Estoque | OE2 | OE4 |
| CP3 | Vínculo de Estoque e Anúncios | OE2 | OE3 |
| CP4 | Registro de Vendas e Recebimentos | OE2 | OE5 |
| CP5 | Análise e Planejamento de Compras | OE4 | OE2, OE5 |
| CP6 | Controle Financeiro e Capital de Giro | OE5 | OE3 |
| CP7 | Apoio Fiscal e Expedição | OE3 | OE1 |
| CP8 | Integridade e Usabilidade | OE2 | OE3 |
| CP9 | Gerenciamento e Autenticação de Usuários | OE3 | OE2 |

#### Descrição e valor de negócio

| ID | Descrição resumida | ID VN | Valor de negócio (VN) |
| --- | --- | :---: | --- |
| CP1 | A solução deverá manter um catálogo único e padronizado das peças, com suas informações técnicas e de aplicação, permitindo que o mesmo cadastro sirva de referência para o estoque, os anúncios e os documentos fiscais. | VN1 | Redução do tempo de catalogação e fim do retrabalho de cadastrar a mesma peça em lugares diferentes. |
| CP2 | A solução deverá controlar as movimentações de estoque de cada peça, mantendo seu saldo e seu histórico atualizados, permitindo que o estoque registrado corresponda ao estoque real. | VN2 | Saldo de estoque confiável, condição para substituir o controle em planilhas. |
| CP3 | A solução deverá relacionar o estoque de cada peça aos seus anúncios nos canais de venda, permitindo identificar quando a disponibilidade anunciada deixa de corresponder ao estoque real. | VN3 | Redução dos cancelamentos por falta de estoque e da consequente perda de reputação no marketplace. |
| CP4 | A solução deverá registrar as vendas realizadas nos diferentes canais e acompanhar seus recebimentos, permitindo que o estoque seja atualizado a cada venda e que os valores a receber sejam conhecidos. | VN4 | Fim da baixa manual após cada venda e clareza sobre os valores pendentes de recebimento. |
| CP5 | A solução deverá analisar o desempenho do estoque e das vendas e apoiar o planejamento das compras, permitindo que as decisões de reposição e de precificação sejam tomadas com base em dados. | VN5 | Menor perda de vendas por ruptura de estoque e melhor uso do capital disponível para compras. |
| CP6 | A solução deverá consolidar as informações financeiras da operação, permitindo acompanhar a necessidade de capital de giro do negócio. | VN6 | Substituição do fechamento manual entre planilhas e previsibilidade da necessidade de caixa. |
| CP7 | A solução deverá apoiar as rotinas fiscais e de expedição das vendas, permitindo reaproveitar os dados já cadastrados e acompanhar o envio das peças. | VN7 | Eliminação do cadastro duplicado entre o marketplace e o emissor de notas fiscais. |
| CP8 | A solução deverá garantir a consistência dos dados de estoque e oferecer uso adequado em diferentes dispositivos, permitindo operar o sistema com segurança durante a rotina de separação e envio. | VN8 | Prevenção de vendas acima do saldo disponível e uso do sistema no próprio local de trabalho. |
| CP9 | A solução deverá controlar o acesso dos usuários e registrar a autoria das operações, permitindo que tarefas operacionais sejam delegadas com segurança. | VN9 | Preparação para a delegação de tarefas operacionais em caso de contratação futura. |

#### Notas de escopo

- **CP3:** no escopo do MVP, a vinculação entre peças e anúncios será registrada manualmente na solução. A integração automática com o Mercado Livre permanece como evolução futura.
- **CP7:** a solução não emite a nota fiscal. Ela mantém os dados necessários à emissão, que continua sendo feita no emissor externo, e registra a nota emitida e o envio associados a cada venda.

### 2.4 Tecnologias a serem utilizadas

Para a construção da solução, foram definidas tecnologias amplamente utilizadas no desenvolvimento web, priorizando a familiaridade da equipe e a adequação ao escopo do projeto.

| Componente | Tecnologias | Finalidade |
| --- | --- | --- |
| Front-end | React com Vite | Construir uma interface responsiva e de fácil manutenção. |
| Back-end | Python com FastAPI | Implementar os serviços web e organizar as regras de negócio. |
| Persistência de dados | PostgreSQL por meio do Supabase | Armazenar os dados da aplicação. |
| Publicação do front-end | Vercel | Realizar o deploy do front-end. |
| Publicação do back-end | Render | Realizar o deploy do back-end. |
| Controle de versão | Git e GitHub | Versionar o código do projeto. |
| Ambiente de desenvolvimento e execução | Docker | Padronizar o ambiente de desenvolvimento e a execução da aplicação. |

### 2.5 Pesquisa de mercado e análise competitiva

O mercado de sistemas de gestão para autopeças conta com soluções consolidadas, que podem ser divididas em dois grupos: ERPs generalistas voltados a pequenas e médias empresas (como Bling e Tiny/Olist) e sistemas especializados no setor automotivo (como AtacadistaPro, VendaSimples e ERPClass). A análise a seguir compara essas soluções segundo critérios relevantes para o contexto da TSI Peças.

| Critério | Bling | Tiny (Olist) | Sistemas de autopeças¹ | Solução TSI Peças (proposta) |
| --- | --- | --- | --- | --- |
| Foco | ERP generalista para PMEs de e-commerce | ERP generalista para sellers online | Especializados no setor automotivo | Sob medida para a operação da TSI Peças |
| Preço (entrada) | A partir de ~R$ 55/mês, crescente por módulos e volume | A partir de ~R$ 49/mês (anual), por faixas | A partir de ~R$ 85/mês | Sem custo de licença; usa serviços de camada gratuita no MVP |
| Modelo | Assinatura mensal recorrente | Assinatura mensal recorrente | Assinatura mensal recorrente | Projeto acadêmico, sem assinatura |
| Catálogo por aplicação veicular | Não nativo | Não nativo | Sim (nativo) | Sim (foco do projeto) |
| Amplitude | Alta (fiscal, financeiro, PDV, marketplaces) | Alta (fiscal, expedição, marketplaces) | Alta (referência cruzada, curva ABC, ICMS-ST) | Enxuta (núcleo: catálogo, estoque e vendas) |
| Público-alvo | Micro a médias empresas | Sellers em crescimento | Autopeças estruturadas (balcão e atacado B2B) | Microempresa de operador único |

<small>¹ Representados por AtacadistaPro, VendaSimples e ERPClass.</small>

As soluções analisadas são robustas, porém direcionadas a operações mais estruturadas do que a da TSI Peças. Fontes independentes confirmam essa característica: o Bling é descrito como podendo ser "overkill" para uma operação enxuta que busca apenas vender e manter o estoque atualizado, além de apresentar limitações para perfis fora do e-commerce com emissão fiscal frequente. Os sistemas especializados em autopeças, por sua vez, são desenhados para lojas que atuam também no atacado B2B e com equipe de vendas, incorporando módulos (referência cruzada, curva ABC, substituição tributária, múltiplos depósitos) que excedem a necessidade de um operador único.

A solução proposta para a TSI Peças não pretende competir em amplitude, mas em foco e adequação. Concentra-se no núcleo que resolve a dor real do cliente — catálogo organizado, controle de estoque confiável e registro de vendas — com uma interface enxuta para um operador que trabalha sozinho, sem o custo recorrente de assinatura nem a complexidade de configurar módulos não essenciais.

Cabe ressaltar que a ausência de custo de licença não significa ausência total de custos de operação: serviços de hospedagem e infraestrutura possuem planos gratuitos com limites, e a operação em escala pode exigir custos futuros. A integração automática com o Mercado Livre, presente em vários concorrentes, é reconhecida como evolução futura da solução.

### 2.6 Viabilidade da proposta

A proposta é considerada viável no contexto da disciplina, levando em conta o acesso ao cliente, o escopo definido e a possibilidade de entregar incrementalmente um MVP funcional até o final do semestre.

- **Acesso ao cliente:** o proprietário da TSI Peças procurou a equipe e se dispôs a colaborar ao longo do desenvolvimento, favorecendo a elicitação e a validação frequentes de requisitos.
- **Escopo delimitado:** a solução concentra-se no cadastro organizado de peças e no controle confiável do estoque. Funcionalidades de maior complexidade, como a integração automática com o Mercado Livre, são tratadas como evoluções futuras, fora do MVP. Esse recorte mantém o projeto compatível com o prazo e o tamanho da equipe.
- **Conhecimento técnico:** a equipe optou por tecnologias amplamente difundidas e com as quais possui familiaridade — React, Python com FastAPI e PostgreSQL por meio do Supabase —, reduzindo o risco associado à curva de aprendizado.
- **Risco de domínio e mitigação:** o principal ponto de atenção está na modelagem do cadastro de peças, considerando as particularidades dos códigos dos fabricantes e da aplicação por veículo. O acesso direto ao proprietário, que conhece o domínio, e as entregas incrementais em sprints de duas semanas, com validação contínua, contribuem para mitigar esse risco.

A viabilidade depende de manter o escopo do MVP controlado, preservar as prioridades e realizar validações frequentes com o cliente ao longo do desenvolvimento.

### 2.7 Benefícios esperados

#### Para o cliente: TSI Peças

- Redução das perdas de vendas causadas por divergências entre o estoque real e o registrado, incluindo a diminuição dos cancelamentos no Mercado Livre e a preservação da reputação da loja.
- Organização e padronização do cadastro de peças, com um catálogo único que serve de referência para o estoque, os anúncios e os documentos fiscais.
- Maior previsibilidade financeira, com acompanhamento da necessidade de capital de giro e substituição do fechamento manual entre planilhas.
- Apoio às decisões de compra e de precificação, baseado no desempenho do estoque e das vendas.
- Redução do tempo gasto em tarefas operacionais repetitivas, liberando o proprietário para o atendimento e a gestão do negócio.

#### Para o usuário: proprietário e operador

- Substituição do controle manual em planilhas por uma ferramenta única e adequada à sua rotina, com menor esforço operacional.
- Estoque confiável e atualizado a cada venda, com prevenção de vendas acima do saldo disponível.
- Reaproveitamento dos dados no apoio às rotinas fiscais e de expedição, eliminando o cadastro duplicado entre o marketplace e o emissor de notas.
- Menor risco de erro no controle, com a centralização das informações que hoje estão dispersas.

Como evolução futura, a integração automática com o Mercado Livre poderá ampliar esses benefícios ao sincronizar o estoque do sistema com o canal de vendas on-line, reduzindo o esforço de atualização. Essa funcionalidade é desejável, mas permanece fora do escopo do MVP.

## Versionamento

| Versão | Data | Descrição | Autor(es/as) |
| :----: | :--: | --- | --- |
| 1.0 | 04/09/2026 | Iniciação do documento | [Thiago Gomes](https://github.com/thgomxs) |
| 1.1 | 07/09/2026 | Preenchimento do tópico 2 e revisão textual | [João Melo](https://github.com/jot4-ge) |
| 1.2 | 09/09/2026 | Revisão dos nomes e descrições das características de produto (2.3) | [João Melo](https://github.com/jot4-ge) |
| 1.3 | 22/09/2026 | Revisão da pesquisa de mercado (2.5): tabela comparativa com critérios e fontes, e correção da afirmação sobre custos, conforme issue #4 | [João Melo](https://github.com/jot4-ge) |
| 1.4 | 24/09/2026 | Revisão dos objetivos específicos (2.2), características de produto (2.3) e benefícios esperados (2.7) conforme feedback da monitoria: 5 OEs, 9 CPs no padrão de capacidade, rastreabilidade, notas de escopo e alinhamento dos benefícios ao novo escopo | [João Melo](https://github.com/jot4-ge) |
