---
name: tsi-debugging
description: "Investigar um bug, teste quebrado ou falha de integração da TSI Peças antes de propor uma correção."
---

# Investigar uma falha

1. Reproduza o problema e registre o comportamento esperado, o observado e o menor
   cenário que o provoca. Leia o erro completo e as alterações relacionadas.
2. Localize a fronteira que falha: interface, requisição, API, persistência,
   contêiner ou geração do catálogo. Colete somente os dados necessários, sem expor segredos.
3. Formule uma hipótese de causa e faça uma verificação discriminante. Corrija
   a causa identificada em uma alteração pequena, em vez de acumular tentativas.
4. Quando a falha representar comportamento do código, crie primeiro um teste de
   regressão e siga TDD. Para ambiente ou configuração, valide a hipótese com os
   comandos apropriados. Diferencie indisponibilidade externa de defeito da aplicação.
5. Execute a reprodução original e os testes afetados. Relate a causa confirmada,
   a correção e as limitações; se a hipótese não for confirmada, diga o que falta.

No catálogo, confira a [fonte do campo](../../../docs/visao-produto/historico-de-evolucao.md#fontes-dos-dados)
antes de corrigir apresentação, issue, base ou coletor. Um status do Projects não
lido ou uma coleta indisponível não autoriza preencher dados por suposição.
Origem e adaptações: [registro de fontes](../../../tools/agents/sources.json).
