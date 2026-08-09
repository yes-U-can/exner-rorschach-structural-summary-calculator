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

O estado selecionado dos botões útil e não útil era pouco diferente do estado não selecionado. O fundo e a borda do botão agora mantêm a aparência existente, e apenas o polegar selecionado passa a ser um ícone sólido no azul do aplicativo. Assim, a escolha atual fica clara sem introduzir um novo código de cores para as avaliações.

A avaliação é salva assim que um dos botões é pressionado. Ao escolher [Pular] na janela opcional de motivos, apenas a avaliação é mantida, sem motivo. Pressionar novamente o mesmo botão selecionado exclui a avaliação e devolve o botão ao estado não selecionado. O texto da pergunta e da resposta não é incluído nas informações da avaliação.

## Resultados de cálculo existentes são afetados?

Não. Esta versão não altera as fórmulas do Sumário Estrutural, os códigos de entrada disponíveis, o conteúdo dos documentos de referência nem as regras de resposta da IA. Protocolos existentes não precisam ser recalculados.
