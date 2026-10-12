# Intervenção social

## 3 Intervenção social

A introdução de um sistema de software em uma organização nunca é um evento puramente técnico; trata-se de uma intervenção sociotécnica que altera práticas cotidianas, fluxos de informação, rotinas de trabalho e a própria dinâmica do negócio. No contexto da TSI Peças — uma microempresa do setor de autopeças operada e administrada exclusivamente por seu proprietário, Antônio Marcos —, a implantação de uma solução digital de controle de estoque substitui práticas manuais consolidadas há anos, apoiadas na memória operacional e em planilhas parciais do Excel.

Essa intervenção visa reestruturar a operação do negócio para conferir previsibilidade e confiabilidade ao estoque. Contudo, em uma estrutura de operador único, qualquer atrito ou rigidez tecnológica repercute diretamente sobre a capacidade de atendimento ao cliente final e sobre a sobrecarga de trabalho do proprietário. Assim, a engenharia de requisitos deve mapear com rigor tanto os impactos pretendidos quanto os efeitos emergentes e os riscos operacionais, formulando decisões concretas de projeto e requisitos capazes de mitigar vulnerabilidades e promover a sustentabilidade da solução.

### 3.1 Impactos pretendidos

Os impactos pretendidos representam as mudanças positivas e os ganhos operacionais planejados para o negócio e para o operador:

- **Redução do esforço e do tempo operacional:** diminuir expressivamente o tempo gasto na localização de itens e na consulta de disponibilidade (que hoje pode chegar a 1 hora em casos de dúvidas complexas de aplicação) e no cadastro de novas peças, liberando o proprietário para atividades comerciais e de atendimento.
- **Confiabilidade da informação e mitigação de divergências:** mitigar significativamente a frequência de divergências entre o estoque físico e o estoque registrado (historicamente ocorrendo de 1 a 2 vezes por mês), prevenindo perdas financeiras por falta de itens e reduzindo o cancelamento de pedidos.
- **Proteção da reputação nos canais de venda:** diminuir os cancelamentos de pedidos no Mercado Livre — canal que concentra aproximadamente 99% das vendas da empresa —, preservando os indicadores de reputação exigidos pela plataforma e mantendo a competitividade da loja.
- **Padronização e centralização da base de conhecimento:** estabelecer uma fonte única e estruturada de dados sobre códigos de fabricantes e aplicações veiculares, superando a fragmentação do conhecimento hoje disperso em planilhas parciais e anotações informais.
- **Melhoria da dinâmica de trabalho e bem-estar:** reduzir o estresse operacional e a sobrecarga de tarefas acumuladas por um operador único, proporcionando previsibilidade e tranquilidade na gestão diária da loja física e dos pedidos remotos.

### 3.2 Efeitos emergentes, riscos e desafios de adoção

A inserção da ferramenta na rotina diária da TSI Peças pode suscitar desdobramentos não previstos, reações de resistência e novos pontos de vulnerabilidade operacional. Os efeitos emergentes e riscos identificados na dinâmica sociotécnica do cliente compreendem:

| ID | Efeito Emergente / Risco | Descrição do Desafio | Impacto Potencial na Operação |
| :-: | --- | --- | --- |
| **R01** | **Resistência e sobrecarga por digitação manual** | Sensação de burocratização e aumento do trabalho caso o registro de entradas, vendas e movimentações exija etapas complexas ou formulários extensos. | Abandono do sistema e retorno aos métodos informais caso a ferramenta dispute a atenção do operador durante o atendimento presencial no balcão. |
| **R02** | **Indisponibilidade de internet ou sistema (loja inoperante)** | Falhas de conexão à internet na loja física ou interrupções temporárias de serviço dos servidores em nuvem onde a aplicação está hospedada. | Impossibilidade de consultar disponibilidade ou registrar baixas em tempo real, gerando atrasos no balcão ou descompasso transitório de estoque. |
| **R03** | **Perda ou corrupção de dados** | Incidentes técnicos na infraestrutura, falhas de sincronização no banco de dados ou exclusão acidental de registros pelo usuário. | Perda de integridade da base cadastral de autopeças e do saldo de estoque, gerando desconfiança irreversível no sistema. |
| **R04** | **Duplicidade temporária (sistema vs. planilhas legadas)** | Manutenção simultânea do controle nas planilhas antigas e no novo software por insegurança ou hábito na fase inicial de transição. | Informações conflitantes entre bases distintas, retrabalho de atualização em dobro e divergência acelerada do saldo real de itens. |
| **R05** | **Migração incorreta dos registros existentes** | Importação direta de dados das planilhas legadas que contenham duplicidades, códigos incompletos ou estoques desatualizados (~80% das peças antigas ainda não catalogadas formalmente). | Contaminação inicial do banco de dados, propagando dados imprecisos para o novo sistema desde o primeiro dia de operação. |
| **R06** | **Tratamento inadequado de exceções (cancelamentos, perdas e divergências)** | Dificuldade ou ausência de mecanismos ágeis para reverter baixas quando uma venda for cancelada no Mercado Livre ou quando ocorrer divergência na contagem física de estoque. | Omissão no reajuste do saldo e divergência progressiva entre os dados do sistema e o estoque físico na prateleira. |
| **R07** | **Assincronia no registro de vendas externas (Mercado Livre)** | Como o MVP não contempla integração automatizada via API com o Mercado Livre, as vendas na plataforma demandam baixa manual por parte do operador. | Atraso no lançamento manual da venda online, criando uma janela de risco na qual a mesma peça pode ser comercializada simultaneamente no balcão. |
| **R08** | **Dependência de serviços de nuvem e custos futuros** | Utilização de infraestrutura como serviço (Supabase, Vercel, Render) sujeita a limites de planos gratuitos (*free-tier*) e políticas comerciais de terceiros proprietários. | Risco de cobranças imprevistas, bloqueio por limite de tráfego/armazenamento ou lentidão caso os recursos atinjam cotas contratuais. |
| **R09** | **Descontinuidade de suporte após o encerramento da disciplina** | Conclusão do semestre acadêmico da equipe de desenvolvimento da universidade, cessando o suporte direto e o desenvolvimento evolutivo. | Desamparo técnico do cliente caso surjam falhas críticas, necessidade de correções de bugs ou adaptações futuras de regras de negócio. |
| **R10** | **Dependência excessiva e perda de autonomia operacional** | Dependência crítica do software para tarefas cotidianas que antes eram conduzidas pelo conhecimento tácito do operador. | Vulnerabilidade da loja a qualquer intercorrência operacional que envolva a utilização de dispositivos eletrônicos. |

### 3.3 Decisões de projeto e requisitos derivados da intervenção

Para transformar a análise dos riscos e efeitos emergentes em medidas práticas de engenharia de software e gestão de produto, foram formuladas decisões de arquitetura, requisitos de software (funcionais e não funcionais) e procedimentos operacionais padronizados (POP). As soluções do sistema apoiam-se estritamente nos **13 Requisitos Funcionais selecionados para o MVP** (RF01, RF02, RF03, RF04, RF05, RF06, RF08, RF09, RF10, RF12, RF14, RF15 e RF16) e nos Requisitos Não Funcionais transversais (RNF01 a RNF05), explicitando quando determinada funcionalidade constitui requisito condicionado ou evolução futura:

#### D01 — Confiabilidade de dados e rotinas de backup de infraestrutura (mitigação de R03)
- **Decisão técnica de infraestrutura no MVP:** O banco de dados relacional em nuvem (PostgreSQL gerenciado pelo Supabase) conta com rotinas automatizadas de backup no provedor (*point-in-time recovery* no plano padrão), cuja configuração é preparada e a restauração é testada pela equipe na **Sprint 5**, sendo ativada em produção no início da **Sprint 6**.
- **Requisito não funcional associado:** Essa salvaguarda de infraestrutura sustenta o **RNF02 (Tolerância a Falhas de Conexão)**, cujo critério verificável estabelece a recuperação de estado com **0% de perda ou duplicidade de dados** em operações confirmadas ou interrompidas por falhas de rede.
- **Distinção com requisitos de exportação:** O backup é uma rotina técnica de infraestrutura para recuperação de desastres (*disaster recovery*), e não uma tela de usuário. A exportação manual de relatórios em `.xlsx` e PDF (**RF27**) foi classificada na priorização do backlog com Score 1 como **evolução futura (fora do MVP)**. Portanto, a mitigação de perda de dados do MVP não depende de exportações manuais, apoiando-se exclusivamente na resiliência da infraestrutura de banco e nos procedimentos de restauração testados.

#### D02 — Rastreabilidade de movimentações e integridade do saldo (mitigação de R04, R06 e R10)
- **Decisão técnica:** Nenhuma movimentação de estoque é destrutiva; os saldos são calculados e mantidos consistentes por meio de registros de transações de entrada, saída e ajuste.
- **Requisitos funcionais do MVP:** No escopo do MVP, a rastreabilidade do estoque é garantida pelas operações que afetam o saldo e pelo filtro temporal de registros:
  - **RF12 (Consultar saldo de peça — no MVP, Sprint 4):** exibe a quantidade física total disponível atualizada;
  - **RF14 (Filtrar histórico por período — no MVP, Sprint 5):** permite ao usuário filtrar as movimentações ocorridas em um intervalo de datas para conferência e auditoria de divergências;
  - **Observação sobre dependência de escopo:** O requisito **RF13 (Consultar histórico de movimentações da peça)** foi classificado no backlog com Score 2 como **requisito condicionado à capacidade da equipe (fora do cronograma do MVP)**. Dessa forma, a mitigação operacional de auditoria no MVP é provida diretamente pelas listagens das movimentações de entradas (**RF08**), saídas (**RF09**), ajustes (**RF10**), vendas (**RF15**) e cancelamentos (**RF16**), combinadas ao filtro de período (**RF14**), sem depender de telas analíticas que ficaram fora do MVP.

#### D03 — Interface para ajustes manuais e reversão de vendas (mitigação de R06 e R07)
- **Decisão técnica:** Inclusão no MVP de operações explícitas e reversíveis para correções de contagem física e cancelamentos de pedidos.
- **Requisitos funcionais do MVP:** O tratamento de exceções é coberto por:
  - **RF16 (Cancelar venda — no MVP, Sprint 5):** permite ao Administrador cancelar uma venda previamente registrada (por exemplo, cancelada no Mercado Livre), restabelecendo automaticamente ao estoque as quantidades que haviam sido baixadas;
  - **RF10 (Registrar ajuste de inventário — no MVP, Sprint 5):** permite ao Administrador registrar diferenças físicas de quantidade (positivas ou negativas) com preenchimento obrigatório de justificativa (ex.: peça danificada, contagem incorreta);
  - **RF09 (Registrar saída manual — no MVP, Sprint 5):** permite registrar saídas de peças que não decorram de venda comercial, registrando data, quantidade e motivo.
- **Observação sobre devoluções:** O requisito **RF11 (Registrar devolução de peça vinculada a uma venda)** recebeu Score 3 e permaneceu **condicionado à capacidade (fora do MVP)**. Operacionalmente, devoluções no balcão durante a operação do MVP serão tratadas pelo cancelamento da venda (**RF16**) ou pelo ajuste de inventário justificado (**RF10**).

#### D04 — Redução de etapas e usabilidade para operador único (mitigação de R01 e R07)
- **Decisão de design:** O fluxo de busca e registro de vendas é otimizado para operação rápida, viável diretamente em computadores ou dispositivos móveis no balcão da loja.
- **Requisitos e critérios verificáveis do MVP:**
  - **RF04 (Buscar peça — no MVP, Sprint 4):** localização ágil por código do fabricante, nome, categoria ou aplicação veicular;
  - **RF15 (Registrar venda — no MVP, Sprint 5):** registro direto da venda com identificação obrigatória do canal de origem (Mercado Livre, balcão ou contato direto) e baixa imediata no saldo;
  - **RNF01 (Usabilidade em dispositivos móveis):** conformidade com **WCAG 2.1 AA** e área de toque mínima de **44×44 pixels CSS** em larguras de viewport de 360px a 428px CSS em orientação retrato;
  - **RNF04 (Desempenho de resposta):** tempo de resposta **P95 ≤ 3 segundos** para consultas de catálogo e saldo sob conexão mínima de 10 Mbps.

#### D05 — Protocolo de operação degradada e contingência (mitigação de R02)
- **Prática de processo (POP):** Em caso de queda de energia ou interrupção de internet na loja física, adota-se um procedimento operacional padrão: o operador utiliza um formulário físico padronizado (*Talonário de Contingência*) para anotar o código do fabricante da peça vendida, o canal e a quantidade.
- **Tratamento no sistema (MVP):** Ao restabelecer a conectividade, o operador registra as vendas acumuladas sequencialmente pelo fluxo normal do **RF15 (Registrar venda)**. A recuperabilidade das operações e a prevenção de duplicidades por instabilidade de rede são amparadas pelo **RNF02 (Tolerância a Falhas de Conexão)**.

#### D06 — Carga inicial e importação assistida de planilhas (mitigação de R05)
- **Decisão técnica:** Substituição do cadastro manual de centenas de itens por procedimento automatizado de carga de dados.
- **Requisitos funcionais do MVP e procedimento:**
  - **RF02 (Importar peças via planilha — no MVP, Sprint 4):** permite ao Administrador selecionar arquivo `.xlsx` de peças, validar os registros e cadastrá-los em lote, sem sobrescrever peças já cadastradas com o mesmo código do fabricante;
  - **Procedimento ensaiado e conferido:** A Sprint 4 realiza o ensaio da importação com uma amostra da planilha atual do proprietário; na **Sprint 6**, a carga real dos cadastros de peças é realizada via RF02, seguida pelo estabelecimento dos saldos iniciais via entrada (**RF08**) e ajuste (**RF10**), com conferência física obrigatória junto ao proprietário antes do início da operação real.

#### D07 — Implantação gradual rigorosamente alinhada ao cronograma de sprints (mitigação de R04 e R05)
- **Estratégia de implantação:** A transição é conduzida de forma progressiva e iterativa, estruturada exatamente sobre as sprints e os 13 RFs do MVP definidos no cronograma oficial do projeto (Seção 6):
  1. *Sprint 3 (09/10/2026 a 22/10/2026) — Fundação do Catálogo:* Implementação dos requisitos de catálogo (**RF01**: cadastro, **RF05**: edição e **RF06**: status ativo/inativo). Demonstração na Sprint Review com dados reais da loja;
  2. *Sprint 4 (23/10/2026 a 05/11/2026) — Catálogo Completo, Importação e Saldo:* Entrega da associação veicular (**RF03**), busca (**RF04**), importação em lote (**RF02**), entradas (**RF08**) e consulta de saldo (**RF12**). Realização do **ensaio da carga inicial com uma amostra da planilha atual** e definição do procedimento de registro dos saldos;
  3. *Sprint 5 (06/11/2026 a 19/11/2026) — Movimentações, Vendas e Validação do MVP:* Conclusão da saída manual (**RF09**), ajuste de inventário (**RF10**), filtro de movimentações por período (**RF14**), registro de vendas (**RF15**) e cancelamento (**RF16**). Realização da **sessão de aceitação do MVP com o proprietário simulando fluxos com dados de teste**; preparação da infraestrutura de produção, elaboração do manual preliminar e realização do teste da rotina de backup e restauração;
  4. *Sprint 6 (20/11/2026 a 03/12/2026) — Deploy em Produção, Carga Real, Treinamento e Estabilização:* No início da sprint, realiza-se o **deploy do MVP em produção** e a ativação da rotina de backup. Em seguida, executa-se a **carga inicial real dos cadastros de peças via RF02** e o registro dos saldos iniciais (RF08 e RF10), com **conferência física completa dos saldos junto ao proprietário** antes do início da operação real. Conduz-se o **treinamento com o manual finalizado em linguagem simples**, mantendo o restante da sprint como janela de estabilização em uso real até a assinatura do termo de aceite e a descontinuação definitiva das planilhas legadas.

#### D08 — Capacitação, manual simplificado e onboarding visual (mitigação de R01 e R10)
- **Prática de processo e treinamento:** Elaboração de material didático adaptado ao perfil do operador único:
  - *Manual em linguagem simples:* Elaboração da versão preliminar na Sprint 5 e entrega da versão finalizada na Sprint 6;
  - *Guia Rápido de Balcão (One-Page):* Folha plastificada com instruções visuais diretas dos fluxos essenciais (busca, venda e ajuste);
  - *Treinamento presencial:* Sessões práticas de simulação na Sprint 5 e acompanhamento assistido no início da Sprint 6 durante a operação real.

#### D09 — Sustentabilidade tecnológica: separação entre código aberto e infraestrutura proprietária (mitigação de R08 e R09)
- **Distinção entre tecnologias abertas e serviços proprietários:**
  - *Tecnologias de desenvolvimento e código-fonte:* A aplicação utiliza linguagens e bibliotecas abertas (React, Python com FastAPI e PostgreSQL). O repositório acadêmico do projeto é público no GitHub sob licença permissiva MIT, assegurando que o código possa ser auditado, adaptado e mantido no futuro;
  - *Infraestrutura e hospedagem de terceiros (serviços proprietários em plano gratuito):* A hospedagem utiliza plataformas proprietárias operadas em suas camadas gratuitas (*free-tier*): **Vercel** (deploy do front-end), **Render** (deploy do back-end) e **Supabase** (gerenciamento do banco PostgreSQL).
- **Alinhamento com o cliente e transferência de titularidade:**
  - O cliente é formalmente informado de que as credenciais e dados de negócio são estritamente privados e protegidos por autenticação com hash bcrypt e tráfego HTTPS/TLS 1.2+ (**RNF05**);
  - Na Sprint 6, a equipe finaliza o *Guia de Manutenção* e transfere formalmente a titularidade das contas desses serviços em nuvem (Vercel, Render e Supabase) para o proprietário, garantindo autonomia operacional após o encerramento da disciplina.

### 3.4 Matriz de rastreabilidade: riscos versus decisões e requisitos

A tabela a seguir consolida o mapeamento bidirecional entre os riscos e efeitos emergentes identificados e as decisões, requisitos e práticas de processo formulados no escopo do projeto, identificando claramente quais requisitos compõem o MVP e quais constituem evoluções ou condições futuras:

| Efeito Emergente / Risco | Decisão / Resposta Formulada | Tipo de Solução | Requisito / Artefato do Escopo | Status no Escopo |
| --- | --- | :---: | --- | :---: |
| **R01** (Resistência e sobrecarga operacional) | Interface ágil para operador único com múltiplos filtros e baixa direta | Requisito Funcional / RNF | RF04 (CP1), RF15 (CP3), RNF01, RNF04 | **MVP** (Sprints 4 e 5) |
| **R02** (Queda de conexão / Loja inoperante) | Protocolo de contingência manual e tolerância a falhas de conexão | Prática de Processo (POP) / RNF | RNF02, lançamento via RF15 | **MVP** (Sprint 5) |
| **R03** (Risco de perda de dados) | Rotinas automatizadas de backup no banco e testes de restauração | Decisão de Infraestrutura / RNF | Backup Supabase, RNF02 (RF27 como evolução futura) | **MVP** (Sprints 5 e 6) |
| **R04** (Duplicidade entre sistema e planilhas) | Implantação gradual articulada por sprints e descontinuação orientada | Gestão de Produto / Rollout | Alinhamento com Sprints 3 a 6 do Cronograma | **MVP** (Sprints 3 a 6) |
| **R05** (Migração incorreta de dados legados) | Importação em lote via planilha, ensaio de carga e conferência física | Requisito Funcional / Prática | RF02 (CP1), RF08, RF10 e conferência | **MVP** (Sprints 4 e 6) |
| **R06** (Tratamento de exceções e divergências) | Comandos dedicados de cancelamento de venda e ajuste de inventário | Requisitos Funcionais | RF16 (CP3), RF10 (CP2) (RF11 como condicionado) | **MVP** (Sprint 5) |
| **R07** (Assincronia nas vendas do Mercado Livre) | Registro de vendas com canal de origem obrigatório e baixa imediata | Requisito Funcional | RF15 (CP3) | **MVP** (Sprint 5) |
| **R08** (Custos e dependência de nuvem) | Infraestrutura em serviços de terceiros (*free-tier*) e desacoplamento | Decisão Arquitetural | Hospedagem Vercel / Render / Supabase | **MVP** (Sprints 5 e 6) |
| **R09** (Encerramento do suporte pela disciplina) | Repositório público (MIT), transferência de titularidade e guia | Prática de Governança / Entrega | Guia de Manutenção e Código Aberto | **MVP** (Sprint 6) |
| **R10** (Insegurança ou dependência do sistema) | Integridade auditável, filtro por período e manual em linguagem simples | Requisito Funcional / Treinamento | RF12, RF14 (CP2), Manual do Proprietário (RF13 condicionado) | **MVP** (Sprints 4, 5 e 6) |

Assim, a intervenção social deixa de ser uma reflexão puramente teórica e passa a direcionar ativamente as decisões de engenharia de software, articulando-se com a especificação de requisitos do MVP, o cronograma quinzenal e a arquitetura do sistema TSI Peças.

## Versionamento

| Versão | Data | Descrição | Autor(es/as) |
| :----: | :--: | --- | --- |
| 1.0 | 04/09/2026 | Iniciação do documento | [Thiago Gomes](https://github.com/thgomxs) |
| 1.1 | 07/09/2026 | Preenchimento do tópico 3 e revisão textual | [Leonardo Lopes](https://github.com/LeonardoLopesJr) |
| 1.2 | 28/09/2026 | Correções da issue #5: incorporação completa dos riscos operacionais e técnicos, definição de requisitos concretos (backup, auditoria, estornos, contingência, migração e transição) e matriz de rastreabilidade | [Leonardo Lopes](https://github.com/LeonardoLopesJr) |
| 1.3 | 11/10/2026 | Atendimento aos feedbacks da PR #17: separação entre backup técnico e exportação (RF27), correção da distinção entre código aberto e infraestrutura proprietária free-tier (D09), alinhamento de D07 com o cronograma de Sprints (3 a 6), remoção de termos absolutistas e atualização da matriz de rastreabilidade com as 8 CPs e RFs/RNFs oficiais | [Leonardo Lopes](https://github.com/LeonardoLopesJr) |
| 1.4 | 12/10/2026 | Alinhamento rigoroso com a versão aprovada do cronograma (Seção 6): atualização das datas oficiais das Sprints 3 a 6 e ancoragem exclusiva nos 13 RFs do MVP; revisão das mitigações para desvincular o MVP de requisitos condicionados (distinção entre RF14 no MVP e RF13 condicionado; tratamento de exceções via RF10 e RF16 sem depender de RF11; e esclarecimento de que o backup do MVP é de infraestrutura, com RF27 sendo evolução futura); e inclusão da coluna de status no escopo na matriz de rastreabilidade | [Leonardo Lopes](https://github.com/LeonardoLopesJr) |
