# Sprint 3

- **Data:** 2026-10-05
- **Tipo:** Revisão com stakeholders (validação de ajustes em requisitos e confirmação do MVP)
- **Participantes:** Antônio Marcos (cliente/stakeholder); Equipe de requisitos (João, Luiz, Bruno, Thiago, Rodrigo)
- **Artefatos avaliados:** Subconjunto de requisitos funcionais alterados desde a última sessão de priorização (RF7, RF8, RF15, RF16, RF18, RF27 a RF31) e lista final de requisitos propostos para o MVP

## Feedback (Stakeholder Requests)

- RF7 (cadastro de fornecedores, já desmembrado do registro de entrada de peças na reunião anterior): confirmado como dispensável no MVP — sem ele o sistema ainda resolve o problema principal, uso ocasional, não gera perda relevante de tempo/dinheiro, pode esperar uma versão futura.
- RF8 (registro da entrada de um lote de peças no estoque): confirmado como essencial — sem ele o sistema não resolve o problema, uso diário, gera perda de tempo/dinheiro, necessário desde já.
- RF15 (registrar venda): confirmado como essencial, mesmas respostas do RF8 — necessário desde já.
- RF16 (cancelar venda): confirmado com as mesmas respostas do RF15 — necessário desde já.
- RF18 (gerenciar status de recebimento de uma venda — total/parcial, forma de pagamento): confirmado como dispensável no momento — o sistema resolve o problema sem ele, uso ocasional, não gera perda de tempo/dinheiro, pode esperar.
- RF27 (exportar relatório de movimentações e de vendas em PDF/Excel): confirmado como não necessário, sem uso diário, sem impacto e sem urgência.
- RF28 (registrar despesa operacional — ex.: aluguel, embalagens, frete de compra): o sistema resolve o problema sem ele, porém é de uso frequente; não gera perda de tempo/dinheiro e pode esperar.
- RF29 e RF30: mesmas respostas do RF28 — podem esperar.
- RF31: não foi alterado nesta reunião, mantendo a classificação já definida anteriormente.
- A equipe apresentou a lista final de requisitos selecionados para compor o MVP, revisando também o RF2 (importação de peças via planilha), cujo valor de negócio (1/4, apurado na reunião anterior pelas quatro perguntas) estava inconsistente com sua classificação como Must: o cliente reforçou que já possui cerca de 90% dos dados cadastrados em planilhas próprias e no Mercado Livre, defendendo a importância do reaproveitamento desses dados via importação; a equipe ajustou a resposta de frequência de uso do RF2 para "sim" (uso no dia a dia), elevando seu valor de negócio.
- Lista final confirmada para o MVP: RF1 (cadastrar peça), RF2 (importar peças via planilha), RF3 (associar veículo à peça), RF4 (buscar peça), RF5 (editar peça), RF6 (alterar status da peça), RF8 (registrar entrada de peça), RF9 (registrar saída manual), RF10 (registrar ajuste de inventário), RF12 (consultar saldo de peça), RF14 (associar anúncios do Mercado Livre à peça), RF15 (registrar venda) e RF16 (cancelar venda). O cliente não manifestou objeções a essa lista.

## Decisões

- RF7 (cadastro de fornecedores) mantém-se fora do MVP (Could/futuro); RF8 confirmado como Must.
- RF15 e RF16 confirmados como Must.
- RF18, RF27, RF28, RF29 e RF30 confirmados como dispensáveis no MVP (Could/Won't, futuro).
- RF2 reclassificado para uso diário, elevando seu valor de negócio e reforçando sua permanência no MVP.
- MVP definido com os seguintes requisitos funcionais: RF1, RF2, RF3, RF4, RF5, RF6, RF8, RF9, RF10, RF12, RF14, RF15 e RF16.

## Change Requests (CR)

- **(CR-1)** Reclassificar o RF2 (importação de peças via planilha) de prioridade baixa/ocasional para uso diário, dado o reaproveitamento de ~90% dos dados já cadastrados pelo cliente — impacto: reduz esforço de cadastro manual — Must

## Ações

| Ação | Responsável | Prazo |
|---|---|---|
| Registrar formalmente a lista final do MVP (RF1, RF2, RF3, RF4, RF5, RF6, RF8, RF9, RF10, RF12, RF14, RF15, RF16) no documento de requisitos | Equipe | A definir |
