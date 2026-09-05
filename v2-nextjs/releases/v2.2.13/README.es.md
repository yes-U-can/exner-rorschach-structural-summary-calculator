# [2026-09-05] v2.2.13 Corrección de errores

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## Cambios principales

### Resumen

La v2.2.13 corrige un problema que permitía incluir en el cálculo filas con valores de codificación obligatorios ausentes o con discrepancias entre los determinantes y la calidad formal (FQ). Ahora, cuando se detectan estas entradas, el cálculo se detiene y se indican las filas que deben revisarse.

No hemos cambiado las fórmulas del Sumario Estructural ni los puntos de corte de los índices especiales. Los registros existentes que se hayan completado conforme a las reglas no necesitan volver a calcularse. Sin embargo, los registros con las omisiones o discrepancias descritas a continuación deben revisarse a partir del material original, corregirse y volver a calcularse.

### Detalles

#### Filas sin todos los valores de codificación obligatorios

Cada fila en la que se haya empezado a codificar una respuesta debe incluir localización, calidad evolutiva (DQ), determinantes y contenido. Antes, el cálculo podía continuar aunque alguno de estos campos estuviera vacío. Ahora se indican las filas con campos pendientes y el cálculo no continúa hasta que se completen. Las notas de la respuesta no pasan a ser un campo obligatorio.

Si una fila incompleta se cuenta como una respuesta real, pueden cambiar el número de respuestas (R) y las proporciones que lo utilizan. Cuando faltan la localización o los determinantes, también pueden verse afectados valores que utilizan esos códigos, como WDA% o Lambda. Las filas vacías que no se hayan utilizado no se incluyen en el número de respuestas.

**Ejemplo: ausencia de respuesta a una lámina**

Por ejemplo, si realmente no hubo respuesta a la lámina VI, introducir `none` u otros códigos en esa fila no la convierte en una respuesta completa. La opción `none` de FQ representa una respuesta real que no utiliza la forma; no es un código para indicar que no hubo respuesta.

Eliminar esa fila tampoco cambia el hecho de que no hubo respuesta a la lámina VI. Se mantiene el criterio existente de que cada lámina I–X debe tener al menos una respuesta para poder calcular. Es necesario distinguir entre una respuesta que figura en el material original pero no se introdujo y una ausencia real de respuesta durante la administración de la prueba.

#### Filas con discrepancias entre los determinantes y FQ

Las respuestas que utilizan la forma deben llevar la FQ correspondiente. Por ejemplo, al cambiar el determinante de color puro `C` por el determinante `FC`, que utiliza forma y color, podía permanecer la FQ `none` seleccionada anteriormente.

Ahora, al cambiar a un determinante que utiliza la forma, se elimina el valor `none` que haya quedado y el campo vuelve a quedar sin completar. El cálculo puede continuar después de revisar el registro de respuestas y la encuesta (Inquiry) y seleccionar la FQ que corresponda a la respuesta original. La aplicación no estima por su cuenta valores como `o`, `u` o `-`.

Si una versión guardada anteriormente u otro registro conserva una discrepancia entre los determinantes y FQ, también se indican las filas que deben revisarse y se detiene el cálculo. Estas discrepancias pueden afectar al recuento de calidad formal, a algunas condiciones de PTI y a la clasificación GHR/PHR de la respuesta.

Las respuestas válidas sin uso de forma siguen admitiéndose. FQ `none` puede utilizarse tanto en respuestas compuestas únicamente por determinantes sin forma como en las respuestas de movimiento humano sin forma reconocidas en la obra de referencia. Este cambio no prohíbe `none` de manera general.

## ¿Es necesario volver a calcular los resultados existentes?

- Los registros que contienen todos los valores de codificación obligatorios y cuyos determinantes y FQ son coherentes no necesitan volver a calcularse.
- Los registros que tenían valores obligatorios ausentes o discrepancias entre los determinantes y FQ deben corregirse después de revisar el registro de respuestas y la encuesta, y luego volver a calcularse.
- Si realmente no hubo respuesta a una lámina, no se resuelve introduciendo códigos arbitrarios ni eliminando la fila. Debe revisarse el material original y proceder conforme al criterio existente de entrada de las láminas I–X.

Este problema, por sí solo, no permite concluir que todos los resultados calculados anteriormente sean incorrectos. Primero debe comprobarse si el registro presentaba alguna de las condiciones de entrada que pueden verse afectadas.

## Fundamentos y limitaciones clínicas

La relación entre el uso de la forma y FQ se basa en las obras originales del Sistema Comprehensivo de Exner. Se asigna FQ a las respuestas que utilizan la forma, y se tratan de manera diferenciada las respuestas realmente sin forma y el movimiento humano sin forma. También comprobamos cómo se utilizan las frecuencias de los códigos de respuesta en los cálculos del Sumario Estructural y el orden de clasificación GHR/PHR.

- Exner, J. E., Jr. (2003). *The Rorschach: A Comprehensive System, Volume 1: Basic Foundations and Principles of Interpretation* (4th ed.). Wiley. La página impresa 120 fundamenta la relación entre el uso de la forma y FQ; las páginas 143–144, la clasificación GHR/PHR; la página 151, R y Lambda; la página 154, las proporciones de calidad formal; y la página 156, las condiciones de PTI.
- Exner, J. E., Jr. (2001). *A Rorschach Workbook for the Comprehensive System* (5th ed.). Rorschach Workshops. Consultamos el procedimiento de elaboración del Sumario Estructural y los ejemplos completados de las páginas impresas 91–101.

Comprobamos que se bloquean las entradas con omisiones o discrepancias y que se admiten las respuestas válidas sin forma; los ejemplos completos del Sumario Estructural de las obras originales mantienen los mismos resultados que antes. Sin embargo, superar la comprobación de entrada no significa que la codificación de cada respuesta sea clínicamente correcta. La codificación y la interpretación definitivas requieren el juicio de un profesional que revise la respuesta original, la encuesta y el conjunto de los datos clínicos.

No hemos cambiado el tratamiento de los datos personales, la disposición de la pantalla ni los campos de entrada. También hemos incorporado actualizaciones de seguridad de los componentes de software que utiliza la aplicación. Este servicio no sustituye el juicio clínico profesional.

## IA utilizada en el desarrollo y la revisión

Utilizamos OpenAI GPT-6 Astra para el desarrollo y la verificación de esta versión, y Anthropic Fable 5.1 para la revisión independiente. El modelo y el funcionamiento del asistente de IA que ofrece la aplicación web se mantienen sin cambios.
