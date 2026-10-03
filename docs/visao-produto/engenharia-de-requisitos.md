# 5 Engenharia de Requisitos

## 5.1 Atividades e Técnicas de ER e Scrum XP

### Planejamento da Release

* **Elicitação e Descoberta:**
  * *Entrevistas semiestruturadas:* Entrevistas (guiadas por um roteiro base) realizadas com o proprietário da TSI Peças para compreender as necessidades centrais do negócio, como a atual falta de rastreabilidade do estoque.
  * *Sessões de Ideação (Brainstorming):* Prática colaborativa e interativa utilizada para gerar uma grande quantidade de ideias, funcionalidades e soluções de alto nível, como propostas para a integração do estoque e a especificação de produtos.
  * *Análise do contexto da solução:* Investigação do domínio da aplicação e do ambiente em que o sistema operará, visando entender as regras de negócio e os valores fundamentais para o cliente.
* **Análise e Consenso:**
  * *MoSCoW:* Técnica que auxilia na separação das funcionalidades de acordo com as prioridades mais críticas para a TSI Peças, classificando-as em *Must have*, *Should have*, *Could have* e *Won’t have*.
  * *Estudo de Viabilidade:* Avaliação preliminar realizada em conjunto com a modelagem de negócio para compreender as restrições de orçamento, recursos e prazo. Seu resultado deve ser documentado, garantindo que o escopo seja realizável.
* **Declaração:**
  * *Artefatos de Declaração (Épicos e User Stories):* Elaboração dos requisitos em alto nível (Épicos) que capturam as grandes necessidades do sistema. A partir deles, são declaradas as User Stories iniciais, descrevendo o valor entregue ao usuário de forma simples, compondo a primeira versão do *Product Backlog*.

### Planejamento da Sprint

* **Elicitação e Descoberta:**
  * *Análise Documental:* Revisão de documentos existentes da empresa, como planilhas atuais e relatórios de vendas, para identificar pontos que necessitam de melhoria e que direcionarão o foco da sprint.
  * *Reuniões facilitadas com o proprietário:* Reuniões visando organizar ideias, resolver ambiguidades e alinhar entendimentos antes do início do desenvolvimento, visando minimizar as lacunas no escopo da iteração.
* **Análise e Consenso:**
  * *Análise de Tarefas:* Análise detalhada das tarefas que o usuário executa no dia a dia da empresa para atingir seus objetivos, garantindo a compreensão do fluxo de trabalho e das regras do negócio.
* **Declaração:**
  * *Artefatos (User Stories e Critérios de Aceitação):* Detalhamento das histórias selecionadas para a sprint no formato padrão ("Como um... Quero... Para que..."). Nesta etapa, declara-se formalmente os critérios de aceitação testáveis de cada história (documentados oficialmente na ferramenta de backlog) que servirão como referência base para a Verificação e Validação.
* **Verificação e Validação:**
  * *Verificação de Prontidão (DoR):* Verificação prévia das histórias e regras de negócio antes do desenvolvimento, garantindo que os critérios de aceitação estão prontos.
* **Organização e Atualização:**
  * *Prática de Refinamento do Backlog:* Atividade contínua e colaborativa na qual a equipe utiliza técnicas para discutir, detalhar, estimar e priorizar os itens do backlog, garantindo um entendimento unificado antes do planejamento da iteração.
  * *Decomposição e Detalhamento de Requisitos:* Técnica analítica em que requisitos maiores são fatiados em histórias menores, facilitando a atualização constante do quadro de trabalho e a entrega de valor.

### Execução da Sprint

* **Representação:**
  * *Prototipação Rápida:* Utilização de esboços, *storyboards* ou *wireframes* para validar visualmente se o fluxo da história de usuário está correto e compreendido antes da codificação.
* **Verificação:**
  * *Revisão dos Critérios de Aceitação:* Utilização de *checklists* para realizar a verificação interna de cada funcionalidade em desenvolvimento, certificando que os pontos definidos nos critérios sejam cumpridos.
  * *Características do Backlog (DEEP):* Verificação contínua das propriedades do backlog para atestar se ele permanece *DEEP* (Detalhado, Emergente, Estimado, Priorizado).

### Revisão da Sprint

* **Validação Externa:**
  * *Demonstração e Validação com o Proprietário:* Reunião para apresentar o incremento do produto. Serve para validar as funcionalidades entregues com o cliente, alinhar expectativas e colher *feedbacks* para futuras melhorias.
* **Declaração:**
  * *Registro de Novos Requisitos e Mudanças:* Formalização documental de novos requisitos, correções ou ajustes de rota solicitados pelo cliente durante a demonstração, convertendo-os em novas *User Stories* para o backlog.

### Retrospectiva da Sprint

* **Análise e Consenso:**
  * *Análise de Causa Raiz:* Discussão colaborativa focada nos processos de requisitos (ex: verificar se uma história mal escrita gerou atrasos). A equipe entra em consenso sobre o que falhou na comunicação ou no entendimento das *User Stories* na sprint encerrada.
* **Atualização do Processo:**
  * *Adaptação das Práticas de ER:* Implementação de melhorias no próprio método de engenharia de requisitos (ex: decidir que a equipe precisará detalhar melhor os critérios de aceitação ou melhorar o template das histórias nas próximas iterações).

### Planejamento da Próxima Release

* **Elicitação e Descoberta:**
  * *Mapeamento de Evolução do Produto:* Sessões para captar novas necessidades estratégicas da TSI Peças ou compilar os feedbacks das Sprints anteriores, visualizando o que agregará mais valor na próxima versão.
* **Declaração:**
  * *Atualização de Épicos e User Stories:* Criação e declaração de novos épicos e histórias de usuário baseados nos *feedbacks* coletados, organizando-os no *Product Backlog* para definir claramente o escopo e o valor entregue na próxima *release*.
* **Verificação e Validação:**
  * *Verificação de Prontidão (DEEP):* Validação contínua do backlog geral da *release* contra os critérios DEEP. O objetivo é verificar se os requisitos antigos foram depurados e reestimados, atestando que os itens da próxima *release* estão válidos e prontos para o fracionamento nas Sprints seguintes.

---

## 5.2 Engenharia de Requisitos e o Scrum XP

| Fases do Processo | Atividades ER | Prática | Técnica | Resultado Esperado |
| :--- | :--- | :--- | :--- | :--- |
| **Planejamento da Release** | Elicitação e Descoberta | Entendimento do Domínio e Negócio | Entrevistas semiestruturadas, Sessões de Ideação, Análise do contexto da solução | Visão geral das necessidades do proprietário e escopo inicial do sistema estabelecido. |
| **Planejamento da Release** | Análise e Consenso | Priorização Orientada a Valor | MoSCoW, Estudo de Viabilidade | Funcionalidades críticas identificadas e documento de viabilidade técnica gerado. |
| **Planejamento da Release** | Declaração | Especificação Ágil de Alto Nível | Artefatos: Épicos e User Stories | Primeira versão do *Product Backlog* criada contendo as grandes necessidades. |
| **Planejamento da Sprint** | Elicitação e Descoberta | Alinhamento Contínuo | Análise Documental, Reuniões com o proprietário | Escopo da Sprint compreendido, visando minimizar lacunas e ambiguidades. |
| **Planejamento da Sprint** | Análise e Consenso | Entendimento do Usuário | Análise de Tarefas | Tarefas e fluxo de trabalho do usuário mapeados e compreendidos. |
| **Planejamento da Sprint** | Declaração | Especificação Detalhada | Artefatos: User Stories e Critérios | Histórias detalhadas e critérios definidos como referência para V&V. |
| **Planejamento da Sprint** | Verificação e Validação | Verificação Prévia | Verificação de Prontidão (DoR) | Histórias e regras verificadas antes do desenvolvimento. |
| **Planejamento da Sprint** | Organização e Atualização | Gestão e Detalhamento | Prática de Refinamento, Decomposição | Histórias detalhadas, priorizadas e fatiadas para a Sprint. |
| **Execução da Sprint** | Representação | Produção de Artefatos Visuais | Prototipação Rápida | Wireframes ou protótipos produzidos para validar fluxos visualmente. |
| **Execução da Sprint** | Verificação | Verificação Interna | Revisão por Checklists | Funcionalidades verificadas internamente. |
| **Execução da Sprint** | Verificação | Propriedades do Backlog | Propriedades DEEP | *Backlog* verificado para atestar as características DEEP. |
| **Revisão da Sprint** | Validação Externa | Homologação com o Proprietário | Demonstração e Validação com Cliente | Incremento de software validado externamente pelo proprietário. |
| **Revisão da Sprint** | Declaração | Atualização de Escopo | Declaração de requisitos | Novos requisitos formalizados para o *backlog*. |
| **Retrospectiva da Sprint** | Análise e Consenso | Avaliação de Processos de ER | Análise de Causa Raiz | Falhas de comunicação identificadas para melhoria. |
| **Planej. da Próxima Release** | Elicitação e Descoberta | Planejamento Evolutivo | Mapeamento de Evolução do Produto | Novas necessidades e adaptações captadas para a próxima versão do sistema. |
| **Planej. da Próxima Release** | Declaração | Especificação Ágil | Atualização de Épicos e User Stories | Novos épicos e histórias formalizados e alocados para a próxima versão. |
| **Planej. da Próxima Release** | Verificação e Validação | Validação de Prontidão | Verificação de Prontidão (DEEP) | Backlog validado contra os critérios DEEP assegurando prontidão para a próxima fase. |

---

## Histórico de Versões

| Versão | Data | Descrição | Autor(es/as) |
| :---: | :---: | :--- | :--- |
| 1.0 | 04/09/2026 | Iniciação do documento | [Thiago Gomes](https://github.com/thgomxs) |
| 2.0 | 04/09/2026 | Preenchimento tópico 5 e revisão textual | [Rodrigo Barbosa](https://github.com/RodrigoCBarbosa) |