---
canonicalRoute: "scoring-input"
locale: "pt"
docKind: "coding-overview"
canonicalTitle: "scoring-input"
displayTitle: "[Codificacao] scoring-input"
aliases:
  - "scoring-input"
  - "entrada de codificacao"
  - "codificacao"
  - "entrada de scores"
relatedRoutes:
  - "scoring-input/score"
  - "scoring-input/card"
  - "scoring-input/location"
  - "scoring-input/dq"
  - "scoring-input/determinants"
  - "scoring-input/fq"
  - "scoring-input/pair"
  - "scoring-input/contents"
  - "scoring-input/popular"
  - "scoring-input/z"
  - "scoring-input/gphr"
  - "scoring-input/special-score"
authorityPolicy: "exner-base"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/provenance-pt-scoring-input-overview-2026-03-11.md"
---

# Nome do documento: [Codificacao] scoring-input

## Apelidos e busca

- scoring-input
- entrada de codificacao
- codificacao
- entrada de scores

## Definicao central

`scoring-input` nomeia toda a fase em que cada resposta e convertida em codigos do Sistema Compreensivo.
Esta pagina nao interpreta variaveis do sumario estrutural; ela organiza as familias de codificacao usadas antes de a interpretacao comecar.

## Condicoes de aplicacao

- A codificacao e feita resposta por resposta, na ordem real do protocolo.
- Para cada resposta, costuma ser mais seguro verificar `location`, `DQ`, `determinants`, `FQ`, `content` e codigos suplementares numa sequencia consistente.
- Quando necessario, `Pair`, `Popular`, `Z`, `GHR/PHR` e `Special Scores` tambem sao acrescentados.
- As decisoes de codificacao devem vir da resposta mais o inquerito relevante, nao de uma impressao clinica global posterior.
- O objetivo desta fase e registrar cada resposta em simbolos com precisao suficiente para sustentar o sumario estrutural.

## Cuidados e diferenciacao

- Codificacao nao e a mesma tarefa que interpretacao.
- Nesta fase, a descricao precisa da resposta importa mais do que um significado clinico amplo.
- Um cartao ou contexto pode orientar a atencao, mas o codigo final ainda depende das caracteristicas concretas da resposta.
- O mesmo sinal pode ter significados diferentes conforme o contexto.
- Por exemplo, `Cartao V` nao e o determinante `V`.
- Da mesma forma, `DQ +` nao e `FQ +`.

## Referencias cruzadas

- [[Codificacao] score](ref://scoring-input/score)
- [[Codificacao/Cartoes] Cartao](ref://scoring-input/card)
- [[Codificacao/Localizacao] Location](ref://scoring-input/location)
- [[Codificacao/DQ] DQ](ref://scoring-input/dq)
- [[Codificacao/Determinantes] Determinants](ref://scoring-input/determinants)
- [[Codificacao/FQ] FQ](ref://scoring-input/fq)
- [[Codificacao/Pair] Pair](ref://scoring-input/pair)
- [[Codificacao/Conteudos] Contents](ref://scoring-input/contents)
- [[Codificacao/Popular] Popular](ref://scoring-input/popular)
- [[Codificacao/Z] Z](ref://scoring-input/z)
- [[Codificacao/GHR-PHR] GHR/PHR](ref://scoring-input/gphr)
- [[Codificacao/Scores Especiais] Special Scores](ref://scoring-input/special-score)

## Nota de base

- A comparacao detalhada de fontes ficou separada na nota interna de provenance.
