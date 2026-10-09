# Interação entre equipe e cliente

## 7 Interação entre equipe e cliente

### 7.1 Composição da equipe

A equipe de desenvolvimento é composta pelos seguintes membros. Todos os integrantes atuam também como Analistas de Requisitos, colaborando na elicitação, documentação e validação dos requisitos ao longo do projeto.

| Papel | Descrição | Responsável |
| --- | --- | --- |
| Gerente de projeto / Product Owner | Coordena prazos e entregas acadêmicas da equipe e responde pela ordenação do Product Backlog, priorizando itens e esclarecendo requisitos sem ampliar o escopo do MVP. A combinação é adotada pelo porte reduzido da equipe; Antônio, proprietário e principal responsável pelo valor de negócio, decide sobre objetivos, regras da loja e mudanças de escopo. | João G. A. de Melo |
| Desenvolvedor frontend | Responsável pela interface do usuário, pelo design e pela implementação das funcionalidades no lado do cliente. | Rodrigo Carvalho Barbosa |
| Desenvolvedor backend / Scrum Master | Implementa a lógica de negócios, integração com banco de dados e APIs, além de facilitar os eventos ágeis e ajudar a remover impedimentos. O acúmulo com as tarefas técnicas de desenvolvimento é um risco reconhecido pela equipe para a priorização da facilitação; capacidade para essa responsabilidade é reservada no planejamento e o acúmulo é avaliado nas retrospectivas. | Luiz Henrique Tomaz Moreira |
| Desenvolvedor backend | Implementa a lógica de negócios, integração com banco de dados e APIs. | Bruno Ferreira Dornelas |
| Analista de QA | Garante a qualidade do produto, executando testes de funcionalidade, desempenho e usabilidade. | Leonardo da S. Lopes Júnior |
| Analista de requisitos | Define os requisitos funcionais e não funcionais do sistema, prioriza o backlog junto ao cliente e garante que os critérios de aceitação sejam atendidos. | Thiago Gomes Pereira de Abreu |

### 7.2 Comunicação

#### Ferramentas de comunicação

| Ferramenta | Finalidade |
| --- | --- |
| WhatsApp | Canal oficial para troca de mensagens rápidas e comunicação do dia a dia da equipe: avisos urgentes, links úteis e dúvidas pontuais que não exigem debate complexo. |
| Google Meet | Reuniões de revisão e planejamento de sprint; videoconferências com o cliente. |
| GitHub Issues | Gerenciamento do backlog, controle de tarefas, critérios de aceitação de cada item e acompanhamento do progresso de cada sprint. |
| GitHub | Versionamento de código. |

#### Métodos e frequência de reuniões

- **Revisão de sprint:** ao final de cada [sprint de 14 dias](cronograma-e-entregas.md), o grupo organizará uma videochamada no Google Meet com o cliente para demonstrar as soluções construídas. É o momento dedicado para que o proprietário avalie o sistema e direcione as próximas necessidades. Todas essas sessões são documentadas em ata, registrada na [pasta de atas do repositório](../atas/index.md) e linkada à entrega correspondente, garantindo a rastreabilidade exigida na disciplina.
- **Planejamento de sprint:** imediatamente após a reunião com o cliente, os membros do grupo farão o mapeamento da próxima iteração, reavaliando o repositório de requisitos e selecionando as tarefas prioritárias para o ciclo seguinte, com base no último feedback recebido.
- **Retrospectiva:** fechando o período da sprint, o time fará uma avaliação interna, refletindo sobre as práticas adotadas, identificando gargalos técnicos ou de comunicação e definindo ações corretivas.

#### Frequência de interações com o cliente

- **Encontros quinzenais de homologação:** a participação oficial e síncrona de Antônio Marcos acontece no fechamento de cada sprint de 14 dias, concentrando a validação do software em momentos específicos e evitando consumir excessivamente o tempo que ele precisa dedicar ao atendimento presencial na loja.
- **Contato assíncrono e registro de evidências:** para resoluções rápidas no dia a dia, o WhatsApp será a ferramenta principal. Caso alguma aprovação ou mudança de escopo seja feita por este canal em vez de uma reunião formal, a equipe registra a decisão, a data, os participantes, a justificativa e a referência à evidência (print ou trecho da conversa), evitando expor dados pessoais ou informações desnecessárias na íntegra.

### 7.3 Processo de validação

O processo ocorre em três etapas, cobrindo tanto a qualidade interna do requisito/entrega quanto a confirmação de que o produto atende à necessidade real do cliente, reduzindo o esforço operacional da TSI Peças:

1. **Definition of Ready (DoR) — verificação interna:** o desenvolvimento de uma funcionalidade só inicia quando os requisitos, as regras de negócio (padrões de códigos e aplicação de autopeças) e os critérios de aceitação estiverem suficientemente claros e prontos para a sprint, registrados e compreendidos pela equipe. Protótipos e regras de negócio críticas são validados com o cliente antes do início da implementação, reduzindo o risco de retrabalho.
2. **Definition of Done (DoD) — verificação interna:** a funcionalidade é considerada concluída após finalização do código, integração com o banco e testes internos sem bugs críticos. O deploy no ambiente de homologação é parte da DoD e antecede a validação externa; o deploy em produção ocorre após o aceite do cliente.
3. **Testes de aceitação com o cliente — validação externa:** ao final de cada sprint, o cliente valida se a entrega cumpre os critérios de aceitação definidos no DoR e atende à necessidade real do negócio. Divergências identificadas resultam em ajustes no backlog da sprint seguinte.

### 7.4 Rastreabilidade das atas

Cada reunião de sprint (revisão com o cliente, validação assíncrona ou alinhamento interno da equipe) é registrada em ata, com feedback, decisões, Change Requests (CR) e ações, publicada na [pasta de atas do repositório](../atas/index.md) e linkada abaixo, garantindo a rastreabilidade exigida na disciplina.

| Sprint | Data | Tipo | Ata |
| --- | --- | --- | --- |
| Sprint 0 | 03/09/2026 | Reunião interna — revisão do feedback do professor sobre a entrega inicial | [Sprint 0](../atas/sprint-0.md) |
| Sprint 1 | 17/09/2026 | Entrevista com o cliente + planejamento interno da equipe | [Sprint 1](../atas/sprint-1.md) |
| Sprint 2 | 30/09/2026 | Definição do valor de negócio dos requisitos com o cliente | [Sprint 2](../atas/sprint-2.md) |
| Sprint 3 | 05/10/2026 | Validação de ajustes em requisitos e confirmação do MVP | [Sprint 3](../atas/sprint-3.md) |

> Histórico completo, incluindo as atas das próximas sprints à medida que forem realizadas, em [Atas](../atas/index.md).

## Versionamento

| Versão | Data | Descrição | Autor(es/as) |
| :----: | :--: | --- | --- |
| 1.0 | 04/09/2026 | Iniciação do documento | [Thiago Gomes](https://github.com/thgomxs) |
| 1.1 | 07/09/2026 | Preenchimento do tópico 7 e revisão textual | [Luiz Moreira](https://github.com/luizhtmoreira) |
| 1.2 | 07/09/2026 | Correção dos papéis da equipe e refinamento do processo de validação | [Luiz Moreira](https://github.com/luizhtmoreira) |
| 1.3 | 27/09/2026 | Correção da issue 9: justificativa da acumulação de papéis, alinhamento das sprints a 14 dias, uso do GitHub Issues como ferramenta única de backlog, registro de evidências do WhatsApp e distinção entre DoR/DoD e validação externa | [Luiz Moreira](https://github.com/luizhtmoreira) |
| 1.4 | 09/10/2026 | Adição da rastreabilidade das atas (tópico 7.4), linkando as atas de cada sprint | [Luiz Moreira](https://github.com/luizhtmoreira) |