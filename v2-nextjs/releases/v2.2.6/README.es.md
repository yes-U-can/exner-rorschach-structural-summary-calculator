# [2026-07-20] v2.2.6 Corrección de errores

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## Cambios principales

### Resumen

Este parche corrige casos en los que los motores de búsqueda y las vistas previas de enlaces recibían información de idioma distinta de la página visible. También corrige un problema de la pantalla de codificación por el que `Alt+rueda del ratón` podía interpretarse como desplazamiento en algunas rutas de entrada de navegadores en Windows.

En las explicaciones que aparecen al pasar el ratón sobre los encabezados [Score] y [G/PHR], los nombres de campos relacionados utilizan ahora un único formato entre corchetes: [Card], [Z], [Contents], [Determinants], [FQ] y [Special Score].

El parche no cambia las fórmulas del Sumario Estructural, los datos de codificación, la disposición de la pantalla ni las reglas de respuesta de los asistentes de IA opcionales. No es necesario volver a calcular los protocolos existentes.

### Información de búsqueda en cinco idiomas

La dirección predeterminada sin parámetro de idioma corresponde a la página en coreano. Sin embargo, en las direcciones predeterminadas de Presentación del servicio, Términos de uso, Política de privacidad, Documentos de referencia y Archivo de versiones, la página visible podía estar en coreano mientras el título de búsqueda y la dirección canónica se emitían en inglés. Ahora el idioma visible, el título, la descripción y la dirección canónica coinciden en coreano.

Las páginas en portugués de Brasil conservan la dirección `?lang=pt` para mantener la validez de los marcadores y enlaces externos. La etiqueta de idioma enviada a los motores de búsqueda y a las tecnologías de asistencia pasa a ser `pt-BR`.

Cada página indexable proporciona con la misma regla:

- su propia dirección canónica
- direcciones alternativas en coreano, inglés, japonés, español y portugués de Brasil
- la dirección predeterminada en coreano cuando no se selecciona un idioma
- títulos, descripciones e imágenes de vista previa localizados para búsquedas y enlaces compartidos

Los marcadores y enlaces externos existentes no cambian.

### Ampliación de la pantalla de codificación

En algunos navegadores de Windows, el evento de la rueda no conservaba por completo el estado de la tecla `Alt`. Por ello, la pantalla de codificación podía desplazarse en lugar de ampliarse o reducirse. La aplicación ahora comprueba también el estado de `Alt` en el teclado y da prioridad a la ampliación frente al desplazamiento.

Se mantiene el comportamiento de `Ctrl+rueda del ratón` para ampliar toda la página del navegador. Tampoco cambian la escala mínima y máxima de la pantalla de codificación, la ampliación centrada en el puntero ni los márgenes de desplazamiento.

## Pruebas y verificación

- Se comprobó que las principales páginas públicas sin parámetro de idioma emitan títulos, descripciones y direcciones canónicas en coreano.
- Se comprobó que cada URL indexable de los cinco idiomas incluya su propia dirección canónica, las cuatro alternativas restantes y la dirección predeterminada en coreano.
- Se verificó que el idioma de página, los enlaces alternativos, el mapa del sitio y los datos estructurados usen `pt-BR` de forma coherente en portugués de Brasil.
- Se volvió a comprobar la exclusión de las rutas exclusivas de IA y de API de la indexación.
- Se separaron los casos de `Alt`, el estado de entrada alternativo de Windows y `Ctrl` para confirmar que la ampliación de la pantalla de codificación y la del navegador no interfieran entre sí.
- Se comprobaron los cinco idiomas para confirmar que los campos mencionados en las explicaciones de los encabezados utilicen los mismos corchetes.
- El conjunto completo superó 458 comprobaciones en 82 archivos de prueba; 7 se omitieron porque no se cumplían sus condiciones de ejecución. También se superaron la compilación de producción, el análisis estático del código, la revisión de textos en cinco idiomas y las auditorías de secretos y dependencias.

Las pruebas automáticas verifican los metadatos y las reglas de los eventos de entrada. La actualización real de los resultados depende del ciclo de rastreo de cada motor de búsqueda, y la interacción física del teclado y el ratón también se comprueba en la página desplegada.

## UI/UX, privacidad y alcance del cálculo

- No se añadieron pantallas ni campos de entrada.
- No se modificaron los menús visibles ni la disposición.
- Solo se unificó la redacción de las explicaciones de los encabezados de la tabla de codificación.
- No se modificaron las fórmulas ni los resultados del Sumario Estructural.
- No se recopila nueva información personal.
- Se mantiene la regla de no guardar los datos de codificación ni las claves API de OpenAI en la base de datos del servidor.
- No se modificaron el corpus de IA, las incrustaciones ni las reglas de respuesta de los asistentes de codificación e interpretación.

## Alcance público y límite de seguridad

El código público incluye metadatos de búsqueda localizados, direcciones canónicas y alternativas, el mapa del sitio, el tratamiento de la ampliación de la pantalla de codificación y las pruebas automáticas relacionadas.

No se publican variables de entorno, claves API, ajustes privados de despliegue, rutas locales ni registros internos de trabajo.

## Apéndice técnico

<details>
<summary><strong>Comandos para que los desarrolladores repitan las pruebas</strong></summary>

```bash
npm test
npm run lint
npm run build
npm run security:check
```

</details>
