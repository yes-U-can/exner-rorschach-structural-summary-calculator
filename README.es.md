# Calculadora del Sumario Estructural del Sistema Comprehensivo de Rorschach de Exner

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

Este es el archivo público de código fuente y versiones de la `Calculadora del Sumario Estructural del Sistema Comprehensivo de Rorschach de Exner`. Los asistentes de IA basados en los documentos de referencia se ofrecen como funciones opcionales.

Este repositorio publica las notas de las versiones distribuidas y su código fuente. v1 se conserva como aplicación web de Google Apps Script y v2 como la aplicación web actual de la versión 2.

MOW se encarga de la planificación, el desarrollo, la distribución, la operación y el mantenimiento de la aplicación. El Seoul Institute of Clinical Psychology (SICP) contribuye a comprobar los resultados de cálculo iniciales y a revisar la aplicación desde la perspectiva del uso clínico real.

Los agradecimientos y los materiales consultados durante el aprendizaje inicial se recogen en [ACKNOWLEDGEMENTS.md](./ACKNOWLEDGEMENTS.es.md).

## Documentación e idiomas

Cada nota de versión explica los cambios, las condiciones que podrían verse afectadas, si es necesario volver a calcular resultados existentes y las fuentes de cálculo.

- Las guías públicas y notas de versión cuentan con versiones en [English](./README.en.md), [日本語](./README.ja.md), [Español](./README.es.md) y [Português (Brasil)](./README.pt-BR.md).
- La interfaz de la aplicación está disponible en 5 idiomas: coreano, inglés, japonés, español y portugués.

## Contenido publicado

- [v2] Aplicación web: [exner.yesucan.co.kr](https://exner.yesucan.co.kr)
- [v2] Versión 2 más reciente: [v2-nextjs/releases/v2.2.10](./v2-nextjs/releases/v2.2.10/README.es.md)
- [v2] Fuentes de cálculo y alcance bibliográfico de v2.2.10: [fuentes de cálculo y alcance bibliográfico](./v2-nextjs/methodology/reference-audit-v2.2.10/README.es.md)
- [v2] Historial de versiones 2: [v2-nextjs/releases](./v2-nextjs/releases/)
- [v2] Código fuente público de la versión 2: [v2-nextjs/source](./v2-nextjs/source/)
- [Google Apps Script] Historial de versiones 1: [v1-gas/releases](./v1-gas/releases/)
- Última versión ejecutable de v1: [despliegue v1.4.1](https://script.google.com/macros/s/AKfycbxMCx13pkrSzFs8f2qXfmxy2LRhkBpZTItFTIfEOoOi-zwurbysnKGfDIYtAeEdQP99/exec)
- Último código fuente de v1: [v1-gas/current](./v1-gas/current/)

## v2.2.10

v2.2.10 repone la proporción `GHR:PHR` ausente en la Lower Section de la pantalla y del PDF según la disposición original del Sumario Estructural. También organiza las tablas ordinarias de la Lower Section en el PDF y la presentación de las decisiones de los Special Indices. GHR y PHR ya se clasificaban y sumaban, por lo que no es necesario volver a calcular protocolos existentes.

Los cálculos siguen las páginas impresas del Volume 1, 4.ª edición, y del Workbook, 5.ª edición, del Sistema Comprehensivo de Exner. Las reglas de R-PAS y de otros sistemas de Rorschach no se mezclan con los cálculos del Sistema Comprehensivo de Exner. La v2.2.10 no cambia ninguna fórmula ni criterio de decisión.

Los documentos Interpersonal en cinco idiomas ahora explican `GHR:PHR`. Los asistentes de IA también responden únicamente dentro del Sistema Comprehensivo de Exner. Las obras, ediciones, páginas impresas, función de cada material y limitaciones pendientes se recogen en la [nota de v2.2.10](./v2-nextjs/releases/v2.2.10/README.es.md) y en [fuentes de cálculo y alcance bibliográfico](./v2-nextjs/methodology/reference-audit-v2.2.10/README.es.md).

## v2.2.9

v2.2.9 es una corrección de errores que permite alternar entre el orden ascendente y descendente con el botón [Card] y abre el Asistente de Interpretación previsto cuando se inicia una sesión de IA durante ese acceso. En el Asistente de Interpretación, cuando se está leyendo por encima del mensaje más reciente, el botón muestra tres puntos o una flecha hacia abajo según el estado de la respuesta de la IA. Al seleccionar una valoración útil o no útil, el fondo del botón no cambia; solo el pulgar pasa a ser un icono sólido con el azul de la aplicación. La valoración puede guardarse sin indicar un motivo y se elimina al volver a seleccionar la misma opción.

Las fórmulas del Sumario Estructural y las reglas de respuesta de la IA no cambiaron, por lo que no es necesario volver a calcular protocolos existentes. Consulte la [nota de v2.2.9](./v2-nextjs/releases/v2.2.9/README.es.md) para obtener más información.

## v2.2.8

v2.2.8 es una corrección de errores que impide que el mismo código de Contenido se contabilice dos veces en una respuesta y hace que las interfaces de escritorio y móvil traten los códigos de la misma manera. Los datos de ejemplo ya no sobrescriben un autoguardado existente, la última edición se guarda y los datos de autoguardado dañados no se restauran.

Las fórmulas del Sumario Estructural no cambiaron. Los protocolos existentes introducidos conforme a las reglas no necesitan volver a calcularse. Deben revisarse con el material original y recalcularse solo los registros que contengan un código de Contenido duplicado en una respuesta; que hayan guardado valores distintos entre las interfaces de escritorio y móvil para los Special Scores Level 1 y Level 2; que hayan guardado en la interfaz móvil únicamente determinantes sin forma (`C`, `C'`, `T`, `V`, `Y` o `Cn`) con un valor de [FQ] distinto de `none`; o que conserven un código Z no admitido o una puntuación Z que no corresponda a la lámina. Los documentos de S-CON y las reglas de respuesta de IA incluyen ahora los 12 criterios y el límite de 8 criterios en los cinco idiomas; no se añadió un campo de edad. Consulte la [nota de v2.2.8](./v2-nextjs/releases/v2.2.8/README.es.md) para obtener más información.

## v2.2.7

v2.2.7 impide que tres tipos de entradas incompletas de la tabla de codificación pasen al cálculo. Se eliminó la `S` aislada de las opciones de localización para que las respuestas de espacio en blanco se registren siempre como `WS`, `DS` o `DdS`; ya no es posible introducir el mismo determinante ni códigos duplicados de la misma familia de movimiento en una respuesta, ni calcular con la calidad formal en blanco. En los registros en los que todas las respuestas son de forma pura (`F`), Lambda se informa como el número de respuestas de F pura en lugar del símbolo de infinito.

Los protocolos existentes introducidos según las reglas no necesitan volver a calcularse. Si esos valores permanecen en datos antiguos guardados automáticamente, la aplicación conserva el original, detiene el cálculo e indica en cinco idiomas las filas que deben revisarse. Consulte la [nota del parche v2.2.7](./v2-nextjs/releases/v2.2.7/README.es.md) para obtener más información.

## v2.2.6

v2.2.6 hace que cada página muestre el título y la descripción correctos para su idioma en los resultados de búsqueda y en los enlaces compartidos. Los marcadores y enlaces externos existentes siguen funcionando.

También corrige un problema de algunos navegadores en Windows por el que `Alt+rueda del ratón` desplazaba la pantalla de codificación en lugar de ampliarla. Los nombres de los campos en las explicaciones de los encabezados de la tabla utilizan ahora corchetes de forma coherente. Las fórmulas y los resultados del Sumario Estructural, los datos de codificación, la disposición de la pantalla, la búsqueda de referencias y las respuestas de IA no cambian, por lo que no es necesario volver a calcular los protocolos existentes. Consulte la [nota del parche v2.2.6](./v2-nextjs/releases/v2.2.6/README.es.md) para obtener más información.

## v2.2.5

A partir de v2.2.5, la tabla de codificación deja de ofrecer `M`, `FM` y `m` sin sufijo activo o pasivo; en su lugar se utilizan códigos completos como `Ma`, `Mp` y `Ma-p`. Los totales `M`, `FM` y `m` del Sumario Estructural y los cálculos de EB, MQual y W:M no cambian.

Los protocolos existentes que ya usan códigos completos no necesitan volver a calcularse. Si un guardado automático antiguo contiene un código de movimiento sin sufijo activo o pasivo, la aplicación conserva la entrada original, detiene el cálculo e indica la fila y el código que requieren revisión. Los documentos de referencia y los asistentes de IA en cinco idiomas explican el mismo límite de entrada. La [nota del parche v2.2.5](./v2-nextjs/releases/v2.2.5/README.es.md) explica las condiciones afectadas y el ejemplo hipotético en el límite del CDI.

## v2.2.4

v2.2.4 mejora los documentos de referencia y el comportamiento de búsqueda y seguridad de los asistentes de IA opcionales, sin cambiar las fórmulas del Sumario Estructural ni la entrada de la tabla de codificación. No es necesario volver a calcular resultados existentes.

Los documentos de referencia usan la terminología profesional de cada idioma, y sus títulos y orden siguen el flujo de codificación e interpretación. Los asistentes de codificación e interpretación no responden preguntas fuera de Exner CS ni solicitudes de información no pública, y piden esperar cuando las solicitudes se repiten en exceso. La [nota del parche v2.2.4](./v2-nextjs/releases/v2.2.4/) contiene los detalles.

También se mejoraron el diálogo para elegir cómo iniciar la codificación, la legibilidad de los documentos de referencia y el control de desplazamiento del asistente de codificación.

## v2.2.3

v2.2.3 mejora la información de búsqueda y vista previa en cinco idiomas y la protección frente a solicitudes excesivas de valoración de respuestas de IA, sin cambiar las fórmulas ni la disposición de la pantalla. No es necesario volver a calcular resultados existentes.

El título utilizado en búsquedas y vistas compartidas es `Yes, U Can!` en todos los idiomas. La descripción traducida indica que la calculadora de Sumario Estructural del Sistema Comprehensivo de Rorschach de Exner es de código abierto, no exige registro, instalación ni pago y no sustituye el juicio clínico profesional. La valoración positiva o negativa no guarda el texto de la conversación y rechaza envíos excesivamente grandes o frecuentes. La [nota del parche v2.2.3](./v2-nextjs/releases/v2.2.3/) explica los cambios y la privacidad.

## v2.2.2

v2.2.2 corrige el límite entre los cálculos que incluyen Cn y los que lo excluyen. En la etiqueta convencional `FC:CF+C`, el valor derecho es `CF+C+Cn`, mientras que esta aplicación excluye Cn de WSumC, del criterio 7 de S-CON y de los cálculos Color-Shading. **El valor mostrado de Cn para protocolos completos ya era correcto en v2.2.1, por lo que esta cuestión por sí sola no exige volver a calcularlos.** También se impidió que una fila incompleta con Calidad Formal (FQ) en blanco recibiera una clasificación provisional GHR o PHR.

Cada índice sigue su definición en el Sistema Comprehensivo de Exner; la notación y el comportamiento de otros programas o sistemas no se mezclan con el cálculo. La barra lateral izquierda ahora es completamente opaca.

## v2.2.1

v2.2.1 corrigió los cálculos de **Upper Section, Lower Section y Special Indices** que muestra la aplicación, sin cambiar la pantalla ni añadir campos de entrada. Se corrigieron los valores extremos de D/AdjD, las condiciones de visualización de EBPer, el orden de las reglas GHR/PHR, los denominadores iguales a 0 de WDA% y Afr, y la inclusión de Cn en el valor derecho de `FC:CF+C`.

Los límites de cálculo siguen las reglas del Sistema Comprehensivo de Exner y ejemplos completos del Sumario Estructural.

## v2.2.0

v2.2.0 es la primera versión v2.2.x que reúne la navegación principal de escritorio en una barra lateral izquierda y presenta el asistente de interpretación como una conversación de IA convencional. También ordenó la detención de respuestas, la copia y valoración de mensajes, el desplazamiento del área de conversación, los documentos de referencia, el archivo de versiones y el zoom y desplazamiento de la tabla de codificación.

Los asistentes de IA se limitaron al Sistema Comprehensivo de Exner. Las correcciones de D/AdjD, EBPer, GHR/PHR y los límites de Cn publicadas en v2.2.1 y v2.2.2 están incluidas en la versión actual.

## [v2] Historial de versiones 2

- **[2026-08-08] v2.2.10 (corrección de errores)** [Nota del parche](./v2-nextjs/releases/v2.2.10/README.es.md) [Código fuente](./v2-nextjs/source/)
- **[2026-08-01] v2.2.9 (corrección de errores)** [Nota del parche](./v2-nextjs/releases/v2.2.9/README.es.md) [Código fuente](./v2-nextjs/source/)
- **[2026-07-31] v2.2.8 (corrección de errores)** [Nota del parche](./v2-nextjs/releases/v2.2.8/README.es.md) [Código fuente](./v2-nextjs/source/)
- **[2026-07-23] v2.2.7 (corrección de errores)** [Nota del parche](./v2-nextjs/releases/v2.2.7/README.es.md) [Código fuente](./v2-nextjs/source/)
- **[2026-07-20] v2.2.6 (corrección de errores)** [Nota del parche](./v2-nextjs/releases/v2.2.6/README.es.md) [Código fuente](./v2-nextjs/source/)
- **[2026-07-19] v2.2.5 (corrección de errores)** [Nota del parche](./v2-nextjs/releases/v2.2.5/README.es.md) [Código fuente](./v2-nextjs/source/)
- **[2026-07-18] v2.2.4 (corrección de errores)** [Nota del parche](./v2-nextjs/releases/v2.2.4/) [Código fuente](./v2-nextjs/source/)
- **[2026-07-17] v2.2.3 (corrección de errores)** [Nota del parche](./v2-nextjs/releases/v2.2.3/) [Código fuente](./v2-nextjs/source/)
- **[2026-07-16] v2.2.2 (hotfix)** [Nota del parche](./v2-nextjs/releases/v2.2.2/) [Código fuente](./v2-nextjs/source/)
- **[2026-07-15] v2.2.1 (hotfix)** [Nota del parche](./v2-nextjs/releases/v2.2.1/) [Código fuente](./v2-nextjs/source/)
- **[2026-07-14] v2.2.0 (versión menor)** [Nota del parche](./v2-nextjs/releases/v2.2.0/) [Código fuente](./v2-nextjs/source/)
- **[2026-07-13] v2.1.10 (corrección de errores)** [Nota del parche](./v2-nextjs/releases/v2.1.10/) [Código fuente](./v2-nextjs/source/)
- **[2026-07-12] v2.1.9 (corrección de errores)** [Nota del parche](./v2-nextjs/releases/v2.1.9/) [Código fuente](./v2-nextjs/source/)
- **[2026-07-11] v2.1.8 (corrección de errores)** [Nota del parche](./v2-nextjs/releases/v2.1.8/) [Código fuente](./v2-nextjs/source/)
- **[2026-07-05] v2.1.7 (corrección de errores)** [Nota del parche](./v2-nextjs/releases/v2.1.7/) [Código fuente](./v2-nextjs/source/)
- **[2026-07-04] v2.1.6 (corrección de errores)** [Nota del parche](./v2-nextjs/releases/v2.1.6/) [Código fuente](./v2-nextjs/source/)
- **[2026-07-03] v2.1.5 (corrección de errores)** [Nota del parche](./v2-nextjs/releases/v2.1.5/) [Código fuente](./v2-nextjs/source/)
- **[2026-07-02] v2.1.4 (corrección de errores)** [Nota del parche](./v2-nextjs/releases/v2.1.4/) [Código fuente](./v2-nextjs/source/)
- **[2026-06-29] v2.1.3 (corrección de errores)** [Nota del parche](./v2-nextjs/releases/v2.1.3/) [Código fuente](./v2-nextjs/source/)
- **[2026-06-28] v2.1.2 (corrección de errores)** [Nota del parche](./v2-nextjs/releases/v2.1.2/) [Código fuente](./v2-nextjs/source/)
- **[2026-06-27] v2.1.1 (corrección de errores)** [Nota del parche](./v2-nextjs/releases/v2.1.1/) [Código fuente](./v2-nextjs/source/)
- **[2026-06-22] v2.1.0 (versión menor)** [Nota del parche](./v2-nextjs/releases/v2.1.0/) [Código fuente](./v2-nextjs/source/)
- **[2026-06-11] v2.0.3 (corrección de errores)** [Nota del parche](./v2-nextjs/releases/v2.0.3/) [Código fuente](./v2-nextjs/source/)
- **[2026-05-21] v2.0.2 (corrección de errores)** [Nota del parche](./v2-nextjs/releases/v2.0.2/) [Código fuente](./v2-nextjs/source/)
- **[2026-04-27] v2.0.1 (corrección de errores)** [Nota del parche](./v2-nextjs/releases/v2.0.1/) [Código fuente](./v2-nextjs/source/)
- **[2026-02-15] v2.0.0 (versión mayor)** [Nota del parche](./v2-nextjs/releases/v2.0.0/) [Código fuente](./v2-nextjs/source/)

## Cómo usar el archivo v1 GAS

1. Abra el enlace de `nota del parche/código fuente` de la versión deseada.
2. En la carpeta `source/`, revise `Code.gs`, `index.html` y `styles.html`.
3. Cree un proyecto de Google Apps Script, añada archivos con los mismos nombres y pegue el contenido.
4. Despliéguelo como aplicación web GAS o abra el `enlace de despliegue` de la versión para ejecutarla directamente.

## [Google Apps Script] Historial de versiones 1

- **[2026-01-07] v1.4.1 (corrección de errores)** [Despliegue](https://script.google.com/macros/s/AKfycbxMCx13pkrSzFs8f2qXfmxy2LRhkBpZTItFTIfEOoOi-zwurbysnKGfDIYtAeEdQP99/exec) [Nota del parche/código fuente](./v1-gas/releases/v1.4.1/)
- **[2026-01-03] v1.4.0 (versión menor)** [Despliegue](https://script.google.com/macros/s/AKfycbxWtI1q27rXuH4feBEGpoy0fIhXZU0ROJ2gRv5RbaQVPxnNgznTI9czHDrVzaS7wSMM/exec) [Nota del parche/código fuente](./v1-gas/releases/v1.4.0/)
- **[2025-12-24] v1.3.3 (corrección de errores)** [Despliegue](https://script.google.com/macros/s/AKfycbyMG31uNG0mPIdyrzQ_86CSuSaACpFoOqy-kZGXk0uV7L92jBFAJijt1kV6nLMzcO2N/exec) [Nota del parche/código fuente](./v1-gas/releases/v1.3.3/)
- **[2025-11-27] v1.3.2 (corrección de errores)** [Despliegue](https://script.google.com/macros/s/AKfycbxbuGLdEaj0mW6eIB5QHTax86b9FcKrsfLogy0wDLauJPwbbkQC5BHey0j_ERqXtVqE/exec) [Nota del parche/código fuente](./v1-gas/releases/v1.3.2/)
- **[2025-11-26] v1.3.1 (corrección de errores)** [Despliegue](https://script.google.com/macros/s/AKfycbwOQ61Y34-iVRKB0T3isOVRzFP9xhxtQMrLZoRvVbS6PwSfEaFYzWvjuTF8IItY2p-T/exec) [Nota del parche/código fuente](./v1-gas/releases/v1.3.1/) [Vídeo de uso](https://youtu.be/GH145Wwh-YA)
- **[2025-11-25] v1.3.0 (versión menor)** [Despliegue](https://script.google.com/macros/s/AKfycbyethWbTOltcalcWo-kyXtunNSoJNMyKdKs_y7AYfV6bPE2R09ONcaCtDHSTvXTukE/exec) [Nota del parche/código fuente](./v1-gas/releases/v1.3.0/)
- **[2025-11-21] v1.2.1 (corrección de errores)** [Despliegue](https://script.google.com/macros/s/AKfycbw6n2R3LgAncLvoXmin89SodbHB6brREdaxFfK2yHADdZelEskafqLH35xL0LFvSqMv/exec) [Nota del parche/código fuente](./v1-gas/releases/v1.2.1/)
- **[2025-11-20] v1.2.0 (versión menor)** [Despliegue](https://script.google.com/macros/s/AKfycbwD7zBLaAzC5r4VjH1yt7gxfG98vvBp4gsaC3VFQW0bCwe6MNfVXmR8LIjUEpIkTZTE/exec) [Nota del parche/código fuente](./v1-gas/releases/v1.2.0/)
- **[2025-10-25] v1.1.2 (corrección de errores)** [Despliegue](https://script.google.com/macros/s/AKfycbxn8zeFQalOvh-jnZ_-REjafG2kCT1RkjyJvUahtCkXVyn6PJs9xJLZ0basm5kKEO4j2A/exec) [Nota del parche/código fuente](./v1-gas/releases/v1.1.2/)
- **[2025-10-24] v1.1.1 (corrección de errores)** [Despliegue](https://script.google.com/macros/s/AKfycbw6XZZ7D3qiCeSsJPG6aj3DzMMPdA2p0kWhT8WU21WGVFqUltOmAXs3zOx4kXw2u5ul6Q/exec) [Nota del parche/código fuente](./v1-gas/releases/v1.1.1/)
- **[2025-10-23] v1.1.0 (versión menor)** [Despliegue](https://script.google.com/macros/s/AKfycbw2J6gd4Sf_Tjx6s9GdQrWu4b_tOtqwFLtKJCs-vSFRR0c4NZ0Mlb5UFm7-V9zkBPzitg/exec) [Nota del parche/código fuente](./v1-gas/releases/v1.1.0/)
- **[2025-10-20] v1.0.4 (hotfix)** [Despliegue](https://script.google.com/macros/s/AKfycbw1GLfIvehoz4wAzC4LicjD_oB0Dpy_sLJ30da9qobx5X4wa3nJr0pLewV0lVPPv1ptGw/exec) [Nota del parche/código fuente](./v1-gas/releases/v1.0.4/)
- **[2025-10-18] v1.0.3 (corrección de errores)** [Despliegue](https://script.google.com/macros/s/AKfycbzoiaofs_I5Ue4p7Eo5XQp0OmUtmbbqkpJuwD-FQ1R4PLscULJB_AHVBb-VylICEKJB1A/exec) [Nota del parche/código fuente](./v1-gas/releases/v1.0.3/)
- **[2025-10-18] v1.0.2 (hotfix)** [Despliegue](https://script.google.com/macros/s/AKfycbwtBFge9jPS03Mz4QD5IlUDfHOetaVGsIe48y9dZESkfWtsJ-dnYv9S5iZ_4wxx4dCOUw/exec) [Nota del parche/código fuente](./v1-gas/releases/v1.0.2/)
- **[2025-10-17] v1.0.1 (hotfix)** [Despliegue](https://script.google.com/macros/s/AKfycbwNNeJsgRx0sEnZO4X9XxEUEthQlVS3Ttk6k_OSmIj8aTPlpdBQV1653hmBtzLnVX8Q/exec) [Nota del parche/código fuente](./v1-gas/releases/v1.0.1/)
- **[2025-10-16] v1.0.0 (versión mayor)** [Despliegue](https://script.google.com/macros/s/AKfycbxYTxqKcmRNJhpE8eCGTBZPyUFVJIRQiUTbyW48lJKg2E7Bgc5RKSitdDTVcE3bzk07JA/exec) [Nota del parche/código fuente](./v1-gas/releases/v1.0.0/)
