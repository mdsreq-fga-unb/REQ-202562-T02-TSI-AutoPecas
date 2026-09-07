# 5 Engenharia de Requisitos

## 5.1 Atividades e Técnicas de ER e Scrum XP

### Planejamento da Release

* **Elicitação e Descoberta:**
  * *Entrevistas estruturadas:* Entrevistas realizadas com os stakeholders da TSI peças para compreender as necessidades centrais do negócio, como a atual falta de rastreabilidade do estoque.
  * *Sessões de Ideação (Brainstorming):* Prática colaborativa e interativa utilizada para gerar uma grande quantidade de ideias, funcionalidades e soluções de alto nível, como propostas para a integração do estoque e a especificação de produtos.
  * *Análise do contexto da solução:* Investigação do domínio da aplicação e do ambiente em que o sistema operará, visando entender as regras de negócio e os valores fundamentais para o cliente.
* **Análise e Consenso:**
  * *MoSCoW:* Técnica que auxilia na separação das funcionalidades de acordo com as prioridades mais críticas para a TSI Autopeças, classificando-as em *Must have*, *Should have*, *Could have* e *Won’t have*.
  * *Estudo de Viabilidade:* Avaliação preliminar realizada em conjunto com a modelagem de negócio para compreender as restrições de orçamento, recursos e prazo, garantindo que o escopo de requisitos proposto seja técnica e financeiramente realizável.
* **Declaração:**
  * *Épicos e User Stories (Histórias de Usuário):* Elaboração dos requisitos em alto nível (Épicos) que capturam as grandes necessidades do sistema. A partir deles, são declaradas as User Stories iniciais, descrevendo o valor entregue ao usuário de forma simples, compondo a primeira versão do *Product Backlog*.

### Planejamento da Sprint

* **Elicitação e Descoberta:**
  * *Análise Documental:* Revisão de documentos existentes da empresa, como planilhas atuais e relatórios de vendas, para identificar pontos que necessitam de melhoria e que direcionarão o foco da sprint.
  * *Workshop de Requisitos:* Reuniões facilitadas com os stakeholders visando organizar ideias, resolver ambiguidades e alinhar entendimentos antes do início do desenvolvimento, garantindo que não haja lacunas no escopo da iteração.
* **Análise e Consenso:**
  * *Refinamento do Backlog do Produto (Grooming):* Atividade contínua e colaborativa na qual a equipe discute, detalha, estima e prioriza os itens do backlog, garantindo um entendimento técnico e de negócio unificado antes do planejamento da iteração.
  * *Análise de Tarefas:* Detalhamento e definição das atividades técnicas que cada membro da equipe irá realizar, garantindo a compreensão das dependências e a eficiência do trabalho.
* **Declaração:**
  * *Especificação de User Stories e Critérios de Aceitação:* Detalhamento das histórias selecionadas para a sprint no formato padrão ("Como um... Quero... Para que..."). Nesta etapa, declara-se formalmente os critérios de aceitação testáveis de cada história (seja documentando no Notion da equipe ou mapeando diretamente via issues no GitHub) para assegurar a clareza da entrega.
* **Organização e Atualização:**
  * *Decomposição e Detalhamento de Requisitos:* Técnica analítica em que requisitos maiores são fatiados em histórias menores, e posteriormente em tarefas específicas, facilitando a atualização constante do quadro de trabalho.

### Execução da Sprint

* **Representação:**
  * *Prototipação Rápida:* Utilização de esboços, *storyboards* ou *wireframes* para validar visualmente se o fluxo da história de usuário está correto e compreendido antes da codificação.
  * *Modelagem Ágil:* Criação de diagramas e modelos simplificados (como diagramas de sequência ou fluxogramas) elaborados pela equipe no momento da implementação para esclarecer lógicas complexas.
* **Verificação e Validação:**
  * *Revisão dos Critérios de Aceitação:* Utilização de *checklists* para validar cada funcionalidade em desenvolvimento, garantindo que os pontos definidos nos critérios (como a integração do estoque ou o cadastro de peças) sejam integralmente cumpridos.
* **Organização e Atualização:**
  * *DEEP:* Manutenção do backlog garantindo que ele permaneça *DEEP* (Detalhado adequadamente, Emergente, Estimado e Priorizado). Isso absorve de forma organizada as mudanças ou novos *feedbacks* descobertos durante a execução técnica.

### Revisão da Sprint

* **Verificação e Validação:**
  * *Demonstração e Validação com Stakeholders:* Reunião para apresentar o incremento do produto. Serve para validar as funcionalidades entregues, alinhar expectativas, dirimir eventuais ambiguidades e colher *feedbacks* para futuras melhorias.
* **Declaração:**
  * *Registro de Novos Requisitos e Mudanças:* Formalização documental de novos requisitos, correções ou ajustes de rota solicitados pelo cliente durante a demonstração, convertendo-os em novas *User Stories* para o backlog.

### Retrospectiva da Sprint

* **Análise e Consenso:**
  * *Análise de Causa Raiz:* Discussão colaborativa focada nos processos de requisitos (ex: verificar se uma história mal escrita gerou atrasos). A equipe entra em consenso sobre o que falhou na comunicação ou no entendimento das *User Stories* na sprint encerrada.
* **Atualização do Processo:**
  * *Adaptação das Práticas de ER:* Implementação de melhorias no próprio método de engenharia de requisitos (ex: decidir que a equipe precisará detalhar melhor os critérios de aceitação ou melhorar o template das histórias nas próximas iterações).

### Planejamento da Próxima Release

* **Elicitação e Descoberta:**
  * *Mapeamento de Evolução do Produto:* Sessões para captar novas necessidades estratégicas da TSI Autopeças ou compilar os feedbacks das Sprints anteriores, visualizando o que agregará mais valor na próxima versão.
* **Declaração:**
  * *User Story Mapping (Mapeamento de Histórias):* Criação ou atualização de um mapa visual das jornadas dos usuários, organizando épicos e histórias em lançamentos (*releases*), garantindo que a nova release tenha um fluxo completo e funcional.
* **Organização e Atualização:**
  * *Revisão Estratégica do Backlog (DEEP):* Aplicação contínua do conceito DEEP no backlog geral da *release*. O objetivo é depurar requisitos antigos, reestimar e repriorizar, assegurando que os itens da próxima *release* estejam claros, definidos e prontos para o fracionamento nas Sprints seguintes.

---

## 5.2 Engenharia de Requisitos e o Scrum XP

| Fases do Processo | Atividades ER | Prática | Técnica | Resultado Esperado |
| :--- | :--- | :--- | :--- | :--- |
| **Planejamento da Release** | Elicitação e Descoberta | Entendimento do Domínio e Negócio | Entrevistas estruturadas, Sessões de Ideação, Análise do contexto da solução | Visão geral das necessidades do proprietário e escopo inicial do sistema estabelecido. |
| **Planejamento da Release** | Análise e Consenso | Priorização Orientada a Valor | MoSCoW, Estudo de Viabilidade | Funcionalidades críticas identificadas e viabilidade técnica/financeira confirmada. |
| **Planejamento da Release** | Declaração | Especificação Ágil de Alto Nível | Épicos e User Stories | Primeira versão do *Product Backlog* criada contendo as grandes necessidades. |
| **Planejamento da Sprint** | Elicitação e Descoberta | Alinhamento Contínuo | Análise Documental, Workshop de Requisitos | Escopo da Sprint compreendido de forma clara, sem lacunas ou ambiguidades. |
| **Planejamento da Sprint** | Análise e Consenso | Gestão do Backlog de Produto | Refinamento do Backlog, Análise de Tarefas | Itens estimados, priorizados e tarefas técnicas distribuídas para a equipe. |
| **Planejamento da Sprint** | Declaração | Especificação Detalhada | Especificação de *User Stories* e Critérios de Aceitação | Histórias prontas para codificação com critérios de aceitação testáveis definidos. |
| **Planejamento da Sprint** | Organização e Atualização | Detalhamento de Requisitos | Decomposição e Detalhamento de Requisitos | Histórias de usuário fatiadas em tarefas técnicas menores para a Sprint. |
| **Execução da Sprint** | Representação | Validação Visual e Lógica | Prototipação Rápida, Modelagem Ágil | Telas compreendidas visualmente e fluxos de trabalho esclarecidos antes do código. |
| **Execução da Sprint** | Verificação e Validação | Teste e Validação de Aceitação | Revisão dos Critérios de Aceitação (*Checklists*) | Funcionalidades desenvolvidas e testadas de acordo com as regras de negócio. |
| **Execução da Sprint** | Organização e Atualização | Gestão de Mudanças | DEEP (*Detalhado, Emergente, Estimado, Priorizado*) | *Backlog* constantemente organizado, acomodando descobertas técnicas da equipe. |
| **Revisão da Sprint** | Verificação e Validação | Homologação com o *Stakeholder* | Demonstração e Validação com *Stakeholders* | Incremento de software validado pelo proprietário e coleta de *feedbacks*. |
| **Revisão da Sprint** | Declaração | Atualização de Escopo | Registro de Novos Requisitos e Mudanças | Novos requisitos ou ajustes formalizados em novas histórias para o *backlog*. |
| **Retrospectiva da Sprint** | Análise e Consenso | Avaliação de Processos de ER | Análise de Causa Raiz | Falhas de comunicação ou de entendimento de requisitos identificadas para melhoria. |
| **Planej. da Próxima Release** | Elicitação e Descoberta | Planejamento Evolutivo | Mapeamento de Evolução do Produto | Novas necessidades e adaptações captadas para a próxima versão do sistema. |
| **Planej. da Próxima Release** | Declaração | Mapeamento de Jornada | *User Story Mapping* | Mapa visual atualizado garantindo um fluxo de trabalho completo na nova versão. |
| **Planej. da Próxima Release** | Organização e Atualização | Refinamento Estratégico | Revisão Estratégica do Backlog (DEEP) | Requisitos antigos depurados e repriorizados para a próxima fase do projeto. |

---

## Histórico de Versões

| Versão | Data | Descrição | Autor(es/as) |
| :---: | :---: | :--- | :--- |
| 1.0 | 04/09/2026 | Iniciação do documento | [Thiago Gomes](https://github.com/thgomxs) |
| 2.0 | 04/09/2026 | Preenchimento tópico 5 e revisão textual | [Rodrigo Barbosa](https://github.com/RodrigoCBarbosa) |