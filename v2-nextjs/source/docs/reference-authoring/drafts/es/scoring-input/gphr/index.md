---
canonicalRoute: "scoring-input/gphr"
locale: "es"
docKind: "coding-overview"
canonicalTitle: "scoring-input/gphr"
displayTitle: "[Codificacion/GHR-PHR] GHR/PHR"
aliases:
  - "GHR/PHR"
  - "human representation"
  - "representacion humana"
relatedRoutes:
  - "scoring-input/gphr/GHR"
  - "scoring-input/gphr/PHR"
  - "scoring-input/contents/H"
  - "scoring-input/contents/Hd"
  - "scoring-input/determinants/M"
  - "scoring-input/special-score/COP"
  - "scoring-input/special-score/AG"
  - "scoring-input/special-score/MOR"
  - "result-interpretation/lower-section/interpersonal/HumanCont"
  - "result-interpretation/lower-section/interpersonal/PureH"
  - "result-interpretation/lower-section/selfPerception/H_ratio"
authorityPolicy: "exner+es-manual"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/provenance/es/scoring-input/gphr/index.md"
---

# Nombre del documento: [Codificacion/GHR-PHR] GHR/PHR

## Alias y busqueda

- GHR/PHR
- human representation
- representacion humana

## Definicion central

`GHR` y `PHR` son codigos especiales para calificar la calidad de una respuesta de representacion humana.  
No se asignan por impresion clinica general, sino siguiendo una secuencia de decision basada en los otros codigos ya dados.

## Condiciones de aplicacion

- Primero hay que confirmar que la respuesta es de representacion humana.
- Eso puede ocurrir por contenido humano, por determinante `M`, o por una respuesta `FM` que lleve [`COP`](ref://scoring-input/special-score/COP) o [`AG`](ref://scoring-input/special-score/AG).
- Despues se sigue la secuencia de criterios para decidir si la respuesta queda en [`GHR`](ref://scoring-input/gphr/GHR) o en [`PHR`](ref://scoring-input/gphr/PHR).
- La decision final depende de calidad formal, codigos especiales cognitivos, `AG`, `MOR`, `An`, `Hd`, popularidad y otros senales ya codificadas.

## Precauciones y distinciones

- `GHR` y `PHR` no se ponen al mismo tiempo; la respuesta termina en uno de los dos.
- Tener contenido humano no basta por si solo para decidir el codigo.
- `GHR` no significa "persona buena" ni `PHR` "persona mala"; son calificaciones de representacion humana dentro del sistema.
- Estas decisiones alimentan despues variables de interpretacion como [`HumanCont`](ref://result-interpretation/lower-section/interpersonal/HumanCont), [`PureH`](ref://result-interpretation/lower-section/interpersonal/PureH) y [`H ratio`](ref://result-interpretation/lower-section/selfPerception/H_ratio).

## Referencias cruzadas

- [[Codificacion/GHR-PHR] GHR](ref://scoring-input/gphr/GHR)
- [[Codificacion/GHR-PHR] PHR](ref://scoring-input/gphr/PHR)
- [[Codificacion/Contenido] H](ref://scoring-input/contents/H)
- [[Codificacion/Contenido] Hd](ref://scoring-input/contents/Hd)
- [[Codificacion/Determinantes] M](ref://scoring-input/determinants/M)
- [[Codificacion/Codigo especial] COP](ref://scoring-input/special-score/COP)
- [[Codificacion/Codigo especial] AG](ref://scoring-input/special-score/AG)
- [[Codificacion/Codigo especial] MOR](ref://scoring-input/special-score/MOR)
- [[Interpretacion/Interpersonal] Human Content](ref://result-interpretation/lower-section/interpersonal/HumanCont)
- [[Interpretacion/Interpersonal] Pure H](ref://result-interpretation/lower-section/interpersonal/PureH)
- [[Interpretacion/Self Perception] H ratio](ref://result-interpretation/lower-section/selfPerception/H_ratio)

## Nota de fundamento

- La fundamentacion detallada y la comparacion de fuentes se conservan en la provenance interna.
- El cuerpo publico evita citar directamente los titulos de las fuentes.
