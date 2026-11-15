"""Itens do DoR e DoD do projeto; preserve os textos ao editar as issues."""

DOR_ITEMS = (
    'O usuário ou ator (no MVP, o proprietário) está identificado, seu papel está descrito e seu objetivo de negócio está explícito na US?',
    'O Score de priorização foi calculado (`Score = VN + Peso MoSCoW - ET`), a classificação MoSCoW foi registrada e a prioridade foi registrada no catálogo de requisitos, conforme o método de Priorização?',
    'Os critérios de aceitação são verificáveis, estão escritos no formato Dado / Quando / Então, cobrem os fluxos de exceção e erro e estão explicitamente vinculados ao requisito funcional (RF), ao objetivo específico (OE) e à característica de produto (CP) correspondentes?',
    'As regras de negócio do contexto de autopeças estão completamente definidas na US? Exemplos: imutabilidade do código do fabricante, política de duplicidade no cadastro e na importação de planilhas, atualização do saldo físico do estoque e canais de venda, como balcão e Mercado Livre.',
    'O validador (Antônio Marcos, proprietário), o canal de validação (reuniões quinzenais pelo Google Meet, encontros presenciais ou WhatsApp) e o critério de aprovação pelo cliente estão definidos?',
    'As dependências técnicas foram mapeadas, incluindo tabelas no PostgreSQL/Supabase, endpoints do FastAPI e componentes React, quando aplicáveis?',
    'Os impedimentos conhecidos foram removidos ou possuem um plano de mitigação documentado? Exemplos: limites dos planos gratuitos e higienização das planilhas legadas.',
    'Os requisitos não funcionais (RNFs) aplicáveis à história foram mapeados e seus critérios verificáveis são viáveis de implementar? Exemplos: RNF01 para uso em dispositivos móveis no balcão; RNF02 para tolerância a falhas de conexão e prevenção de duplicidades; RNF04 para buscas com P95 ≤ 3 s; RNF05 para segurança dos dados, nas condições definidas nos registros dos RNFs.',
    'O escopo da história cabe na sprint de 14 dias, considerando a capacidade da equipe?',
    'Todas as dúvidas que afetam o escopo, as regras de negócio e os critérios de aceitação foram resolvidas e acordadas antes do início do desenvolvimento?',
    'Cada integrante envolvido (Product Owner, frontend, backend e QA) consegue explicar exatamente o que será construído, como será testado e o prazo estimado, sem perguntas adicionais?',
    'As dependências entre itens, incluindo outras US necessárias, foram mapeadas e estão concluídas ou possuem uma sequência de entrega explicitamente acordada?',
)

DOD_ITEMS = (
    'A funcionalidade atende aos critérios de aceitação da história de usuário.',
    'O código foi revisado por outro integrante por meio de um Pull Request (PR).',
    'Os testes previstos foram aprovados, sem introduzir regressões.',
    'O código e o histórico de alterações seguem os padrões de codificação e versionamento da equipe.',
    'A funcionalidade foi validada com o cliente.',
)
