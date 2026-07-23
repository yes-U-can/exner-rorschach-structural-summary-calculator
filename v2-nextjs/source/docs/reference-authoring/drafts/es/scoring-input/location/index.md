---
canonicalRoute: "scoring-input/location"
locale: "es"
docKind: "coding-overview"
canonicalTitle: "scoring-input/location"
displayTitle: "[Codificación/Localización] Location"
aliases:
  - "Location"
  - "localización"
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
authorityPolicy: "curated-internal-reference"
status: "draft"
provenanceNote: "docs/reference-authoring/notes/provenance/es/scoring-input/location/index.md"
---

# Nombre del documento: [Codificación/Localización] Location

## Alias y búsqueda

- Location
- localización
- `W`, `WS`, `D`, `DS`, `Dd`, `DdS`, `S`

## Definición central

Location registra que parte de la mancha usa el sujeto para construir la respuesta.
La decisión principal es si usa toda la mancha, un detalle usual, un detalle inusual y si integra o no espacio blanco.

## Condiciones de aplicación

- La localización debe quedar fijada con precisión en la hoja de localización.
- Si el sujeto usa toda la mancha, corresponde [`W`](ref://scoring-input/location/W).
- Si usa un detalle frecuente, corresponde [`D`](ref://scoring-input/location/D).
- Si usa un detalle poco frecuente, corresponde [`Dd`](ref://scoring-input/location/Dd).
- Si la respuesta integra espacio blanco, se agrega `S` al código básico: [`WS`](ref://scoring-input/location/WS), [`DS`](ref://scoring-input/location/DS), [`DdS`](ref://scoring-input/location/DdS).
- `S` no funciona solo como código de localización; siempre acompaña a otro código básico.

## Precauciones y distinciones

- Location no describe organización ni ajuste formal; esos aspectos se codifican por separado en [`DQ`](ref://scoring-input/dq) y [`FQ`](ref://scoring-input/fq).
- `D` y `Dd` no se distinguen por tamaño, sino por frecuencia de uso del área.
- No debe darse por supuesto el uso de espacio blanco; tiene que cumplir un papel real en la respuesta.
- En interpretación, las frecuencias de `W`, `D`, `Dd` y `S` reaparecen en la sección superior del sumario estructural.

## Referencias cruzadas

- [[Codificación/Localización] W](ref://scoring-input/location/W)
- [[Codificación/Localización] WS](ref://scoring-input/location/WS)
- [[Codificación/Localización] D](ref://scoring-input/location/D)
- [[Codificación/Localización] DS](ref://scoring-input/location/DS)
- [[Codificación/Localización] Dd](ref://scoring-input/location/Dd)
- [[Codificación/Localización] DdS](ref://scoring-input/location/DdS)
- [[Codificación/Localización] S](ref://scoring-input/location/S)
- [[Interpretación/Upper Section] W](ref://result-interpretation/upper-section/W)
- [[Interpretación/Upper Section] D](ref://result-interpretation/upper-section/D)
- [[Interpretación/Upper Section] Dd](ref://result-interpretation/upper-section/Dd)
- [[Interpretación/Upper Section] S](ref://result-interpretation/upper-section/S)

## Nota de fundamento

- La fundamentación detallada y la comparación de fuentes se conservan en la nota interna de provenance.
- El cuerpo público evita citar directamente los títulos de las fuentes.
