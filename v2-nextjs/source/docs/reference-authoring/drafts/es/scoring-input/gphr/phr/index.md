---
canonicalRoute: "scoring-input/gphr/PHR"
locale: "es"
docKind: "coding-entry"
canonicalTitle: "scoring-input/gphr/PHR"
displayTitle: "[Codificacion/GHR-PHR] PHR"
aliases:
  - "PHR"
  - "poor human representation"
  - "poor human representational response"
relatedRoutes:
  - "scoring-input/gphr"
  - "scoring-input/gphr/GHR"
  - "scoring-input/contents/Hd"
  - "scoring-input/contents/An"
  - "scoring-input/special-score/AG"
  - "scoring-input/special-score/MOR"
  - "result-interpretation/lower-section/interpersonal/HumanCont"
  - "result-interpretation/lower-section/selfPerception/H_ratio"
authorityPolicy: "exner+es-manual"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/provenance/es/scoring-input/gphr/phr/index.md"
---

# Nombre del documento: [Codificacion/GHR-PHR] PHR

## Alias y busqueda

- PHR
- poor human representation
- poor human representational response

## Definicion central

`PHR` marca una respuesta de representacion humana relativamente mas pobre, distorsionada o fragil dentro de la secuencia del sistema.  
Igual que `GHR`, no se decide por impresion libre, sino siguiendo criterios sucesivos.

## Condiciones de aplicacion

- La respuesta debe ser primero una respuesta de representacion humana.
- `PHR` se asigna pronto si hay `FQ-`, `FQ none`, `CONTAM` o cualquier codigo cognitivo de nivel 2.
- Tambien empujan a `PHR` codigos como `FABCOM`, [`MOR`](ref://scoring-input/special-score/MOR), contenido [`An`](ref://scoring-input/contents/An), [`AG`](ref://scoring-input/special-score/AG), `INCOM`, `DR`, o contenido [`Hd`](ref://scoring-input/contents/Hd) en la parte correspondiente de la secuencia.
- Si un criterio de `PHR` aparece antes que uno de `GHR`, la decision se cierra en `PHR`.

## Precauciones y distinciones

- `PHR` no significa simplemente "contenido negativo"; es una clasificacion de la respuesta de representacion humana.
- No toda respuesta con `Hd` se decide al instante; la secuencia completa sigue importando, aunque `Hd` es una senal relevante.
- `PHR` y `GHR` no se duplican; la respuesta termina en uno solo.
- La interpretacion posterior debe apoyarse en el conjunto del protocolo, no en `PHR` aislado.

## Referencias cruzadas

- [[Codificacion/GHR-PHR] GHR/PHR](ref://scoring-input/gphr)
- [[Codificacion/GHR-PHR] GHR](ref://scoring-input/gphr/GHR)
- [[Codificacion/Contenido] Hd](ref://scoring-input/contents/Hd)
- [[Codificacion/Contenido] An](ref://scoring-input/contents/An)
- [[Codificacion/Codigo especial] AG](ref://scoring-input/special-score/AG)
- [[Codificacion/Codigo especial] MOR](ref://scoring-input/special-score/MOR)
- [[Interpretacion/Interpersonal] Human Content](ref://result-interpretation/lower-section/interpersonal/HumanCont)
- [[Interpretacion/Self Perception] H ratio](ref://result-interpretation/lower-section/selfPerception/H_ratio)

## Nota de fundamento

- La justificacion detallada y la comparacion de fuentes se conservan en la provenance interna.
- El cuerpo publico evita citar directamente los titulos de las fuentes.
