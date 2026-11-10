# Grupo 3 — Busca e consulta de disponibilidade

[Abrir o grupo no protótipo](interface/index.html?grupo=search){ .md-button }

## Vínculos e objetivo

Representar a localização de uma peça durante o atendimento e a leitura do saldo:
[US04 / #30](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/30) e
[US12 / #36](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas/issues/36).
Origens: [EP01 / CP1](../visao-produto/requisitos-de-software.md#ep01) e
[EP02 / CP2](../visao-produto/requisitos-de-software.md#ep02).

## Telas e caminhos

```mermaid
flowchart LR
    A[Escolher filtro e informar termo] --> B[Resultados]
    B --> C[Detalhes e saldo da peça]
    A --> D[Nenhum resultado]
    D --> A
    C --> E[Movimentar ou vender]
    E --> F[Nova consulta ao saldo]
```

## Roteiro de avaliação

| Cenário | Tarefa para o proprietário | O que observar | Referência |
| --- | --- | --- | --- |
| Identificação | Localize FLT-100; repita por nome “Filtro” e categoria “Filtros”. | Encontrar o filtro correto e reconhecer a peça no resultado. | CA04.1 |
| Aplicação | Localize peças por marca “Fiat”, modelo “Palio” e ano “2012”, em consultas separadas. | Compreensão da busca por aplicação e leitura do veículo nos detalhes. | CA04.2 |
| Sem resultado | Busque o código “INEXISTENTE”. | Compreensão da mensagem e facilidade de corrigir a busca. | CA04.3 |
| Saldo disponível | Consulte PST-200 após reiniciar: são 5 unidades. | Associação clara entre peça e quantidade física. | CA12.1 |
| Saldo zero | Consulte COR-300. | Entender que zero significa ausência de unidades disponíveis. | CA12.2 |
| Atualização | Registre uma entrada de 3 unidades de PST-200 no grupo 4; consulte novamente. | Exibição de 8 unidades sem alterar outras peças. | CA12.3 |

## Perguntas para refinamento

- A pesquisa deve aceitar parte do termo ou exigir correspondência exata?
- Como combinar vários filtros? A proposta atual permite um filtro por vez.
- Quais dados precisam aparecer no resultado para evitar abrir a peça errada?
- Como apresentar peças inativas? A demonstração mantém seu status visível.
- Qual saldo deve aparecer para uma peça recém-cadastrada?

A resposta imediata usa dados em memória e **não comprova o desempenho do RNF04**.
As mesmas telas são reutilizadas pelos grupos de estoque e vendas.

**Evidência a produzir:** termos utilizados, dificuldades e decisões de busca,
seguindo o [registro sugerido](index.md#registro-sugerido-para-a-issue-ou-ata).

## Versionamento

| Versão | Data | Descrição | Autor(es/as) |
| :----: | :--: | --- | --- |
| 1.0 | 10/11/2026 | Criação do roteiro de prototipação de busca e consulta de disponibilidade, contemplando US04 e US12. | [Bruno Ferreira](https://github.com/brunnf) |
