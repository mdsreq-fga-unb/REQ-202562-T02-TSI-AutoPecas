# Back-end

Aplique também o [AGENTS.md geral](../AGENTS.md). Use Python 3.13 e uv; comandos
ficam no [README desta área](README.md) e configurações no [pyproject.toml](pyproject.toml).

- Preserve as camadas `routers` -> `services` -> `repositories` e os contratos em
  `schemas`. Modelos de persistência ficam em `models`; um router não acessa o banco diretamente.
- Teste regras nos serviços e contratos HTTP com pytest/TestClient. Dados e
  dependências externos devem ser isolados; não use o banco de produção em testes.
- Use `Decimal` para valores monetários e inteiros para quantidades, conforme os
  padrões existentes. Não invente políticas de duplicidade, estoque negativo ou
  permissões ausentes nos critérios da US.
- Escritas que afetem saldo precisam preservar atomicidade e idempotência previstas
  nos requisitos. Teste falhas, repetição e concorrência quando pertinentes à regra.
- Alterações de banco devem ter migrações versionadas em `migrations/`. A ferramenta
  ainda será definida na primeira história de persistência; não há ORM adotado implicitamente.
- Preserve CORS e configuração por ambiente. `/health` confirma a aplicação,
  não a conexão com o banco nem a disponibilidade de uma funcionalidade do MVP.

Consulte [testes no FastAPI](https://fastapi.tiangolo.com/tutorial/testing/) quando
necessário. Para SQL, modelo ou migrações, selecione as [referências PostgreSQL da Supabase](https://github.com/supabase/agent-skills/blob/32912161e2732c3e5001c6811a76c1f8308ed0da/skills/supabase-postgres-best-practices/SKILL.md).
Essas referências não ampliam o MVP com autenticação ou outros serviços não selecionados.
