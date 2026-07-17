---
canonicalRoute: "scoring-input/fq/none"
locale: "pt"
docKind: "coding-entry"
canonicalTitle: "scoring-input/fq/none"
displayTitle: "[Codificação/Qualidade Formal] none"
aliases:
  - "none"
  - "FQnone"
  - "sem código FQ"
relatedRoutes:
  - "scoring-input/fq"
  - "scoring-input/determinants/M"
  - "scoring-input/special-score/AB"
authorityPolicy: "curated-internal-reference"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/provenance-pt-fq-2026-03-10.md"
---

# Nome do documento: [Codificação/Qualidade Formal] none

## Apelidos e busca

- none
- FQnone
- sem código FQ

## Definição central

`none` é usado quando a resposta não recebe código de qualidade formal.
Isso significa que a forma não está disponível como base codificável para julgar ajuste formal.

## Condições de aplicação

- A resposta não oferece base formal utilizável para atribuir `+`, `o`, `u` ou `-`.
- O código separa essas respostas das que realmente recebem um FQ específico.
- Use com cautela e apenas quando a qualidade formal realmente não deve ser codificada.

## Cuidados e diferenciação

- `none` não é o mesmo que [`FQ-`](ref://scoring-input/fq/-). `-` significa ajuste ruim; `none` significa que nenhum FQ se aplica.
- Não transforme resposta de ajuste ruim em `none` apenas porque e difícil.
- Confira os determinantes envolvidos antes de decidir que não existe FQ codificável.

## Referências cruzadas

- [[Codificação/Qualidade Formal] FQ](ref://scoring-input/fq)
- [[Codificação/Determinantes] M](ref://scoring-input/determinants/M)
- [[Codificação/Códigos Especiais] AB](ref://scoring-input/special-score/AB)

## Nota de base

- A comparação detalhada de fontes ficou separada na nota interna de provenance.
