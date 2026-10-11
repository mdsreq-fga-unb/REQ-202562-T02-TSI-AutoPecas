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
| **R06** | **Tratamento inadequado de exceções (cancelamentos, trocas e devoluções)** | Dificuldade ou ausência de mecanismos ágeis para reverter baixas quando uma venda for cancelada no Mercado Livre ou quando ocorrer troca/devolução de peça no balcão. | Omissão no reajuste do saldo e divergência progressiva entre os dados do sistema e o estoque físico na prateleira. |
| **R07** | **Assincronia no registro de vendas externas (Mercado Livre)** | Como o MVP não contempla integração automatizada via API com o Mercado Livre, as vendas na plataforma demandam baixa manual por parte do operador. | Atraso no lançamento manual da venda online, criando uma janela de risco na qual a mesma peça pode ser comercializada simultaneamente no balcão. |
| **R08** | **Dependência de serviços de nuvem e custos futuros** | Utilização de infraestrutura como serviço (Supabase, Vercel, Render) sujeita a limites de planos gratuitos (*free-tier*) e políticas comerciais de terceiros proprietários. | Risco de cobranças imprevistas, bloqueio por limite de tráfego/armazenamento ou lentidão caso os recursos atinjam cotas contratuais. |
| **R09** | **Descontinuidade de suporte após o encerramento da disciplina** | Conclusão do semestre acadêmico da equipe de desenvolvimento da universidade, cessando o suporte direto e o desenvolvimento evolutivo. | Desamparo técnico do cliente caso surjam falhas críticas, necessidade de correções de bugs ou adaptações futuras de regras de negócio. |
| **R10** | **Dependência excessiva e perda de autonomia operacional** | Dependência crítica do software para tarefas cotidianas que antes eram conduzidas pelo conhecimento tácito do operador. | Vulnerabilidade da loja a qualquer intercorrência operacional que envolva a utilização de dispositivos eletrônicos. |

### 3.3 Decisões de projeto e requisitos derivados da intervenção

Para transformar a análise dos riscos e efeitos emergentes em medidas práticas de engenharia de software e gestão de produto, foram formuladas decisões de arquitetura, requisitos de software (funcionais e não funcionais) e procedimentos operacionais padronizados (POP):

#### D01 — Confiabilidade de dados e backup de infraestrutura (mitigação de R03)
- **Decisão técnica de infraestrutura:** O banco de dados relacional em nuvem (PostgreSQL gerenciado pelo Supabase) é configurado com rotinas diárias automatizadas de backup no próprio provedor (*point-in-time recovery* dentro do plano padrão), garantindo a restauração do ambiente em caso de falha física ou lógica.
- **Requisito não funcional associado:** Essa medida técnica de infraestrutura sustenta o **RNF02 (Tolerância a Falhas de Conexão)**, cujo critério verificável estabelece a recuperação de estado com **0% de perda ou duplicidade de dados** em operações interrompidas.
- **Diferenciação com exportação de dados:** Salienta-se que a rotina de *backup* é uma medida técnica de infraestrutura voltada à recuperação do sistema, e não um requisito de tela para o usuário final. A necessidade do proprietário de extrair dados e relatórios do negócio é tratada no escopo funcional pelo **RF27 (Exportar relatórios)**, que permite exportar os relatórios de movimentações e vendas em formatos abertos (`.xlsx` e PDF).

#### D02 — Trilha de auditoria e histórico de movimentações (mitigação de R04, R06 e R10)
- **Decisão técnica:** Nenhuma movimentação de estoque é destrutiva; os saldos são calculados a partir de um registro cronológico de transações.
- **Requisitos funcionais do escopo:** Atendido diretamente no escopo pelos requisitos da **CP2 (Controle de movimentações e saldo do estoque)**:
  - **RF13 (Consultar histórico de movimentações):** exibe na tela o histórico completo de operações da peça;
  - **RF14 (Filtrar histórico por período):** permite filtrar as movimentações por intervalo de datas para conferência rápida de divergências.

#### D03 — Interface para ajustes manuais e fluxos de exceção (mitigação de R06 e R07)
- **Decisão técnica:** Inclusão de operações explícitas para tratamento de devoluções, cancelamentos de vendas e correções físicas de inventário.
- **Requisitos funcionais do escopo:** Formalizados no escopo de requisitos:
  - **RF10 (Registrar ajuste de inventário — CP2):** permite ao Administrador registrar diferenças positivas ou negativas com preenchimento obrigatório da justificativa;
  - **RF11 (Registrar devolução de peça — CP2):** permite registrar a devolução vinculada a uma venda anterior, restabelecendo a quantidade ao saldo do estoque;
  - **RF16 (Cancelar venda — CP3):** permite ao Administrador cancelar uma venda previamente registrada, revertendo automaticamente a baixa de estoque correspondente.

#### D04 — Redução de etapas e usabilidade para operador único (mitigação de R01 e R07)
- **Decisão de design:** O fluxo de busca e registro de vendas é otimizado para operação em balcão, permitindo lançamentos rápidos no próprio smartphone ou computador.
- **Requisitos e critérios verificáveis associados:**
  - **RF04 (Buscar peça — CP1):** localização rápida por código do fabricante, nome, categoria ou aplicação veicular;
  - **RF15 (Registrar venda — CP3):** registro direto da venda com identificação do canal de origem (Mercado Livre, balcão ou contato direto) e baixa imediata no saldo;
  - **RNF01 (Usabilidade em dispositivos móveis):** conformidade com **WCAG 2.1 AA** e área de toque mínima de **44×44 pixels CSS** em larguras de 360px a 428px CSS em orientação retrato;
  - **RNF04 (Desempenho de resposta):** tempo de resposta **P95 ≤ 3 segundos** para consultas de catálogo e saldo de estoque sob conexão de 10 Mbps.

#### D05 — Protocolo de operação degradada e contingência (mitigação de R02)
- **Prática de processo (POP):** Em caso de queda de energia ou corte de conectividade à internet na loja física, adota-se um procedimento operacional padrão simples: o operador utiliza um formulário físico padronizado (*Talonário de Contingência*) para anotar o código do fabricante da peça vendida, o canal e a quantidade.
- **Tratamento no sistema:** Ao restabelecer a conexão de rede, o operador realiza o lançamento normal dessas vendas acumuladas via **RF15 (Registrar venda)**. A recuperabilidade e a integridade das transações interrompidas são regidas pelo **RNF02 (Tolerância a Falhas de Conexão)**, evitando duplicidades de requisições pendentes.

#### D06 — Carga inicial e importação assistida de planilhas (mitigação de R05)
- **Decisão técnica:** Disponibilização de rotina de importação em lote para absorver as centenas de itens já catalogados nas planilhas do Excel do cliente.
- **Requisito funcional do escopo:** Atendido diretamente pelo **RF02 (Importar peças via planilha — CP1)**, que permite ao Administrador selecionar uma planilha `.xlsx`, validar previamente os registros e cadastrá-los em lote sem sobrescrever peças já cadastradas com o mesmo código do fabricante.

#### D07 — Implantação gradual alinhada ao cronograma de sprints (mitigação de R04 e R05)
- **Estratégia de implantação:** A transição não será realizada por corte abrupto (*big bang*), mas articulada aos marcos e entregas previstos no cronograma oficial da disciplina:
  1. *Fase 1 — Piloto de Alto Giro (Sprint 3 — Entrega da Unidade 2):* Durante a **Sprint 3 (02/10 a 12/10/2026)**, com a consolidação do MVP (englobando CP1, CP2 e CP3), realiza-se a carga inicial das peças de maior giro e inicia-se o uso assistido de registro de entradas e vendas;
  2. *Fase 2 — Homologação assistida e dupla conferência (Sprints 4 e 5 — Unidade 3):* Ao longo das **Sprints 4 e 5 (13/10 a 16/11/2026)**, executa-se um período de dupla conferência entre o saldo das planilhas legadas e o saldo do sistema, realizando inventários rotativos amostrais para calibrar a acurácia dos registros com as novas funcionalidades de alertas (CP4) e facilitação de consulta (CP5);
  3. *Fase 3 — Descontinuação do controle em planilhas (Sprint 6 — Entrega da Unidade 4):* Na conclusão da **Sprint 6 (17/11 a 30/11/2026)**, com a validação final (CP6), documentação completa e aceite formal pelo cliente, arquivam-se definitivamente as planilhas manuais.

#### D08 — Capacitação, manual simplificado e onboarding visual (mitigação de R01 e R10)
- **Prática de processo e treinamento:** Elaboração de material didático voltado à realidade prática de um operador único:
  - *Guia Rápido de Balcão (One-Page):* Folha plastificada com fluxos visuais objetivos para busca, cadastro e baixa de peças;
  - *Validação contínua:* Dinâmicas presenciais e demonstrações realizadas ao término de cada sprint quinzenal, conforme previsto no cronograma de interação com o cliente, garantindo adaptação prévia antes da entrega final.

#### D09 — Sustentabilidade tecnológica: separação entre código aberto e infraestrutura proprietária (mitigação de R08 e R09)
- **Distinção entre tecnologias abertas e serviços proprietários:**
  - *Tecnologias de desenvolvimento e código-fonte:* A aplicação é construída com bibliotecas e linguagens abertas (React, Python com FastAPI e PostgreSQL). O repositório acadêmico do projeto é público no GitHub e disponibilizado sob licença permissiva MIT, assegurando que o código possa ser auditado, adaptado ou mantido no futuro por qualquer desenvolvedor;
  - *Infraestrutura e hospedagem de terceiros (serviços proprietários em plano gratuito):* A hospedagem da aplicação e a persistência não utilizam servidores próprios, mas plataformas proprietárias em nuvem operadas em seus planos gratuitos (*free-tier*): **Vercel** (deploy do front-end), **Render** (deploy do back-end) e **Supabase** (gerenciamento do banco PostgreSQL).
- **Alinhamento com o cliente e transferência de titularidade:**
  - O cliente é formalmente informado de que, embora o código da aplicação seja aberto no GitHub para fins acadêmicos e manutenibilidade, todos os dados de negócio, cadastros e credenciais ficam restritos ao banco de dados e protegidos por autenticação com hash bcrypt e tráfego HTTPS/TLS 1.2+ (**RNF05**);
  - Ao término do semestre letivo, a equipe realiza a entrega do *Dossiê de Transição e Manutenção* e transfere formalmente a titularidade das contas desses serviços em nuvem (Vercel, Render e Supabase) para o e-mail do proprietário, permitindo que ele continue operando sem custos de desenvolvimento.

### 3.4 Matriz de rastreabilidade: riscos versus decisões e requisitos

A tabela a seguir consolida o mapeamento bidirecional entre os riscos e efeitos emergentes identificados e as decisões, requisitos e práticas de processo formulados no escopo do projeto:

| Efeito Emergente / Risco | Decisão / Resposta Formulada | Tipo de Solução | Requisito / Artefato do Escopo |
| --- | --- | :---: | --- |
| **R01** (Resistência e sobrecarga operacional) | Interface ágil para operador único com múltiplos filtros e baixa direta | Requisito Funcional / RNF | RF04 (CP1), RF15 (CP3), RNF01, RNF04 |
| **R02** (Queda de conexão / Loja inoperante) | Protocolo de contingência manual e tolerância a falhas de conexão | Prática de Processo (POP) / RNF | RNF02, lançamento via RF15 |
| **R03** (Risco de perda de dados) | Backup diário automatizado em nuvem e exportação de relatórios | Decisão de Infraestrutura / RF | Supabase Backup, RNF02, RF27 (CP5) |
| **R04** (Duplicidade entre sistema e planilhas) | Implantação gradual por fases e descontinuação orientada do legado | Gestão de Produto / Rollout | Alinhamento com Sprints 3 a 6 (Seção 6) |
| **R05** (Migração incorreta de dados legados) | Importação em lote via planilha com validação prévia de código | Requisito Funcional | RF02 (CP1) |
| **R06** (Falha em cancelamentos, trocas e devoluções) | Comandos dedicados de ajuste, devolução vinculada e cancelamento | Requisitos Funcionais | RF10 (CP2), RF11 (CP2), RF16 (CP3) |
| **R07** (Assincronia nas vendas do Mercado Livre) | Registro de vendas categorizado por canal de origem e histórico | Requisito Funcional | RF15 (CP3), RF13 (CP2), RF26 (CP5) |
| **R08** (Custos e dependência de nuvem) | Infraestrutura em serviços de terceiros (*free-tier*) e desacoplamento | Decisão Arquitetural | Hospedagem Vercel / Render / Supabase |
| **R09** (Encerramento do suporte pela disciplina) | Repositório público (MIT), transferência de titularidade e dossiê | Prática de Governança / Entrega | Dossiê de Transição e Código Aberto |
| **R10** (Insegurança ou dependência do sistema) | Histórico de movimentações auditável e guia rápido plastificado | Requisito Funcional / Treinamento | RF13, RF14 (CP2), Manual de Balcão |

Assim, a intervenção social deixa de ser uma reflexão puramente teórica e passa a direcionar ativamente as decisões de engenharia de software, articulando-se com a especificação de requisitos, o cronograma e a arquitetura do sistema TSI Peças.

## Versionamento

| Versão | Data | Descrição | Autor(es/as) |
| :----: | :--: | --- | --- |
| 1.0 | 04/09/2026 | Iniciação do documento | [Thiago Gomes](https://github.com/thgomxs) |
| 1.1 | 07/09/2026 | Preenchimento do tópico 3 e revisão textual | [Leonardo Lopes](https://github.com/LeonardoLopesJr) |
| 1.2 | 28/09/2026 | Correções da issue #5: incorporação completa dos riscos operacionais e técnicos, definição de requisitos concretos (backup, auditoria, estornos, contingência, migração e transição) e matriz de rastreabilidade | [Leonardo Lopes](https://github.com/LeonardoLopesJr) |
| 1.3 | 11/10/2026 | Atendimento aos feedbacks da PR #17: separação entre backup técnico e exportação (RF27), correção da distinção entre código aberto e infraestrutura proprietária free-tier (D09), alinhamento de D07 com o cronograma de Sprints (3 a 6), remoção de termos absolutistas e atualização da matriz de rastreabilidade com as 8 CPs e RFs/RNFs oficiais | [Leonardo Lopes](https://github.com/LeonardoLopesJr) |
