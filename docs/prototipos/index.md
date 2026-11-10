# Prototipação rápida do MVP

Artefatos de **representação de requisitos**, produzidos para avaliar os fluxos com o
proprietário antes da implementação.

[**Abrir o protótipo navegável**](interface/index.html){ .md-button .md-button--primary }

## Organização

Os cinco grupos compartilham uma interface de baixa fidelidade. Catálogo, detalhe da
peça e saldo são reutilizados entre tarefas. Os roteiros abaixo vinculam as telas às
histórias e orientam a avaliação, sem substituir os requisitos e critérios das issues.

| Grupo | Histórias representadas | Roteiro e acesso direto |
| --- | --- | --- |
| 1. Cadastro e manutenção | US01, US03, US05 e US06 | [Roteiro](01-cadastro.md) · [Protótipo](interface/index.html?grupo=catalog) |
| 2. Importação de peças | US02 | [Roteiro](02-importacao.md) · [Protótipo](interface/index.html?grupo=import) |
| 3. Busca e disponibilidade | US04 e US12 | [Roteiro](03-busca.md) · [Protótipo](interface/index.html?grupo=search) |
| 4. Movimentação de estoque | US08, US09 e US10 | [Roteiro](04-estoque.md) · [Protótipo](interface/index.html?grupo=stock) |
| 5. Vendas e cancelamento | US15 e US16 | [Roteiro](05-vendas.md) · [Protótipo](interface/index.html?grupo=sales) |

## Onde ficam os arquivos

```text
docs/prototipos/
├── index.md                 Orientação e cobertura
├── 01-cadastro.md           Roteiro do grupo 1
├── 02-importacao.md         Roteiro do grupo 2
├── 03-busca.md              Roteiro do grupo 3
├── 04-estoque.md            Roteiro do grupo 4
├── 05-vendas.md             Roteiro do grupo 5
└── interface/
    ├── index.html          Estrutura da demonstração
    ├── styles.css          Aparência dos wireframes
    └── prototype.js        Navegação e cenários simulados
```

A pasta pertence à documentação porque contém artefatos de engenharia de requisitos.
O MkDocs copia a interface estática junto às páginas, e a navegação fica em
**Requisitos → Prototipação rápida**. A aplicação de produção permanece em `frontend/`
e `backend/`; este JavaScript não deve ser incorporado como implementação das US.

## Como abrir

- Pelo site de documentação: use o botão acima.
- Localmente: abra `docs/prototipos/interface/index.html` no navegador; não é necessário
  instalar dependências para usar o protótipo.
- Para visualizar também os roteiros no MkDocs, siga o [README](https://github.com/mdsreq-fga-unb/REQ-202562-T02-TSI-AutoPecas#documentação-e-automação-do-backlog).

As alterações ficam apenas na memória da aba. Recarregar a página ou clicar em
**Reiniciar demonstração** recupera os dados iniciais. Ao avaliar vários grupos na
mesma sessão, use o menu da interface para preservar os exemplos já cadastrados.

## Condução da avaliação

1. Explique que se trata de uma proposta visual, com dados fictícios.
2. Reinicie a demonstração e leia a tarefa de um roteiro, sem ensinar o caminho.
3. Observe como o proprietário encontra os campos, interpreta as mensagens e conclui a tarefa.
4. Explore os estados alternativos e as perguntas de refinamento daquele grupo.
5. Registre evidências e decisões na issue correspondente ou em uma ata vinculada às issues.
6. Atualize o protótipo após as decisões e repita os cenários afetados.

A ordem sugerida é cadastro → busca → movimentação → venda/cancelamento → importação.
O percurso integrado pode usar **Filtro de óleo / FLT-100**: saldo inicial 10,
entrada de 3 → 13, venda de 2 → 11, cancelamento → 13. As peças e marcas são exemplos
de interface, sem afirmar compatibilidade técnica de peças reais.

### Registro sugerido para a issue ou ata

| Campo | O que registrar na sessão real |
| --- | --- |
| Identificação | Data, participantes, versão do protótipo, grupo e US |
| Tarefa | Cenário proposto e dados utilizados |
| Observação | Caminho percorrido, hesitações, erros e ajuda necessária |
| Decisão | Feedback do proprietário e justificativa, sem presumir aprovação |
| Encaminhamento | Ajuste, responsável, questão em aberto e link da evidência |

## Relação com o processo

A atividade está prevista em [Engenharia de requisitos](../visao-produto/engenharia-de-requisitos.md)
e no [processo de validação](../visao-produto/interacao-equipe-cliente.md#processo-de-validacao).
As pendências devem ser resolvidas conforme a [DoR](../visao-produto/dor-e-dod.md#definition-of-ready-dor)
antes da implementação das histórias afetadas. A existência deste artefato não altera
o estado de desenvolvimento das US nem comprova a [DoD](../visao-produto/dor-e-dod.md#definition-of-done-dod).
