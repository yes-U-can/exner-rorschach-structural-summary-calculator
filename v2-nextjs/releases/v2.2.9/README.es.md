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

La valoración se guarda en cuanto se pulsa uno de los botones. Si se elige [Omitir] en el cuadro opcional de motivos, se conserva solo la valoración, sin códigos de motivo. Al volver a pulsar el mismo botón seleccionado, la valoración se elimina de la base de datos del servidor y el botón vuelve al estado sin seleccionar. El texto de la pregunta y de la respuesta no se envía a la base de datos de valoraciones.

### Documentación del archivo público

Las fechas de archivo de v1.0.2 y v1.0.3 se han unificado en la misma fecha de Asia/Seoul, 2025-10-18. Dentro de esa fecha, v1.0.3 aparece antes que v1.0.2.

Las cantidades técnicas de cuatro cifras de los documentos públicos en los cinco idiomas se escriben ahora sin separador de millares, como `5604`, `1015`, `5589` y `2000`. Así se evita la ambigüedad que puede producir una coma interpretada como separador decimal en español y portugués.

Esta corrección documental se incluye en v2.2.9. No modifica el código de cálculo ni los artefactos desplegados de versiones anteriores.

## ¿Afecta a resultados de cálculo existentes?

No. Esta versión no modifica las fórmulas del Sumario Estructural, los códigos de entrada disponibles, el contenido de los documentos de referencia ni las reglas de respuesta de la IA. No es necesario volver a calcular protocolos existentes.

## Pruebas y verificación

- El conjunto completo de pruebas superó 600 comprobaciones en 98 archivos de prueba; 7 se omitieron porque no estaban disponibles sus condiciones de ejecución.
- En una comprobación directa, una muestra ya ordenada cambió de `I-X` a `X-I` y luego volvió a `I-X`.
- Se inició una sesión local de prueba después de seleccionar [Asistente de Interpretación] en la pantalla de puntuación y se confirmó la apertura del asistente. La clave de prueba se eliminó inmediatamente de la sesión local y no se envió a OpenAI.
- Las pruebas automáticas cubren el destino de la sesión en los cinco idiomas, la permanencia en la pantalla actual después del inicio general de sesión, los tres puntos durante la transmisión y la flecha hacia abajo en reposo.
- Las pruebas automáticas también cubren la apariencia seleccionada de la valoración, el guardado sin motivos y la eliminación de la valoración almacenada al volver a pulsar el mismo botón.
- Se superaron la validación de TypeScript y el análisis estático de los archivos modificados.

No se realizaron llamadas de pago a la API porque esta versión no modifica la generación de respuestas de OpenAI.

## Alcance que permanece sin cambios

- Las fórmulas del Sumario Estructural y los campos de resultados no cambian.
- Los documentos de referencia, las incrustaciones vectoriales, los prompts de sistema de IA y los playbooks no cambian.
- Se mantiene la política de no almacenar los datos de puntuación ni las claves API de OpenAI en la base de datos del servidor.

## Apéndice técnico

<details>
<summary><strong>Comandos para reproducir las comprobaciones</strong></summary>

```bash
npm test
npm run lint
npx tsc --noEmit
```

</details>
