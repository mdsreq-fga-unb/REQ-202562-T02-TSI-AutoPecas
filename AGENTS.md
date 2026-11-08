# Orientações compartilhadas - TSI Peças

## Contexto e entrada

O repositório reúne React/Vite com pnpm, FastAPI com uv, PostgreSQL/Supabase e
MkDocs. Confira a branch, o estado do Git e o escopo solicitado antes de alterar
arquivos; preserve o trabalho existente. Os [padrões de desenvolvimento](README.md#padrões-de-codificação)
valem para pessoas e agentes. Identificadores do código ficam em inglês; interface,
documentação e mensagens de commit ficam em português.

Leia as instruções da área afetada, além deste arquivo:
- [Front-end](frontend/AGENTS.md).
- [Back-end](backend/AGENTS.md).
- [Documentação e backlog](tools/docs/AGENTS.md).

## Requisitos e fontes

Antes de implementar uma US, consulte sua issue, os critérios de aceitação, os RNFs
aplicáveis e a [DoR](docs/visao-produto/dor-e-dod.md#definition-of-ready-dor).
Pendências que alterem o comportamento precisam de esclarecimento; não transforme
suposições em decisões do cliente. Preserve os IDs existentes e o recorte do MVP.
A divisão por campo está em [Organização e atualização](docs/visao-produto/historico-de-evolucao.md#fontes-dos-dados).
A base aprovada é [backlog.json](tools/docs/data/backlog.json); narrativa e critérios
vêm das issues. A área gerada do catálogo e `.cache/` não são fontes de edição.

## Scrum e XP

- **Scrum:** seleção da sprint, inspeção do incremento e decisões de prioridade são
  da equipe e do Product Owner, conforme as [estratégias](docs/visao-produto/estrategias-engenharia-de-software.md).
  A aprovação da equipe e do cliente não pode ser declarada por uma ferramenta.
- **XP:** novas regras de negócio testáveis e correções seguem TDD: observar a falha
  correta, implementar o mínimo e refatorar com testes aprovados. Refatorações de
  código existente preservam o comportamento coberto. Testes posteriores não
  comprovam TDD. Programação em pares não foi adotada. Mudanças visuais e de
  configuração recebem as verificações adequadas, sem testes artificiais.

## Procedimentos reutilizáveis

As skills completas ficam em `.agents/skills/`; as entradas do Claude são geradas:
- [tsi-tdd](.agents/skills/tsi-tdd/SKILL.md): desenvolver e corrigir comportamentos testáveis.
- [tsi-debugging](.agents/skills/tsi-debugging/SKILL.md): investigar uma falha reproduzível.
- [tsi-requisitos](.agents/skills/tsi-requisitos/SKILL.md): alterar requisitos e seus vínculos.
- [tsi-revisao](.agents/skills/tsi-revisao/SKILL.md): revisar alterações e evidências de uma entrega.

## Entrega e evidências

Execute as verificações indicadas no README da área e pertinentes à alteração.
Informe os comandos executados, o resultado e o que não pôde ser verificado.
Cobertura ajuda a localizar lacunas; não prova TDD nem cumprimento da DoD.
Associe PRs e commits à issue pelo número GitHub, por exemplo `Refs #27`; esse
número é diferente de US01. Conclusão exige a [DoD](docs/visao-produto/dor-e-dod.md#definition-of-done-dod),
status e evidência registrados; PR integrado não equivale a aceite do cliente.
Commits, alterações remotas, push e deploy respeitam a autorização da tarefa.
Use os lockfiles, mantenha segredos fora do Git e não edite os adaptadores gerados.
