---
canonicalRoute: "scoring-input/contents/Xy"
locale: "es"
docKind: "coding-entry"
canonicalTitle: "scoring-input/contents/Xy"
displayTitle: "[Codificacion/Contenido] Xy"
aliases:
  - "Xy"
  - "x-ray"
  - "rayos x"
relatedRoutes:
  - "scoring-input/contents"
  - "scoring-input/contents/An"
  - "result-interpretation/lower-section/selfPerception/An_Xy"
authorityPolicy: "exner+es-manual"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/provenance/es/scoring-input/contents/xy/index.md"
---

# Nombre del documento: [Codificacion/Contenido] Xy

## Alias y busqueda

- Xy
- x-ray
- rayos x

## Definicion central

`Xy` se usa cuando el contenido se percibe como radiografia o imagen de rayos X.
Si la respuesta se codifica como `Xy`, el foco esta en la imagen radiografica como forma de ver el objeto.

## Condiciones de aplicacion

- Se aplica a radiografia, placa de rayos X, imagen interna vista explicitamente como rayos X o estudio radiografico.
- El sujeto debe indicar que lo ve como radiografia o imagen de rayos X.
- Cuando se codifica `Xy`, no se agrega [`An`](ref://scoring-input/contents/An) como contenido secundario.
- Esta codificacion se conecta despues con la ruta interpretativa [`An + Xy`](ref://result-interpretation/lower-section/selfPerception/An_Xy).

## Precauciones y distinciones

- `Xy` no es lo mismo que [`An`](ref://scoring-input/contents/An); `An` apunta a anatomia, `Xy` al formato radiografico.
- Si el sujeto solo nombra hueso, organo o interior corporal sin decir que es radiografia, primero se considera `An`.
- La regla importante es que `Xy` excluye `An` como acompanante en la misma respuesta.

## Referencias cruzadas

- [[Codificacion/Contenido] Contents](ref://scoring-input/contents)
- [[Codificacion/Contenido] An](ref://scoring-input/contents/An)
- [[Interpretacion/Self Perception] An + Xy](ref://result-interpretation/lower-section/selfPerception/An_Xy)

## Nota de fundamento

- La fundamentacion detallada y la comparacion de fuentes se conservan en la provenance interna.
- El cuerpo publico evita citar directamente los titulos de las fuentes.
