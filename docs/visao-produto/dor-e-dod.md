# <span id="9-dor-e-dod"></span>DoR e DoD {#dor-e-dod}


O processo de desenvolvimento da equipe combina três etapas complementares, alinhadas às [estratégias de engenharia de software](estrategias-engenharia-de-software.md#artefatos-e-criterios), ao [processo de validação com o cliente](interacao-equipe-cliente.md#processo-de-validacao) e ao [cronograma](cronograma-e-entregas.md):

1. **Definition of Ready (DoR) — verificação interna prévia:** avalia, no planejamento da sprint (*Commitment Point*), se uma História de Usuário (US) reúne entendimento suficiente para iniciar a implementação e a verificação.
2. **Definition of Done (DoD) — verificação interna de qualidade técnica:** avalia se a funcionalidade implementada cumpriu os critérios técnicos, a revisão por pares, os testes automatizados, a análise de cobertura e a publicação em homologação antes de ser demonstrada ao cliente.
3. **Testes de aceitação com o cliente — validação externa e encerramento no backlog:** confirma, junto ao proprietário da TSI Peças, que o incremento homologado atende aos critérios de aceitação e à operação da loja; o cumprimento conjunto da DoD interna e da validação externa autoriza a marcação da US como **Concluído** no [catálogo de requisitos](requisitos-de-software.md) e o deploy em produção.

---

## <span id="91-definition-of-ready-dor"></span>Definition of Ready (DoR) {#definition-of-ready-dor}

Uma História de Usuário (US) só passa do Product Backlog para o Sprint Backlog, durante o planejamento da sprint (*Commitment Point*), quando todas as perguntas abaixo forem respondidas com **Sim**.

### Interpretação das perguntas e moderação dos termos {#interpretacao-dor}

O objetivo do acordo não é exigir especificação exaustiva nem eliminar toda possibilidade de dúvida, mas assegurar **entendimento compartilhado suficiente** para desenvolver e verificar o incremento, preservando o espaço de aprendizado técnico e de refinamento incremental ao longo das iterações:

- **Moderação de termos absolutos:** quando a pergunta 4 menciona regras “completamente definidas” ou a pergunta 11 menciona entendimento “sem perguntas adicionais”, o critério praticado pela equipe é o de suficiência técnica e negocial para a sprint, mantendo a abertura para aprendizado contínuo e esclarecimentos pontuais durante o ciclo.
- **Histórias registradas não são automaticamente prontas:** a simples presença de uma US no [catálogo de requisitos](requisitos-de-software.md) ou no GitHub Issues não garante prontidão para desenvolvimento. Histórias com pendências abertas na seção **“A refinar”** das issues (como regras de negócio pendentes, limites de campos ou dependências de perfis fora do MVP) precisam ser esclarecidas antes de cruzar o *Commitment Point*.
- **Ator no recorte do MVP:** na pergunta 1, o ator no MVP corresponde ao operador/proprietário da loja (Antônio Marcos), operando em terminal único sem distinção de perfis de autenticação nessa fase inicial.

### Tratamento da resposta “Não” {#tratamento-da-resposta-nao}

- **Na equipe:** o item não ingressa na sprint e retorna ao refinamento para esclarecer dúvidas de negócio, validar protótipos com o cliente quando necessário e resolver as pendências impeditivas da seção **“A refinar”** ou **“Pontos a esclarecer”** da US. As discussões ficam registradas nos comentários da própria issue.
- **Individualmente:** quando a resposta negativa decorrer de uma lacuna de conhecimento técnico sobre as ferramentas do projeto, é aberta uma issue de estudo, capacitação ou alinhamento técnico para o integrante responsável, em consonância com o critério de Lacuna de Capacidade (LC) da [priorização](priorizacao.md).

### Dimensão de clareza {#dimensao-de-clareza}

Verifica se o que será desenvolvido e seu valor para o negócio estão suficientemente claros para a equipe iniciar a implementação e planejar os testes.

- [ ] O usuário ou ator (Administrador ou Operador da loja) está identificado, seu papel está descrito e seu objetivo de negócio está explícito na US?
- [ ] O Score de priorização foi calculado (`Score = VN + Peso MoSCoW - ET`), a classificação MoSCoW foi registrada e a prioridade foi registrada no [catálogo de requisitos](requisitos-de-software.md#registros-dos-requisitos-funcionais), conforme o método de [Priorização](priorizacao.md)?
- [ ] Os critérios de aceitação são verificáveis, estão escritos no formato **Dado / Quando / Então**, cobrem os fluxos de exceção e erro e estão explicitamente vinculados ao requisito funcional (RF), ao objetivo específico (OE) e à característica de produto (CP) correspondentes?
- [ ] As regras de negócio do contexto de autopeças estão completamente definidas na US? Exemplos: imutabilidade do código do fabricante, política de duplicidade no cadastro e na importação de planilhas, atualização do saldo físico do estoque e canais de venda, como balcão e Mercado Livre.
- [ ] O validador (Antônio Marcos, proprietário), o canal de validação (reuniões quinzenais pelo Google Meet, encontros presenciais ou WhatsApp) e o critério de aprovação pelo cliente estão definidos?

### Dimensão de viabilidade {#dimensao-de-viabilidade}

Verifica se há bloqueios externos, de infraestrutura ou de dependência sistêmica que impeçam o início do trabalho na sprint.

- [ ] As dependências técnicas foram mapeadas, incluindo tabelas no PostgreSQL/Supabase, endpoints do FastAPI e componentes React, quando aplicáveis?
- [ ] Os impedimentos conhecidos foram removidos ou possuem um plano de mitigação documentado? Exemplos: limites dos planos gratuitos e higienização das planilhas legadas.
- [ ] Os requisitos não funcionais (RNFs) aplicáveis à história foram mapeados e seus critérios verificáveis são viáveis de implementar? Exemplos: RNF01 para uso em dispositivos móveis no balcão; RNF02 para tolerância a falhas de conexão e prevenção de duplicidades; RNF04 para buscas com P95 ≤ 3 s; RNF05 para segurança dos dados, nas condições definidas nos [registros dos RNFs](requisitos-de-software.md#registros-dos-requisitos-nao-funcionais).

### Dimensão de escopo {#dimensao-de-escopo}

Verifica o entendimento compartilhado entre os integrantes e a adequação do tamanho do item à capacidade da sprint.

- [ ] O escopo da história cabe na sprint de 14 dias, considerando a capacidade da equipe?
- [ ] Todas as dúvidas que afetam o escopo, as regras de negócio e os critérios de aceitação foram resolvidas e acordadas antes do início do desenvolvimento?
- [ ] Cada integrante envolvido (Product Owner, frontend, backend e QA) consegue explicar exatamente o que será construído, como será testado e o prazo estimado, sem perguntas adicionais?
- [ ] As dependências entre itens, incluindo outras US necessárias, foram mapeadas e estão concluídas ou possuem uma sequência de entrega explicitamente acordada?

### Aplicação prática do DoR e decisão de entrada na sprint {#aplicacao-pratica-do-dor}

Como evidência de aplicação concreta do acordo, a tabela abaixo registra a avaliação de prontidão da história **[US01 — Cadastrar peça](requisitos-de-software.md#rf01)** ([Issue #27](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/27)), planejada para abrir o desenvolvimento do catálogo na [Sprint 3](cronograma-e-entregas.md#sprint-3).

A avaliação evidencia por que as histórias não são tomadas automaticamente como prontas: na primeira inspeção da [Issue #27](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/27), o DoR identificou duas pendências impeditivas (a política de duplicidade do código do fabricante no cadastro manual, registrada em *“A refinar”*, e a menção a acesso autenticado por perfil em *“Dependências”*). Essas pendências motivaram a elaboração do roteiro de [Prototipação rápida — Cadastro e manutenção](../prototipos/01-cadastro.md) e o refinamento das regras antes da liberação da história.

| Dimensão | Critério do DoR | 1ª Inspeção (Issue #27 inicial) | Após refinamento da regra | Evidência / Observação objetiva |
| --- | --- | :---: | :---: | --- |
| **Clareza** | Ator, papel e objetivo explícitos na narrativa | **Sim** | **Sim** | Narrativa explicita o responsável pela operação da loja e a finalidade de manter as informações das peças organizadas para consulta. |
| **Clareza** | Score, MoSCoW e prioridade registrados no catálogo | **Sim** | **Sim** | `VN 4 + Must Have (5) - ET 2 = Score 7` (Q1), registrado em [US01 / RF01](requisitos-de-software.md#rf01). |
| **Clareza** | Critérios de aceitação em Dado / Quando / Então vinculados a RF, OE e CP | **Parcial (Não)** | **Sim** | CA01.1 a CA01.3 cobrem cadastro válido, campos obrigatórios ausentes e campos opcionais, vinculados a RF01, OE1 e CP1; o critério CA01.4 (Unicidade dos códigos) foi adicionado à [Issue #27](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/27). |
| **Clareza** | Regras de negócio essenciais suficientemente definidas | **Não** | **Sim** | Na inspeção inicial, o tratamento de código já existente estava aberto em *“A refinar”*. No refinamento, definiu-se a unicidade de códigos principais e equivalentes e a rejeição de duplicidade com identificação da peça existente. |
| **Clareza** | Validador, canal e critério de aprovação definidos | **Sim** | **Sim** | Validador: Antônio Marcos; validação por demonstração nas revisões quinzenais (Google Meet / presencial) com apoio do [roteiro de protótipo](../prototipos/01-cadastro.md). |
| **Viabilidade** | Dependências técnicas mapeadas (banco, API e interface) | **Sim** | **Sim** | Entidade `part` (`manufacturer_code`, `name`, `category`, `technical_description`, `physical_location`, `photo_url`), endpoint `POST /parts` no FastAPI e formulário em React mapeados. |
| **Viabilidade** | Impedimentos removidos ou com mitigação documentada | **Sim** | **Sim** | Ambiente local containerizado (`compose.yaml`) e pipeline de verificação (`app-check.yml`) operacionais; sem bloqueio externo. |
| **Viabilidade** | RNFs aplicáveis mapeados e viáveis | **Sim** | **Sim** | RNF01 (interface responsiva a partir de 360 px), RNF02 (transação/idempotência), RNF03 (navegadores) e RNF05 (validação e segurança) vinculados. |
| **Escopo** | Escopo cabe na sprint de 14 dias | **Sim** | **Sim** | Escopo restrito ao cadastro unitário de peça (EI 3, CA 2, LC 1; ET = 2), compatível com a capacidade da Sprint 3. |
| **Escopo** | Pendências impeditivas de *“A refinar”* esclarecidas | **Não** | **Sim** | A indefinição sobre duplicidade foi sanada com a criação do CA01.4 e a dependência de autenticação por perfis foi descartada no MVP, sendo a seção *“A refinar”* esvaziada no corpo da [Issue #27](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/27). |
| **Escopo** | Entendimento suficiente compartilhado entre PO, front, back e QA | **Sim** | **Sim** | Fluxo de tela, campos obrigatórios/opcionais e cenários de teste alinhados entre os responsáveis e representados no [protótipo navegável](../prototipos/01-cadastro.md). |
| **Escopo** | Dependências entre histórias mapeadas e equacionadas | **Não** | **Sim** | A [Issue #27](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/27) citava dependência de acesso autenticado por perfil (fora do MVP). Na base do catálogo e na issue atualizada, RF01/US01 não possui pré-requisito funcional (`nenhuma dependência identificada na declaração`). |

**Registro da decisão de entrada na sprint:**

- **Resultado na 1ª inspeção:** **Reprovada no DoR (3 respostas “Não”)** — a US01 não pôde ser considerada automaticamente pronta devido à indefinição sobre duplicidade de código em *“A refinar”* e à divergência sobre autenticação por perfil em *“Dependências”*. A história foi encaminhada ao refinamento conforme a regra de tratamento da equipe.
- **Resultado após refinamento e decisão de entrada:** com a formalização da regra de unicidade de códigos no critério CA01.4, a confirmação de que o MVP opera sem perfis distintos de autenticação e a sincronização do corpo da [Issue #27](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/27), o entendimento tornou-se suficiente para a história ingressar na Sprint 3.
- **Situação das demais histórias do backlog:** as demais histórias que mantêm pendências em aberto na seção *“A refinar”* (como US02, US03, US04, US08, US09, US10, US12, US15 e US16) permanecem retidas antes do *Commitment Point* até que passem pelo mesmo processo de esclarecimento prévio; US05 e US06 foram refinadas e planejadas para a mesma Sprint 3 de catálogo inicial.

---

## <span id="92-definition-of-done-dod"></span>Definition of Done (DoD) {#definition-of-done-dod}

Para manter uma **definição única** em toda a documentação — consistente com [Estratégias de engenharia de software](estrategias-engenharia-de-software.md#artefatos-e-criterios), [Interação entre equipe e cliente](interacao-equipe-cliente.md#processo-de-validacao), [Cronograma](cronograma-e-entregas.md#sprint-3) e [Organização e atualização dos requisitos](historico-de-evolucao.md#automacao-do-backlog) —, a equipe articula a conclusão da funcionalidade em duas etapas:

- **<span id="etapa-1-verificacao-interna-dod"></span>Etapa 1 — Verificação interna de qualidade técnica:** checklist técnico aplicado a cada funcionalidade antes de ser submetida à homologação com o cliente, cobrindo o atendimento aos critérios de aceitação e regras de negócio, os padrões de codificação, a revisão por pares em Pull Request (PR), a integração entre camadas e banco de dados, os testes automatizados sem regressões na CI, a geração e análise do relatório de cobertura de testes automatizados (`coverage-frontend` e `coverage-backend`) e o deploy em ambiente de homologação (Vercel e Render).
- **<span id="etapa-2-validacao-externa"></span>Etapa 2 — Validação externa e encerramento no backlog:** demonstração e homologação do incremento com Antônio Marcos na revisão da sprint (ou sessão de aceitação); somente após o cumprimento conjunto da DoD técnica e da validação externa registrada com link HTTPS de evidência na issue a história é considerada **Concluído** no [catálogo](requisitos-de-software.md) e liberada para deploy em produção.

### Checklist de conclusão (DoD da US) {#checklist-de-dod}

A equipe considera uma funcionalidade concluída quando **todos os critérios abaixo** são atendidos:

- [ ] A funcionalidade atende aos critérios de aceitação da história de usuário.
- [ ] O código foi revisado por outro integrante por meio de um Pull Request (PR).
- [ ] Os testes previstos foram aprovados, sem introduzir regressões.
- [ ] O código e o histórico de alterações seguem os padrões de codificação e versionamento da equipe.
- [ ] A funcionalidade foi validada com o cliente.

As checklists são preenchidas na issue da US e exibidas no catálogo. O andamento vem do GitHub Projects. Marcar a DoD registra a verificação da equipe; a automação não realiza nem substitui o aceite do cliente. Os links dos resultados de testes, revisão e validação ficam em **Evidências**.

### Aplicação prática da DoD — Acompanhamento da US01 {#aplicacao-pratica-da-dod}

Em respeito à regra de integridade do catálogo ([Organização e atualização](historico-de-evolucao.md#automacao-do-backlog)), nenhuma história de usuário tem sua conclusão assinalada antecipadamente enquanto todas as etapas técnicas e de validação externa não estiverem integralmente cumpridas.

Para demonstrar a aplicação concreta do acordo sobre o trabalho desenvolvido na Sprint 3, a tabela abaixo apresenta o estado de verificação da **[US01 — Cadastrar peça](requisitos-de-software.md#rf01)** ([Issue #27](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/27)), cuja implementação técnica foi integrada à branch `main` por meio do [PR #65](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/65):

| Dimensão / Etapa | Critério de verificação da DoD | Situação atual na US01 | Evidência / Registro no repositório |
| --- | --- | :---: | --- |
| **Qualidade técnica (Item 1)** | Critérios de aceitação e regras de negócio da US01 implementados | **Atendido** | Cadastro manual com código do fabricante, nome e categoria obrigatórios, campos opcionais e bloqueio de códigos duplicados com identificação da peça existente implementado no front-end e no back-end via [PR #65](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/65) (`Refs #27`). |
| **Qualidade técnica (Item 2)** | Padrões de codificação e revisão por pares via PR | **Atendido** | Verificação automática de lint/formatação (Ruff e Biome/Prettier) aprovada na CI; código revisado por pares e integrado à branch `main` no [PR #65](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/65) em 14/11/2026. |
| **Qualidade técnica (Item 3)** | Integração entre camadas e persistência em banco de dados | **Atendido** | Migração Alembic `0001_parts.py`, persistência no PostgreSQL/Supabase, serviços transacionais em FastAPI e interface React integrados, conforme documentado no [README do backend](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/blob/main/backend/README.md) e no [README do frontend](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/blob/main/frontend/README.md). |
| **Qualidade técnica (Item 3)** | Testes automatizados executados e aprovados na CI sem regressões | **Atendido** | Suíte de testes unitários e de integração no backend (`backend/tests/test_parts.py`) e no frontend (`frontend/src/partRegistration.test.jsx`) executadas e aprovadas no pipeline [`.github/workflows/app-check.yml`](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/blob/main/.github/workflows/app-check.yml). |
| **Qualidade técnica (Item 3 / 4)** | Relatório de cobertura de testes gerado e analisado | **Atendido** | Artefatos `coverage-backend` (pytest-cov) e `coverage-frontend` (vitest coverage) gerados na CI a cada execução do `app-check.yml` cobrindo as regras críticas da US01, conforme previsto nas [práticas de XP](estrategias-engenharia-de-software.md#xp) e no [cronograma](cronograma-e-entregas.md#sprint-3). |
| **Qualidade técnica (Item 3 / 4)** | Deploy e verificação em ambiente de homologação (Vercel / Render) | **Em andamento** | Builds de pré-produção validados na CI (`containers` job em `app-check.yml`); publicação em instâncias de homologação na Vercel e no Render em preparação para a sessão de revisão com o cliente. |
| **Validação externa (Item 5)** | Testes de aceitação com o proprietário (Antônio Marcos) | **Pendente** | Demonstração e homologação do software funcional agendadas para a reunião de Sprint Review com Antônio Marcos ao final da Sprint 3. |
| **Encerramento no backlog** | Confirmação e link HTTPS de evidência registrados na [Issue #27](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/27) | **Pendente (correto)** | O checkbox de conclusão na Issue #27 permanece desmarcado e o status no catálogo permanece não concluído até que a validação externa seja realizada e o link da ata de aceite seja registrado. |

---

## Versionamento

| Versão | Data | Descrição | Autor(es/as) |
| :----: | :--: | --- | --- |
| 1.0 | 04/09/2026 | Iniciação do documento | [Thiago Gomes](https://github.com/thgomxs) |
| 1.1 | 12/10/2026 | Elaboração do conteúdo da Definition of Done (DoD) | [João Guilherme Amancio de Melo (@jot4-ge)](https://github.com/jot4-ge) |
| 1.2 | 12/10/2026 | Elaboração do conteúdo da Definition of Ready (DoR) | [Leonardo da Silva Lopes Júnior (@LeonardoLopesJr)](https://github.com/LeonardoLopesJr) |
| 1.3 | 12/10/2026 | Inserção dos textos fornecidos no documento, revisão gramatical, formatação e adequação da referência de entrada na sprint à estratégia adotada | [Thiago Gomes](https://github.com/thgomxs) |
| 1.4 | 04/11/2026 | Remoção da numeração estrutural e ajuste da hierarquia dos títulos, com links estáveis e preservação das âncoras anteriores. | [Thiago Gomes](https://github.com/thgomxs) |
| 1.5 | 15/11/2026 | Aplicação das checklists nas US, com pendências tratadas nos critérios e comentários e evidências mantidas na issue. | [Thiago Gomes](https://github.com/thgomxs) |
| 1.6 | 15/11/2026 | Correção das issues #50 e #51: moderação de termos absolutos no DoR, explicitação da não prontidão automática das USs com pendências em "A refinar", unificação da DoD (verificação técnica interna com relatório de cobertura e deploy em homologação seguida de validação externa) e inclusão das tabelas de aplicação prática do DoR e da DoD na US01 com evidências da implementação integrada no PR #65. | [Leonardo Lopes](https://github.com/LeonardoLopesJr) |
