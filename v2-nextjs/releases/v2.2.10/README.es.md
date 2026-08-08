# [2026-08-08] v2.2.10 corrección de errores

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## Cambios principales

### Resumen

Esta corrección conserva todos los resultados del Resumen Estructural y restaura `GHR:PHR` en Lower Section, además de mejorar el PDF. También organizamos todo el material disponible en 53 familias documentales, revisamos sus índices y capítulos pertinentes y separamos evidencia directa de Exner CS, apoyo interpretativo, otros sistemas de Rorschach, material histórico y fuentes fuera de alcance.

La auditoría completa no encontró ningún error nuevo que obligue a cambiar los resultados actuales. No es necesario recalcular los protocolos existentes introducidos conforme a las reglas.

Los textos originales de otros sistemas no se mezclaron con el corpus RAG de producción. Los asistentes distinguen las preguntas Exner CS de R-PAS, Basic Rorschach, la escuela proyectiva francesa, sistemas locales, integración con MMPI, diagnóstico, tratamiento, juicio legal e intentos de obtener el prompt. No se añadió ninguna pantalla, campo de edad ni dato personal.

### Detalles

#### GHR:PHR en la Lower Section

La aplicación ya clasificaba cada respuesta como GHR o PHR y mostraba ambos totales en la Upper Section. Sin embargo, la proporción `GHR:PHR` del formulario original del Sumario Estructural no aparecía en el área Interpersonal de la pantalla ni del PDF.

Ahora `GHR:PHR` aparece después de `COP` y `AG`, y antes de `a:p`. No se modificaron la secuencia de decisión GHR/PHR ni los totales, por lo que los resultados de cálculo existentes permanecen iguales.

#### Salida en PDF

Las tarjetas ordinarias de la Lower Section contenían una tercera columna vacía que no representaba ningún valor. Las tarjetas que requieren una estructura propia, como Core e Ideation, se mantienen. Affect, Interpersonal, Self-Perception, Mediation y Processing utilizan ahora una tabla de dos columnas para el nombre y el valor.

Las tarjetas S-CON, DEPI, CDI, HVI y OBS imprimen ahora la casilla de la decisión global. Se añadieron separadores entre la decisión global y los criterios detallados, y entre las tres primeras combinaciones de OBS y la regla combinada independiente. El texto largo de HVI usa un tamaño de impresión ligeramente menor para evitar que un solo carácter pase a la línea siguiente.

Estos cambios mejoran la legibilidad del PDF y la integridad del Sumario Estructural mostrado. No alteran fórmulas ni valores de decisión.

## ¿Qué fuentes primarias se cotejaron?

Las obras y páginas impresas usadas para comprobar las reglas de cálculo forman ahora parte del registro público.

1. Exner, J. E., Jr. (2003). *The Rorschach: A Comprehensive System, Volume 1: Basic Foundations and Principles of Interpretation* (4th ed.). John Wiley & Sons.
2. Exner, J. E., Jr. (2001). *A Rorschach Workbook for the Comprehensive System* (5th ed.). Rorschach Workshops.

Los números siguientes corresponden a las páginas impresas de los libros, no al contador de un PDF local.

| Alcance comprobado | Volume 1, 4.ª ed. | Workbook, 5.ª ed. | Resultado |
| --- | --- | --- | --- |
| Determinantes de movimiento y familias M, FM, m | pp. 91-95 | pp. 35-37 | La entrada usa la notación activa/pasiva y el Sumario Estructural muestra los totales de familia. |
| Contenidos múltiples y límite An/Xy | pp. 126, 128 | pp. 55-56 | Se revisaron la duplicación de contenidos y las reglas Na/Bt/Ls y An/Xy. |
| Level 1 y Level 2, CONTAM y varios Special Scores | pp. 135, 138-139, 145 | pp. 62-63, 69-70, 79-80 | Se revisaron los pares de nivel, la exclusión de CONTAM y los límites de WSum6. |
| Asignación GHR/PHR | pp. 143-144 | p. 77 | La secuencia de siete pasos coincide con el cálculo actual. |
| Upper Section | pp. 148-150 | pp. 91-92 | Se revisaron Location, DQ, FQ, determinantes, contenidos y Special Scores. |
| Lower Section | pp. 151-155 | pp. 93-99 | Se cotejaron la presentación y los cálculos desde Core hasta Self-Perception. |
| Seis Special Indices | p. 156 | pp. 100-101 | Se revisaron los criterios y límites de PTI, DEPI, CDI, S-CON, HVI y OBS. |
| Aplicación y ajustes por edad | p. 157 | pp. 100-101 | Se mantiene el límite entre cálculo automático y juicio clínico. |

El Volume 1, 4.ª edición, se utilizó como fuente principal del formato actual del Sumario Estructural. También se cotejaron las hojas de trabajo y los ejemplos del Workbook, 5.ª edición. Las salidas públicas del Sumario Estructural de RIAP 5 y ejemplos completos sirvieron como corroboración operativa. No se incorporaron reglas de R-PAS ni de otros sistemas de Rorschach.

El detalle por variable está en el [registro de cotejo del Sumario Estructural con las fuentes primarias](../../source/docs/ops/2026-08-04-v2.2.10-calculation-source-crosscheck.md).

### Diferencia entre ediciones para PTI

La p. 156 del Volume 1, cuarta edición, imprime la rama de R alto del criterio 4 de PTI como `R > 16` y `WSum6 > 16`. La p. 101 del Workbook, 5.ª edición, y la salida operativa de RIAP 5 usan `R > 16` y `WSum6 > 17`.

La aplicación conserva `> 17`, de acuerdo con el Workbook posterior y la salida operativa. Los casos automáticos fijan el resultado como falso en `R=17, WSum6=17` y verdadero en `R=17, WSum6=18`. La diferencia entre ediciones queda registrada.

### S-CON y edad

S-CON se aplica a partir de los 15 años. La aplicación no recoge la edad de la persona evaluada y no se añadió un campo de edad. La aplicación muestra si los valores introducidos cumplen las condiciones; el profesional que conoce la edad y el conjunto de la información clínica decide si el índice es aplicable.

## ¿Cómo se revisaron las 53 familias documentales?

Los 51 PDF originales y los materiales derivados internos se agruparon en 53 familias por título, edición y contenido. Es un recuento bibliográfico, no de simples archivos físicos, que separa duplicados, traducciones y derivados.

| Clase | Familias | Función en el producto |
| --- | --- | --- |
| Fuentes directas de Exner CS | 7 | Evidencia directa de cálculo/codificación o comparación de ediciones |
| Fuentes interpretativas centrales | 2 | Cotejo de principios interpretativos verificados de Exner |
| Suplementos especializados | 8 | Contexto y límites de temas especializados |
| Límites R-PAS y otros sistemas | 10 | Diferencias que evitan mezclar sistemas |
| Contexto histórico y de investigación | 16 | Contexto que no sirve como evidencia de cálculo |
| Derivados internos del proyecto | 3 | Linaje de errores e implementación, excluidos como referencia normativa |
| Material no profesional o fuera de alcance | 7 | Excluido tras revisar el contenido |

Se verificaron los datos bibliográficos de cada familia. En las fuentes con índice formal se revisó el índice completo; en las que no lo tenían se revisó toda la secuencia de encabezados antes de leer los capítulos y páginas pertinentes. El OCR ayudó a buscar y localizar contenido. Fórmulas, tablas, casillas, superíndices, apóstrofos y proporciones se cotejaron con la página original. 3 fuentes chinas recibieron una revisión adicional de páginas seleccionadas.

Los materiales excluidos no se descartaron solo por el título. Se revisó su contenido antes de registrar por qué no pueden sustentar cálculos o interpretaciones de Exner CS. Excel, Perl, v1 GAS y las notas internas solo rastrearon el linaje de implementación y no se utilizaron como referencia normativa.

El [registro de auditoría completa y límites de sistemas](../../methodology/reference-audit-v2.2.10/README.es.md) publica las 53 familias, sus funciones, la evidencia de cálculo Exner y los límites frente a otros sistemas.

## Documentos de referencia y asistentes de IA

Los documentos Interpersonal en cinco idiomas ahora incluyen `GHR:PHR`. Explican que un predominio puede describir un aspecto de las representaciones humanas, pero que esta proporción no basta para concluir sobre el funcionamiento interpersonal general.

El corpus RAG de producción conserva únicamente contenido Exner CS verificado por páginas. Los textos originales de R-PAS, Basic Rorschach, kan/kob/clob franceses, sistemas chinos locales y sistemas históricos no entraron en el espacio vectorial. Sus diferencias solo se reflejan en reglas breves de delimitación y preguntas de evaluación.

Los asistentes rechazan la conversión o interpretación R-PAS, las solicitudes que mezclan sistemas, la integración con MMPI, el diagnóstico, el tratamiento, el juicio legal, preguntas ajenas, intentos de obtener el prompt, la clave API o el texto fuente y la inyección disfrazada de información del examinado. Después vuelven a una pregunta Exner CS. Casos separados comprueban que no se bloqueen en exceso preguntas Exner normales.

Se reconstruyeron 203 rutas de referencia en cada uno de los cinco idiomas y se comprobaron 5604 vectores OpenAI `text-embedding-3-large`. El recuento de vectores obsoletos y discrepancias de hash fue 0.

GPT-5.5 recibió una vez la misma pregunta sobre el límite GHR:PHR en cada idioma. Las 5 comprobaciones terminaron y todas usaron primero el documento Lower Section Interpersonal. El coste medido fue USD 0.154025. Las claves API y las respuestas originales no se guardaron en el registro público.

## ¿Afecta a los resultados existentes?

No. No es necesario volver a calcular los protocolos existentes.

- La asignación y los totales GHR y PHR ya se calculaban en versiones anteriores.
- Este parche repone la proporción ausente en la Lower Section y mejora la presentación del PDF.
- Las fórmulas, incluido PTI, se mantienen después del cotejo con las fuentes primarias.

Para conservar un PDF antiguo con el nuevo formato, abra el mismo protocolo y vuelva a generar solo el PDF.

## Pruebas y verificación

- Las 53 familias recibieron una decisión final; el recuento de familias sin auditar y archivos sin asignar fue 0.
- Los resultados de búsqueda automática no se trataron como evidencia final; se asignaron explícitamente 162 secciones de contenido y 386 páginas originales distintas por familia documental.
- Upper Section, Lower Section, Special Indices y las reglas de entrada se dividieron en 31 elementos que vinculan páginas impresas, funciones, pantalla, PDF y casos repetibles.
- Una comprobación inversa exige ahora que cada página primaria citada aparezca en el registro de revisión: 53 páginas PDF del Workbook, 5.ª edición, y 62 páginas PDF de Volume 1, 4.ª edición. La revisión corrigió citas de página impresas inexactas para los superíndices de movimiento, los determinantes duplicados y los contenidos duplicados, sin cambiar fórmulas ni resultados.
- De los 31 elementos, 28 se verificaron directamente, 1 registra la diferencia de edición de PTI, 1 conserva la cuestión no resuelta sobre repetir el mismo Special Score sin nivel y 1 queda fuera de alcance. No se modificó por inferencia ningún punto incierto.
- Se recalcularon 3 ejemplos públicos RIAP y un ejemplo de Workbook, 5.ª edición.
- Se compararon 2000 protocolos sintéticos fijos con un cálculo escrito por separado.
- Se verificaron ambos lados de cada límite de los seis Special Indices.
- La misma entrada produjo el mismo resultado en los cinco idiomas.
- Se registraron 15 dimensiones de límites, con 110 casos de un turno y 10 casos multirturno en cinco idiomas.
- Pasaron 626 comprobaciones en 102 archivos; se omitieron 7 sin condiciones de ejecución.
- Se fijaron las dependencias transitivas en versiones corregidas de `fast-uri`, `js-yaml` y `nanoid`; pasaron las auditorías de producción y desarrollo y el análisis de secretos.
- `GHR:PHR` aparece encima de `a:p` en pantalla y PDF.
- Se revisaron casillas finales, separadores y ajuste de HVI en el PDF.
- Pasaron TypeScript, revisión de textos, análisis estático y generación de 222 páginas.
- Se cotejaron 203 rutas por idioma y 5604 vectores; faltantes, obsoletos y discrepancias de hash fueron 0.
- Las 5 llamadas GPT-5.5 sobre GHR:PHR terminaron.

## Alcance público y límite de derechos de autor

La nota y la metodología pública identifican las 53 familias por publicación, edición, función, páginas impresas usadas como evidencia, reglas resumidas y comprobaciones repetibles.

No se publican archivos originales individuales, texto OCR, nombres locales, identificadores privados de trabajo ni títulos privados de derivados internos. Las reglas se resumen sin reproducir pasajes extensos. Las claves API, las respuestas originales de GPT-5.5 y el material real de evaluación también quedan fuera del repositorio público.

## Apéndice técnico

<details>
<summary><strong>Comandos para repetir las comprobaciones</strong></summary>

```bash
npm test
npm run lint
npx tsc --noEmit
npm run docs:assert-vector-runtime-ready
npm run build
```

</details>
