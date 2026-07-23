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

- Os documentos de referência de localização `S`, determinantes de movimento e Qualidade Formal nos cinco idiomas passaram a declarar, com o mesmo conteúdo, as regras de entrada descritas acima.
- Foi introduzida uma lista de regras que verifica automaticamente se os documentos nos cinco idiomas declaram as mesmas regras clínicas. Agora, se o documento de apenas um idioma for corrigido e os demais forem esquecidos, a verificação falha na etapa de geração dos documentos.
- As regras de resposta do Assistente de Codificação foram reforçadas para que ele não apresente o `S` isolado, a duplicação na mesma família de movimento ou a Qualidade Formal em branco como códigos completos.
- Depois da alteração dos documentos de referência, os dados de busca nos cinco idiomas e os embeddings da OpenAI foram todos reconstruídos.
- Foram corrigidos erros de digitação e grafias de termos nos documentos em espanhol e em português, além de títulos em inglês que permaneciam em quatro pontos dos documentos em japonês.
- Uma marcação de status que não era realmente usada foi removida dos originais dos documentos de referência, e foi adicionada uma verificação do intervalo permitido para os valores de status dos documentos.

## Testes e verificação

As regras de cálculo foram verificadas com materiais públicos.

- Nas sequências de codificação do relatório de exemplo oficial do RIAP v5, foi confirmado que o espaço em branco sempre aparece combinado com uma localização básica, como `WS` e `DdS`.
- No mesmo exemplo, foi confirmado que `none` é contabilizado como categoria formal na tabela de Qualidade Formal e que o S-CON é declarado como aplicável a pessoas com mais de 14 anos.
- As regras ativo-passivo dos determinantes de movimento e as condições de aplicação de `a-p` foram confirmadas em literatura clínica pública que reproduz o conteúdo da obra original de Exner.
- Foi confirmado que os valores do Sumário Estrutural de um caso público de 20 respostas são calculados de forma idêntica antes e depois deste patch.

O bloqueio de entrada e os avisos nos cinco idiomas também foram verificados na tela real.

- O `S` isolado não aparece nas opções de localização.
- Ao escolher um código de uma família de movimento, os demais códigos da mesma família são exibidos como não selecionáveis.
- Para qualquer determinante, um código já selecionado é exibido como não selecionável nos demais campos.
- Quando a Qualidade Formal está em branco, o cálculo é interrompido e as linhas que precisam de revisão são indicadas. Os textos de aviso dos cinco idiomas foram verificados um a um na tela real.
- Um `S` isolado, códigos de movimento duplicados ou Qualidade Formal em branco remanescentes em dados antigos salvos automaticamente também são indicados da mesma forma, sem alterar o original.

Os dados de busca nos cinco idiomas e os assistentes de IA também foram verificados.

- As 380 perguntas de busca nos documentos de referência recuperaram os documentos correspondentes.
- Os 5,604 embeddings da OpenAI foram reconstruídos a partir do novo texto; as divergências no hash do conteúdo e os embeddings desatualizados foram 0.
- Na busca híbrida com embeddings reais, a taxa de acerto dos primeiros documentos foi de 100% tanto para perguntas amplas quanto para perguntas com nome explícito.
- Perguntas representativas sobre o `S` isolado, a duplicação de códigos de movimento e a Qualidade Formal em branco foram chamadas de fato nos cinco idiomas; nas 15 chamadas, foi confirmado que nenhuma resposta violou as regras.
- No conjunto automatizado completo, 476 verificações em 83 arquivos de teste passaram e 7 foram ignoradas porque suas condições de execução não estavam disponíveis. A compilação de produção, a análise estática do código, a auditoria de textos nos cinco idiomas e a verificação de segredos também passaram.

A notação do Lambda como número de respostas de F pura é uma forma de relatório de software na qual vários materiais públicos coincidem. O alcance da evidência verificada por vias públicas e as limitações restantes foram registrados tal como estão no documento de verificação.

O OpenAI Codex e o Claude Fable 5 foram usados para a implementação e os testes repetidos, e o Claude Fable 5 para a revisão da documentação e das evidências dos cálculos antes da publicação. A concordância entre as ferramentas não foi tratada como gabarito; os critérios foram materiais profissionais públicos e resultados de cálculo reproduzíveis.

## UI/UX, privacidade e escopo do cálculo

- Nenhuma nova tela ou campo de entrada foi adicionado.
- O `S` isolado foi removido das opções de [Location], e a seleção duplicada na mesma família de movimento é indicada por exibição desativada.
- Os resultados de cálculo dos protocolos existentes inseridos conforme as regras não mudam.
- Nenhuma nova informação pessoal é coletada.
- Permanece o princípio existente de não armazenar dados de codificação nem chaves API no banco de dados do servidor.

## Escopo público e limite de segurança

O código público inclui as verificações do limite de entrada, os testes de regressão dos cálculos, os documentos de referência nos cinco idiomas com a lista de verificação de equivalência das regras e os instantâneos dos dados de busca.

Variáveis de ambiente de produção, chaves API, textos originais de perguntas e respostas reais de IA, registros privados de revisão e caminhos locais não são publicados.

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
