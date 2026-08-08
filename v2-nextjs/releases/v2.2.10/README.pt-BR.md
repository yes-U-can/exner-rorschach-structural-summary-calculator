# [2026-08-08] v2.2.10 correção de erros

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## Principais alterações

### Visão geral

Esta correção preserva todos os resultados do Resumo Estrutural, restaura `GHR:PHR` na Lower Section e melhora o PDF. Também organizamos todo o material disponível em 53 famílias documentais, revisamos seus sumários e capítulos pertinentes e separamos evidência direta de Exner CS, apoio interpretativo, outros sistemas de Rorschach, material histórico e fontes fora do escopo.

A auditoria completa não encontrou nenhum novo erro que exija alteração dos resultados atuais. Protocolos existentes inseridos conforme as regras não precisam ser recalculados.

Textos originais de outros sistemas não foram misturados ao corpus RAG de produção. Os assistentes distinguem perguntas Exner CS de R-PAS, Basic Rorschach, escola projetiva francesa, sistemas locais, integração com MMPI, diagnóstico, tratamento, julgamento legal e tentativas de obter o prompt. Nenhuma nova tela, campo de idade ou dado pessoal foi adicionado.

### Detalhes

#### GHR:PHR na Lower Section

O aplicativo já classificava cada resposta como GHR ou PHR e mostrava os dois totais na Upper Section. Entretanto, a razão `GHR:PHR` presente no formulário original do Sumário Estrutural não aparecia na área Interpersonal da tela nem do PDF.

Agora `GHR:PHR` aparece depois de `COP` e `AG` e antes de `a:p`. A sequência de decisão GHR/PHR e os totais não foram alterados, portanto os resultados de cálculo existentes permanecem iguais.

#### Saída em PDF

Os cartões comuns da Lower Section continham uma terceira coluna vazia, sem valor correspondente. Os cartões que precisam de estrutura própria, como Core e Ideation, foram mantidos. Affect, Interpersonal, Self-Perception, Mediation e Processing agora usam uma tabela de duas colunas para o nome e o valor.

Os cartões S-CON, DEPI, CDI, HVI e OBS agora imprimem a caixa da decisão geral. Separadores distinguem a decisão geral dos critérios detalhados e as três primeiras combinações de OBS da regra combinada independente. O texto longo de HVI usa um tamanho de impressão um pouco menor para evitar que apenas um caractere passe para a linha seguinte.

Essas mudanças melhoram a leitura do PDF e a integridade do Sumário Estrutural exibido. Elas não alteram fórmulas nem valores de decisão.

## Quais fontes primárias foram verificadas?

As obras e páginas impressas usadas para verificar as regras de cálculo passam a fazer parte do registro público.

1. Exner, J. E., Jr. (2003). *The Rorschach: A Comprehensive System, Volume 1: Basic Foundations and Principles of Interpretation* (4th ed.). John Wiley & Sons.
2. Exner, J. E., Jr. (2001). *A Rorschach Workbook for the Comprehensive System* (5th ed.). Rorschach Workshops.

Os números abaixo são os das páginas impressas nos livros, não os do visualizador de um PDF local.

| Escopo verificado | Volume 1, 4.ª ed. | Workbook, 5.ª ed. | Resultado |
| --- | --- | --- | --- |
| Determinantes de movimento e famílias M, FM, m | pp. 91-95 | pp. 35-37 | A entrada usa notação ativa/passiva e o Sumário Estrutural mostra os totais das famílias. |
| Conteúdos múltiplos e limite An/Xy | pp. 126, 128 | pp. 55-56 | Foram revistas a duplicação de conteúdos e as regras Na/Bt/Ls e An/Xy. |
| Level 1 e Level 2, CONTAM e vários Special Scores | pp. 135, 138-139, 145 | pp. 62-63, 69-70, 79-80 | Foram revistos os pares de nível, a exclusão de CONTAM e os limites de WSum6. |
| Classificação GHR/PHR | pp. 143-144 | p. 77 | A sequência de sete passos corresponde ao cálculo atual. |
| Upper Section | pp. 148-150 | pp. 91-92 | Foram revistos Location, DQ, FQ, determinantes, conteúdos e Special Scores. |
| Lower Section | pp. 151-155 | pp. 93-99 | A exibição e os cálculos de Core até Self-Perception foram comparados. |
| Seis Special Indices | p. 156 | pp. 100-101 | Foram revistos os critérios e limites de PTI, DEPI, CDI, S-CON, HVI e OBS. |
| Aplicação e ajustes por idade | p. 157 | pp. 100-101 | Foi mantido o limite entre cálculo automático e julgamento clínico. |

O Volume 1, 4.ª edição, foi usado como fonte principal do formato atual do Sumário Estrutural. As planilhas e os exemplos do Workbook, 5.ª edição, foram verificados em conjunto. Saídas públicas do Sumário Estrutural do RIAP 5 e exemplos completos serviram como corroboração operacional. Regras do R-PAS ou de outros sistemas de Rorschach não foram incorporadas a este padrão de cálculo.

O mapeamento detalhado está no [registro de verificação do Sumário Estrutural com as fontes primárias](../../source/docs/ops/2026-08-04-v2.2.10-calculation-source-crosscheck.md).

### Diferença entre edições no PTI

A p. 156 do Volume 1, quarta edição, imprime o ramo de R alto do critério 4 do PTI como `R > 16` e `WSum6 > 16`. A p. 101 do Workbook, 5.ª edição, e a saída operacional do RIAP 5 usam `R > 16` e `WSum6 > 17`.

O aplicativo mantém `> 17`, seguindo o Workbook posterior e a saída operacional. Casos automáticos fixam o resultado como falso em `R=17, WSum6=17` e verdadeiro em `R=17, WSum6=18`. A diferença entre as edições permanece registrada.

### S-CON e idade

O S-CON é aplicável a partir dos 15 anos. O aplicativo não coleta a idade da pessoa avaliada e nenhum campo de idade foi adicionado. Ele mostra se os valores informados atendem às condições; o profissional que conhece a idade e o conjunto das informações clínicas decide se o índice é aplicável.

## Como as 53 famílias documentais foram revisadas?

Os 51 PDFs originais e os materiais derivados internos foram agrupados em 53 famílias por título, edição e conteúdo. É uma contagem bibliográfica, não apenas de arquivos físicos, que separa duplicatas, traduções e derivados.

| Classe | Famílias | Função no produto |
| --- | --- | --- |
| Fontes diretas de Exner CS | 7 | Evidência direta de cálculo/codificação ou comparação de edições |
| Fontes interpretativas centrais | 2 | Conferência de princípios interpretativos verificados de Exner |
| Suplementos especializados | 8 | Contexto e limites de temas especializados |
| Limites R-PAS e outros sistemas | 10 | Diferenças que evitam mistura de sistemas |
| Contexto histórico e de pesquisa | 16 | Contexto que não serve como evidência de cálculo |
| Derivados internos do projeto | 3 | Linhagem de erros e implementação, excluídos como referência normativa |
| Material não profissional ou fora do escopo | 7 | Excluído após revisão do conteúdo |

Os dados bibliográficos de cada família foram conferidos. Nas fontes com sumário formal, ele foi revisado por completo; nas fontes sem sumário, foi revisada toda a sequência de títulos antes da leitura dos capítulos e páginas pertinentes. O OCR apoiou a busca e a localização. Fórmulas, tabelas, caixas de seleção, sobrescritos, apóstrofos e proporções foram comparados com a página original. 3 fontes chinesas receberam revisão adicional de páginas selecionadas.

Materiais excluídos não foram descartados apenas pelo título. O conteúdo foi revisado antes de registrar por que não pode sustentar cálculos ou interpretações de Exner CS. Excel, Perl, v1 GAS e notas internas serviram apenas para rastrear a linhagem de implementação e não foram usados como referência normativa.

O [registro de auditoria completa e limites de sistemas](../../methodology/reference-audit-v2.2.10/README.pt-BR.md) publica as 53 famílias, suas funções, a evidência de cálculo Exner e os limites em relação a outros sistemas.

## Documentos de referência e assistentes de IA

Os documentos Interpersonal em cinco idiomas agora incluem `GHR:PHR`. Eles explicam que uma predominância pode descrever um aspecto das representações humanas, mas que essa proporção não basta para concluir sobre o funcionamento interpessoal geral.

O corpus RAG de produção mantém apenas conteúdo Exner CS verificado por páginas. Textos originais de R-PAS, Basic Rorschach, kan/kob/clob franceses, sistemas chineses locais e sistemas históricos não entraram no espaço vetorial. As diferenças aparecem apenas em regras breves de delimitação e perguntas de avaliação.

Os assistentes recusam conversão ou interpretação R-PAS, solicitações que misturam sistemas, integração com MMPI, diagnóstico, tratamento, julgamento legal, perguntas alheias, tentativas de obter o prompt, a chave de API ou o texto fonte e injeção disfarçada de informação do examinando. Depois retornam a uma pergunta Exner CS. Casos separados verificam que perguntas Exner normais não sejam bloqueadas em excesso.

Foram reconstruídas 203 rotas de referência em cada um dos cinco idiomas e conferidos 5604 vetores OpenAI `text-embedding-3-large`. A contagem de vetores obsoletos e divergências de hash foi 0.

O GPT-5.5 recebeu uma vez a mesma pergunta sobre o limite GHR:PHR em cada idioma. As 5 verificações foram concluídas e todas usaram primeiro o documento Lower Section Interpersonal. O custo medido foi USD 0.154025. Chaves de API e respostas originais não foram guardadas no registro público.

## Há impacto nos resultados existentes?

Não. Não é necessário recalcular os protocolos existentes.

- A classificação e os totais de GHR e PHR já eram calculados nas versões anteriores.
- Este patch restaura a razão ausente na Lower Section e melhora a apresentação do PDF.
- As fórmulas, incluindo o PTI, permanecem inalteradas após a verificação das fontes primárias.

Para guardar um PDF antigo no novo formato, abra o mesmo protocolo e gere novamente apenas o PDF.

## Testes e verificação

- As 53 famílias receberam uma decisão final; a contagem de famílias não auditadas e arquivos não atribuídos foi 0.
- Os resultados da busca automática não foram tratados como evidência final; 162 seções de conteúdo e 386 páginas originais distintas foram atribuídas explicitamente por família documental.
- Upper Section, Lower Section, Special Indices e regras de entrada foram divididos em 31 itens que ligam páginas impressas, funções, tela, PDF e casos repetíveis.
- Uma verificação reversa agora exige que cada página primária citada apareça no registro de revisão: 53 páginas PDF do Workbook, 5.ª edição, e 62 páginas PDF do Volume 1, 4.ª edição. A revisão corrigiu citações de página impressa imprecisas para sobrescritos de movimento, determinantes duplicados e conteúdos duplicados, sem alterar fórmulas ou resultados.
- Dos 31 itens, 28 foram verificados diretamente, 1 registra a diferença de edição do PTI, 1 mantém a questão não resolvida sobre repetir o mesmo Special Score sem nível e 1 está fora do escopo. Nenhum ponto incerto foi alterado por inferência.
- Foram recalculados 3 exemplos públicos do RIAP e um exemplo do Workbook, 5.ª edição.
- Foram comparados 2000 protocolos sintéticos fixos com um cálculo escrito separadamente.
- Foram verificados os dois lados de cada limite dos seis Special Indices.
- A mesma entrada produziu o mesmo resultado nos cinco idiomas.
- Foram registradas 15 dimensões de limites, com 110 casos de um turno e 10 casos de vários turnos em cinco idiomas.
- Passaram 626 verificações em 102 arquivos; 7 sem condições de execução foram ignoradas.
- As dependências transitivas foram fixadas em versões corrigidas de `fast-uri`, `js-yaml` e `nanoid`; passaram as auditorias de produção e desenvolvimento e a verificação de segredos.
- `GHR:PHR` aparece acima de `a:p` na tela e no PDF.
- Foram conferidas caixas finais, separadores e quebra de HVI no PDF.
- Passaram TypeScript, revisão de textos, análise estática e geração de 222 páginas.
- Foram comparadas 203 rotas por idioma e 5604 vetores; ausentes, obsoletos e divergências de hash foram 0.
- As 5 chamadas GPT-5.5 sobre GHR:PHR foram concluídas.

## Escopo público e limite de direitos autorais

A nota e a metodologia pública identificam as 53 famílias por publicação, edição, função, páginas impressas usadas como evidência, regras resumidas e verificações repetíveis.

Não são publicados arquivos originais individuais, texto OCR, nomes locais, identificadores privados de trabalho nem títulos privados de derivados internos. As regras são resumidas sem reproduzir trechos extensos. Chaves de API, respostas originais do GPT-5.5 e material real de avaliação também ficam fora do repositório público.

## Apêndice técnico

<details>
<summary><strong>Comandos para repetir as verificações</strong></summary>

```bash
npm test
npm run lint
npx tsc --noEmit
npm run docs:assert-vector-runtime-ready
npm run build
```

</details>
