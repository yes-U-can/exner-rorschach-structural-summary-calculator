---
canonicalRoute: "scoring-input/contents/Xy"
locale: "es"
docKind: "coding-entry"
canonicalTitle: "scoring-input/contents/Xy"
displayTitle: "[Codificación/Contenido] Xy"
aliases:
  - "Xy"
  - "x-ray"
  - "rayos x"
relatedRoutes:
  - "scoring-input/contents"
  - "scoring-input/contents/An"
  - "result-interpretation/lower-section/selfPerception/An_Xy"
authorityPolicy: "curated-internal-reference"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/provenance/es/scoring-input/contents/xy/index.md"
---

# Nombre del documento: [Codificación/Contenido] Xy

## Alias y búsqueda

- Xy
- x-ray
- rayos x

## Definición central

`Xy` se usa cuando el contenido se percibe como radiografía o imagen de rayos X.
Si la respuesta se codifica como `Xy`, el foco está en la imagen radiográfica como forma de ver el objeto.

## Condiciones de aplicación

- Se aplica a radiografía, placa de rayos X, imagen interna vista explícitamente como rayos X o estudio radiográfico.
- El sujeto debe indicar que lo ve como radiografía o imagen de rayos X.
- Cuando se codifica `Xy`, no se agrega [`An`](ref://scoring-input/contents/An) como contenido secundario.
- Esta codificación se conecta después con la ruta interpretativa [`An + Xy`](ref://result-interpretation/lower-section/selfPerception/An_Xy).

## Precauciones y distinciones

- `Xy` no es lo mismo que [`An`](ref://scoring-input/contents/An); `An` apunta a anatomía, `Xy` al formato radiográfico.
- Si el sujeto solo nombra hueso, órgano o interior corporal sin decir que es radiografía, primero se considera `An`.
- La regla importante es que `Xy` excluye `An` como acompañante en la misma respuesta.

## Referencias cruzadas

- [[Codificación/Contenido] Contents](ref://scoring-input/contents)
- [[Codificación/Contenido] An](ref://scoring-input/contents/An)
- [[Interpretación/Self Perception] An + Xy](ref://result-interpretation/lower-section/selfPerception/An_Xy)

## Nota de fundamento

- La fundamentación detallada y la comparación de fuentes se conservan en la provenance interna.
- El cuerpo público evita citar directamente los títulos de las fuentes.
