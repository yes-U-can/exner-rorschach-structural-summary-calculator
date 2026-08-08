# Auditoria completa das fontes e delimitação de sistemas da v2.2.10

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

Na v2.2.10, deixamos de verificar apenas um pequeno conjunto de fontes primárias. Organizamos todo o material disponível em 53 famílias documentais e revisamos seus sumários e capítulos pertinentes. Este documento registra quais fontes sustentam os cálculos e quais são usadas apenas para interpretação, delimitação de sistemas, contexto histórico ou exclusão.

**A auditoria completa não encontrou nenhum novo defeito que exija alteração dos resultados atuais do Resumo Estrutural. Protocolos existentes inseridos de acordo com as regras de codificação não precisam ser recalculados.**

## Método de auditoria

- Título, autoria, edição, editora, ano e idioma foram conferidos nas páginas iniciais de cada fonte.
- Nas fontes com sumário formal, ele foi revisado por completo; nas fontes sem sumário, foi revisada toda a sequência de títulos. Depois, lemos os capítulos pertinentes. Fórmulas, tabelas, caixas de seleção, sobrescritos, apóstrofos e proporções foram comparados com a página original.
- O OCR foi usado para busca e localização, mas nunca prevaleceu sobre a página original.
- Materiais excluídos não foram descartados apenas pelo título. O sumário e o conteúdo foram verificados antes de registrar por que não podem sustentar cálculos ou interpretações do Sistema Compreensivo de Exner.
- Excel, Perl, v1 GAS e notas internas foram usados apenas para rastrear a linhagem de implementação, nunca como referência normativa do cálculo.

A busca automática inicial foi usada apenas para gerar páginas candidatas. Uma revisão inversa encontrou candidatos vindos de referências e outras seções finais; por isso, os títulos de seção e as páginas originais das 53 famílias documentais foram conferidos nas fontes e reatribuídos. O registro final vincula 162 seções de conteúdo e 386 páginas originais distintas; nenhuma evidência final depende apenas de uma correspondência genérica de palavras-chave.

## Hierarquia de evidências

As principais fontes diretas para o escopo atual são a 4.ª edição de *The Rorschach: A Comprehensive System, Volume 1* e a 5.ª edição de *A Rorschach Workbook for the Comprehensive System*. A 3.ª edição de Volume 1 é mantida apenas para diferenças entre edições e linhagem de implementação. Traduções e obras interpretativas apoiam a conferência de terminologia e princípios de interpretação. R-PAS e outros sistemas são usados somente para manter suas regras separadas do Sistema Compreensivo de Exner.

## Classificação das 53 famílias documentais

| Classe | Famílias | Função no produto |
| --- | --- | --- |
| Fonte direta de Exner CS | 7 | Evidência direta de cálculo/codificação ou comparação de edições |
| Fonte interpretativa central | 2 | Conferência de princípios interpretativos verificados de Exner |
| Suplemento especializado | 8 | Contexto e limites de tema especializado |
| Limite R-PAS ou outro sistema | 10 | Conferência de diferenças para evitar mistura de sistemas |
| Contexto histórico ou de pesquisa | 16 | Contexto, não evidência de cálculo |
| Derivado interno do projeto | 3 | Rastreamento de erros, excluído como referência normativa |
| Não profissional ou fora do escopo | 7 | Excluído após revisão do conteúdo |

## Registro público por família documental

Os números abaixo são números públicos de sequência. Nomes de arquivos locais, caminhos de armazenamento, PDFs originais e texto OCR não são publicados.

| N.º | Informação bibliográfica | Classe | Sistema ou abordagem | Tratamento no produto |
| --- | --- | --- | --- | --- |
| 1 | George A. De Vos; L. Bryce Boyer. *Symbolic Analysis Cross-Culturally: The Rorschach Test*; University of California Press; 1989; en | Contexto histórico ou de pesquisa | Contexto histórico ou de pesquisa | Excluído do RAG de produção |
| 2 | Damion Searls. *The Inkblots: Hermann Rorschach, His Iconic Test, and the Power of Seeing*; Crown Publishers; 2017; en | Não profissional ou fora do escopo | Fora do escopo do produto | Excluído do RAG de produção |
| 3 | Michael A. Britt. *Psych Experiments: From Pavlov's Dogs to Rorschach's Inkblots, Put Psychology's Most Fascinating Studies to the Test*; Adams Media; 2017; en | Não profissional ou fora do escopo | Fora do escopo do produto | Excluído do RAG de produção |
| 4 | Luciano Giromini; Alessandro Zennaro. *Il test di Rorschach: applicazioni e nuovi ambiti di intervento nel terzo millennio*; il Mulino; 2019; it | Limite R-PAS ou outro sistema | R-PAS | Somente regras de delimitação; texto original excluído do RAG |
| 5 | Joni L. Mihura; Gregory J. Meyer. *Using the Rorschach Performance Assessment System (R-PAS)*; The Guilford Press; 2018; en | Limite R-PAS ou outro sistema | R-PAS | Somente regras de delimitação; texto original excluído do RAG |
| 6 | Jessie Francis-Williams. *Rorschach with Children: A Comparative Study of the Contribution Made by the Rorschach and Other Projective Techniques to Clinical Diagnosis in Work with Children*; First edition; Pergamon Press; 1968; en | Contexto histórico ou de pesquisa | Contexto histórico ou de pesquisa | Excluído do RAG de produção |
| 7 | Ronald J. Ganellen. *Integrating the Rorschach and the MMPI-2 in Personality Assessment*; Routledge edition; Routledge; 2012; en | Suplemento especializado | Integração Exner CS/MMPI-2 | Excluído do RAG de produção |
| 8 | Lowell M. Wiese. *Rorschach Test Scores as Indicators of Intelligence*; Master's thesis; University of Wyoming; 1951; en | Contexto histórico ou de pesquisa | Contexto histórico ou de pesquisa | Excluído do RAG de produção |
| 9 | Wesley A. Dunn. *A Comparison Between Certain Rorschach Factors, Orientation Scores, and College Grades*; Doctoral dissertation; Purdue University; 1951; en | Contexto histórico ou de pesquisa | Contexto histórico ou de pesquisa | Excluído do RAG de produção |
| 10 | Barbara MacMichael Stewart. *A Study of the Relationship Between Clinical Manifestations of Neurotic Anxiety and Rorschach Test Performance*; Doctoral dissertation; University of Southern California; 1950; en | Contexto histórico ou de pesquisa | Contexto histórico ou de pesquisa | Excluído do RAG de produção |
| 11 | Paul M. Lerner. *Psychoanalytic Theory and the Rorschach*; The Analytic Press; 1991; en | Contexto histórico ou de pesquisa | Contexto histórico ou de pesquisa | Excluído do RAG de produção |
| 12 | John E. Exner Jr. (editor). *Issues and Methods in Rorschach Research*; Lawrence Erlbaum Associates; 1995; en | Suplemento especializado | Campo especializado ou adjacente | Excluído do RAG de produção |
| 13 | Irving B. Weiner. *Principles of Rorschach Interpretation, Second Edition*; Second edition; Lawrence Erlbaum Associates; 2003; en | Fonte interpretativa central | Interpretação Exner CS | Somente apoio interpretativo Exner verificado |
| 14 | John E. Exner Jr. *The Rorschach: A Comprehensive System, Volume 2: Interpretation, Second Edition*; Second edition; John Wiley & Sons; 1991; en | Fonte direta de Exner CS | Sistema Compreensivo de Exner | Somente apoio interpretativo Exner verificado |
| 15 | John E. Exner Jr.; Irving B. Weiner. *The Rorschach: A Comprehensive System, Volume 3: Assessment of Children and Adolescents*; John Wiley & Sons; 1982; en | Fonte direta de Exner CS | Sistema Compreensivo de Exner | Excluído do corpus de produção para adultos |
| 16 | J. Reid Meloy; Marvin W. Acklin; Carl B. Gacono; James F. Murray; Charles A. Peterson. *Contemporary Rorschach Interpretation*; Lawrence Erlbaum Associates; 1997; en | Suplemento especializado | Campo especializado ou adjacente | Excluído do RAG de produção |
| 17 | James H. Kleiger. *Disordered Thinking and the Rorschach: Theory, Research, and Differential Diagnosis*; The Analytic Press; 1999; en | Suplemento especializado | Campo especializado ou adjacente | Excluído do RAG de produção |
| 18 | John E. Exner Jr.; Manuel Esbert Ramírez (translator). *Manual de Codificación del Rorschach para el Sistema Comprehensivo*; Third Spanish edition; source original fifth edition; Editorial Psimática; 2008; es | Fonte direta de Exner CS | Sistema Compreensivo de Exner | Somente conferência terminológica; texto original excluído do RAG |
| 19 | Rajendra K. Misra; Meena K. Kharkwal; Maurita A. Kilroy; Komilla Thapa. *Rorschach Test: Theory and Practice*; SAGE Publications; 1996; en | Contexto histórico ou de pesquisa | Contexto histórico ou de pesquisa | Excluído do RAG de produção |
| 20 | John E. Exner Jr.; 孟宪璋 (translator); 唐迎婵 (translator). *罗夏测验综合系统工作手册（原书第5版）*; First Chinese edition; source original fifth edition; Jinan University Press; 2013; zh | Fonte direta de Exner CS | Sistema Compreensivo de Exner | Somente conferência terminológica; texto original excluído do RAG |
| 21 | John E. Exner Jr.; 孟宪璋 (translator); 任滨海 (translator); 刘浩鑫 (translator). *罗夏测验解释入门*; First Chinese edition; Jinan University Press; 2013; zh | Fonte interpretativa central | Interpretação Exner CS | Somente conferência terminológica; texto original excluído do RAG |
| 22 | John E. Exner Jr. *A Rorschach Workbook for the Comprehensive System, Fifth Edition*; Fifth edition; Rorschach Workshops; 2001; en | Fonte direta de Exner CS | Sistema Compreensivo de Exner | Evidência Exner somente após verificação por páginas |
| 23 | Ewald Bohm; Anne G. Beck (translator); Samuel J. Beck (translator). *A Textbook in Rorschach Test Diagnosis: For Psychologists, Physicians and Teachers*; Grune & Stratton; 1958; en | Contexto histórico ou de pesquisa | Sistema histórico de Bohm | Excluído do RAG de produção |
| 24 | Eric A. Zillmer; Molly Harrower; Barry A. Ritzler; Robert P. Archer. *The Quest for the Nazi Personality: A Psychological Investigation of Nazi War Criminals*; Routledge digital printing; Routledge; 2009; en | Não profissional ou fora do escopo | Fora do escopo do produto | Excluído do RAG de produção |
| 25 | Katherine A. Hubbard. *Queer Ink: A Blotted History Towards Liberation*; Routledge; 2020; en | Não profissional ou fora do escopo | Fora do escopo do produto | Excluído do RAG de produção |
| 26 | Carl B. Gacono; J. Reid Meloy. *The Rorschach Assessment of Aggressive and Psychopathic Personalities*; Routledge edition; Routledge; 2012; en | Suplemento especializado | Campo especializado ou adjacente | Excluído do RAG de produção |
| 27 | Carl B. Gacono (editor); F. Barton Evans (editor); Nancy Kaser-Boyd; Lynne A. Gacono. *The Handbook of Forensic Rorschach Assessment*; Lawrence Erlbaum Associates; 2008; en | Suplemento especializado | Campo especializado ou adjacente | Excluído do RAG de produção |
| 28 | Jessica R. Gurley. *Essentials of Rorschach Assessment: Comprehensive System and R-PAS*; John Wiley & Sons; 2017; en | Limite R-PAS ou outro sistema | Comparação CS/R-PAS | Somente regras de delimitação; texto original excluído do RAG |
| 29 | Joni L. Mihura (editor); Gregory J. Meyer (editor). *Uso del sistema de evaluación del desempeño de Rorschach (R-PAS)*; Derivado em espanhol; edição não verificada; Dados de publicação não verificados; 2018 (data de copyright da fonte); es | Limite R-PAS ou outro sistema | Derivado de R-PAS | Somente regras de delimitação; texto original excluído do RAG |
| 30 | Gregory J. Meyer; Donald J. Viglione; Joni L. Mihura; Robert E. Erard; Philip Erdberg. *R-PAS (Rorschach Performance Assessment System): Administration, Coding, Interpretation, and Technical Manual*; First edition; R-PAS LLC; 2011; en | Limite R-PAS ou outro sistema | R-PAS | Somente regras de delimitação; texto original excluído do RAG |
| 31 | Florence Halpern. *A Clinical Approach to Children's Rorschachs*; Grune & Stratton; 1953; en | Contexto histórico ou de pesquisa | Contexto histórico ou de pesquisa | Excluído do RAG de produção |
| 32 | Shira Tibon-Czopp; Irving B. Weiner. *Rorschach Assessment of Adolescents: Theory, Research, and Practice*; Springer Science+Business Media New York; 2016; en | Suplemento especializado | Campo especializado ou adjacente | Excluído do RAG de produção |
| 33 | Nettie Herrington Ledwith. *Rorschach Responses of Elementary School Children: A Normative Study*; University of Pittsburgh Press; 1959; en | Contexto histórico ou de pesquisa | Contexto histórico ou de pesquisa | Excluído do RAG de produção |
| 34 | Louise Bates Ames; Janet Learned; Ruth W. Metraux; Richard N. Walker. *Child Rorschach Responses: Developmental Trends from Two to Ten Years*; Paul B. Hoeber; 1952; en | Contexto histórico ou de pesquisa | Contexto histórico ou de pesquisa | Excluído do RAG de produção |
| 35 | Louise Bates Ames; Ruth W. Metraux; Janet Learned Rodell; Richard N. Walker. *Rorschach Responses in Old Age, Revised Edition*; Revised edition; Brunner/Mazel; 1973; en | Contexto histórico ou de pesquisa | Contexto histórico ou de pesquisa | Excluído do RAG de produção |
| 36 | Hermann Rorschach; Paul Lemkau (translator); Bernard Kronenberg (translator). *Psychodiagnostics: A Diagnostic Test Based on Perception, Including Rorschach's Paper, The Application of the Form Interpretation Test*; Sixth edition; Hans Huber; United States edition by Grune & Stratton; 1964; en | Contexto histórico ou de pesquisa | Método original anterior aos sistemas | Excluído do RAG de produção |
| 37 | Naamah Akavia. *Subjectivity in Motion: Life, Art, and Movement in the Work of Hermann Rorschach*; Routledge; 2013; en | Não profissional ou fora do escopo | Fora do escopo do produto | Excluído do RAG de produção |
| 38 | Florence R. Miale; Michael Selzer. *The Nuremberg Mind: The Psychology of the Nazi Leaders*; First paperback printing; Quadrangle/The New York Times Book Co.; 1977; en | Não profissional ou fora do escopo | Fora do escopo do produto | Excluído do RAG de produção |
| 39 | James P. Choca. *The Rorschach Inkblot Test: An Interpretive Guide for Clinicians*; First edition; American Psychological Association; 2013; en | Suplemento especializado | Campo especializado ou adjacente | Excluído do RAG de produção |
| 40 | Edward Aronow; Marvin Reznikoff; Kevin Moreland. *The Rorschach Technique: Perceptual Basics, Content Interpretation, and Applications*; Allyn and Bacon; 1994; en | Contexto histórico ou de pesquisa | Abordagem Aronow-Reznikoff-Moreland | Excluído do RAG de produção |
| 41 | Anne Bar Din. *La prueba de Rorschach: Un manual de aplicación pluricultural*; First edition; Siglo XXI Editores; 2001; es | Limite R-PAS ou outro sistema | Abordagem pluricultural não Exner | Somente regras de delimitação; texto original excluído do RAG |
| 42 | Hellmut Brinkmann Sch. *El Test de Rorschach: Introducción a su estudio y utilización*; First edition; RIL Editores; 2014; es | Contexto histórico ou de pesquisa | Abordagem mista não Exner | Excluído do RAG de produção |
| 43 | Robin Groody. *Segredos dos Testes de Rorschach e Zulliger*; Version 2; Self-distributed; no professional publisher identified; 2003; pt | Não profissional ou fora do escopo | Material não profissional para manipular o teste | Excluído do RAG de produção |
| 44 | James P. Choca; Edward D. Rossini. *Assessment Using the Rorschach Inkblot Test*; American Psychological Association; 2018; en | Limite R-PAS ou outro sistema | Abordagem Basic Rorschach/Herm | Somente regras de delimitação; texto original excluído do RAG |
| 45 | 杨东; 吉沉洪. *实用罗夏墨迹测验*; First edition; Chongqing Publishing House; 2008; zh | Limite R-PAS ou outro sistema | Abordagem chinesa local não Exner | Somente regras de delimitação; texto original excluído do RAG |
| 46 | Louise Bates Ames; Ruth W. Metraux; Richard N. Walker. *Adolescent Rorschach Responses: Developmental Trends from Ten to Sixteen Years*; Second printing; introduction describes a second edition; Brunner/Mazel; 1971; en | Contexto histórico ou de pesquisa | Contexto histórico ou de pesquisa | Excluído do RAG de produção |
| 47 | François-David Camps; Gaëlle Malle. *S'entraîner à la cotation du Rorschach et du TAT*; Dunod; 2020; fr | Limite R-PAS ou outro sistema | Escola projetiva francesa | Somente regras de delimitação; texto original excluído do RAG |
| 48 | Damion Searls. *Teste de Rorschach: A Origem*; Dados de publicação e tradução não verificados; Sem data; pt | Limite R-PAS ou outro sistema | Derivado em português não verificado | Somente regras de delimitação; texto original excluído do RAG |
| 49 | Material derivado interno 1 (privado) | Derivado interno do projeto | Registro interno de erros | Excluído do RAG de produção |
| 50 | Material derivado interno 2 (privado) | Derivado interno do projeto | Nota interpretativa interna sem fonte confirmada | Excluído do RAG de produção |
| 51 | Material derivado interno 3 (privado) | Derivado interno do projeto | Derivado interno de CS sem fonte confirmada | Excluído do RAG de produção |
| 52 | John E. Exner Jr. *The Rorschach: A Comprehensive System, Volume 1: Basic Foundations, Third Edition*; Third edition; John Wiley & Sons; 1993; en | Fonte direta de Exner CS | Sistema Compreensivo de Exner | Somente linhagem de edições e regras; texto original excluído do RAG |
| 53 | John E. Exner Jr. *The Rorschach: A Comprehensive System, Volume 1: Basic Foundations and Principles of Interpretation, Fourth Edition*; Fourth edition; John Wiley & Sons; 2003; en | Fonte direta de Exner CS | Sistema Compreensivo de Exner | Evidência Exner somente após verificação por páginas |

## Evidência de cálculo de Exner

Upper Section, Lower Section, Special Indices e as regras de entrada foram verificados novamente nas páginas impressas abaixo. São páginas impressas do livro, não números do visualizador de PDF.

| Escopo | Evidência direta | Resultado |
| --- | --- | --- |
| Administração, codificação e Resumo Estrutural | Volume 1, 4.ª ed., pp. impressas 68-157; Workbook, 5.ª ed., capítulos pertinentes e pp. impressas 91-101 | As regras de entrada e todo o Resumo Estrutural foram vinculados a funções, tela, PDF e testes. |
| Upper Section | Volume 1, 4.ª ed., pp. impressas 148-150; Workbook, 5.ª ed., pp. impressas 91-92 | Foram verificados os totais de Location, DQ, FQ, determinantes, conteúdos, Special Scores e Z. |
| Lower Section | Volume 1, 4.ª ed., pp. impressas 151-155; Workbook, 5.ª ed., pp. impressas 93-99 | Foram verificados cálculos e apresentação de Core a Self-Perception, e a apresentação ausente de `GHR:PHR` foi restaurada. |
| Special Indices | Volume 1, 4.ª ed., p. impressa 156; Workbook, 5.ª ed., pp. impressas 100-101 | Foram conferidas as condições e os limites de PTI, DEPI, CDI, S-CON, HVI e OBS. |
| Aplicabilidade por idade e ajustes | Volume 1, 4.ª ed., p. impressa 157; Workbook, 5.ª ed., pp. impressas 100-101 | Mantém-se o limite atual: a calculadora mostra o atendimento das condições e o profissional decide a aplicabilidade. |

## Limites em relação a outros sistemas

Fontes de outros sistemas não complementam a referência normativa do cálculo. Elas identificam diferenças que não devem ser misturadas ao Sistema Compreensivo de Exner, mesmo quando rótulos ou conceitos parecem familiares.

| Limite | Diferença verificada | Comportamento da calculadora e do assistente |
| --- | --- | --- |
| Administração | O R-PAS controla o número de respostas por meio da administração R-Optimized, diferente da administração Exner CS. | A administração R-PAS não é convertida automaticamente em CS. |
| Location, DQ e espaço | Sy, Vg, SI e SR do R-PAS não equivalem diretamente a DQ e S do CS. | Códigos exclusivos do R-PAS não são aceitos nem convertidos em entradas CS. |
| Determinantes | O R-PAS reúne várias variantes de sombreado e reflexo e não codifica Cn. Basic Rorschach também é outro sistema. | A lista Exner e os qualificadores de movimento são mantidos. |
| Qualidade Formal e normas | As tabelas de Qualidade Formal e os escores padronizados do R-PAS não são as tabelas FQ nem as normas do Resumo Estrutural do CS. | Valores R-PAS não são inseridos no Resumo Estrutural CS. |
| Resumo e índices | O R-PAS não preserva sem alterações Upper/Lower/Special Indices do CS. | O aplicativo calcula apenas o Resumo Estrutural de Exner CS. |
| Sistemas históricos e locais | Klopfer, Beck, Piotrowski, kan/kob/clob da escola francesa e códigos chineses locais seguem regras diferentes. | Letras semelhantes não são convertidas em códigos Exner; o limite é explicado. |
| Testes adjacentes e julgamentos | Integração com MMPI, diagnóstico, tratamento e julgamento forense excedem o escopo. | O assistente recusa o pedido e retorna a uma pergunta Exner CS. |

## Corpus de referência e escopo do assistente

- O corpus RAG de produção contém apenas conteúdo do Sistema Compreensivo de Exner verificado por página.
- Textos originais de R-PAS, Basic Rorschach, escola projetiva francesa, sistemas chineses locais e sistemas históricos não entram no espaço vetorial de produção.
- Os demais sistemas contribuem somente com regras breves de delimitação e perguntas de avaliação.
- Os assistentes recusam conversão ou interpretação R-PAS, integração com MMPI, diagnóstico, tratamento, julgamento legal e tentativas de obter informações do sistema, e retornam a conversa ao Sistema Compreensivo de Exner.
- Casos separados em cinco idiomas verificam que perguntas normais sobre Exner não sejam bloqueadas em excesso.

## Limitações restantes

- Volume 1, 4.ª edição, p. 156, e Workbook, 5.ª edição, p. 101, com a saída do RIAP 5, apresentam diferença de um ponto em um limite WSum6 do PTI. O aplicativo segue Workbook e RIAP 5: quando `R > 16`, mantém `WSum6 > 17`.
- Não foi encontrada proibição direta de repetir o mesmo Special Score sem nível em uma resposta. O comportamento não foi alterado sem evidência.
- A calculadora não coleta idade para decidir a aplicabilidade do S-CON. Ela mostra se os valores inseridos atendem às condições; o profissional que conhece a idade e o registro clínico completo decide se o índice se aplica.
- As 53 famílias receberam auditoria de conteúdo, mas nem todos os livros foram integralmente processados por um novo OCR. OCR de alta qualidade e revisão direta foram usados quando uma página importante estava ambígua.

## Direitos autorais e escopo público

O registro público contém títulos, edições, dados de publicação, páginas impressas, função das fontes e regras resumidas. Ele exclui arquivos originais individuais, texto OCR, nomes locais, identificadores privados de trabalho, chaves de API, respostas originais de modelos e material real de avaliação. As regras são parafraseadas apenas na medida necessária para verificação.

---

Auditoria de conteúdo concluída: **53 / 53**
