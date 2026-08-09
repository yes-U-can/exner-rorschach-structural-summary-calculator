# [2026-08-01] v2.2.9 corrección de errores

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## Cambios principales

### Ordenación de [Card]

El botón del encabezado [Card] solo aplicaba el orden ascendente. Cuando el registro ya estaba ordenado por lámina, pulsarlo parecía no producir ningún cambio.

Ahora el botón alterna entre el orden ascendente y el descendente. Su nombre accesible y su icono indican la dirección que aplicará la siguiente pulsación. Las filas sin lámina permanecen al final y las filas de una misma lámina conservan su orden actual.

### Apertura del Asistente de Interpretación después de iniciar una sesión de IA

Al seleccionar [Asistente de Interpretación] desde la pantalla de puntuación o los documentos de referencia, iniciar una sesión de IA con una clave API dejaba al usuario en la pantalla anterior en lugar de abrir el asistente.

Ahora, cuando la sesión se inicia como parte de ese acceso, la aplicación abre el Asistente de Interpretación y conserva el idioma seleccionado. Si la sesión se inicia con el botón general [Iniciar sesión de IA] situado en la parte inferior de la barra lateral, la pantalla actual se mantiene.

### Botón para ir al mensaje más reciente

En el Asistente de Interpretación, el botón que aparece cuando se está leyendo por encima del mensaje más reciente también indica si la IA está respondiendo. Mientras se redacta una respuesta, tres puntos centrados verticalmente se mueven de forma sucesiva. Al terminar la respuesta, vuelve a mostrarse la flecha hacia abajo. En ambos estados, el botón permite ir al mensaje más reciente.

El movimiento de los puntos se reduce cuando el sistema operativo solicita reducir las animaciones.

### Valoración útil o no útil

El estado seleccionado de los botones útil y no útil se distinguía poco del estado sin seleccionar. El fondo y el borde del botón conservan ahora su aspecto habitual, y solo el pulgar seleccionado pasa a ser un icono sólido con el azul de la aplicación. Así se reconoce la selección actual sin introducir un nuevo código de colores para las valoraciones.

La valoración se guarda en cuanto se pulsa uno de los botones. Si se elige [Omitir] en el cuadro opcional de motivos, se conserva solo la valoración, sin motivo. Al volver a pulsar el mismo botón seleccionado, la valoración se elimina y el botón vuelve al estado sin seleccionar. El texto de la pregunta y de la respuesta no se incluye en la información de valoración.

## ¿Afecta a resultados de cálculo existentes?

No. Esta versión no modifica las fórmulas del Sumario Estructural, los códigos de entrada disponibles, el contenido de los documentos de referencia ni las reglas de respuesta de la IA. No es necesario volver a calcular protocolos existentes.
