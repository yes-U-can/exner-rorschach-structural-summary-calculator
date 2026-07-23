# [2026-07-23] v2.2.7 Corrección de errores

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## Cambios principales

### Resumen

Se corrigió un problema por el que tres tipos de entradas incompletas de la tabla de codificación podían pasar directamente al cálculo.

- En **[Location]** era posible seleccionar una respuesta de espacio en blanco como `S` aislada. Ahora las opciones de localización ofrecen únicamente `W`, `WS`, `D`, `DS`, `Dd` y `DdS`.
- En **[Determinants]** era posible introducir dos o más códigos de la misma familia de movimiento en una sola respuesta (por ejemplo, `Ma` y `Mp`). Ahora, al elegir un código de una familia, los demás códigos de la misma familia dejan de estar disponibles. La introducción del mismo determinante repetido en dos casillas también se bloquea (por ejemplo, `FC` dos veces).
- Era posible calcular con **[FQ]** en blanco. Ahora es necesario seleccionar uno de `+`, `o`, `u`, `-` o `none` para poder calcular.

En los registros en los que todas las respuestas son de forma pura (`F`), Lambda se informa como el número de respuestas de F pura en lugar del símbolo de infinito (`∞`).

Los protocolos existentes en los que la localización, los determinantes de movimiento y la calidad formal se introdujeron según las reglas no están afectados por este problema y no necesitan volver a calcularse. Si los datos antiguos guardados automáticamente contienen una `S` aislada, códigos duplicados de la misma familia de movimiento o una calidad formal en blanco, la aplicación conserva la entrada original, detiene el cálculo e indica en cinco idiomas las filas que requieren revisión.

### ¿Por qué era importante este problema?

**`S` aislada.** En el Sistema Comprehensivo de Exner, el uso del espacio en blanco no es una localización independiente, sino una notación que se añade a la localización básica, y la respuesta se registra siempre como `WS`, `DS` o `DdS`. En versiones anteriores, si la localización se introducía únicamente como `S`, se contabilizaba en la frecuencia de espacio en blanco pero no en ninguna de las localizaciones básicas `W`, `D` o `Dd`, por lo que los valores que utilizan la localización básica, como `W:D:Dd` y `WDA%`, podían calcularse por debajo de sus valores reales.

**Duplicados de la misma familia de movimiento.** El determinante de movimiento de una respuesta individual se registra, en cada familia, con una de tres formas: activa `a`, pasiva `p` o activa-pasiva `a-p`. Si dos objetos distintos muestran movimientos activo y pasivo respectivamente, no se introducen `Ma` y `Mp` por separado, sino que se registra un único `Ma-p`. En versiones anteriores, si `Ma` y `Mp` se introducían juntos en campos separados, la frecuencia de movimiento humano se contaba dos veces, por lo que el valor izquierdo de EB, EA, `a:p`, `Ma:Mp` y otros valores podían calcularse por encima de sus valores reales. Que un mismo objeto muestre ambos tipos de movimiento no convierte el código automáticamente en `a-p`; qué movimiento determina la codificación se confirma con el registro de respuestas y la encuesta (Inquiry). Cuando el mismo determinante se introducía dos veces, el valor correspondiente también podía contarse dos veces, por lo que ahora se exige registrar cada determinante solo una vez por respuesta.

**Calidad formal en blanco.** `none` es una categoría oficial de calidad formal que se utiliza para las respuestas que no se puntúan sobre la base de la forma, mientras que un campo en blanco es una entrada cuya codificación aún no se ha completado. En versiones anteriores, si la calidad formal se dejaba en blanco, esa respuesta no se contabilizaba en ningún total de calidad formal pero sí en el número total de respuestas, por lo que valores como `XA%`, `X+%` y `WDA%` podían calcularse por debajo de sus valores reales. Si la forma no es la base de la puntuación de una respuesta, ahora debe seleccionarse `none` de forma explícita.

**Lambda cuando todas las respuestas son F pura.** Lambda es `F pura ÷ (respuestas totales − F pura)`, por lo que el denominador es 0 cuando todas las respuestas son F pura. La pantalla informa el número de respuestas de F pura en lugar del símbolo de infinito. Por ejemplo, si las 17 respuestas son F pura, se muestra `17.00`. Este límite prácticamente no aparece en la administración estándar, y esta notación de software se adoptó para no utilizar el símbolo de infinito como valor de informe clínico.

### Correcciones relacionadas

- Los documentos de referencia en cinco idiomas sobre la localización `S`, los determinantes de movimiento y la calidad formal indican ahora estas reglas de entrada con el mismo contenido.
- Se introdujo una lista de reglas que comprueba automáticamente que los documentos de los cinco idiomas enuncien las mismas reglas clínicas. Ahora, si se corrige el documento de un solo idioma y se omiten los demás, la comprobación falla en la etapa de generación de documentos.
- Se reforzaron las reglas de respuesta para que el Asistente de Codificación no presente la `S` aislada, los duplicados de la misma familia de movimiento ni la calidad formal en blanco como códigos completos.
- Tras modificar los documentos de referencia, se reconstruyeron los datos de búsqueda y todos los embeddings de OpenAI de los cinco idiomas.
- Se corrigieron erratas y notaciones terminológicas en los documentos en español y portugués, así como títulos en inglés que permanecían en cuatro lugares de los documentos en japonés.
- Se eliminó un indicador de estado que no se utilizaba realmente en los borradores de los documentos de referencia y se añadió una comprobación del rango permitido de los valores de estado de los documentos.

## Pruebas y verificación

Las reglas de cálculo se comprobaron con materiales públicos.

- Se comprobó que, en la secuencia de codificación del informe de ejemplo oficial de RIAP v5, el espacio en blanco aparece siempre combinado con una localización básica, como `WS` y `DdS`.
- En el mismo ejemplo se comprobó que `none` se contabiliza como categoría oficial en la tabla de calidad formal y que se indica expresamente que S-CON se aplica a personas mayores de 14 años.
- Las reglas activo-pasivo de los determinantes de movimiento y las condiciones de aplicación de `a-p` se comprobaron con bibliografía clínica pública que reproduce el contenido de la obra original de Exner.
- Se comprobó que los valores del Sumario Estructural de un caso público de 20 respuestas se calculan de forma idéntica antes y después de este parche.

El bloqueo de entradas y los avisos en cinco idiomas también se comprobaron en la pantalla real.

- La `S` aislada no aparece entre las opciones de localización.
- Al elegir un código de una familia de movimiento, los demás códigos de la misma familia se muestran como no seleccionables.
- Para cualquier determinante, un código ya seleccionado se muestra como no seleccionable en las demás casillas.
- Si la calidad formal está en blanco, el cálculo se detiene y se indican las filas que requieren revisión. Los textos de aviso de los cinco idiomas se comprobaron uno por uno en la pantalla real.
- Las `S` aisladas, los códigos de movimiento duplicados y la calidad formal en blanco que permanecen en datos antiguos guardados automáticamente se señalan de la misma manera, sin modificar el original.

También se comprobaron los datos de búsqueda en cinco idiomas y los asistentes de IA.

- Las 380 preguntas de búsqueda de documentos de referencia recuperaron el documento correspondiente.
- Se reconstruyeron los 5,604 embeddings de OpenAI a partir del texto nuevo; las discrepancias en el hash del contenido y los embeddings obsoletos fueron 0.
- En la búsqueda híbrida con embeddings reales, la tasa de acierto del primer documento fue del 100% tanto para preguntas amplias como para preguntas con nombre explícito.
- Se realizaron llamadas reales en cinco idiomas con preguntas representativas sobre la `S` aislada, los códigos de movimiento duplicados y la calidad formal en blanco, y se comprobó que ninguna de las 15 llamadas produjo respuestas contrarias a las reglas.
- En el conjunto automatizado completo se superaron 476 comprobaciones de 83 archivos de prueba y 7 se omitieron porque no se cumplían sus condiciones de ejecución. También se superaron la compilación de producción, el análisis estático del código, la auditoría de textos en cinco idiomas y la detección de secretos.

La notación de Lambda como número de respuestas de F pura es una forma de informe de software en la que coinciden varios materiales públicos. El alcance de la evidencia comprobada por vías públicas y las limitaciones pendientes se registraron tal cual en la documentación de verificación.

OpenAI Codex y Claude Fable 5 se utilizaron para la implementación y las pruebas repetidas, y Claude Fable 5 para revisar la documentación y los fundamentos de cálculo antes de la publicación. La coincidencia entre herramientas no se consideró una prueba; el criterio fueron las fuentes profesionales públicas y los resultados de cálculo reproducibles.

## UI/UX, privacidad y alcance del cálculo

- No se añadieron pantallas ni campos de entrada nuevos.
- Se eliminó la `S` aislada de las opciones de [Location], y la selección duplicada dentro de la misma familia de movimiento se indica mediante opciones desactivadas.
- Los resultados de cálculo de los protocolos existentes introducidos según las reglas no cambian.
- No se recopila nueva información personal.
- Se mantiene el principio existente de no guardar los datos de codificación ni las claves API en la base de datos del servidor.

## Alcance público y límite de seguridad

El código público incluye las comprobaciones del límite de entrada, las pruebas de regresión de los cálculos, los documentos de referencia en cinco idiomas con la lista de comprobación de equivalencia de reglas y las instantáneas de los datos de búsqueda.

No se publican variables de entorno de producción, claves API, textos originales de preguntas y respuestas reales de IA, registros privados de revisión ni rutas locales.

## Apéndice técnico

<details>
<summary><strong>Comandos para que los desarrolladores repitan las comprobaciones</strong></summary>

```bash
npm test
npm run lint
npm run build
npm run security:check
npm run docs:evaluate-rag:all
npm run docs:evaluate-hybrid:openai -- --enforce
npm run ai:evaluate-contracts
```

</details>
