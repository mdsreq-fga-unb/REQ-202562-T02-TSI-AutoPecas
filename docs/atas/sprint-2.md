# Sprint 2

- **Data:** 2026-09-30
- **Tipo:** Revisão com stakeholders — definição do valor de negócio dos requisitos, com classificação MoSCoW complementar, seguida de reunião interna de planejamento da equipe
- **Participantes:** Antônio Marcos (cliente/stakeholder); Equipe de requisitos (João, Luiz, Bruno, Thiago, Leonardo, Rodrigo) — presentes durante toda a sessão com o cliente; a parte final (planejamento interno) contou apenas com a equipe, sem o cliente
- **Artefatos avaliados:** Lista de requisitos funcionais (RF1 a RF41) e requisitos não funcionais (RNF1 a RNF6) do sistema de gestão de estoque, cadastrados no GitHub Pages/planilha de requisitos

## Metodologia da sessão

O foco principal da reunião foi o cliente atribuir um **valor de negócio** a cada requisito, respondendo a quatro perguntas:

1. **Essencialidade** — o sistema falha sem isso?
2. **Frequência** — uso rotineiro no dia a dia?
3. **Impacto da dor** — perde tempo/dinheiro sem isso?
4. **Urgência** — é indispensável já na primeira versão?

Cada resposta "sim" vale 1 ponto, resultando em uma nota de **0 a 4** por requisito. Uma quinta pergunta, de estrutura MoSCoW (Must/Should/Could/Won't), foi usada de forma complementar para indicar se o requisito deveria compor a primeira versão (MVP), e nem sempre é perfeitamente coerente com a nota de valor de negócio (algumas dessas divergências foram sinalizadas para revisão em reunião futura).

## Parte 1 — Sessão com o cliente

### Feedback (Stakeholder Requests) — valor de negócio definido pelo cliente, por bloco

**Gestão do catálogo de peças**

- RF1 (cadastrar peça): valor de negócio 4/4 (sim às quatro perguntas) — Must.
- RF2 (importar peças via planilha): valor de negócio 1/4 (não, não, não, sim — só a urgência foi respondida "sim") — ainda assim registrado como Must nesta rodada, gerando inconsistência a ser revista (o cliente já possui boa parte das peças cadastradas no Mercado Livre, por isso considerou a função pouco frequente apesar de indispensável).
- RF3 (associar peça a veículo): valor de negócio 4/4 — Must.
- RF4 (buscar peça): valor de negócio 4/4 — Must.
- RF5 (editar peça, exceto código do fabricante, que é imutável): valor de negócio 4/4 — Must.
- RF6 (alterar status da peça): valor de negócio 4/4 — Must.

**Movimentações e saldo de estoque**

- RF7 original (cadastro de fornecedor + registro de entrada de lote, combinados): valor de negócio 0/4 (não às quatro perguntas). O cliente apontou que o requisito mistura duas coisas distintas; a equipe decidiu desmembrá-lo: a parte de **cadastro de fornecedor** manteve valor de negócio 0/4 (Could/secundário), enquanto a parte de **registro de entrada de peça no estoque** foi reavaliada para 4/4 (sim às quatro perguntas) — Must.
- Registro de saída manual de peças: valor de negócio 4/4 — Must.
- Registro de ajuste de inventário: valor de negócio 4/4 — Must (tratado como complemento direto da entrada/saída).
- Registro de devolução de peça: valor de negócio 3/4 (sim, não, sim, sim — uso apenas ocasional) — agrupado com o bloco de consulta/histórico.
- Consultar saldo de peça, consultar histórico de movimentações e filtrar histórico por período (tratados como bloco único pelo cliente): valor de negócio 3/4 cada (sim, não, sim, sim) — classificados como adiáveis ("chute"/Could), por serem considerados mais complexos de implementar já na primeira versão.

**Integração com o Mercado Livre**

- RF14 (associar anúncios do Mercado Livre à peça): valor de negócio 3/4 (não falha sem, mas uso diário, perda de tempo e urgência marcados como "sim") — classificado como Must, por reaproveitar diretamente dados já existentes na base do Mercado Livre.

**Registro de vendas e recebimentos**

- RF15 a RF21 (tratados pelo cliente como um bloco único): valor de negócio 0/4 (não às quatro perguntas) — o cliente considerou que o controle manual atual via Mercado Livre já resolve o problema, tornando a automação não essencial nesta rodada.

**Estoque mínimo e confirmação de remessa**

- RF22, RF23 e RF24 (estoque mínimo e lista de compras, tratados em conjunto): valor de negócio aproximado de 2/4 (não essencial, não urgente, mas economizaria tempo) — classificados como adiáveis ("chute"/Could).
- RF25 (confirmar recebimento de remessa): valor de negócio 0/4 — Won't.

**Análise de desempenho e vendas**

- RF26 (relatório de movimentações do estoque, visualizado em tela): valor de negócio 4/4 (sim às quatro perguntas) — Must.
- RF27 (exportar relatório de vendas): valor de negócio 0/4 — Won't.
- RF28 (item mais vendido): valor de negócio 3/4 (sim, sim, sim, não — não é urgente) — classificado como adiável ("chute"/Could).
- RF29 e RF30 (desempenho por canal de venda / exportação em PDF): valor de negócio 0/4 cada — Won't.

**Financeiro, apoio fiscal e gestão de usuários**

- RF31 e RF32 (consulta de indicadores financeiros/capital de giro): valor de negócio aproximado de 2/4 (não essencial, não urgente, mas uso frequente e impacto no tempo) — classificados como adiáveis para o futuro ("chute"/Could).
- RF33 a RF37 (apoio à emissão fiscal e expedição): valor de negócio 0/4 cada — nenhum considerado essencial — Won't.
- RF38 a RF41 (gestão de acesso e usuários): valor de negócio 0/4 cada, pois o cliente trabalha sozinho na loja hoje — classificados como extras para um cenário futuro com funcionários ("chute"/Could).

**Requisitos não funcionais (RNF)** — mesma dinâmica de quatro perguntas, ainda com o cliente presente

- RNF1 (responsividade da interface em dispositivos móveis): valor de negócio 1/4 (não, sim, não, não) — Could, futuro.
- RNF2 (recuperação de estado e tolerância a falhas de conexão, sem perda ou duplicidade de dados em transações já confirmadas): valor de negócio 4/4 — Must.
- RNF3 (compatibilidade com múltiplos navegadores web — Chrome, Edge, Safari, Firefox): valor de negócio 4/4 — Must.
- RNF4 (desempenho de resposta do sistema — consultas em até 3s para 95% das requisições): valor de negócio 1/4 (não, sim, não, não) — Could, futuro.
- RNF5 (segurança/armazenamento de dados de usuários): valor de negócio 0/4 — tratado junto ao bloco de gestão de usuários (RF38–RF41), Could/futuro.
- RNF6 (tolerância a falhas de integração com a API do Mercado Livre): valor de negócio 0/4 — Could/futuro, já que a integração automática com o Mercado Livre ficou definida como entrega futura.

### Decisões

- RF1, RF3, RF4, RF5, RF6, registro de entrada de peça (desmembrado do RF7), saída manual, ajuste de inventário, RF14 e RF26 confirmados com valor de negócio alto (3 ou 4) e classificação Must — candidatos fortes ao MVP.
- RF2 permanece classificado como Must nesta rodada, apesar do valor de negócio baixo (1/4) — inconsistência identificada e marcada para revisão em reunião futura.
- RF7 será desmembrado formalmente em dois requisitos: cadastro de fornecedores (valor 0/4, Could/Won't) e registro de entrada de peças no estoque (valor 4/4, Must).
- Devolução de peça e o bloco de consulta/histórico (saldo, histórico, filtro) mantidos com valor 3/4, mas classificados como adiáveis (Could) por maior complexidade de implementação.
- Bloco de vendas e recebimentos (RF15–RF21), estoque mínimo/lista de compras (RF22–RF24), confirmação de remessa (RF25), exportação de relatórios (RF27, RF29, RF30), indicadores financeiros (RF31–RF32), apoio fiscal/expedição (RF33–RF37) e gestão de usuários (RF38–RF41) ficam com valor de negócio baixo (0 a 2) e fora do MVP nesta rodada.
- RF28 (item mais vendido) com valor 3/4, mas sem urgência — fica para depois (Could).
- RNF2 e RNF3 confirmados com valor de negócio 4/4 e Must; RNF1 e RNF4 com valor 1/4 e Could; RNF5 e RNF6 com valor 0/4 e Could/futuro.

### Change Requests (CR)

- **(CR-1)** Desmembrar o RF7 original em dois requisitos distintos — cadastro de fornecedor e registro de entrada de peça — impacto: maior precisão na nota de valor de negócio e na priorização do MVP — valores de negócio distintos (fornecedor: 0/4; entrada de peça: 4/4)

### Ações (sessão com o cliente)

| Ação | Responsável | Prazo |
|---|---|---|
| Atualizar a planilha/documento de requisitos com as notas de valor de negócio (0 a 4) e a classificação MoSCoW de cada requisito funcional e não funcional | Luiz | Antes da próxima reunião |
| Revisar a inconsistência entre o valor de negócio do RF2 (1/4) e sua classificação como Must, junto com o cliente, em reunião futura | Equipe | Próxima reunião |
| Revisar e confirmar a classificação do bloco RF15–RF21 em reunião futura com o cliente | Equipe | Próxima reunião |

## Parte 2 — Reunião interna da equipe (após o encerramento da sessão com o cliente, sem a presença de Antônio Marcos)

### Decisões

- Próximos passos definidos: (1) consolidar as notas de valor de negócio coletadas em uma tabela única; (2) montar uma matriz cruzando valor de negócio e esforço técnico (a equipe ficou em dúvida se o formato deveria ser 4x4 ou 2x2, a confirmar no material da disciplina); (3) a partir da matriz, definir os requisitos que comporão o MVP; (4) tratar os requisitos não funcionais pendentes; (5) agendar nova reunião com o cliente para validar o MVP, com a participação obrigatória de um monitor (Yasmin).
- A comunicação da equipe foi avaliada como deficiente; decisão de reforçar a comunicação assíncrona via WhatsApp e adotar um quadro visual (Kanban, usando Trello ou Notion) para acompanhar tarefas, reduzindo a dependência de reuniões síncronas (ex.: "dailies").
- Reunião de validação do MVP com o cliente agendada para a sexta-feira seguinte, às 20h30.

### Ações

| Ação | Responsável | Prazo |
|---|---|---|
| Consolidar as notas de valor de negócio em planilha única | Luiz | Até a próxima sexta-feira |
| Montar a matriz de valor de negócio x esforço técnico a partir da tabela consolidada | Equipe | Até a próxima sexta-feira |
| Definir o MVP a partir da matriz e tratar os requisitos não funcionais pendentes | Equipe | Até a próxima sexta-feira |
| Agendar e realizar reunião de validação do MVP com o cliente, com participação de um monitor | Equipe, Antônio Marcos e monitoria | Sexta-feira seguinte, 20h30 |
| Estruturar quadro Kanban (Trello/Notion) para organização das tarefas da equipe | Rodrigo | A definir |
