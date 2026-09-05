# [2026-09-05] v2.2.13 Correção de erros

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## Principais alterações

### Visão geral

A v2.2.13 corrige um problema que permitia incluir no cálculo linhas com valores obrigatórios de codificação ausentes ou com incompatibilidade entre os determinantes e a qualidade formal (FQ). Agora, ao encontrar essas entradas, o aplicativo interrompe o cálculo e indica as linhas que precisam ser conferidas.

As fórmulas do Sumário Estrutural e os pontos de corte dos índices especiais não foram alterados. Registros existentes preenchidos corretamente, de acordo com as regras, não precisam ser recalculados. Já os registros que apresentavam as omissões ou incompatibilidades descritas abaixo precisam ser conferidos com o material original, corrigidos e recalculados.

### Detalhes

#### Linhas com valores obrigatórios de codificação ausentes

Uma linha na qual a codificação de uma resposta já foi iniciada precisa conter localização, qualidade evolutiva (DQ), determinantes e conteúdo. Antes, o cálculo podia prosseguir mesmo que parte desses campos estivesse vazia. Agora, o aplicativo indica as linhas com campos pendentes e só calcula depois que o preenchimento é concluído. As anotações sobre a resposta não passaram a ser obrigatórias.

Quando uma linha incompleta é contada como uma resposta real, o número de respostas (R) e as proporções que o utilizam podem mudar. Se faltarem a localização ou os determinantes, valores que usam esses códigos, como WDA% ou Lambda, também podem ser afetados. Linhas vazias que não foram utilizadas não entram no número de respostas.

**Exemplo: ausência de resposta a uma prancha**

Por exemplo, se realmente não houve resposta à prancha VI, preencher a linha com `none` ou outros códigos não a transforma em uma resposta completa. A opção `none` de FQ representa uma resposta real que não utiliza a forma; não é um código para indicar ausência de resposta.

Excluir essa linha também não muda o fato de que não houve resposta à prancha VI. O critério existente continua o mesmo: cada prancha I–X precisa ter pelo menos uma resposta para que o cálculo seja realizado. É necessário distinguir uma resposta presente no material original que não foi digitada de uma ausência real de resposta durante a aplicação do teste.

#### Linhas com incompatibilidade entre os determinantes e FQ

Uma resposta que utiliza a forma deve receber a FQ correspondente. Por exemplo, ao trocar o determinante de cor pura `C` pelo determinante `FC`, que utiliza forma e cor, a FQ `none` selecionada anteriormente podia permanecer.

Agora, ao mudar para um determinante que utiliza a forma, o valor `none` que tenha permanecido é removido, deixando o campo sem preenchimento. O cálculo pode prosseguir após a conferência do registro de respostas e do inquérito (Inquiry) e a seleção da FQ adequada à resposta original. O aplicativo não estima por conta própria valores como `o`, `u` ou `-`.

Se uma versão salva anteriormente ou outro registro ainda apresentar incompatibilidade entre os determinantes e FQ, o aplicativo também indica as linhas a conferir e interrompe o cálculo. Essas incompatibilidades podem afetar a contagem de qualidade formal, algumas condições do PTI e a classificação GHR/PHR da resposta.

Respostas válidas sem uso de forma continuam sendo aceitas. A FQ `none` pode ser usada tanto em respostas compostas apenas por determinantes sem forma quanto nas respostas de movimento humano sem forma reconhecidas na obra de referência. A mudança não proíbe o uso de `none` de maneira geral.

## É necessário recalcular os resultados existentes?

- Registros que contêm todos os valores obrigatórios de codificação e apresentam determinantes e FQ compatíveis não precisam ser recalculados.
- Registros que tinham valores obrigatórios ausentes ou incompatibilidade entre os determinantes e FQ devem ser corrigidos após a conferência do registro de respostas e do inquérito e, em seguida, recalculados.
- Se realmente não houve resposta a uma prancha, isso não se resolve preenchendo códigos arbitrários ou excluindo a linha. É necessário conferir o material original e seguir o critério existente de preenchimento das pranchas I–X.

Esse problema, por si só, não permite concluir que todos os resultados calculados anteriormente estavam errados. Primeiro, é necessário verificar se o registro apresentava alguma das condições de entrada que podem ser afetadas.

## Fundamentação e limitações clínicas

A relação entre o uso da forma e a FQ se baseia nas obras originais do Sistema Compreensivo de Exner. Respostas que utilizam a forma recebem FQ, e respostas realmente sem forma e movimento humano sem forma são tratados de maneira diferenciada. Também conferimos como as frequências dos códigos de resposta são usadas nos cálculos do Sumário Estrutural e a ordem de classificação GHR/PHR.

- Exner, J. E., Jr. (2003). *The Rorschach: A Comprehensive System, Volume 1: Basic Foundations and Principles of Interpretation* (4th ed.). Wiley. A página impressa 120 fundamenta a relação entre o uso da forma e a FQ; as páginas 143–144, a classificação GHR/PHR; a página 151, R e Lambda; a página 154, as proporções de qualidade formal; e a página 156, as condições do PTI.
- Exner, J. E., Jr. (2001). *A Rorschach Workbook for the Comprehensive System* (5th ed.). Rorschach Workshops. Consultamos o procedimento de elaboração do Sumário Estrutural e os exemplos completos das páginas impressas 91–101.

Confirmamos que entradas com omissões ou incompatibilidades são bloqueadas e que respostas válidas sem forma são aceitas; os exemplos completos do Sumário Estrutural das obras originais mantêm os mesmos resultados de antes. No entanto, passar pela verificação de entrada não significa que a codificação de cada resposta esteja clinicamente correta. A codificação e a interpretação finais exigem o julgamento de um profissional que examine a resposta original, o inquérito e o conjunto dos dados clínicos.

O tratamento dos dados pessoais, a disposição da tela e os campos de entrada não foram alterados. Também incorporamos atualizações de segurança dos componentes de software utilizados pelo aplicativo. Este serviço não substitui o julgamento clínico profissional.

## IA utilizada no desenvolvimento e na revisão

Utilizamos OpenAI GPT-6 Astra no desenvolvimento e na verificação desta versão, e Anthropic Fable 5.1 na revisão independente. O modelo e o funcionamento do assistente de IA oferecido no aplicativo web permanecem inalterados.
