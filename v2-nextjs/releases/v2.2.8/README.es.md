# [2026-07-31] v2.2.8 corrección de errores

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## Cambios principales

### Resumen

Esta versión corrige un problema por el que un mismo código de Contenido introducido dos veces en una respuesta se contabilizaba dos veces. Por ejemplo, introducir `Bt` en dos casillas podía aumentar indebidamente el numerador del Índice de Aislamiento y, en un protocolo limítrofe, modificar incluso el resultado del CDI. Un código de Contenido ya seleccionado no puede volver a elegirse en otra casilla de la misma respuesta. Si un duplicado permanece en un autoguardado anterior, la aplicación conserva los datos originales, detiene el cálculo e indica la fila que debe revisarse.

La versión de escritorio y la móvil tratan ahora del mismo modo los conflictos entre Level 1 y Level 2 en las familias `DV`, `DR`, `INCOM` y `FABCOM`. Se conserva el código recién seleccionado. Si ambos niveles ya están presentes en datos guardados anteriormente, se conserva Level 1 y se pide al profesional que revise el material original. El nivel correcto debe decidirse a partir de ese material. No se guarda un Special Score vacío en la casilla de la que se elimina el código en conflicto.

Esta versión no modifica las fórmulas del Sumario Estructural. Los protocolos existentes introducidos conforme a las reglas no necesitan volver a calcularse. Solo deben revisarse con el material original y recalcularse los registros que cumplan alguna de las condiciones indicadas en “¿Qué registros pueden verse afectados?”.

### Autoguardado y datos de entrada

- Abrir los datos de ejemplo ya no sobrescribe un autoguardado existente.
- La última edición se guarda aunque la pantalla se cierre o se pase a otra página inmediatamente después de editar.
- Los datos de autoguardado dañados estructuralmente o excesivamente grandes se rechazan en lugar de restaurarse como registros válidos.
- Los códigos Z no permitidos y las puntuaciones Z que no corresponden a la lámina seleccionada se bloquean antes del cálculo.
- Los nombres de archivo CSV usan la fecha local del dispositivo. Los archivos exportados pueden abrirse con mayor seguridad en una hoja de cálculo, mientras los valores clínicamente válidos y los códigos de puntuación conservan su valor original.

### S-CON y documentos de referencia

El documento de referencia de S-CON en los cinco idiomas incluye ahora los 12 criterios y el límite de decisión de `8 o más`. Como antes, la calculadora cuenta los 12 criterios, marca el resultado con 8 o más y muestra el aviso de que S-CON se aplica a personas evaluadas de 15 años o más. No se añadió un campo de edad; el profesional clínico sigue siendo responsable de decidir si se cumple la condición de edad.

Cuando una pregunta sobre S-CON no incluye la edad, el asistente de interpretación informa primero del número de criterios cumplidos y solicita la edad exacta. No debe declarar S-CON positivo o negativo ni generar una redacción lista para el informe sin esa información.

### Asistentes de IA y privacidad de la retroalimentación

- Cuando las solicitudes de conexión o conversación con IA se repiten en exceso, la aplicación pide esperar un momento.
- Durante toda la conversación, el asistente no responde a solicitudes de información no pública y ofrece orientación de ayuda urgente ante expresiones relacionadas con crisis.
- La evaluación de respuestas de IA no guarda el texto de la conversación ni direcciones IP y se conserva durante un máximo de 180 días.

## ¿Qué registros pueden verse afectados?

Los resultados existentes del Sumario Estructural no necesitan volver a calcularse salvo que se cumpla una de estas condiciones:

1. El mismo código de Contenido se introdujo más de una vez en una sola respuesta.
2. Las interfaces de escritorio y móvil guardaron valores distintos de Special Scores Level 1 y Level 2.
3. Un código Z no admitido o una puntuación Z que no corresponde a la lámina permanece en datos importados o en un autoguardado anterior.
4. Un registro introducido en la interfaz móvil contiene únicamente determinantes sin forma, como `C`, `C'`, `T`, `V`, `Y` o `Cn`, pero [FQ] se guardó con un valor distinto de `none`.

Los registros afectados deben revisarse con el material original, corregirse el código duplicado o no válido y volver a calcularse. La aplicación no sustituye el juicio de codificación del profesional.

## Interfaz, privacidad y alcance del cálculo

- No se añadió una pantalla nueva ni un campo de edad.
- Un código de Contenido ya elegido queda desactivado en las demás casillas, y los datos guardados no válidos reciben una explicación en los cinco idiomas.
- Las pestañas no seleccionadas de los resultados del Sumario Estructural ahora tienen un borde tenue, lo que facilita distinguirlas de la pestaña actual. En las tarjetas S-CON, DEPI, CDI y HVI, la casilla de resumen y su primera línea de texto quedan centradas verticalmente.
- No se modificaron las fórmulas ni las secciones de resultados del Sumario Estructural.
- Los datos de codificación autoguardados permanecen únicamente en el dispositivo. La clave API se usa cifrada para una conexión de IA durante un máximo de 24 horas y se elimina al finalizar la conexión.
- La retroalimentación registra únicamente motivos predefinidos y datos agregados, no el texto de la conversación ni direcciones IP sin transformar.

## Consideraciones clínicas

Los criterios existentes se aplican cuando se repite un mismo Special Score sin distinción entre Level 1 y Level 2 y al determinar FQ para determinantes sin forma. Los conflictos entre Level 1 y Level 2 se tratan de la misma manera en la versión de escritorio y la móvil.

El asistente de IA no garantiza la exactitud de todas las preguntas clínicas; la interpretación final y la decisión sobre la edad de aplicación de S-CON corresponden al profesional clínico.
