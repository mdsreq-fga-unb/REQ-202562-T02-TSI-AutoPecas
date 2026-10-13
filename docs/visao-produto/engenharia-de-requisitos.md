# 5 Engenharia de Requisitos

## 5.1 Atividades e Técnicas de ER e Scrum XP

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

## 5.2 Engenharia de Requisitos e o Scrum XP

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
