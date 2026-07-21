# [2026-07-19] v2.2.5 Correção de erros

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## Principais alterações

### Visão geral

Esta versão corrige um problema no menu suspenso **[Determinants]** da tabela de codificação, que permitia selecionar `M`, `FM` e `m` sem classificação como ativo ou passivo.

Esses três símbolos são necessários no Sumário Estrutural como **campos de total** para movimento humano, animal e inanimado. Entretanto, o determinante de movimento de uma resposta individual deve ser registrado com uma de três qualidades: ativa `a`, passiva `p` ou ativa-passiva `a-p`.

Por esse motivo, a v2.2.5 remove `M`, `FM` e `m` **apenas das opções de entrada**. Os totais `M`, `FM` e `m` do Sumário Estrutural e os cálculos de EB, MQual, W:M e outras variáveis permanecem inalterados.

Os protocolos existentes que usam corretamente `Ma`, `Mp`, `Ma-p`, `FMa`, `FMp`, `FMa-p`, `ma`, `mp` e `ma-p` não são afetados e não precisam ser recalculados.

Se uma versão anterior foi usada para selecionar diretamente `M`, `FM` ou `m` em uma resposta individual, essa resposta deve ser revista. Quando o aplicativo encontra um desses valores em dados antigos salvos automaticamente, ele preserva a entrada original, interrompe o cálculo e identifica a linha e o código que precisam de revisão. A classificação como ativo ou passivo não é atribuída automaticamente porque deve ser determinada a partir do registro de respostas e do inquérito (Inquiry).

### Por que esse problema era importante?

Mesmo quando um valor de movimento sem classificação como ativo ou passivo era inserido, a frequência total de movimento, EB, MQual e outros campos podiam continuar aumentando com aparência de normalidade. Entretanto, essa classificação ficava ausente, de modo que `a:p`, `Ma:Mp` e as frequências de movimentos ativos e passivos da área Interpessoal podiam ser calculadas abaixo dos valores reais.

Em particular, a quarta condição do CDI verifica se `movimento passivo > movimento ativo + 1`. Próximo ao ponto de corte, a ausência dessa classificação em um único movimento podia alterar se o CDI apareceria como positivo.

Como exemplo concreto, foi usado um registro hipotético no qual as respostas “Uma pessoa está descansando” e “Outra pessoa está deitada dormindo” foram codificadas como `Mp H`. Se ambos os movimentos são `Mp`, o movimento passivo é 2 e o ativo é 0; portanto, a quarta condição é atendida e a tela mostra o CDI como `4, Positive`.

Se, em uma versão anterior, o segundo `Mp` tivesse sido inserido como `M` sem classificação como ativo ou passivo, o total de movimento humano ainda apareceria como 2, mas a frequência passiva seria contabilizada apenas como 1. No mesmo registro situado no limite, a quarta condição deixaria de ser atendida e o CDI poderia aparecer como `3, NO`.

Este exemplo é um registro hipotético formado por apenas duas respostas para demonstrar o limite do cálculo; não é um protocolo completo adequado à interpretação clínica. O profissional classifica o movimento como ativo ou passivo depois de examinar o registro de respostas e o inquérito (Inquiry).

### Onde o problema começou?

Os materiais do início do desenvolvimento foram comparados novamente.

- A lista de entrada do arquivo de cálculo do Excel de 2019 usado no desenvolvimento da v1 continha apenas códigos de movimento classificados como ativos ou passivos, enquanto `M`, `FM` e `m` eram usados como totais derivados desses códigos.
- A implementação em Perl do RorScore também lia códigos de movimento classificados como ativos ou passivos e calculava separadamente os totais `M`, `FM` e `m` e as frequências ativas e passivas.
- O menu suspenso de codificação da v1.0.0 combinou códigos inseridos para respostas individuais com campos de total apresentados no Sumário Estrutural, e essa situação continuou até a v2.
- O histórico da correção de MQual da v1.0.2 mostra que `M` sem classificação como ativo ou passivo foi tratado como código de resposta individual junto com `Ma`, `Mp` e `Ma-p`.

Os registros preservados não permitem estabelecer a sequência manual exata pela qual a lista de entrada do Excel e os campos de total do Perl foram combinados. Dentro do que pode ser verificado, a explicação mais precisa é que **a distinção entre os códigos inseridos para respostas individuais e os totais exibidos no Sumário Estrutural se tornou imprecisa na implementação da v1**.

Excel e Perl distinguiam, cada um em seu próprio contexto, os códigos de movimento de respostas individuais e os totais por tipo de movimento. O problema confirmado não estava na regra de cálculo de nenhum dos materiais de referência, mas na implementação do aplicativo que colocou itens com funções diferentes na mesma lista de entrada. O histórico do desenvolvimento e os limites das evidências disponíveis são descritos em detalhe no [documento de revisão do limite de entrada dos determinantes de movimento](../../source/docs/ops/2026-07-18-v2.2.5-movement-input-boundary.md).

## Correções relacionadas

- As páginas de referência de `M`, `FM` e `m` nos cinco idiomas agora explicam a diferença entre os campos de total do Sumário Estrutural e os códigos inseridos para respostas individuais.
- As explicações complementares na interface e as páginas de referência passaram a seguir o mesmo critério.
- O Assistente de Codificação não apresenta mais `M`, `FM` ou `m` como códigos completos que podem ser inseridos diretamente para uma resposta individual e, em vez disso, pede as informações `a`, `p` ou `a-p` necessárias para completar o código.
- Caracteres corrompidos foram restaurados em 4 perguntas de busca em japonês e em um registro coreano de manutenção de documentos.
- Depois da alteração das páginas de referência, os dados de busca e os embeddings da OpenAI nos cinco idiomas foram reconstruídos.
- As regras de geração de documentos e os testes de regressão foram reforçados para manter `Regra do código de entrada` e `Condição de codificação/aplicação` como seções separadas.
- A ordem de resposta do Assistente de Interpretação foi reforçada para explicar primeiro o número de respostas e as limitações dos dados diante de perguntas amplas sobre o Sumário Estrutural.

## Testes e verificação

Primeiro, foi verificado se os códigos de entrada e os campos de resultados mantinham funções diferentes.

- O menu suspenso de codificação apresenta apenas os 29 códigos completos de determinantes.
- `M`, `FM` e `m` permanecem nos resultados do Sumário Estrutural como totais por tipo de movimento.
- Um valor antigo salvo automaticamente sem classificação como ativo ou passivo, o formato histórico do Excel `m'a` ou um código arbitrário não registrado interrompem o cálculo sem alterar o valor original.
- A frequência total de movimento, os determinantes simples (Single) e as combinações de determinantes (Blends) continuam sendo contabilizados como conceitos distintos no Sumário Estrutural.
- Os testes de regressão fixam o comportamento no limite do CDI: duas entradas `Mp` válidas atendem à quarta condição, enquanto apenas uma não atende.

As páginas de referência nos cinco idiomas e os assistentes opcionais de IA também foram verificados.

- As 365 perguntas de busca nos documentos recuperaram o material correspondente.
- Todos os 5,604 embeddings da OpenAI foram reconstruídos a partir do texto revisado, com 0 embeddings desatualizados ou divergências no hash do conteúdo.
- Na busca híbrida com embeddings reais da OpenAI, tanto a taxa de acerto do primeiro documento quanto a cobertura do conjunto relevante foram de 100% para perguntas amplas e perguntas com nome explícito. Nenhuma pergunta ampla trouxe como primeiro resultado um documento de outra área de trabalho.
- Em 62 chamadas reais de turno único ao GPT-5.5, todas as perguntas sobre codificação ativa-passiva do movimento respeitaram o limite pretendido. Em 1 resposta interpretativa longa, sem relação com os códigos de movimento, foi identificado que o número de respostas e as limitações dos dados não eram explicados primeiro; a ordem foi corrigida e a mesma condição passou em 3 verificações consecutivas.
- As conversas sobre codificação do movimento passaram em 9 chamadas de vários turnos. Outra verificação em inglês falhou 1 vez porque o avaliador não reconheceu uma expressão equivalente; depois da correção da expressão aceita, a pergunta relacionada passou em 2 verificações consecutivas.
- Depois de alinhar o texto e os embeddings finais nos cinco idiomas, foi feita uma chamada por idioma com uma pergunta representativa sobre o limite de entrada do movimento. As 5 chamadas em coreano, inglês, japonês, espanhol e português foram concluídas com sucesso.
- Depois de corrigir a regra de geração dos títulos de seção, as mesmas perguntas nos cinco idiomas foram chamadas novamente. As 5 passaram sem interrupções ou violações do limite.
- As 4 verificações feitas pela mesma rota de API usada pelo aplicativo web foram concluídas com sucesso.
- No conjunto automatizado completo, 447 verificações em 81 arquivos de teste passaram e 7 foram ignoradas porque suas condições de execução não estavam disponíveis. Todas as 222 páginas de implantação foram geradas, e também passaram a análise estática, a auditoria de textos nos cinco idiomas, a verificação de segredos e as auditorias de dependências de produção e desenvolvimento.

As chamadas reais ao GPT-5.5 verificaram se os Assistentes de Codificação e Interpretação mantinham os limites de resposta previstos para perguntas preparadas. Elas não garantem a exatidão clínica de todas as perguntas possíveis, e as respostas da IA não foram usadas como gabarito dos cálculos do Sumário Estrutural.

O OpenAI Codex foi usado para implementação e testes repetidos. Claude Opus 4.8 foi usado para revisar a documentação e as evidências dos cálculos antes da publicação. A concordância entre ferramentas não foi tratada como prova; referências profissionais públicas, o escopo do CS adotado por este aplicativo, resultados de cálculo reproduzíveis e revisão humana foram considerados em conjunto.

## UI/UX, privacidade e banco de dados

- Nenhuma nova tela ou campo de entrada foi adicionado.
- As três opções inválidas foram removidas do menu suspenso [Determinants].
- Se um salvamento automático anterior contiver um determinante inválido, o aviso existente identifica a linha e o código, e o cálculo é interrompido.
- Nenhuma nova informação pessoal é coletada.
- Permanece a regra de que os dados de codificação não são armazenados no banco de dados do servidor.
- A estrutura do banco de dados de feedback e os limites de requisição não foram alterados.

## Escopo público e limite de segurança

O código público inclui verificações do limite de entrada, testes de regressão dos cálculos, páginas de referência nos cinco idiomas, instantâneos dos dados de busca e resumos dos testes do GPT-5.5 sem o texto original das perguntas e respostas.

Não são publicados os arquivos originais do início do desenvolvimento, literatura paga ou privada, caminhos locais, chaves de API, variáveis de ambiente, textos completos de respostas nem registros privados de revisão. Os documentos públicos apresentam links apenas para páginas públicas de distribuição reproduzíveis e repositórios públicos oficiais.

## Apêndice técnico

<details>
<summary><strong>Comandos para que desenvolvedores repitam as verificações</strong></summary>

```bash
npm test
npm run lint
npm run build
npm run security:check
npm run docs:evaluate-rag:all
npm run docs:evaluate-hybrid:openai -- --enforce
npm run ai:evaluate-contracts
```

</details>
