# Documentação e catálogo

Aplique também o [AGENTS.md geral](../../AGENTS.md). O conteúdo publicado fica em
`docs/`, a partir da raiz; esta pasta reúne as ferramentas. Os comandos estão no
[README geral](../../README.md#documentação-e-automação-do-backlog).

- A propriedade de cada campo está em [Organização e atualização](../../docs/visao-produto/historico-de-evolucao.md#fontes-dos-dados).
  Preserve uma fonte por campo e a relação RF/US e CP/épico definida na base.
- `data/backlog.json` mantém o escopo aprovado. Narrativa, critérios e refinamento
  são lidos das issues. Não copie esses textos para o JSON nem os cole no trecho
  gerado do Markdown. O snapshot em `.cache/docs/backlog/github.json` é descartável.
- Ao ajustar um formulário, confira `scripts/backlog.py` e seus testes. Preserve os
  títulos reconhecidos, o ID da US e o RF de origem. Selecionar um épico no campo
  não cria o vínculo de sub-issue; esse parentesco também precisa estar correto.
- PRs e commits usam referências à issue GitHub, como `Refs #27`. O Projects tem
  prioridade para status somente quando sua leitura está configurada. O coletor
  não confirma sozinho o cumprimento da DoD nem a validação pelo cliente.
- A seção de evolução vem de `history`, na base; registre decisões significativas
  com data e origem. A publicação não cria um histórico de cada edição da issue.
- `check` valida o material local e não consulta o GitHub. `sync` coleta somente em
  leitura e deve anteceder a validação quando for necessário conferir dados remotos.
- Preserve URLs, âncoras e o marcador de geração. Mudanças de apresentação não
  devem alterar os textos ou vínculos dos requisitos. Confira o build e os links.
