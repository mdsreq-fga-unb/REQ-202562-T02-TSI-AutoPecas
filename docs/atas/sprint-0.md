# Sprint 0

- **Data:** 2026-09-03
- **Tipo:** Reunião interna da equipe com apoio da monitora Yasmin — revisão do feedback do professor sobre a entrega inicial (documento de Visão de Produto e Projeto) e definição de arquitetura, processo e papéis da equipe
- **Participantes:** João, Luiz, Bruno, Thiago, Leonardo, Rodrigo (equipe); Yasmin (monitora) — sem a presença do cliente
- **Artefatos avaliados:** Documento de Visão de Produto e Projeto (entrega inicial, já comentado/corrigido pelo professor); projeto de referência de outro grupo ("Eco Fashion") fornecido pela monitoria; GitPages do projeto (em construção)

## Feedback (orientações da monitoria/professor sobre a entrega)

- O professor destacou em vermelho o item 1.5 (desafios do projeto) pedindo que a equipe avalie incluir desafios relacionados ao uso de hardware durante o desenvolvimento (ex.: leitor de código de barras), caso isso venha a ser utilizado.
- Comentário do professor no mapa/diagrama do produto: a declaração do problema precisa ser reformulada em uma frase mais simples, sem o conectivo "e".
- Recomendação forte de **não** combinar dois frameworks/processos ágeis diferentes na proposta (ex.: Scrum e Kanban simultaneamente) — o professor já repreendeu duramente outro grupo por isso em semestre anterior; a restrição vale tanto para o framework quanto para o processo.
- O professor exige rigor teórico de nomenclatura: usar o termo exato do processo escolhido (ex.: "lista de itens de trabalho" em vez de "backlog", caso o processo não seja formalmente ágil com esse termo).
- Hierarquia de abstração a respeitar na documentação: objetivo geral (alto nível) → objetivo específico → característica de produto (cada uma deve gerar 2 ou mais requisitos; nível intermediário, nem tão alto quanto o objetivo específico nem tão baixo quanto um requisito) → requisitos.
- O objetivo específico "automatizar o controle de estoque, contemplando registro de entrada e saída" foi apontado pelo professor como sendo, na verdade, uma característica de produto, não um objetivo específico; características de produto devem ser redigidas no padrão "o sistema deverá...".
- Recomendação de incluir, na tabela de características de produto, não só o ID do objetivo específico relacionado, mas também seu nome/descrição, para melhorar a rastreabilidade.
- No cronograma: incluir uma coluna de status (em andamento / não iniciado / concluído) e uma coluna de "entregas esperadas" com links diretos para os documentos gerados em cada fase (documento de visão, documento de requisitos, casos de uso etc.), além do link da reunião de validação com o cliente (ou prints da conversa completa, se a validação ocorrer por mensagem).
- Dicas de formatação/apresentação: evitar tema escuro nos documentos (o professor reclama); tabelas não podem ultrapassar a largura da página (sem rolagem horizontal); maior cautela nos objetivos específicos, características de produto e estratégia de engenharia de requisitos, pontos mais escrutinados pelo professor; usar a terminologia correta de cada técnica/atividade (brainstorming, listação, descoberta, análise, consenso etc.), de acordo com o que foi realmente executado.
- Feedback geral da monitoria: a entrega inicial da equipe teve poucas correções e os objetivos/tópicos foram praticamente todos aprovados; os destaques em amarelo no documento servem apenas para contextualização do professor, não indicam necessariamente pontos de correção.

## Decisões (planejamento interno da equipe)

- **Tecnologias:** front-end em React; back-end em Python com FastAPI (Django descartado pela curva de aprendizado alta; Flask considerado simples demais); banco de dados Supabase (Postgres); deploy do front-end na Vercel e do back-end no Render; versionamento via Git/GitHub.
- **Processo:** mantido o ciclo de vida ágil com XP; descartado o FDD; adotado Scrum como único framework (abandonada a ideia de usar Scrum + Kanban simultaneamente, por orientação direta da monitoria); daily assíncrona por mensagem (WhatsApp) em vez de reunião síncrona diária, adaptando a cerimônia do Scrum às restrições de tempo da equipe.
- **Sprints:** duração de 2 semanas, com reunião de revisão de sprint também a cada 2 semanas.
- **Composição da equipe:** mantida conforme o exemplo de referência (gerente de projeto, desenvolvedor front-end, desenvolvedor back-end, analista de QA e analista de requisitos); Thiago assume formalmente o papel de responsável pela parte de requisitos, mas todos participam dessa frente na prática.
- **Ferramentas de comunicação e gestão:** WhatsApp, Google Meet e GitHub (Slack e Jira descartados por falta de familiaridade da equipe); Thiago pesquisará a extensão "ZenHub" como possível alternativa ao Jira, integrada diretamente ao GitHub.
- **Métodos de elicitação e descoberta de requisitos:** entrevista estruturada e análise de documentos (as planilhas que o cliente já utiliza); descartados questionário e workshop de requisitos nesta fase.
- **Deadline da entrega:** vídeo de apresentação (projeto, visão de produto e GitPages) deve estar pronto até sábado, 17h; gravação do vídeo agendada para sábado, 17h, a confirmar disponibilidade do Leonardo.

## Change Requests (CR)

- **(CR-1)** Reclassificar o item "automatizar o controle de estoque, contemplando registro de entrada e saída" de objetivo específico para característica de produto, padronizando a redação como "o sistema deverá..." — impacto: corrige a hierarquia de abstração do documento de Visão de Produto — Must (ajuste solicitado pelo professor)
- **(CR-2)** Incluir coluna de status e coluna de "entregas esperadas" (com links para os documentos/casos de uso gerados) no cronograma do projeto — impacto: melhora a rastreabilidade exigida pelo professor — Should

## Ações

| Ação | Responsável | Prazo |
|---|---|---|
| Reformular a declaração do problema no mapa/Canvas, removendo o conectivo "e" e simplificando a frase | João | Até 2026-09-04 |
| Avaliar necessidade de desafios relacionados a hardware (ex.: leitor de código de barras) no item 1.5 e atualizar se aplicável | Equipe | Até 2026-09-04 |
| Reclassificar o objetivo específico de controle de estoque como característica de produto, com redação padronizada | Responsável pela seção de objetivos | Até 2026-09-04 |
| Atualizar a tabela de características de produto incluindo nome/descrição do objetivo específico relacionado | Equipe | Até 2026-09-04 |
| Atualizar cronograma com coluna de status e links de entregas esperadas | Bruno | Até 2026-09-04 |
| Finalizar o quadro comparativo de dois processos de desenvolvimento (item 4, pendente) | Leonardo | Até 2026-09-04 |
| Avançar e consolidar o item 5 (métodos de elicitação e descoberta de requisitos) | Rodrigo | Até 2026-09-04 |
| Avaliar a ferramenta ZenHub como alternativa ao Jira, integrada ao GitHub | Luiz | A definir |
| Subir estrutura inicial do GitPages do projeto | Thiago | Em andamento |
| Colocar todas as partes pendentes no Docs/GitPages para que o restante da equipe possa ajudar | Todos | Até 2026-09-04 |
| Elaborar o item 11 (lições aprendidas), antes ou junto da gravação do vídeo | Equipe | Até 2026-09-05 |
| Gravar vídeo de apresentação da entrega (projeto, visão de produto e GitPages) | Equipe | 2026-09-05 (sábado), até 17h |
