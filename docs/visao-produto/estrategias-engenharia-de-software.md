# Estratégias de engenharia de software

## 4 Estratégias de engenharia de software

A estratégia considera o porte reduzido da equipe, o prazo semestral, o acesso ao proprietário da TSI Peças e a necessidade de validar gradualmente o cadastro de peças e o controle de estoque.

### 4.1 Estratégia priorizada

- **Abordagem:** ágil.
- **Ciclo de vida:** iterativo e incremental.
- **Processo adotado:** combinação adaptada de Scrum e XP.

### 4.2 Quadro comparativo

| Aspecto                    | OpenUP                                                                                                                                                         | Combinação adaptada de Scrum e XP                                                                                                                                                                                                               |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Natureza                   | Processo leve derivado do UP, iterativo, incremental e adaptável. Abrange as principais disciplinas do desenvolvimento.                                        | **Scrum:** framework ágil de gerenciamento. **XP:** processo com foco em práticas técnicas. A combinação adapta elementos de ambos ao contexto da equipe.                                                                                       |
| Organização do trabalho    | Quatro fases: concepção, elaboração, construção e transição. Cada fase contém uma ou mais iterações e produz versões testadas e integradas.                    | **Scrum:** Product Backlog, planejamento, acompanhamento, revisão e retrospectiva. **XP:** desenvolvimento em pequenos incrementos com feedback técnico frequente.                                                                              |
| Organização dos requisitos | Visão, casos de uso ou histórias de usuário, requisitos técnicos e requisitos não funcionais.                                                                  | **Scrum:** Visão do Produto, Product Backlog, épicos, histórias, tarefas e Definition of Done. **XP:** histórias de usuário, critérios e testes de aceitação.                                                                                   |
| Elicitação e refinamento   | Elicitação concentrada inicialmente na concepção e na elaboração, com detalhamento progressivo. Requisitos de maior risco ou prioridade são tratados primeiro. | **Scrum:** refinamento contínuo do Product Backlog e priorização pelo Product Owner. **XP:** detalhes esclarecidos por conversas com o cliente próximo ao momento da implementação.                                                             |
| Validação e mudanças       | Revisões, demonstrações e testes contínuos. O feedback é incorporado nas iterações seguintes por um controle de mudanças leve.                                 | **Scrum:** inspeção do incremento na Sprint Review e atualização do backlog. **XP:** testes de aceitação e ciclos curtos de feedback apoiam mudanças frequentes.                                                                                |
| Qualidade técnica          | Orientação à arquitetura e aos riscos, com verificação contínua da qualidade e incrementos integrados.                                                         | **Scrum:** critérios comuns de conclusão na DoD, sem prescrever técnicas específicas de engenharia. **XP:** TDD, integração contínua, refatoração, design simples e propriedade coletiva do código; programação em pares foi analisada, mas não será adotada pela equipe.                       |
| Participação do cliente    | Requer colaboração direta e regular com os stakeholders.                                                                                                       | **Scrum:** o Product Owner ordena o trabalho e os stakeholders participam das revisões. **XP:** pressupõe envolvimento frequente do cliente para requisitos, prioridades e aceitação.                                                           |
| Forças                     | Documentação enxuta, equilíbrio entre disciplina e agilidade, atenção a riscos e adaptação a equipes pequenas.                                                 | **Scrum:** transparência, adaptação de prioridades e validação frequente. **XP:** feedback técnico rápido e testes que apoiam a evolução do produto.                                                                                            |
| Limitações                 | Pode oferecer pouca orientação a equipes inexperientes e ser insuficiente para sistemas críticos ou de grande escala.                                          | **Scrum:** depende da atuação efetiva do Product Owner. **XP:** exige envolvimento do cliente, disciplina e colaboração; a aplicação integral é mais difícil em equipes distribuídas.                                                           |
| Adequação à TSI Peças      | É uma alternativa viável por ser leve, favorecer comunicação direta e tratar riscos de arquitetura e requisitos progressivamente.                              | Ajusta-se melhor à experiência declarada da equipe: **Scrum** organiza prioridade e feedback; **XP** apoia a confiabilidade das regras de cadastro e estoque. As práticas selecionadas e suas adaptações devem ser explicitadas e evidenciadas. |

### 4.3 Justificativa

- **Scrum — feedback e escopo:** o contato com Antônio Marcos permite revisar entregas e ajustar prioridades. O backlog priorizará cadastro e movimentações de estoque, incluindo a baixa por venda. Leitor de código de barras e integração automática com o Mercado Livre permanecem fora do MVP.
- **XP — confiabilidade:** testes, integração frequente e refatoração apoiarão a evolução das regras de estoque. O design simples manterá o desenvolvimento concentrado nas necessidades atuais da loja.
- **Escolha da equipe:** a familiaridade da equipe com práticas de Scrum e XP favorece a aplicação da combinação adaptada no semestre. OpenUP também seria viável; a preferência considera a experiência da equipe e as práticas selecionadas para este projeto.

### 4.4 Scrum — organização do trabalho

#### 4.4.1 Papéis e responsabilidades

- **Product Owner — João G. A. de Melo:** responsável pelo valor do produto e pela ordenação do Product Backlog. A autoridade proposta abrange priorizar itens dentro do MVP acordado e detalhar requisitos com a equipe. Mudanças nos objetivos, no escopo do MVP e nas regras de negócio dependerão de validação de Antônio Marcos, proprietário e principal referência de negócio. A delegação deverá ser confirmada e registrada com o cliente; até isso ocorrer, as decisões de prioridade serão validadas com ele. A coordenação das entregas acadêmicas é uma função adicional de João, justificada pelo porte da equipe; não é um papel do Scrum.
- **Scrum Master — Luiz Henrique Tomaz Moreira:** apoiará a aplicação do processo, a efetividade da equipe e a remoção de impedimentos. O acúmulo com backend pode reduzir o tempo de facilitação. O planejamento reservará capacidade para essa responsabilidade e distribuirá tarefas técnicas conforme a disponibilidade; a retrospectiva avaliará sobrecargas.
- **Developers:** integrantes responsáveis pelo incremento, incluindo requisitos, frontend, backend e testes. Em diálogo com o PO, selecionarão o trabalho viável para cada ciclo e definirão sua execução, compartilhando a responsabilidade pela qualidade.

#### 4.4.2 Eventos e acompanhamento

Os ciclos de desenvolvimento terão entre **11 e 18 dias**, conforme as datas do [cronograma](cronograma-e-entregas.md). Essa duração variável e o acompanhamento assíncrono são adaptações da equipe: o Scrum apresentado no livro prevê sprints de duração fixa. O projeto utiliza elementos do framework, sem declarar sua adoção integral.

- **Sprint Planning:** no início do ciclo, definir a Meta da Sprint e selecionar itens e tarefas conforme prioridade e capacidade.
- **Acompanhamento diário assíncrono:** registrar no WhatsApp o progresso em direção à meta, os impedimentos e os ajustes no plano. Essa adaptação à disponibilidade acadêmica difere da Daily Scrum de 15 minutos prevista no guia.
- **Sprint Review:** ao final do ciclo, inspecionar o incremento com o proprietário e atualizar o backlog a partir do feedback. A revisão não se limita à homologação nem impede entregas antecipadas.
- **Sprint Retrospective:** após a revisão e antes do próximo planejamento, avaliar o trabalho e definir ações de melhoria com responsáveis.

#### 4.4.3 Artefatos e critérios

- **Product Backlog:** lista ordenada do trabalho necessário, vinculada à Meta do Produto; será mantida no Jira e referenciada na documentação.
- **Sprint Backlog:** Meta da Sprint, itens selecionados e plano de execução, atualizados pelos Developers durante o ciclo.
- **Incremento:** resultado utilizável e integrado aos anteriores, atendendo à Definition of Done (DoD), que estabelece os critérios comuns de qualidade para conclusão.

A Definition of Ready (DoR) será um acordo complementar sobre a preparação dos itens; não é um artefato obrigatório do Scrum nem um critério de conclusão do incremento. Os critérios de aceitação detalharão o comportamento esperado de cada item.

### 4.5 XP — práticas de desenvolvimento

As práticas selecionadas abaixo orientam o desenvolvimento do produto. A programação em pares foi analisada, mas a equipe optou por não utilizá-la nem assumir compromisso com sua execução, pois entendeu que não seria possível realizá-la de forma consistente diante da disponibilidade e da agenda dos integrantes. A previsão das demais práticas não comprova execução; sua aplicação será registrada em cada ciclo.

| Prática                            | Aplicação prevista                                                                                                                                                                                                                                   | Evidência esperada                                                                                                                              |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **TDD seletivo**                   | Nas regras críticas de cadastro e estoque: escrever e executar um teste que falha, implementar o mínimo para passar e refatorar. Priorizar saldo, entradas, saídas e baixa por venda, conforme regras validadas com o cliente.                       | Testes e registro do ciclo teste–implementação–refatoração nos commits ou PRs. Testes escritos somente após o código não caracterizam TDD.      |
| **Integração contínua (CI)**       | Integrar mudanças pequenas à branch principal, buscando integração diária nos dias de desenvolvimento. Automatizar testes e build no GitHub Actions em PRs e na branch principal, tratando falhas antes de acumular novas mudanças.                  | Histórico de integrações e execuções dos testes e do build da aplicação.                                                                        |
| **Refatoração**                    | Melhorar a estrutura do código durante a implementação, preservando o comportamento e mantendo os testes aprovados. Correção de bugs é uma atividade distinta.                                                                                       | PRs com a melhoria descrita e testes aprovados.                                                                                                 |
| **Propriedade coletiva**           | Permitir que os desenvolvedores evoluam qualquer parte do código, compartilhando conhecimento e seguindo padrões comuns de implementação e revisão.                                                                                                  | Contribuições e revisões distribuídas entre integrantes.                                                                                        |
| **Design simples**                 | Implementar a solução suficiente para os requisitos atuais, evitando funcionalidades futuras e abstrações sem necessidade.                                                                                                                           | Decisões técnicas relacionadas ao MVP e verificadas nas revisões.                                                                               |
| **Programação em pares — não adotada** | A equipe optou por não utilizar nem assumir compromisso com essa prática, pois entendeu que não seria possível realizá-la de forma consistente diante da disponibilidade e da agenda dos integrantes. | Não se aplica; a decisão e sua justificativa ficam registradas neste documento. |
| **Cliente presente — adaptação**   | Esclarecer regras e exemplos de uso com Antônio Marcos por WhatsApp ou encontros combinados, considerando sua rotina na loja.                                                                                                                        | Decisões e critérios de aceitação registrados junto aos itens do backlog.                                                                       |

#### 4.5.1 Aplicação nos ciclos de desenvolvimento

- **Preparação do código:** configurar testes, build, padrões de código e CI antes das primeiras integrações da aplicação. O workflow existente publica a documentação e não comprova a CI do produto.
- **Em cada ciclo com implementação:** incluir testes, integração e refatoração nas tarefas das funcionalidades; registrar nos PRs a aplicação de TDD e vincular as execuções da CI.
- **Critério técnico de conclusão:** código revisado, integrado, com testes e build aprovados e critérios de aceitação atendidos, conforme a DoD descrita em [Interação entre equipe e cliente](interacao-equipe-cliente.md#73-processo-de-validacao).

As evidências permitirão verificar a execução das práticas adotadas; testes posteriores à implementação e a publicação da documentação, isoladamente, não comprovam TDD nem CI da aplicação.

## Versionamento

| Versão |    Data    | Descrição                                                                                                                                          | Autor(es/as)                               |
| :----: | :--------: | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
|  1.0   | 04/09/2026 | Iniciação do documento                                                                                                                             | [Thiago Gomes](https://github.com/thgomxs) |
|  1.1   | 07/09/2026 | Transposição do tópico 4 do PDF e revisão textual                                                                                                  | [Thiago Gomes](https://github.com/thgomxs) |
|  1.2   | 12/09/2026 | Correção conceitual da abordagem, ciclo de vida e processo; detalhamento dos elementos adotados de Scrum e XP e justificativa da adaptação técnica | [Thiago Gomes](https://github.com/thgomxs) |
|  1.3   | 15/09/2026 | Revisão da issue #6: separação de Scrum e XP, responsabilidades, práticas adotadas e quadro comparativo baseado no livro da disciplina             | [Thiago Gomes](https://github.com/thgomxs) |
