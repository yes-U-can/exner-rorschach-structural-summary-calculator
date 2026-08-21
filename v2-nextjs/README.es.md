# v2 Next.js

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

Esta carpeta contiene el historial de versiones y el código fuente público de la v2 de la calculadora del Sumario Estructural de Rorschach. Las notas del parche describen los cambios más recientes y la guía bibliográfica explica las fuentes de cálculo.

- Notas del parche más reciente: [notas de v2.2.11](./releases/v2.2.11/README.es.md)
- Fuentes de cálculo y alcance bibliográfico: [fuentes de cálculo y alcance bibliográfico](./methodology/reference-audit-v2.2.10/README.es.md)
- Notas de la primera versión v2: [notas de v2.0.0](./releases/v2.0.0/)
- Código fuente público: [código fuente de la versión 2](./source/)

## Alcance público

`source/` contiene el código fuente, las traducciones y los documentos de referencia públicos necesarios para ejecutar la aplicación.

Las funciones opcionales de IA utilizan la clave de API de OpenAI de cada persona. La clave se mantiene cifrada durante un máximo de 24 horas, se elimina al finalizar la conexión de IA y no se conserva como dato de cuenta a largo plazo.

<details>
<summary><strong>Cómo ejecutar el código fuente de forma local</strong></summary>

```bash
cd v2-nextjs/source
npm install
cp .env.example .env.local
npm run build
```

</details>
