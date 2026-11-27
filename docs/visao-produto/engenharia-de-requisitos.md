# <span id="5-engenharia-de-requisitos"></span>Engenharia de Requisitos {#engenharia-de-requisitos}

## <span id="51-atividades-e-tecnicas-de-er-e-scrum-xp"></span>Atividades e Técnicas de ER e Scrum XP {#atividades-e-tecnicas-de-er-e-scrum-xp}

### Planejamento da Release

* **Elicitação e Descoberta:**
  * *Entrevistas semiestruturadas:* Entrevistas (guiadas por um roteiro base) realizadas com o proprietário da TSI Peças para compreender as necessidades centrais do negócio, como a atual falta de rastreabilidade do estoque.
  * *Sessões de Ideação (Brainstorming):* Prática colaborativa e interativa utilizada para gerar uma grande quantidade de ideias, funcionalidades e soluções de alto nível, como propostas para a integração do estoque e a especificação de produtos.
  * *Análise do contexto da solução:* Investigação do domínio da aplicação e do ambiente em que o sistema operará, visando entender as regras de negócio e os valores fundamentais para o cliente.
* **Análise e Consenso:**
  * *MoSCoW:* Técnica que auxilia na separação das funcionalidades de acordo com as prioridades mais críticas para a TSI Peças, classificando-as em *Must have*, *Should have*, *Could have* e *Won’t have*.
  * *Estudo de Viabilidade:* Avaliação preliminar realizada por meio de análise de documentos em conjunto com o MoSCoW para compreender as restrições de orçamento, recursos e prazo, contribuindo para que o escopo seja realizável utilizando.
* **Declaração:**
  * *Artefatos de Declaração (Épicos e User Stories):* Elaboração dos requisitos em alto nível (Épicos) que capturam as grandes necessidades do sistema. A partir deles, são declaradas as User Stories iniciais, descrevendo o valor entregue ao usuário de forma simples, compondo a primeira versão do *Product Backlog*.

### Planejamento da Sprint

* **Elicitação e Descoberta:**
  * *Análise Documental:* Revisão de documentos existentes da empresa, como planilhas atuais e relatórios de vendas, favorecendo a identificação de pontos que necessitam de melhoria e que direcionarão o foco da sprint.
  * *Reuniões facilitadas com o proprietário:* Reuniões visando organizar ideias, resolver ambiguidades e alinhar entendimentos antes do início do desenvolvimento, favorecendo minimizar as lacunas no escopo da iteração.
* **Análise e Consenso:**
  * *Análise de Tarefas:* Análise detalhada das tarefas que o usuário executa no dia a dia da empresa para atingir seus objetivos, visando compreender do fluxo de trabalho e das regras do negócio.
* **Declaração:**
  * *Artefatos (User Stories e Critérios de Aceitação):* Detalhamento das histórias selecionadas para a sprint no formato padrão ("Como um... Quero... Para que..."). Nesta etapa, declara-se formalmente os critérios de aceitação testáveis de cada história que servirão como referência base para a Verificação e Validação.
* **Representação:**
  * *Prototipação Rápida:* Utilização de esboços, *storyboards* ou *wireframes* para validar visualmente se o fluxo da história de usuário está correto e compreendido antes da codificação.
  * *Artefatos para avaliação:* os [cinco grupos de prototipação do MVP](../prototipos/index.md) reúnem a interface navegável, os vínculos com as 12 US selecionadas e os roteiros de avaliação.
* **Verificação e Validação:**
  * *Verificação de Prontidão (DoR):* Verificação prévia das histórias e regras de negócio antes do desenvolvimento, contribuindo para que os critérios de aceitação estejam prontos.
  * *Validação com Propietário:* Validação prévia com o propietário, para favorecer o esclarecimento de possiveis duvidas e problemas.
* **Organização e Atualização:**
  * *Prática de Refinamento do Backlog:* Atividade contínua e colaborativa na qual a equipe utiliza técnicas para discutir, detalhar, estimar e priorizar os itens do backlog, favorecendo um entendimento unificado antes do planejamento da iteração.
  * *Decomposição e Detalhamento de Requisitos:* Técnica analítica em que requisitos maiores são fatiados em histórias menores, favorecendo a atualização constante do quadro de trabalho e a entrega de valor.

### Execução da Sprint

* **Verificação:**
  * *Revisão dos Critérios de Aceitação:* Utilização de *checklists* para realizar a verificação interna de cada funcionalidade em desenvolvimento, certificando que os pontos definidos nos critérios sejam cumpridos.
  * *Características do Backlog (DEEP):* Verificação contínua das propriedades do backlog para atestar se ele permanece *DEEP* (Detalhado, Emergente, Estimado, Priorizado).

### Revisão da Sprint

* **Validação Externa:**
  * *Demonstração e Validação com o Proprietário:* Reunião para apresentar o incremento do produto. Serve para validar as funcionalidades entregues com o cliente, alinhar expectativas e colher *feedbacks* para futuras melhorias.
* **Organização e Atualização:**
  * *Registro de Novos Requisitos e Mudanças:* Formalização documental de novos requisitos, correções ou ajustes de rota solicitados pelo cliente durante a demonstração, convertendo-os em novas *User Stories* para o backlog.

### Retrospectiva da Sprint

* **Análise e Consenso:**
  * *Análise de Causa Raiz:* Discussão colaborativa focada nos processos de requisitos (ex: verificar se uma história mal escrita gerou atrasos). A equipe entra em consenso sobre o que falhou na comunicação ou no entendimento das *User Stories* na sprint encerrada.
* **Atualização do Processo:**
  * *Adaptação das Práticas de ER:* Implementação de melhorias no próprio método de engenharia de requisitos (ex: decidir que a equipe precisará detalhar melhor os critérios de aceitação ou melhorar o template das histórias nas próximas iterações).

### Planejamento da Próxima Release

* **Elicitação e Descoberta:**
  * *Brainstorming:* Sessões para captar novas necessidades estratégicas da TSI Peças ou compilar os feedbacks das Sprints anteriores, contribuindo para a visualização do que agregará mais valor na próxima versão.
* **Organização e Atualização:**
  * *Atualização de Épicos e User Stories:* Criação e declaração de novos épicos e histórias de usuário baseados nos *feedbacks* coletados, organizando-os no *Product Backlog* para contribuir na definição clara do escopo e do valor entregue na próxima *release*.
* **Verificação e Validação:**
  * *Verificação de Prontidão (DoR):* Verificação contínua do backlog geral da *release* contra os critérios DoR para que a equipe esteja preparada para a execução da próxima sprint. 

---

## <span id="52-engenharia-de-requisitos-e-o-scrum-xp"></span>Engenharia de Requisitos e o Scrum XP {#engenharia-de-requisitos-e-o-scrum-xp}

| Fases do Processo | Atividades ER | Prática | Técnica | Resultado Esperado |
| :--- | :--- | :--- | :--- | :--- |
| **Planejamento da Release** | Elicitação e Descoberta | Entendimento do Domínio e Negócio | Entrevistas semiestruturadas, Sessões de Ideação, Análise do contexto da solução | Visão geral das necessidades do proprietário e escopo inicial do sistema estabelecido. |
| **Planejamento da Release** | Análise e Consenso | Priorização Orientada a Valor | MoSCoW, Análise Documental | Funcionalidades críticas identificadas, para a priorização e viabilidade técnica verificada. |
| **Planejamento da Release** | Declaração | Especificação Ágil de Alto Nível | Análise de material disponível e conhecimento do domínio | Criação do *Product Backlog* com as grandes necessidades. |
| **Planejamento da Sprint** | Elicitação e Descoberta | Alinhamento Contínuo | Análise Documental, Reuniões com o proprietário | Escopo da Sprint compreendido, visando minimizar lacunas e ambiguidades. |
| **Planejamento da Sprint** | Análise e Consenso | Entendimento do Usuário | Análise de Tarefas | Tarefas e fluxo de trabalho do usuário mapeados e compreendidos. |
| **Planejamento da Sprint** | Declaração | Especificação Detalhada | Detalhamento e Análise das Histórias | Detalhamento e análise dos Épicos e Histórias de Usuário |
| **Planejamento da Sprint** | Representação | Produção de Artefatos Visuais | Prototipação Rápida | Wireframes ou protótipos produzidos para validar fluxos visualmente. |
| **Planejamento da Sprint** | Verificação e Validação | Verificação Prévia | Verificação de Prontidão (DoR) | Histórias e regras verificadas antes do desenvolvimento. |
| **Planejamento da Sprint** | Verificação e Validação | Verificação Prévia | Validação com Propietário | Histórias e regras verificadas antes do desenvolvimento. |
| **Planejamento da Sprint** | Organização e Atualização | Gestão e Detalhamento | Refinamento e Decomposição | Histórias detalhadas, priorizadas e fatiadas para a Sprint. |
| **Execução da Sprint** | Verificação | Verificação Interna | Revisão por Checklists | Funcionalidades verificadas internamente. |
| **Execução da Sprint** | Verificação | Propriedades do Backlog | Verificação contínua do backlog | *Backlog* verificado para atestar as características DEEP. |
| **Revisão da Sprint** | Validação Externa | Homologação com o Proprietário | Demonstração e Validação com Cliente | Incremento de software validado externamente pelo proprietário. |
| **Revisão da Sprint** | Organização e Atualização | Atualização de Escopo |  de requisitos | Novos requisitos formalizados para o *backlog*. |
| **Retrospectiva da Sprint** | Análise e Consenso | Avaliação de Processos de ER | Análise de Causa Raiz | Falhas de comunicação identificadas para melhoria. |
| **Planej. da Próxima Release** | Elicitação e Descoberta | Planejamento Evolutivo | Brainstorming | Novas necessidades e adaptações captadas para a próxima versão do sistema. |
| **Planej. da Próxima Release** | Organização e Atualização | Especificação Ágil | Atualização de Épicos e User Stories | Novos épicos e histórias formalizados e alocados para a próxima versão. |
| **Planej. da Próxima Release** | Verificação e Validação | Validação de Prontidão | Verificação de Prontidão (DoR) | Backlog validado contra os critérios DoR favorecendo a prontidão para a próxima fase. |
---

## Resultados das Técnicas Aplicadas {#resultados-das-tecnicas-aplicadas}

As seções anteriores declaram as atividades e as técnicas previstas. Esta seção registra **o que
três dessas técnicas produziram**, ligando técnica, material examinado e decisão de requisito, e
separa o que foi planejado e ainda não foi executado.

A fonte da análise documental e da análise de tarefas é a [ata de levantamento de dados da
loja](../atas/levantamento-dados-loja.md), de 26/11/2026. A fonte da avaliação DEEP é a base do
catálogo, `tools/docs/data/backlog.json`, lida em 27/11/2026.

!!! warning "O que este registro não é"
    O levantamento de 26/11/2026 foi assíncrono, por mensagens, e a leitura dos arquivos foi feita
    pela equipe, sem participação do cliente. Conforme a própria ata, ele **não valida os critérios
    de aceitação de nenhuma história e não equivale ao item de validação com o cliente da
    [Definição de Pronto](dor-e-dod.md#definition-of-done-dod)**. Duas respostas do cliente vieram
    de pergunta de confirmação sugerida pela equipe e estão assinaladas onde são usadas. As
    estimativas de volume declaradas pelo cliente ("mais de 300" peças, "menos de um" por semana)
    não foram medidas.

### Análise Documental (26/11/2026)

A técnica declarada no *Planejamento da Sprint* foi aplicada a três planilhas da loja e a uma tela
do Mercado Livre, que geraram os cinco registros abaixo — a planilha *Vendas 2021* foi examinada em
dois recortes, as abas de peças e as abas mensais. As contagens foram feitas por script, ignorando
maiúsculas e espaços nos códigos; valores de custo, preço e lucro não são reproduzidos.

| Material examinado | O que foi contado | O que mudou no entendimento |
| :--- | :--- | :--- |
| Controle de estoque (última alteração: junho de 2017) | Aba "Em Estoque": 62 peças com quantidade, 42 com saldo; código em outra aba, ausente em 30 de 68 linhas; 7 códigos repetidos | Descartada como fonte da carga inicial: o cliente indicou outro arquivo e este não é alterado desde 2017. Também não tem categoria, localização nem códigos equivalentes |
| *Vendas 2021* (última alteração: janeiro de 2022), abas "Importados" e "Nacionais" | 549 linhas de peças; 400 com código e 149 sem; 311 códigos únicos; 65 códigos repetidos, presentes em 154 linhas; 22 códigos nas duas abas | Fonte de peças indicada pelo cliente às 10h59. Não tem categoria, localização física, códigos equivalentes nem quantidade |
| *Vendas 2021*, abas mensais | Uma linha por unidade vendida, com data, peça, custos, taxa do Mercado Livre e preço; sem coluna de canal de origem nem de cliente | O canal de venda da [US15](requisitos-de-software.md#us15) é dado novo para a loja: não há histórico para migrar nem base para estimar a distribuição por canal. A aba "Telelatas" ficou fora por indicação do cliente |
| *Compras 2021* (última alteração: janeiro de 2021) | 291 linhas; 282 códigos únicos; 113 sem preço | Sem coluna de fornecedor. O arquivo não oferece dado de fornecedor para reaproveitar, o que é coerente com a entrada de peças sem fornecedor registrada em 14/11/2026 para a [US08](requisitos-de-software.md#us08) |
| Tela de anúncios do Mercado Livre (foto de 26/11/2026, 11h47) | 1.433 anúncios; estoque exibido separadamente em "Full" e "Depósito"; o SKU visível repete o identificador do anúncio | Não existe código do fabricante confiável para ligar anúncio e peça, de modo que uma carga de saldo a partir dos anúncios não é viável com o que a tela mostra. O número de anúncios não é medida do catálogo de peças |

O efeito dessa análise recai sobre a [US02](requisitos-de-software.md#us02), a história de
importação, e está registrado no histórico do [RF02](requisitos-de-software.md#rf02) em
27/11/2026:

* **A planilha de origem deixou de ser hipótese.** É a *Vendas 2021*, abas "Nacionais" e
  "Importados", conforme a resposta das 10h59. O modelo de colunas da US02 passa a ser avaliado
  contra um arquivo concreto, e não contra uma planilha presumida.
* **O arquivo, como está, é rejeitado pelos próprios critérios da US02.** O CA02.6 rejeita o lote
  inteiro quando um código se repete, e há 65 códigos repetidos em 154 linhas; o CA02.5 exige
  código do fabricante, nome e categoria em cada registro, e 149 das 549 linhas estão sem código,
  enquanto nenhuma delas tem categoria; pelo CA02.3, uma única linha inválida impede o cadastro do
  lote.
* **A diferença em relação à resposta do cliente permanece aberta.** Às 10h02 ele respondeu
  "Aceita do jeito que está" para repetidos e campos faltando. Essa resposta e os critérios atuais
  não convivem: ou os critérios mudam, ou a planilha é tratada antes da importação. **Não há
  decisão registrada**, e a equipe não converte a resposta em alteração de critério.
* **Os códigos equivalentes continuam sem origem conhecida.** O cliente respondeu "Entram na
  planilha" (10h02), nenhum arquivo analisado tem coluna de equivalentes e o CA02.5 não prevê essa
  coluna no modelo de importação.
* **O saldo inicial não vem da planilha.** O estoque é controlado no Mercado Livre (11h00) e a
  planilha de peças não tem quantidade. A origem apontada é a soma de "Full" e "Depósito" — resposta
  obtida por pergunta sugerida pela equipe, às 12h01 —, o que mantém a carga de saldo fora do
  escopo da US02 e dependente de decisão ainda não tomada.

### Análise de Tarefas (26/11/2026)

A técnica declarada em *Análise e Consenso* foi aplicada às respostas do proprietário sobre o que
ele faz hoje, e não sobre o que o sistema deveria fazer. O resultado liga cada tarefa ao fluxo
correspondente.

| Tarefa do proprietário | O que ele respondeu | Efeito no fluxo do sistema |
| :--- | :--- | :--- |
| Controlar o estoque | "Estoque controlo direto do MercadoLivre" (11h00); o saldo da loja é a soma de "Full" e "Depósito" (12h01, por pergunta sugerida pela equipe) | O sistema entra em uma operação cujo estoque já é controlado fora dele. O saldo inicial de cada peça não tem origem em planilha, e a movimentação do MVP parte de um número que hoje só existe no Mercado Livre |
| Cadastrar peça e anúncio | O que mais dá trabalho é "Cadastrar" (11h50), e é "Nos dois", sistema e Mercado Livre (12h01) | O gargalo declarado está no cadastro, não na consulta. O cadastro ([US01](requisitos-de-software.md#us01)) e a importação (US02) atacam o custo que o proprietário identifica; cada campo ou passo adicional no cadastro aumenta justamente o trabalho que ele considera o maior |
| Cadastrar ano e modelo de compatibilidade | "Isso teria que ver uma forma fácil de cadastrar ano e modelo. É a parte que mais se gasta tempo." (09h45) | A [US03](requisitos-de-software.md#us03) aceita um ano por associação, então uma peça que serve a vários anos exige uma associação por ano, multiplicando a tarefa mais custosa. A pendência está aberta na ata e **não há solução definida**; o critério não foi alterado sem decisão |
| Atender quem pede uma peça | Sabe primeiro o "Nome da peça"; marca e modelo às vezes são escritos de formas diferentes ("Sim"); no resultado precisa de "Nome e código" (09h45) | A busca da [US04](requisitos-de-software.md#us04) tem o nome como porta de entrada, com correspondência parcial e tolerância a maiúsculas e espaços; a lista de resultado exibe nome e código. A busca por veículo é complemento desse caminho, não a entrada principal |
| Vender | Quase tudo pelo Mercado Livre; fora dele, "menos de um" por semana (11h41, confirmado às 11h50); pretende lançar as vendas do Mercado Livre também no sistema (11h50) | A venda no sistema (US15) atende um volume baixo fora do Mercado Livre e conviverá com digitação dupla enquanto não houver integração. O campo de canal não tem equivalente nos arquivos da loja |

Em resumo, a análise de tarefas deslocou a atenção para os fluxos de **cadastro** e de **aplicação
por veículo**: são eles que concentram o tempo do proprietário hoje. A busca é desenhada a partir
do que ele sabe primeiro — o nome — e a importação existe para evitar repetir o cadastro peça por
peça.

### Avaliação DEEP do Backlog (27/11/2026)

A verificação das características DEEP estava declarada na *Execução da Sprint* sem registro de
execução. A avaliação abaixo foi feita em 27/11/2026 sobre os 40 registros de requisito funcional
da base, em relação de um para um com as histórias de usuário.

| Característica | O que a base mostra | Lacuna |
| :--- | :--- | :--- |
| **Detalhado** | As 12 histórias do MVP (US01 a US06, US08, US09, US10, US12, US15 e US16) têm critérios de aceitação declarados nas issues; 3 estão na sprint 3, 5 na sprint 4 e 4 na sprint 5 | Os 28 registros sem sprint atribuída têm apenas a declaração do requisito. Não há registro de DoR para nenhum deles, nem ordem definida para detalhá-los |
| **Emergente** | 97 linhas de histórico datadas, das quais 57 posteriores à linha de consolidação de 03/11/2026, distribuídas em 32 dos 40 registros: o backlog muda por decisão registrada, com data e origem, e não por reescrita silenciosa | O histórico registra a decisão, não a discussão que a produziu. Mudanças que não alteram um campo aprovado não deixam linha, e o registro do RF02 de 27/11/2026 mostra que uma informação de 26/11 só chegou à base no dia seguinte |
| **Estimado** | Todos os 40 registros têm VN, classificação MoSCoW e as notas EI, CA e LC que geram o ET, conforme a [priorização](priorizacao.md) | Duas ressalvas. As pontuações de VN foram atribuídas pela equipe e **aguardam confirmação formal do proprietário**. E 5 registros (RF01, RF02, RF04, RF14 e RF16) declaram reestimativa pendente em nota de priorização: o ET e o Score exibidos ainda refletem a estimativa anterior ao último ajuste de escopo |
| **Priorizado** | Score calculado em todos os registros, com recorte de entrega explícito: 12 no MVP, 6 condicionados e 22 como evolução futura. As 12 do MVP são Must Have, e 11 delas têm Score ≥ 4 | As duas divergências em relação ao corte estão justificadas no campo de motivo de entrega: o RF02 tem Score 3 e permanece no MVP por decisão do cliente de 05/10/2026; o RF14 tem Score 4 e permanece condicionado por decisão de 04/11/2026. Ao todo, 6 registros carregam justificativa de exceção. A ordenação interna das 28 histórias fora de sprint não foi feita |

Duas decisões de requisito decorrem dessa avaliação: o detalhamento continua proporcional à
proximidade da entrega, sem antecipar critérios das 28 histórias sem sprint; e as cinco
reestimativas pendentes permanecem sinalizadas em vez de receberem notas novas que a equipe não
acordou.

### Práticas Planejadas e Ainda Não Executadas

Declaradas nas seções anteriores, as práticas abaixo ainda não produziram resultado registrado:

* **Avaliação dos protótipos com o cliente.** Os [cinco grupos de prototipação](../prototipos/index.md)
  e o [guia de avaliação](../prototipos/avaliacao.md) existem, mas a ata de 26/11/2026 registra que
  os protótipos e seus roteiros não foram usados com o cliente, e nenhuma ata registra uma sessão
  de avaliação com o proprietário.
* **Validação externa com execução de tarefas.** O cliente não executou tarefas no sistema nem
  avaliou critérios de aceitação. As respostas de 26/11/2026 tratam de regras e dados, não do
  funcionamento das histórias; a própria ata aponta "nenhuma" evidência para o item de validação
  com o cliente.
* **Demonstração do incremento na Revisão da Sprint.** A [validação de 16/11/2026](../atas/validacao-us-cliente.md)
  foi uma lista de funções enviada por mensagem, respondida pelo cliente com "Validado". Não houve
  demonstração do incremento nem uso do sistema pelo proprietário, e o ciclo operacional do MVP
  ainda não foi apresentado.
* **Confirmação formal das pontuações de valor de negócio**, prevista na
  [priorização](priorizacao.md#avaliacao-do-valor-de-negocio-vn) e ainda pendente.
* **Medições do contexto.** A distribuição de vendas por canal, o volume semanal de vendas no
  Mercado Livre e o tamanho atual do catálogo não foram medidos; os números disponíveis são
  declarações do cliente.

---

## Histórico de Versões

| Versão | Data | Descrição | Autor(es/as) |
| :---: | :---: | :--- | :--- |
| 1.0 | 04/09/2026 | Iniciação do documento | [Thiago Gomes](https://github.com/thgomxs) |
| 2.0 | 04/09/2026 | Preenchimento tópico 5 e revisão textual | [Rodrigo Barbosa](https://github.com/RodrigoCBarbosa) |
| 3.0 | 20/09/2026 | Revisão após feedback do professor e monitor | [Rodrigo Barbosa](https://github.com/RodrigoCBarbosa) |
| 4.0 | 11/10/2026 | Correção após analise do monitor | [Rodrigo Barbosa](https://github.com/RodrigoCBarbosa) |
| 4.1 | 12/10/2026 | Correção após analise do monitor | [Rodrigo Barbosa](https://github.com/RodrigoCBarbosa) |
| 4.2 | 12/10/2026 | Fix no Scrum | [Rodrigo Barbosa](https://github.com/RodrigoCBarbosa) |
| 4.3 | 12/10/2026 | Correção após analise do monitor | [Rodrigo Barbosa](https://github.com/RodrigoCBarbosa) |
| 4.4 | 04/11/2026 | Remoção da numeração estrutural e ajuste da hierarquia dos títulos, com links estáveis e preservação das âncoras anteriores. | [Thiago Gomes](https://github.com/thgomxs) |
| 4.5 | 27/11/2026 | Registro dos resultados da análise documental e da análise de tarefas de 26/11/2026, da avaliação DEEP do backlog de 27/11/2026 e das práticas ainda não executadas (issue #79). | [Luiz Moreira](https://github.com/luizhtmoreira) |
