---
canonicalRoute: "scoring-input/location"
locale: "es"
docKind: "coding-overview"
canonicalTitle: "scoring-input/location"
displayTitle: "[Codificacion/Localizacion] Location"
aliases:
  - "Location"
  - "localizacion"
  - "W, WS, D, DS, Dd, DdS, S"
relatedRoutes:
  - "scoring-input/location/W"
  - "scoring-input/location/WS"
  - "scoring-input/location/D"
  - "scoring-input/location/DS"
  - "scoring-input/location/Dd"
  - "scoring-input/location/DdS"
  - "scoring-input/location/S"
  - "result-interpretation/upper-section/W"
  - "result-interpretation/upper-section/D"
  - "result-interpretation/upper-section/Dd"
  - "result-interpretation/upper-section/S"
authorityPolicy: "exner+es-manual"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/provenance/es/scoring-input/location/index.md"
---

# Nombre del documento: [Codificacion/Localizacion] Location

## Alias y busqueda

- Location
- localizacion
- `W`, `WS`, `D`, `DS`, `Dd`, `DdS`, `S`

## Definicion central

Location registra que parte de la mancha usa el sujeto para construir la respuesta.  
La decision principal es si usa toda la mancha, un detalle usual, un detalle inusual y si integra o no espacio blanco.

## Condiciones de aplicacion

- La localizacion debe quedar fijada con precision en la hoja de localizacion.
- Si el sujeto usa toda la mancha, corresponde [`W`](ref://scoring-input/location/W).
- Si usa un detalle frecuente, corresponde [`D`](ref://scoring-input/location/D).
- Si usa un detalle poco frecuente, corresponde [`Dd`](ref://scoring-input/location/Dd).
- Si la respuesta integra espacio blanco, se agrega `S` al codigo basico: [`WS`](ref://scoring-input/location/WS), [`DS`](ref://scoring-input/location/DS), [`DdS`](ref://scoring-input/location/DdS).
- `S` no funciona solo como codigo de localizacion; siempre acompana a otro codigo basico.

## Precauciones y distinciones

- Location no describe organizacion ni ajuste formal; esos aspectos se codifican por separado en [`DQ`](ref://scoring-input/dq) y [`FQ`](ref://scoring-input/fq).
- `D` y `Dd` no se distinguen por tamano, sino por frecuencia de uso del area.
- No debe darse por supuesto el uso de espacio blanco; tiene que cumplir un papel real en la respuesta.
- En interpretacion, las frecuencias de `W`, `D`, `Dd` y `S` reaparecen en la seccion superior del sumario estructural.

## Referencias cruzadas

- [[Codificacion/Localizacion] W](ref://scoring-input/location/W)
- [[Codificacion/Localizacion] WS](ref://scoring-input/location/WS)
- [[Codificacion/Localizacion] D](ref://scoring-input/location/D)
- [[Codificacion/Localizacion] DS](ref://scoring-input/location/DS)
- [[Codificacion/Localizacion] Dd](ref://scoring-input/location/Dd)
- [[Codificacion/Localizacion] DdS](ref://scoring-input/location/DdS)
- [[Codificacion/Localizacion] S](ref://scoring-input/location/S)
- [[Interpretacion/Upper Section] W](ref://result-interpretation/upper-section/W)
- [[Interpretacion/Upper Section] D](ref://result-interpretation/upper-section/D)
- [[Interpretacion/Upper Section] Dd](ref://result-interpretation/upper-section/Dd)
- [[Interpretacion/Upper Section] S](ref://result-interpretation/upper-section/S)

## Nota de fundamento

- La fundamentacion detallada y la comparacion de fuentes se conservan en la nota interna de provenance.
- El cuerpo publico evita citar directamente los titulos de las fuentes.
