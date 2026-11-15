# <span id="9-dor-e-dod"></span>DoR e DoD {#dor-e-dod}


O trabalho é acompanhado na issue da US e no [Backlog](requisitos-de-software.md), conforme as [estratégias](estrategias-engenharia-de-software.md#artefatos-e-criterios) e o [processo de validação com o cliente](interacao-equipe-cliente.md#processo-de-validacao):

1. **DoR - prontidão:** verificar, no planejamento da sprint, se há entendimento suficiente para desenvolver e testar a história.
2. **DoD - parte técnica:** verificar os critérios de aceitação, a revisão por outro integrante, os testes e os padrões, com evidências de CI, cobertura e homologação.
3. **DoD - validação com o cliente:** demonstrar o incremento e registrar o resultado. Esse é o quinto item da mesma checklist de DoD, não uma confirmação adicional. O Projects informa o andamento; a conclusão no Backlog exige Done/Concluído, a DoD completa e um link HTTPS em Evidências.

---

## <span id="91-definition-of-ready-dor"></span>Definition of Ready (DoR) {#definition-of-ready-dor}

Uma História de Usuário (US) só passa do Product Backlog para o Sprint Backlog, durante o planejamento da sprint, quando todas as perguntas abaixo forem respondidas com **Sim**.

### Interpretação das perguntas e moderação dos termos {#interpretacao-dor}

O objetivo do acordo não é exigir especificação exaustiva nem eliminar toda possibilidade de dúvida, mas assegurar **entendimento compartilhado suficiente** para desenvolver e verificar o incremento, preservando o espaço de aprendizado técnico e de refinamento incremental ao longo das iterações:

- **Moderação de termos absolutos:** quando a pergunta 4 menciona regras “completamente definidas” ou a pergunta 11 menciona entendimento “sem perguntas adicionais”, o critério praticado pela equipe é o de suficiência técnica e negocial para a sprint, mantendo a abertura para aprendizado contínuo e esclarecimentos pontuais durante o ciclo.
- **Histórias registradas não são automaticamente prontas:** existir no Backlog ou no GitHub Issues não comprova a DoR. Dúvidas que impeçam definir escopo, regras, critérios ou dependências devem ser discutidas nos comentários e incorporadas aos critérios antes de iniciar o trabalho. Não há seção obrigatória de “A refinar” no corpo da US.
- **Ator no recorte do MVP:** na pergunta 1, o ator no MVP corresponde ao operador/proprietário da loja (Antônio Marcos), operando em terminal único sem distinção de perfis de autenticação nessa fase inicial.

### Tratamento da resposta “Não” {#tratamento-da-resposta-nao}

- **Na equipe:** o item retorna ao refinamento para esclarecer dúvidas de negócio e resolver os impedimentos. As decisões relevantes ficam nos comentários da issue ou em uma ata; os critérios de aceitação e as dependências são atualizados na fonte correspondente.
- **Individualmente:** quando a resposta negativa decorrer de uma lacuna de conhecimento técnico sobre as ferramentas do projeto, é aberta uma issue de estudo, capacitação ou alinhamento técnico para o integrante responsável, em consonância com o critério de Lacuna de Capacidade (LC) da [priorização](priorizacao.md).

### Dimensão de clareza {#dimensao-de-clareza}

Verifica se o que será desenvolvido e seu valor para o negócio estão suficientemente claros para a equipe iniciar a implementação e planejar os testes.

- [ ] O usuário ou ator (no MVP, o proprietário) está identificado, seu papel está descrito e seu objetivo de negócio está explícito na US?
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

### Aplicação prática do DoR na US01 {#aplicacao-pratica-do-dor}

A [US01 - Cadastrar peça](requisitos-de-software.md#us01), registrada na [issue #27](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/27), permite conferir o acordo a partir de informações concretas. A tabela resume a documentação disponível; o preenchimento da checklist continua na issue.

| Aspecto do DoR | Informação disponível e verificação necessária |
| --- | --- |
| Ator e objetivo | A narrativa identifica o usuário da loja e o objetivo de organizar o cadastro; o MVP não distingue perfis de autenticação. |
| Prioridade e esforço | `VN 4 + Must Have (3) - ET 2 = Score 5`, Q1. As notas EI 3, CA 2 e LC 1 estão na base; a reestimativa após incluir códigos equivalentes continua registrada como pendência de planejamento. |
| Critérios e origem | CA01.1 a CA01.5 abrangem cadastro válido, obrigatoriedade, campos opcionais e unicidade de códigos; a origem é RF01, CP1 e OE1. |
| Regras de negócio | Código principal e equivalentes são únicos no catálogo; duplicidade impede a gravação e identifica a peça que utiliza o código. A repetição dentro da própria peça também é impedida. |
| Validador e aprovação | Antônio Marcos é o validador previsto. O canal e a condição de aprovação da demonstração devem ser registrados antes da sessão. |
| Dependências técnicas | Modelo `Part`, API `POST /parts` e formulário React estão descritos nos [READMEs da implementação](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/tree/main/backend). |
| Impedimentos | Ambiente e CI possuem registros no repositório; os responsáveis devem conferir se há impedimentos para o trabalho selecionado. |
| RNFs | RNF01, RNF02, RNF03 e RNF05 estão relacionados na issue. O vínculo não substitui a avaliação de viabilidade ou a verificação do requisito. |
| Tamanho e capacidade | A estimativa existente não comprova, por si só, que o trabalho cabe na sprint; a seleção depende da capacidade e da reestimativa indicada no Backlog. |
| Dúvidas impeditivas | A política de duplicidade foi incorporada aos critérios e a exigência de perfis foi retirada do recorte. Novas dúvidas são discutidas nos comentários, sem recriar um campo fixo de pendências. |
| Entendimento compartilhado | Código e [protótipo](../prototipos/01-cadastro.md) apoiam a discussão; a compreensão dos envolvidos precisa ser verificada pela equipe. |
| Dependências funcionais | A US01 não exige outra funcionalidade prévia. O cadastro inicial não depende de login ou de importação. |

Na consulta de 15/11/2026, os itens da DoR na issue ainda estavam desmarcados. O refinamento registrado e a implementação integrada pelo [PR #65](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/65) não demonstram, isoladamente, que uma inspeção de prontidão ocorreu antes do desenvolvimento. O registro de verificação deve indicar o que foi conferido e quando, sem aprovação retroativa presumida.

---

## <span id="92-definition-of-done-dod"></span>Definition of Done (DoD) {#definition-of-done-dod}

A conclusão reúne duas etapas dentro dos cinco itens da mesma checklist:

- **<span id="etapa-1-verificacao-interna-dod"></span>Etapa 1 - Parte técnica da DoD (itens 1 a 4):** atendimento aos critérios e às regras, revisão por outro integrante via PR, integração entre interface, API e banco, testes sem regressões e padrões da equipe. A CI, os relatórios de cobertura e a verificação do incremento em homologação dão suporte a esses itens. Registre seus resultados no PR e use o link em Evidências.
- **<span id="etapa-2-validacao-externa"></span>Etapa 2 - Validação com o cliente (item 5):** Antônio Marcos utiliza o incremento em homologação e verifica os critérios de aceitação. O resultado fica em ata ou registro equivalente, vinculado em Evidências. Somente após essa etapa e as verificações técnicas a DoD pode ser considerada completa e a entrega liberada para produção.

O andamento é mantido no Projects. Não existe checkbox adicional de confirmação: a automação verifica a checklist inteira e a presença de um link HTTPS, sem avaliar o conteúdo da evidência ou substituir o aceite do cliente.

### Checklist de conclusão (DoD da US) {#checklist-de-dod}

A equipe considera uma funcionalidade concluída quando **todos os critérios abaixo** são atendidos:

- [ ] A funcionalidade atende aos critérios de aceitação da história de usuário.
- [ ] O código foi revisado por outro integrante por meio de um Pull Request (PR).
- [ ] Os testes previstos foram aprovados, sem introduzir regressões.
- [ ] O código e o histórico de alterações seguem os padrões de codificação e versionamento da equipe.
- [ ] A funcionalidade foi validada com o cliente.

As checklists são preenchidas na issue da US e exibidas no catálogo. O andamento vem do GitHub Projects. Marcar a DoD registra a verificação da equipe; a automação não realiza nem substitui o aceite do cliente. Os links dos resultados de testes, revisão e validação ficam em **Evidências**.

### Aplicação prática da DoD - Acompanhamento da US01 {#aplicacao-pratica-da-dod}

O [PR #65](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/65) contém a implementação da US01 integrada em 14/11/2026. A [issue #27](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/27) mantém os itens da DoD e os links de evidências; a tabela abaixo distingue os registros técnicos do preenchimento do acordo.

| Verificação | Evidência disponível e registro necessário |
| --- | --- |
| Critérios e regras do cadastro | Implementação no PR #65, incluindo campos obrigatórios/opcionais e unicidade de códigos. A conferência dos critérios é registrada no item 1 da DoD. |
| Revisão e padrões | PR #65 e seus [checks](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/65/checks): Ruff no backend e ESLint/Prettier no frontend. A revisão por outro integrante deve ser conferida e registrada na checklist; merge isolado não a comprova. |
| Integração e persistência | API FastAPI, interface React e migrações Alembic, com verificações em PostgreSQL local descritas nos [READMEs do backend](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/blob/main/backend/README.md) e do [frontend](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/blob/main/frontend/README.md). Esses registros não comprovam publicação no Supabase. |
| Testes e cobertura | O workflow [app-check.yml](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/blob/main/.github/workflows/app-check.yml) executa as suítes e gera artefatos de cobertura. Os resultados e a análise utilizada na revisão ficam no PR ou em registro técnico vinculado em Evidências. |
| Homologação | O job de contêineres valida build e inicialização, mas não comprova deploy na Vercel/Render. A URL do ambiente e o resultado da verificação precisam ser registrados quando a publicação ocorrer. |
| Validação com Antônio Marcos | Continua pendente de registro em Evidências. O item 5 só é marcado após a demonstração e o registro de seu resultado. |
| Conclusão no Backlog | Na consulta de 15/11/2026, os cinco itens da DoD permaneciam desmarcados na issue. A coleta contabiliza conclusão somente com Done/Concluído no Projects, checklist completa e evidência HTTPS. |

A mesma lógica se aplica às demais US: as evidências podem ser compartilhadas, mas as verificações e a conclusão de cada história são registradas individualmente. Implementação integrada, CI aprovada e issue fechada não comprovam sozinhas a DoD.

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
| 1.7 | 15/11/2026 | Detalhamento das etapas de conclusão e dos registros da US01, com cálculo de prioridade, checklists e evidências do processo. | [Thiago Gomes](https://github.com/thgomxs) |
| 1.8 | 15/11/2026 | Adequação do ator do DoR ao escopo do MVP (proprietário), alinhando a checklist às decisões de produto. | [Leonardo Lopes](https://github.com/LeonardoLopesJr) |
