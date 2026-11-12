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

A revisão `0002_part_updates` implementa o registro de tentativas idempotentes da
edição na US05 (Refs #31). Ela acrescenta `part_update_requests`, sem alterar ou
recriar as peças existentes. Aplique `upgrade head` antes de disponibilizar a
edição. Seu `downgrade` remove o histórico das tentativas de edição, portanto
elimina a proteção contra a repetição dessas tentativas anteriores.

A revisão `0003_part_status` implementa o status da US06 (Refs #32). Acrescenta
`parts.status`, obrigatório, com padrão `active` para peças novas e existentes e
restrição aos valores `active`/`inactive`. Preserva os demais dados. O downgrade
remove apenas a coluna e sua restrição, perdendo a informação de status; um novo
upgrade atribui `active` a todas as peças. Os testes usam SQLite descartável e o
SQL PostgreSQL foi inspecionado offline. Em 12/11/2026, a revisão também foi
aplicada ao PostgreSQL local do Docker, conforme o registro abaixo; nenhum banco
remoto foi alterado.

Para uma nova mudança, use `uv run alembic revision --autogenerate -m "descrição"`
e revise o SQL gerado antes de aplicá-lo. `uv run alembic upgrade head --sql`
permite inspecionar o SQL sem conectar ao banco. Nunca use `create_all` na aplicação.

`downgrade` da revisão inicial remove as tabelas e seus dados; reserve a reversão
para bancos descartáveis ou um procedimento planejado com backup. O Compose
aplica `upgrade head` apenas no PostgreSQL local. Supabase requer execução explícita
com a conexão de migração apropriada; a criação destes arquivos não o modifica.

## Migração nova com o Docker já em execução

A recarga do Uvicorn atualiza o código, mas não executa migrações. Se uma nova
coluna for usada antes de atualizar o banco, cadastro e catálogo podem retornar
503 mesmo com `/health` disponível. Na raiz do projeto, aplique e confira:

```bash
docker compose exec backend alembic upgrade head
docker compose exec backend alembic current
docker compose exec backend alembic check
```

Esses comandos usam o PostgreSQL local do Compose e preservam os registros.
Não é necessário remover contêineres ou volumes para aplicar a migração.

### Evidência da US06 — 12/11/2026 (Refs #32)

No ambiente local já em execução, `alembic current` indicava `0002_part_updates`
e a coluna `parts.status` estava ausente, causando 503 no catálogo. Após executar
os três comandos acima com `-T`, a revisão passou a `0003_part_status (head)` e
`alembic check` não encontrou diferenças. As 2 peças existentes permaneceram no
banco, ambas ativas; a consulta HTTP voltou a responder 200. Uma gravação temporária
via serviço também foi validada e desfeita por rollback, mantendo a contagem em 2.
Os detalhes e limites dessa verificação estão no
[registro da correção](../README.md#correção-do-ambiente-docker--12112026-refs-32).
