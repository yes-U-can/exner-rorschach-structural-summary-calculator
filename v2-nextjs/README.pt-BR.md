# v2 Next.js

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

Esta pasta contém o histórico de versões e o código-fonte público da v2 da calculadora do Sumário Estrutural de Rorschach. As notas do patch descrevem as alterações mais recentes, e o guia bibliográfico explica as fontes de cálculo.

- Notas do patch mais recente: [notas da v2.2.11](./releases/v2.2.11/README.pt-BR.md)
- Fontes de cálculo e escopo bibliográfico: [fontes de cálculo e escopo bibliográfico](./methodology/reference-audit-v2.2.10/README.pt-BR.md)
- Notas da primeira versão v2: [notas da v2.0.0](./releases/v2.0.0/)
- Código-fonte público: [código-fonte da versão 2](./source/)

## Escopo público

`source/` contém o código-fonte, as traduções e os documentos de referência públicos necessários para executar o aplicativo.

Os recursos opcionais de IA usam a chave da API da OpenAI de cada pessoa. A chave é mantida criptografada por no máximo 24 horas, é apagada quando a conexão de IA termina e não é preservada como dado de conta de longo prazo.

<details>
<summary><strong>Como executar o código-fonte localmente</strong></summary>

```bash
cd v2-nextjs/source
npm install
cp .env.example .env.local
npm run build
```

</details>
