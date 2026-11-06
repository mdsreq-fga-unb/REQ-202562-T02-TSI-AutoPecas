# <span id="12-historico-de-evolucao-dos-requisitos"></span><span id="historico-de-evolucao-dos-requisitos"></span>Organização e atualização dos requisitos {#organizacao-e-atualizacao-dos-requisitos}

O [catálogo](requisitos-de-software.md) é a **única apresentação completa do backlog**. Ele é
organizado por épicos, que apontam para suas características de produto (CPs), e por histórias
(US01 a US40), cada uma vinculada ao RF do mesmo número. O recorte do MVP e as evidências são
consultados no próprio registro; não há uma lista ou página de acompanhamento paralela.

## Fonte de cada informação {#fontes-dos-dados}

| Informação | Onde é mantida | Como chega ao catálogo |
| --- | --- | --- |
| IDs, declaração do RF, CP/OE, épico, RNFs, dependências aprovadas, prioridade e sprint | `data/backlog.json` | Geração automática a partir da base versionada |
| Narrativa, critérios de aceitação e pontos a refinar da US | Corpo da issue | Coleta das seções padronizadas, preservando o número da issue |
| Objetivo do épico | Issue do épico | Coleta do campo Objetivo e consulta às sub-issues |
| Responsáveis, marco e estado da issue | Metadados do GitHub | Leitura pela API |
| Situação do desenvolvimento | Status do Projects, quando configurado; na ausência, campo da issue | Exibida com indicação da origem |
| PRs e commits | Relações explícitas com a issue | Coleta de referências, timeline e commits dos PRs; commits diretos na branch padrão desde a criação das issues |
| Conceitos, descrições de CPs e OEs | [Visão do produto](solucao-e-caracteristicas.md) | Links de origem, sem copiar a especificação |

**Uma fonte por campo.** A aplicação inversa dos RNFs, os totais e os cálculos são derivados dos
vínculos e das notas registrados, sem manutenção de tabelas paralelas. A base versionada mantém o escopo aprovado, inclusive histórias ainda sem
issue. Ela não armazena cópias da narrativa e dos critérios do GitHub. O Markdown do catálogo
contém o ponto de geração, não uma segunda lista. O snapshot local em `.cache/backlog/github.json`
é descartável, ignorado pelo Git e nunca deve ser editado como fonte de requisitos.

Quando a issue informa RNFs ou dependências diferentes dos vínculos aprovados, a divergência é
mostrada no registro. Ela exige análise antes de alterar a base, evitando mudanças silenciosas de
escopo. Na ausência de issue, a US permanece visível, com narrativa e critérios pendentes; a
situação inicial vem do planejamento, não da simples ausência de atividade no GitHub.

## Preenchimento e refinamento das issues {#padrao-das-issues}

1. Reserve o vínculo RF/US e seu épico na base. A numeração da US é independente do número da issue.
2. Em **Issues → New issue**, escolha **História de usuário** e utilize o ID reservado.
3. Preencha narrativa, critérios, RNFs, dependências e pendências. Preserve os títulos das seções ao editar o corpo da issue.
4. Vincule a história ao épico como **sub-issue** no GitHub. O dropdown registra a escolha, mas não cria esse parentesco automaticamente; a automação confere ambos.
5. Use **A refinar** para pendências. Uma história com critérios incompletos continua visível, mas só entra em desenvolvimento quando atende à [DoR](dor-e-dod.md).

Os formulários ficam em `.github/ISSUE_TEMPLATE/historia-de-usuario.yml` e `epico.yml`. As issues
anteriores também são reconhecidas pelos campos Origem, RNFs, Dependências, Critérios de
aceitação e A refinar. Não é necessário recriá-las. IDs duplicados, RF/US incompatíveis ou
parentesco divergente interrompem a coleta, sem substituir a última publicação válida.

## <span id="121-rotina-de-atualizacao"></span>Rotina de atualização {#rotina-de-atualizacao}

| Passo | Ação | Registro |
| --- | --- | --- |
| Descoberta | Identificar necessidade, feedback ou inconsistência | Issue ou ata específica |
| Análise e decisão | Avaliar valor, regras, dependências, impacto e recorte | Decisão na issue ou na ata |
| Atualização | Alterar somente a fonte do campo afetado | Base versionada ou issue |
| Comunicação | Alinhar a mudança com quem depende dela | Review, ata ou comentário na issue |
| Memória | Registrar data, motivo e origem | Evolução do registro e histórico abaixo |

## <span id="122-propagacao-de-uma-mudanca"></span>Propagação de uma mudança {#propagacao-de-uma-mudanca}

Antes de concluir uma alteração, confira a declaração e as regras, os critérios de aceitação, os
RNFs e as dependências, o épico, o recorte de entrega e a sprint. Atualize o cronograma ou um
diagrama quando a mudança afetar essas representações. As [relações de rastreabilidade](rastreabilidade.md)
permitem localizar os elementos envolvidos; a automação não decide o escopo pelo cliente.

## Publicação e acompanhamento automático {#automacao-do-backlog}

A geração tem três passos: **consultar a API → validar os vínculos → publicar o catálogo**. O
workflow `.github/workflows/docs.yml` usa o código da `main` e executa a coleta em mudanças de
issues, comentários, PRs, pushes na `main`, execução manual e reconciliação a cada 30 minutos.
Assim, alterações de parentesco ou do Projects também podem ser recuperadas pela reconciliação.

O script `scripts/backlog.py` pagina as consultas, reconhece as issues pelo ID da US e consulta o
parentesco dos épicos. Associa PRs e commits por referências exatas à issue: `Refs #27`,
`Closes #27` ou a URL completa. Em outro repositório, use `organização/repositório#27` ou a URL.
A lista de repositórios de implementação é configurada na base; repositórios não listados não são
consultados. Se o código for movido para outro repositório, inclua-o nessa configuração.

O hook `hooks/backlog.py` gera os registros em memória durante o build. A coleta nunca altera
issues, não cria histórias, não reescreve o Markdown e não faz commits automáticos na `main`.
Uma falha de API ou validação impede uma nova publicação; não transforma ausência de dados em
conclusão nem sobrescreve o último snapshot válido.

**Conclusão é diferente de evidência de implementação.** PR integrado, commit vinculado ou issue
encerrada não comprovam, sozinhos, a DoD. Para contar como concluída, a US precisa ter a situação
Concluído, a confirmação da DoD e um link HTTPS de evidência de verificação/validação. Na falta
disso, o catálogo informa que a conclusão precisa ser confirmada. O progresso do épico conta
somente histórias com essa confirmação.

O acesso às issues e aos PRs usa `GITHUB_TOKEN`. Para consultar o status do Project da organização,
configure o secret **`BACKLOG_PROJECT_TOKEN`** com leitura do Project e dos repositórios envolvidos.
Sem ele, a geração continua funcionando com as informações das issues, as evidências e o
planejamento, sem presumir o status do quadro. Quando disponível, o status do Projects tem precedência, evitando repetir manualmente as mudanças
do quadro na issue. Sem ele, é utilizado o campo da issue; na falta de ambos, evidências indicam
implementação/revisão sem inferir aceite.

Para conferir localmente:

```bash
python -m pip install -r requirements-docs.txt
python scripts/backlog.py sync
python scripts/backlog.py check
python -m unittest discover -s tests -v
mkdocs build --strict
python scripts/check_links.py site
```

Sem executar `sync`, o build funciona com o inventário completo e informa a ausência de coleta.
As validações de PRs são executadas sem secrets e sem publicação. Os formulários e os gatilhos
passam a estar disponíveis depois que os arquivos forem integrados à branch padrão.

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

## <span id="124-pendencias-de-escopo-em-aberto"></span>Pendências de escopo em aberto {#pendencias-de-escopo-em-aberto}

As pendências vigentes estão no [recorte do catálogo](requisitos-de-software.md#pontos-em-aberto-do-recorte)
e nos próprios registros das histórias. Elas não são reproduzidas em uma segunda lista nesta página.

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
