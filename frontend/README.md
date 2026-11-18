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
O menu Catálogo permite selecionar peças e acessar a edição da US05 (issue #31).

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
- `src/features/parts/`: catálogo, campos compartilhados, seleção de foto e hooks
  dos fluxos de cadastro e edição.
- `src/services/`: contratos HTTP, tradução de falhas e endereço da API.

Componentes cuidam da apresentação; o hook mantém o estado local e o serviço HTTP
envia os dados. A API valida novamente os campos e garante a unicidade no banco.
A navegação entre cadastro, catálogo e edição usa estado local em `App`, sem
biblioteca de rotas. Recarregar a página volta à tela de cadastro.

O cadastro separa identificação obrigatória de referências e detalhes opcionais,
com a foto na coluna lateral em desktop e abaixo dos campos no celular. O botão
de sol/lua no cabeçalho alterna os temas sem descartar o formulário. O primeiro
acesso usa o tema claro, independentemente do tema do sistema. A preferência fica
no `localStorage`, na chave `tsi-theme`, neste navegador; valores inválidos usam
claro e o bloqueio do armazenamento não impede a alternância durante a sessão.

O cadastro exige código do fabricante, nome e categoria. Códigos equivalentes,
descrição técnica, localização e foto são opcionais. O fluxo mostra validação,
carregamento, conflito com a identificação da peça existente e confirmação de
sucesso. Limpar um formulário preenchido exige confirmação. Códigos equivalentes
são informados um por linha; vírgulas e ponto e vírgula pertencem ao código e não
são separadores. A edição apresenta cada equivalente em sua própria linha.

Antes de enviar um cadastro, os dados normalizados, a foto e a `Idempotency-Key`
são preservados no `localStorage`, em uma chave específica da URL da API. Após
recarregar ou reabrir a página no mesmo navegador e origem, o formulário recupera
a tentativa e mantém os campos bloqueados. O usuário escolhe **Tentar novamente**:
o envio reutiliza os mesmos dados e a mesma chave, e a API devolve o cadastro
original se ele já foi confirmado. Não há reenvio automático nem fila offline.

A tentativa é removida após sucesso ou rejeição definitiva; uma resposta incerta
a mantém disponível. Se o armazenamento estiver bloqueado ou sem espaço, a tela
informa o problema e não envia a requisição. Um cadastro pendente de outra aba não
é sobrescrito por uma nova tentativa. Rascunhos que ainda não foram enviados
continuam apenas em memória; limpar os dados do navegador remove a recuperação.

O catálogo pagina os registros em grupos de 20 e oferece a ação Editar. A US04
acrescenta os filtros descritos na seção de busca abaixo.
Também é possível editar uma peça imediatamente após cadastrá-la. Nome, categoria,
equivalentes, localização, descrição e foto podem ser alterados. O código do
fabricante é somente leitura. O PATCH envia apenas os campos alterados em relação
ao formulário carregado, preservando os demais campos e os equivalentes originais.
Foto não alterada não é reenviada; remover a foto envia `null`. Sem alterações,
Salvar permanece desabilitado. O cadastro e a edição compartilham `PartFormFields`
e `partForm.js`.

A edição confirma o descarte de alterações e preserva os dados em falhas. Enquanto
uma gravação está em andamento ou seu resultado é incerto, os campos e a navegação
ficam bloqueados para repetir a mesma tentativa. A saída do cadastro preenchido
para o catálogo também exige confirmação. Na edição, use Cancelar ou a confirmação
de sucesso para retornar ao catálogo; o menu permanece desabilitado nesse fluxo.
Durante o carregamento, Voltar ao catálogo cancela a consulta pendente.

`partRegistration.test.jsx` cobre o fluxo observado pelo usuário com rede isolada.
Os testes antigos do cliente de `/health` continuam em `services/api.test.js`.
`partEditing.test.jsx` cobre edição, obrigatoriedade, foto, falhas, descarte,
carregamento e paginação, sem depender da API remota.

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

## Ajustes de acessibilidade — 12/11/2026 (Refs #27)

- As mensagens de erro no tema escuro usam `#ff8a80` sobre `#1e2127`, com contraste
  calculado de **7,07:1** (antes: 4,38:1). A cor de erro do tema claro foi preservada.
- O campo de código do fabricante referencia o aviso de permanência e, quando
  aplicável, a mensagem de erro por `aria-describedby`. Ao corrigir o campo, o
  aviso continua associado e a descrição do erro deixa de ser referenciada.
- `src/components/SectionNumber.jsx` reúne a apresentação dos três indicadores,
  substituindo o estilo global e as definições repetidas na página de cadastro.
- O teste da descrição acessível falhou pela ausência do aviso antes da correção.
  Após a implementação e a extração do componente, a suíte completa passou com
  **10 testes em 3 arquivos**, usando Node **22.23.4** e a configuração padrão.
- Comandos aprovados: `node node_modules/vitest/vitest.mjs run`,
  `node node_modules/eslint/bin/eslint.js .`,
  `node node_modules/prettier/bin/prettier.cjs --check .` e
  `node node_modules/vite/bin/vite.js build`. O maior bundle permanece em 269,91 kB,
  sem aviso de tamanho. `git diff --check` também passou.
- No build de produção, foram conferidos a cor renderizada, o fundo das mensagens,
  os três indicadores e os dois textos referenciados pelo campo com erro. A inspeção
  do DOM não substitui testes com leitores de tela nem a matriz completa do RNF03.

## Evidências da implementação da US05 — 12/11/2026 (Refs #31)

Status local: implementação verificada; revisão por outro integrante e aceite do
cliente pendentes. O recorte foi confirmado pelo solicitante: apenas os campos
atuais da US01, sem aplicações por veículo nem dados fiscais. Consulte a
[issue #31](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/31)
para os critérios CA05.1, CA05.2 e CA05.3. Não houve alteração de status remoto.

- TDD: os cinco cenários iniciais de edição falharam pela ausência do acesso ao
  catálogo antes da implementação. O teste de proteção do cadastro ao navegar
  também falhou antes da confirmação de descarte ser adicionada. Testes de
  carregamento, paginação e envio de foto foram acrescentados na revisão; não
  constituem evidência retroativa de TDD.
- Node **22.23.4**, usando o binário oficial temporário no `PATH`, com dependências
  do lockfile e sem alterar o Node global.
- Comandos: `node node_modules/vitest/vitest.mjs run --coverage`,
  `node node_modules/eslint/bin/eslint.js .`,
  `node node_modules/prettier/bin/prettier.cjs --check .` e
  `node node_modules/vite/bin/vite.js build`.
- Resultado: **19 testes aprovados em 4 arquivos**, com configuração padrão de
  workers, ESLint, Prettier e build aprovados. Cobertura por linhas: **88,49%**;
  ramificações: **90,36%**. As lacunas incluem erro de leitura de arquivo,
  resposta JSON inválida e algumas ações do menu móvel; não há mínimo de cobertura.
- Maior bundle: **270,37 kB** minificado (**86,74 kB** gzip). Aplicação: **27,31 kB**;
  React: **218,75 kB**. Todos os arquivos JavaScript continuam abaixo de 500 kB,
  sem aumentar o limite do aviso ou adicionar dependências.
- Navegador integrado com API real e SQLite descartável: cadastro, edição,
  obrigatoriedade, retorno ao catálogo e reabertura dos dados persistidos conferidos.
  Temas claro e escuro inspecionados; edição sem transbordamento horizontal em
  360, 390 e 414 px, com controles de pelo menos 44×44 px em 360 px.
- Um aviso de propriedade `alignItems` no DOM foi corrigido usando `sx` no estado
  de carregamento. Após recarregar e reabrir a edição, não surgiram novos avisos
  ou erros no console. `git diff --check` aprovado.
- Permanecem pendentes a matriz completa de navegadores do RNF03 e testes com
  leitores de tela. Rascunhos não persistem após fechar ou recarregar a página.

### Revisão da US05 — 12/11/2026 (Refs #31)

- Revisados os arquivos alterados e novos, contratos HTTP, migração, critérios
  CA05.1–CA05.3 e padrões dos AGENTS/READMEs. Mantidos MUI, camadas, código em inglês,
  interface em português, lockfiles e o recorte autorizado.
- Corrigido o reenvio de campos não editados no PATCH, que podia sobrescrever
  mudanças em outros campos e reinterpretar equivalentes com separadores. O botão
  Salvar não envia uma edição vazia; desfazer as mudanças também remove o estado
  de formulário alterado.
- Corrigida a ausência de retorno durante uma consulta lenta da peça. A saída
  agora aborta a consulta ao desmontar a tela, sem aguardar seu timeout.
- TDD: os testes de envio parcial, preservação de equivalentes e formulário sem
  mudanças falharam antes da correção; o teste de saída durante carregamento
  também falhou pela ausência do botão. Todos passaram após os ajustes.
- Revalidação com **Node 22.23.4**: `node node_modules/vitest/vitest.mjs run --coverage`
  aprovou **22 testes em 4 arquivos**, com configuração padrão de workers.
  `node node_modules/eslint/bin/eslint.js .`,
  `node node_modules/prettier/bin/prettier.cjs --check .` e
  `node node_modules/vite/bin/vite.js build` aprovados. `git diff --check` aprovado.
- Maior bundle mantido em **270,37 kB**; aplicação em **27,42 kB**. Cobertura de
  linhas: **88,44%**; ramificações: **90,80%**. Nenhuma dependência adicionada.
- A inspeção visual registrada acima foi consultada; não foi repetida nesta
  revisão. Os estados alterados foram verificados com Testing Library. A matriz
  de navegadores, leitores de tela e aceite do cliente continuam pendentes.

## Status da peça — US06 (Refs #32)

A regra adotada para a US06 segue o [PR #63](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/63):
a peça inativa permanece visível no catálogo e nas buscas, identificada como
inativa. A inativação preserva o cadastro, o saldo e os registros existentes,
mas impede novas movimentações de estoque e vendas enquanto a peça estiver
inativa. A reativação libera novamente essas operações.

A interface atual implementa a alternância de status, o indicador e a edição
cadastral de peças ativas e inativas. Peças novas e existentes começam ativas.
Como os fluxos de estoque e vendas ainda não foram implementados, seus bloqueios
serão integrados quando esses fluxos forem adicionados, com validação obrigatória
na API e apresentação do motivo na interface. A preservação do saldo será testada
quando o módulo de estoque existir.

Alinhamento de escopo registrado em 12/11/2026. Os critérios de alternância estão
na [issue #32](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/32),
cujo texto de refinamento ainda aguarda atualização para refletir essa regra.

O catálogo oferece Ativar/Inativar com confirmação MUI. `PartStatusBadge` é
compartilhado pelo catálogo e pela edição. `usePartStatusChange` envia apenas o
status desejado no PATCH existente, com uma chave idempotente por tentativa.
Durante o envio ou em resultado incerto, o diálogo impede fechamento e permite
repetir a mesma tentativa. A proteção permanece enquanto a página está aberta;
não há fila offline nem persistência da tentativa ao fechar a aba.

### Evidências — 12/11/2026

Status local: implementação verificada; revisão por outro integrante, matriz de
navegadores do RNF03, leitores de tela e aceite do cliente pendentes.

- TDD: quatro cenários de status falharam pela ausência das ações e do indicador
  antes da implementação. Depois passaram. A verificação de envio duplo e
  fechamento durante gravação foi acrescentada como regressão complementar.
- Node **22.23.4**, definido em `.nvmrc`, usando o binário oficial temporário no
  `PATH`, sem alterar a versão global ou os lockfiles.
- Comandos: `node node_modules/vitest/vitest.mjs run --coverage`,
  `node node_modules/eslint/bin/eslint.js .`,
  `node node_modules/prettier/bin/prettier.cjs --check .` e
  `node node_modules/vite/bin/vite.js build`.
- **27 testes aprovados em 5 arquivos**, com configuração padrão de workers.
  ESLint, Prettier e build aprovados. Maior bundle: **278,90 kB**; aplicação:
  **30,01 kB**; React: **218,75 kB**. Todos continuam abaixo de 500 kB.
  Cobertura de linhas: **89,34%**; ramificações: **91,03%**. As lacunas incluem
  o aviso ao fechar a aba e caminhos já existentes de foto, menu e resposta inválida.
- Navegador integrado e API local com SQLite descartável: cadastro ativo,
  inativação, abertura da edição inativa, reativação e persistência após recarregar
  conferidos. Temas claro e escuro inspecionados; confirmação em 360 px sem
  transbordamento horizontal, com botões de 46 px de altura.
- Removida a propriedade `disableEscapeKeyDown`, não suportada pela versão
  instalada do MUI. O controle de fechamento fica no `onClose`, coberto por teste.
  Após recarregar e reabrir o diálogo, não surgiram novos erros ou avisos no console.
- CA06.1 e CA06.2 cobertos pelo fluxo de inativação/reativação; o PATCH com apenas
  status preserva os campos do cadastro (CA06.3). Saldo ainda não existe no projeto;
  sua preservação depende de verificação quando o módulo de estoque for integrado.

### Revisão da US06 — 12/11/2026 (Refs #32)

- Revisados todos os arquivos alterados e novos, os componentes MUI, o hook de
  status, os contratos HTTP, os testes e a documentação conforme os AGENTS/READMEs.
  Não foram encontrados problemas adicionais que exigissem alteração de código.
  Preservados o recorte autorizado, as dependências e os lockfiles.
- Reexecutado `node node_modules/vitest/vitest.mjs run --coverage` com
  **Node 22.23.4** e configuração padrão: **27 testes aprovados em 5 arquivos**.
  Cobertura de linhas: **89,34%**; ramificações: **91,03%**, com as mesmas lacunas
  registradas acima. Esta revisão não acrescentou testes nem alterou o histórico TDD.
- Reexecutados `node node_modules/eslint/bin/eslint.js .`,
  `node node_modules/prettier/bin/prettier.cjs --check .` e
  `node node_modules/vite/bin/vite.js build`: aprovados. Maior bundle mantido em
  **278,90 kB**, aplicação em **30,01 kB**, sem aviso de tamanho.
  `git diff --check` também aprovado.
- A inspeção visual anterior em desktop/celular e nos dois temas foi consultada;
  não foi repetida nesta revisão, que não alterou a interface. Permanecem as
  pendências de navegadores, leitores de tela, saldo e aceite registradas acima.

### Falha de cadastro no Docker — 12/11/2026 (Refs #32)

As capturas enviadas pelo solicitante mostraram erro no catálogo e o formulário
preservado após falha de cadastro. A API local retornava 503 porque o PostgreSQL
ainda estava em `0002_part_updates`, sem a coluna `status` exigida pela US06.
Aplicar `0003_part_status` no Docker recuperou a consulta HTTP do catálogo
(200, total de 2 peças). Não foi necessária alteração na interface.

A gravação foi conferida pelo serviço no PostgreSQL local, com rollback para não
deixar dados de teste. O cadastro pelo navegador não foi repetido nesta correção;
o solicitante foi orientado a usar Tentar novamente na tentativa preservada.
Consulte o [diagnóstico e as evidências no back-end](../backend/README.md#correção-do-ambiente-docker--12112026-refs-32).
Os testes com Node 22.23.4 registrados acima pertencem à revisão anterior.

### Interface desatualizada no Docker — 12/11/2026 (Refs #32)

Após a correção da migração, o solicitante mostrou a edição sem o indicador de
status. Os arquivos montados em `/app/src` já continham `PartStatusBadge`, mas
`GET /src/features/parts/PartEditForm.jsx` no Vite retornava 200 com código antigo,
sem o componente. A atualização do navegador sozinha não corrigia essa diferença.

O serviço `frontend` em `compose.yaml` passou a usar `CHOKIDAR_USEPOLLING=true`
e `CHOKIDAR_INTERVAL=500`, permitindo detectar alterações em volumes do Docker
Desktop no Windows. A configuração vale apenas para o ambiente de desenvolvimento
do Compose; a consulta periódica dos arquivos tem um custo adicional de CPU.

- `docker compose config --quiet`: aprovado.
- `docker compose up -d --no-deps frontend`: recriou somente o front-end,
  mantendo o banco e a API em execução, sem alterar cadastros.
- `docker compose exec -T frontend node --version`: **v22.23.4**.
- Módulo temporário criado no host, carregado pelo Vite e alterado no host:
  a mesma URL passou a servir o novo conteúdo após 2 segundos, sem reiniciar.
  O arquivo de verificação foi removido ao final.
- Navegador integrado em `http://localhost:5173`: indicador Ativo e ação Inativar
  conferidos no catálogo; indicador Ativo conferido na edição da peça existente.
  Nenhum campo ou status foi alterado. Console sem erros ou avisos.

Esta correção altera configuração de desenvolvimento, não regras de negócio.
As suítes e o build da revisão anterior não foram repetidos; a configuração e a
detecção de mudanças foram verificadas diretamente no Docker com Node 22.

## Correções da revisão de US01 e US05 — 12/11/2026 (Refs #27, #31)

- **Equivalentes:** entrada e edição usam um código por linha, preservando vírgulas
  e ponto e vírgula que pertençam ao código. A regressão reproduziu o bloqueio ao
  adicionar outro equivalente antes da correção.
- **Recuperação de cadastro:** dados, foto e chave são preservados antes do POST e
  recuperados após recarregar a página. A retomada é manual e reutiliza exatamente
  o mesmo corpo e a mesma chave; após sucesso, a tentativa é removida. A proteção
  contra falhas de armazenamento impede enviar uma nova solicitação sem preservá-la
  e mantém bloqueados os campos de uma tentativa ainda incerta.
- **XP/TDD:** foram aplicadas as skills `tsi-tdd` e `tsi-revisao`. Cinco cenários novos
  foram observados falhando antes das correções: equivalentes, recuperação com
  foto/chave, saída antes da resposta, armazenamento indisponível e manutenção do
  bloqueio em uma repetição incerta. O cenário adicional de outra aba é uma
  verificação complementar, sem alegação de teste primeiro para ele.
- **Verificação:** suíte com 33 testes aprovada em Node 22.23.4, lint, formatação e
  build aprovados. A inspeção no Edge utilizou a interface real com escritas da API
  simuladas: recarga, restauração, ausência de reenvio automático, repetição com a
  mesma chave/corpo, limpeza após sucesso e edição dos equivalentes conferidos.
  Tela de recuperação em 390 px sem rolagem horizontal. Nenhuma gravação foi feita
  no banco existente durante essa inspeção.
- A persistência adicionada é para tentativas de **cadastro**; rascunhos ainda não
  enviados, edição e alteração de status não receberam recuperação após recarga
  nesta correção. A matriz de navegadores e o aceite do cliente continuam pendentes.

## Publicação

Para publicar na Vercel, use `frontend/` como **Root Directory** e configure
`VITE_API_BASE_URL` com a URL HTTPS da API no Render, antes do build. `vercel.json`
contém a configuração de build e o encaminhamento das rotas para a aplicação.
Configure também `ENABLE_EXPERIMENTAL_COREPACK=1` na Vercel para utilizar a versão
de pnpm fixada em `packageManager`, e selecione Node 22 nas configurações do projeto.
O Dockerfile é destinado ao ambiente de desenvolvimento do Compose.

## Aplicações por veículo — US03

O catálogo oferece a ação **Aplicações** para a peça selecionada. A tela mantém
MUI, a logo e os temas existentes, identifica a peça e permite associar marca,
modelo e um único ano de quatro dígitos. A lista apresenta 20 aplicações por
página; uma nova associação preserva as anteriores. Não há edição ou remoção de
aplicações neste incremento.

`VehicleApplicationsPage` apresenta formulário, paginação e estados de consulta;
`useVehicleAssociation` controla validação/envio e `pendingVehicleAssociation`
preserva tentativas. As chamadas HTTP permanecem em `src/services/parts.js`.
O ano segue como string no JSON para preservar sua representação exata.

A tentativa é salva no navegador antes do POST, separada por URL da API. Após
falha de conexão ou resposta incerta, campos e saída ficam bloqueados até repetir
a mesma tentativa. Recarregar recupera peça, campos e chave, sem envio automático.
Falha de armazenamento impede iniciar um envio sem preservação; erro definitivo
libera a correção. Dados ainda não enviados recebem confirmação de descarte ao
voltar ao catálogo, mas não persistem após fechar a aba. O servidor é a autoridade
para validação, duplicidade e idempotência.

### Evidências — 16/11/2026

Ciclos TDD em `src/vehicleApplications.test.jsx`, com falhas observadas antes de
implementar cada comportamento:

- Acesso à associação e envio: ação inexistente no catálogo.
- Obrigatoriedade/formato: ausência das mensagens de campo.
- Duplicidade: conflito sem tratamento e sem identificação da aplicação.
- Recuperação na mesma tela: ausência de repetição e dois POSTs no clique duplo.
- Recuperação após recarga e armazenamento indisponível: campos não restaurados
  e envio realizado sem preservação.
- Navegação, carregamento/erro e paginação: saída sem proteção, ausência do estado
  de consulta, erro não tratado e ausência dos controles de página.

Os **11 testes da US03** passaram após esses ciclos. A adaptação de um teste para
aguardar a animação de fechamento do diálogo MUI corrigiu a sincronização do
próprio teste, sem alteração adicional de comportamento.

Verificação com Node **22.23.4**, binário definido em `.nvmrc` no `PATH`, sem
alterar a instalação global ou os lockfiles:

```text
node node_modules/vitest/vitest.mjs run --coverage --maxWorkers=1 --testTimeout=20000
node node_modules/eslint/bin/eslint.js .
node node_modules/prettier/bin/prettier.cjs --check .
node node_modules/vite/bin/vite.js build
```

- Regressão completa: **44 testes aprovados em 6 arquivos**, cobertura de linhas
  **91,95%** e ramificações **91,74%**. Foram usados um worker e timeout de 20 s
  na máquina Windows; a configuração padrão da CI não foi alterada. Uma tentativa
  anterior não iniciou o worker e foi repetida; isso não foi contado como RED.
- Os arquivos temporários de comparações visuais em `.cache/` foram excluídos
  de ESLint/Prettier, preservando-os. Essa pasta já era ignorada pelo Git.
- ESLint, Prettier e build final aprovados. Maior bundle: **278,90 kB**;
  aplicação: **38,84 kB**, sem aviso de tamanho ou dependências novas.
- Navegador integrado com API real e PostgreSQL 17 descartável: dois anos
  associados, repetição com diferenças de caixa/espaços rejeitada, campos
  obrigatórios e intervalo de anos identificados, descarte confirmado e lista
  preservada após recarga. Não houve escrita no banco operacional.
- Temas claro e escuro inspecionados. Sem transbordamento horizontal em
  **360, 390 e 414 px**; inputs de **44 px**, botões de **46 px** e ícones de
  **44×44 px**. Console sem erros ou avisos durante essa inspeção. Capturas locais:
  `.cache/us03-desktop.jpg` e `.cache/us03-mobile.jpg`, na raiz do repositório.
- Recuperação de conexão/recarga foi validada por Testing Library com rede
  simulada e no serviço com PostgreSQL; não foi simulada queda de rede no navegador
  integrado. A inspeção de DOM não substitui leitores de tela ou a matriz completa
  de duas versões de Chrome, Firefox, Edge e Safari, que permanece pendente.

Status: implementação verificada localmente; revisão por outro integrante e aceite
do cliente pendentes. A nova migração precisa ser aplicada antes de usar a tela
contra um banco existente; veja os [contratos e testes PostgreSQL](../backend/README.md#aplicações-por-veículo--us03).

## Busca de peças — US04 (Refs #30)

O menu **Catálogo** oferece filtros por código principal ou equivalente, nome,
categoria, marca, modelo e ano. A tela reutiliza MUI, a logo e os temas existentes.
Digite ao menos um filtro e pressione **Buscar** ou Enter. **Limpar filtros**
retorna ao catálogo geral. Código/categoria/ano são exatos; nome/marca/modelo
aceitam trechos. Espaços nas extremidades e caixa são ignorados pela consulta.

Os campos em edição são separados dos filtros aplicados, exibidos acima dos
resultados. Alterar um campo não dispara uma busca nem muda os filtros da
paginação até confirmar. Cada busca começa na primeira página; rascunho, filtros
aplicados e página são preservados ao abrir edição/aplicações e voltar. Esse
estado dura a sessão da aplicação; não é persistido após recarregar a página.

A interface identifica busca vazia e ano inválido antes de chamar a API, informa
quando não há correspondência, preserva peças inativas com seu indicador e
permite repetir uma consulta que falhou. Requisições antigas são canceladas e
suas respostas atrasadas não substituem a pesquisa mais recente.

### TDD e evidências — 16/11/2026

- Primeiro, o teste de seis filtros falhou pela ausência dos campos; passou após
  integrar formulário e serviço HTTP. Os testes de busca vazia/ano inválido,
  ausência de resultado e limpeza falharam antes de cada comportamento ser
  implementado. Os quatro cenários iniciais ficaram verdes.
- Os dois testes de retorno da edição/aplicações falharam por perder o filtro,
  e o teste de rascunho/paginação falhou pela ausência da indicação dos filtros
  aplicados. O estado foi elevado para `App`, mantendo a mesma arquitetura de
  navegação. Depois, **9 testes da US04 aprovados**. Falha de conexão e resposta
  atrasada já estavam protegidas pelo fluxo reutilizado; seus testes são
  complementares, sem alegação retroativa de TDD.
- Node **22.23.4**: `node node_modules/vitest/vitest.mjs run --coverage --maxWorkers=1 --testTimeout=20000`:
  **53 testes aprovados em 7 arquivos**; cobertura de linhas **92,60%** e de
  ramificações **93,31%**. Cobertura não comprova TDD. Lacunas existentes incluem
  navegação móvel automatizada e alguns caminhos de recuperação de cadastro/foto.
- `node node_modules/eslint/bin/eslint.js .`,
  `node node_modules/prettier/bin/prettier.cjs --check .` e
  `node node_modules/vite/bin/vite.js build`: aprovados. O build emitiu apenas
  diagnóstico de tempo de callbacks de plugins; não houve erro de compilação.
- Navegador integrado, conectado à API e ao PostgreSQL reais do Docker: consulta
  por código com caixa/espaços, busca por nome via Enter, validação vazia/ano,
  ausência de resultados, limpeza e retorno da edição conferidos. Nenhum dado
  de teste foi inserido no banco operacional. O banco local não tinha aplicações;
  as buscas positivas por veículos foram verificadas no PostgreSQL descartável.
- Temas claro/escuro inspecionados; larguras **360, 390 e 414 px** sem overflow
  horizontal. Campos do formulário medidos em 44 px e botões em 46 px de altura.
  Não foram encontrados erros/avisos de console durante essa inspeção. Capturas
  locais em `.cache/us04-desktop.jpg` e `.cache/us04-mobile.jpg`, fora do Git.

Projeto reconstruído com `docker compose up --build -d --wait --wait-timeout 180`:
banco, API e front-end saudáveis, mantidos em execução. Acesse
<http://localhost:5173/> e abra **Catálogo**. `alembic current` confirmou
`0004_vehicle_applications (head)` e `alembic check` não encontrou diferenças.
A peça existente foi preservada. Esta história não precisa de nova migração.

A matriz completa das duas últimas versões de Chrome, Firefox, Edge e Safari,
RNF04 nas condições de produção, revisão por outro integrante e aceite do cliente
permanecem pendentes. A implementação foi verificada localmente; a DoD não foi
marcada concluída. Nenhum commit, push ou alteração da issue foi realizado.

## Entrada de estoque — US08 (Refs #33)

No Catálogo, escolha **Registrar entrada** em uma peça ativa. Informe quantidade,
data e custo unitário, inclusive zero. A interface usa MUI, a logo e o tema
compartilhados. `features/stock/StockEntryPage.jsx` apresenta o formulário;
`useStockEntry.js` controla estado e submissão; `services/parts.js` realiza HTTP.
O saldo é calculado exclusivamente pela API.

Antes do POST, a tentativa é preservada no navegador. Falha de conexão mantém
campos bloqueados e permite **Tentar novamente** com a mesma chave e os mesmos
dados, inclusive após recarregar. Sem armazenamento disponível, nenhum novo POST
é enviado. Após sucesso, o formulário é encerrado e o saldo vigente é consultado
separadamente da resposta histórica da entrada. Para outra entrada, volte ao
catálogo e selecione a peça novamente.

### Evidências da US08

`src/stockEntry.test.jsx` foi desenvolvido com um comportamento por ciclo:
registro; rejeição por campo; reenvio incerto; recuperação após recarregar;
falha de armazenamento; quantidade; precisão do custo; data obrigatória;
data futura em São Paulo; confirmação com consulta do saldo vigente; bloqueio
da ação para peça inativa. Em cada ciclo foi observada a ausência do comportamento
antes da implementação mínima e a aprovação depois. A extração do hook preservou
os comportamentos cobertos. Falhas de inicialização por recursos do computador
não foram contadas como RED.

Conferência no navegador local: formulário, saldo vindo da API, erros de campos
obrigatórios, retorno ao catálogo e larguras 360, 390 e 414 px, sem rolagem
horizontal; campos e botões com área mínima de 44 px. Nenhuma movimentação de teste
foi inserida no banco operacional. A matriz completa de navegadores do RNF03,
TLS do ambiente publicado e o aceite do cliente não foram verificados localmente.

Resultado final: os 11 testes da US08 passaram após a extração do hook. A execução
completa (`vitest run --maxWorkers=1 --testTimeout=60000`) teve 63 aprovações e uma
falha de sincronização no teste antigo de status. A consulta foi alterada para
aguardar o botão ficar acessível após o fechamento do diálogo; a repetição de
`src/partStatus.test.jsx` aprovou seus 5 testes. Não houve nova execução completa
após esse ajuste exclusivo do teste. `pnpm lint`, `pnpm format:check` e `pnpm build`
foram aprovados. Os tempos dos testes foram maiores por pressão de memória local.

## Consulta de saldo — US12 (Refs #36)

No catálogo, **Consultar saldo** abre uma tela própria para qualquer peça, inclusive
inativa. A tela MUI reutiliza tema, navegação e identificação de status existentes;
exibe código, nome e quantidade física confirmada pela API. Saldo zero recebe a
mensagem **Nenhuma unidade disponível**. A consulta não oferece ações de escrita.

**Atualizar saldo** realiza novas consultas à peça e ao saldo. Durante o carregamento
ou após uma falha, o valor anterior deixa de ser apresentado como saldo atual. A
ação **Tentar novamente** permite recuperar a consulta. Respostas sem quantidade
inteira confirmada ou pertencentes a outra peça são rejeitadas pelo serviço HTTP;
o dado desconhecido nunca é convertido em zero. A requisição de saldo usa
`cache: 'no-store'`. Sair durante o carregamento aborta as consultas e ignora
respostas atrasadas. Voltar ao catálogo preserva filtros e página.

`StockBalancePage` cuida da apresentação, `useStockBalance` do estado e cancelamento,
e `services/parts.js` do contrato HTTP. Não foram adicionadas dependências.

### Evidências — 18/11/2026

Critérios usados: CA12.1–CA12.6 fornecidos na tarefa, vinculada à issue #36.
Os ciclos observaram falhas por ausência do acesso à consulta, mensagem de saldo
zero, atualização, ação de repetição, validação da resposta e política de cache,
seguidas da implementação e aprovação. Os cenários de peça inativa, cancelamento,
erros HTTP/JSON e preservação dos filtros são verificações complementares;
não representam novos ciclos TDD quando já passaram na primeira execução.

Inspeção no navegador integrado, com API local e SQLite temporário contendo apenas
peças fictícias: saldo 5, saldo zero com mensagem explícita, peça inativa com saldo
8, atualização e temas claro/escuro. Sem rolagem horizontal em 360, 390 e 414 px;
controles medidos em 360 px com pelo menos 44×44 px. Console sem erros ou avisos
nessa inspeção. O banco operacional não foi utilizado.

Permanecem pendentes a matriz completa do RNF03, auditoria automática/manual de
acessibilidade completa, RNF04 no ambiente e massa especificados, HTTPS/TLS do
ambiente publicado, revisão por outro integrante e aceite do cliente. A consulta
lê o saldo persistido; integração com importação, saídas, ajustes, vendas e
cancelamentos será verificada quando esses módulos forem implementados.

Verificação final com **Node 22.23.4**, baixado do site oficial em diretório
temporário e conferido por SHA-256 contra `SHASUMS256.txt`, sem alterar o Node
global. Com o executável temporário no início do `PATH` do processo:

- `node node_modules/vitest/vitest.mjs run --coverage --maxWorkers=1 --testTimeout=60000`:
  **78 testes aprovados em 9 arquivos**, incluindo 13 cenários da consulta de saldo
  e retorno ao catálogo filtrado. Cobertura por linhas **93,43%**, ramificações
  **92,88%**; lacunas incluem respostas de erro atrasadas após cancelamento e
  fluxos anteriores de foto/navegação. Não há mínimo de cobertura acordado.
- `node node_modules/eslint/bin/eslint.js .`,
  `node node_modules/prettier/bin/prettier.cjs --check .` e
  `node node_modules/vite/bin/vite.js build`: aprovados. Maior bundle **278,90 kB**,
  sem aviso de tamanho.
- A tentativa inicial com Node 24.15.0, cobertura e workers padrão teve 70
  aprovações e 8 timeouts de 5 segundos em testes existentes. A repetição completa
  com Node 22 e um worker passou em 185,60 s, sem alterar assertions nem a
  configuração permanente do Vitest. A execução intermediária com um worker em
  Node 24 foi interrompida sem resultado conclusivo.
