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
- Las 5604 representaciones vectoriales de OpenAI coincidieron con el texto actual, con 0 elementos obsoletos y 0 discrepancias de hash.
- Las pruebas reales con GPT-5.5 abarcaron 62 conversaciones de un turno, 9 conversaciones de varios turnos y 4 solicitudes por la ruta API de la aplicación. En la primera ejecución, 1 pregunta sobre S-CON sin información de edad no superó la comprobación de límites de la respuesta. Tras reforzar ese límite, se repitieron 2 preguntas relacionadas en coreano, incluida la que había fallado, y ambas superaron la comprobación.
- OpenAI Codex y Claude Opus 5 realizaron por separado llamadas de pago a GPT-5.5. El entorno de auditoría de Claude comprobó 25 escenarios en cinco idiomas y luego llamó 3 veces más al caso japonés del par de niveles de Special Score, que no había superado una comprobación de contrato en una ocasión. Las 3 llamadas adicionales pasaron: 27 aprobadas y 1 no aprobada de un total de 28. Codex añadió una prueba de regresión que admite una prohibición correcta en japonés aunque repita las palabras de la pregunta y llamó 11 veces más al mismo caso; las 11 pasaron. La ejecución adicional de Codex terminó en 11 llamadas al agotarse el tiempo de la herramienta local, pero ninguna de las 11 respuestas completadas por el proveedor fue interrumpida.
- El único resultado no aprobado no pudo reproducirse como un error de las fórmulas o de las reglas de entrada. Como no se conservó el texto de esa respuesta, tampoco se afirmó una causa concreta de falso positivo. Las llamadas de Claude costaron `$0.874310` y las de seguimiento de Codex `$0.351305`. Ni las claves API ni el texto de las respuestas se incluyeron en el registro público.
- Las 4 migraciones de la base de datos de retroalimentación y las 30 migraciones de la base RAG se reprodujeron desde el principio en una base pgvector vacía.
- La compilación de producción generó 222 páginas. Después se abrieron directamente las pantallas de escritorio y móvil, sin errores en la consola del navegador.

Las llamadas reales de IA son pruebas muestrales de límites de respuesta representativos. No garantizan la exactitud de todas las preguntas clínicas. La interpretación final y la decisión sobre la edad de aplicación corresponden al profesional clínico.

## UI/UX, privacidad y alcance del cálculo

- No se añadió una pantalla nueva ni un campo de edad.
- Un código de Contenido ya elegido queda desactivado en las demás casillas, y los datos guardados no válidos reciben una explicación en los cinco idiomas.
- Las pestañas no seleccionadas de los resultados del Sumario Estructural ahora tienen un borde tenue, lo que facilita distinguirlas de la pestaña actual. En las tarjetas S-CON, DEPI, CDI y HVI, la casilla de resumen y su primera línea de texto quedan centradas verticalmente.
- No se modificaron las fórmulas ni las secciones de resultados del Sumario Estructural.
- Los datos de codificación y las claves API de OpenAI no se guardan en la base de datos del servidor.
- La base de retroalimentación guarda únicamente códigos de motivos predefinidos y datos agregados, no el texto de la conversación ni direcciones IP sin transformar.

## Decisiones que se mantienen sin cambios

En esta versión solo se modificaron los puntos con respaldo suficientemente establecido. No se modificó el tratamiento de un mismo Special Score repetido que no tenga distinción entre Level 1 y Level 2. Tampoco se estableció una nueva regla clínica para asignar FQ a determinantes sin forma; el comportamiento de normalización ya usado en la interfaz de escritorio se aplicó a la interfaz móvil únicamente para eliminar la diferencia entre ambas. Los puntos que aún requieren fuentes adicionales o una decisión de producto se revisarán cuando exista evidencia suficiente.

## Corrección documental posterior del 2026-08-01

La fecha de archivo de v1.0.2 aparecía después de la correspondiente a la versión siguiente, v1.0.3. Ambas versiones quedan registradas con la misma fecha del huso Asia/Seoul, 2025-10-18, y en las listas de esa fecha v1.0.3 aparece antes que v1.0.2.

Los recuentos técnicos exactos de cuatro cifras de los documentos públicos en cinco idiomas se escriben ahora sin separador de millares, por ejemplo `5604`, `1015`, `5589` y `2000`. Así se evita que una coma se interprete como separador decimal en español o portugués.

Esta corrección posterior modifica únicamente la notación de fechas y cifras de la nota de v2.2.8 y del archivo público. No cambia las fórmulas, la interfaz de entrada, el contenido de los documentos de referencia ni el comportamiento de la IA. No es necesario volver a calcular resultados anteriores.

## Alcance público y límite de seguridad

El código público incluye la validación de entradas, la recuperación del autoguardado, las pruebas de los límites de S-CON y OBS, los documentos de referencia en cinco idiomas, las herramientas de evaluación de respuestas de IA y resultados reproducibles.

El script de limpieza del espejo público ahora respeta `DryRun` y muestra las operaciones previstas sin eliminar archivos.

Se excluyen las variables del entorno de producción, las claves API, los datos de codificación y conversaciones reales, las direcciones IP sin transformar, las fuentes no públicas, las rutas locales y los registros internos de trabajo.

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
