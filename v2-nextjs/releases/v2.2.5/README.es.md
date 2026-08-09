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

En un registro hipotético donde «Una persona está descansando» y «Otra persona está acostada durmiendo» se codifican como `Mp H`, el movimiento pasivo es 2 y el activo es 0; por tanto, se cumple la cuarta condición y la pantalla muestra CDI como `4, Positive`.

Si en una versión anterior el segundo `Mp` se hubiera introducido como `M` sin superíndice activo o pasivo, el total de movimiento humano seguiría apareciendo como 2, pero la frecuencia pasiva se contaría solo como 1. En el mismo registro situado en el límite, la cuarta condición dejaría de cumplirse y CDI podría aparecer como `3, NO`.

Este ejemplo es un registro hipotético compuesto por solo dos respuestas para mostrar el límite del cálculo; no es un protocolo completo que pueda utilizarse para una interpretación clínica. El profesional clínico determina el superíndice activo o pasivo del movimiento después de revisar el registro de respuestas y la encuesta (Inquiry).

## Correcciones relacionadas

- Las páginas de referencia de `M`, `FM` y `m` en cinco idiomas explican ahora la diferencia entre los campos de total del Sumario Estructural y los códigos introducidos para respuestas individuales.
- Las explicaciones complementarias de la interfaz y las páginas de referencia describen la misma regla de entrada.
- El Asistente de Codificación ya no presenta `M`, `FM` o `m` como códigos completos que puedan introducirse directamente para una respuesta individual y solicita la información `a`, `p` o `a-p` necesaria para completar el código.
- El Asistente de Interpretación explica primero el número de respuestas y las limitaciones de los datos ante preguntas amplias sobre el Sumario Estructural.

Los asistentes de IA no garantizan la exactitud de las respuestas a todas las preguntas clínicas, y sus respuestas no constituyen una clave de corrección para los cálculos del Sumario Estructural.

## Interfaz y privacidad

- No se añadió ninguna pantalla ni campo de entrada nuevos.
- Se eliminaron las tres opciones no válidas del menú desplegable [Determinants].
- Si un guardado automático anterior contiene un determinante no válido, el aviso existente identifica la fila y el código, y se detiene el cálculo.
- No se recopila nueva información personal.
- Los datos de codificación autoguardados permanecen únicamente en el dispositivo de la persona usuaria.
