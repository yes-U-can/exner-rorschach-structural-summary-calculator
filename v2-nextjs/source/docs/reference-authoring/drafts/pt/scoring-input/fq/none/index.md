---
canonicalRoute: "scoring-input/fq/none"
locale: "pt"
docKind: "coding-entry"
canonicalTitle: "scoring-input/fq/none"
displayTitle: "[Codificacao/Qualidade Formal] none"
aliases:
  - "none"
  - "FQnone"
  - "sem codigo FQ"
relatedRoutes:
  - "scoring-input/fq"
  - "scoring-input/determinants/M"
  - "scoring-input/special-score/AB"
authorityPolicy: "exner-base"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/provenance-pt-fq-2026-03-10.md"
---

# Nome do documento: [Codificacao/Qualidade Formal] none

## Apelidos e busca

- none
- FQnone
- sem codigo FQ

## Definicao central

`none` e usado quando a resposta nao recebe codigo de qualidade formal.
Isso significa que a forma nao esta disponivel como base codificavel para julgar ajuste formal.

## Condicoes de aplicacao

- A resposta nao oferece base formal utilizavel para atribuir `+`, `o`, `u` ou `-`.
- O codigo separa essas respostas das que realmente recebem um FQ especifico.
- Use com cautela e apenas quando a qualidade formal realmente nao deve ser codificada.

## Cuidados e diferenciacao

- `none` nao e o mesmo que [`FQ-`](ref://scoring-input/fq/-). `-` significa ajuste ruim; `none` significa que nenhum FQ se aplica.
- Nao transforme resposta de ajuste ruim em `none` apenas porque e dificil.
- Confira os determinantes envolvidos antes de decidir que nao existe FQ codificavel.

## Referencias cruzadas

- [[Codificacao/Qualidade Formal] FQ](ref://scoring-input/fq)
- [[Codificacao/Determinantes] M](ref://scoring-input/determinants/M)
- [[Codificacao/Scores Especiais] AB](ref://scoring-input/special-score/AB)

## Nota de base

- A comparacao detalhada de fontes ficou separada na nota interna de provenance.
