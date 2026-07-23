# Calculadora del Sumario Estructural del Sistema Comprehensivo de Rorschach de Exner

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

Este es el archivo público de código fuente y versiones de la `Calculadora del Sumario Estructural del Sistema Comprehensivo de Rorschach de Exner`. Los asistentes de IA basados en los documentos de referencia se ofrecen como funciones opcionales.

Este repositorio publica las notas de las versiones distribuidas y su código fuente. v1 se conserva como aplicación web de Google Apps Script y v2 como aplicación web de Next.js.

MOW se encarga de la planificación, el desarrollo, la distribución, la operación y el mantenimiento de la aplicación. El Seoul Institute of Clinical Psychology (SICP) revisó el traslado inicial de la lógica de cálculo, contrastó los resultados calculados y aporta revisión clínica desde la experiencia de uso real.

Los agradecimientos y los materiales consultados durante el aprendizaje inicial se recogen en [ACKNOWLEDGEMENTS.md](./ACKNOWLEDGEMENTS.es.md).

## Documentación e idiomas

Cada nota de versión registra los cambios, las condiciones que podrían verse afectadas, si es necesario volver a calcular resultados existentes y las evidencias utilizadas para la comprobación.

- La versión coreana es la fuente canónica del contenido factual.
- Las guías públicas y notas de versión dirigidas a lectores cuentan con versiones en [English](./README.en.md), [日本語](./README.ja.md), [Español](./README.es.md) y [Português (Brasil)](./README.pt-BR.md).
- La interfaz de la aplicación está disponible en 5 idiomas: coreano, inglés, japonés, español y portugués.
- Cuando cambia la fuente canónica, una comprobación automática confirma que también se hayan actualizado los números, las fórmulas, los enlaces, las versiones y las fechas de las cuatro traducciones.
- Los identificadores que exigen exactitud, como comandos, rutas de archivo, nombres de API y modelos, se conservan en su forma original y se explican cuando es necesario.

## Contenido publicado

- [Next.js] Aplicación web: [exner.yesucan.co.kr](https://exner.yesucan.co.kr)
- [Next.js] Versión 2 más reciente: [v2-nextjs/releases/v2.2.7](./v2-nextjs/releases/v2.2.7/README.es.md)
- [Next.js] Revisión de la exactitud de cálculo en v2.2.2: [v2-nextjs/source/docs/ops/2026-07-17-v2.2.2-calculation-reaudit.md](./v2-nextjs/source/docs/ops/2026-07-17-v2.2.2-calculation-reaudit.md)
- [Next.js] Explicación de Cn en v2.2.2 y llamadas reales a GPT-5.5 en 5 idiomas: [v2-nextjs/source/docs/ai-evals/2026-07-17-v2.2.2-live-eval-report.md](./v2-nextjs/source/docs/ai-evals/2026-07-17-v2.2.2-live-eval-report.md)
- [Next.js] Validación de la interfaz de v2.2.0: [v2-nextjs/source/docs/ops/2026-07-14-v2.2.0-workspace-shell-validation.md](./v2-nextjs/source/docs/ops/2026-07-14-v2.2.0-workspace-shell-validation.md)
- [Next.js] Validación de los límites temáticos de IA en v2.2.0: [v2-nextjs/source/docs/ai-evals/2026-07-15-v2.2.0-exner-domain-boundary-report.md](./v2-nextjs/source/docs/ai-evals/2026-07-15-v2.2.0-exner-domain-boundary-report.md)
- [Next.js] Caso sobre el control de respuestas de IA en v2.1.2: [docs/case-studies/v2.1.2-ai-harness.md](./docs/case-studies/v2.1.2-ai-harness.md)
- [Next.js] Guía de evaluación de la calidad de las respuestas de IA: [v2-nextjs/source/docs/ai-evals/README.md](./v2-nextjs/source/docs/ai-evals/README.md)
- [Next.js] Criterios de revisión humana de las respuestas de IA: [v2-nextjs/source/docs/ai-evals/HUMAN_RUBRIC.md](./v2-nextjs/source/docs/ai-evals/HUMAN_RUBRIC.md)
- [Next.js] Historial de versiones 2: [v2-nextjs/releases](./v2-nextjs/releases/)
- [Next.js] Código fuente público de la versión 2: [v2-nextjs/source](./v2-nextjs/source/)
- [Google Apps Script] Historial de versiones 1: [v1-gas/releases](./v1-gas/releases/)
- Última versión ejecutable de v1: [despliegue v1.4.1](https://script.google.com/macros/s/AKfycbxMCx13pkrSzFs8f2qXfmxy2LRhkBpZTItFTIfEOoOi-zwurbysnKGfDIYtAeEdQP99/exec)
- Último código fuente de v1: [v1-gas/current](./v1-gas/current/)

## Evolución de la calidad de IA en v2.1.x

En v2.1.x se mejoró por etapas que los asistentes de IA completaran sus respuestas, localizaran el documento de referencia adecuado, no sustituyeran el juicio del profesional y no conservaran información privada. No se repitió el mismo trabajo: cada parche corrigió nuevos problemas observados durante el uso real.

- **v2.1.2-v2.1.6:** se organizaron la extensión de las respuestas, la detección de interrupciones, el contexto conversacional, los límites clínicos y los criterios de evaluación automática.
- **v2.1.7:** se ordenaron el formato y el alcance público de los README, los registros de cambios y las notas de versión.
- **v2.1.8:** se revisaron los documentos de referencia en cinco idiomas y se renovó todo el material de búsqueda de los asistentes de IA.
- **v2.1.9:** se hizo más estable la recuperación de documentos ante códigos breves y preguntas en varios idiomas.
- **v2.1.10:** se corrigieron los problemas restantes de reconocimiento de códigos japoneses, preguntas amplias de interpretación y configuración de una base de datos nueva.

El trabajo relacionado de v2.1.8 a v2.1.10 se documenta en las notas de cada parche.

## v2.2.7

v2.2.7 impide que tres tipos de entradas incompletas de la tabla de codificación pasen al cálculo. Se eliminó la `S` aislada de las opciones de localización para que las respuestas de espacio en blanco se registren siempre como `WS`, `DS` o `DdS`; ya no es posible introducir el mismo determinante ni códigos duplicados de la misma familia de movimiento en una respuesta, ni calcular con la calidad formal en blanco. En los registros en los que todas las respuestas son de forma pura (`F`), Lambda se informa como el número de respuestas de F pura en lugar del símbolo de infinito.

Los protocolos existentes introducidos según las reglas no necesitan volver a calcularse. Si esos valores permanecen en datos antiguos guardados automáticamente, la aplicación conserva el original, detiene el cálculo e indica en cinco idiomas las filas que deben revisarse. También se introdujo una lista de reglas que comprueba automáticamente que los documentos de referencia de los cinco idiomas enuncien las mismas reglas clínicas. Consulte la [nota del parche v2.2.7](./v2-nextjs/releases/v2.2.7/README.es.md) para obtener más información.

## v2.2.6

v2.2.6 alinea el título, la descripción, la dirección canónica y las alternativas de idioma de las cinco versiones con el idioma mostrado en pantalla. Las direcciones sin parámetro de idioma utilizan ahora el coreano de forma coherente, mientras que se conserva la dirección `?lang=pt` y se identifica ante los motores de búsqueda como portugués de Brasil mediante `pt-BR`.

También corrige un problema de algunos navegadores en Windows por el que `Alt+rueda del ratón` desplazaba la pantalla de codificación en lugar de ampliarla. Los nombres de los campos en las explicaciones de los encabezados de la tabla utilizan ahora corchetes de forma coherente. Las fórmulas y los resultados del Sumario Estructural, los datos de codificación, la disposición de la pantalla, el corpus de IA y las reglas de respuesta no cambian, por lo que no es necesario volver a calcular los protocolos existentes. Consulte la [nota del parche v2.2.6](./v2-nextjs/releases/v2.2.6/README.es.md) para obtener más información.

## v2.2.5

v2.2.5 separa la entrada de determinantes de movimiento de cada respuesta de los totales de familia mostrados en el Sumario Estructural. La tabla de codificación deja de ofrecer `M`, `FM` y `m` sin sufijo activo o pasivo; en su lugar se utilizan códigos completos como `Ma`, `Mp` y `Ma-p`. Los totales `M`, `FM` y `m` del Sumario Estructural y los cálculos de EB, MQual y W:M no cambian.

Los protocolos existentes que ya usan códigos completos no necesitan volver a calcularse. Si un guardado automático antiguo contiene un código de movimiento sin sufijo activo o pasivo, la aplicación conserva la entrada original, detiene el cálculo e indica la fila y el código que requieren revisión. Se volvieron a comprobar los documentos de referencia en cinco idiomas, 5,604 vectores de búsqueda, 365 preguntas de recuperación y preguntas límite con llamadas reales a GPT-5.5. La [nota del parche v2.2.5](./v2-nextjs/releases/v2.2.5/README.es.md) explica las condiciones afectadas y el ejemplo hipotético en el límite del CDI.

## v2.2.4

v2.2.4 reorganizó los documentos de referencia destinados a personas y el material que consultan los asistentes de IA opcionales, sin cambiar las fórmulas del Sumario Estructural ni la entrada de la tabla de codificación. No es necesario volver a calcular resultados existentes.

Los términos y la redacción de los cinco idiomas se contrastaron con fuentes profesionales de cada idioma, y los títulos y el orden de los documentos se ajustaron al flujo real de codificación e interpretación. Se actualizaron 1,015 documentos de referencia y 5,589 vectores de búsqueda; hubo 0 documentos ausentes, vectores obsoletos o discrepancias de hash. También se reforzaron el límite exacto del sistema Exner CS, el rechazo de inyecciones de prompt y los límites de solicitudes. Se aprobaron 66 conversaciones reales, de un turno y de varios turnos, con GPT-5.5 en los cinco idiomas. La [nota del parche v2.2.4](./v2-nextjs/releases/v2.2.4/) contiene los detalles y las evidencias públicas.

Una revisión posterior también mejoró el diálogo para elegir cómo iniciar la codificación, la legibilidad de los documentos de referencia y el control de desplazamiento del asistente de codificación.

## v2.2.3

v2.2.3 reorganizó la documentación pública, los metadatos de búsqueda y vista previa en cinco idiomas y la protección frente a escrituras excesivas en la base de datos de valoración de respuestas de IA, sin cambiar las fórmulas ni la disposición de la pantalla. No es necesario volver a calcular resultados existentes.

El título utilizado en búsquedas y vistas compartidas es `Yes, U Can!` en todos los idiomas. La descripción traducida indica que la calculadora de Sumario Estructural del Sistema Comprehensivo de Rorschach de Exner es de código abierto, no exige registro, instalación ni pago y no sustituye el juicio clínico profesional. La valoración positiva o negativa sigue sin guardar el texto de la conversación y ahora limita el tamaño de las solicitudes y la frecuencia de escrituras por sesión. La [nota del parche v2.2.3](./v2-nextjs/releases/v2.2.3/) explica la normalización de fechas y los límites de seguridad.

## v2.2.2

v2.2.2 volvió a separar los cálculos que incluyen Cn de los que lo excluyen. En la etiqueta convencional `FC:CF+C`, el valor derecho es `CF+C+Cn`, mientras que esta aplicación excluye Cn de WSumC, del criterio 7 de S-CON y de los cálculos Color-Shading. **El valor mostrado de Cn para protocolos completos ya era correcto en v2.2.1, por lo que esta cuestión por sí sola no exige volver a calcularlos.** También se impidió que una fila incompleta con Calidad Formal (FQ) en blanco recibiera una clasificación provisional GHR o PHR.

El Excel de 2019, el programa original RorScore, v1 GAS, el código actual de v2, CHESSSS, RAP3 y RIAP5 permiten comprobar aspectos distintos del cálculo, por lo que ninguno se trató como única autoridad. Se aprobaron 376 comprobaciones de cálculo y funciones, 101 criterios de respuestas de IA y 222 generaciones de páginas para distribución. También se comprobaron 10 preguntas directas sobre Cn y 5 preguntas representativas mediante llamadas reales a GPT-5.5 en los 5 idiomas. El único cambio de interfaz fue hacer completamente opaca la barra lateral izquierda; la optimización específica para móviles continúa en versiones posteriores de v2.2.x.

## v2.2.1

v2.2.1 corrigió los cálculos de **Upper Section, Lower Section y Special Indices** que muestra la aplicación, sin cambiar la UI/UX ni añadir campos de entrada. Se corrigieron los valores extremos de D/AdjD, las condiciones de visualización de EBPer, el orden de las reglas GHR/PHR, los denominadores iguales a 0 de WDA% y Afr, y la inclusión de Cn en el valor derecho de `FC:CF+C`.

La versión también indicó por primera vez la ubicación pública y la función del Excel de 2019 consultado durante el desarrollo inicial de v1. La comprobación incluyó 25 cálculos con los mismos códigos y notas en distintos idiomas, 2,000 protocolos sintéticos reproducibles y llamadas reales a GPT-5.5 para codificación e interpretación.

## v2.2.0

v2.2.0 es la primera versión v2.2.x que reúne la navegación principal de escritorio en una barra lateral izquierda y presenta el asistente de interpretación como una conversación de IA convencional. También ordenó la detención de respuestas, la copia y valoración de mensajes, el desplazamiento del área de conversación, los documentos de referencia, el archivo de versiones y el zoom y desplazamiento de la tabla de codificación.

Se restringió a los asistentes GPT-5.5 para que no ampliaran sus respuestas fuera del Sistema Comprehensivo de Exner y se comprobó su comportamiento mediante llamadas reales a la API en coreano, japonés e inglés. Los aspectos de cálculo identificados durante la revisión de v2.2.0 se corrigieron en v2.2.1 y v2.2.2. Consulte v2.2.0 para el registro de UI/UX y el informe de cálculo v2.2.2 para el criterio actual. Las pantallas móviles se mejoran por separado en versiones posteriores de v2.2.x.

## [Next.js] Historial de versiones 2

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

<details>
<summary><strong>Cómo ejecutar directamente el código fuente de v2</strong></summary>

1. Abra la carpeta [v2-nextjs/source](./v2-nextjs/source/).
2. Instale las dependencias con `npm install`.
3. Cree un archivo local de variables de entorno a partir de `.env.example`.
4. Compruebe la aplicación con `npm run build` o `npm run dev`.

El repositorio público no contiene las variables de entorno de producción, la configuración de Vercel, registros locales, cachés ni notas de trabajo privadas.

</details>

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
- **[2025-10-19] v1.0.2 (hotfix)** [Despliegue](https://script.google.com/macros/s/AKfycbwtBFge9jPS03Mz4QD5IlUDfHOetaVGsIe48y9dZESkfWtsJ-dnYv9S5iZ_4wxx4dCOUw/exec) [Nota del parche/código fuente](./v1-gas/releases/v1.0.2/)
- **[2025-10-17] v1.0.1 (hotfix)** [Despliegue](https://script.google.com/macros/s/AKfycbwNNeJsgRx0sEnZO4X9XxEUEthQlVS3Ttk6k_OSmIj8aTPlpdBQV1653hmBtzLnVX8Q/exec) [Nota del parche/código fuente](./v1-gas/releases/v1.0.1/)
- **[2025-10-16] v1.0.0 (versión mayor)** [Despliegue](https://script.google.com/macros/s/AKfycbxYTxqKcmRNJhpE8eCGTBZPyUFVJIRQiUTbyW48lJKg2E7Bgc5RKSitdDTVcE3bzk07JA/exec) [Nota del parche/código fuente](./v1-gas/releases/v1.0.0/)
