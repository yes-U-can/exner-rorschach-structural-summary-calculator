# [2026-08-08] v2.2.10 correção de erros

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## Esta versão

v2.2.10 mantém inalterados os cálculos do Sumário Estrutural, restaura `GHR:PHR` na tela de resultados e no PDF e melhora a legibilidade do PDF.

Esta versão não altera os resultados do Sumário Estrutural. Protocolos existentes inseridos de acordo com as regras não precisam ser recalculados.

## Alterações

### GHR:PHR na Lower Section

O aplicativo já classificava GHR e PHR em cada resposta e mostrava seus totais na Upper Section. Faltava a proporção `GHR:PHR` do formulário de Sumário Estrutural na área Interpersonal da Lower Section.

A tela e o PDF agora mostram `GHR:PHR` depois de `COP` e `AG`, antes de `a:p`. A sequência de decisão e os totais GHR/PHR não mudaram.

### Saída em PDF

- Os cartões comuns da Lower Section usam uma tabela mais simples de duas colunas, com item e valor.
- S-CON, DEPI, CDI, HVI e OBS imprimem uma caixa de resultado geral e divisores mais claros entre critérios.
- O tamanho do texto de HVI foi ajustado para evitar uma quebra de linha de um único caractere.

Essas alterações melhoram a apresentação e a impressão; não mudam fórmulas nem decisões.

## Fontes de cálculo

As duas fontes principais do cálculo são:

1. Exner, J. E., Jr. (2003). *The Rorschach: A Comprehensive System, Volume 1: Basic Foundations and Principles of Interpretation* (4th ed.). John Wiley & Sons.
2. Exner, J. E., Jr. (2001). *A Rorschach Workbook for the Comprehensive System* (5th ed.). Rorschach Workshops.

As páginas da tabela correspondem à numeração impressa em cada publicação.

| Área | Volume 1, 4.ª ed. | Workbook, 5.ª ed. | Escopo no aplicativo |
| --- | --- | --- | --- |
| Determinantes de movimento e famílias M, FM, m | pp. 91-95 | pp. 35-37 | Os qualificadores ativo/passivo são registrados e o Sumário Estrutural mostra os totais por família. |
| Conteúdos múltiplos e limite An/Xy | pp. 126, 128 | pp. 55-56 | A duplicação de conteúdos e os limites Na/Bt/Ls e An/Xy fazem parte deste escopo. |
| Level 1 e 2, CONTAM e vários Special Scores | pp. 135, 138-139, 145 | pp. 62-63, 69-70, 79-80 | Os pares de nível, a exclusividade de CONTAM e o WSum6 fazem parte deste escopo. |
| Decisão GHR/PHR | pp. 143-144 | p. 77 | O cálculo atual segue a sequência de sete etapas. |
| Upper Section | pp. 148-150 | pp. 91-92 | O Sumário Estrutural inclui os totais de Location, DQ, FQ, determinantes, conteúdos e Special Scores. |
| Lower Section | pp. 151-155 | pp. 93-99 | Os cálculos e a apresentação abrangem de Core a Self-Perception. |
| Seis Special Indices | p. 156 | pp. 100-101 | O escopo inclui os critérios e limites de PTI, DEPI, CDI, S-CON, HVI e OBS. |
| Aplicação por idade e ajustes | p. 157 | pp. 100-101 | O profissional continua decidindo a aplicação conforme a idade. |

### Diferença entre edições do PTI

Volume 1, 4.ª edição, p. 156 apresenta o ramo de R alto do quarto critério do PTI como `R > 16` com `WSum6 > 16`. Workbook, 5.ª edição, p. 101 e a saída do RIAP 5 usam `R > 16` com `WSum6 > 17`.

O aplicativo mantém `> 17`, seguindo o Workbook posterior e essa saída.

### S-CON e idade

O S-CON é aplicável a partir dos 15 anos. O aplicativo não coleta a idade do examinando. Ele mostra se os valores inseridos atendem aos critérios; o profissional, com a idade e as informações clínicas completas, decide se o S-CON se aplica.

## Referências e assistente de IA

Os documentos Interpersonal em cinco idiomas agora explicam `GHR:PHR`. Também deixam claro que uma predominância pode descrever um aspecto das representações humanas, mas a proporção isolada não determina o funcionamento interpessoal geral.

O assistente de IA é limitado ao Sistema Compreensivo de Exner. Ele não mistura regras do R-PAS ou de outros sistemas de Rorschach nos cálculos Exner e explica o limite diante de pedidos de diagnóstico, tratamento, julgamento legal ou outras tarefas fora do escopo da calculadora.

## Efeito nos resultados existentes

Protocolos existentes não precisam ser recalculados. Para manter um protocolo anterior no novo formato, basta reabri-lo e gerar o PDF novamente.

## Fontes e direitos autorais

Os documentos públicos apresentam dados bibliográficos e as páginas impressas usadas no cálculo. Eles não reproduzem trechos extensos protegidos por direitos autorais nem material real de avaliação.
