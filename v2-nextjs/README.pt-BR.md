# v2 Next.js

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

Esta pasta contém o histórico de versões e o código-fonte que pode ser disponibilizado publicamente da v2 da calculadora do Sumário Estrutural de Rorschach. As notas do patch descrevem as alterações mais recentes, enquanto o código público reúne materiais de verificação dos cálculos e de implementação.

- Notas do patch mais recente: [releases/v2.2.6](./releases/v2.2.6/README.pt-BR.md)
- Nova auditoria da exatidão dos cálculos: [source/docs/ops/2026-07-17-v2.2.2-calculation-reaudit.md](./source/docs/ops/2026-07-17-v2.2.2-calculation-reaudit.md)
- Notas da primeira versão v2: [releases/v2.0.0](./releases/v2.0.0/)
- Código-fonte público: [source](./source/)

## Escopo público

`source/` contém o código-fonte central necessário para executar e revisar o aplicativo, os arquivos de tradução, o corpus breve de documentos de referência pesquisado pelos assistentes de IA, as verificações automáticas e a configuração de implantação.

Não estão incluídas variáveis do ambiente de produção, configurações do projeto Vercel, logs locais, caches, `node_modules`, documentos operacionais experimentais antigos, notas de trabalho privadas nem o histórico de migrações do banco de dados. O código público permite revisar o funcionamento e o desenho centrais, mas não reproduz todo o ambiente de produção.

<details>
<summary><strong>Como executar o código-fonte localmente</strong></summary>

```bash
cd v2-nextjs/source
npm install
cp .env.example .env.local
npm run build
```

Para utilizar os recursos opcionais de IA, cada pessoa deve inserir sua própria chave da API da OpenAI na sessão BYOK do aplicativo. As chaves de API dos usuários não são armazenadas no banco de dados do servidor.

</details>
