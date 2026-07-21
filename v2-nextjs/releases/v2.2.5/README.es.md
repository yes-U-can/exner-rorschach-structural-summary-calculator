# [2026-07-19] v2.2.5 Corrección de errores

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## Cambios principales

### Resumen

Esta versión corrige un problema del menú desplegable **[Determinants]** de la tabla de codificación, que permitía seleccionar `M`, `FM` y `m` sin superíndice activo o pasivo.

Estos tres símbolos son necesarios en el Sumario Estructural como **campos de total** para el movimiento humano, animal e inanimado. Sin embargo, el determinante de movimiento de una respuesta individual debe llevar uno de tres superíndices: activo `a`, pasivo `p` o activo-pasivo `a-p`.

Por esta razón, v2.2.5 elimina `M`, `FM` y `m` **solo de las opciones de entrada**. Los totales `M`, `FM` y `m` del Sumario Estructural y los cálculos de EB, MQual, W:M y otras variables no cambian.

Los protocolos existentes que utilizan correctamente `Ma`, `Mp`, `Ma-p`, `FMa`, `FMp`, `FMa-p`, `ma`, `mp` y `ma-p` no están afectados y no necesitan volver a calcularse.

Si en una versión anterior se seleccionó directamente `M`, `FM` o `m` para una respuesta individual, debe revisarse esa respuesta. Cuando la aplicación encuentra uno de estos valores en datos antiguos guardados automáticamente, conserva la entrada original, detiene el cálculo e identifica la fila y el código que requieren revisión. El superíndice activo o pasivo no se asigna de forma automática porque debe determinarse a partir del registro de respuestas y de la encuesta (Inquiry).

### ¿Por qué era importante este problema?

Aunque se introdujera un valor de movimiento sin superíndice activo o pasivo, la frecuencia total de movimiento, EB, MQual y otros campos podían seguir aumentando con apariencia de normalidad. Sin embargo, faltaba la clasificación como activo o pasivo, por lo que `a:p`, `Ma:Mp` y las frecuencias de movimientos activos y pasivos del área Interpersonal podían calcularse por debajo de sus valores reales.

En particular, la cuarta condición de CDI comprueba si `movimiento pasivo > movimiento activo + 1`. Cerca del punto de corte, omitir el superíndice activo o pasivo de un solo movimiento podía cambiar si CDI resultaba positivo.

Como ejemplo concreto, se utilizó un registro hipotético en el que las respuestas «Una persona está descansando» y «Otra persona está acostada durmiendo» se codificaron como `Mp H`. Si ambos movimientos son `Mp`, el movimiento pasivo es 2 y el activo es 0; por tanto, se cumple la cuarta condición y la pantalla muestra CDI como `4, Positive`.

Si en una versión anterior el segundo `Mp` se hubiera introducido como `M` sin superíndice activo o pasivo, el total de movimiento humano seguiría apareciendo como 2, pero la frecuencia pasiva se contaría solo como 1. En el mismo registro situado en el límite, la cuarta condición dejaría de cumplirse y CDI podría aparecer como `3, NO`.

Este ejemplo es un registro hipotético compuesto por solo dos respuestas para mostrar el límite del cálculo; no es un protocolo completo que pueda utilizarse para una interpretación clínica. El profesional clínico determina el superíndice activo o pasivo del movimiento después de revisar el registro de respuestas y la encuesta (Inquiry).

### ¿Dónde comenzó el problema?

Se volvieron a comparar los materiales del desarrollo inicial.

- La lista de entrada del archivo de cálculo de Excel de 2019 utilizado durante el desarrollo de v1 contenía únicamente códigos de movimiento con superíndice activo o pasivo, mientras que `M`, `FM` y `m` se utilizaban como totales derivados de esos códigos.
- La implementación en Perl de RorScore también leía códigos de movimiento con superíndice activo o pasivo y calculaba por separado los totales `M`, `FM` y `m` y las frecuencias activas y pasivas.
- El menú desplegable de codificación de v1.0.0 combinó los códigos que se introducen para cada respuesta con los campos de total que aparecen en el Sumario Estructural, y esa situación continuó hasta v2.
- El historial de la corrección de MQual de v1.0.2 muestra que `M` sin superíndice activo o pasivo se trató como un código de respuesta individual junto con `Ma`, `Mp` y `Ma-p`.

Los registros conservados no permiten establecer la secuencia manual exacta mediante la cual se combinaron la lista de entrada de Excel y los campos de total de Perl. Dentro de lo que puede verificarse, la explicación más precisa es que **la distinción entre los códigos que se introducen para las respuestas individuales y los totales que se muestran en el Sumario Estructural se volvió imprecisa en la implementación de v1**.

Excel y Perl distinguían, cada uno en su propio contexto, los códigos de movimiento de respuestas individuales y los totales por tipo de movimiento. El problema confirmado no estaba en la regla de cálculo de ninguno de los materiales de referencia, sino en una implementación de la aplicación que situó elementos con funciones distintas en una misma lista de entrada. El historial del desarrollo y los límites de la evidencia disponible se describen en detalle en el [documento de revisión del límite de entrada de los determinantes de movimiento](../../source/docs/ops/2026-07-18-v2.2.5-movement-input-boundary.md).

## Correcciones relacionadas

- Las páginas de referencia de `M`, `FM` y `m` en cinco idiomas explican ahora la diferencia entre los campos de total del Sumario Estructural y los códigos introducidos para respuestas individuales.
- Las explicaciones complementarias de la interfaz y las páginas de referencia siguen ahora el mismo criterio.
- El Asistente de Codificación ya no presenta `M`, `FM` o `m` como códigos completos que puedan introducirse directamente para una respuesta individual y solicita la información `a`, `p` o `a-p` necesaria para completar el código.
- Se restauraron caracteres dañados en 4 preguntas de búsqueda en japonés y en un registro coreano de mantenimiento de documentos.
- Tras modificar las páginas de referencia, se reconstruyeron los datos de búsqueda y los embeddings de OpenAI de los cinco idiomas.
- Se reforzaron las reglas de generación de documentos y las pruebas de regresión para mantener `Regla del código de entrada` y `Condición de codificación/aplicación` como secciones independientes.
- Se reforzó el orden de respuesta del Asistente de Interpretación para que explique primero el número de respuestas y las limitaciones de los datos ante preguntas amplias sobre el Sumario Estructural.

## Pruebas y verificación

En primer lugar, se comprobó que los códigos de entrada y los campos de resultados conservaran funciones diferentes.

- El menú desplegable de codificación muestra solo los 29 códigos de determinante completos.
- `M`, `FM` y `m` permanecen en los resultados del Sumario Estructural como totales por tipo de movimiento.
- Un valor antiguo guardado automáticamente sin superíndice activo o pasivo, el formato histórico de Excel `m'a` o un código arbitrario no registrado detienen el cálculo sin alterar el valor original.
- La frecuencia total de movimiento, los determinantes simples (Single) y las combinaciones de determinantes (Blends) continúan contabilizándose como conceptos distintos en el Sumario Estructural.
- Las pruebas de regresión fijan el comportamiento en el límite de CDI: dos entradas `Mp` válidas cumplen la cuarta condición, mientras que una sola no la cumple.

También se comprobaron las páginas de referencia en cinco idiomas y los asistentes de IA opcionales.

- Las 365 preguntas de búsqueda de documentación recuperaron el documento correspondiente.
- Se reconstruyeron los 5,604 embeddings de OpenAI a partir del texto revisado; hubo 0 embeddings obsoletos o discrepancias en el hash del contenido.
- En la búsqueda híbrida con embeddings reales de OpenAI, tanto la tasa de acierto del primer documento como la cobertura del conjunto relevante fueron del 100% para preguntas amplias y preguntas con nombre explícito. Ninguna pregunta amplia devolvió como primer resultado un documento de otra área de trabajo.
- En 62 llamadas reales de un solo turno a GPT-5.5, todas las preguntas sobre codificación activa-pasiva del movimiento respetaron el límite previsto. En 1 respuesta interpretativa extensa no relacionada con los códigos de movimiento se detectó que no explicaba primero el número de respuestas y las limitaciones de los datos; se corrigió el orden y la misma condición superó después 3 comprobaciones consecutivas.
- Las conversaciones sobre codificación del movimiento superaron 9 llamadas de varios turnos. Otra comprobación en inglés falló 1 vez porque el evaluador no reconoció una expresión equivalente; tras corregir la expresión aceptada, la pregunta relacionada superó 2 comprobaciones consecutivas.
- Después de alinear el texto y los embeddings definitivos de los cinco idiomas, se hizo una llamada por idioma con una pregunta representativa sobre el límite de entrada del movimiento. Las 5 llamadas en coreano, inglés, japonés, español y portugués se completaron correctamente.
- Después de corregir la regla de generación de títulos de sección, se repitieron las mismas preguntas en cinco idiomas. Las 5 se completaron correctamente, sin interrupciones ni incumplimientos del límite.
- Las 4 comprobaciones realizadas por la misma ruta de API que utiliza la aplicación web se completaron correctamente.
- En el conjunto automatizado completo, se superaron 447 comprobaciones de 81 archivos de prueba y 7 se omitieron porque no estaban disponibles sus condiciones de ejecución. También se generaron las 222 páginas de despliegue, y se completaron correctamente el análisis estático, la auditoría de textos en cinco idiomas, la detección de secretos y las auditorías de dependencias de producción y desarrollo.

Las llamadas reales a GPT-5.5 comprobaron si los asistentes de Codificación e Interpretación respetaban los límites de respuesta previstos para preguntas preparadas. No garantizan la exactitud clínica de todas las preguntas posibles, ni se utilizaron respuestas de IA como clave de corrección de los cálculos del Sumario Estructural.

OpenAI Codex se utilizó para la implementación y las pruebas repetidas. Claude Opus 4.8 se utilizó para revisar la documentación y los fundamentos de cálculo antes de la publicación. La coincidencia entre herramientas no se consideró una prueba; se valoraron conjuntamente fuentes profesionales públicas, el alcance del CS adoptado por esta aplicación, resultados de cálculo reproducibles y la revisión humana.

## UI/UX, privacidad y base de datos

- No se añadió ninguna pantalla ni campo de entrada nuevos.
- Se eliminaron las tres opciones no válidas del menú desplegable [Determinants].
- Si un guardado automático anterior contiene un determinante no válido, el aviso existente identifica la fila y el código, y se detiene el cálculo.
- No se recopila nueva información personal.
- Se mantiene el principio de no guardar los datos de codificación en la base de datos del servidor.
- No se modificaron la estructura de la base de datos de comentarios ni los límites de solicitudes.

## Alcance público y límite de seguridad

El código público incluye comprobaciones del límite de entrada, pruebas de regresión de los cálculos, páginas de referencia en cinco idiomas, instantáneas de los datos de búsqueda y resúmenes de pruebas de GPT-5.5 sin los textos originales de las preguntas y respuestas.

No se publican los archivos originales del desarrollo inicial, bibliografía de pago o privada, rutas locales, claves de API, variables de entorno, textos completos de respuestas ni registros privados de revisión. Los documentos públicos enlazan únicamente páginas públicas de distribución reproducibles y repositorios públicos oficiales.

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
