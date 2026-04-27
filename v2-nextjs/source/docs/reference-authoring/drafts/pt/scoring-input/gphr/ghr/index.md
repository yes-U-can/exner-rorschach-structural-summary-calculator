---
canonicalRoute: "scoring-input/gphr/GHR"
locale: "pt"
docKind: "coding-entry"
canonicalTitle: "scoring-input/gphr/GHR"
displayTitle: "[Codificacao/GHR-PHR] GHR"
aliases:
  - "GHR"
  - "boa representacao humana"
  - "boa resposta representacional humana"
relatedRoutes:
  - "scoring-input/gphr"
  - "scoring-input/gphr/PHR"
  - "scoring-input/contents/H"
  - "scoring-input/determinants/M"
  - "scoring-input/special-score/COP"
  - "scoring-input/popular"
  - "result-interpretation/lower-section/interpersonal/HumanCont"
  - "result-interpretation/lower-section/interpersonal/PureH"
authorityPolicy: "exner-base"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/provenance-pt-gphr-2026-03-11.md"
---

# Nome do documento: [Codificacao/GHR-PHR] GHR

## Apelidos e busca

- GHR
- boa representacao humana
- boa resposta representacional humana

## Definicao central

`GHR` marca uma resposta representacional humana relativamente mais integrada ou adaptativa dentro da sequencia do sistema.
Ele nao e um julgamento clinico livre, mas o resultado de seguir a sequencia sem ser capturado pelos criterios que empurram para `PHR`.

## Condicoes de aplicacao

- Primeiro confirme que a resposta pertence ao dominio de representacao humana.
- Um caso forte de `GHR` e uma resposta `H` pura com `FQ+`, `FQo` ou `FQu`, sem escores cognitivos especiais importantes e sem [`AG`](ref://scoring-input/special-score/AG) ou [`MOR`](ref://scoring-input/special-score/MOR).
- Uma resposta com [`COP`](ref://scoring-input/special-score/COP) tambem pode terminar em `GHR`, desde que nao traga `AG`.
- Respostas populares nos Cartoes III, IV, VII e IX tambem podem empurrar para `GHR` se nenhum criterio anterior de `PHR` ja tiver capturado a resposta.
- Se nenhum criterio de `PHR` a capturar antes, a resposta representacional humana restante termina em `GHR`.

## Cuidados e diferenciacao

- `GHR` nao e dado so porque a resposta parece socialmente agradavel.
- `H` sozinho nao garante `GHR`; qualidade formal e escores especiais ainda importam.
- Se houver agressao, conteudo morbido, forma ruim ou escores cognitivos importantes, revise [`PHR`](ref://scoring-input/gphr/PHR) primeiro.
- A decisao e sempre feita dentro da sequencia, nao por uma regra solta.

## Referencias cruzadas

- [[Codificacao/GHR-PHR] GHR/PHR](ref://scoring-input/gphr)
- [[Codificacao/GHR-PHR] PHR](ref://scoring-input/gphr/PHR)
- [[Codificacao/Conteudo] H](ref://scoring-input/contents/H)
- [[Codificacao/Determinantes] M](ref://scoring-input/determinants/M)
- [[Codificacao/Escore Especial] COP](ref://scoring-input/special-score/COP)
- [[Codificacao/Resposta Popular] Popular](ref://scoring-input/popular)
- [[Interpretacao/Interpersonal] Human Content](ref://result-interpretation/lower-section/interpersonal/HumanCont)
- [[Interpretacao/Interpersonal] Pure H](ref://result-interpretation/lower-section/interpersonal/PureH)

## Nota de base

- A comparacao detalhada de fontes ficou separada na nota interna de provenance.
