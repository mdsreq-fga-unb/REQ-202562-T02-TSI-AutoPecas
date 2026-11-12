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

O cadastro separa identificação obrigatória de referências e detalhes opcionais,
com a foto na coluna lateral em desktop e abaixo dos campos no celular. O botão
de sol/lua no cabeçalho alterna os temas sem descartar o formulário. O primeiro
acesso usa o tema claro, independentemente do tema do sistema. A preferência fica
no `localStorage`, na chave `tsi-theme`, neste navegador; valores inválidos usam
claro e o bloqueio do armazenamento não impede a alternância durante a sessão.

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

Na verificação de 11/11, o Vitest não concluiu a inicialização dos workers neste
Windows com Node 22; aquela execução usou Node 24 apenas para diagnóstico, sem
alterar a versão do projeto. A pendência local de Node 22 foi resolvida na
verificação de 12/11 registrada abaixo.
Também falta a matriz de Chrome, Firefox, Edge e Safari do RNF03. Esses resultados
não representam aceite do cliente nem conclusão integral da DoD.

## Verificação do layout e dos temas — 12/11/2026 (Refs #27)

- Os dois testes de preferência falharam primeiro pela ausência do botão de tema;
  após a implementação, a suíte completa passou com 9 testes.
- Comandos: `node node_modules/vitest/vitest.mjs run --pool=threads --maxWorkers=1`,
  `node node_modules/eslint/bin/eslint.js .`,
  `node node_modules/prettier/bin/prettier.cjs --check .` e
  `node node_modules/vite/bin/vite.js build`.
- Execução inicial com Node 24.15.0: testes, lint, formatação e build aprovados.
- Revalidação com Node **22.23.4**, exatamente como definido em `.nvmrc`: binário
  oficial extraído em pasta temporária e verificado contra `SHASUMS256.txt`, sem
  alterar o Node global. O diretório desse binário foi colocado no início do
  `PATH` apenas para os processos de validação.
- Com Node 22.23.4, `node node_modules/vitest/vitest.mjs run` passou com **9 testes
  em 3 arquivos**, usando a configuração padrão, sem ajustes de pool ou workers.
  ESLint e build também passaram com os comandos acima. O Prettier identificou
  formatação pendente em `README.md`, corrigida com
  `node node_modules/prettier/bin/prettier.cjs --write README.md`; a conferência
  completa `node node_modules/prettier/bin/prettier.cjs --check .` passou depois.
- Antes da divisão dos bundles registrada abaixo, o build emitia um aviso de
  JavaScript acima de 500 kB (507,17 kB, ou 159,93 kB com gzip). A matriz completa
  de navegadores continua pendente.
- Navegador integrado: temas claro e escuro inspecionados, preferência escura
  restaurada após recarregar e retorno ao claro conferido. Nas larguras de 360,
  390 e 414 px não houve transbordamento horizontal; botões com pelo menos 44×44 px.
- Os testes existentes de cadastro, obrigatoriedade, duplicidade e repetição
  idempotente passaram. Não foi repetido cadastro contra a API real nesta alteração.
  Estas evidências não representam aceite do cliente nem conclusão integral da DoD.

## Divisão dos bundles — 12/11/2026 (Refs #27)

O build usa `build.rolldownOptions.output.codeSplitting` em `vite.config.js`,
conforme a [documentação do Rolldown](https://rolldown.rs/reference/OutputOptions.codeSplitting).
React, React DOM e scheduler ficam juntos no grupo `react-vendor`; as demais
bibliotecas ficam em `ui-vendor`, separadas do código da aplicação. O limite de
aviso não foi aumentado e nenhuma dependência ou funcionalidade foi removida.

| JavaScript gerado        | Minificado |     Gzip |
| ------------------------ | ---------: | -------: |
| Aplicação                |   17,89 kB |  6,07 kB |
| React                    |  218,75 kB | 68,27 kB |
| Bibliotecas de interface |  269,91 kB | 86,53 kB |
| Runtime do empacotador   |    0,59 kB |  0,36 kB |

Todos os arquivos ficam abaixo de 500 kB. O total de JavaScript permanece
praticamente igual: esta mudança divide o carregamento em arquivos com cache
independente, sem adiar o carregamento das funcionalidades da tela inicial.

Validação com Node **22.23.4**, usando o binário temporário no `PATH`:

- `node node_modules/vitest/vitest.mjs run`: 9 testes aprovados, em 3 arquivos.
- `node node_modules/eslint/bin/eslint.js .`: aprovado.
- `node node_modules/prettier/bin/prettier.cjs --check .`: aprovado.
- `node node_modules/vite/bin/vite.js build`: aprovado, sem aviso de tamanho.
- `node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4173 --strictPort`:
  build de produção conferido no navegador integrado; carregamento, alternância
  de tema, persistência após recarregar e três mensagens de campos obrigatórios
  confirmados, sem erros ou avisos no console. Não houve envio à API real.

## Publicação

Para publicar na Vercel, use `frontend/` como **Root Directory** e configure
`VITE_API_BASE_URL` com a URL HTTPS da API no Render, antes do build. `vercel.json`
contém a configuração de build e o encaminhamento das rotas para a aplicação.
Configure também `ENABLE_EXPERIMENTAL_COREPACK=1` na Vercel para utilizar a versão
de pnpm fixada em `packageManager`, e selecione Node 22 nas configurações do projeto.
O Dockerfile é destinado ao ambiente de desenvolvimento do Compose.
