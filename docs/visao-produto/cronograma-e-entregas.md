# Cronograma e entregas

## 6 Cronograma e entregas

A partir da estratégia de desenvolvimento ágil estabelecida para o projeto **TSI Peças**, o semestre foi organizado em sprints de duas semanas, ancoradas nas quintas-feiras em semanas alternadas. A Sprint 0 é excepcional, com 17 dias, por cobrir a formação da equipe, a descoberta do domínio e a elaboração do documento de visão. O planejamento é preliminar e será atualizado ao final de cada sprint com base no progresso real e no feedback do cliente.



| Sprint | Início | Fim | Objetivo principal | CPs | Entregas esperadas | Validação do cliente |
|--------|--------|-----|--------------------|-----|--------------------|----------------------|
| **0** | 24/08/2026 | 10/09/2026 | Compreender o domínio de autopeças, definir o escopo do produto e preparar o ambiente de desenvolvimento | — | Documento de Visão do Produto e Projeto (seções 1 a 7); Rich Picture; Mapa de Stakeholders; ambiente configurado (Docker, Supabase, Vercel, Render); repositório e pipeline de CI estruturados | Validação da viabilidade do projeto: o proprietário confirma que os problemas e as necessidades descritos refletem a realidade da loja |
| **1** | 11/09/2026 | 24/09/2026 | Elicitar, analisar e declarar os requisitos do sistema a partir das CPs revisadas | — | Glossário do domínio de autopeças; catálogo de regras de negócio; funcionalidades derivadas das CPs; início do backlog do produto | Apresentação dos requisitos e funcionalidades levantados ao proprietário para alinhamento |
| **2** | 25/09/2026 | 08/10/2026 | Concluir a especificação do MVP e iniciar o desenvolvimento da fundação do catálogo | CP1 (início) | Requisitos funcionais e não funcionais; DoR e DoD; backlog priorizado com MVP definido; primeiros casos de uso da CP1 implementados; pipeline de CI validado com os primeiros testes unitários | Validação do escopo e dos critérios de aceite do MVP com o proprietário |
| **3** | 09/10/2026 | 22/10/2026 | Entregar a fundação do produto: catálogo de peças organizado e controle de movimentações com saldo confiável | CP1 + CP2 | CP1 completa: cadastro, edição, inativação e busca de peças; CP2 completa: registro de entradas, saídas, ajustes e devoluções com saldo atualizado automaticamente; testes unitários das regras de saldo; integração CP1+CP2 coberta no pipeline de CI | Sprint Review: demonstração do catálogo e das movimentações com dados reais da loja |
| **4** | 23/10/2026 | 05/11/2026 | Registrar vendas em todos os canais e sincronizar o estoque com os anúncios do Mercado Livre | CP4 + CP3 | CP4: registro de vendas com preço, canal e baixa automática do estoque; CP3: associação de anúncios do ML a peças físicas, baixa automática por venda no ML e painel de status da sincronização; testes de integração CP2+CP4; testes de falha para a API do ML; débitos técnicos das sprints anteriores revisados | Sprint Review: demonstração de uma venda no balcão e de uma venda no ML com a baixa automática confirmada pelo proprietário |
| **5** | 06/11/2026 | 19/11/2026 | Entregar as capacidades de síntese do produto: planejamento de reposição e visão do desempenho do estoque e das vendas | CP5 + CP6 | CP5: lista de compras com sugestão baseada em alertas de estoque mínimo e giro, com confirmação de recebimento atualizando o estoque; CP6: relatórios de entradas, saídas e vendas por período, itens mais vendidos e desempenho por canal; evolução de CP4 com registro de frete, desconto e taxas; testes de sistema do fluxo completo cadastro → movimentação → venda → reposição | Sessão de validação com dados reais: o proprietário gera a lista de compras e verifica se as sugestões refletem a necessidade real da loja |
| **6** | 20/11/2026 | 03/12/2026 | Implantar o produto em produção, migrar os dados existentes, treinar o proprietário e estabilizar o sistema | — | Migração das planilhas para o sistema; carga inicial das peças com o proprietário; conferência do estoque físico versus o cadastrado; testes de aceitação formais executados com o cliente; treinamento do proprietário com manual em linguagem simples; rotina de backup configurada; deploy final em produção; janela de estabilização para correção de problemas encontrados em uso real; documentação técnica e guia de manutenção; vídeo de demonstração com o sistema em produção | Aceite formal do produto pelo proprietário após pelo menos três dias de uso real |

**Princípios do cronograma**

- **Cadência quinzenal nas quintas-feiras:** as sprints de 1 a 6 possuem duração padrão de 14 dias, encerrando sempre em uma quinta-feira em semanas alternadas. A Sprint 0 é excepcional, com 17 dias, por cobrir a formação da equipe e a elaboração do documento de visão.
- **Cobertura das CPs:** as CPs do MVP (CP1 a CP6) estão distribuídas progressivamente pelas sprints de desenvolvimento, agrupadas por dependência e relevância para o produto funcional.
- **Sprint 6 sem CPs novas:** dedicada à implantação, migração, treinamento e estabilização, com margem real para correções antes da entrega final.
- **Validação do cliente foca em negócio:** o proprietário valida se o produto atende à operação da loja; decisões técnicas são responsabilidade da equipe.
- **Responsabilidade coletiva:** todas as entregas de cada sprint são responsabilidade de toda a equipe. O Product Owner coordena as validações com o cliente ao final de cada sprint. A atribuição individual de tarefas ocorre no planejamento interno de cada sprint, registrado no Jira.
- **CP9 — Integridade e usabilidade:** não ocupa uma sprint isolada; orienta decisões técnicas e de interface em todas as sprints de desenvolvimento, garantindo consistência dos dados e uso adequado em dispositivos móveis durante a operação da loja.

## Versionamento

| Versão | Data | Descrição | Autor(es/as) |
| :----: | :--: | --- | --- |
| 1.0 | 04/09/2026 | Iniciação do documento | [Thiago Gomes](https://github.com/thgomxs) |
| 1.1 | 07/09/2026 | Adição da tabela de Cronograma de Sprints | [Bruno Ferreira](https://github.com/brunnf) |
| 1.2 | 21/09/2026 | Reestruturação completa do cronograma: cadência quinzenal nas quintas-feiras, novas CPs (CP1–CP9), agrupamento por dependência, inclusão de atividades de implantação e marco de especificação | [Bruno Ferreira](https://github.com/brunnf) |
