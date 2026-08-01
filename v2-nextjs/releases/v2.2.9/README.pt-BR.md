# [2026-08-01] v2.2.9 correção de erros

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## Principais alterações

### Ordenação de [Card]

O botão do cabeçalho [Card] aplicava apenas a ordem crescente. Quando o registro já estava organizado por cartão, pressionar o botão parecia não produzir nenhuma alteração.

Agora o botão alterna entre a ordem crescente e a decrescente. Seu nome acessível e seu ícone indicam a direção que será aplicada no próximo acionamento. As linhas sem cartão permanecem no fim, e as linhas do mesmo cartão mantêm a ordem atual.

### Abertura do Assistente de Interpretação após iniciar uma sessão de IA

Ao selecionar [Assistente de Interpretação] na tela de pontuação ou nos documentos de referência, iniciar uma sessão de IA com uma chave de API mantinha o usuário na tela anterior em vez de abrir o assistente.

Agora, quando a sessão é iniciada como parte desse acesso, o aplicativo abre o Assistente de Interpretação e preserva o idioma selecionado. Quando a sessão é iniciada pelo botão geral [Iniciar sessão de IA] na parte inferior da barra lateral, a tela atual continua aberta.

### Botão para ir à mensagem mais recente

No Assistente de Interpretação, o botão exibido quando a pessoa está lendo acima da mensagem mais recente também passa a indicar se a IA está respondendo. Enquanto uma resposta está sendo escrita, três pontos centralizados verticalmente se movem em sequência. Quando a resposta termina, a seta para baixo volta a aparecer. Nos dois estados, o botão leva à mensagem mais recente.

O movimento dos pontos é reduzido quando o sistema operacional solicita a redução de animações.

### Avaliação útil ou não útil

O estado selecionado dos botões útil e não útil era pouco diferente do estado não selecionado. Agora, uma avaliação útil preenche o botão em verde, e uma avaliação não útil o preenche em vermelho. Os dois estados usam ícones sólidos para deixar a escolha atual claramente visível.

A avaliação é salva assim que um dos botões é pressionado. Ao escolher [Pular] na janela opcional de motivos, apenas a avaliação é mantida, sem códigos de motivo. Pressionar novamente o mesmo botão selecionado exclui a avaliação do banco de dados do servidor e devolve o botão ao estado não selecionado. O texto da pergunta e da resposta não é enviado ao banco de dados de avaliações.

### Documentação do arquivo público

As datas de arquivo da v1.0.2 e da v1.0.3 foram alinhadas à mesma data de Asia/Seoul, 2025-10-18. Dentro dessa data, a v1.0.3 aparece antes da v1.0.2.

As contagens técnicas de quatro algarismos nos documentos públicos dos cinco idiomas agora são escritas sem separador de milhares, como `5604`, `1015`, `5589` e `2000`. Isso evita a ambiguidade de uma vírgula que possa ser interpretada como separador decimal em espanhol e português.

Esta correção documental faz parte da v2.2.9. Ela não altera o código de cálculo nem os artefatos implantados de versões anteriores.

## Resultados de cálculo existentes são afetados?

Não. Esta versão não altera as fórmulas do Sumário Estrutural, os códigos de entrada disponíveis, o conteúdo dos documentos de referência nem as regras de resposta da IA. Protocolos existentes não precisam ser recalculados.

## Testes e verificação

- O conjunto completo de testes aprovou 600 verificações em 98 arquivos de teste; 7 foram ignoradas porque suas condições de execução não estavam disponíveis.
- Em uma verificação direta, uma amostra já ordenada mudou de `I-X` para `X-I` e depois voltou para `I-X`.
- Uma sessão local de teste foi iniciada após a seleção de [Assistente de Interpretação] na tela de pontuação, e a abertura do assistente foi confirmada. A chave de teste foi removida imediatamente da sessão local e não foi enviada à OpenAI.
- Os testes automáticos cobrem o destino da sessão nos cinco idiomas, a permanência na tela atual após o início geral de sessão, os três pontos durante o streaming e a seta para baixo no estado ocioso.
- Os testes automáticos também cobrem a aparência selecionada da avaliação, o salvamento sem motivos e a exclusão da avaliação armazenada quando o mesmo botão é pressionado novamente.
- A validação do TypeScript e a análise estática dos arquivos modificados foram aprovadas.

Não foram executadas chamadas pagas à API porque esta versão não altera a geração de respostas da OpenAI.

## Escopo confirmado sem alterações

- As fórmulas do Sumário Estrutural e os campos de resultados não foram alterados.
- Os documentos de referência, embeddings vetoriais, prompts de sistema de IA e playbooks não foram alterados.
- Permanece a política de não armazenar dados de pontuação nem chaves de API da OpenAI no banco de dados do servidor.

## Apêndice técnico

<details>
<summary><strong>Comandos para reproduzir as verificações</strong></summary>

```bash
npm test
npm run lint
npx tsc --noEmit
```

</details>
