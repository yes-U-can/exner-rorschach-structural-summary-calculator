---
canonicalRoute: "scoring-input/z"
locale: "es"
docKind: "coding-overview"
canonicalTitle: "scoring-input/z"
displayTitle: "[Codificacion/Z] Z"
aliases:
  - "Z"
  - "actividad organizativa"
  - "organizational activity"
relatedRoutes:
  - "scoring-input/z/ZW"
  - "scoring-input/z/ZA"
  - "scoring-input/z/ZD"
  - "scoring-input/z/ZS"
  - "scoring-input/location/W"
  - "scoring-input/location/D"
  - "scoring-input/location/Dd"
  - "scoring-input/location/S"
  - "scoring-input/dq/+"
  - "scoring-input/dq/v/+"
  - "scoring-input/dq/o"
  - "result-interpretation/upper-section/Zf"
  - "result-interpretation/upper-section/ZSum"
  - "result-interpretation/upper-section/ZEst"
  - "result-interpretation/upper-section/Zd"
  - "result-interpretation/lower-section/processing/Zd_proc"
authorityPolicy: "exner+es-manual"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/provenance/es/scoring-input/z/index.md"
---

# Nombre del documento: [Codificacion/Z] Z

## Alias y busqueda

- Z
- actividad organizativa
- organizational activity

## Definicion central

`Z` registra actividad organizativa en la respuesta.  
Solo se asigna cuando la respuesta usa forma y cumple uno de cuatro patrones: `ZW`, `ZA`, `ZD` o `ZS`.

## Condiciones de aplicacion

- La respuesta debe incluir uso de forma.
- `Z` se considera cuando la respuesta muestra organizacion entre partes del blot o entre el blot y el espacio blanco.
- Si se cumplen varios criterios de Z en una misma respuesta, se conserva el tipo que da el valor mas alto para esa lamina.
- `Wv` no recibe `Z`.
- Respuestas puras sin apoyo formal suficiente no reciben `Z`.

## Precauciones y distinciones

- `Z` no es un codigo de localizacion. Usa informacion de [`W`](ref://scoring-input/location/W), [`D`](ref://scoring-input/location/D), [`Dd`](ref://scoring-input/location/Dd) y [`S`](ref://scoring-input/location/S), pero registra otra cosa.
- No basta con enumerar partes del blot. Tiene que haber integracion o relacion significativa.
- En respuestas globales, `ZW` requiere tambien una DQ compatible.
- `ZS` exige integracion real del espacio blanco, no solo presencia visual de blanco dentro del area.

## Referencias cruzadas

- [[Codificacion/Z] ZW](ref://scoring-input/z/ZW)
- [[Codificacion/Z] ZA](ref://scoring-input/z/ZA)
- [[Codificacion/Z] ZD](ref://scoring-input/z/ZD)
- [[Codificacion/Z] ZS](ref://scoring-input/z/ZS)
- [[Codificacion/Localizacion] W](ref://scoring-input/location/W)
- [[Codificacion/Localizacion] D](ref://scoring-input/location/D)
- [[Codificacion/Localizacion] Dd](ref://scoring-input/location/Dd)
- [[Codificacion/Localizacion] S](ref://scoring-input/location/S)
- [[Codificacion/Calidad evolutiva] +](ref://scoring-input/dq/%2B)
- [[Codificacion/Calidad evolutiva] v/+](ref://scoring-input/dq/v/%2B)
- [[Codificacion/Calidad evolutiva] o](ref://scoring-input/dq/o)
- [[Interpretacion/Upper Section] Zf](ref://result-interpretation/upper-section/Zf)
- [[Interpretacion/Upper Section] ZSum](ref://result-interpretation/upper-section/ZSum)
- [[Interpretacion/Upper Section] ZEst](ref://result-interpretation/upper-section/ZEst)
- [[Interpretacion/Upper Section] Zd](ref://result-interpretation/upper-section/Zd)
- [[Interpretacion/Processing] Zd](ref://result-interpretation/lower-section/processing/Zd_proc)

## Nota de fundamento

- La fundamentacion detallada y la comparacion de fuentes se conservan en la nota interna de provenance.
- El cuerpo publico evita citar directamente los titulos de las fuentes.
