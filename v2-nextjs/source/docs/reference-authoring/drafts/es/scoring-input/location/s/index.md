---
canonicalRoute: "scoring-input/location/S"
locale: "es"
docKind: "coding-entry"
canonicalTitle: "scoring-input/location/S"
displayTitle: "[Codificacion/Localizacion] S"
aliases:
  - "S"
  - "espacio blanco"
  - "uso de blanco"
relatedRoutes:
  - "scoring-input/location/WS"
  - "scoring-input/location/DS"
  - "scoring-input/location/DdS"
  - "result-interpretation/upper-section/S"
  - "scoring-input/z/ZS"
authorityPolicy: "exner+es-manual"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/provenance/es/scoring-input/location/s/index.md"
---

# Nombre del documento: [Codificacion/Localizacion] S

## Alias y busqueda

- S
- espacio blanco
- uso de blanco

## Definicion central

`S` marca que la respuesta usa espacio blanco como parte real del percepto.  
No se codifica solo; siempre acompana a un codigo basico de localizacion.

## Condiciones de aplicacion

- El blanco participa de forma especifica en lo que el sujeto ve.
- El codigo final siempre sera `WS`, `DS` o `DdS`.
- El uso del blanco debe poder justificarse a partir de la formulacion del sujeto o de la encuesta.

## Precauciones y distinciones

- No codifique `S` cuando el sujeto solo senala un area que contiene blanco, pero sin darle un papel propio.
- `S` es un modificador de localizacion, no una localizacion autonoma.
- La presencia de `S` puede relacionarse despues con [`ZS`](ref://scoring-input/z/ZS), pero no son el mismo codigo.

## Referencias cruzadas

- [[Codificacion/Localizacion] WS](ref://scoring-input/location/WS)
- [[Codificacion/Localizacion] DS](ref://scoring-input/location/DS)
- [[Codificacion/Localizacion] DdS](ref://scoring-input/location/DdS)
- [[Interpretacion/Upper Section] S](ref://result-interpretation/upper-section/S)
- [[Codificacion/Z] ZS](ref://scoring-input/z/ZS)

## Nota de fundamento

- La provenance interna conserva los criterios para distinguir integracion real del blanco de mera inclusion visual.
