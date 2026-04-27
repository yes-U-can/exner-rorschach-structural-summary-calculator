---
canonicalRoute: "scoring-input/location/Dd"
locale: "es"
docKind: "coding-entry"
canonicalTitle: "scoring-input/location/Dd"
displayTitle: "[Codificacion/Localizacion] Dd"
aliases:
  - "Dd"
  - "detalle inusual"
  - "detalle poco frecuente"
relatedRoutes:
  - "scoring-input/location/D"
  - "scoring-input/location/DdS"
  - "scoring-input/location/DS"
  - "result-interpretation/upper-section/Dd"
authorityPolicy: "exner+es-manual"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/provenance/es/scoring-input/location/dd/index.md"
---

# Nombre del documento: [Codificacion/Localizacion] Dd

## Alias y busqueda

- Dd
- detalle inusual
- detalle poco frecuente

## Definicion central

`Dd` se usa cuando la respuesta recae en un area de detalle utilizada con poca frecuencia.  
Es el codigo para detalles no habituales, incluso cuando el area sea relativamente grande.

## Condiciones de aplicacion

- La respuesta no es `W` ni `D`.
- El area utilizada no corresponde a un detalle usual de la tabla.
- Si una combinacion de areas D forma una zona no habitual para un solo objeto, esa combinacion puede codificarse `Dd`.

## Precauciones y distinciones

- `Dd` no significa pequeno; significa poco frecuente.
- Si el sujeto usa varias areas D para objetos separados, puede mantenerse `D` y registrarse la sintesis en DQ.
- Si el detalle inusual integra espacio blanco, corresponde [`DdS`](ref://scoring-input/location/DdS).

## Referencias cruzadas

- [[Codificacion/Localizacion] D](ref://scoring-input/location/D)
- [[Codificacion/Localizacion] DdS](ref://scoring-input/location/DdS)
- [[Codificacion/Localizacion] DS](ref://scoring-input/location/DS)
- [[Interpretacion/Upper Section] Dd](ref://result-interpretation/upper-section/Dd)

## Nota de fundamento

- La provenance interna conserva los criterios de frecuencia y combinacion no habitual.
