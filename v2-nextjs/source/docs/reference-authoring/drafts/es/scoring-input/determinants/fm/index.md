---
canonicalRoute: "scoring-input/determinants/FM"
locale: "es"
docKind: "coding-entry"
canonicalTitle: "scoring-input/determinants/FM"
displayTitle: "[Codificación/Determinantes] FM"
aliases:
  - "FM"
  - "movimiento animal"
relatedRoutes:
  - "scoring-input/determinants"
  - "scoring-input/determinants/M"
  - "scoring-input/determinants/m"
  - "scoring-input/special-score/COP"
  - "scoring-input/special-score/AG"
  - "result-interpretation/lower-section/core/FM"
authorityPolicy: "curated-internal-reference"
status: "draft"
provenanceNote: "docs/reference-authoring/notes/provenance/es/scoring-input/determinants/fm/index.md"
---

# Nombre del documento: [Codificación/Determinantes] FM

## Alias y búsqueda

- FM
- movimiento animal

## Definición central

`FM` se usa cuando la respuesta implica actividad animal adecuada a la especie identificada.
La acción puede ser activa o pasiva, pero debe seguir siendo movimiento propio de animal.

## Regla del código de entrada

`FM` es la etiqueta de familia utilizada en los totales del Sumario Estructural. En una respuesta individual se registra `FMa`, `FMp` o `FMa-p`, según la cualidad activa o pasiva del movimiento. `FM` sin sufijo no es un código completo para una respuesta individual.
En una respuesta se registra un solo código de movimiento animal. Si distintos animales muestran movimiento activo y pasivo, se registra `FMa-p` una vez, en lugar de introducir `FMa` y `FMp` en casillas separadas. Un solo objeto que muestre ambos movimientos no recibe `FMa-p` automáticamente; debe revisarse qué movimiento determina la codificación.

## Condiciones de aplicación

- La respuesta incluye un animal en movimiento o actividad.
- La actividad descrita debe ser compatible con la especie.
- Si el animal es descrito en conducta impropia de su especie, se reevalúa como [`M`](ref://scoring-input/determinants/M).
- La presencia de interacción positiva o agresiva puede añadir [`COP`](ref://scoring-input/special-score/COP) o [`AG`](ref://scoring-input/special-score/AG) sin cambiar el determinante base.

## Precauciones y distinciones

- `FM` no se usa para acciones claramente humanas o antropomórficas; en ese caso corresponde `M`.
- `FM` tampoco se usa para objetos inanimados que se mueven; eso corresponde a [`m`](ref://scoring-input/determinants/m).
- No alcanza con nombrar un animal; debe haber acción percibida.
- El uso interpretativo de `FM` se revisa después en la variable [`FM`](ref://result-interpretation/lower-section/core/FM).

## Referencias cruzadas

- [[Codificación/Determinantes] Determinants](ref://scoring-input/determinants)
- [[Codificación/Determinantes] M](ref://scoring-input/determinants/M)
- [[Codificación/Determinantes] m](ref://scoring-input/determinants/m)
- [[Codificación/Códigos especiales] COP](ref://scoring-input/special-score/COP)
- [[Codificación/Códigos especiales] AG](ref://scoring-input/special-score/AG)
- [[Interpretación/Core] FM](ref://result-interpretation/lower-section/core/FM)

## Nota de fundamento

- La justificación detallada y la comparación de fuentes se conservan en la provenance interna.
- El cuerpo público evita citar directamente los títulos de las fuentes.
