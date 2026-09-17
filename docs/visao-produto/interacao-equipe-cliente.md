# Interação entre equipe e cliente

## 7 Interação entre equipe e cliente

### 7.1 Composição da equipe

A equipe de desenvolvimento é composta pelos seguintes membros. Todos os integrantes atuam também como Analistas de Requisitos, colaborando na elicitação, documentação e validação dos requisitos ao longo do projeto.

| Papel | Descrição | Responsável |
| --- | --- | --- |
| Product Owner / Coordenação acadêmica | Responde pelo valor do produto, ordena o Product Backlog e mantém o alinhamento com o cliente. Como função adicional, acompanha prazos e entregas da disciplina. | João G. A. de Melo |
| Desenvolvedor frontend | Responsável pela interface do usuário, pelo design e pela implementação das funcionalidades no lado do cliente. | Rodrigo Carvalho Barbosa |
| Scrum Master / Desenvolvedor backend | Facilita os eventos, apoia a remoção de impedimentos e a melhoria do processo. Também implementa a lógica de negócios, integração com banco de dados e APIs. | Luiz Henrique Tomaz Moreira |
| Desenvolvedor backend | Implementa a lógica de negócios, integração com banco de dados e APIs. | Bruno Ferreira Dornelas |
| Analista de QA | Garante a qualidade do produto, executando testes de funcionalidade, desempenho e usabilidade. | Leonardo da S. Lopes Júnior |
| Analista de requisitos | Elicita e detalha requisitos e critérios de aceitação com o cliente, apoiando o Product Owner na priorização e a equipe na validação. | Thiago Gomes Pereira de Abreu |

#### Responsabilidades no Scrum e funções acumuladas

- **Autoridade do Product Owner:** propõe-se delegar a João a ordenação dos itens dentro do MVP acordado e o detalhamento de requisitos com a equipe. Antônio Marcos mantém a decisão sobre objetivos de negócio, mudanças no escopo do MVP e regras da loja. A delegação depende de confirmação explícita do proprietário e registro em ata ou conversa contextualizada; até lá, João valida as prioridades com ele. O aceite geral do documento não comprova, por si só, essa delegação.
- **Coordenação acadêmica:** o porte da equipe justifica João acumular o acompanhamento dos prazos da disciplina. Essa função adicional não constitui papel do Scrum nem substitui a autonomia dos Developers, que selecionam o trabalho viável e elaboram o plano da sprint em diálogo com o PO.
- **Scrum Master e backend:** existe o risco de as tarefas técnicas de Luiz reduzirem o tempo de facilitação. No planejamento, a equipe reservará capacidade para eventos e impedimentos antes de distribuir o trabalho de backend. Sobrecargas serão tratadas pela redistribuição das tarefas e avaliadas na retrospectiva.

### 7.2 Comunicação

#### Ferramentas de comunicação

| Ferramenta | Finalidade |
| --- | --- |
| WhatsApp | Canal oficial para troca de mensagens rápidas e comunicação do dia a dia da equipe: avisos urgentes, links úteis e dúvidas pontuais que não exigem debate complexo. |
| Google Meet | Reuniões de revisão e planejamento de sprint; videoconferências com o cliente. |
| Jira | Gerenciamento do backlog, controle de tarefas e acompanhamento do progresso de cada sprint. |
| GitHub | Versionamento de código. |

#### Métodos e frequência de reuniões

- **Acompanhamento diário assíncrono:** nos dias de trabalho, a equipe registrará no WhatsApp o progresso em direção à Meta da Sprint, os impedimentos e os ajustes no plano. A substituição da Daily Scrum por mensagens é uma adaptação à agenda acadêmica.
- **Revisão de sprint:** ao final de cada ciclo de 11 a 18 dias, conforme o [cronograma](cronograma-e-entregas.md#61-scrum-organizacao-dos-ciclos), o grupo organizará uma videochamada no Google Meet com o cliente para inspecionar as soluções construídas e atualizar as prioridades. As sessões serão documentadas em vídeo ou atas vinculadas às entregas correspondentes.
- **Planejamento de sprint:** após encerrar a revisão e a retrospectiva do ciclo anterior, a equipe iniciará a próxima sprint definindo sua meta e selecionando os itens conforme prioridade, capacidade e feedback do cliente.
- **Retrospectiva:** fechando o período da sprint, o time fará uma avaliação interna, refletindo sobre as práticas adotadas, identificando gargalos técnicos ou de comunicação e definindo ações corretivas.

#### Frequência de interações com o cliente

- **Encontros ao final de cada ciclo:** a participação síncrona de Antônio Marcos será combinada conforme as datas do cronograma, concentrando a validação em momentos definidos e respeitando sua rotina na loja. A frequência acompanha os ciclos variáveis, sem compromisso quinzenal fixo.
- **Contato assíncrono e registro de evidências:** para resoluções rápidas no dia a dia, o WhatsApp será a ferramenta principal. Caso alguma aprovação ou mudança de escopo seja feita por este canal em vez de uma reunião formal, é obrigatório registrar a troca de mensagens na íntegra por meio de capturas de tela.

### 7.3 Processo de validação

O processo ocorre em três etapas, cobrindo tanto a qualidade interna do requisito/entrega quanto a confirmação de que o produto atende à necessidade real do cliente, reduzindo o esforço operacional da TSI Peças:

1. **Definition of Ready (DoR) — acordo complementar da equipe:** cada item selecionado deve ter objetivo, regras de negócio relevantes e critérios de aceitação suficientemente claros e testáveis para iniciar o trabalho. Dúvidas impeditivas devem ser esclarecidas com o cliente, mantendo o refinamento dos demais itens ao longo do projeto.
2. **Definition of Done (DoD) — compromisso do Scrum:** a funcionalidade será considerada concluída quando atender aos critérios de aceitação, estiver integrada à aplicação e ao banco quando aplicável, tiver testes automatizados e build aprovados na CI, revisão do PR por outro desenvolvedor e implantação verificada no ambiente de demonstração, sem defeitos críticos conhecidos. Esses critérios tornam verificável a contribuição das práticas técnicas do XP.
3. **Testes de aceitação com o cliente — validação externa:** nas revisões, o proprietário verificará o comportamento frente aos critérios de aceitação e à necessidade do negócio. O feedback atualizará o backlog, e o aceite será registrado junto à entrega.

## Versionamento

| Versão | Data | Descrição | Autor(es/as) |
| :----: | :--: | --- | --- |
| 1.0 | 04/09/2026 | Iniciação do documento | [Thiago Gomes](https://github.com/thgomxs) |
| 1.1 | 07/09/2026 | Preenchimento do tópico 7 e revisão textual | [Luiz Moreira](https://github.com/luizhtmoreira) |
| 1.2 | 07/09/2026 | Correção dos papéis da equipe e refinamento do processo de validação | [Luiz Moreira](https://github.com/luizhtmoreira) |
| 1.3 | 15/09/2026 | Issue #6: responsabilidades do PO e Scrum Master, delegação a confirmar, ciclos variáveis e critérios de conclusão com testes, CI e revisão | [Thiago Gomes](https://github.com/thgomxs) |
