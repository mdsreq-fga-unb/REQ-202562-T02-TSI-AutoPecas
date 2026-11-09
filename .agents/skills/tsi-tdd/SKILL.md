---
name: tsi-tdd
description: "Desenvolver ou corrigir comportamentos testáveis da TSI Peças com TDD, antes de escrever a implementação."
---

# TDD no projeto

Consulte a issue e seus critérios, a [DoR](../../../docs/visao-produto/dor-e-dod.md#definition-of-ready-dor)
e as instruções da área afetada. Defina um comportamento por ciclo, com entrada,
resultado esperado e exceções relevantes. Não amplie o escopo para preencher dúvidas.

1. Escreva o teste do próximo comportamento com pytest ou Vitest/Testing Library.
2. Execute-o e observe a falha esperada. Falha de instalação, erro de sintaxe ou
   indisponibilidade do ambiente não comprovam ausência do comportamento.
3. Implemente o mínimo necessário para aprová-lo. Execute novamente o teste e as
   verificações afetadas; preserve cenários anteriores.
4. Refatore mantendo os testes aprovados e avance para o próximo comportamento.

Para um bug, comece com a reprodução automatizada. Para código existente, preserve
as alterações da equipe e adicione a proteção necessária antes de refatorar; não
apague a implementação para simular TDD. Não reescreva histórico nem afirme que
houve teste primeiro sem ter observado essa execução.

No PR, relacione critérios aos testes e descreva as etapas e resultados que de fato
executou. Não é obrigatório publicar um commit com testes falhando. Relatórios de
cobertura complementam as evidências, mas não provam TDD nem aceite do cliente.
Para configuração ou ajuste puramente visual, use as verificações pertinentes à
mudança, sem forçar testes sem comportamento útil.

Os comandos e padrões ficam nos READMEs de [back-end](../../../backend/README.md)
e [front-end](../../../frontend/README.md). O fundamento é o [ciclo descrito por Martin Fowler](https://martinfowler.com/bliki/TestDrivenDevelopment.html);
a origem e as adaptações da skill estão no [registro de fontes](../../../tools/agents/sources.json).
