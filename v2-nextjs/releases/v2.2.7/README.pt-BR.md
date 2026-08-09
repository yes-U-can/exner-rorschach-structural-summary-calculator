# [2026-07-23] v2.2.7 Correção de erros

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## Principais alterações

### Visão geral

Este patch corrige um problema em que três entradas incompletas da tabela de codificação podiam seguir diretamente para o cálculo.

- Em **[Location]**, era possível selecionar a resposta de espaço em branco como `S` isolado. Agora as opções de localização oferecem apenas `W`, `WS`, `D`, `DS`, `Dd` e `DdS`.
- Em **[Determinants]**, era possível inserir dois ou mais códigos da mesma família de movimento em uma única resposta (por exemplo, `Ma` e `Mp`). Agora, ao escolher um código de uma família, os demais códigos da mesma família não podem ser selecionados. A inserção do mesmo determinante repetido em dois campos também é bloqueada (por exemplo, `FC` duas vezes).
- Era possível calcular com **[FQ]** deixado em branco. Agora é necessário selecionar `+`, `o`, `u`, `-` ou `none` para que o cálculo seja realizado.

Nos registros em que todas as respostas são de forma pura (`F`), o Lambda passa a ser informado como o número de respostas de F pura em vez do símbolo de infinito (`∞`).

Os protocolos existentes em que a localização, os determinantes de movimento e a Qualidade Formal foram inseridos conforme as regras não são afetados por este problema e não precisam ser recalculados. Se dados antigos salvos automaticamente contiverem um `S` isolado, códigos duplicados da mesma família de movimento ou Qualidade Formal em branco, o aplicativo preserva a entrada original, interrompe o cálculo e indica, com avisos nos cinco idiomas, as linhas que precisam de revisão.

### Por que esse problema era importante?

**`S` isolado.** No Sistema Compreensivo de Exner, o uso do espaço em branco não é uma localização independente, mas uma notação acrescentada à localização básica, e a resposta é sempre registrada como `WS`, `DS` ou `DdS`. Em versões anteriores, quando a localização era inserida apenas como `S`, ela era contabilizada na frequência de espaço em branco, mas não era captada em nenhuma das localizações básicas `W`, `D` ou `Dd`; assim, valores que usam as localizações básicas, como `W:D:Dd` e `WDA%`, podiam ser calculados abaixo dos valores reais.

**Duplicação na mesma família de movimento.** O determinante de movimento de uma resposta individual é registrado, em cada família, com uma de três qualidades: ativa `a`, passiva `p` ou ativa-passiva `a-p`. Quando dois objetos diferentes mostram, cada um, movimento ativo e movimento passivo, não se inserem `Ma` e `Mp` separadamente: registra-se um único `Ma-p`. Em versões anteriores, quando `Ma` e `Mp` eram inseridos juntos em campos separados, a frequência de movimento humano era contabilizada duas vezes, de modo que o valor à esquerda de EB, EA, `a:p`, `Ma:Mp` e outros podiam ser calculados acima dos valores reais. O simples fato de um mesmo objeto apresentar os dois tipos de movimento não resulta automaticamente em `a-p`; qual movimento determina a codificação é confirmado no registro de respostas e no inquérito (Inquiry). Quando o mesmo determinante era inserido duas vezes, o valor correspondente também podia ser contabilizado duas vezes; por isso, agora cada determinante é registrado apenas uma vez por resposta.

**Qualidade Formal em branco.** `none` é uma categoria oficial de Qualidade Formal usada para respostas que não são codificadas com base na forma, enquanto o campo em branco é uma entrada cuja codificação ainda não foi concluída. Em versões anteriores, quando a Qualidade Formal ficava em branco, a resposta não era captada em nenhum dos totais de Qualidade Formal, mas era incluída no número total de respostas; assim, valores como `XA%`, `X+%` e `WDA%` podiam ser calculados abaixo dos valores reais. Se a forma não é a base da codificação da resposta, agora `none` é selecionado diretamente.

**Lambda quando todas as respostas são F pura.** O Lambda é `F pura ÷ (total de respostas − F pura)`; portanto, quando todas as respostas são F pura, o denominador é 0. A tela informa o número de respostas de F pura em vez do símbolo de infinito. Por exemplo, se as 17 respostas são todas F pura, o valor exibido é `17.00`. Esse limite praticamente não ocorre na aplicação padrão, e trata-se de uma notação de software adotada para não usar o símbolo de infinito como valor de relatório clínico.

### Correções relacionadas

- Os documentos de referência em cinco idiomas sobre localização `S`, determinantes de movimento e Qualidade Formal explicam essas regras de entrada.
- O Assistente de Codificação não apresenta o `S` isolado, a duplicação na mesma família de movimento nem a Qualidade Formal em branco como códigos completos.

## Fundamento clínico

- Nas sequências de codificação do relatório de exemplo oficial do RIAP v5, o espaço em branco sempre aparece combinado com uma localização básica, como `WS` e `DdS`.
- No mesmo exemplo, `none` é contabilizado como categoria formal na tabela de Qualidade Formal, e o S-CON é declarado como aplicável a pessoas com mais de 14 anos.
- A literatura clínica pública que reproduz o conteúdo da obra original de Exner descreve as regras ativo-passivo dos determinantes de movimento e as condições de aplicação de `a-p`.
- A notação do Lambda como número de respostas de F pura é uma forma de relatório de software na qual vários materiais públicos coincidem.

Esses materiais fundamentam as regras de entrada; a codificação de cada resposta e a aplicação efetiva dos índices dependem do julgamento do profissional clínico.

## Interface, privacidade e escopo do cálculo

- Nenhuma nova tela ou campo de entrada foi adicionado.
- O `S` isolado foi removido das opções de [Location], e a seleção duplicada na mesma família de movimento é indicada por exibição desativada.
- Os resultados de cálculo dos protocolos existentes inseridos conforme as regras não mudam.
- Nenhuma nova informação pessoal é coletada.
- Os dados de codificação salvos automaticamente permanecem apenas no dispositivo. A chave de API é usada de forma criptografada em uma conexão de IA por no máximo 24 horas e é apagada quando a conexão termina.
