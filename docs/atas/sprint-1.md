# Sprint 1

- **Data:** 2026-09-17
- **Tipo:** Revisão com stakeholders (entrevista com o cliente), seguida de reunião interna de planejamento da equipe (com apoio da monitora Yasmin)
- **Participantes:** Antônio Marcos (proprietário da loja de autopeças — cliente/stakeholder); Equipe de requisitos (João, Luiz, Bruno, Thiago, Leonardo, Rodrigo); na parte interna (após a saída do cliente) também participou Yasmin (monitora)
- **Artefatos avaliados:** Nenhum artefato formal entregue — entrevista de levantamento de requisitos (processo de compra, estoque, vendas e emissão fiscal do cliente, apoiado em planilhas próprias do cliente: compras, financeiro e vendas); documento interno de características de produto (em elaboração)

## Parte 1 — Entrevista com o cliente

### Feedback (Stakeholder Requests)

- O processo atual é todo manual, baseado em três planilhas Excel (compras, financeiro, vendas) que não se comunicam automaticamente; o fechamento entre elas também é manual.
- O maior problema relatado é o controle de estoque: como uma mesma peça costuma gerar 2–3 anúncios distintos no Mercado Livre (por servir a vários veículos), o controle físico se perde e ocorrem vendas acima do estoque disponível, exigindo cancelamentos manuais que prejudicam a reputação da loja.
- As compras são feitas a cada 15 dias (quinzenal); esse ritmo foi escolhido por equilibrar fluxo de caixa e capacidade de entrega do fornecedor (mensal gerava falta de peça; semanal sobrecarregava o fornecedor).
- O cliente prefere manter a compra quinzenal mesmo com um futuro alerta de estoque mínimo, por conta da limitação de capital de giro.
- O ciclo financeiro de giro é longo (~85 a 100 dias entre o pagamento ao fornecedor e o recebimento da venda), o que exige reserva de capital e dificulta decisões de compra sem um painel de acompanhamento.
- O cadastro de peças é manual; peças importadas regulares já têm todos os dados técnicos, mas o estoque de peças antigas recém-adquirido está apenas 20% catalogado — a busca de especificações técnicas na internet consome tempo.
- A emissão de nota fiscal hoje é duplicada manualmente entre o Mercado Livre (automático) e o aplicativo MarketApp/Sebrae (para vendas fora da plataforma), pois os sistemas não trocam dados entre si; o cliente acredita ser possível automatizar via central de desenvolvedores do Mercado Livre (cita como exemplo a loja "Almeida Autopeças Antigas", que integrou catálogo próprio ao Mercado Livre).
- O processo de envio hoje gera duas etiquetas (nota fiscal simplificada + etiqueta de envio); poderia ser unificado em uma única etiqueta via integração/desenvolvedor, economizando tempo e material.
- Vendas fiado (a prazo) para oficinas mecânicas são controladas manualmente na própria planilha de vendas, hoje com baixa frequência.
- Há desconto padronizado de 20% para oficinas mecânicas, já embutido na precificação.
- A internet da loja é estável (fibra óptica), sem histórico de queda — baixo risco de indisponibilidade do sistema.
- O cliente deseja um painel único que integre financeiro, vendas e estoque, permitindo visualizar a necessidade de capital de giro e entender por que as contas às vezes "não fecham".
- Catalogação de peças antigas sem especificação disponível na internet poderia ser facilitada por busca por foto ou código.
- O uso do sistema de fulfillment (Full) do Mercado Livre já reduz cerca de 70% do tempo do cliente, que também possui outro emprego.

### Decisões

- O controle de estoque será tratado como módulo central do sistema, do qual dependem diretamente o fluxo de caixa, as compras e as despesas.
- A equipe solicitará ao cliente o envio das planilhas de compras, financeiro e vendas como referência de modelo de dados.
- A equipe investigará a viabilidade de integração com a central de desenvolvedores do Mercado Livre e do MarketApp para automatizar catalogação e emissão de nota fiscal.

### Change Requests (CR)

- **(CR-1)** Alerta automático de estoque mínimo por peça — reduz risco de venda sem estoque disponível e cancelamentos — Must (a confirmar em sessão formal de priorização)
- **(CR-2)** Painel integrado de financeiro, vendas e estoque com indicadores de capital de giro e ciclo financeiro — Must
- **(CR-3)** Integração entre o sistema e o Mercado Livre para sincronizar catálogo, estoque e emissão de nota fiscal — Should
- **(CR-4)** Unificação das etiquetas de envio (nota fiscal + etiqueta de envio) via integração — Could
- **(CR-5)** Busca de peça por foto/código para facilitar catalogação de peças antigas sem especificação disponível — Could
- **(CR-6)** Controle de vendas fiado (a prazo) por cliente/oficina — Could

## Parte 2 — Reunião interna da equipe (após o encerramento da entrevista, com apoio da monitora Yasmin)

### Feedback (orientações da monitoria sobre o documento de características de produto)

- Uma "característica de produto" deve ser um requisito não funcional de nível mais alto, que agrupe dois ou mais requisitos não funcionais correlacionados (exemplo citado: unir "disponibilidade" com "integridade e usabilidade" para gerar requisitos de compatibilidade mobile/web).
- O ideal metodológico é definir primeiro as características de produto e, a partir delas, derivar os requisitos — não o caminho inverso.
- O professor apontou que o documento atual estava em nível de abstração muito baixo e pediu para subir o nível antes de derivar novamente os requisitos.
- Parâmetro de referência: ter no mínimo cerca de 8 características de produto, gerando em torno de 16 requisitos.
- Sugestão de considerar "gerenciamento e autenticação de usuários" como uma futura característica de produto (could have), pois o cliente hoje trabalha sozinho mas pode vir a contratar funcionários; é necessário justificar bem ao professor por que não é um must.
- Apontamentos específicos do professor sobre o documento:
  - Características de Produto 1 e 5 se sobrepõem (cadastro com aplicação x cadastro e consultas rápidas).
  - Característica de Produto 3 está ambígua (menciona "baixa automática conforme as vendas").
  - Característica de Produto 6 promete um relatório de vendas, mas a entidade "venda" ainda não está modelada com essa capacidade.

### Decisões

- Eliminar a Característica de Produto 5 (sobreposta à CP1) e remapear seu objetivo de redução de tempo para outra característica; tratar "rapidez/agilidade" como requisito não funcional.
- Reformular a Característica de Produto 3 para deixar explícito que é o proprietário quem registra a venda manualmente e o sistema realiza a baixa no estoque, removendo qualquer sugestão de detecção automática entre canais.
- Modelar a entidade "venda" com os atributos necessários para sustentar o relatório prometido na Característica de Produto 6.
- Fluxo de trabalho de desenvolvimento: uma branch por issue, para facilitar a revisão via Pull Request pela monitora.
- Cronograma: identificado que as datas de sprint documentadas não respeitam exatamente a periodicidade quinzenal (sprints de 12, 12, 11 e 17 dias); decisão de não vincular o cronograma do projeto ao calendário de entregas da disciplina, e sim às entregas de funcionalidade para o cliente, que ocorrerão sempre às quintas-feiras.
- Práticas de XP adotadas (a justificar para o professor): TDD aplicado apenas nas regras críticas do sistema (cadastro de peças e controle de estoque, com apoio de uma "skill" de TDD); programação em pares não será adotada; a prática de "cliente presente" será adaptada via comunicação por WhatsApp em vez de encontros presenciais constantes; mantidas design simples, refatoração contínua, propriedade coletiva do código e integração contínua (GitHub Actions).
- Planejamento: consolidar as características de produto até o dia seguinte; derivar os requisitos a partir delas até domingo (20/09), para que a monitora Yasmin possa revisar na segunda-feira (21/09).
- Entregas da disciplina mapeadas: dia 22/09 e 24/09 (entregas de requisitos/avaliação entre grupos) e dia 29/09 (duas entregas: aceite/rejeição dos ajustes sugeridos por outro grupo, e entrega relacionada ao MVP).

### Ações

| Ação | Responsável | Prazo |
|---|---|---|
| Enviar a transcrição da reunião com o cliente para o grupo, para apoiar a definição das características de produto | João | mesmo dia |
| Cada integrante propor e enviar ao grupo suas ideias de características de produto | Toda a equipe | 2026-09-18 |
| Derivar os requisitos a partir das características de produto consolidadas | Toda a equipe | 2026-09-20 |
| Revisar características de produto e requisitos propostos | Yasmin (monitora) | 2026-09-21 |
| Fechar todas as issues pendentes no repositório | Toda a equipe | 2026-09-20 |
| Adotar atualizações tipo "daily" via WhatsApp para melhorar a comunicação da equipe | Toda a equipe | Imediato |
