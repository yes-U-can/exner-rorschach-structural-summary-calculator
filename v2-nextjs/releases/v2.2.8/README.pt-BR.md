# [2026-07-31] v2.2.8 correção de erros

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## Principais alterações

### Visão geral

Esta versão corrige um problema em que o mesmo código de Conteúdo, inserido duas vezes em uma resposta, era contado duas vezes. Por exemplo, inserir `Bt` em dois campos podia aumentar indevidamente o numerador do Índice de Isolamento e, em um protocolo limítrofe, até alterar o resultado do CDI. Depois de selecionado, um código de Conteúdo não pode ser escolhido novamente em outro campo da mesma resposta. Se uma duplicação permanecer em um salvamento automático antigo, o aplicativo preserva os dados originais, interrompe o cálculo e indica a linha que precisa de revisão.

As versões para computador e celular agora tratam da mesma forma os conflitos entre Level 1 e Level 2 nas famílias `DV`, `DR`, `INCOM` e `FABCOM`. O código recém-selecionado é mantido. Se os dois níveis já estiverem presentes em dados salvos anteriormente, Level 1 é mantido e o profissional é orientado a revisar o material original. O nível correto deve ser decidido com base nesse material. Nenhum Special Score vazio é salvo no campo do qual o código em conflito foi removido.

Esta versão não altera as fórmulas do Sumário Estrutural. Protocolos existentes inseridos de acordo com as regras não precisam ser recalculados. Apenas os registros que atendem a uma das condições listadas em “Quais registros podem ser afetados?” devem ser revistos com o material original e recalculados.

### Salvamento automático e dados de entrada

- Abrir os dados de exemplo não substitui mais um salvamento automático existente.
- A alteração mais recente é salva mesmo quando a tela é fechada ou se muda de página logo após a edição.
- Dados de salvamento automático estruturalmente danificados ou excessivamente grandes são rejeitados em vez de restaurados como registros válidos.
- Códigos Z não permitidos e escores Z que não pertencem ao cartão selecionado são bloqueados antes do cálculo.
- Os nomes de arquivo CSV usam a data local do dispositivo. Os arquivos exportados podem ser abertos com mais segurança em uma planilha, enquanto os valores clinicamente válidos e os códigos de pontuação mantêm o valor original.

### S-CON e documentos de referência

O documento de referência de S-CON nos cinco idiomas agora apresenta todos os 12 critérios e o limite de decisão de `8 ou mais`. Como antes, a calculadora conta os 12 critérios, marca o resultado com 8 ou mais e mostra o aviso de que S-CON se aplica a examinados com 15 anos ou mais. Nenhum campo de idade foi acrescentado; cabe ao profissional clínico decidir se a condição de idade se aplica.

Quando a idade não é informada em uma pergunta sobre S-CON, o assistente de interpretação informa primeiro quantos critérios foram atendidos e solicita a idade exata. Sem essa informação, ele não deve declarar S-CON positivo ou negativo nem produzir uma redação pronta para o laudo.

### Assistentes de IA e privacidade do feedback

- Quando as solicitações de conexão ou conversa com IA se repetem em excesso, o aplicativo pede que o usuário aguarde um pouco.
- Ao longo da conversa, o assistente não responde a pedidos de informações não públicas e oferece orientação de ajuda urgente diante de expressões relacionadas a crises.
- A avaliação das respostas de IA não armazena o texto da conversa nem endereços IP e é mantida por no máximo 180 dias.

## Quais registros podem ser afetados?

Os resultados existentes do Sumário Estrutural não precisam ser recalculados, a menos que uma destas condições esteja presente:

1. O mesmo código de Conteúdo foi inserido mais de uma vez em uma única resposta.
2. As interfaces de computador e móvel armazenaram valores diferentes de Special Scores Level 1 e Level 2.
3. Um código Z não aceito ou um escore Z que não pertence ao cartão permanece em dados importados ou em um salvamento automático antigo.
4. Um registro inserido na interface móvel contém apenas determinantes sem forma, como `C`, `C'`, `T`, `V`, `Y` ou `Cn`, mas [FQ] foi salvo com um valor diferente de `none`.

Os registros afetados devem ser revistos com o material original, ter o código duplicado ou inválido corrigido e ser recalculados. O aplicativo não substitui o julgamento de codificação do profissional.

## Interface, privacidade e escopo do cálculo

- Nenhuma nova tela ou campo de idade foi adicionado.
- Um código de Conteúdo já selecionado fica desativado nos demais campos, e dados salvos inválidos recebem uma explicação nos cinco idiomas.
- As abas não selecionadas dos resultados do Sumário Estrutural agora têm uma borda discreta, facilitando distingui-las da aba atual. Nos cartões S-CON, DEPI, CDI e HVI, a caixa de seleção do resumo e sua primeira linha de texto ficam centralizadas verticalmente.
- As fórmulas e as seções de resultados do Sumário Estrutural não foram alteradas.
- Os dados de codificação salvos automaticamente permanecem apenas no dispositivo. A chave de API é usada de forma criptografada em uma conexão de IA por no máximo 24 horas e é apagada quando a conexão termina.
- O feedback registra apenas motivos predefinidos e informações agregadas, não o texto da conversa nem endereços IP brutos.

## Considerações clínicas

Os critérios existentes são aplicados quando o mesmo Special Score sem distinção entre Level 1 e Level 2 se repete e ao determinar FQ para determinantes sem forma. Os conflitos entre Level 1 e Level 2 são tratados da mesma forma no computador e no celular.

O assistente de IA não garante a exatidão de todas as perguntas clínicas; a interpretação final e a decisão sobre a idade de aplicação do S-CON cabem ao profissional clínico.
