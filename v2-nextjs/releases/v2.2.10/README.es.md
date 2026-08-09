# [2026-08-08] v2.2.10 corrección de errores

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## Esta versión

v2.2.10 mantiene sin cambios los cálculos del Resumen Estructural, recupera `GHR:PHR` en la pantalla de resultados y en el PDF y mejora la legibilidad del PDF.

La revisión de las fuentes y de los casos límite no encontró ningún defecto nuevo que obligue a modificar los resultados actuales. No es necesario recalcular los protocolos existentes introducidos conforme a las reglas.

## Cambios

### GHR:PHR en Lower Section

La aplicación ya clasificaba GHR y PHR en cada respuesta y mostraba sus totales en Upper Section. Faltaba la proporción `GHR:PHR` del formulario de Resumen Estructural en el área Interpersonal de Lower Section.

La pantalla y el PDF ahora muestran `GHR:PHR` después de `COP` y `AG`, y antes de `a:p`. No cambian la secuencia de decisión ni los totales GHR/PHR.

### Salida PDF

- Las tarjetas comunes de Lower Section usan una tabla más sencilla de dos columnas: concepto y valor.
- S-CON, DEPI, CDI, HVI y OBS imprimen una casilla de resultado global y separadores más claros entre criterios.
- Se ajustó el tamaño del texto de HVI para evitar un salto de línea de un solo carácter.

Estos cambios mejoran la presentación y la impresión; no modifican fórmulas ni decisiones.

## Fuentes de cálculo revisadas

Las dos fuentes principales de cálculo fueron:

1. Exner, J. E., Jr. (2003). *The Rorschach: A Comprehensive System, Volume 1: Basic Foundations and Principles of Interpretation* (4th ed.). John Wiley & Sons.
2. Exner, J. E., Jr. (2001). *A Rorschach Workbook for the Comprehensive System* (5th ed.). Rorschach Workshops.

Las páginas de la tabla corresponden a la numeración impresa en cada publicación.

| Área revisada | Volume 1, 4.ª ed. | Workbook, 5.ª ed. | Resultado |
| --- | --- | --- | --- |
| Determinantes de movimiento y familias M, FM, m | pp. 91-95 | pp. 35-37 | Se registran los calificadores activo/pasivo y el Resumen Estructural muestra los totales por familia. |
| Contenidos múltiples y límite An/Xy | pp. 126, 128 | pp. 55-56 | Se revisaron la duplicación de contenidos y los límites Na/Bt/Ls y An/Xy. |
| Level 1 y 2, CONTAM y varios Special Scores | pp. 135, 138-139, 145 | pp. 62-63, 69-70, 79-80 | Se revisaron los pares de nivel, la exclusividad de CONTAM y WSum6. |
| Decisión GHR/PHR | pp. 143-144 | p. 77 | El cálculo actual sigue la secuencia de siete pasos. |
| Upper Section | pp. 148-150 | pp. 91-92 | Se revisaron los totales de Location, DQ, FQ, determinantes, contenidos y Special Scores. |
| Lower Section | pp. 151-155 | pp. 93-99 | Se cotejaron cálculos y presentación desde Core hasta Self-Perception. |
| Seis Special Indices | p. 156 | pp. 100-101 | Se revisaron criterios y límites de PTI, DEPI, CDI, S-CON, HVI y OBS. |
| Aplicación por edad y ajustes | p. 157 | pp. 100-101 | El profesional mantiene la decisión sobre la aplicación según la edad. |

El [registro de cotejo](../../source/docs/ops/2026-08-04-v2.2.10-calculation-source-crosscheck.md) ofrece el detalle por elemento y [fuentes de cálculo y alcance bibliográfico](../../methodology/reference-audit-v2.2.10/README.es.md) describe las publicaciones y los límites entre sistemas.

### Diferencia entre ediciones de PTI

Volume 1, 4.ª edición, p. 156 imprime la rama de R alto del cuarto criterio de PTI como `R > 16` con `WSum6 > 16`. Workbook, 5.ª edición, p. 101 y la salida operativa de RIAP 5 usan `R > 16` con `WSum6 > 17`.

La aplicación conserva `> 17`, siguiendo el Workbook posterior y la salida operativa. La diferencia queda indicada en el cotejo.

### S-CON y edad

S-CON se aplica a partir de los 15 años. La aplicación no recoge la edad del examinado. Muestra si los valores introducidos cumplen los criterios; el profesional, con la edad y la información clínica completa, decide si S-CON es aplicable.

## Referencias y asistente de IA

Los documentos Interpersonal en cinco idiomas ahora explican `GHR:PHR`. También aclaran que un predominio puede describir un aspecto de las representaciones humanas, pero la proporción por sí sola no determina el funcionamiento interpersonal general.

El asistente de IA se limita al Sistema Comprehensivo de Exner. No mezcla reglas de R-PAS ni de otros sistemas de Rorschach en los cálculos Exner y explica el límite ante solicitudes de diagnóstico, tratamiento, juicio legal u otras tareas fuera del alcance de la calculadora.

## Efecto en resultados existentes

No es necesario recalcular los protocolos existentes. Para conservar un protocolo anterior con el nuevo formato, basta con abrirlo y generar de nuevo el PDF.

## Comprobaciones realizadas

- Se revisaron las fuentes de cálculo y ambos lados de los límites de los seis Special Indices.
- Se cotejaron los resultados con ejemplos públicos y protocolos sintéticos variados.
- La misma entrada produjo el mismo resultado en los cinco idiomas.
- Se revisaron la posición de `GHR:PHR` y las casillas, separadores y saltos de línea del PDF.
- Pasaron las pruebas automatizadas, el análisis estático, los controles de seguridad y la compilación de distribución.

## Fuentes y derechos de autor

Los documentos públicos ofrecen datos bibliográficos, páginas impresas usadas para el cálculo y resultados de verificación resumidos. No reproducen pasajes extensos protegidos ni material real de evaluación.
