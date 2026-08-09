# [2026-07-20] v2.2.6 Corrección de errores

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## Cambios principales

### Resumen

Este parche corrige casos en los que los motores de búsqueda y las vistas previas de enlaces recibían información de idioma distinta de la página visible. También corrige un problema de la pantalla de codificación por el que `Alt+rueda del ratón` podía interpretarse como desplazamiento en algunos navegadores de Windows.

En las explicaciones que aparecen al pasar el ratón sobre los encabezados [Score] y [G/PHR], los nombres de campos relacionados utilizan ahora un único formato entre corchetes: [Card], [Z], [Contents], [Determinants], [FQ] y [Special Score].

El parche no cambia las fórmulas del Sumario Estructural, los datos de codificación, la disposición de la pantalla ni las reglas de respuesta de los asistentes de IA opcionales. No es necesario volver a calcular los protocolos existentes.

### Información de búsqueda en cinco idiomas

Cada página muestra ahora el título y la descripción correctos para su idioma en los resultados de búsqueda y en los enlaces compartidos. Los marcadores y enlaces externos existentes siguen funcionando.

### Ampliación de la pantalla de codificación

En los navegadores de Windows afectados, `Alt+rueda del ratón` ahora amplía o reduce la pantalla de codificación en lugar de desplazarla.

Se mantiene el comportamiento de `Ctrl+rueda del ratón` para ampliar toda la página del navegador. Tampoco cambian la escala mínima y máxima de la pantalla de codificación, la ampliación centrada en el puntero ni los márgenes de desplazamiento.

## Interfaz, privacidad y alcance del cálculo

- No se añadieron pantallas ni campos de entrada.
- No se modificaron los menús visibles ni la disposición.
- Solo se unificó la redacción de las explicaciones de los encabezados de la tabla de codificación.
- No se modificaron las fórmulas ni los resultados del Sumario Estructural.
- No se recopila nueva información personal.
- Los datos de codificación autoguardados permanecen únicamente en el dispositivo. La clave API se usa cifrada para una conexión de IA durante un máximo de 24 horas y se elimina al finalizar la conexión.
- No se modificaron la búsqueda de referencias ni las reglas de respuesta de los asistentes de codificación e interpretación.
