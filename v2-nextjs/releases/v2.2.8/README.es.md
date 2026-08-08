# [2026-07-31] v2.2.8 corrección de errores

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## Cambios principales

### Resumen

Esta versión corrige un problema por el que un mismo código de Contenido introducido dos veces en una respuesta se contabilizaba dos veces. Por ejemplo, introducir `Bt` en dos casillas podía aumentar indebidamente el numerador del Índice de Aislamiento y, en un protocolo limítrofe, modificar incluso el resultado del CDI. Un código de Contenido ya seleccionado no puede volver a elegirse en otra casilla de la misma respuesta. Si un duplicado permanece en un autoguardado anterior, la aplicación conserva los datos originales, detiene el cálculo e indica la fila que debe revisarse.

También se unificaron las reglas de normalización que se mantenían por separado para la tabla de escritorio y las tarjetas móviles. Cuando Level 1 y Level 2 están presentes a la vez en las familias `DV`, `DR`, `INCOM` o `FABCOM`, se conserva el código que acaba de seleccionarse en la pantalla y se elimina el código anterior que entra en conflicto. Si ambos niveles ya están presentes en datos guardados anteriormente, se conserva Level 1 para mantener el comportamiento previo de la interfaz de escritorio. El profesional clínico debe decidir cuál es el nivel correcto a partir del material original. No se guarda un Special Score vacío en la casilla eliminada, y la misma entrada produce ahora el mismo resultado en ambas pantallas.

Esta versión no modifica las fórmulas del Sumario Estructural. Los protocolos existentes introducidos conforme a las reglas no necesitan volver a calcularse. Solo deben revisarse con el material original y recalcularse los registros que cumplan alguna de las condiciones indicadas en “¿Qué registros pueden verse afectados?”.

### Autoguardado y datos de entrada

- Abrir los datos de ejemplo ya no sobrescribe un autoguardado existente.
- La última edición se guarda aunque la pantalla se cierre o se pase a otra página inmediatamente después de editar.
- Los datos de autoguardado dañados estructuralmente o excesivamente grandes se rechazan en lugar de restaurarse como registros válidos.
- Los códigos Z no permitidos y las puntuaciones Z que no corresponden a la lámina seleccionada se bloquean antes del cálculo.
- Los nombres de archivo CSV usan la fecha local del dispositivo. Al exportar, solo se protegen las cadenas que una hoja de cálculo podría ejecutar como fórmulas; los valores positivos y negativos clínicamente válidos y los signos de codificación aislados conservan su valor original. Las celdas con comas, comillas o saltos de línea CR y LF se entrecomillan conforme a las reglas CSV.

### S-CON y documentos de referencia

El documento de referencia de S-CON en los cinco idiomas incluye ahora los 12 criterios y el límite de decisión de `8 o más`. Como antes, la calculadora cuenta los 12 criterios, marca el resultado con 8 o más y muestra el aviso de que S-CON se aplica a personas evaluadas de 15 años o más. No se añadió un campo de edad; el profesional clínico sigue siendo responsable de decidir si se cumple la condición de edad.

Cuando una pregunta sobre S-CON no incluye la edad, el asistente de interpretación informa primero del número de criterios cumplidos y solicita la edad exacta. No debe declarar S-CON positivo o negativo ni generar una redacción lista para el informe sin esa información.

### Seguridad de la sesión de IA y de la retroalimentación

- La creación de sesiones con clave API y las solicitudes de chat tienen límites más difíciles de eludir mediante la rotación de cookies.
- Los cuerpos JSON `null`, los arreglos y otros valores que no son objetos válidos se tratan como solicitudes incorrectas en lugar de errores del servidor.
- La detección de inyección de instrucciones y de expresiones de crisis también revisa el contexto de conversación heredado.
- Una configuración incorrecta del secreto de cifrado de cookies detiene la creación de la sesión en lugar de ocultar el error.
- La evaluación de respuestas de IA sigue sin guardar el texto de la conversación ni direcciones IP sin transformar. Las fechas se unificaron en UTC y se mantiene la conservación durante 180 días.

## ¿Qué registros pueden verse afectados?

Los resultados existentes del Sumario Estructural no necesitan volver a calcularse salvo que se cumpla una de estas condiciones:

1. El mismo código de Contenido se introdujo más de una vez en una sola respuesta.
2. Las interfaces de escritorio y móvil guardaron resultados distintos para la normalización de Special Scores Level 1 y Level 2.
3. Un código Z no admitido o una puntuación Z que no corresponde a la lámina permanece en datos importados o en un autoguardado anterior.
4. Un registro introducido en la interfaz móvil contiene únicamente determinantes sin forma, como `C`, `C'`, `T`, `V`, `Y` o `Cn`, pero [FQ] se guardó con un valor distinto de `none`.

Los registros afectados deben revisarse con el material original, corregirse el código duplicado o no válido y volver a calcularse. La aplicación no sustituye el juicio de codificación del profesional.

## Pruebas y verificación

- Se añadieron casos fijos que confirman que S-CON es `Positive` con exactamente 8 criterios y `NO` con 7.
- Un caso independiente de OBS confirma la rama real de la regla final.
- Se reprodujeron por separado los códigos de Contenido duplicados, el conflicto entre Level 1 y Level 2, los Special Scores vacíos, los códigos Z no válidos, los autoguardados dañados, el acceso bloqueado al almacenamiento del navegador y los cuerpos JSON BYOK no válidos.
- La batería automática completa superó 587 comprobaciones en 95 archivos de prueba; se omitieron 7 que no disponían de las condiciones de ejecución necesarias.
- Se confirmó que los 203 documentos de referencia de cada uno de los cinco idiomas estaban disponibles para la búsqueda.
- Los datos de búsqueda de referencias de los cinco idiomas coincidían con los documentos actuales, sin elementos obsoletos.
- Se comprobaron con preguntas representativas los límites de codificación e interpretación y la finalización de las respuestas. En la primera revisión se detectó un problema en el límite de respuesta de una pregunta sobre S-CON sin información de edad; se reforzó el límite y se volvieron a comprobar las preguntas relacionadas.
- Una respuesta japonesa sobre el par de niveles de Special Score no cumplió el criterio, pero el resultado no se reprodujo como un error de las fórmulas o de las reglas de entrada. Tras ajustar el criterio, todas las comprobaciones relacionadas pasaron.
- Las bases de datos de retroalimentación y de búsqueda de referencias se reconstruyeron desde esquemas vacíos y se comprobaron.
- La compilación de producción generó 222 páginas. Después se abrieron directamente las pantallas de escritorio y móvil, sin errores en la consola del navegador.

Las comprobaciones de respuestas son pruebas muestrales de límites representativos. No garantizan la exactitud de todas las preguntas clínicas. La interpretación final y la decisión sobre la edad de aplicación corresponden al profesional clínico.

## UI/UX, privacidad y alcance del cálculo

- No se añadió una pantalla nueva ni un campo de edad.
- Un código de Contenido ya elegido queda desactivado en las demás casillas, y los datos guardados no válidos reciben una explicación en los cinco idiomas.
- Las pestañas no seleccionadas de los resultados del Sumario Estructural ahora tienen un borde tenue, lo que facilita distinguirlas de la pestaña actual. En las tarjetas S-CON, DEPI, CDI y HVI, la casilla de resumen y su primera línea de texto quedan centradas verticalmente.
- No se modificaron las fórmulas ni las secciones de resultados del Sumario Estructural.
- Los datos de codificación y las claves API de OpenAI no se guardan en la base de datos del servidor.
- La base de retroalimentación guarda únicamente códigos de motivos predefinidos y datos agregados, no el texto de la conversación ni direcciones IP sin transformar.

## Decisiones que se mantienen sin cambios

En esta versión solo se modificaron los puntos con respaldo suficientemente establecido. No se modificó el tratamiento de un mismo Special Score repetido que no tenga distinción entre Level 1 y Level 2. Tampoco se estableció una nueva regla clínica para asignar FQ a determinantes sin forma; el comportamiento de normalización ya usado en la interfaz de escritorio se aplicó a la interfaz móvil únicamente para eliminar la diferencia entre ambas. Los puntos que aún requieren fuentes adicionales o una decisión de producto se revisarán cuando exista evidencia suficiente.

## Apéndice técnico

<details>
<summary><strong>Comandos para repetir las comprobaciones</strong></summary>

```bash
npm test
npm run lint
npm run build
npm run security:check
npm run docs:evaluate-rag:all
npm run docs:evaluate-hybrid:openai -- --enforce
npm run docs:assert-vector-runtime-ready
npm run feedback:db:verify-fresh-replay
npm run db:verify-fresh-replay
```

Las auditorías de dependencias de producción y desarrollo informaron 0 vulnerabilidades conocidas.

</details>
