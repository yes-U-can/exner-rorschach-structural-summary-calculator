# v2 Next.js

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

Esta carpeta contiene el historial de versiones y el código fuente que puede hacerse público de la v2 de la calculadora del Sumario Estructural de Rorschach. Las notas del parche describen los cambios más recientes, mientras que el código público contiene materiales de verificación de los cálculos y de implementación.

- Notas del parche más reciente: [releases/v2.2.7](./releases/v2.2.7/README.es.md)
- Nueva auditoría de la exactitud del cálculo: [source/docs/ops/2026-07-17-v2.2.2-calculation-reaudit.md](./source/docs/ops/2026-07-17-v2.2.2-calculation-reaudit.md)
- Notas de la primera versión v2: [releases/v2.0.0](./releases/v2.0.0/)
- Código fuente público: [source](./source/)

## Alcance público

`source/` contiene el código fuente principal necesario para ejecutar y revisar la aplicación, los archivos de traducción, el corpus breve de documentos de referencia que consultan los asistentes de IA, las comprobaciones automáticas y la configuración de despliegue.

No incluye variables del entorno de producción, la configuración del proyecto de Vercel, registros locales, cachés, `node_modules`, documentos operativos experimentales del pasado, notas de trabajo privadas ni el historial de migraciones de la base de datos. El código público permite revisar el funcionamiento y el diseño centrales, pero no reproduce todo el entorno de producción.

<details>
<summary><strong>Cómo ejecutar el código fuente de forma local</strong></summary>

```bash
cd v2-nextjs/source
npm install
cp .env.example .env.local
npm run build
```

Para utilizar las funciones opcionales de IA, cada persona debe introducir su propia clave de API de OpenAI en la sesión BYOK de la aplicación. Las claves de API de los usuarios no se guardan en la base de datos del servidor.

</details>
