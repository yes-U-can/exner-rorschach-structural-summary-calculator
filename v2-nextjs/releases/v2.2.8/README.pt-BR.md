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
- Todos os 5,604 embeddings da OpenAI corresponderam ao texto atual, com 0 itens desatualizados e 0 divergências de hash.
- As verificações reais com GPT-5.5 abrangeram 62 conversas de um turno, 9 conversas de vários turnos e 4 solicitações pela rota de API do aplicativo. Na primeira execução, 1 pergunta sobre S-CON sem informação de idade não passou pela verificação dos limites da resposta. Depois de reforçar esse limite, 2 perguntas relacionadas em coreano, incluindo o caso que havia falhado, foram repetidas e ambas passaram.
- O OpenAI Codex e o Claude Opus 5 executaram separadamente chamadas pagas ao GPT-5.5. O ambiente de auditoria do Claude verificou 25 cenários em cinco idiomas e depois chamou mais 3 vezes o caso japonês do par de níveis de Special Score, que não havia passado em uma verificação de contrato. As 3 chamadas adicionais passaram, totalizando 27 aprovações e 1 reprovação em 28 chamadas. O Codex acrescentou um teste de regressão que aceita uma proibição correta em japonês mesmo quando ela retoma as palavras da pergunta e chamou o mesmo caso mais 11 vezes; as 11 passaram. A execução adicional do Codex terminou em 11 chamadas quando se esgotou o tempo da ferramenta local, mas nenhuma das 11 respostas concluídas pelo provedor foi interrompida.
- A única reprovação não foi reproduzida como erro das fórmulas ou das regras de entrada. Como o texto dessa resposta não foi retido, também não foi afirmada uma causa específica de falso positivo. As chamadas do Claude custaram `$0.874310`, e as chamadas adicionais do Codex, `$0.351305`. Nem as chaves de API nem o texto das respostas foram incluídos no registro público.
- As 4 migrações do banco de feedback e as 30 migrações do banco RAG foram reproduzidas desde o início em um banco pgvector vazio.
- A compilação de produção gerou 222 páginas. Em seguida, as telas da calculadora em computador e dispositivo móvel foram abertas diretamente, sem erros no console do navegador.

As chamadas reais de IA são verificações amostrais de limites representativos de resposta. Elas não garantem a exatidão de todas as perguntas clínicas. A interpretação final e a decisão sobre a aplicabilidade da idade permanecem sob responsabilidade do profissional clínico.

## UI/UX, privacidade e escopo do cálculo

- Nenhuma nova tela ou campo de idade foi adicionado.
- Um código de Conteúdo já selecionado fica desativado nos demais campos, e dados salvos inválidos recebem uma explicação nos cinco idiomas.
- As abas não selecionadas dos resultados do Sumário Estrutural agora têm uma borda discreta, facilitando distingui-las da aba atual. Nos cartões S-CON, DEPI, CDI e HVI, a caixa de seleção do resumo e sua primeira linha de texto ficam centralizadas verticalmente.
- As fórmulas e as seções de resultados do Sumário Estrutural não foram alteradas.
- Dados de codificação e chaves de API da OpenAI não são armazenados no banco de dados do servidor.
- O banco de feedback armazena apenas códigos de motivos predefinidos e informações agregadas, não o texto da conversa nem endereços IP brutos.

## Decisões mantidas sem alteração

Esta versão modificou apenas os itens com respaldo suficientemente estabelecido. Não foi alterado o tratamento da repetição do mesmo Special Score que não tenha distinção entre Level 1 e Level 2. Também não foi estabelecida uma nova regra clínica para atribuir FQ a determinantes sem forma; o comportamento de normalização já usado na interface de computador foi aplicado à interface móvel apenas para eliminar a diferença entre as duas. Os pontos que ainda exigem fontes adicionais ou uma decisão de produto serão revistos quando houver evidência suficiente.

## Escopo público e limite de segurança

O código público inclui validação de entrada, recuperação do salvamento automático, verificações dos limites de S-CON e OBS, documentos de referência em cinco idiomas, ferramentas de avaliação de respostas de IA e resultados reproduzíveis.

O script de limpeza do espelho público agora respeita `DryRun` e mostra as operações planejadas sem excluir arquivos.

Variáveis do ambiente de produção, chaves de API, dados reais de codificação e conversas, endereços IP brutos, fontes não públicas, caminhos locais e registros internos de trabalho são excluídos.

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
