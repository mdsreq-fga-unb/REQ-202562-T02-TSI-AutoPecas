# Migrações do banco

As alterações de estrutura do PostgreSQL/Supabase são versionadas com Alembic e
revisadas junto à história correspondente. Execute em `backend/`, com
`DATABASE_URL` apontando para o ambiente desejado:

```bash
uv run alembic upgrade head
uv run alembic current
uv run alembic check
```

A revisão `0001_parts` implementa a US01 (Refs #27): peças, registro compartilhado
de códigos únicos e resultados de tentativas idempotentes. As três tabelas têm
identificador e datas UTC. Fotos são armazenadas junto à peça, na mesma transação.

Para uma nova mudança, use `uv run alembic revision --autogenerate -m "descrição"`
e revise o SQL gerado antes de aplicá-lo. `uv run alembic upgrade head --sql`
permite inspecionar o SQL sem conectar ao banco. Nunca use `create_all` na aplicação.

`downgrade` da revisão inicial remove as tabelas e seus dados; reserve a reversão
para bancos descartáveis ou um procedimento planejado com backup. O Compose
aplica `upgrade head` apenas no PostgreSQL local. Supabase requer execução explícita
com a conexão de migração apropriada; a criação destes arquivos não o modifica.
