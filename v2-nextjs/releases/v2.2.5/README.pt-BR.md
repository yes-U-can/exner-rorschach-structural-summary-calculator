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

Em um registro hipotético no qual “Uma pessoa está descansando” e “Outra pessoa está deitada dormindo” são codificadas como `Mp H`, o movimento passivo é 2 e o ativo é 0; portanto, a quarta condição é atendida e a tela mostra o CDI como `4, Positive`.

Se, em uma versão anterior, o segundo `Mp` tivesse sido inserido como `M` sem classificação como ativo ou passivo, o total de movimento humano ainda apareceria como 2, mas a frequência passiva seria contabilizada apenas como 1. No mesmo registro situado no limite, a quarta condição deixaria de ser atendida e o CDI poderia aparecer como `3, NO`.

Este exemplo é um registro hipotético formado por apenas duas respostas para demonstrar o limite do cálculo; não é um protocolo completo adequado à interpretação clínica. O profissional classifica o movimento como ativo ou passivo depois de examinar o registro de respostas e o inquérito (Inquiry).

## Correções relacionadas

- As páginas de referência de `M`, `FM` e `m` nos cinco idiomas agora explicam a diferença entre os campos de total do Sumário Estrutural e os códigos inseridos para respostas individuais.
- As explicações complementares na interface e as páginas de referência descrevem a mesma regra de entrada.
- O Assistente de Codificação não apresenta mais `M`, `FM` ou `m` como códigos completos que podem ser inseridos diretamente para uma resposta individual e, em vez disso, pede as informações `a`, `p` ou `a-p` necessárias para completar o código.
- O Assistente de Interpretação explica primeiro o número de respostas e as limitações dos dados diante de perguntas amplas sobre o Sumário Estrutural.

Os assistentes de IA não garantem a exatidão das respostas a todas as perguntas clínicas, e suas respostas não servem como gabarito dos cálculos do Sumário Estrutural.

## Interface e privacidade

- Nenhuma nova tela ou campo de entrada foi adicionado.
- As três opções inválidas foram removidas do menu suspenso [Determinants].
- Se um salvamento automático anterior contiver um determinante inválido, o aviso existente identifica a linha e o código, e o cálculo é interrompido.
- Nenhuma nova informação pessoal é coletada.
- Os dados de codificação salvos automaticamente permanecem apenas no dispositivo da pessoa usuária.
