# Agradecimientos

[한국어](./ACKNOWLEDGEMENTS.md) | [English](./ACKNOWLEDGEMENTS.en.md) | [日本語](./ACKNOWLEDGEMENTS.ja.md) | [Español](./ACKNOWLEDGEMENTS.es.md) | [Português (Brasil)](./ACKNOWLEDGEMENTS.pt-BR.md)

## RorScore

Durante la etapa inicial del desarrollo, cuando el aprendizaje de programación partía de conocimientos de psicología, RorScore fue como un primer manual: mostró que la lógica de cálculo del Sumario Estructural de Rorschach podía expresarse mediante código.

Se quiso dejar constancia de este agradecimiento desde el principio, pero el material de referencia no pudo localizarse de nuevo mientras la atención se concentraba en aprender a programar y construir la primera implementación. Más adelante, al ordenar este repositorio y su registro público, se encontró nuevamente RorScore y fue posible reconocer aquí ese punto de partida.

Este proyecto no copia ni incorpora el código de RorScore. No obstante, RorScore, de Jeremy Leader, fue una referencia importante para el aprendizaje cuando comenzó la implementación inicial en Google Apps Script, y se agradece profundamente esa contribución.

- [RorScore, de Jeremy Leader](https://github.com/jleader/RorScore)
- [Archivo principal en Perl de RorScore: `bin/rorschach.pl`](https://github.com/jleader/RorScore/blob/master/bin/rorschach.pl)

## Libro de cálculo de Excel de 2019

Durante el desarrollo de la calculadora inicial v1 en Google Apps Script, las fórmulas de celda de un libro de cálculo de Excel de 2019 distribuido públicamente se utilizaron como referencia para trasladar a un lenguaje de programación los cálculos del Sumario Estructural.

- Página de distribución pública: [entrada de Naver Blog](https://blog.naver.com/jin_k84/221539279596)
- Indicación de autoría incluida en el libro: `[Scoring Program] _by. Ju-Ri`

No se infiere el nombre real de la persona autora a partir de la única indicación `Ju-Ri` del libro. El archivo original tampoco se redistribuye en este repositorio público.

Este material ayudó de manera concreta a comprender la estructura de cálculo mediante fórmulas de Excel antes de aprender programación y, más adelante, a iniciar la implementación en JavaScript de v1 GAS. Se deja constancia, aunque sea tardíamente, de su contribución a la trayectoria de aprendizaje del proyecto.

Los trabajos posteriores sobre exactitud del cálculo no consideraron ni este libro ni RorScore como una fuente única de verdad. Se compararon entre sí las fórmulas reales de las celdas de Excel, el archivo original de RorScore, el código de cálculo de v1 y v2, las reglas del Sistema Comprehensivo de Exner adoptadas por esta aplicación y ejemplos completos de Sumario Estructural. CHESSSS se empleó solo como referencia complementaria en los puntos que podían comprobarse directamente en su documentación pública. Cuando las fuentes públicas diferían o no explicaban un punto de forma suficiente, no se estableció una conclusión tajante y se registraron también los límites de la evidencia disponible.

En particular, la lista de entrada del libro de 2019 contenía únicamente códigos de movimiento con superíndice activo o pasivo, mientras que `M`, `FM` y `m` en RorScore eran totales por tipo de movimiento calculados a partir de esos códigos. Ambos grupos cumplían funciones distintas, pero aparecieron juntos en un mismo menú desplegable de v1 y permanecieron así hasta v2. El origen de esa implementación, la función de cada material y los límites de la evidencia se explican en las [notas de la versión v2.2.2](./v2-nextjs/releases/v2.2.2/) y las [notas de la versión v2.2.5](./v2-nextjs/releases/v2.2.5/README.es.md).

## Herramientas de desarrollo y revisión independiente con IA

OpenAI Codex se utilizó para la implementación y las pruebas repetidas de v2. Claude Fable 5 y Claude Opus 4.8 se utilizaron para la revisión independiente previa a la publicación.

La coincidencia entre herramientas de IA no se considera prueba de que un cálculo o un juicio clínico sea correcto. MOW conserva la responsabilidad final sobre el producto y contrasta fuentes profesionales públicas, resultados reproducibles del programa y pruebas de regresión, así como la revisión clínica realizada por el Seoul Institute of Clinical Psychology desde la perspectiva del uso real.
