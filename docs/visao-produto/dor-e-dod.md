# DoR e DoD

## 9 DoR e DoD

### 9.1 Definition of Ready (DoR)

Uma História de Usuário (US) só pode passar do Product Backlog refinado para o Sprint Backlog, durante o planejamento da sprint, quando todas as perguntas abaixo forem respondidas com **Sim**.

#### Tratamento da resposta “Não”

- **Na equipe:** o item retorna ao refinamento para esclarecer dúvidas e definir as regras pendentes da seção **“A refinar”** ou **“Pontos a esclarecer”** da US.
- **Individualmente:** quando houver uma lacuna de conhecimento, será aberta uma issue de estudo, capacitação ou alinhamento técnico para o integrante responsável.

#### Dimensão de clareza

Verifica se o que será desenvolvido e seu valor para o negócio estão claros para toda a equipe.

- [ ] O usuário ou ator (Administrador ou Operador da loja) está identificado, seu papel está descrito e seu objetivo de negócio está explícito na US?
- [ ] O Score de priorização foi calculado (`Score = VN + Peso MoSCoW - ET`), a classificação MoSCoW foi registrada e a prioridade foi definida no [backlog](backlog-de-produto.md#tabela-de-priorizacao)?
- [ ] Os critérios de aceitação são verificáveis, estão escritos no formato **Dado / Quando / Então**, cobrem os fluxos de exceção e erro e estão explicitamente vinculados ao requisito funcional (RF), ao objetivo específico (OE) e à característica de produto (CP) correspondentes?
- [ ] As regras de negócio do contexto de autopeças estão completamente definidas na US? Exemplos: imutabilidade do código do fabricante, política de duplicidade no cadastro e na importação de planilhas, atualização do saldo físico do estoque e canais de venda, como balcão e Mercado Livre.
- [ ] O validador (Antônio Marcos, proprietário), o canal de validação (reuniões quinzenais pelo Google Meet, encontros presenciais ou WhatsApp) e o critério de aprovação pelo cliente estão definidos?

#### Dimensão de viabilidade

Verifica a existência de bloqueios externos, de infraestrutura ou de dependências do sistema.

- [ ] As dependências técnicas foram mapeadas, incluindo tabelas no PostgreSQL/Supabase, endpoints do FastAPI e componentes React, quando aplicáveis?
- [ ] Os impedimentos conhecidos foram removidos ou possuem um plano de mitigação documentado? Exemplos: limites dos planos gratuitos e higienização das planilhas legadas.
- [ ] Os requisitos não funcionais (RNFs) aplicáveis à história foram mapeados e seus critérios verificáveis são viáveis de implementar? Exemplos: RNF01 para uso em dispositivos móveis no balcão; RNF02 para tolerância a falhas de conexão e prevenção de duplicidades; RNF04 para buscas com P95 ≤ 3 s; RNF05 para segurança dos dados, nas condições definidas em [Requisitos de software](requisitos-de-software.md#82-lista-de-requisitos-nao-funcionais).

#### Dimensão de escopo

Verifica o entendimento compartilhado e se o trabalho cabe na sprint.

- [ ] O escopo da história cabe na sprint de 14 dias, considerando a capacidade da equipe?
- [ ] Todos os pontos da seção **“A refinar”** ou **“Pontos a esclarecer”** foram resolvidos e acordados pela equipe antes do início do desenvolvimento?
- [ ] Cada integrante envolvido (Product Owner, frontend, backend e QA) consegue explicar exatamente o que será construído, como será testado e o prazo estimado, sem perguntas adicionais?
- [ ] As dependências entre itens, incluindo outras US necessárias, foram mapeadas e estão concluídas ou possuem uma sequência de entrega explicitamente acordada?

### 9.2 Definition of Done (DoD)

A equipe considera uma funcionalidade concluída quando **todos os critérios abaixo** são atendidos:

- [ ] A funcionalidade atende aos critérios de aceitação da história de usuário.
- [ ] O código foi revisado por outro integrante por meio de um Pull Request (PR).
- [ ] Os testes previstos foram aprovados, sem introduzir regressões.
- [ ] O código e o histórico de alterações seguem os padrões de codificação e versionamento da equipe.
- [ ] A funcionalidade foi validada com o cliente.

## Versionamento

| Versão | Data | Descrição | Autor(es/as) |
| :----: | :--: | --- | --- |
| 1.0 | 04/09/2026 | Iniciação do documento | [Thiago Gomes](https://github.com/thgomxs) |
| 1.1 | 12/10/2026 | Elaboração do conteúdo da Definition of Done (DoD) | [João Guilherme Amancio de Melo (@jot4-ge)](https://github.com/jot4-ge) |
| 1.2 | 12/10/2026 | Elaboração do conteúdo da Definition of Ready (DoR) | [Leonardo da Silva Lopes Júnior (@LeonardoLopesJr)](https://github.com/LeonardoLopesJr) |
| 1.3 | 12/10/2026 | Inserção dos textos fornecidos no documento, revisão gramatical, formatação e adequação da referência de entrada na sprint à estratégia adotada | [Thiago Gomes](https://github.com/thgomxs) |
