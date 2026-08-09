# [2026-08-08] v2.2.10 corrección de errores

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## Esta versión

v2.2.10 mantiene sin cambios los cálculos del Sumario Estructural, recupera `GHR:PHR` en la pantalla de resultados y en el PDF y mejora la legibilidad del PDF.

Esta versión no modifica los resultados del Sumario Estructural. No es necesario recalcular los protocolos existentes introducidos conforme a las reglas.

## Cambios

### GHR:PHR en Lower Section

La aplicación ya clasificaba GHR y PHR en cada respuesta y mostraba sus totales en Upper Section. Faltaba la proporción `GHR:PHR` del formulario de Sumario Estructural en el área Interpersonal de Lower Section.

La pantalla y el PDF ahora muestran `GHR:PHR` después de `COP` y `AG`, y antes de `a:p`. No cambian la secuencia de decisión ni los totales GHR/PHR.

### Salida PDF

- Las tarjetas comunes de Lower Section usan una tabla más sencilla de dos columnas: concepto y valor.
- S-CON, DEPI, CDI, HVI y OBS imprimen una casilla de resultado global y separadores más claros entre criterios.
- Se ajustó el tamaño del texto de HVI para evitar un salto de línea de un solo carácter.

Estos cambios mejoran la presentación y la impresión; no modifican fórmulas ni decisiones.

## Fuentes de cálculo

Las dos fuentes principales del cálculo son:

1. Exner, J. E., Jr. (2003). *The Rorschach: A Comprehensive System, Volume 1: Basic Foundations and Principles of Interpretation* (4th ed.). John Wiley & Sons.
2. Exner, J. E., Jr. (2001). *A Rorschach Workbook for the Comprehensive System* (5th ed.). Rorschach Workshops.

Las páginas de la tabla corresponden a la numeración impresa en cada publicación.

| Área | Volume 1, 4.ª ed. | Workbook, 5.ª ed. | Alcance en la aplicación |
| --- | --- | --- | --- |
| Determinantes de movimiento y familias M, FM, m | pp. 91-95 | pp. 35-37 | Se registran los calificadores activo/pasivo y el Sumario Estructural muestra los totales por familia. |
| Contenidos múltiples y límite An/Xy | pp. 126, 128 | pp. 55-56 | La duplicación de contenidos y los límites Na/Bt/Ls y An/Xy forman parte de este alcance. |
| Level 1 y 2, CONTAM y varios Special Scores | pp. 135, 138-139, 145 | pp. 62-63, 69-70, 79-80 | Los pares de nivel, la exclusividad de CONTAM y WSum6 forman parte de este alcance. |
| Decisión GHR/PHR | pp. 143-144 | p. 77 | El cálculo actual sigue la secuencia de siete pasos. |
| Upper Section | pp. 148-150 | pp. 91-92 | El Sumario Estructural incluye los totales de Location, DQ, FQ, determinantes, contenidos y Special Scores. |
| Lower Section | pp. 151-155 | pp. 93-99 | Los cálculos y la presentación abarcan desde Core hasta Self-Perception. |
| Seis Special Indices | p. 156 | pp. 100-101 | El alcance incluye los criterios y límites de PTI, DEPI, CDI, S-CON, HVI y OBS. |
| Aplicación por edad y ajustes | p. 157 | pp. 100-101 | El profesional mantiene la decisión sobre la aplicación según la edad. |

### Diferencia entre ediciones de PTI

Volume 1, 4.ª edición, p. 156 imprime la rama de R alto del cuarto criterio de PTI como `R > 16` con `WSum6 > 16`. Workbook, 5.ª edición, p. 101 y la salida de RIAP 5 usan `R > 16` con `WSum6 > 17`.

La aplicación conserva `> 17`, siguiendo el Workbook posterior y esa salida.

### S-CON y edad

S-CON se aplica a partir de los 15 años. La aplicación no recoge la edad del examinado. Muestra si los valores introducidos cumplen los criterios; el profesional, con la edad y la información clínica completa, decide si S-CON es aplicable.

## Referencias y asistente de IA

Los documentos Interpersonal en cinco idiomas ahora explican `GHR:PHR`. También aclaran que un predominio puede describir un aspecto de las representaciones humanas, pero la proporción por sí sola no determina el funcionamiento interpersonal general.

El asistente de IA se limita al Sistema Comprehensivo de Exner. No mezcla reglas de R-PAS ni de otros sistemas de Rorschach en los cálculos Exner y explica el límite ante solicitudes de diagnóstico, tratamiento, juicio legal u otras tareas fuera del alcance de la calculadora.

## Efecto en resultados existentes

No es necesario recalcular los protocolos existentes. Para conservar un protocolo anterior con el nuevo formato, basta con abrirlo y generar de nuevo el PDF.

## Fuentes y derechos de autor

Los documentos públicos ofrecen datos bibliográficos y las páginas impresas usadas para el cálculo. No reproducen pasajes extensos protegidos ni material real de evaluación.
