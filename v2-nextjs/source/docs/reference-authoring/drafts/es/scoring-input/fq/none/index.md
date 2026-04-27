---
canonicalRoute: "scoring-input/fq/none"
locale: "es"
docKind: "coding-entry"
canonicalTitle: "scoring-input/fq/none"
displayTitle: "[Codificacion/Calidad formal] none"
aliases:
  - "FQnone"
  - "sin codigo de calidad formal"
  - "sin FQ"
relatedRoutes:
  - "scoring-input/fq"
  - "scoring-input/determinants/M"
  - "scoring-input/special-score/ab"
authorityPolicy: "exner+es-manual"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/provenance/es/scoring-input/fq/none/index.md"
---

# Nombre del documento: [Codificacion/Calidad formal] none

## Alias y busqueda

- FQnone
- sin codigo de calidad formal
- sin FQ

## Definicion central

`none` se usa cuando la respuesta no recibe codigo de calidad formal.  
Esto ocurre cuando la forma no queda disponible como base codificable para valorar el ajuste formal.

## Condiciones de aplicacion

- La respuesta no aporta un uso de forma que permita asignar `+`, `o`, `u` o `-`.
- El registro se usa para distinguir estas respuestas de las que si reciben una FQ concreta.
- Debe aplicarse con cautela y solo cuando realmente no corresponde una codificacion formal.

## Precauciones y distinciones

- `none` no es lo mismo que [`FQ-`](ref://scoring-input/fq/-). `-` implica mal ajuste; `none` implica ausencia de codigo formal.
- No convierta una respuesta de mal ajuste en `none` solo porque sea dificil.
- Conviene revisar los determinantes implicados antes de decidir que no hay FQ codificable.

## Referencias cruzadas

- [[Codificacion/Calidad formal] FQ](ref://scoring-input/fq)
- [[Codificacion/Determinantes] M](ref://scoring-input/determinants/M)
- [[Codificacion/Codigos especiales] AB](ref://scoring-input/special-score/AB)

## Nota de fundamento

- La provenance interna conserva la justificacion operativa y los limites de uso.
