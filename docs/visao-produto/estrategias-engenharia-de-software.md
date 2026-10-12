# Estratégias de engenharia de software

## 4 Estratégias de engenharia de software

A estratégia considera o porte da equipe, o prazo semestral, o contato com o proprietário da TSI Peças e a necessidade de validar gradualmente o cadastro de peças e o controle do estoque.

### 4.1 Estratégia priorizada

- **Abordagem:** ágil.
- **Ciclo de vida:** iterativo e incremental.
- **Processo adotado:** combinação adaptada de Scrum e XP.

### 4.2 Quadro comparativo

| Aspecto               | OpenUP                                                                                                    | Combinação adaptada de Scrum e XP                                                                                                                                                                                        |
| --------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Natureza              | Processo leve, iterativo e incremental, derivado do Processo Unificado.                                   | **Scrum:** framework de gestão do trabalho. **XP:** metodologia ágil de desenvolvimento; a equipe adotará apenas as práticas técnicas selecionadas.                                                                      |
| Organização           | Concepção, elaboração, construção e transição, com iterações em cada fase.                                | **Scrum:** sprints de 14 dias, metas, planejamento, acompanhamento, revisão e retrospectiva; Sprint 0 preparatória excepcional. **XP:** incrementos testados e integrados com frequência.                                |
| Requisitos            | Visão, casos de uso ou histórias e requisitos técnicos detalhados progressivamente, com atenção a riscos. | **Scrum:** Product Backlog ordenado pelo Product Owner e refinado conforme o feedback. **XP:** histórias e critérios de aceitação esclarecidos perto da implementação.                                                   |
| Validação e mudanças  | Demonstrações e revisões nas iterações permitem incorporar mudanças.                                      | **Scrum:** Sprint Review inspeciona o incremento e ajusta o backlog. **XP:** testes automatizados dão retorno rápido sobre o código; testes de aceitação com o cliente verificam o atendimento aos critérios definidos.                                                                         |
| Qualidade técnica     | Orientação à arquitetura, aos riscos e à integração de versões testadas.                                  | **Scrum:** Definition of Done (DoD) explicita critérios comuns de conclusão. **XP:** padrão de codificação, TDD, integração contínua, refatoração, propriedade coletiva, design simples e testes de aceitação com o cliente; relatórios de cobertura apoiam a verificação da qualidade. Programação em pares não será adotada. |
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

- **Product Backlog:** lista ordenada do trabalho necessário ao produto, mantida pelo Product Owner e centralizada no GitHub Issues. Cada issue registra o item, seus critérios de aceitação e as informações de acompanhamento; o GitHub Projects organiza essas mesmas issues para acompanhar o trabalho das sprints.
- **Sprint Backlog:** Meta da Sprint, issues selecionadas e plano de execução, atualizados pelos Developers durante o ciclo e acompanhados no GitHub Projects.
- **Incremento:** resultado integrado e utilizável que atende à DoD.

A preparação dos itens, a conclusão técnica e a validação externa seguem o [processo de validação da equipe](interacao-equipe-cliente.md#73-processo-de-validacao):

1. **Definition of Ready (DoR) - verificação interna:** antes do início do desenvolvimento, a equipe verifica se as User Stories de uma funcionalidade estão escritas e claras o bastante para a sprint começar, ou seja, se os requisitos, as regras de negócio e os critérios de aceitação já definidos foram registrados e compreendidos pela equipe. Protótipos e regras de negócio críticas são validados com o cliente antes do início da implementação, reduzindo o risco de retrabalho.
2. **Definition of Done (DoD) - verificação interna:** checklist de qualidade técnica aplicado a cada funcionalidade antes de ser considerada concluída, abrangendo finalização e revisão do código, integração com o banco e testes internos sem bugs críticos. O deploy em ambiente de homologação, instância de pré-produção na Vercel (front-end) e no Render (back-end), conforme a stack definida em [Solução e Características](solucao-e-caracteristicas.md) é parte da DoD e antecede a validação externa; o deploy em produção, usado pelos usuários finais, ocorre somente após o aceite do cliente.
3. **Testes de aceitação com o cliente - validação externa:** ao final de cada sprint, o cliente valida se a entrega cumpre os critérios de aceitação previamente definidos e verificados no DoR, e se atende à necessidade real do negócio. Divergências identificadas resultam em ajustes no backlog da sprint seguinte.

### 4.5 XP

A equipe assume as práticas de XP e os critérios de qualidade associados abaixo para o desenvolvimento da aplicação. Planejá-los não comprova que foram executados; testes, PRs, relatórios e registros de aceitação deverão evidenciar sua aplicação.

| Prática / critério de qualidade | Aplicação adotada ou decisão | Evidência esperada |
| --- | --- | --- |
| **Padrão de codificação** | Definir e adotar na Sprint 2 convenções comuns de nomenclatura, formatação e organização do código. Aplicá-las ao desenvolvimento a partir da Sprint 3 e verificar sua observância nas revisões de PRs. | Padrão registrado no repositório e revisões de PRs que verifiquem sua aplicação. |
| **TDD** | Para cada nova regra de negócio testável do MVP, executar primeiro um teste que falha, implementar o mínimo para fazê-lo passar e refatorar com os testes aprovados. Iniciar no cadastro, edição e status de peças na Sprint 3; aplicar ao saldo e às entradas na Sprint 4 e às movimentações, vendas e cancelamentos na Sprint 5. Testes escritos apenas depois da implementação não caracterizam TDD. | Histórico de commits ou PRs que mostre o ciclo teste → implementação → refatoração, com testes aprovados. |
| **Integração contínua (CI)** | Configurar e validar o pipeline na Sprint 2. A partir da Sprint 3, executar os testes e o build da aplicação nos PRs e nas integrações à branch de desenvolvimento, integrar mudanças pequenas e corrigir falhas antes de acumular novas alterações. | Configuração e execuções do pipeline da aplicação; na Sprint 3, validação com os testes do catálogo. O workflow de publicação da documentação não comprova esta prática. |
| **Cobertura de testes - apoio à qualidade** | Gerar, a partir da Sprint 3, relatórios de cobertura dos testes automatizados e utilizá-los como evidência na verificação da DoD prevista no cronograma. Revisar as lacunas das regras críticas de cadastro e estoque em conjunto com os cenários testados. O cronograma exige o relatório, mas não estabelece percentual mínimo. | Relatórios de cobertura e registros da análise dos cenários cobertos e das lacunas identificadas. |
| **Refatoração** | Melhorar a estrutura do código sem mudar seu comportamento, apoiando-se nos testes. Refatorar durante os ciclos de TDD, tratar na Sprint 4 os débitos técnicos da sprint anterior e realizar a refatoração final antes da implantação, na Sprint 5. | PRs que identifiquem a melhoria estrutural e mostrem os testes aprovados. |
| **Propriedade coletiva** | Permitir que os desenvolvedores modifiquem qualquer parte do código, seguindo o padrão comum e compartilhando conhecimento por revisão de PRs. | Contribuições e revisões distribuídas entre integrantes. |
| **Design simples** | Implementar a solução suficiente para os requisitos atuais do MVP, sem antecipar funcionalidades ou abstrações sem necessidade. | Decisões técnicas justificadas pelo escopo e verificadas nas revisões de código. |
| **Testes de aceitação com o cliente** | Preparar cenários baseados nos critérios de aceitação e executá-los com Antônio Marcos na Sprint 5, usando dados de teste baseados em uma amostra dos dados da loja. Verificar os fluxos do MVP, incluindo cadastro → entrada → venda → cancelamento → saldo, registrar resultados e ajustes e obter o aceite antes do deploy em produção na Sprint 6. | Roteiros, resultados, ajustes e aceite registrados em atas ou issues, vinculados à entrega correspondente. |
| **Programação em pares - não adotada** | A equipe decidiu não se comprometer com sessões de desenvolvimento simultâneo por considerar inviável conciliá-las de forma consistente com a disponibilidade dos integrantes. Revisão de PRs será usada para compartilhar conhecimento, mas não equivale a programação em pares. | A decisão e sua justificativa ficam registradas neste documento; não haverá evidência de execução exigida. |

#### 4.5.1 Aplicação nos ciclos

O desenvolvimento das funcionalidades do MVP começa na **Sprint 3**, conforme o [cronograma corrigido](cronograma-e-entregas.md). A preparação técnica ocorre na Sprint 2; os testes de aceitação do MVP antecedem a implantação em produção.

- **Sprint 2 - preparação:** consolidar os requisitos e o backlog do MVP; definir e adotar o padrão de codificação; configurar e validar o pipeline de CI.
- **Sprint 3 - cadastro, edição e status (RF01, RF05 e RF06):** aplicar TDD às primeiras regras do catálogo; validar a CI com esses testes e gerar o relatório de cobertura previsto na verificação da DoD.
- **Sprint 4 - catálogo completo, entradas e saldo (RF02, RF03, RF04, RF08 e RF12):** desenvolver importação, aplicações por veículo, busca, entrada de peças e consulta de saldo; aplicar TDD às regras de saldo e entrada, integrar os componentes com testes e refatorar os débitos da sprint anterior. Ensaiar a carga inicial com uma amostra da planilha.
- **Sprint 5 - movimentações e vendas (RF09, RF10, RF14, RF15 e RF16):** aplicar TDD às regras de saída manual, ajuste, venda, baixa e reversão de estoque; implementar o filtro por período; executar testes de sistema e de aceitação com o proprietário; concluir a refatoração e preparar a implantação, o backup e seu teste de restauração.
- **Sprint 6 - implantação e estabilização:** implantar o MVP em produção após os testes e a validação com o proprietário; realizar a carga inicial de cadastros e saldos com conferência do estoque físico; verificar o backup, treinar o proprietário e corrigir problemas encontrados em uso real, mantendo testes de regressão e CI.

As evidências serão vinculadas às issues, aos PRs e às entregas. O cronograma descreve o planejamento dessas atividades; a execução será confirmada pelos registros de desenvolvimento.

## Versionamento

| Versão |    Data    | Descrição                                                                                                           | Autor(es/as)                               |
| :----: | :--------: | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
|  1.0   | 04/09/2026 | Iniciação do documento                                                                                              | [Thiago Gomes](https://github.com/thgomxs) |
|  1.1   | 07/09/2026 | Transposição do tópico 4 do PDF e revisão textual                                                                   | [Thiago Gomes](https://github.com/thgomxs) |
|  1.2   | 26/09/2026 | Correção da issue 6: elementos adotados de Scrum e XP, TDD, papéis e alinhamento à cadência do cronograma corrigido | [Thiago Gomes](https://github.com/thgomxs) |
|  1.3   | 12/10/2026 | Alinhamento da estratégia ao cronograma do MVP: papéis, GitHub Issues/Projects, DoR/DoD, práticas de XP e aplicação nas sprints | [Thiago Gomes](https://github.com/thgomxs) |
