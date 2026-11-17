# <span id="12-historico-de-evolucao-dos-requisitos"></span><span id="historico-de-evolucao-dos-requisitos"></span>Organização e atualização dos requisitos {#organizacao-e-atualizacao-dos-requisitos}

O [Backlog](requisitos-de-software.md) reúne os requisitos em uma única lista, organizada por
**épicos e histórias de usuário**. Cada épico informa a CP de origem e cada US mantém o RF
correspondente. O mesmo registro apresenta detalhamento, RNFs, prioridade, recorte de entrega,
checklists e evidências; as páginas de priorização e rastreabilidade explicam como consultar esses dados.

## Fonte de cada informação {#fontes-dos-dados}

Cada informação tem uma fonte de edição. O Backlog combina essas fontes automaticamente:

| Informação | Onde editar | Como aparece no Backlog |
| --- | --- | --- |
| Declaração do RF, origem CP/OE, vínculo RF/US/épico, RNFs, dependências aprovadas, prioridade, recorte e sprint | `tools/docs/data/backlog.json` | Dados aprovados e cálculos de prioridade no registro da US |
| Narrativa, critérios, dependências detalhadas, DoR, DoD e Evidências | Corpo da issue da US | Conteúdo atualizado e checklists somente para consulta |
| Objetivo do épico e vínculo de suas histórias | Issue do épico e sub-issues no GitHub | Objetivo e agrupamento das US; o parentesco é conferido com a base |
| Andamento da US | Campo **Status** do [GitHub Projects](https://github.com/orgs/mdsreq-fga-unb/projects/126) | Situação e origem da informação |
| Responsáveis e estado aberto/fechado da issue | Metadados da issue | Identificação e acompanhamento, sem inferir conclusão |
| PRs, commits e checks da CI | Repositório de implementação e vínculos com a US | Links e resultados coletados do GitHub |
| Evolução do requisito | Campo `history` da base e histórico da issue | Decisões no registro; edições da issue continuam consultáveis no GitHub |

A base mantém todas as histórias, inclusive as que ainda não têm issue. Narrativas e critérios
não são copiados para o JSON. O arquivo Markdown do Backlog contém o ponto de geração;
o cache em `.cache/docs/backlog/github.json` é descartável e não deve ser editado manualmente.

Se a issue informar vínculos diferentes da base, o registro apresenta a diferença para revisão.
Redações equivalentes de ausência de dependências e referências RF/US equivalentes não geram
uma segunda linha. Alterar o corpo da issue não muda automaticamente o escopo aprovado na base.

## Preenchimento e refinamento das issues {#padrao-das-issues}

1. Use o ID reservado na base e o formulário **História de usuário**. US01 é o ID da história;
   **#27**, por exemplo, é o número da issue usado nas referências de commits e PRs.
2. Preencha narrativa, critérios no formato **Dado / Quando / Então**, RNFs em bullets,
   dependências, checklists de DoR/DoD e **Evidências**. Preserve os títulos e os itens das checklists.
3. Vincule a US ao épico como **sub-issue**. Selecionar o épico no formulário não cria esse parentesco.
4. Discuta dúvidas nos comentários e incorpore as decisões aos critérios. Não há uma seção
   obrigatória de **A refinar** no formato atual. Mudanças relevantes registram motivo, data e origem.
5. Antes do desenvolvimento, confira a [DoR](dor-e-dod.md#definition-of-ready-dor).
   Marque apenas o que foi verificado. O andamento é atualizado no Projects, sem repeti-lo na descrição.
6. Durante a entrega, preencha a [DoD](dor-e-dod.md#definition-of-done-dod) e os links de Evidências.
   Uma ata ou PR pode demonstrar verificações de várias US, desde que identifique quais foram avaliadas.

Os **RNFs aplicáveis são uma relação de vínculos**, sem checklist adicional. Seus critérios
continuam definidos nos registros dos RNFs. Relacioná-los não comprova seu atendimento.

Issues antigas continuam reconhecidas. Ao migrar, use o formulário atual e preserve evidências
já registradas; não é necessário recriar a issue nem marcar retroativamente verificações não realizadas.

## <span id="121-rotina-de-atualizacao"></span>Rotina de atualização {#rotina-de-atualizacao}

<span id="122-propagacao-de-uma-mudanca"></span><span id="propagacao-de-uma-mudanca"></span>

| Passo | Ação e registro |
| --- | --- |
| Identificar e decidir | Registrar a necessidade, discutir o impacto e documentar a decisão na issue ou em uma ata. Decisões do cliente não podem ser presumidas pela ferramenta. |
| Atualizar a fonte | Editar a issue para o detalhamento; alterar a base versionada quando mudar declaração, vínculos, prioridade, recorte ou sprint. Mudanças no repositório passam por PR. |
| Conferir o impacto | Revisar RF/US, CP/OE, épico, RNFs, dependências e prioridade. Atualizar cronograma e diagramas quando forem afetados. |
| Preservar a memória | Registrar mudanças significativas no `history` do requisito e, quando alterarem o escopo geral, no histórico desta página. |
| Verificar e publicar | Executar a validação e conferir o Backlog gerado. A publicação ocorre após sucesso do workflow de documentação. |

As [relações de rastreabilidade](rastreabilidade.md) ajudam a localizar os itens afetados. A coleta
não transforma cada edição da issue em uma entrada de `history` e não decide o escopo pela equipe.

## Andamento e conclusão da US {#andamento-e-conclusao}

O **Projects informa o andamento**. A **DoD e as evidências sustentam a conclusão**:

| Condição | Resultado no Backlog |
| --- | --- |
| Status disponível no Projects | Exibe a situação do quadro. |
| US em andamento, revisão ou concluída com DoR incompleta | Mantém a situação e apresenta um alerta de prontidão. |
| Projects em **Done/Concluído**, DoD completa e link HTTPS válido em Evidências | Contabiliza a US como concluída e atualiza o progresso do épico. |
| Projects em **Done/Concluído**, mas falta item da DoD ou link de evidência | Exibe **Conclusão a confirmar**, sem contabilizar a conclusão. |
| Projects sem leitura disponível ou item sem Status | Exibe **Status do Projects indisponível** no formato atual. |

A DoD precisa conter os cinco itens oficiais, sem omissões, duplicações ou itens desmarcados.
A automação verifica o preenchimento e a presença do link; não valida seu conteúdo nem realiza
aceite pelo cliente. Marcar caixas não altera o Projects e não fecha a issue. Fechar a issue ou
integrar um PR, isoladamente, também não conclui a US.

Histórias sem issue continuam visíveis, com o planejamento da base e o detalhamento ainda não
preenchido. Apenas o formato legado usa o campo de situação da descrição e as inferências anteriores
como alternativa ao Projects.

## Vínculos de implementação e evidências {#vinculos-e-evidencias}

Vincule o PR à issue da US pela seção **Development** do GitHub, inclusive quando o PR já
estiver integrado. O coletor consulta apenas os vínculos atuais registrados pelo GitHub.
Ao desvincular o PR, ele deixa de aparecer na lista automática de PRs e checks na próxima coleta.

Menções como **`Refs #27`**, referências em comentários e URLs de PRs no campo **Evidências**
continuam como informação textual, mas não associam o PR ao Backlog. Palavras como `Closes #27`
só são consideradas quando o GitHub efetivamente registra o vínculo; elas também podem fechar a
issue ao integrar o PR à branch padrão, antes das outras verificações da DoD.

São coletados PRs, seus commits e os checks do último commit de cada PR, com resultado e link.
Somente os repositórios listados em `implementation_repositories`, na base, são consultados.
Commits diretos da branch padrão também são buscados desde a criação das issues das histórias.

A CI da aplicação executa testes e verificações técnicas; a automação do Backlog consulta os
resultados. CI aprovada não comprova, sozinha, TDD, todos os RNFs ou validação com o cliente.
Os resultados complementares podem ser registrados no PR e referenciados em Evidências.

## Publicação e acompanhamento automático {#automacao-do-backlog}

O fluxo é **GitHub → coleta e cache → validação → geração → publicação no GitHub Pages**.
O workflow `.github/workflows/docs.yml` usa o código da `main` e executa em alterações de issues,
comentários e PRs, pushes na `main`, conclusão do workflow **Validate application**, execução
manual e reconciliação programada a cada 30 minutos. Mudanças de Projects e de vínculos manuais
podem ser recuperadas nessa reconciliação.

O acesso ao repositório usa `GITHUB_TOKEN`, fornecido pelo GitHub Actions. A leitura do Projects
exige o secret `BACKLOG_PROJECT_TOKEN`, com acesso ao quadro e às issues envolvidas. Se o secret
não estiver configurado, o restante do conteúdo continua disponível e o status é identificado como
indisponível. Se um token for informado e sua consulta ao Projects falhar, a coleta é interrompida
e a última publicação válida permanece disponível.

A coleta é somente leitura: não cria nem edita issues, não marca checklists e não faz commits
na `main`. Os registros são gerados durante o build pelo hook `tools/docs/hooks/backlog.py`,
sem reescrever o Markdown. Uma falha de coleta preserva o cache anterior; uma falha de coleta,
validação ou build interrompe a nova publicação.

## Consulta e verificação local {#consulta-local}

No terminal, configure `GITHUB_TOKEN` para ler o repositório e `BACKLOG_PROJECT_TOKEN` para ler o
Projects. A autenticação do `gh`, sozinha, não define essas variáveis para o script.

```powershell
python tools/docs/scripts/backlog.py sync
python -m mkdocs serve
```

**O servidor local usa a última coleta salva.** Alterar uma issue no GitHub ou recarregar o
navegador não executa `sync`. Depois de sincronizar, reinicie o servidor para carregar os dados.
Sem cache, o Backlog apresenta o inventário da base e identifica os campos remotos não coletados.

Para verificar mudanças no repositório antes do PR:

```powershell
python tools/docs/scripts/backlog.py check
python -m unittest discover -s tools/docs/tests -t tools/docs -v
python -m mkdocs build --strict
python tools/docs/scripts/check_links.py site
```

O comando `check` valida os dados locais; não consulta o GitHub. As verificações de PR são
executadas sem secrets e sem publicar o código da branch em análise.

## <span id="123-decisoes-que-alteraram-o-escopo"></span>Decisões que alteraram o escopo {#decisoes-que-alteraram-o-escopo}

Registro das decisões que mudaram requisitos, características ou o recorte de entrega. Cada linha
indica a data, a decisão, os elementos afetados e a origem da mudança.

| Data | Decisão | Elementos afetados | Origem |
| :--: | --- | --- | --- |
| 09/09/2026 | Revisão dos nomes e das descrições das características de produto. | CP1 a CP9 | Revisão interna da equipe |
| 22/09/2026 | Correção da afirmação sobre custos e inclusão das fontes na pesquisa de mercado. | Solução e características (2.5) | Issue #4 |
| 24/09/2026 | Reescrita dos objetivos específicos e das características no padrão de capacidade, com rastreabilidade explícita. | OE1 a OE5, CP1 a CP9 | Feedback da monitoria |
| 27/09/2026 | Inclusão do OE6 — centralização dos dados, com o sistema como fonte única. | OE6, CP1, CP5 | Feedback da monitoria (issue #4) |
| 30/09/2026 | Atualização geral dos RFs e RNFs para a versão vigente dos requisitos. | RF01 a RF40, RNF01 a RNF05 | Revisão interna da equipe |
| 02/10/2026 | Remoção da característica de vinculação do estoque aos anúncios: a integração com o Mercado Livre saiu do escopo do MVP. Características renumeradas. | CP1 a CP9, RF25 a RF40 | Validação com a monitoria |
| 02/10/2026 | Separação das operações de despesa em registrar, editar e excluir. | [RF28](requisitos-de-software.md#rf28), [RF29](requisitos-de-software.md#rf29), [RF30](requisitos-de-software.md#rf30) | Feedback da monitoria |
| 02/10/2026 | Esclarecimento do demonstrativo financeiro e correção da sobreposição entre os dados fiscais da peça e os da operação fiscal. | [RF31](requisitos-de-software.md#rf31), [RF32](requisitos-de-software.md#rf32), [RF33](requisitos-de-software.md#rf33) | Feedback da monitoria |
| 03/10/2026 | Devolução de peça passou a ser vinculada a uma venda; atualização de estoque no registro de venda simplificada. | [RF11](requisitos-de-software.md#rf11), [RF15](requisitos-de-software.md#rf15) | Feedback da monitoria |
| 05/10/2026 | Definição do método de priorização — VN, ET, MoSCoW e Score — e seleção de 13 requisitos para o MVP, 5 condicionados e 22 como evolução futura. | Todos os RFs; [Priorização](priorizacao.md) | Decisão da equipe |
| 10/10/2026 | Fragmentação da característica de integridade em duas: segurança/integridade dos dados e acessibilidade/responsividade. | CP7, CP8, RNF01 a RNF05 | Feedback da monitoria |
| 12/10/2026 | Definição dos três épicos e das 13 histórias de usuário do MVP, com os vínculos de CP, RF e RNF. | [EP01](requisitos-de-software.md#ep01), [EP02](requisitos-de-software.md#ep02), [EP03](requisitos-de-software.md#ep03) e as 13 US | Decisão da equipe |
| 13/10/2026 | Realinhamento das características de origem dos RF25 a RF40, com a unificação de compras e análise na CP4. | [RF25](requisitos-de-software.md#rf25) a [RF40](requisitos-de-software.md#rf40) | Revisão de rastreabilidade |
| 03/11/2026 | **Consolidação do escopo em um catálogo integrado.** Cada requisito passou a ter um registro único, reunindo declaração, intenção e valor, origem, condições, priorização, entrega, situação e evolução. As listas paralelas de requisitos mantidas no Backlog de produto foram eliminadas, e as páginas de priorização, MVP e rastreabilidade passaram a consultar o catálogo. | Todos os registros; páginas 8 a 12 na numeração original | Estudo de caso do Capítulo 12 |
| 03/11/2026 | Adoção dos nomes das características definidos na Visão do Produto como versão vigente, corrigindo a divergência com os nomes usados na página de requisitos (CP1 e CP2). | [CP1](solucao-e-caracteristicas.md#cp1), [CP2](solucao-e-caracteristicas.md#cp2) e seus requisitos | Revisão de consistência |
| 03/11/2026 | Registro das dependências entre requisitos, derivadas da leitura das declarações, com marcação explícita de que aguardam validação no refinamento. | Campo *Condições e avaliação* de 35 registros | Revisão de consistência |
| 10/11/2026 | Consolidação do MVP com 12 US, mantendo US13 e US14 separadas e fora do recorte, com revisão das declarações e justificativas de entrega. | Backlog e recorte do MVP | [PR #63](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/63) |

| 14/11/2026 | Integração do recorte consolidado em 10/11: MVP reduzido de 13 para 12 US. US13 e US14 permanecem separadas, condicionadas e sem sprint; US14 depende de US13. Entrada de peças deixa de exigir fornecedor e de depender de US07. | [US08](requisitos-de-software.md#us08), [US13](requisitos-de-software.md#us13), [US14](requisitos-de-software.md#us14), EP02 e recorte do MVP | [PR #63](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/63), alterações registradas na base em 10/11/2026 |
| 14/11/2026 | US02: VN corrigido de 4 para 2, Score 3 e Q3, mantida no MVP por exceção documentada como Must Have. US16: Should Have alterado para Must Have, com Score 5. Fórmula e notas de esforço preservadas. | [US02](requisitos-de-software.md#us02), [US16](requisitos-de-software.md#us16) e priorização | [PR #63](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/63), com referências às atas nos registros das US |
| 14/11/2026 | Consolidação das regras de códigos principais/equivalentes únicos, importação sem sobrescrita, busca por equivalentes, campos editáveis explícitos, código principal imutável e edição fiscal reservada à US33. Peças inativas permanecem visíveis e impedem novas movimentações e vendas. | [US01](requisitos-de-software.md#us01), [US02](requisitos-de-software.md#us02), [US04](requisitos-de-software.md#us04), [US05](requisitos-de-software.md#us05), [US06](requisitos-de-software.md#us06), US33 | [PR #63](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/63) |
| 14/11/2026 | Consolidação das regras de entrada sem fornecedor, bloqueio de saídas e vendas acima do saldo, ajuste sem saldo negativo e identificação dos canais e do preço unitário na venda. Dados obrigatórios/opcionais do fornecedor explicitados; recebimento descrito sem impor um componente de interface. | [US07](requisitos-de-software.md#us07), [US08](requisitos-de-software.md#us08), [US09](requisitos-de-software.md#us09), [US10](requisitos-de-software.md#us10), [US15](requisitos-de-software.md#us15), [US18](requisitos-de-software.md#us18) | [PR #63](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/63) |
| 14/11/2026 | Retirada das restrições por perfil das declarações do MVP, mantendo a solução de acesso como pendência. Revisão de esforço de US01/US04 sinalizada sem atribuir novas estimativas; justificativas de entrega e dependências passam a ser apresentadas por US no catálogo. | Declarações do MVP, [US01](requisitos-de-software.md#us01), [US04](requisitos-de-software.md#us04) e apresentação do catálogo | [PR #63](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/pull/63); detalhamento remoto permanece nas issues |
| 14/11/2026 | Correção da descrição de RF14 na ata de 05/10: de associação a anúncios do Mercado Livre para filtro do histórico por período. | [US14 / RF14](requisitos-de-software.md#rf14) | [Ata da Sprint 3](../atas/sprint-3.md), [issue #47](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/47) |

## <span id="125-referencia-de-cada-entrega"></span>Referência de cada entrega {#referencia-de-cada-entrega}

Cada entrega preserva uma referência do escopo naquele momento, permitindo comparar o que mudou sem
congelar o documento. A referência é o estado do repositório na data da entrega.

| Entrega | Período | Estado do escopo registrado |
| --- | --- | --- |
| [Entrega 1](../entregas/entrega-1.md) | Unidade 1 | Visão do produto: problema, objetivos e características, sem requisitos declarados |
| [Entrega 2](../entregas/entrega-2.md) | Unidade 2 | 40 requisitos funcionais, 5 não funcionais, priorização aplicada e MVP de 13 requisitos definido |
| [Entrega 3](../entregas/entrega-3.md) | Unidade 3 | Escopo consolidado no catálogo integrado; início da implementação do MVP |
| [Entrega 4](../entregas/entrega-4.md) | Unidade 4 | A registrar |

## Versionamento

| Versão | Data | Descrição | Autor(es/as) |
| :----: | :--: | --- | --- |
| 1.0 | 03/11/2026 | Criação da página, reunindo a rotina de atualização, a propagação de mudanças, o histórico de decisões de escopo e as pendências em aberto | Equipe |
| 1.1 | 04/11/2026 | Remoção da numeração estrutural e ajuste da hierarquia dos títulos, com links estáveis e preservação das âncoras anteriores. | [Thiago Gomes](https://github.com/thgomxs) |
| 2.0 | 05/11/2026 | Explicitação das fontes por campo, formulários, geração do catálogo, rastreabilidade e critérios da automação, preservando a memória das decisões. | [Thiago Gomes](https://github.com/thgomxs) |
| 2.1 | 07/11/2026 | Reorganização das fontes de apoio em `tools/docs/`, com atualização dos caminhos de manutenção, testes e automação. | [Thiago Gomes](https://github.com/thgomxs) |
| 2.2 | 15/11/2026 | Novo formato de US com DoR/DoD e Evidências, status pelo Projects, transição das issues legadas e coleta dos checks dos PRs. | [Thiago Gomes](https://github.com/thgomxs) |
| 2.3 | 15/11/2026 | Revisão do fluxo de organização e atualização, adoção do nome Backlog e remoção da seção de pendências gerais de escopo. | [Thiago Gomes](https://github.com/thgomxs) |
| 2.4 | 15/11/2026 | Registro das decisões de 14/11 e de suas relações com o MVP e a rastreabilidade. | [Thiago Gomes](https://github.com/thgomxs) |
