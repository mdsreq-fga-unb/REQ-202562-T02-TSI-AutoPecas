# Catálogo de requisitos

## 8 Catálogo integrado de requisitos

Esta página é o **registro único** de cada requisito do produto TSI Peças. Um requisito aparece
aqui uma única vez, reunindo a declaração vigente, a origem, as condições aplicáveis, a
priorização, a entrega e a situação atual.

As páginas de [Priorização](priorizacao.md), [MVP](mvp.md), [Rastreabilidade](rastreabilidade.md)
e [Histórico de evolução](historico-de-evolucao.md) descrevem método, decisões e vínculos, mas
**não mantêm listas paralelas de requisitos**: todas consultam os registros desta página. Uma
alteração de escopo é feita no registro correspondente e passa a valer para todas as consultas.

### 8.1 Conteúdo de cada registro

| Parte do registro | Informação mantida |
| --- | --- |
| Identidade | ID estável e nome do requisito |
| Declaração vigente | Comportamento esperado do produto, na forma adotada pela equipe |
| Intenção e valor | História de usuário (US) associada, quando o requisito já foi recortado para entrega |
| Origem e agrupamento | Característica de produto (CP), objetivos específicos (OE) e épico |
| Condições e avaliação | RNFs aplicáveis, dependências e critérios de confirmação |
| Priorização | Valor de negócio, esforço técnico, MoSCoW, Score, quadrante e justificativa |
| Entrega e situação | Recorte de entrega (MVP, condicionado ou evolução futura), sprint e estado atual |
| Evolução | Decisões e alterações relevantes do registro, com data |

!!! note "Situação de confirmação"
    As pontuações de **valor de negócio** registradas abaixo foram atribuídas pela equipe a partir
    das conversas de elicitação e **ainda aguardam confirmação formal do proprietário**. O esforço
    técnico é uma estimativa da equipe e é reavaliado a cada refinamento. Enquanto a confirmação
    não ocorre, os valores vigentes são os desta página.

### 8.2 Papel das declarações: RF, US, caso de uso e cenário

A equipe mantém declarações de dois tipos, com funções distintas e vínculo explícito entre elas.

| Aspecto | Requisito funcional (RF) | História de usuário (US) |
| --- | --- | --- |
| Foco | Comportamento esperado do produto, verificável | Intenção e valor para quem utiliza o produto |
| Granularidade | Uma capacidade do sistema | Um recorte de valor implementável em uma sprint |
| Organização | Agrupado pela característica de produto de origem | Agrupada em épicos, com o RF de origem explícito |
| Onde é mantida | Campo *Declaração vigente* do registro | Campo *Intenção e valor* do mesmo registro |

**Casos de uso e cenários não são mantidos neste projeto.** No escopo atual, cada RF selecionado
para entrega corresponde a exatamente uma US (relação 1:1) e não há agrupamentos de comportamentos
com fluxos alternativos e exceções que justifiquem o detalhamento de um caso de uso. Os fluxos
alternativos e as exceções são tratados como critérios de confirmação do próprio registro. Caso um
requisito futuro reúna vários objetivos do mesmo ator, a equipe passará a manter o caso de uso
correspondente como complemento vinculado ao registro, e não como declaração paralela.

### 8.3 Índice dos registros

Índice de navegação dos registros desta mesma página — não é uma lista paralela: os valores
exibidos pertencem aos registros abaixo.

<div class="catalog-controls" markdown="1">

[Expandir todos os registros](#){ .catalog-toggle }

</div>

<table class="catalog-index">
<thead><tr><th scope="col">ID</th><th scope="col">Requisito</th><th scope="col">CP</th><th scope="col">VN</th><th scope="col">ET</th><th scope="col">Score</th><th scope="col">Entrega</th><th scope="col">Situação</th></tr></thead>
<tbody>
<tr><td data-label="ID"><a href="#rf01">RF01</a></td><td data-label="Requisito">Cadastrar peça</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp1">CP1</a></td><td data-label="VN">4</td><td data-label="ET">2</td><td data-label="Score">5</td><td data-label="Entrega">MVP</td><td data-label="Situação">Não iniciado</td></tr>
<tr><td data-label="ID"><a href="#rf02">RF02</a></td><td data-label="Requisito">Importar peças via planilha</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp1">CP1</a></td><td data-label="VN">4</td><td data-label="ET">2</td><td data-label="Score">5</td><td data-label="Entrega">MVP</td><td data-label="Situação">Não iniciado</td></tr>
<tr><td data-label="ID"><a href="#rf03">RF03</a></td><td data-label="Requisito">Associar veículo à peça</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp1">CP1</a></td><td data-label="VN">4</td><td data-label="ET">2</td><td data-label="Score">5</td><td data-label="Entrega">MVP</td><td data-label="Situação">Não iniciado</td></tr>
<tr><td data-label="ID"><a href="#rf04">RF04</a></td><td data-label="Requisito">Buscar peça</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp1">CP1</a></td><td data-label="VN">4</td><td data-label="ET">2</td><td data-label="Score">5</td><td data-label="Entrega">MVP</td><td data-label="Situação">Não iniciado</td></tr>
<tr><td data-label="ID"><a href="#rf05">RF05</a></td><td data-label="Requisito">Editar peça</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp1">CP1</a></td><td data-label="VN">4</td><td data-label="ET">1</td><td data-label="Score">6</td><td data-label="Entrega">MVP</td><td data-label="Situação">Não iniciado</td></tr>
<tr><td data-label="ID"><a href="#rf06">RF06</a></td><td data-label="Requisito">Alterar status da peça</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp1">CP1</a></td><td data-label="VN">4</td><td data-label="ET">2</td><td data-label="Score">5</td><td data-label="Entrega">MVP</td><td data-label="Situação">Não iniciado</td></tr>
<tr><td data-label="ID"><a href="#rf07">RF07</a></td><td data-label="Requisito">Cadastrar fornecedor</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp2">CP2</a></td><td data-label="VN">0</td><td data-label="ET">1</td><td data-label="Score">-1</td><td data-label="Entrega">Evolução futura</td><td data-label="Situação">Fora do escopo desta versão</td></tr>
<tr><td data-label="ID"><a href="#rf08">RF08</a></td><td data-label="Requisito">Registar entrada de peças</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp2">CP2</a></td><td data-label="VN">4</td><td data-label="ET">1</td><td data-label="Score">6</td><td data-label="Entrega">MVP</td><td data-label="Situação">Não iniciado</td></tr>
<tr><td data-label="ID"><a href="#rf09">RF09</a></td><td data-label="Requisito">Registar saída manual</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp2">CP2</a></td><td data-label="VN">4</td><td data-label="ET">2</td><td data-label="Score">5</td><td data-label="Entrega">MVP</td><td data-label="Situação">Não iniciado</td></tr>
<tr><td data-label="ID"><a href="#rf10">RF10</a></td><td data-label="Requisito">Registar ajuste de inventário</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp2">CP2</a></td><td data-label="VN">4</td><td data-label="ET">2</td><td data-label="Score">5</td><td data-label="Entrega">MVP</td><td data-label="Situação">Não iniciado</td></tr>
<tr><td data-label="ID"><a href="#rf11">RF11</a></td><td data-label="Requisito">Registar devolução de peça</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp2">CP2</a></td><td data-label="VN">3</td><td data-label="ET">2</td><td data-label="Score">3</td><td data-label="Entrega">Condicionado</td><td data-label="Situação">A refinar</td></tr>
<tr><td data-label="ID"><a href="#rf12">RF12</a></td><td data-label="Requisito">Consultar saldo de peça</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp2">CP2</a></td><td data-label="VN">3</td><td data-label="ET">1</td><td data-label="Score">5</td><td data-label="Entrega">MVP</td><td data-label="Situação">Não iniciado</td></tr>
<tr><td data-label="ID"><a href="#rf13">RF13</a></td><td data-label="Requisito">Consultar histórico de movimentações</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp2">CP2</a></td><td data-label="VN">3</td><td data-label="ET">2</td><td data-label="Score">2</td><td data-label="Entrega">Condicionado</td><td data-label="Situação">A refinar</td></tr>
<tr><td data-label="ID"><a href="#rf14">RF14</a></td><td data-label="Requisito">Filtrar histórico por período</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp2">CP2</a></td><td data-label="VN">3</td><td data-label="ET">1</td><td data-label="Score">4</td><td data-label="Entrega">MVP</td><td data-label="Situação">Não iniciado</td></tr>
<tr><td data-label="ID"><a href="#rf15">RF15</a></td><td data-label="Requisito">Registrar venda</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp3">CP3</a></td><td data-label="VN">4</td><td data-label="ET">2</td><td data-label="Score">5</td><td data-label="Entrega">MVP</td><td data-label="Situação">Não iniciado</td></tr>
<tr><td data-label="ID"><a href="#rf16">RF16</a></td><td data-label="Requisito">Cancelar venda</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp3">CP3</a></td><td data-label="VN">4</td><td data-label="ET">2</td><td data-label="Score">4</td><td data-label="Entrega">MVP</td><td data-label="Situação">Não iniciado</td></tr>
<tr><td data-label="ID"><a href="#rf17">RF17</a></td><td data-label="Requisito">Registrar encargos da venda</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp3">CP3</a></td><td data-label="VN">0</td><td data-label="ET">2</td><td data-label="Score">-2</td><td data-label="Entrega">Evolução futura</td><td data-label="Situação">Fora do escopo desta versão</td></tr>
<tr><td data-label="ID"><a href="#rf18">RF18</a></td><td data-label="Requisito">Gerenciar status de recebimento</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp3">CP3</a></td><td data-label="VN">0</td><td data-label="ET">2</td><td data-label="Score">-2</td><td data-label="Entrega">Evolução futura</td><td data-label="Situação">Fora do escopo desta versão</td></tr>
<tr><td data-label="ID"><a href="#rf19">RF19</a></td><td data-label="Requisito">Exibir total consolidado</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp3">CP3</a></td><td data-label="VN">0</td><td data-label="ET">1</td><td data-label="Score">0</td><td data-label="Entrega">Evolução futura</td><td data-label="Situação">Fora do escopo desta versão</td></tr>
<tr><td data-label="ID"><a href="#rf20">RF20</a></td><td data-label="Requisito">Filtrar página de recebíveis</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp3">CP3</a></td><td data-label="VN">0</td><td data-label="ET">1</td><td data-label="Score">0</td><td data-label="Entrega">Evolução futura</td><td data-label="Situação">Fora do escopo desta versão</td></tr>
<tr><td data-label="ID"><a href="#rf21">RF21</a></td><td data-label="Requisito">Definir estoque mínimo por peça</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp4">CP4</a></td><td data-label="VN">2</td><td data-label="ET">1</td><td data-label="Score">3</td><td data-label="Entrega">Condicionado</td><td data-label="Situação">A refinar</td></tr>
<tr><td data-label="ID"><a href="#rf22">RF22</a></td><td data-label="Requisito">Consultar painel de estoque crítico</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp4">CP4</a></td><td data-label="VN">2</td><td data-label="ET">2</td><td data-label="Score">2</td><td data-label="Entrega">Condicionado</td><td data-label="Situação">A refinar</td></tr>
<tr><td data-label="ID"><a href="#rf23">RF23</a></td><td data-label="Requisito">Criar lista de compras</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp4">CP4</a></td><td data-label="VN">1</td><td data-label="ET">1</td><td data-label="Score">1</td><td data-label="Entrega">Evolução futura</td><td data-label="Situação">Fora do escopo desta versão</td></tr>
<tr><td data-label="ID"><a href="#rf24">RF24</a></td><td data-label="Requisito">Confirmar recebimento de remessa</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp4">CP4</a></td><td data-label="VN">0</td><td data-label="ET">2</td><td data-label="Score">-2</td><td data-label="Entrega">Evolução futura</td><td data-label="Situação">Fora do escopo desta versão</td></tr>
<tr><td data-label="ID"><a href="#rf25">RF25</a></td><td data-label="Requisito">Listar itens mais vendidos</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp4">CP4</a></td><td data-label="VN">3</td><td data-label="ET">2</td><td data-label="Score">3</td><td data-label="Entrega">Condicionado</td><td data-label="Situação">A refinar</td></tr>
<tr><td data-label="ID"><a href="#rf26">RF26</a></td><td data-label="Requisito">Analisar desempenho por canal</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp4">CP4</a></td><td data-label="VN">0</td><td data-label="ET">2</td><td data-label="Score">-2</td><td data-label="Entrega">Evolução futura</td><td data-label="Situação">Fora do escopo desta versão</td></tr>
<tr><td data-label="ID"><a href="#rf27">RF27</a></td><td data-label="Requisito">Exportar relatórios</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp4">CP4</a></td><td data-label="VN">0</td><td data-label="ET">1</td><td data-label="Score">-1</td><td data-label="Entrega">Evolução futura</td><td data-label="Situação">Fora do escopo desta versão</td></tr>
<tr><td data-label="ID"><a href="#rf28">RF28</a></td><td data-label="Requisito">Registrar despesa operacional</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp5">CP5</a></td><td data-label="VN">1</td><td data-label="ET">1</td><td data-label="Score">0</td><td data-label="Entrega">Evolução futura</td><td data-label="Situação">Fora do escopo desta versão</td></tr>
<tr><td data-label="ID"><a href="#rf29">RF29</a></td><td data-label="Requisito">Editar despesa operacional</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp5">CP5</a></td><td data-label="VN">1</td><td data-label="ET">1</td><td data-label="Score">0</td><td data-label="Entrega">Evolução futura</td><td data-label="Situação">Fora do escopo desta versão</td></tr>
<tr><td data-label="ID"><a href="#rf30">RF30</a></td><td data-label="Requisito">Excluir despesa operacional</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp5">CP5</a></td><td data-label="VN">1</td><td data-label="ET">1</td><td data-label="Score">0</td><td data-label="Entrega">Evolução futura</td><td data-label="Situação">Fora do escopo desta versão</td></tr>
<tr><td data-label="ID"><a href="#rf31">RF31</a></td><td data-label="Requisito">Consultar demonstrativo financeiro</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp5">CP5</a></td><td data-label="VN">2</td><td data-label="ET">2</td><td data-label="Score">1</td><td data-label="Entrega">Evolução futura</td><td data-label="Situação">Fora do escopo desta versão</td></tr>
<tr><td data-label="ID"><a href="#rf32">RF32</a></td><td data-label="Requisito">Registrar dados fiscais da peça</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp6">CP6</a></td><td data-label="VN">0</td><td data-label="ET">1</td><td data-label="Score">-1</td><td data-label="Entrega">Evolução futura</td><td data-label="Situação">Fora do escopo desta versão</td></tr>
<tr><td data-label="ID"><a href="#rf33">RF33</a></td><td data-label="Requisito">Editar dados fiscais da peça</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp6">CP6</a></td><td data-label="VN">0</td><td data-label="ET">1</td><td data-label="Score">-1</td><td data-label="Entrega">Evolução futura</td><td data-label="Situação">Fora do escopo desta versão</td></tr>
<tr><td data-label="ID"><a href="#rf34">RF34</a></td><td data-label="Requisito">Vincular documento fiscal à venda</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp6">CP6</a></td><td data-label="VN">0</td><td data-label="ET">2</td><td data-label="Score">-2</td><td data-label="Entrega">Evolução futura</td><td data-label="Situação">Fora do escopo desta versão</td></tr>
<tr><td data-label="ID"><a href="#rf35">RF35</a></td><td data-label="Requisito">Registrar envio de peças</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp6">CP6</a></td><td data-label="VN">0</td><td data-label="ET">1</td><td data-label="Score">-1</td><td data-label="Entrega">Evolução futura</td><td data-label="Situação">Fora do escopo desta versão</td></tr>
<tr><td data-label="ID"><a href="#rf36">RF36</a></td><td data-label="Requisito">Consultar expedições do período</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp6">CP6</a></td><td data-label="VN">0</td><td data-label="ET">2</td><td data-label="Score">-2</td><td data-label="Entrega">Evolução futura</td><td data-label="Situação">Fora do escopo desta versão</td></tr>
<tr><td data-label="ID"><a href="#rf37">RF37</a></td><td data-label="Requisito">Autenticar usuário</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp9">CP9</a></td><td data-label="VN">0</td><td data-label="ET">2</td><td data-label="Score">-2</td><td data-label="Entrega">Evolução futura</td><td data-label="Situação">Fora do escopo desta versão</td></tr>
<tr><td data-label="ID"><a href="#rf38">RF38</a></td><td data-label="Requisito">Cadastrar usuário</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp9">CP9</a></td><td data-label="VN">0</td><td data-label="ET">2</td><td data-label="Score">-2</td><td data-label="Entrega">Evolução futura</td><td data-label="Situação">Fora do escopo desta versão</td></tr>
<tr><td data-label="ID"><a href="#rf39">RF39</a></td><td data-label="Requisito">Editar usuário</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp9">CP9</a></td><td data-label="VN">0</td><td data-label="ET">2</td><td data-label="Score">-2</td><td data-label="Entrega">Evolução futura</td><td data-label="Situação">Fora do escopo desta versão</td></tr>
<tr><td data-label="ID"><a href="#rf40">RF40</a></td><td data-label="Requisito">Desativar usuário</td><td data-label="CP"><a href="../solucao-e-caracteristicas/#cp9">CP9</a></td><td data-label="VN">0</td><td data-label="ET">2</td><td data-label="Score">-2</td><td data-label="Entrega">Evolução futura</td><td data-label="Situação">Fora do escopo desta versão</td></tr>
</tbody>
</table>

### 8.4 Registros dos requisitos funcionais

Os registros estão agrupados pela característica de produto de origem. Cada registro abre e fecha;
um link direto para um ID (por exemplo `#rf04`) abre o registro correspondente.

#### CP1 — Cadastro e Catálogo de Peças

Objetivo principal: [OE1](solucao-e-caracteristicas.md#oe1). Contribuição secundária: [OE3](solucao-e-caracteristicas.md#oe3), [OE6](solucao-e-caracteristicas.md#oe6). 6 requisitos registrados.

<details class="req-record" id="rf01" markdown="1">
<summary><span class="req-record__id">RF01</span><span class="req-record__name">Cadastrar peça</span><span class="req-record__chips"><span class="req-chip req-chip--mvp">MVP</span><span class="req-chip">Sprint 3</span><span class="req-chip req-chip--state">Não iniciado</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve permitir que utilizadores com perfil Administrador ou Operador cadastrem uma peça, com preenchimento obrigatório do código do fabricante, do nome e da categoria; e preenchimento opcional da descrição técnica, da localização física e de uma foto.

**Intenção e valor.** <span id="us01"></span>**US01** — Como administrador ou operador da loja, quero cadastrar uma peça para manter suas informações organizadas e disponíveis para consulta.

**Origem e agrupamento.** [CP1 — Cadastro e Catálogo de Peças](solucao-e-caracteristicas.md#cp1) · objetivo principal [OE1](solucao-e-caracteristicas.md#oe1) · épico [EP01](mvp.md#ep01)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF02](#rnf02-tolerancia-a-falhas-de-conexao), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* nenhuma dependência identificada na declaração.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **4/4** · MoSCoW **Must Have** · Esforço técnico **2** (EI 3, CA 2, LC 1) · Score **5** · Quadrante **Q1**.  
*Justificativa:* VN 4 + peso MoSCoW 3 (Must Have) − ET 2 = Score 5. Score ≥ 4, selecionado para o MVP. Quadrante Q1: alto valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **MVP**. Planejado para a **Sprint 3** (ver [Cronograma e entregas](cronograma-e-entregas.md)). Situação atual: **Não iniciado**.

**Evolução.**

- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record" id="rf02" markdown="1">
<summary><span class="req-record__id">RF02</span><span class="req-record__name">Importar peças via planilha</span><span class="req-record__chips"><span class="req-chip req-chip--mvp">MVP</span><span class="req-chip">Sprint 4</span><span class="req-chip req-chip--state">Não iniciado</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve permitir ao perfil Administrador selecionar uma planilha .xlsx de peças, validar os registros e cadastrá-los em lote, sem sobrescrever peças já cadastradas com o mesmo código do fabricante.

**Intenção e valor.** <span id="us02"></span>**US02** — Como administrador da loja, quero importar peças de uma planilha para aproveitar os registros existentes e reduzir o trabalho de cadastro manual.

**Origem e agrupamento.** [CP1 — Cadastro e Catálogo de Peças](solucao-e-caracteristicas.md#cp1) · objetivo principal [OE1](solucao-e-caracteristicas.md#oe1) · épico [EP01](mvp.md#ep01)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF02](#rnf02-tolerancia-a-falhas-de-conexao), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF01](#rf01) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **4/4** · MoSCoW **Must Have** · Esforço técnico **2** (EI 2, CA 2, LC 1) · Score **5** · Quadrante **Q1**.  
*Justificativa:* VN 4 + peso MoSCoW 3 (Must Have) − ET 2 = Score 5. Score ≥ 4, selecionado para o MVP. Quadrante Q1: alto valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **MVP**. Planejado para a **Sprint 4** (ver [Cronograma e entregas](cronograma-e-entregas.md)). Situação atual: **Não iniciado**.

**Evolução.**

- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record" id="rf03" markdown="1">
<summary><span class="req-record__id">RF03</span><span class="req-record__name">Associar veículo à peça</span><span class="req-record__chips"><span class="req-chip req-chip--mvp">MVP</span><span class="req-chip">Sprint 4</span><span class="req-chip req-chip--state">Não iniciado</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve permitir a associação de uma ou mais aplicações por veículo a uma peça cadastrada, com registo de marca, modelo e ano de compatibilidade.

**Intenção e valor.** <span id="us03"></span>**US03** — Como usuário da loja, quero associar os veículos compatíveis a uma peça para identificar sua aplicação corretamente durante o atendimento.

**Origem e agrupamento.** [CP1 — Cadastro e Catálogo de Peças](solucao-e-caracteristicas.md#cp1) · objetivo principal [OE1](solucao-e-caracteristicas.md#oe1) · épico [EP01](mvp.md#ep01)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF02](#rnf02-tolerancia-a-falhas-de-conexao), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF01](#rf01) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **4/4** · MoSCoW **Must Have** · Esforço técnico **2** (EI 3, CA 3, LC 1) · Score **5** · Quadrante **Q1**.  
*Justificativa:* VN 4 + peso MoSCoW 3 (Must Have) − ET 2 = Score 5. Score ≥ 4, selecionado para o MVP. Quadrante Q1: alto valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **MVP**. Planejado para a **Sprint 4** (ver [Cronograma e entregas](cronograma-e-entregas.md)). Situação atual: **Não iniciado**.

**Evolução.**

- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record" id="rf04" markdown="1">
<summary><span class="req-record__id">RF04</span><span class="req-record__name">Buscar peça</span><span class="req-record__chips"><span class="req-chip req-chip--mvp">MVP</span><span class="req-chip">Sprint 4</span><span class="req-chip req-chip--state">Não iniciado</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve permitir a localização de peças no catálogo por ao menos um dos seguintes filtros: código do fabricante, nome, categoria ou aplicação por veículo (marca, modelo ou ano).

**Intenção e valor.** <span id="us04"></span>**US04** — Como usuário da loja, quero localizar peças por suas informações de identificação ou aplicação para encontrar o item adequado durante o atendimento.

**Origem e agrupamento.** [CP1 — Cadastro e Catálogo de Peças](solucao-e-caracteristicas.md#cp1) · objetivo principal [OE1](solucao-e-caracteristicas.md#oe1) · épico [EP01](mvp.md#ep01)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF04](#rnf04-desempenho-de-resposta), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF01](#rf01) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **4/4** · MoSCoW **Must Have** · Esforço técnico **2** (EI 2, CA 2, LC 1) · Score **5** · Quadrante **Q1**.  
*Justificativa:* VN 4 + peso MoSCoW 3 (Must Have) − ET 2 = Score 5. Score ≥ 4, selecionado para o MVP. Quadrante Q1: alto valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **MVP**. Planejado para a **Sprint 4** (ver [Cronograma e entregas](cronograma-e-entregas.md)). Situação atual: **Não iniciado**.

**Evolução.**

- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record" id="rf05" markdown="1">
<summary><span class="req-record__id">RF05</span><span class="req-record__name">Editar peça</span><span class="req-record__chips"><span class="req-chip req-chip--mvp">MVP</span><span class="req-chip">Sprint 3</span><span class="req-chip req-chip--state">Não iniciado</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve permitir a edição de qualquer campo do cadastro de uma peça já registrada, com exceção do código do fabricante, que é imutável após o cadastro inicial.

**Intenção e valor.** <span id="us05"></span>**US05** — Como usuário da loja, quero corrigir os dados de uma peça cadastrada para manter o catálogo atualizado sem alterar sua identificação pelo fabricante.

**Origem e agrupamento.** [CP1 — Cadastro e Catálogo de Peças](solucao-e-caracteristicas.md#cp1) · objetivo principal [OE1](solucao-e-caracteristicas.md#oe1) · épico [EP01](mvp.md#ep01)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF02](#rnf02-tolerancia-a-falhas-de-conexao), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF01](#rf01) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **4/4** · MoSCoW **Must Have** · Esforço técnico **1** (EI 1, CA 1, LC 1) · Score **6** · Quadrante **Q1**.  
*Justificativa:* VN 4 + peso MoSCoW 3 (Must Have) − ET 1 = Score 6. Score ≥ 4, selecionado para o MVP. Quadrante Q1: alto valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **MVP**. Planejado para a **Sprint 3** (ver [Cronograma e entregas](cronograma-e-entregas.md)). Situação atual: **Não iniciado**.

**Evolução.**

- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record" id="rf06" markdown="1">
<summary><span class="req-record__id">RF06</span><span class="req-record__name">Alterar status da peça</span><span class="req-record__chips"><span class="req-chip req-chip--mvp">MVP</span><span class="req-chip">Sprint 3</span><span class="req-chip req-chip--state">Não iniciado</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve permitir que o usuário altere o status de uma peça, alternando entre "ativo" e "inativo".

**Intenção e valor.** <span id="us06"></span>**US06** — Como usuário da loja, quero alternar uma peça entre ativa e inativa para indicar sua situação no catálogo sem perder o cadastro existente.

**Origem e agrupamento.** [CP1 — Cadastro e Catálogo de Peças](solucao-e-caracteristicas.md#cp1) · objetivo principal [OE1](solucao-e-caracteristicas.md#oe1) · épico [EP01](mvp.md#ep01)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF02](#rnf02-tolerancia-a-falhas-de-conexao), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF01](#rf01) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **4/4** · MoSCoW **Must Have** · Esforço técnico **2** (EI 3, CA 3, LC 1) · Score **5** · Quadrante **Q1**.  
*Justificativa:* VN 4 + peso MoSCoW 3 (Must Have) − ET 2 = Score 5. Score ≥ 4, selecionado para o MVP. Quadrante Q1: alto valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **MVP**. Planejado para a **Sprint 3** (ver [Cronograma e entregas](cronograma-e-entregas.md)). Situação atual: **Não iniciado**.

**Evolução.**

- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

#### CP2 — Controle e Movimentação de Estoque

Objetivo principal: [OE6](solucao-e-caracteristicas.md#oe6). Contribuição secundária: [OE2](solucao-e-caracteristicas.md#oe2), [OE4](solucao-e-caracteristicas.md#oe4). 8 requisitos registrados.

<details class="req-record" id="rf07" markdown="1">
<summary><span class="req-record__id">RF07</span><span class="req-record__name">Cadastrar fornecedor</span><span class="req-record__chips"><span class="req-chip req-chip--evolução">Evolução futura</span><span class="req-chip req-chip--state">Fora do escopo desta versão</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve permitir o cadastro de fornecedores.

**Intenção e valor.** Sem história de usuário associada: o requisito ainda não foi recortado para entrega.

**Origem e agrupamento.** [CP2 — Controle e Movimentação de Estoque](solucao-e-caracteristicas.md#cp2) · objetivo principal [OE6](solucao-e-caracteristicas.md#oe6)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF02](#rnf02-tolerancia-a-falhas-de-conexao), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* nenhuma dependência identificada na declaração.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **0/4** · MoSCoW **Won't Have** · Esforço técnico **1** (EI 1, CA 1, LC 1) · Score **-1** · Quadrante **Q3**.  
*Justificativa:* VN 0 + peso MoSCoW 0 (Won't Have) − ET 1 = Score -1. Score ≤ 1, mantido como evolução futura. Quadrante Q3: baixo valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **Evolução futura**. Permanece fora desta versão do produto, sem sprint atribuída. Situação atual: **Fora do escopo desta versão**.

**Evolução.**

- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record" id="rf08" markdown="1">
<summary><span class="req-record__id">RF08</span><span class="req-record__name">Registar entrada de peças</span><span class="req-record__chips"><span class="req-chip req-chip--mvp">MVP</span><span class="req-chip">Sprint 4</span><span class="req-chip req-chip--state">Não iniciado</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve permitir o registo da entrada de um lote de peças no stock, com informação da peça, da quantidade, da data, do fornecedor e do preço de custo unitário.

**Intenção e valor.** <span id="us08"></span>**US08** — Como usuário da loja, quero registrar a entrada de um lote de peças para manter o estoque atualizado e identificar sua origem e seu custo de aquisição.

**Origem e agrupamento.** [CP2 — Controle e Movimentação de Estoque](solucao-e-caracteristicas.md#cp2) · objetivo principal [OE6](solucao-e-caracteristicas.md#oe6) · épico [EP02](mvp.md#ep02)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF02](#rnf02-tolerancia-a-falhas-de-conexao), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF01](#rf01), [RF07](#rf07) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **4/4** · MoSCoW **Must Have** · Esforço técnico **1** (EI 1, CA 1, LC 1) · Score **6** · Quadrante **Q1**.  
*Justificativa:* VN 4 + peso MoSCoW 3 (Must Have) − ET 1 = Score 6. Score ≥ 4, selecionado para o MVP. Quadrante Q1: alto valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **MVP**. Planejado para a **Sprint 4** (ver [Cronograma e entregas](cronograma-e-entregas.md)). Situação atual: **Não iniciado**.

**Evolução.**

- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record" id="rf09" markdown="1">
<summary><span class="req-record__id">RF09</span><span class="req-record__name">Registar saída manual</span><span class="req-record__chips"><span class="req-chip req-chip--mvp">MVP</span><span class="req-chip">Sprint 5</span><span class="req-chip req-chip--state">Não iniciado</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve permitir que utilizadores com perfil Administrador ou Operador registrem uma saída manual de peças do stock, com informação da peça, da quantidade, da data e do motivo.

**Intenção e valor.** <span id="us09"></span>**US09** — Como administrador ou operador da loja, quero registrar uma saída de peças que não decorra de venda para manter o saldo coerente com a movimentação física e seu motivo.

**Origem e agrupamento.** [CP2 — Controle e Movimentação de Estoque](solucao-e-caracteristicas.md#cp2) · objetivo principal [OE6](solucao-e-caracteristicas.md#oe6) · épico [EP02](mvp.md#ep02)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF02](#rnf02-tolerancia-a-falhas-de-conexao), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF01](#rf01) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **4/4** · MoSCoW **Must Have** · Esforço técnico **2** (EI 2, CA 2, LC 2) · Score **5** · Quadrante **Q1**.  
*Justificativa:* VN 4 + peso MoSCoW 3 (Must Have) − ET 2 = Score 5. Score ≥ 4, selecionado para o MVP. Quadrante Q1: alto valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **MVP**. Planejado para a **Sprint 5** (ver [Cronograma e entregas](cronograma-e-entregas.md)). Situação atual: **Não iniciado**.

**Evolução.**

- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record" id="rf10" markdown="1">
<summary><span class="req-record__id">RF10</span><span class="req-record__name">Registar ajuste de inventário</span><span class="req-record__chips"><span class="req-chip req-chip--mvp">MVP</span><span class="req-chip">Sprint 5</span><span class="req-chip req-chip--state">Não iniciado</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve permitir que apenas o perfil Administrador realize o registo de um ajuste de inventário, com informação da peça, da diferença de quantidade (positiva ou negativa) e da justificativa do ajuste.

**Intenção e valor.** <span id="us10"></span>**US10** — Como administrador da loja, quero registrar uma diferença de inventário com justificativa para corrigir o saldo de uma peça conforme a contagem física.

**Origem e agrupamento.** [CP2 — Controle e Movimentação de Estoque](solucao-e-caracteristicas.md#cp2) · objetivo principal [OE6](solucao-e-caracteristicas.md#oe6) · épico [EP02](mvp.md#ep02)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF02](#rnf02-tolerancia-a-falhas-de-conexao), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF01](#rf01) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **4/4** · MoSCoW **Must Have** · Esforço técnico **2** (EI 2, CA 2, LC 2) · Score **5** · Quadrante **Q1**.  
*Justificativa:* VN 4 + peso MoSCoW 3 (Must Have) − ET 2 = Score 5. Score ≥ 4, selecionado para o MVP. Quadrante Q1: alto valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **MVP**. Planejado para a **Sprint 5** (ver [Cronograma e entregas](cronograma-e-entregas.md)). Situação atual: **Não iniciado**.

**Evolução.**

- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record" id="rf11" markdown="1">
<summary><span class="req-record__id">RF11</span><span class="req-record__name">Registar devolução de peça</span><span class="req-record__chips"><span class="req-chip req-chip--condicionado">Condicionado</span><span class="req-chip req-chip--state">A refinar</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve permitir que o usuário registre a devolução de uma peça vinculada a uma venda, restabelecendo a quantidade devolvida ao saldo do estoque.

**Intenção e valor.** Sem história de usuário associada: o requisito ainda não foi recortado para entrega.

**Origem e agrupamento.** [CP2 — Controle e Movimentação de Estoque](solucao-e-caracteristicas.md#cp2) · objetivo principal [OE6](solucao-e-caracteristicas.md#oe6)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF02](#rnf02-tolerancia-a-falhas-de-conexao), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF15](#rf15) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **3/4** · MoSCoW **Should Have** · Esforço técnico **2** (EI 2, CA 2, LC 2) · Score **3** · Quadrante **Q1**.  
*Justificativa:* VN 3 + peso MoSCoW 2 (Should Have) − ET 2 = Score 3. Score entre 2 e 3, condicionado à capacidade da equipe. Quadrante Q1: alto valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **Condicionado**. Entra no escopo apenas se houver folga de capacidade após a Sprint 5; por isso não possui US nem sprint atribuída. Situação atual: **A refinar**.

**Evolução.**

- 03/10/2026 · Declaração ajustada: a devolução passou a ser vinculada a uma venda, conforme feedback da monitoria.
- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record" id="rf12" markdown="1">
<summary><span class="req-record__id">RF12</span><span class="req-record__name">Consultar saldo de peça</span><span class="req-record__chips"><span class="req-chip req-chip--mvp">MVP</span><span class="req-chip">Sprint 4</span><span class="req-chip req-chip--state">Não iniciado</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve exibir o saldo atual da peça (quantidade física total disponível).

**Intenção e valor.** <span id="us12"></span>**US12** — Como usuário da loja, quero consultar a quantidade física disponível de uma peça para informar sua disponibilidade durante o atendimento.

**Origem e agrupamento.** [CP2 — Controle e Movimentação de Estoque](solucao-e-caracteristicas.md#cp2) · objetivo principal [OE6](solucao-e-caracteristicas.md#oe6) · épico [EP02](mvp.md#ep02)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF04](#rnf04-desempenho-de-resposta), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF08](#rf08), [RF09](#rf09), [RF10](#rf10) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **3/4** · MoSCoW **Must Have** · Esforço técnico **1** (EI 1, CA 1, LC 2) · Score **5** · Quadrante **Q1**.  
*Justificativa:* VN 3 + peso MoSCoW 3 (Must Have) − ET 1 = Score 5. Score ≥ 4, selecionado para o MVP. Quadrante Q1: alto valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **MVP**. Planejado para a **Sprint 4** (ver [Cronograma e entregas](cronograma-e-entregas.md)). Situação atual: **Não iniciado**.

**Evolução.**

- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record" id="rf13" markdown="1">
<summary><span class="req-record__id">RF13</span><span class="req-record__name">Consultar histórico de movimentações</span><span class="req-record__chips"><span class="req-chip req-chip--condicionado">Condicionado</span><span class="req-chip req-chip--state">A refinar</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve exibir no ecrã o histórico de movimentações da peça.

**Intenção e valor.** Sem história de usuário associada: o requisito ainda não foi recortado para entrega.

**Origem e agrupamento.** [CP2 — Controle e Movimentação de Estoque](solucao-e-caracteristicas.md#cp2) · objetivo principal [OE6](solucao-e-caracteristicas.md#oe6)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF08](#rf08), [RF09](#rf09), [RF10](#rf10) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **3/4** · MoSCoW **Could Have** · Esforço técnico **2** (EI 2, CA 1, LC 2) · Score **2** · Quadrante **Q1**.  
*Justificativa:* VN 3 + peso MoSCoW 1 (Could Have) − ET 2 = Score 2. Score entre 2 e 3, condicionado à capacidade da equipe. Quadrante Q1: alto valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **Condicionado**. Entra no escopo apenas se houver folga de capacidade após a Sprint 5; por isso não possui US nem sprint atribuída. Situação atual: **A refinar**.

**Evolução.**

- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record" id="rf14" markdown="1">
<summary><span class="req-record__id">RF14</span><span class="req-record__name">Filtrar histórico por período</span><span class="req-record__chips"><span class="req-chip req-chip--mvp">MVP</span><span class="req-chip">Sprint 5</span><span class="req-chip req-chip--state">Não iniciado</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve permitir que o utilizador aplique um filtro de período (data) na listagem do histórico de movimentações.

**Intenção e valor.** <span id="us14"></span>**US14** — Como usuário da loja, quero consultar apenas as movimentações de uma peça em determinado período para analisar o intervalo relevante para minha necessidade.

**Origem e agrupamento.** [CP2 — Controle e Movimentação de Estoque](solucao-e-caracteristicas.md#cp2) · objetivo principal [OE6](solucao-e-caracteristicas.md#oe6) · épico [EP02](mvp.md#ep02)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF13](#rf13) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **3/4** · MoSCoW **Should Have** · Esforço técnico **1** (EI 1, CA 1, LC 2) · Score **4** · Quadrante **Q1**.  
*Justificativa:* VN 3 + peso MoSCoW 2 (Should Have) − ET 1 = Score 4. Score ≥ 4, selecionado para o MVP. Quadrante Q1: alto valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **MVP**. Planejado para a **Sprint 5** (ver [Cronograma e entregas](cronograma-e-entregas.md)). Situação atual: **Não iniciado**.

**Evolução.**

- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

#### CP3 — Registro de Vendas e Recebimentos

Objetivo principal: [OE2](solucao-e-caracteristicas.md#oe2). Contribuição secundária: [OE5](solucao-e-caracteristicas.md#oe5). 6 requisitos registrados.

<details class="req-record" id="rf15" markdown="1">
<summary><span class="req-record__id">RF15</span><span class="req-record__name">Registrar venda</span><span class="req-record__chips"><span class="req-chip req-chip--mvp">MVP</span><span class="req-chip">Sprint 5</span><span class="req-chip req-chip--state">Não iniciado</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve permitir a utilizadores com perfil Administrador ou Operador o registro de uma venda com informação do canal de origem, das peças vendidas, das quantidades e do preço, atualizando o saldo em estoque.

**Intenção e valor.** <span id="us15"></span>**US15** — Como administrador ou operador da loja, quero registrar uma venda com seus itens e canal de origem para manter as vendas documentadas e o saldo de estoque atualizado.

**Origem e agrupamento.** [CP3 — Registro de Vendas e Recebimentos](solucao-e-caracteristicas.md#cp3) · objetivo principal [OE2](solucao-e-caracteristicas.md#oe2) · épico [EP03](mvp.md#ep03)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF02](#rnf02-tolerancia-a-falhas-de-conexao), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF01](#rf01), [RF12](#rf12) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **4/4** · MoSCoW **Must Have** · Esforço técnico **2** (EI 2, CA 2, LC 1) · Score **5** · Quadrante **Q1**.  
*Justificativa:* VN 4 + peso MoSCoW 3 (Must Have) − ET 2 = Score 5. Score ≥ 4, selecionado para o MVP. Quadrante Q1: alto valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **MVP**. Planejado para a **Sprint 5** (ver [Cronograma e entregas](cronograma-e-entregas.md)). Situação atual: **Não iniciado**.

**Evolução.**

- 03/10/2026 · Declaração simplificada quanto à atualização do saldo em estoque, conforme feedback da monitoria.
- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record" id="rf16" markdown="1">
<summary><span class="req-record__id">RF16</span><span class="req-record__name">Cancelar venda</span><span class="req-record__chips"><span class="req-chip req-chip--mvp">MVP</span><span class="req-chip">Sprint 5</span><span class="req-chip req-chip--state">Não iniciado</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve permitir ao Administrador cancelar uma venda registrada previamente, revertendo a baixa de estoque correspondente.

**Intenção e valor.** <span id="us16"></span>**US16** — Como administrador da loja, quero cancelar uma venda registrada para corrigir um registro de venda e restabelecer ao estoque as quantidades baixadas.

**Origem e agrupamento.** [CP3 — Registro de Vendas e Recebimentos](solucao-e-caracteristicas.md#cp3) · objetivo principal [OE2](solucao-e-caracteristicas.md#oe2) · épico [EP03](mvp.md#ep03)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF02](#rnf02-tolerancia-a-falhas-de-conexao), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF15](#rf15) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **4/4** · MoSCoW **Should Have** · Esforço técnico **2** (EI 2, CA 2, LC 1) · Score **4** · Quadrante **Q1**.  
*Justificativa:* VN 4 + peso MoSCoW 2 (Should Have) − ET 2 = Score 4. Score ≥ 4, selecionado para o MVP. Quadrante Q1: alto valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **MVP**. Planejado para a **Sprint 5** (ver [Cronograma e entregas](cronograma-e-entregas.md)). Situação atual: **Não iniciado**.

**Evolução.**

- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record" id="rf17" markdown="1">
<summary><span class="req-record__id">RF17</span><span class="req-record__name">Registrar encargos da venda</span><span class="req-record__chips"><span class="req-chip req-chip--evolução">Evolução futura</span><span class="req-chip req-chip--state">Fora do escopo desta versão</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve permitir o registro dos valores de desconto concedido, frete cobrado e taxas aplicadas (ex: comissão do marketplace) para uma venda já criada.

**Intenção e valor.** Sem história de usuário associada: o requisito ainda não foi recortado para entrega.

**Origem e agrupamento.** [CP3 — Registro de Vendas e Recebimentos](solucao-e-caracteristicas.md#cp3) · objetivo principal [OE2](solucao-e-caracteristicas.md#oe2)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF02](#rnf02-tolerancia-a-falhas-de-conexao), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF15](#rf15) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **0/4** · MoSCoW **Won't Have** · Esforço técnico **2** (EI 2, CA 2, LC 1) · Score **-2** · Quadrante **Q3**.  
*Justificativa:* VN 0 + peso MoSCoW 0 (Won't Have) − ET 2 = Score -2. Score ≤ 1, mantido como evolução futura. Quadrante Q3: baixo valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **Evolução futura**. Permanece fora desta versão do produto, sem sprint atribuída. Situação atual: **Fora do escopo desta versão**.

**Evolução.**

- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record" id="rf18" markdown="1">
<summary><span class="req-record__id">RF18</span><span class="req-record__name">Gerenciar status de recebimento</span><span class="req-record__chips"><span class="req-chip req-chip--evolução">Evolução futura</span><span class="req-chip req-chip--state">Fora do escopo desta versão</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve permitir que o usuário registre o recebimento (total ou parcial) de uma venda e a forma de pagamento por meio de um botão dropdown, com as opções de status de recebimento. O status de novas vendas deve iniciar como "a receber", podendo o utilizador com perfil Administrador ou Operador atualizar esse status de forma autónoma ao registo.

**Intenção e valor.** Sem história de usuário associada: o requisito ainda não foi recortado para entrega.

**Origem e agrupamento.** [CP3 — Registro de Vendas e Recebimentos](solucao-e-caracteristicas.md#cp3) · objetivo principal [OE2](solucao-e-caracteristicas.md#oe2)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF02](#rnf02-tolerancia-a-falhas-de-conexao), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF15](#rf15) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **0/4** · MoSCoW **Won't Have** · Esforço técnico **2** (EI 2, CA 2, LC 2) · Score **-2** · Quadrante **Q3**.  
*Justificativa:* VN 0 + peso MoSCoW 0 (Won't Have) − ET 2 = Score -2. Score ≤ 1, mantido como evolução futura. Quadrante Q3: baixo valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **Evolução futura**. Permanece fora desta versão do produto, sem sprint atribuída. Situação atual: **Fora do escopo desta versão**.

**Evolução.**

- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record" id="rf19" markdown="1">
<summary><span class="req-record__id">RF19</span><span class="req-record__name">Exibir total consolidado</span><span class="req-record__chips"><span class="req-chip req-chip--evolução">Evolução futura</span><span class="req-chip req-chip--state">Fora do escopo desta versão</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve exibir uma página com o total consolidado de valores a receber, listando as vendas pendentes.

**Intenção e valor.** Sem história de usuário associada: o requisito ainda não foi recortado para entrega.

**Origem e agrupamento.** [CP3 — Registro de Vendas e Recebimentos](solucao-e-caracteristicas.md#cp3) · objetivo principal [OE2](solucao-e-caracteristicas.md#oe2)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF18](#rf18) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **0/4** · MoSCoW **Could Have** · Esforço técnico **1** (EI 2, CA 1, LC 1) · Score **0** · Quadrante **Q3**.  
*Justificativa:* VN 0 + peso MoSCoW 1 (Could Have) − ET 1 = Score 0. Score ≤ 1, mantido como evolução futura. Quadrante Q3: baixo valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **Evolução futura**. Permanece fora desta versão do produto, sem sprint atribuída. Situação atual: **Fora do escopo desta versão**.

**Evolução.**

- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record" id="rf20" markdown="1">
<summary><span class="req-record__id">RF20</span><span class="req-record__name">Filtrar página de recebíveis</span><span class="req-record__chips"><span class="req-chip req-chip--evolução">Evolução futura</span><span class="req-chip req-chip--state">Fora do escopo desta versão</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve permitir que o usuário aplique filtros por período e canal na página de recebíveis.

**Intenção e valor.** Sem história de usuário associada: o requisito ainda não foi recortado para entrega.

**Origem e agrupamento.** [CP3 — Registro de Vendas e Recebimentos](solucao-e-caracteristicas.md#cp3) · objetivo principal [OE2](solucao-e-caracteristicas.md#oe2)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF19](#rf19) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **0/4** · MoSCoW **Could Have** · Esforço técnico **1** (EI 1, CA 2, LC 1) · Score **0** · Quadrante **Q3**.  
*Justificativa:* VN 0 + peso MoSCoW 1 (Could Have) − ET 1 = Score 0. Score ≤ 1, mantido como evolução futura. Quadrante Q3: baixo valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **Evolução futura**. Permanece fora desta versão do produto, sem sprint atribuída. Situação atual: **Fora do escopo desta versão**.

**Evolução.**

- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

#### CP4 — Análise e Planejamento de Compras

Objetivo principal: [OE4](solucao-e-caracteristicas.md#oe4). Contribuição secundária: [OE2](solucao-e-caracteristicas.md#oe2), [OE5](solucao-e-caracteristicas.md#oe5). 7 requisitos registrados.

<details class="req-record" id="rf21" markdown="1">
<summary><span class="req-record__id">RF21</span><span class="req-record__name">Definir estoque mínimo por peça</span><span class="req-record__chips"><span class="req-chip req-chip--condicionado">Condicionado</span><span class="req-chip req-chip--state">A refinar</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve permitir a configuração de uma quantidade mínima de estoque para cada peça, abaixo da qual o item é considerado em estado crítico.

**Intenção e valor.** Sem história de usuário associada: o requisito ainda não foi recortado para entrega.

**Origem e agrupamento.** [CP4 — Análise e Planejamento de Compras](solucao-e-caracteristicas.md#cp4) · objetivo principal [OE4](solucao-e-caracteristicas.md#oe4)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF02](#rnf02-tolerancia-a-falhas-de-conexao), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF01](#rf01) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **2/4** · MoSCoW **Should Have** · Esforço técnico **1** (EI 1, CA 1, LC 1) · Score **3** · Quadrante **Q3**.  
*Justificativa:* VN 2 + peso MoSCoW 2 (Should Have) − ET 1 = Score 3. Score entre 2 e 3, condicionado à capacidade da equipe. Quadrante Q3: baixo valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **Condicionado**. Entra no escopo apenas se houver folga de capacidade após a Sprint 5; por isso não possui US nem sprint atribuída. Situação atual: **A refinar**.

**Evolução.**

- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record" id="rf22" markdown="1">
<summary><span class="req-record__id">RF22</span><span class="req-record__name">Consultar painel de estoque crítico</span><span class="req-record__chips"><span class="req-chip req-chip--condicionado">Condicionado</span><span class="req-chip req-chip--state">A refinar</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve exibir um painel consolidado com todas as peças em estado crítico (saldo abaixo do mínimo ou zerado), com indicação do saldo atual e do mínimo configurado.

**Intenção e valor.** Sem história de usuário associada: o requisito ainda não foi recortado para entrega.

**Origem e agrupamento.** [CP4 — Análise e Planejamento de Compras](solucao-e-caracteristicas.md#cp4) · objetivo principal [OE4](solucao-e-caracteristicas.md#oe4)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF04](#rnf04-desempenho-de-resposta), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF21](#rf21), [RF12](#rf12) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **2/4** · MoSCoW **Should Have** · Esforço técnico **2** (EI 2, CA 3, LC 2) · Score **2** · Quadrante **Q3**.  
*Justificativa:* VN 2 + peso MoSCoW 2 (Should Have) − ET 2 = Score 2. Score entre 2 e 3, condicionado à capacidade da equipe. Quadrante Q3: baixo valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **Condicionado**. Entra no escopo apenas se houver folga de capacidade após a Sprint 5; por isso não possui US nem sprint atribuída. Situação atual: **A refinar**.

**Evolução.**

- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record" id="rf23" markdown="1">
<summary><span class="req-record__id">RF23</span><span class="req-record__name">Criar lista de compras</span><span class="req-record__chips"><span class="req-chip req-chip--evolução">Evolução futura</span><span class="req-chip req-chip--state">Fora do escopo desta versão</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve permitir a criação de uma lista de compras para a próxima remessa, com adição manual das peças desejadas e das quantidades a pedir.

**Intenção e valor.** Sem história de usuário associada: o requisito ainda não foi recortado para entrega.

**Origem e agrupamento.** [CP4 — Análise e Planejamento de Compras](solucao-e-caracteristicas.md#cp4) · objetivo principal [OE4](solucao-e-caracteristicas.md#oe4)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF02](#rnf02-tolerancia-a-falhas-de-conexao), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF01](#rf01) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **1/4** · MoSCoW **Could Have** · Esforço técnico **1** (EI 2, CA 1, LC 1) · Score **1** · Quadrante **Q3**.  
*Justificativa:* VN 1 + peso MoSCoW 1 (Could Have) − ET 1 = Score 1. Score ≤ 1, mantido como evolução futura. Quadrante Q3: baixo valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **Evolução futura**. Permanece fora desta versão do produto, sem sprint atribuída. Situação atual: **Fora do escopo desta versão**.

**Evolução.**

- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record" id="rf24" markdown="1">
<summary><span class="req-record__id">RF24</span><span class="req-record__name">Confirmar recebimento de remessa</span><span class="req-record__chips"><span class="req-chip req-chip--evolução">Evolução futura</span><span class="req-chip req-chip--state">Fora do escopo desta versão</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve permitir a confirmação do recebimento de uma remessa vinculada a uma lista de compras, aceitando recebimentos parciais ou totais. Caso a quantidade recebida seja divergente da lista, o sistema deve exigir uma justificativa. Ao confirmar, o saldo em estoque deve ser atualizado imediatamente.

**Intenção e valor.** Sem história de usuário associada: o requisito ainda não foi recortado para entrega.

**Origem e agrupamento.** [CP4 — Análise e Planejamento de Compras](solucao-e-caracteristicas.md#cp4) · objetivo principal [OE4](solucao-e-caracteristicas.md#oe4)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF02](#rnf02-tolerancia-a-falhas-de-conexao), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF23](#rf23) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **0/4** · MoSCoW **Won't Have** · Esforço técnico **2** (EI 2, CA 2, LC 2) · Score **-2** · Quadrante **Q3**.  
*Justificativa:* VN 0 + peso MoSCoW 0 (Won't Have) − ET 2 = Score -2. Score ≤ 1, mantido como evolução futura. Quadrante Q3: baixo valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **Evolução futura**. Permanece fora desta versão do produto, sem sprint atribuída. Situação atual: **Fora do escopo desta versão**.

**Evolução.**

- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record" id="rf25" markdown="1">
<summary><span class="req-record__id">RF25</span><span class="req-record__name">Listar itens mais vendidos</span><span class="req-record__chips"><span class="req-chip req-chip--condicionado">Condicionado</span><span class="req-chip req-chip--state">A refinar</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve fornecer uma interface de consulta, permitindo filtrar e ordenar itens por: volume de vendas (maior/menor) e itens sem movimentação (indicando dias desde a última saída), com período de tempo configurável.

**Intenção e valor.** Sem história de usuário associada: o requisito ainda não foi recortado para entrega.

**Origem e agrupamento.** [CP4 — Análise e Planejamento de Compras](solucao-e-caracteristicas.md#cp4) · objetivo principal [OE4](solucao-e-caracteristicas.md#oe4)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF04](#rnf04-desempenho-de-resposta), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF15](#rf15) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **3/4** · MoSCoW **Should Have** · Esforço técnico **2** (EI 2, CA 3, LC 2) · Score **3** · Quadrante **Q1**.  
*Justificativa:* VN 3 + peso MoSCoW 2 (Should Have) − ET 2 = Score 3. Score entre 2 e 3, condicionado à capacidade da equipe. Quadrante Q1: alto valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **Condicionado**. Entra no escopo apenas se houver folga de capacidade após a Sprint 5; por isso não possui US nem sprint atribuída. Situação atual: **A refinar**.

**Evolução.**

- 13/10/2026 · Característica de origem realinhada à solução vigente, com a unificação de compras e análise na CP4.
- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record" id="rf26" markdown="1">
<summary><span class="req-record__id">RF26</span><span class="req-record__name">Analisar desempenho por canal</span><span class="req-record__chips"><span class="req-chip req-chip--evolução">Evolução futura</span><span class="req-chip req-chip--state">Fora do escopo desta versão</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve gerar um consolidado de vendas (volume de peças e valor financeiro total), agrupado por canal de origem (balcão, Mercado Livre e contato direto), a partir de um período de tempo configurável.

**Intenção e valor.** Sem história de usuário associada: o requisito ainda não foi recortado para entrega.

**Origem e agrupamento.** [CP4 — Análise e Planejamento de Compras](solucao-e-caracteristicas.md#cp4) · objetivo principal [OE4](solucao-e-caracteristicas.md#oe4)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF04](#rnf04-desempenho-de-resposta), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF15](#rf15) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **0/4** · MoSCoW **Won't Have** · Esforço técnico **2** (EI 2, CA 2, LC 2) · Score **-2** · Quadrante **Q3**.  
*Justificativa:* VN 0 + peso MoSCoW 0 (Won't Have) − ET 2 = Score -2. Score ≤ 1, mantido como evolução futura. Quadrante Q3: baixo valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **Evolução futura**. Permanece fora desta versão do produto, sem sprint atribuída. Situação atual: **Fora do escopo desta versão**.

**Evolução.**

- 13/10/2026 · Característica de origem realinhada à solução vigente, com a unificação de compras e análise na CP4.
- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record" id="rf27" markdown="1">
<summary><span class="req-record__id">RF27</span><span class="req-record__name">Exportar relatórios</span><span class="req-record__chips"><span class="req-chip req-chip--evolução">Evolução futura</span><span class="req-chip req-chip--state">Fora do escopo desta versão</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve permitir a exportação do relatório de movimentações do estoque e do relatório de vendas, ambos gerados em um período configurável e visualizáveis em tela, nos formatos PDF e .xlsx (Excel), preservando os filtros e os dados exibidos.

**Intenção e valor.** Sem história de usuário associada: o requisito ainda não foi recortado para entrega.

**Origem e agrupamento.** [CP4 — Análise e Planejamento de Compras](solucao-e-caracteristicas.md#cp4) · objetivo principal [OE4](solucao-e-caracteristicas.md#oe4)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF04](#rnf04-desempenho-de-resposta), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF13](#rf13), [RF15](#rf15) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **0/4** · MoSCoW **Won't Have** · Esforço técnico **1** (EI 1, CA 1, LC 1) · Score **-1** · Quadrante **Q3**.  
*Justificativa:* VN 0 + peso MoSCoW 0 (Won't Have) − ET 1 = Score -1. Score ≤ 1, mantido como evolução futura. Quadrante Q3: baixo valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **Evolução futura**. Permanece fora desta versão do produto, sem sprint atribuída. Situação atual: **Fora do escopo desta versão**.

**Evolução.**

- 13/10/2026 · Característica de origem realinhada à solução vigente, com a unificação de compras e análise na CP4.
- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

#### CP5 — Controle Financeiro e Capital de Giro

Objetivo principal: [OE5](solucao-e-caracteristicas.md#oe5). Contribuição secundária: [OE3](solucao-e-caracteristicas.md#oe3), [OE6](solucao-e-caracteristicas.md#oe6). 4 requisitos registrados.

<details class="req-record" id="rf28" markdown="1">
<summary><span class="req-record__id">RF28</span><span class="req-record__name">Registrar despesa operacional</span><span class="req-record__chips"><span class="req-chip req-chip--evolução">Evolução futura</span><span class="req-chip req-chip--state">Fora do escopo desta versão</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve permitir ao administrador registrar uma despesa da operação (ex.: aluguel, embalagens ou frete de compra), informando data, categoria e valor.

**Intenção e valor.** Sem história de usuário associada: o requisito ainda não foi recortado para entrega.

**Origem e agrupamento.** [CP5 — Controle Financeiro e Capital de Giro](solucao-e-caracteristicas.md#cp5) · objetivo principal [OE5](solucao-e-caracteristicas.md#oe5)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF02](#rnf02-tolerancia-a-falhas-de-conexao), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* nenhuma dependência identificada na declaração.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **1/4** · MoSCoW **Won't Have** · Esforço técnico **1** (EI 1, CA 2, LC 1) · Score **0** · Quadrante **Q3**.  
*Justificativa:* VN 1 + peso MoSCoW 0 (Won't Have) − ET 1 = Score 0. Score ≤ 1, mantido como evolução futura. Quadrante Q3: baixo valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **Evolução futura**. Permanece fora desta versão do produto, sem sprint atribuída. Situação atual: **Fora do escopo desta versão**.

**Evolução.**

- 02/10/2026 · Operações de despesa separadas em registrar, editar e excluir (RF28, RF29 e RF30), conforme feedback da monitoria.
- 13/10/2026 · Característica de origem realinhada à solução vigente, com a unificação de compras e análise na CP4.
- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record" id="rf29" markdown="1">
<summary><span class="req-record__id">RF29</span><span class="req-record__name">Editar despesa operacional</span><span class="req-record__chips"><span class="req-chip req-chip--evolução">Evolução futura</span><span class="req-chip req-chip--state">Fora do escopo desta versão</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve permitir ao administrador selecionar uma despesa operacional já registrada e alterar sua data, categoria e valor, salvando as alterações no mesmo registro.

**Intenção e valor.** Sem história de usuário associada: o requisito ainda não foi recortado para entrega.

**Origem e agrupamento.** [CP5 — Controle Financeiro e Capital de Giro](solucao-e-caracteristicas.md#cp5) · objetivo principal [OE5](solucao-e-caracteristicas.md#oe5)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF02](#rnf02-tolerancia-a-falhas-de-conexao), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF28](#rf28) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **1/4** · MoSCoW **Won't Have** · Esforço técnico **1** (EI 1, CA 1, LC 1) · Score **0** · Quadrante **Q3**.  
*Justificativa:* VN 1 + peso MoSCoW 0 (Won't Have) − ET 1 = Score 0. Score ≤ 1, mantido como evolução futura. Quadrante Q3: baixo valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **Evolução futura**. Permanece fora desta versão do produto, sem sprint atribuída. Situação atual: **Fora do escopo desta versão**.

**Evolução.**

- 02/10/2026 · Criado a partir da separação das operações de despesa, conforme feedback da monitoria.
- 13/10/2026 · Característica de origem realinhada à solução vigente, com a unificação de compras e análise na CP4.
- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record" id="rf30" markdown="1">
<summary><span class="req-record__id">RF30</span><span class="req-record__name">Excluir despesa operacional</span><span class="req-record__chips"><span class="req-chip req-chip--evolução">Evolução futura</span><span class="req-chip req-chip--state">Fora do escopo desta versão</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve permitir ao administrador selecionar uma despesa operacional já registrada e excluí-la após confirmar a exclusão.

**Intenção e valor.** Sem história de usuário associada: o requisito ainda não foi recortado para entrega.

**Origem e agrupamento.** [CP5 — Controle Financeiro e Capital de Giro](solucao-e-caracteristicas.md#cp5) · objetivo principal [OE5](solucao-e-caracteristicas.md#oe5)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF02](#rnf02-tolerancia-a-falhas-de-conexao), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF28](#rf28) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **1/4** · MoSCoW **Won't Have** · Esforço técnico **1** (EI 1, CA 1, LC 1) · Score **0** · Quadrante **Q3**.  
*Justificativa:* VN 1 + peso MoSCoW 0 (Won't Have) − ET 1 = Score 0. Score ≤ 1, mantido como evolução futura. Quadrante Q3: baixo valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **Evolução futura**. Permanece fora desta versão do produto, sem sprint atribuída. Situação atual: **Fora do escopo desta versão**.

**Evolução.**

- 02/10/2026 · Criado a partir da separação das operações de despesa, conforme feedback da monitoria.
- 13/10/2026 · Característica de origem realinhada à solução vigente, com a unificação de compras e análise na CP4.
- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record" id="rf31" markdown="1">
<summary><span class="req-record__id">RF31</span><span class="req-record__name">Consultar demonstrativo financeiro</span><span class="req-record__chips"><span class="req-chip req-chip--evolução">Evolução futura</span><span class="req-chip req-chip--state">Fora do escopo desta versão</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve disponibilizar ao administrador uma página de demonstrativo financeiro com campos de data inicial e data final. Ao solicitar a consulta, a página deve exibir o total dos valores líquidos das vendas cuja data esteja no período informado, o total das despesas operacionais cuja data esteja no mesmo período e o saldo entre esses totais (receitas menos despesas), com detalhamento das receitas por canal e das despesas por categoria.

**Intenção e valor.** Sem história de usuário associada: o requisito ainda não foi recortado para entrega.

**Origem e agrupamento.** [CP5 — Controle Financeiro e Capital de Giro](solucao-e-caracteristicas.md#cp5) · objetivo principal [OE5](solucao-e-caracteristicas.md#oe5)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF04](#rnf04-desempenho-de-resposta), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF15](#rf15), [RF28](#rf28) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **2/4** · MoSCoW **Could Have** · Esforço técnico **2** (EI 2, CA 2, LC 2) · Score **1** · Quadrante **Q3**.  
*Justificativa:* VN 2 + peso MoSCoW 1 (Could Have) − ET 2 = Score 1. Score ≤ 1, mantido como evolução futura. Quadrante Q3: baixo valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **Evolução futura**. Permanece fora desta versão do produto, sem sprint atribuída. Situação atual: **Fora do escopo desta versão**.

**Evolução.**

- 02/10/2026 · Declaração do demonstrativo financeiro esclarecida (período, totais e detalhamento por canal e por categoria), conforme feedback da monitoria.
- 13/10/2026 · Característica de origem realinhada à solução vigente, com a unificação de compras e análise na CP4.
- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

#### CP6 — Apoio Fiscal e Expedição

Objetivo principal: [OE3](solucao-e-caracteristicas.md#oe3). Contribuição secundária: [OE1](solucao-e-caracteristicas.md#oe1). 5 requisitos registrados.

<details class="req-record" id="rf32" markdown="1">
<summary><span class="req-record__id">RF32</span><span class="req-record__name">Registrar dados fiscais da peça</span><span class="req-record__chips"><span class="req-chip req-chip--evolução">Evolução futura</span><span class="req-chip req-chip--state">Fora do escopo desta versão</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve permitir ao administrador registrar no cadastro da peça: NCM, unidade tributável, alíquotas, origem da mercadoria e CST ou CSOSN, conforme aplicável. Esses dados pertencem à peça; o CFOP depende da operação fiscal e não é um dado fixo desse cadastro.

**Intenção e valor.** Sem história de usuário associada: o requisito ainda não foi recortado para entrega.

**Origem e agrupamento.** [CP6 — Apoio Fiscal e Expedição](solucao-e-caracteristicas.md#cp6) · objetivo principal [OE3](solucao-e-caracteristicas.md#oe3)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF02](#rnf02-tolerancia-a-falhas-de-conexao), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF01](#rf01) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **0/4** · MoSCoW **Won't Have** · Esforço técnico **1** (EI 1, CA 1, LC 1) · Score **-1** · Quadrante **Q3**.  
*Justificativa:* VN 0 + peso MoSCoW 0 (Won't Have) − ET 1 = Score -1. Score ≤ 1, mantido como evolução futura. Quadrante Q3: baixo valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **Evolução futura**. Permanece fora desta versão do produto, sem sprint atribuída. Situação atual: **Fora do escopo desta versão**.

**Evolução.**

- 02/10/2026 · Corrigida a sobreposição entre os dados fiscais da peça e os da operação: o CFOP deixou de pertencer ao cadastro da peça.
- 13/10/2026 · Característica de origem realinhada à solução vigente, com a unificação de compras e análise na CP4.
- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record" id="rf33" markdown="1">
<summary><span class="req-record__id">RF33</span><span class="req-record__name">Editar dados fiscais da peça</span><span class="req-record__chips"><span class="req-chip req-chip--evolução">Evolução futura</span><span class="req-chip req-chip--state">Fora do escopo desta versão</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve permitir ao administrador alterar, no cadastro de uma peça, os dados fiscais já registrados: código NCM, unidade tributável, alíquotas, origem da mercadoria e CST ou CSOSN, conforme aplicável.

**Intenção e valor.** Sem história de usuário associada: o requisito ainda não foi recortado para entrega.

**Origem e agrupamento.** [CP6 — Apoio Fiscal e Expedição](solucao-e-caracteristicas.md#cp6) · objetivo principal [OE3](solucao-e-caracteristicas.md#oe3)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF02](#rnf02-tolerancia-a-falhas-de-conexao), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF32](#rf32) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **0/4** · MoSCoW **Won't Have** · Esforço técnico **1** (EI 1, CA 1, LC 1) · Score **-1** · Quadrante **Q3**.  
*Justificativa:* VN 0 + peso MoSCoW 0 (Won't Have) − ET 1 = Score -1. Score ≤ 1, mantido como evolução futura. Quadrante Q3: baixo valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **Evolução futura**. Permanece fora desta versão do produto, sem sprint atribuída. Situação atual: **Fora do escopo desta versão**.

**Evolução.**

- 02/10/2026 · Corrigida a sobreposição entre os dados fiscais da peça e os da operação.
- 13/10/2026 · Característica de origem realinhada à solução vigente, com a unificação de compras e análise na CP4.
- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record" id="rf34" markdown="1">
<summary><span class="req-record__id">RF34</span><span class="req-record__name">Vincular documento fiscal à venda</span><span class="req-record__chips"><span class="req-chip req-chip--evolução">Evolução futura</span><span class="req-chip req-chip--state">Fora do escopo desta versão</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve permitir vincular a uma venda concluída o número e a data de um documento fiscal já emitido (NF-e, NFC-e ou cupom fiscal). Essas informações ficam associadas à venda.

**Intenção e valor.** Sem história de usuário associada: o requisito ainda não foi recortado para entrega.

**Origem e agrupamento.** [CP6 — Apoio Fiscal e Expedição](solucao-e-caracteristicas.md#cp6) · objetivo principal [OE3](solucao-e-caracteristicas.md#oe3)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF02](#rnf02-tolerancia-a-falhas-de-conexao), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF15](#rf15) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **0/4** · MoSCoW **Won't Have** · Esforço técnico **2** (EI 2, CA 2, LC 1) · Score **-2** · Quadrante **Q3**.  
*Justificativa:* VN 0 + peso MoSCoW 0 (Won't Have) − ET 2 = Score -2. Score ≤ 1, mantido como evolução futura. Quadrante Q3: baixo valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **Evolução futura**. Permanece fora desta versão do produto, sem sprint atribuída. Situação atual: **Fora do escopo desta versão**.

**Evolução.**

- 13/10/2026 · Característica de origem realinhada à solução vigente, com a unificação de compras e análise na CP4.
- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record" id="rf35" markdown="1">
<summary><span class="req-record__id">RF35</span><span class="req-record__name">Registrar envio de peças</span><span class="req-record__chips"><span class="req-chip req-chip--evolução">Evolução futura</span><span class="req-chip req-chip--state">Fora do escopo desta versão</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve permitir o registro, para uma venda com entrega, da modalidade de envio, do código de rastreio e da data de despacho.

**Intenção e valor.** Sem história de usuário associada: o requisito ainda não foi recortado para entrega.

**Origem e agrupamento.** [CP6 — Apoio Fiscal e Expedição](solucao-e-caracteristicas.md#cp6) · objetivo principal [OE3](solucao-e-caracteristicas.md#oe3)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF02](#rnf02-tolerancia-a-falhas-de-conexao), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF15](#rf15) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **0/4** · MoSCoW **Won't Have** · Esforço técnico **1** (EI 2, CA 1, LC 1) · Score **-1** · Quadrante **Q3**.  
*Justificativa:* VN 0 + peso MoSCoW 0 (Won't Have) − ET 1 = Score -1. Score ≤ 1, mantido como evolução futura. Quadrante Q3: baixo valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **Evolução futura**. Permanece fora desta versão do produto, sem sprint atribuída. Situação atual: **Fora do escopo desta versão**.

**Evolução.**

- 13/10/2026 · Característica de origem realinhada à solução vigente, com a unificação de compras e análise na CP4.
- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record" id="rf36" markdown="1">
<summary><span class="req-record__id">RF36</span><span class="req-record__name">Consultar expedições do período</span><span class="req-record__chips"><span class="req-chip req-chip--evolução">Evolução futura</span><span class="req-chip req-chip--state">Fora do escopo desta versão</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve exibir as vendas com entrega de um período, com o status de cada envio (a enviar / enviado / entregue) e os dados de rastreio registrados.

**Intenção e valor.** Sem história de usuário associada: o requisito ainda não foi recortado para entrega.

**Origem e agrupamento.** [CP6 — Apoio Fiscal e Expedição](solucao-e-caracteristicas.md#cp6) · objetivo principal [OE3](solucao-e-caracteristicas.md#oe3)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF35](#rf35) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **0/4** · MoSCoW **Won't Have** · Esforço técnico **2** (EI 2, CA 2, LC 2) · Score **-2** · Quadrante **Q3**.  
*Justificativa:* VN 0 + peso MoSCoW 0 (Won't Have) − ET 2 = Score -2. Score ≤ 1, mantido como evolução futura. Quadrante Q3: baixo valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **Evolução futura**. Permanece fora desta versão do produto, sem sprint atribuída. Situação atual: **Fora do escopo desta versão**.

**Evolução.**

- 13/10/2026 · Característica de origem realinhada à solução vigente, com a unificação de compras e análise na CP4.
- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

#### CP9 — Gerenciamento e Autenticação de Usuários

Objetivo principal: [OE2](solucao-e-caracteristicas.md#oe2). Contribuição secundária: [OE6](solucao-e-caracteristicas.md#oe6). 4 requisitos registrados.

<details class="req-record" id="rf37" markdown="1">
<summary><span class="req-record__id">RF37</span><span class="req-record__name">Autenticar usuário</span><span class="req-record__chips"><span class="req-chip req-chip--evolução">Evolução futura</span><span class="req-chip req-chip--state">Fora do escopo desta versão</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve exigir autenticação por credenciais (e-mail e senha) para acesso a qualquer funcionalidade, bloqueando o acesso após cinco tentativas consecutivas malsucedidas.

**Intenção e valor.** Sem história de usuário associada: o requisito ainda não foi recortado para entrega.

**Origem e agrupamento.** [CP9 — Gerenciamento e Autenticação de Usuários](solucao-e-caracteristicas.md#cp9) · objetivo principal [OE2](solucao-e-caracteristicas.md#oe2)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* nenhuma dependência identificada na declaração.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **0/4** · MoSCoW **Won't Have** · Esforço técnico **2** (EI 2, CA 2, LC 1) · Score **-2** · Quadrante **Q3**.  
*Justificativa:* VN 0 + peso MoSCoW 0 (Won't Have) − ET 2 = Score -2. Score ≤ 1, mantido como evolução futura. Quadrante Q3: baixo valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **Evolução futura**. Permanece fora desta versão do produto, sem sprint atribuída. Situação atual: **Fora do escopo desta versão**.

**Evolução.**

- 13/10/2026 · Característica de origem realinhada à solução vigente, com a unificação de compras e análise na CP4.
- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record" id="rf38" markdown="1">
<summary><span class="req-record__id">RF38</span><span class="req-record__name">Cadastrar usuário</span><span class="req-record__chips"><span class="req-chip req-chip--evolução">Evolução futura</span><span class="req-chip req-chip--state">Fora do escopo desta versão</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve permitir ao administrador cadastrar um usuário, informando e-mail, senha inicial e perfil de acesso (administrador ou operador).

**Intenção e valor.** Sem história de usuário associada: o requisito ainda não foi recortado para entrega.

**Origem e agrupamento.** [CP9 — Gerenciamento e Autenticação de Usuários](solucao-e-caracteristicas.md#cp9) · objetivo principal [OE2](solucao-e-caracteristicas.md#oe2)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF02](#rnf02-tolerancia-a-falhas-de-conexao), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* nenhuma dependência identificada na declaração.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **0/4** · MoSCoW **Won't Have** · Esforço técnico **2** (EI 2, CA 2, LC 1) · Score **-2** · Quadrante **Q3**.  
*Justificativa:* VN 0 + peso MoSCoW 0 (Won't Have) − ET 2 = Score -2. Score ≤ 1, mantido como evolução futura. Quadrante Q3: baixo valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **Evolução futura**. Permanece fora desta versão do produto, sem sprint atribuída. Situação atual: **Fora do escopo desta versão**.

**Evolução.**

- 13/10/2026 · Característica de origem realinhada à solução vigente, com a unificação de compras e análise na CP4.
- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record" id="rf39" markdown="1">
<summary><span class="req-record__id">RF39</span><span class="req-record__name">Editar usuário</span><span class="req-record__chips"><span class="req-chip req-chip--evolução">Evolução futura</span><span class="req-chip req-chip--state">Fora do escopo desta versão</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve permitir ao administrador alterar o e-mail e o perfil de acesso de um usuário ativo, mantendo o histórico de operações desse usuário.

**Intenção e valor.** Sem história de usuário associada: o requisito ainda não foi recortado para entrega.

**Origem e agrupamento.** [CP9 — Gerenciamento e Autenticação de Usuários](solucao-e-caracteristicas.md#cp9) · objetivo principal [OE2](solucao-e-caracteristicas.md#oe2)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF02](#rnf02-tolerancia-a-falhas-de-conexao), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF38](#rf38) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **0/4** · MoSCoW **Won't Have** · Esforço técnico **2** (EI 2, CA 2, LC 1) · Score **-2** · Quadrante **Q3**.  
*Justificativa:* VN 0 + peso MoSCoW 0 (Won't Have) − ET 2 = Score -2. Score ≤ 1, mantido como evolução futura. Quadrante Q3: baixo valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **Evolução futura**. Permanece fora desta versão do produto, sem sprint atribuída. Situação atual: **Fora do escopo desta versão**.

**Evolução.**

- 13/10/2026 · Característica de origem realinhada à solução vigente, com a unificação de compras e análise na CP4.
- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record" id="rf40" markdown="1">
<summary><span class="req-record__id">RF40</span><span class="req-record__name">Desativar usuário</span><span class="req-record__chips"><span class="req-chip req-chip--evolução">Evolução futura</span><span class="req-chip req-chip--state">Fora do escopo desta versão</span></span></summary>
<div class="req-record__body" markdown="1">

**Declaração vigente.** O sistema deve permitir ao administrador desativar uma conta de usuário, impedindo novos acessos dessa conta sem apagar seus registros históricos.

**Intenção e valor.** Sem história de usuário associada: o requisito ainda não foi recortado para entrega.

**Origem e agrupamento.** [CP9 — Gerenciamento e Autenticação de Usuários](solucao-e-caracteristicas.md#cp9) · objetivo principal [OE2](solucao-e-caracteristicas.md#oe2)

**Condições e avaliação.**

- *RNFs aplicáveis:* [RNF01](#rnf01-responsividade-da-interface-em-dispositivos-moveis), [RNF02](#rnf02-tolerancia-a-falhas-de-conexao), [RNF03](#rnf03-compatibilidade-com-navegadores-web), [RNF05](#rnf05-seguranca-de-dados)
- *Depende de:* [RF38](#rf38) — dependências derivadas da leitura da declaração, a validar no refinamento.
- *Critérios de confirmação:* a detalhar no refinamento da história, conforme a [DoR](dor-e-dod.md).

**Priorização.** Valor de negócio **0/4** · MoSCoW **Won't Have** · Esforço técnico **2** (EI 2, CA 2, LC 1) · Score **-2** · Quadrante **Q3**.  
*Justificativa:* VN 0 + peso MoSCoW 0 (Won't Have) − ET 2 = Score -2. Score ≤ 1, mantido como evolução futura. Quadrante Q3: baixo valor e menor esforço.  
*Situação de confirmação:* valor de negócio a confirmar com o proprietário. Método em [Priorização](priorizacao.md).

**Entrega e situação.** Recorte: **Evolução futura**. Permanece fora desta versão do produto, sem sprint atribuída. Situação atual: **Fora do escopo desta versão**.

**Evolução.**

- 13/10/2026 · Característica de origem realinhada à solução vigente, com a unificação de compras e análise na CP4.
- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

### 8.5 Registros dos requisitos não funcionais

Os RNFs são registros únicos que **condicionam** os requisitos funcionais. Cada registro indica a
característica de produto de origem e os requisitos funcionais aos quais se aplica — esse vínculo
é o mesmo exibido no campo *Condições e avaliação* de cada RF.

<details class="req-record req-record--rnf" id="rnf01-responsividade-da-interface-em-dispositivos-moveis" markdown="1">
<summary><span class="req-record__id">RNF01</span><span class="req-record__name">Responsividade da interface em dispositivos móveis</span><span class="req-record__chips"><span class="req-chip req-chip--rnf">Condiciona 40 RFs</span></span></summary>
<div class="req-record__body" markdown="1">

<span id="rnf01"></span>

**Declaração vigente.** A interface web do sistema deve ser responsiva e operável por toque em dispositivos móveis com largura de viewport a partir de 360 pixels CSS em orientação retrato, cobrindo a faixa de 360px a 428px CSS, garantindo ergonomia para as rotinas operacionais da loja (consulta de saldo, registro de movimentação e consulta de vendas).

**Origem e agrupamento.** [CP8 — Acessibilidade e Responsividade](solucao-e-caracteristicas.md#cp8) · objetivo principal [OE3](solucao-e-caracteristicas.md#oe3)

**Classificação.** Usabilidade (URPS+) / produto — usabilidade (Sommerville).

**Critério verificável.** Conformidade com <strong>WCAG 2.1 AA</strong> — área de toque mínima de <strong>44×44 pixels CSS</strong> para todos os elementos interativos, nas larguras de viewport de 360px, 390px e 414px CSS em orientação retrato.

**Aplica-se a.** [RF01](#rf01), [RF02](#rf02), [RF03](#rf03), [RF04](#rf04), [RF05](#rf05), [RF06](#rf06), [RF07](#rf07), [RF08](#rf08), [RF09](#rf09), [RF10](#rf10), [RF11](#rf11), [RF12](#rf12), [RF13](#rf13), [RF14](#rf14), [RF15](#rf15), [RF16](#rf16), [RF17](#rf17), [RF18](#rf18), [RF19](#rf19), [RF20](#rf20), [RF21](#rf21), [RF22](#rf22), [RF23](#rf23), [RF24](#rf24), [RF25](#rf25), [RF26](#rf26), [RF27](#rf27), [RF28](#rf28), [RF29](#rf29), [RF30](#rf30), [RF31](#rf31), [RF32](#rf32), [RF33](#rf33), [RF34](#rf34), [RF35](#rf35), [RF36](#rf36), [RF37](#rf37), [RF38](#rf38), [RF39](#rf39), [RF40](#rf40)

**Evolução.**

- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record req-record--rnf" id="rnf02-tolerancia-a-falhas-de-conexao" markdown="1">
<summary><span class="req-record__id">RNF02</span><span class="req-record__name">Tolerância a falhas de conexão</span><span class="req-record__chips"><span class="req-chip req-chip--rnf">Condiciona 27 RFs</span></span></summary>
<div class="req-record__body" markdown="1">

<span id="rnf02"></span>

**Declaração vigente.** Em caso de perda de conexão de rede durante o processamento de uma operação entre cliente e servidor, o sistema deve garantir a recuperabilidade do estado e a tolerância a falhas sem perda ou duplicidade de dados.

**Origem e agrupamento.** [CP7 — Segurança e Integridade dos Dados](solucao-e-caracteristicas.md#cp7) · objetivo principal [OE2](solucao-e-caracteristicas.md#oe2)

**Classificação.** Confiabilidade (URPS+) / produto — confiabilidade (Sommerville).

**Critério verificável.** <strong>0% de perda ou duplicidade de dados</strong> em operações interrompidas por queda de conexão, garantido por chave de idempotência de requisição.

**Aplica-se a.** [RF01](#rf01), [RF02](#rf02), [RF03](#rf03), [RF05](#rf05), [RF06](#rf06), [RF07](#rf07), [RF08](#rf08), [RF09](#rf09), [RF10](#rf10), [RF11](#rf11), [RF15](#rf15), [RF16](#rf16), [RF17](#rf17), [RF18](#rf18), [RF21](#rf21), [RF23](#rf23), [RF24](#rf24), [RF28](#rf28), [RF29](#rf29), [RF30](#rf30), [RF32](#rf32), [RF33](#rf33), [RF34](#rf34), [RF35](#rf35), [RF38](#rf38), [RF39](#rf39), [RF40](#rf40)

**Evolução.**

- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record req-record--rnf" id="rnf03-compatibilidade-com-navegadores-web" markdown="1">
<summary><span class="req-record__id">RNF03</span><span class="req-record__name">Compatibilidade com navegadores web</span><span class="req-record__chips"><span class="req-chip req-chip--rnf">Condiciona 40 RFs</span></span></summary>
<div class="req-record__body" markdown="1">

<span id="rnf03"></span>

**Declaração vigente.** O sistema deve operar corretamente nos navegadores web modernos Google Chrome, Mozilla Firefox, Microsoft Edge e Apple Safari, nas duas versões mais recentes de cada um, sem exigir instalação de software adicional, extensões ou plugins no dispositivo do usuário.

**Origem e agrupamento.** [CP8 — Acessibilidade e Responsividade](solucao-e-caracteristicas.md#cp8) · objetivo principal [OE3](solucao-e-caracteristicas.md#oe3)

**Classificação.** Suportabilidade/compatibilidade (URPS+) / produto — portabilidade (Sommerville).

**Critério verificável.** Execução sem erros bloqueantes nas <strong>2 versões mais recentes</strong> de Chrome, Firefox, Edge e Safari — sem quebras de layout e com persistência íntegra dos dados.

**Aplica-se a.** [RF01](#rf01), [RF02](#rf02), [RF03](#rf03), [RF04](#rf04), [RF05](#rf05), [RF06](#rf06), [RF07](#rf07), [RF08](#rf08), [RF09](#rf09), [RF10](#rf10), [RF11](#rf11), [RF12](#rf12), [RF13](#rf13), [RF14](#rf14), [RF15](#rf15), [RF16](#rf16), [RF17](#rf17), [RF18](#rf18), [RF19](#rf19), [RF20](#rf20), [RF21](#rf21), [RF22](#rf22), [RF23](#rf23), [RF24](#rf24), [RF25](#rf25), [RF26](#rf26), [RF27](#rf27), [RF28](#rf28), [RF29](#rf29), [RF30](#rf30), [RF31](#rf31), [RF32](#rf32), [RF33](#rf33), [RF34](#rf34), [RF35](#rf35), [RF36](#rf36), [RF37](#rf37), [RF38](#rf38), [RF39](#rf39), [RF40](#rf40)

**Evolução.**

- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record req-record--rnf" id="rnf04-desempenho-de-resposta" markdown="1">
<summary><span class="req-record__id">RNF04</span><span class="req-record__name">Desempenho de resposta</span><span class="req-record__chips"><span class="req-chip req-chip--rnf">Condiciona 7 RFs</span></span></summary>
<div class="req-record__body" markdown="1">

<span id="rnf04"></span>

**Declaração vigente.** As consultas ao catálogo, ao saldo de estoque e aos relatórios devem apresentar os resultados em até três segundos para 95% das requisições (P95), sob conexão de ao menos 10 Mbps e carga de dois usuários simultâneos, em ambiente de produção com banco de dados contendo até 5.000 peças cadastradas e 20.000 movimentações.

**Origem e agrupamento.** Sem característica de produto de origem registrada — pendência a resolver com a equipe no próximo refinamento da Visão do Produto.

**Classificação.** Desempenho (URPS+) / produto — eficiência (Sommerville).

**Critério verificável.** <strong>P95 ≤ 3 segundos</strong> para consultas ao catálogo, saldo de estoque e relatórios analíticos, sob carga de 2 usuários simultâneos e conexão mínima de 10 Mbps.

**Aplica-se a.** [RF04](#rf04), [RF12](#rf12), [RF22](#rf22), [RF25](#rf25), [RF26](#rf26), [RF27](#rf27), [RF31](#rf31)

**Evolução.**

- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

<details class="req-record req-record--rnf" id="rnf05-seguranca-de-dados" markdown="1">
<summary><span class="req-record__id">RNF05</span><span class="req-record__name">Segurança de dados</span><span class="req-record__chips"><span class="req-chip req-chip--rnf">Condiciona 40 RFs</span></span></summary>
<div class="req-record__body" markdown="1">

<span id="rnf05"></span>

**Declaração vigente.** As senhas dos usuários devem ser armazenadas obrigatoriamente utilizando função de hash criptográfico com salt (bcrypt), sendo vedado o armazenamento de credenciais em texto simples. Todo o tráfego de dados entre cliente e servidor deve ser protegido pelo protocolo HTTPS com TLS 1.2 ou superior em todos os ambientes operacionais.

**Origem e agrupamento.** [CP7 — Segurança e Integridade dos Dados](solucao-e-caracteristicas.md#cp7) · objetivo principal [OE2](solucao-e-caracteristicas.md#oe2)

**Classificação.** Segurança (URPS+) / produto — segurança da informação (Sommerville).

**Critério verificável.** <strong>100% das senhas</strong> armazenadas com hash bcrypt com salt; todo o tráfego protegido por <strong>TLS 1.2 ou superior</strong>, sem fallback para HTTP.

**Aplica-se a.** [RF01](#rf01), [RF02](#rf02), [RF03](#rf03), [RF04](#rf04), [RF05](#rf05), [RF06](#rf06), [RF07](#rf07), [RF08](#rf08), [RF09](#rf09), [RF10](#rf10), [RF11](#rf11), [RF12](#rf12), [RF13](#rf13), [RF14](#rf14), [RF15](#rf15), [RF16](#rf16), [RF17](#rf17), [RF18](#rf18), [RF19](#rf19), [RF20](#rf20), [RF21](#rf21), [RF22](#rf22), [RF23](#rf23), [RF24](#rf24), [RF25](#rf25), [RF26](#rf26), [RF27](#rf27), [RF28](#rf28), [RF29](#rf29), [RF30](#rf30), [RF31](#rf31), [RF32](#rf32), [RF33](#rf33), [RF34](#rf34), [RF35](#rf35), [RF36](#rf36), [RF37](#rf37), [RF38](#rf38), [RF39](#rf39), [RF40](#rf40)

**Evolução.**

- 03/11/2026 · Registro consolidado no catálogo integrado: declaração, origem, condições, priorização, entrega e situação passaram a ser mantidas em um único lugar.

</div>
</details>

## Versionamento

| Versão |    Data    | Descrição | Autor(es/as) |
| :----: | :--------: | --- | --- |
| 1.0 | 04/09/2026 | Iniciação do documento | [Thiago Gomes](https://github.com/thgomxs) |
| 1.1 | 24/09/2026 | Formatação dos requisitos funcionais em tabelas e dos não funcionais em cartões | [Thiago Gomes](https://github.com/thgomxs) |
| 1.2 | 30/09/2026 | Atualização dos RFs e RNFs conforme a versão atual dos requisitos | Equipe |
| 1.3 | 02/10/2026 | Separação das operações de despesas, esclarecimento do demonstrativo financeiro e correção da sobreposição dos dados fiscais conforme feedback da monitora | Equipe |
| 1.4 | 03/10/2026 | Ajuste do RF11 (devolução vinculada a venda) e RF15 (simplificação da atualização de estoque) conforme feedback | Equipe |
| 1.5 | 13/10/2026 | Inclusão de âncoras individuais para os RFs e de links para as CPs com origem correspondente na solução | [Thiago Gomes](https://github.com/thgomxs) |
| 1.6 | 13/10/2026 | Alinhamento das CPs dos RF25 a RF40 com a solução atual, unificação de compras e análise na CP4 e atualização dos links de rastreabilidade | [Thiago Gomes](https://github.com/thgomxs) |
| 2.0 | 03/11/2026 | Reestruturação da página como **catálogo integrado**: cada requisito passou a ter um registro único com declaração, intenção e valor, origem, condições, priorização, entrega, situação e evolução. As listas paralelas de requisitos mantidas no Backlog de produto foram incorporadas e eliminadas | Equipe |
