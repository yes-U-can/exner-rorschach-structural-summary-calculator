---
canonicalRoute: "scoring-input/fq"
locale: "es"
docKind: "coding-overview"
canonicalTitle: "scoring-input/fq"
displayTitle: "[Codificacion/Calidad formal] FQ"
aliases:
  - "Form Quality"
  - "calidad formal"
  - "FQ"
  - "+, o, u, -, none"
relatedRoutes:
  - "scoring-input/fq/+"
  - "scoring-input/fq/o"
  - "scoring-input/fq/u"
  - "scoring-input/fq/-"
  - "scoring-input/fq/none"
  - "scoring-input/dq"
authorityPolicy: "exner+es-manual"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/provenance/es/scoring-input/fq/index.md"
---

# Nombre del documento: [Codificacion/Calidad formal] FQ

## Alias y busqueda

- Form Quality
- calidad formal
- FQ
- `+`, `o`, `u`, `-`, `none`

## Definicion central

FQ registra que tan bien encaja el objeto descrito con los contornos de la mancha.  
No describe organizacion de la respuesta; describe ajuste formal entre percepcion y area usada.

## Condiciones de aplicacion

- El simbolo de FQ se coloca al final del bloque de determinantes.
- Las categorias basicas son `+`, `o`, `u`, `-` y `none`.
- La decision se apoya primero en la tabla de calidad formal y, cuando no basta, en reglas de extrapolacion y juicio de ajuste.
- La pregunta central es si el objeto se ve de manera rapida y plausible sin forzar excesivamente los contornos.
- Cuando la respuesta no usa forma de manera codificable, corresponde [`none`](ref://scoring-input/fq/none).

## Precauciones y distinciones

- FQ no debe confundirse con [`DQ`](ref://scoring-input/dq). DQ habla de organizacion; FQ habla de ajuste formal.
- `FQ+` es raro. No basta con que la respuesta sea buena; debe mostrar una articulacion formal mas elaborada que la ordinaria.
- La distincion mas delicada fuera de tabla suele ser entre [`u`](ref://scoring-input/fq/u) y [`-`](ref://scoring-input/fq/-): si se ve rapido y sin forzar demasiado, tiende a `u`; si exige contornos arbitrarios o distorsion fuerte, tiende a `-`.
- `none` no significa mala forma; significa que no corresponde asignar un codigo de calidad formal en esa respuesta.

## Referencias cruzadas

- [[Codificacion/Calidad formal] +](ref://scoring-input/fq/%2B)
- [[Codificacion/Calidad formal] o](ref://scoring-input/fq/o)
- [[Codificacion/Calidad formal] u](ref://scoring-input/fq/u)
- [[Codificacion/Calidad formal] -](ref://scoring-input/fq/-)
- [[Codificacion/Calidad formal] none](ref://scoring-input/fq/none)
- [[Codificacion/Calidad evolutiva] DQ](ref://scoring-input/dq)

## Nota de fundamento

- La fundamentacion detallada y la comparacion de fuentes se conservan en la nota interna de provenance.
- El cuerpo publico evita citar directamente los titulos de las fuentes.
