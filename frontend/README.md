# Front-end da TSI Peças

React com Vite e JavaScript. Use Node na versão de `.nvmrc` e pnpm na versão
indicada em `package.json`. Execute os comandos a partir de `frontend/`.

```bash
pnpm install --frozen-lockfile
cp .env.example .env
pnpm dev
```

No PowerShell, use `Copy-Item .env.example .env` para copiar o exemplo.
O front-end atende em <http://localhost:5173>. Execute também a API para conferir
a conexão. A página inicial implementa o cadastro manual da US01 (issue #27).

```bash
pnpm test
pnpm lint
pnpm format:check
pnpm build
```

Para gerar cobertura por linhas, funções e ramificações, execute
`pnpm test:coverage`. Os relatórios HTML e LCOV ficam em `coverage/`, são
publicados como artefatos da CI e ignorados pelo Git. Não há percentual mínimo
definido; revise as lacunas dos comportamentos exigidos pela história.

As chamadas HTTP ficam em `src/services/`. `VITE_API_BASE_URL` indica o endereço
público da API, acessível pelo navegador. Variáveis com prefixo `VITE_` são públicas;
credenciais do PostgreSQL/Supabase ficam exclusivamente no back-end.

## Arquitetura e identidade visual

- `src/theme/`: tema MUI compartilhado, com vermelho, preto e cinzas da marca,
  tipografia Inter servida localmente e controles com área de toque mínima de 44 px.
- `src/assets/`: logo original da TSI Peças, reutilizada de `docs/assets/`.
- `src/layouts/`: estrutura de navegação e adaptação para celular.
- `src/features/parts/`: formulário, seleção de foto e hook do fluxo de cadastro.
- `src/services/`: contratos HTTP, tradução de falhas e endereço da API.

Componentes cuidam da apresentação; o hook mantém o estado local e o serviço HTTP
envia os dados. A API valida novamente os campos e garante a unicidade no banco.
Não há estado global nem biblioteca de rotas enquanto existe apenas essa tela.

O cadastro exige código do fabricante, nome e categoria. Códigos equivalentes,
descrição técnica, localização e foto são opcionais. O fluxo mostra validação,
carregamento, conflito com a identificação da peça existente e confirmação de
sucesso. Limpar um formulário preenchido exige confirmação.

Cada tentativa recebe uma `Idempotency-Key`. Em falha de rede ou resposta incerta,
o formulário mantém os dados e repete a mesma chave; a API devolve o cadastro
original se ele já foi confirmado. Essa proteção vale enquanto a página permanece
aberta; não há rascunho persistido nem fila offline nesta entrega.

`partRegistration.test.jsx` cobre o fluxo observado pelo usuário com rede isolada.
Os testes antigos do cliente de `/health` continuam em `services/api.test.js`.

## Evidências da implementação da US01

Verificação local em 11/11/2026, vinculada à issue #27:

- `vitest run --pool=threads --maxWorkers=1`: 7 testes aprovados com Node 24.22.1.
  As cinco verificações iniciais do cadastro falharam na tela antiga antes da
  implementação e passaram após a substituição pelo formulário.
- `eslint .` e `prettier --check .`: aprovados.
- `vite build`: aprovado com Node 22.23.4, versão definida pelo projeto.
- Navegador integrado: cadastro real na API local, confirmação de sucesso e
  conflito entre código principal e equivalente conferidos com SQLite descartável.
  Layout inspecionado em desktop e em 390 px, sem rolagem horizontal nesse tamanho.

O Vitest não concluiu a inicialização dos workers neste Windows com Node 22;
a execução aprovada usou Node 24 apenas para diagnóstico, sem alterar a versão
do projeto. A execução dos testes no ambiente oficial permanece pendente.
Também falta a matriz de Chrome, Firefox, Edge e Safari do RNF03. Esses resultados
não representam aceite do cliente nem conclusão integral da DoD.

## Publicação

Para publicar na Vercel, use `frontend/` como **Root Directory** e configure
`VITE_API_BASE_URL` com a URL HTTPS da API no Render, antes do build. `vercel.json`
contém a configuração de build e o encaminhamento das rotas para a aplicação.
Configure também `ENABLE_EXPERIMENTAL_COREPACK=1` na Vercel para utilizar a versão
de pnpm fixada em `packageManager`, e selecione Node 22 nas configurações do projeto.
O Dockerfile é destinado ao ambiente de desenvolvimento do Compose.
