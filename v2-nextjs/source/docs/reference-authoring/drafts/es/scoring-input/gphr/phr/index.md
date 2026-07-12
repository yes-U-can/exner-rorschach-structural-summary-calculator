---
canonicalRoute: "scoring-input/gphr/PHR"
locale: "es"
docKind: "coding-entry"
canonicalTitle: "scoring-input/gphr/PHR"
displayTitle: "[Codificación/GHR-PHR] PHR"
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
authorityPolicy: "curated-internal-reference"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/provenance/es/scoring-input/gphr/phr/index.md"
---

# Nombre del documento: [Codificación/GHR-PHR] PHR

## Alias y búsqueda

- PHR
- poor human representation
- poor human representational response

## Definición central

`PHR` marca una respuesta de representación humana relativamente más pobre, distorsionada o frágil dentro de la secuencia del sistema.
Igual que `GHR`, no se decide por impresión libre, sino siguiendo criterios sucesivos.

## Condiciones de aplicación

- La respuesta debe ser primero una respuesta de representación humana.
- `PHR` se asigna pronto si hay `FQ-`, `FQ none`, `CONTAM` o cualquier código cognitivo de nivel 2.
- También empujan a `PHR` códigos como `FABCOM`, [`MOR`](ref://scoring-input/special-score/MOR), contenido [`An`](ref://scoring-input/contents/An), [`AG`](ref://scoring-input/special-score/AG), `INCOM`, `DR`, o contenido [`Hd`](ref://scoring-input/contents/Hd) en la parte correspondiente de la secuencia.
- Si un criterio de `PHR` aparece antes que uno de `GHR`, la decisión se cierra en `PHR`.

## Precauciones y distinciones

- `PHR` no significa simplemente "contenido negativo"; es una clasificación de la respuesta de representación humana.
- No toda respuesta con `Hd` se decide al instante; la secuencia completa sigue importando, aunque `Hd` es una señal relevante.
- `PHR` y `GHR` no se duplican; la respuesta termina en uno solo.
- La interpretación posterior debe apoyarse en el conjunto del protocolo, no en `PHR` aislado.

## Referencias cruzadas

- [[Codificación/GHR-PHR] GHR/PHR](ref://scoring-input/gphr)
- [[Codificación/GHR-PHR] GHR](ref://scoring-input/gphr/GHR)
- [[Codificación/Contenido] Hd](ref://scoring-input/contents/Hd)
- [[Codificación/Contenido] An](ref://scoring-input/contents/An)
- [[Codificación/Código especial] AG](ref://scoring-input/special-score/AG)
- [[Codificación/Código especial] MOR](ref://scoring-input/special-score/MOR)
- [[Interpretación/Interpersonal] Human Content](ref://result-interpretation/lower-section/interpersonal/HumanCont)
- [[Interpretación/Self Perception] H ratio](ref://result-interpretation/lower-section/selfPerception/H_ratio)

## Nota de fundamento

- La justificación detallada y la comparación de fuentes se conservan en la provenance interna.
- El cuerpo público evita citar directamente los títulos de las fuentes.
