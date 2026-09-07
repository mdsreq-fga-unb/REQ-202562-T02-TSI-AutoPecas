# Estratégias de engenharia de software

## 4 Estratégias de engenharia de software

A estratégia foi definida considerando o porte reduzido da equipe, o prazo semestral, o acesso direto ao proprietário da TSI Peças e a necessidade de validar gradualmente uma solução para cadastro de peças e controle de estoque.

### 4.1 Estratégia priorizada

- **Abordagem:** ágil.
- **Ciclo de vida:** ágil, iterativo e incremental.
- **Processo:** ScrumXP.

### 4.2 Quadro comparativo

| Característica | OpenUP | ScrumXP |
| --- | --- | --- |
| Abordagem geral | Processo leve, iterativo e incremental, com desenvolvimento orientado à arquitetura, aos riscos e ao valor para os stakeholders. | Combina o framework Scrum com práticas técnicas do XP, priorizando entregas frequentes, qualidade e feedback contínuo. |
| Foco em arquitetura | Dá ênfase à definição e à validação da arquitetura desde as primeiras fases, reduzindo riscos estruturais do projeto. | Adota design simples e evolução contínua da arquitetura, ajustando-a conforme surgem necessidades e aprendizados. |
| Estrutura do processo | Organiza o projeto nas fases de concepção, elaboração, construção e transição, cada uma contendo uma ou mais iterações. | Organiza o trabalho em sprints curtas, com planejamento, acompanhamento, revisão e retrospectiva a cada ciclo. |
| Flexibilidade de requisitos | Refina os requisitos progressivamente, priorizando risco e valor e incorporando o feedback nas iterações seguintes. | Mantém o Product Backlog em refinamento contínuo, com prioridades revistas conforme o feedback, os riscos e a capacidade da equipe. |
| Colaboração com o cliente | Promove colaboração direta e validação contínua com os stakeholders, por meio de revisões, demonstrações e testes. | Favorece a participação do cliente nas revisões de sprint e o esclarecimento frequente de requisitos durante o desenvolvimento. |
| Complexidade do processo | Oferece um conjunto mínimo e adaptável de atividades e artefatos, mantendo a organização por fases do Processo Unificado. | Combina uma estrutura gerencial simples com práticas técnicas que exigem disciplina e colaboração contínuas da equipe. |
| Qualidade técnica | A qualidade é tratada continuamente por meio de versões testadas e integradas, revisões e atenção à arquitetura. | Utiliza desenvolvimento orientado a testes (TDD), integração contínua, refatoração, design simples e programação em pares. |
| Documentação | Mantém documentação essencial, como visão, casos de uso ou histórias de usuário e requisitos técnicos, detalhada conforme a necessidade. | Prioriza backlog, critérios de aceitação e definição de concluído (DoD), com os registros necessários de decisões e testes. |
| Adequação à equipe | Adequado a equipes pequenas, com comunicação direta e interesse em combinar agilidade com orientação arquitetural. | Adequado a equipes pequenas e colaborativas, com disponibilidade para feedback frequente e aplicação das práticas do XP. |
| Adequação à TSI Peças | Também é viável para o MVP: a orientação a riscos e arquitetura pode apoiar a modelagem do catálogo e a substituição das planilhas. | Ajusta-se às sprints quinzenais, ao contato com o proprietário e à experiência da equipe, associando gestão do trabalho e qualidade técnica. |

### 4.3 Justificativa

De acordo com as características e os aspectos analisados do projeto, a equipe optou por utilizar ScrumXP pelos seguintes motivos.

#### Feedback direto e requisitos evolutivos

A equipe tem acesso presencial e por WhatsApp a Antônio Marcos, principal stakeholder, usuário administrador e homologador. As sprints de duas semanas permitem validar a linguagem do domínio de autopeças, o fluxo de trabalho e a simplicidade da interface. Revisões quinzenais e esclarecimentos pontuais respeitam a rotina do proprietário, que opera a loja sozinho, e reduzem interpretações incorretas e retrabalho.

#### Entrega prioritária de valor e controle do escopo

O Product Backlog permite priorizar o cadastro padronizado de peças e as movimentações de estoque, incluindo a baixa na venda, e desenvolver gradualmente as demais características do produto. O leitor de código de barras e a integração automática com o Mercado Livre permanecem como evoluções futuras. Assim, o feedback orienta ajustes de prioridade sem ampliar automaticamente o escopo do MVP.

#### Confiabilidade técnica

Como a dor central é a divergência de estoque, as regras de entrada, saída e venda devem ser protegidas por testes automatizados. TDD, integração contínua e refatoração ajudam a prevenir regressões; a programação em pares contribui para a revisão contínua dos trechos críticos. Essas práticas apoiam os testes internos e os critérios de conclusão das entregas.

#### Adequação ao porte, ao prazo e à experiência da equipe

A experiência prévia da equipe com ScrumXP favorece sua aplicação no prazo semestral. O OpenUP também seria adequado ao porte do projeto, pois admite documentação enxuta, adaptação e feedback frequente. A preferência pelo ScrumXP se fundamenta na familiaridade da equipe e na combinação entre sprints quinzenais e práticas técnicas do XP, mantendo a documentação e as evidências de validação exigidas pela disciplina.

A estratégia mantém, portanto, o ciclo de vida ágil, com refinamento e entregas incrementais, e combina o framework de gerenciamento Scrum com práticas técnicas do XP.

## Versionamento

| Versão | Data | Descrição | Autor(es/as) |
| :----: | :--: | --- | --- |
| 1.0 | 04/09/2026 | Iniciação do documento | [Thiago Gomes](https://github.com/thgomxs) |
| 1.1 | 07/09/2026 | Transposição do tópico 4 do PDF e revisão textual | [Thiago Gomes](https://github.com/thgomxs) |
