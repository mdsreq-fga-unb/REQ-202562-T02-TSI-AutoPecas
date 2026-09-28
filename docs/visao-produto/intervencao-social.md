# Intervenção social

## 3 Intervenção social

A introdução de um sistema de software em uma organização nunca é um evento puramente técnico; trata-se de uma intervenção sociotécnica que altera práticas cotidianas, fluxos de informação, rotinas de trabalho e a própria dinâmica do negócio. No contexto da TSI Peças — uma microempresa do setor de autopeças operada e administrada exclusivamente por seu proprietário, Antônio Marcos —, a implantação de uma solução digital de controle de estoque substitui práticas manuais consolidadas há anos, apoiadas na memória operacional e em planilhas parciais do Excel.

Essa intervenção visa reestruturar a operação do negócio para conferir previsibilidade e confiabilidade ao estoque. Contudo, em uma estrutura de operador único, qualquer atrito ou rigidez tecnológica repercute diretamente sobre a capacidade de atendimento ao cliente final e sobre a sobrecarga de trabalho do proprietário. Assim, a engenharia de requisitos deve mapear com rigor tanto os impactos pretendidos quanto os efeitos emergentes e os riscos operacionais, formulando decisões concretas de projeto e requisitos capazes de mitigar vulnerabilidades e assegurar a sustentabilidade da solução.

### 3.1 Impactos pretendidos

Os impactos pretendidos representam as mudanças positivas e os ganhos operacionais planejados para o negócio e para o operador:

- **Redução do esforço e do tempo operacional:** diminuir expressivamente o tempo gasto na localização de itens e na consulta de disponibilidade (que hoje pode chegar a 1 hora em casos de dúvidas complexas de aplicação) e no cadastro de novas peças, liberando o proprietário para atividades comerciais e de atendimento.
- **Confiabilidade da informação e eliminação de divergências:** erradicar as discrepâncias entre o estoque físico e o estoque registrado, prevenindo perdas financeiras decorrentes da venda de peças esgotadas ou do esquecimento de itens armazenados no estoque físico.
- **Proteção da reputação nos canais de venda:** reduzir os cancelamentos de pedidos no Mercado Livre — canal que concentra aproximadamente 99% das vendas da empresa —, preservando os indicadores de reputação exigidos pela plataforma e mantendo a competitividade da loja.
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
| **R08** | **Dependência de serviços de nuvem e custos futuros** | Utilização de infraestrutura como serviço (Supabase, Vercel, Render) sujeita a limites de planos gratuitos (*free-tier*) e políticas comerciais de terceiros. | Risco de cobranças imprevistas, bloqueio por limite de tráfego/armazenamento ou lentidão caso os recursos atinjam cotas contratuais. |
| **R09** | **Descontinuidade de suporte após o encerramento da disciplina** | Conclusão do semestre acadêmico da equipe de desenvolvimento da universidade, cessando o suporte direto e o desenvolvimento evolutivo. | Desamparo técnico do cliente caso surjam falhas críticas, necessidade de correções de bugs ou adaptações futuras de regras de negócio. |
| **R10** | **Dependência excessiva e perda de autonomia operacional** | Dependência crítica do software para tarefas cotidianas que antes eram conduzidas pelo conhecimento tácito do operador. | Vulnerabilidade da loja a qualquer intercorrência operacional que envolva a utilização de dispositivos eletrônicos. |

### 3.3 Decisões de projeto e requisitos derivados da intervenção

Para transformar a análise dos riscos e efeitos emergentes em medidas práticas de engenharia de software e gestão de produto, foram formuladas decisões de arquitetura, requisitos de software e procedimentos operacionais padronizados (POP):

#### D01 — Política de backup e recuperação de dados (mitigação de R03)
- **Decisão técnica:** O banco de dados em nuvem (PostgreSQL gerenciado no Supabase) é configurado com rotinas diárias automáticas de backup (*point-in-time recovery* dentro do plano padrão).
- **Requisito derivado:** O sistema disponibilizará uma funcionalidade de exportação sob demanda (*export one-click*), permitindo ao proprietário descarregar a qualquer momento a base completa de peças e movimentações em formato aberto e legível (`.CSV` e `.JSON`), garantindo custódia local dos seus próprios dados.

#### D02 — Trilha de auditoria e histórico de movimentações (mitigação de R04, R06 e R10)
- **Decisão técnica:** Nenhuma movimentação de estoque é destrutiva; os saldos são derivados de um histórico imutável de transações.
- **Requisito derivado:** O sistema registrará e exibirá um histórico completo para cada produto, detalhando data, horário, tipo de evento (entrada por compra, saída por venda em balcão, saída por venda no Mercado Livre, estorno de cancelamento, devolução ou ajuste manual), quantidade movimentada e justificativa. Essa rastreabilidade viabiliza conferência rápida caso ocorra qualquer discrepância.

#### D03 — Interface ágil para ajustes manuais e tratamento de exceções (mitigação de R06 e R07)
- **Decisão técnica:** Inclusão de fluxos nativos de estorno e ajuste de inventário na interface do usuário.
- **Requisito derivado:** A aplicação contará com comandos diretos para:
  1. *Estornar venda:* reincorporar automaticamente ao estoque uma peça cuja venda foi cancelada na plataforma externa;
  2. *Registrar devolução/troca:* permitir a entrada de peças devolvidas com marcação opcional de estado (peça íntegra para retorno ao saldo comercializável ou peça avariada/incompatível para descarte);
  3. *Ajuste rápido de inventário:* mecanismo para igualar o saldo do sistema à contagem da prateleira, exigindo apenas a indicação do motivo (ex.: "conferência física", "peça danificada").

#### D04 — Redução de cliques e foco em usabilidade para operador único (mitigação de R01 e R07)
- **Decisão de design:** O fluxo de baixa de estoque e consulta deve ser otimizado para operação rápida, viável até mesmo por smartphone ou tablet no balcão.
- **Requisito derivado:** A busca de autopeças deve possuir retorno imediato (*autocomplete* por código, fabricante ou aplicação veicular), e a baixa de uma venda deve ser concluída em no máximo três ações (localizar item $\rightarrow$ selecionar canal/quantidade $\rightarrow$ confirmar baixa). No painel inicial (*dashboard*), haverá um atalho em destaque para "Baixa rápida Mercado Livre", facilitando a atualização imediata assim que o proprietário receber a notificação da venda no marketplace.

#### D05 — Protocolo de operação degradada e contingência (mitigação de R02)
- **Procedimento operacional:** Definição de um procedimento padrão para vendas em momentos de queda de energia ou indisponibilidade de internet na loja.
- **Requisito / Ação de processo:** Criação de um modelo físico padronizado de "Talonário de Contingência" (ficha simples de preenchimento manual) onde o operador anota apenas: *Código da Peça*, *Canal de Venda* e *Valor*. No retorno da conectividade, o sistema oferecerá um modo de "Lançamento em lote de contingência", permitindo registrar as baixas acumuladas em uma única tela de forma sequencial.

#### D06 — Carga inicial e higienização assistida de planilhas (mitigação de R05)
- **Decisão técnica:** Desenvolvimento de script e módulo utilitário de importação de arquivos estruturados (`.CSV` / `.XLSX`).
- **Ação de engenharia:** Antes da inserção no banco de produção, a ferramenta executará uma rotina de validação prévia de integridade (checagem de campos obrigatórios, códigos duplicados e valores numéricos válidos), gerando um relatório visual de inconsistências para saneamento conjunto entre equipe e proprietário antes da homologação final da base.

#### D07 — Implantação gradual e período de conferência física (mitigação de R04 e R05)
- **Estratégia de implantação:** A transição não será realizada por meio de "virada de chave total" (*big bang*), mas por rollout progressivo.
- **Ação de processo:** 
  1. *Fase 1 (Piloto):* Cadastramento e operação no sistema restritos ao grupo de autopeças de maior rotatividade (itens de alto giro);
  2. *Fase 2 (Homologação assistida):* Período de 15 dias de dupla conferência, realizando inventários rotativos amostrais semanais para aferir se o saldo computado no sistema é idêntico ao estoque físico das prateleiras;
  3. *Fase 3 (Descontinuação do legado):* Desativação formal e arquivamento das planilhas de estoque após a consolidação da confiança do cliente no sistema.

#### D08 — Capacitação, manual simplificado e onboarding visual (mitigação de R01 e R10)
- **Ação de capacitação:** Elaboração de material didático direto e conciso, adaptado ao perfil do proprietário que opera sem intermediários técnicos.
- **Entregáveis de processo:**
  - *Guia Rápido de Balcão (One-Page):* Folha plastificada com instruções visuais passo a passo dos três fluxos principais (cadastrar peça, consultar disponibilidade e efetuar baixa);
  - *Sessões práticas de homologação:* Dinâmicas presenciais simulando vendas reais, trocas e ajustes antes da liberação em produção.

#### D09 — Sustentabilidade tecnológica e guia de transição pós-projeto (mitigação de R08 e R09)
- **Decisão arquitetural e legal:** O software utilizará exclusivamente tecnologias de código aberto (*open-source*), frameworks consolidados no mercado e camadas gratuitas (*free-tier*) de provedores em nuvem compatíveis com o volume de dados da TSI Peças (volume estimado inferior a 1.000 itens).
- **Entregável de encerramento:** Ao término da disciplina, a equipe entregará ao proprietário um *Dossiê de Transição e Manutenção*, contendo:
  - Documentação completa de deploy e arquitetura;
  - Acesso e titularidade das contas de hospedagem e banco de dados transferidos formalmente ao cliente;
  - Código-fonte versionado em repositório público sob licença permissiva (MIT), acompanhado de guia de instalação e boas práticas para eventual suporte por profissionais autônomos locais.

### 3.4 Matriz de rastreabilidade: riscos versus decisões e requisitos

A tabela a seguir consolida a relação direta entre cada efeito emergente/risco identificado e as respectivas respostas formuladas pela equipe de requisitos e arquitetura:

| Efeito Emergente / Risco | Decisão / Requisito Concreto | Tipo de Solução | Artefato / Seção Relacionada |
| --- | --- | :---: | --- |
| **R01** (Resistência e sobrecarga operacional) | Interface de busca rápida com autocomplete e baixa em até 3 etapas | Requisito Não Funcional (Usabilidade) / RF | Solução Proposta (CP2, CP5) |
| **R02** (Queda de conexão / Loja inoperante) | Protocolo de contingência manual e tela de lançamento em lote pós-queda | Prática Operacional / RF | Procedimento Operacional Padrão (POP) |
| **R03** (Risco de perda de dados) | Rotinas diárias de backup em nuvem e botão de exportação manual em CSV/JSON | Requisito Funcional / Decisão Arquitetural | Gestão de Infraestrutura e Banco |
| **R04** (Duplicidade entre sistema e planilhas) | Implantação gradual por categorias e descontinuação orientada do legado | Estratégia de Processo / Rollout | Planejamento de Entregas |
| **R05** (Migração incorreta de dados legados) | Módulo de importação assistida com validação de dados e saneamento prévio | Ferramenta de Apoio / RF | Carga de Dados e Catálogo (CP1) |
| **R06** (Falha em cancelamentos, trocas e devoluções) | Funcionalidades explícitas de estorno de venda e registro de devolução/troca | Requisito Funcional / Regra de Negócio | Registro de Movimentações (CP3) |
| **R07** (Assincronia nas vendas do Mercado Livre) | Atalho destacado no painel para baixa manual imediata do Mercado Livre | Requisito Funcional / Interface | Painel Inicial e Solução Proposta (CP3) |
| **R08** (Custos e dependência de nuvem) | Seleção de stack em camadas gratuitas (*free-tier*) e arquitetura desacoplada | Decisão Arquitetural | Arquitetura de Software |
| **R09** (Encerramento do suporte pela disciplina) | Dossiê de transição, transferência de titularidade e código aberto (MIT) | Prática de Governança / Entrega | Dossiê de Encerramento e Transição |
| **R10** (Insegurança ou dependência do sistema) | Guia rápido plastificado de balcão e histórico auditável de conferência | Treinamento / Requisito Funcional | Manual do Usuário e CP6 |

Assim, a intervenção social deixa de ser uma reflexão puramente teórica e passa a direcionar ativamente as decisões de engenharia de software, garantindo que o sistema atenda não apenas às regras de negócio de controle de estoque, mas às contingências humanas e operacionais reais de uma microempresa de operador único.

## Versionamento

| Versão | Data | Descrição | Autor(es/as) |
| :----: | :--: | --- | --- |
| 1.0 | 04/09/2026 | Iniciação do documento | [Thiago Gomes](https://github.com/thgomxs) |
| 1.1 | 07/09/2026 | Preenchimento do tópico 3 e revisão textual | [Leonardo Lopes](https://github.com/LeonardoLopesJr) |
| 1.2 | 28/09/2026 | Correções da issue #5: incorporação completa dos riscos operacionais e técnicos, definição de requisitos concretos (backup, auditoria, estornos, contingência, migração e transição) e matriz de rastreabilidade | [Leonardo Lopes](https://github.com/LeonardoLopesJr) |
