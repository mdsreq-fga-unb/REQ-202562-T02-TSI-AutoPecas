---
name: tsi-requisitos
description: "Atualizar requisitos, histórias, épicos ou rastreabilidade da TSI Peças preservando as fontes do catálogo automático."
---

# Manter requisitos e rastreabilidade

Use a [divisão de fontes por campo](../../../docs/visao-produto/historico-de-evolucao.md#fontes-dos-dados)
e as [instruções da documentação](../../../tools/docs/AGENTS.md). Identifique a
mudança aprovada, sua origem e os elementos atingidos antes de editar.

- Declaração, IDs, CP/OE, épico, RNFs, dependências aprovadas, notas de prioridade,
  recorte e sprint: atualize a [base versionada](../../../tools/docs/data/backlog.json).
- Narrativa, critérios e pontos a refinar: atualize a issue dentro do escopo
  autorizado, preservando as seções do [formulário](../../../.github/ISSUE_TEMPLATE/historia-de-usuario.yml).
- Objetivo do épico: issue do épico. Parentesco: sub-issue do GitHub, além do campo
  Épico. Status: Projects quando configurado, ou o campo da descrição da issue.
- Histórico: registre mudanças significativas em `history`, com data e origem.
  A automação não transforma cada edição da issue em uma entrada de evolução.

Preserve os IDs existentes e confira a relação RF/US, CP/épico, dependências e RNFs.
Uma mudança em RNFs ou dependências na issue não substitui o vínculo aprovado na
base. Divergências precisam de alinhamento; não elimine o alerta inventando uma
aprovação. Mudanças de escopo podem exigir ajustes no cronograma ou diagramas.

Para implementação vinculada, use o número da issue em PRs e commits (`Refs #27`),
não somente o ID US01. Não crie outra issue para uma US já identificada.
Não copie narrativa para o JSON, edite o snapshot ou mantenha uma segunda lista
completa do backlog. O catálogo é gerado durante o build do MkDocs.

Execute os testes do coletor, `backlog.py check`, build estrito e conferência de
links conforme o [guia local](../../../README.md#documentação-e-automação-do-backlog).
Quando houver necessidade de conferir issues atuais, execute `sync` antes de
`check`; a validação offline não consulta o GitHub. Informe divergências restantes.
Concluído exige status, registro da DoD e evidência; testes aprovados ou PR
integrado não autorizam declarar validação pelo cliente.
