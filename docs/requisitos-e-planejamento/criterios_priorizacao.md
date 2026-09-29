# Critérios de Priorização de Requisitos

A priorização dos requisitos deste projeto utiliza um método composto que cruza a **Matriz de Valor vs. Esforço** com a categorização **MoSCoW**. O objetivo é calcular um índice final para cada funcionalidade, definindo matematicamente o escopo do Produto Mínimo Viável (MVP).

## 1. Avaliação de Valor de Negócio (Perspectiva do Cliente)

A avaliação de valor é realizada junto ao cliente por meio de uma entrevista estruturada. Para evitar ambiguidades, as métricas foram transformadas em perguntas binárias onde **cada resposta "SIM" soma 1 ponto** (escala de 0 a 4).

1. **Essencialidade:** O sistema falha em resolver o seu problema principal se ficar sem essa funcionalidade? *(Sim = 1 ponto)*
2. **Frequência:** Essa funcionalidade seria utilizada rotineiramente no seu dia a dia de operação? *(Sim = 1 ponto)*
3. **Impacto na Dor:** A ausência dessa funcionalidade continua gerando perda de tempo ou de dinheiro hoje? *(Sim = 1 ponto)*
4. **Urgência:** Essa funcionalidade é indispensável para o lançamento da primeira versão da ferramenta? *(Sim = 1 ponto)*

## 2. Avaliação de Esforço Técnico (Perspectiva da Equipe)

O esforço técnico é avaliado pela equipe de desenvolvimento sob a mesma lógica: **cada resposta "SIM" soma 1 ponto** de peso e complexidade (escala de 0 a 4).

1. **Integração Externa:** A implementação requer integração com APIs ou serviços externos (ex: Mercado Livre)? *(Sim = 1 ponto)*
2. **Curva de Aprendizado:** A equipe necessita de capacitação prévia ou estudo adicional de tecnologias para construir essa funcionalidade? *(Sim = 1 ponto)*
3. **Complexidade Lógica:** O requisito exige lógica de negócio complexa, como transações simultâneas ou manipulação cruzada de múltiplas tabelas? *(Sim = 1 ponto)*
4. **Dependência:** O desenvolvimento desta funcionalidade é estritamente bloqueado por outros requisitos que ainda não foram implementados? *(Sim = 1 ponto)*

## 3. Categorização MoSCoW

Como camada adicional de validação, os requisitos recebem uma classificação MoSCoW, que atua como um peso multiplicador/somador na fórmula final:

*   **Must Have (Deve ter):** Obrigatório para o sistema funcionar e ser legalmente ou operacionalmente viável. **(Peso: 3)**
*   **Should Have (Deveria ter):** Importante e de alto valor, mas existe um contorno manual temporário. **(Peso: 2)**
*   **Could Have (Poderia ter):** Desejável, mas não afeta a operação principal se for deixado para depois. **(Peso: 1)**
*   **Won't Have (Não terá agora):** Fora do escopo do MVP, alocado para o backlog futuro. **(Peso: 0)**

## 4. Cálculo de Prioridade e Definição do MVP

Para encontrar o valor final de prioridade do requisito e definir de forma objetiva se ele entra no MVP, utilizamos a seguinte fórmula:

**Score Final = (Valor de Negócio) + (Peso MoSCoW) - (Esforço Técnico)**

**Critério de Corte (MVP):**
*   **Score Final ≥ 4:** Prioridade Máxima. Entra automaticamente no escopo do MVP.
*   **Score Final de 2 a 3:** Prioridade Média. Entra no escopo condicionado à capacidade técnica da equipe nas sprints iniciais.
*   **Score Final ≤ 1:** Prioridade Baixa. Movido para o backlog de evolução futura.