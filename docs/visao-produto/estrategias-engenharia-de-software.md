# Estratégias de engenharia de software

## 4 Estratégias de engenharia de software

A estratégia considera o porte da equipe, o prazo semestral, o contato com o proprietário da TSI Peças e a necessidade de validar gradualmente o cadastro de peças e o controle do estoque.

### 4.1 Estratégia priorizada

- **Abordagem:** ágil.
- **Ciclo de vida:** iterativo e incremental.
- **Processo adotado:** combinação adaptada de Scrum e XP.
- **Framework complementar de gestão do fluxo:** Kanban.

### 4.2 Quadro comparativo

| Aspecto               | OpenUP                                                                                                    | Combinação adaptada de Scrum e XP                                                                                                                                                                                        |
| --------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Natureza              | Processo leve, iterativo e incremental, derivado do Processo Unificado.                                   | **Scrum:** framework de gestão do trabalho. **XP:** metodologia ágil de desenvolvimento; a equipe adotará apenas as práticas técnicas selecionadas.                                                                      |
| Organização           | Concepção, elaboração, construção e transição, com iterações em cada fase.                                | **Scrum:** sprints de 14 dias, metas, planejamento, acompanhamento, revisão e retrospectiva; Sprint 0 preparatória excepcional. **XP:** incrementos testados e integrados com frequência.                                |
| Requisitos            | Visão, casos de uso ou histórias e requisitos técnicos detalhados progressivamente, com atenção a riscos. | **Scrum:** Product Backlog ordenado pelo Product Owner e refinado conforme o feedback. **XP:** histórias e critérios de aceitação esclarecidos perto da implementação.                                                   |
| Validação e mudanças  | Demonstrações e revisões nas iterações permitem incorporar mudanças.                                      | **Scrum:** Sprint Review inspeciona o incremento e ajusta o backlog. **XP:** testes automatizados dão retorno rápido sobre alterações no código.                                                                         |
| Qualidade técnica     | Orientação à arquitetura, aos riscos e à integração de versões testadas.                                  | **Scrum:** Definition of Done (DoD) explicita critérios comuns de conclusão. **XP:** TDD, integração contínua, refatoração, propriedade coletiva e design simples serão adotados; programação em pares não será adotada. |
| Adequação à TSI Peças | Alternativa viável para tratar riscos do catálogo e detalhar requisitos de modo progressivo.              | A experiência da equipe com Scrum favorece a organização das entregas; as práticas escolhidas de XP apoiam a confiabilidade das regras de estoque. Exigem disciplina e evidências de execução.                           |

### 4.3 Justificativa

- **Scrum:** o proprietário pode avaliar incrementos nas revisões e orientar prioridades. O backlog concentra primeiro as funções necessárias à operação da loja; mudanças de escopo dependem de validação de negócio.
- **XP:** TDD, integração contínua e refatoração ajudam a proteger as regras de cadastro, movimentação e baixa por venda contra regressões. Design simples evita antecipar funcionalidades ainda não necessárias.
- **Escolha da equipe:** OpenUP também é viável, mas a combinação selecionada corresponde à familiaridade da equipe com planejamento por sprints e ao compromisso de aplicar as práticas técnicas descritas abaixo.

### 4.4 Scrum

#### 4.4.1 Papéis e responsabilidades

- **Product Owner (João G. A. de Melo):** por decisão da equipe, responde pela ordenação do Product Backlog e pelo valor das entregas dentro do escopo aprovado. Sua autoridade abrange priorizar itens, esclarecer requisitos com a equipe e com o cliente e ajustar a ordem do trabalho sem ampliar o MVP. Antônio, proprietário e principal responsável pelo valor de negócio, decide sobre objetivos, regras da loja e mudanças de escopo. João também coordena prazos e entregas acadêmicas por causa do porte reduzido da equipe; essa função de coordenação não é um papel do Scrum.
- **Scrum Master (Luiz Henrique Tomaz Moreira):** facilita os eventos, ajuda a remover impedimentos e cuida da efetividade do processo. Como também desenvolve o backend, pode priorizar tarefas técnicas e reduzir o tempo de facilitação. A equipe reservará capacidade para essa responsabilidade no planejamento, redistribuirá tarefas diante de sobrecarga e avaliará o acúmulo nas retrospectivas.
- **Developers:** integrantes de requisitos, frontend, backend e testes selecionam o trabalho viável para cada sprint, definem como executá-lo e respondem conjuntamente pela qualidade do incremento.

#### 4.4.2 Eventos e duração das sprints

O [cronograma](cronograma-e-entregas.md) prevê **14 dias para cada Sprint 1 a 6**, de 11/09 a 03/12/2026. A Sprint 0, de 24/08 a 10/09, é uma preparação excepcional para descoberta do domínio e organização inicial; não estabelece a duração dos ciclos de desenvolvimento.

- **Sprint Planning:** definir a Meta da Sprint, selecionar itens do Product Backlog e planejar o trabalho conforme a capacidade da equipe.
- **Sprint Review:** demonstrar e inspecionar o incremento com Antônio Marcos ao fim da sprint, registrar seu feedback e atualizar o backlog.
- **Sprint Retrospective:** avaliar colaboração, processo e qualidade técnica antes da sprint seguinte, com ações de melhoria registradas.
- **Refinamento contínuo:** esclarecer e dividir itens do backlog com o Product Owner e o proprietário quando necessário; não é tratado como evento obrigatório do Scrum.

#### 4.4.3 Artefatos e critérios

- **Product Backlog:** lista ordenada do trabalho necessário ao produto, mantida pelo Product Owner e centralizada no GitHub Issues. Cada issue registra o item, seus critérios de aceitação e as informações de acompanhamento; o GitHub Projects apresenta essas mesmas issues no quadro Kanban.
- **Sprint Backlog:** Meta da Sprint, issues selecionadas e plano de execução, atualizados pelos Developers durante o ciclo e acompanhados no quadro do GitHub Projects.
- **Incremento:** resultado integrado e utilizável que atende à DoD.

A preparação dos itens, a conclusão técnica e a validação externa seguem o [processo de validação da equipe](interacao-equipe-cliente.md#73-processo-de-validacao):

1. **Definition of Ready (DoR) - verificação interna:** antes do início do desenvolvimento, a equipe verifica se as User Stories de uma funcionalidade estão escritas e claras o bastante para a sprint começar, ou seja, se os requisitos, as regras de negócio e os critérios de aceitação já definidos foram registrados e compreendidos pela equipe. Protótipos e regras de negócio críticas são validados com o cliente antes do início da implementação, reduzindo o risco de retrabalho.
2. **Definition of Done (DoD) - verificação interna:** checklist de qualidade técnica aplicado a cada funcionalidade antes de ser considerada concluída, abrangendo finalização e revisão do código, integração com o banco e testes internos sem bugs críticos. O deploy em ambiente de homologação, instância de pré-produção na Vercel (front-end) e no Render (back-end), conforme a stack definida em [Solução e Características](solucao-e-caracteristicas.md) é parte da DoD e antecede a validação externa; o deploy em produção, usado pelos usuários finais, ocorre somente após o aceite do cliente.
3. **Testes de aceitação com o cliente - validação externa:** ao final de cada sprint, o cliente valida se a entrega cumpre os critérios de aceitação previamente definidos e verificados no DoR, e se atende à necessidade real do negócio. Divergências identificadas resultam em ajustes no backlog da sprint seguinte.

### 4.5 XP

A equipe assume as práticas técnicas abaixo para o desenvolvimento da aplicação. Planejá-las não comprova que foram executadas; testes, PRs e execuções da CI deverão registrar sua aplicação.

| Prática                                | Aplicação adotada ou decisão                                                                                                                                                                                                                                                                                                                                               | Evidência esperada                                                                                                                 |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **TDD**                                | Em cada nova regra de negócio testável, escrever e executar primeiro um teste que falha, implementar o mínimo para fazê-lo passar e refatorar com os testes aprovados. Aplicar às regras de cadastro, saldo, movimentação e baixa por venda, incluindo os fluxos de integração previstos no cronograma. Testes criados apenas depois da implementação não contam como TDD. | Histórico de commits ou PRs que mostre o ciclo teste → implementação → refatoração, com testes aprovados.                          |
| **Integração contínua (CI)**           | Configurar na Sprint 2 o pipeline da aplicação para executar testes e build nos PRs e nas integrações à branch de desenvolvimento; integrar mudanças pequenas e corrigir falhas antes de acumular novas alterações.                                                                                                                                                        | Execuções do pipeline da aplicação e histórico de integrações. O workflow de publicação da documentação não comprova esta prática. |
| **Refatoração**                        | Melhorar a estrutura do código sem mudar seu comportamento, apoiando-se nos testes. Tratar os débitos identificados nas Sprints 4 e 5 e refatorar também durante os ciclos de TDD.                                                                                                                                                                                         | PRs que identifiquem a melhoria estrutural e mostrem os testes aprovados.                                                          |
| **Propriedade coletiva**               | Permitir que os desenvolvedores modifiquem qualquer parte do código, seguindo padrões comuns e compartilhando conhecimento por revisão de PRs.                                                                                                                                                                                                                             | Contribuições e revisões distribuídas entre integrantes.                                                                           |
| **Design simples**                     | Implementar a solução suficiente para os requisitos atuais, sem antecipar funcionalidades ou abstrações sem necessidade.                                                                                                                                                                                                                                                   | Decisões técnicas justificadas pelo escopo e verificadas nas revisões de código.                                                   |
| **Programação em pares - não adotada** | A equipe decidiu não se comprometer com sessões de desenvolvimento simultâneo por considerar inviável conciliá-las de forma consistente com a disponibilidade dos integrantes. Revisão de PRs será usada para compartilhar conhecimento, mas não equivale a programação em pares.                                                                                          | A decisão e sua justificativa ficam registradas neste documento; não haverá evidência de execução exigida.                         |

#### 4.5.1 Aplicação nos ciclos

- **Sprint 2:** configurar testes e CI da aplicação; iniciar o TDD nas primeiras regras de acesso e cadastro.
- **Sprint 3:** aplicar TDD às regras de saldo e movimentação; integrar catálogo e estoque com testes executados na CI.
- **Sprint 4:** aplicar TDD aos fluxos de venda e baixa de estoque; refatorar débitos identificados nas sprints anteriores.
- **Sprints 5 e 6:** manter integração e testes de regressão; refatorar antes da implantação e executar testes de sistema e aceitação com o cliente.

As evidências serão vinculadas às tarefas e aos PRs. O cronograma descreve o planejamento dessas atividades; a execução será confirmada pelos registros de desenvolvimento.

### 4.6 Kanban

O **GitHub Issues** centraliza o backlog, as tarefas, os critérios de aceitação e os registros de acompanhamento. O **GitHub Projects** organiza essas mesmas issues em um quadro Kanban, permitindo visualizar o estado do trabalho ao longo de cada sprint.

A equipe atualiza o quadro conforme o trabalho avança, identifica bloqueios, controla o trabalho em andamento conforme sua capacidade e acompanha o tempo de conclusão dos itens para melhorar o fluxo. A passagem de uma funcionalidade para concluída exige o atendimento à DoD. O Kanban complementa a organização por sprints do Scrum; as práticas técnicas adotadas de XP permanecem descritas na seção 4.5.

## Versionamento

| Versão |    Data    | Descrição                                                                                                           | Autor(es/as)                               |
| :----: | :--------: | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
|  1.0   | 04/09/2026 | Iniciação do documento                                                                                              | [Thiago Gomes](https://github.com/thgomxs) |
|  1.1   | 07/09/2026 | Transposição do tópico 4 do PDF e revisão textual                                                                   | [Thiago Gomes](https://github.com/thgomxs) |
|  1.2   | 26/09/2026 | Correção da issue 6: elementos adotados de Scrum e XP, TDD, papéis e alinhamento à cadência do cronograma corrigido | [Thiago Gomes](https://github.com/thgomxs) |
|  1.3   | 11/10/2026 | Melhora coerência da estratégia: responsabilidades definidas, GitHub Issues/Projects, DoR/DoD e Kanban              | [Thiago Gomes](https://github.com/thgomxs) |
