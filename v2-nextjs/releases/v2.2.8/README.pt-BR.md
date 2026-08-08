# [2026-07-31] v2.2.8 correção de erros

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## Principais alterações

### Visão geral

Esta versão corrige um problema em que o mesmo código de Conteúdo, inserido duas vezes em uma resposta, era contado duas vezes. Por exemplo, inserir `Bt` em dois campos podia aumentar indevidamente o numerador do Índice de Isolamento e, em um protocolo limítrofe, até alterar o resultado do CDI. Depois de selecionado, um código de Conteúdo não pode ser escolhido novamente em outro campo da mesma resposta. Se uma duplicação permanecer em um salvamento automático antigo, o aplicativo preserva os dados originais, interrompe o cálculo e indica a linha que precisa de revisão.

As regras de normalização que eram mantidas separadamente para a tabela de computador e os cartões móveis também foram unificadas. Quando Level 1 e Level 2 estão presentes ao mesmo tempo nas famílias `DV`, `DR`, `INCOM` ou `FABCOM`, o código que acabou de ser selecionado na tela é mantido e o código anterior em conflito é removido. Se os dois níveis já estiverem presentes em dados salvos anteriormente, Level 1 é mantido para preservar o comportamento anterior da interface de computador. O profissional clínico deve decidir qual nível está correto com base no material original. Nenhum Special Score vazio é salvo no campo removido, e a mesma entrada passa a produzir o mesmo resultado nas duas telas.

Esta versão não altera as fórmulas do Sumário Estrutural. Protocolos existentes inseridos de acordo com as regras não precisam ser recalculados. Apenas os registros que atendem a uma das condições listadas em “Quais registros podem ser afetados?” devem ser revistos com o material original e recalculados.

### Salvamento automático e dados de entrada

- Abrir os dados de exemplo não substitui mais um salvamento automático existente.
- A alteração mais recente é salva mesmo quando a tela é fechada ou se muda de página logo após a edição.
- Dados de salvamento automático estruturalmente danificados ou excessivamente grandes são rejeitados em vez de restaurados como registros válidos.
- Códigos Z não permitidos e escores Z que não pertencem ao cartão selecionado são bloqueados antes do cálculo.
- Os nomes de arquivo CSV usam a data local do dispositivo. Na exportação, apenas as cadeias que uma planilha poderia executar como fórmulas recebem proteção; valores positivos e negativos clinicamente válidos e sinais de codificação isolados mantêm o valor original. Células com vírgulas, aspas ou quebras de linha CR e LF são colocadas entre aspas conforme as regras de CSV.

### S-CON e documentos de referência

O documento de referência de S-CON nos cinco idiomas agora apresenta todos os 12 critérios e o limite de decisão de `8 ou mais`. Como antes, a calculadora conta os 12 critérios, marca o resultado com 8 ou mais e mostra o aviso de que S-CON se aplica a examinados com 15 anos ou mais. Nenhum campo de idade foi acrescentado; cabe ao profissional clínico decidir se a condição de idade se aplica.

Quando a idade não é informada em uma pergunta sobre S-CON, o assistente de interpretação informa primeiro quantos critérios foram atendidos e solicita a idade exata. Sem essa informação, ele não deve declarar S-CON positivo ou negativo nem produzir uma redação pronta para o laudo.

### Segurança da sessão de IA e do feedback

- A criação de sessões com chave de API e as solicitações de chat agora têm limites mais difíceis de contornar pela rotação de cookies.
- Corpos JSON `null`, matrizes e outros valores que não sejam objetos válidos são tratados como solicitações inválidas, e não como erros do servidor.
- A verificação de injeção de instruções e de expressões de crise também examina o contexto de conversa herdado.
- Uma configuração incorreta do segredo de criptografia de cookies impede a criação da sessão em vez de ocultar o erro.
- A avaliação das respostas de IA continua sem armazenar o texto da conversa nem endereços IP brutos. As datas foram unificadas em UTC, e a política de retenção de 180 dias permanece.

## Quais registros podem ser afetados?

Os resultados existentes do Sumário Estrutural não precisam ser recalculados, a menos que uma destas condições esteja presente:

1. O mesmo código de Conteúdo foi inserido mais de uma vez em uma única resposta.
2. As interfaces de computador e móvel armazenaram resultados diferentes para a normalização de Special Scores Level 1 e Level 2.
3. Um código Z não aceito ou um escore Z que não pertence ao cartão permanece em dados importados ou em um salvamento automático antigo.
4. Um registro inserido na interface móvel contém apenas determinantes sem forma, como `C`, `C'`, `T`, `V`, `Y` ou `Cn`, mas [FQ] foi salvo com um valor diferente de `none`.

Os registros afetados devem ser revistos com o material original, ter o código duplicado ou inválido corrigido e ser recalculados. O aplicativo não substitui o julgamento de codificação do profissional.

## Testes e verificação

- Foram acrescentados casos fixos que confirmam S-CON como `Positive` com exatamente 8 critérios e `NO` com 7.
- Um caso independente de OBS confirma a ramificação real da regra final.
- Foram reproduzidos separadamente códigos de Conteúdo duplicados, conflito entre Level 1 e Level 2, Special Scores vazios, códigos Z inválidos, salvamentos automáticos danificados, acesso bloqueado ao armazenamento do navegador e corpos JSON BYOK inválidos.
- A suíte automatizada completa aprovou 587 verificações em 95 arquivos de teste; 7 sem as condições necessárias de execução foram ignoradas.
- Confirmou-se que os 203 documentos de referência de cada um dos cinco idiomas estavam disponíveis para pesquisa.
- Os dados de busca de referências dos cinco idiomas corresponderam aos documentos atuais, sem itens desatualizados.
- Perguntas representativas verificaram os limites de codificação e interpretação e a conclusão das respostas. Na primeira revisão, foi identificado um problema no limite de resposta de uma pergunta sobre S-CON sem informação de idade; o limite foi reforçado e as perguntas relacionadas foram verificadas novamente.
- Uma resposta japonesa sobre o par de níveis de Special Score não atendeu ao critério, mas o resultado não foi reproduzido como erro das fórmulas ou das regras de entrada. Depois do ajuste do critério, todas as verificações relacionadas passaram.
- Os bancos de dados de feedback e de busca de referências foram reconstruídos a partir de esquemas vazios e verificados.
- A compilação de produção gerou 222 páginas. Em seguida, as telas da calculadora em computador e dispositivo móvel foram abertas diretamente, sem erros no console do navegador.

As verificações de respostas são amostras de limites representativos. Elas não garantem a exatidão de todas as perguntas clínicas. A interpretação final e a decisão sobre a aplicabilidade da idade permanecem sob responsabilidade do profissional clínico.

## UI/UX, privacidade e escopo do cálculo

- Nenhuma nova tela ou campo de idade foi adicionado.
- Um código de Conteúdo já selecionado fica desativado nos demais campos, e dados salvos inválidos recebem uma explicação nos cinco idiomas.
- As abas não selecionadas dos resultados do Sumário Estrutural agora têm uma borda discreta, facilitando distingui-las da aba atual. Nos cartões S-CON, DEPI, CDI e HVI, a caixa de seleção do resumo e sua primeira linha de texto ficam centralizadas verticalmente.
- As fórmulas e as seções de resultados do Sumário Estrutural não foram alteradas.
- Dados de codificação e chaves de API da OpenAI não são armazenados no banco de dados do servidor.
- O banco de feedback armazena apenas códigos de motivos predefinidos e informações agregadas, não o texto da conversa nem endereços IP brutos.

## Decisões mantidas sem alteração

Esta versão modificou apenas os itens com respaldo suficientemente estabelecido. Não foi alterado o tratamento da repetição do mesmo Special Score que não tenha distinção entre Level 1 e Level 2. Também não foi estabelecida uma nova regra clínica para atribuir FQ a determinantes sem forma; o comportamento de normalização já usado na interface de computador foi aplicado à interface móvel apenas para eliminar a diferença entre as duas. Os pontos que ainda exigem fontes adicionais ou uma decisão de produto serão revistos quando houver evidência suficiente.

## Apêndice técnico

<details>
<summary><strong>Comandos usados para repetir as verificações</strong></summary>

```bash
npm test
npm run lint
npm run build
npm run security:check
npm run docs:evaluate-rag:all
npm run docs:evaluate-hybrid:openai -- --enforce
npm run docs:assert-vector-runtime-ready
npm run feedback:db:verify-fresh-replay
npm run db:verify-fresh-replay
```

As auditorias das dependências de produção e desenvolvimento informaram 0 vulnerabilidades conhecidas.

</details>
