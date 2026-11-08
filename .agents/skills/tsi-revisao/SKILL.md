---
name: tsi-revisao
description: "Revisar um diff ou PR da TSI Peças, conferindo critérios, regressões, rastreabilidade e evidências antes da entrega."
---

# Revisar alterações

Leia o diff e o pedido da tarefa. Se houver US, consulte seus critérios, as regras
aprovadas e os RNFs aplicáveis. Priorize falhas de comportamento, regressões,
integridade dos dados e incompatibilidade com o escopo.

- Confira as camadas e os padrões do [README](../../../README.md#padrões-de-codificação).
  Use as instruções específicas da área para as verificações técnicas.
- Relacione critérios aos testes. Para estoque e vendas, examine atomicidade,
  idempotência e efeitos de operações repetidas quando aplicáveis. Para interface,
  confira estados e tamanhos relevantes ao comportamento alterado.
- Execute as verificações pertinentes ou identifique as evidências que inspecionou.
  Diferencie testes executados, evidências consultadas e verificações pendentes.
  Leia lacunas de cobertura; não invente um percentual mínimo nem trate cobertura como prova de TDD.
- Confira a referência à issue no PR e as fontes do catálogo. Se formulário,
  coletor ou dados mudaram, execute as verificações da documentação.
- Uma revisão assistida não substitui outro integrante exigido pela
  [DoD](../../../docs/visao-produto/dor-e-dod.md#definition-of-done-dod), nem registra
  aceite do cliente. Informe implementação verificada e aceite pendente separadamente.

Apresente problemas com localização, impacto e ajuste recomendado, ordenados por
relevância. Se nenhum problema foi encontrado, informe o escopo efetivamente
revisado e as limitações, sem afirmar garantias que não verificou.
Origem e adaptações: [registro de fontes](../../../tools/agents/sources.json).
