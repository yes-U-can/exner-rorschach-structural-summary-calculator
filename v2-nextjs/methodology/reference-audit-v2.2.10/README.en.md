# v2.2.10 full source audit and system boundary

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

For v2.2.10, we moved beyond checking only a small set of primary sources. We organized all available material into 53 source families and reviewed their contents and relevant chapters. This document records which sources support the calculations and which are used only for interpretation, system boundaries, historical context, or exclusion decisions.

**The full audit found no new defect that requires a change to the current Structural Summary results. Existing protocols entered according to the coding rules do not need to be recalculated.**

## Audit method

- Titles, authors, editions, publishers, years, and languages were checked against the source front matter.
- For sources with a formal table of contents, we reviewed it in full; for sources without one, we reviewed the complete heading sequence. We then read the chapters relevant to the product. Formulas, tables, checkboxes, superscripts, apostrophes, and ratios were checked against the source page.
- OCR was used for search and navigation. An OCR sentence never overrode the source page.
- Excluded material was not dismissed by title alone. Its contents and relevant chapters were checked before recording why it cannot support Exner CS calculation or interpretation.
- Excel, Perl, v1 GAS, and project-internal notes were used only to trace implementation lineage, never as the calculation oracle.

The initial automated search was used only to produce candidate pages. A reverse audit found candidates drawn from references and other back matter, so actual section titles and original pages were checked against the sources and reassigned for all 53 source families. The final ledger links 162 body sections and 386 distinct source pages; no final evidence rests on a generic keyword match alone.

## Evidence hierarchy

The top direct authorities for the current calculation scope are the 4th edition of Exner's *The Rorschach: A Comprehensive System, Volume 1* and the 5th edition of *A Rorschach Workbook for the Comprehensive System*. The 3rd edition of Volume 1 is retained only for edition and implementation lineage. Translations and interpretation texts support terminology and interpretive cross-checks. R-PAS and other systems are used only to keep their rules separate from Exner CS.

## Classification of the 53 source families

| Class | Families | Product role |
| --- | --- | --- |
| Direct Exner CS source | 7 | Direct calculation/coding evidence or edition comparison |
| Core interpretation source | 2 | Cross-check of verified Exner interpretation principles |
| Specialist supplement | 8 | Context and limits for a specialized topic |
| R-PAS or other-system boundary | 10 | Difference check to prevent system mixing |
| Historical or research context | 16 | Historical or research context, not calculation evidence |
| Project-internal derivative | 3 | Error-lineage tracking, excluded as an oracle |
| Nonprofessional or out of scope | 7 | Excluded after content review |

## Public source-family ledger

The numbers below are public sequence numbers. Local filenames, storage paths, source PDFs, and OCR text are not published.

| No. | Bibliographic information | Class | System or approach | Product handling |
| --- | --- | --- | --- | --- |
| 1 | George A. De Vos; L. Bryce Boyer. *Symbolic Analysis Cross-Culturally: The Rorschach Test*; University of California Press; 1989; en | Historical or research context | Historical or research context | Excluded from production RAG |
| 2 | Damion Searls. *The Inkblots: Hermann Rorschach, His Iconic Test, and the Power of Seeing*; Crown Publishers; 2017; en | Nonprofessional or out of scope | Out of product scope | Excluded from production RAG |
| 3 | Michael A. Britt. *Psych Experiments: From Pavlov's Dogs to Rorschach's Inkblots, Put Psychology's Most Fascinating Studies to the Test*; Adams Media; 2017; en | Nonprofessional or out of scope | Out of product scope | Excluded from production RAG |
| 4 | Luciano Giromini; Alessandro Zennaro. *Il test di Rorschach: applicazioni e nuovi ambiti di intervento nel terzo millennio*; il Mulino; 2019; it | R-PAS or other-system boundary | R-PAS | Boundary rules only; raw text excluded from RAG |
| 5 | Joni L. Mihura; Gregory J. Meyer. *Using the Rorschach Performance Assessment System (R-PAS)*; The Guilford Press; 2018; en | R-PAS or other-system boundary | R-PAS | Boundary rules only; raw text excluded from RAG |
| 6 | Jessie Francis-Williams. *Rorschach with Children: A Comparative Study of the Contribution Made by the Rorschach and Other Projective Techniques to Clinical Diagnosis in Work with Children*; First edition; Pergamon Press; 1968; en | Historical or research context | Historical or research context | Excluded from production RAG |
| 7 | Ronald J. Ganellen. *Integrating the Rorschach and the MMPI-2 in Personality Assessment*; Routledge edition; Routledge; 2012; en | Specialist supplement | Exner CS/MMPI-2 integration | Excluded from production RAG |
| 8 | Lowell M. Wiese. *Rorschach Test Scores as Indicators of Intelligence*; Master's thesis; University of Wyoming; 1951; en | Historical or research context | Historical or research context | Excluded from production RAG |
| 9 | Wesley A. Dunn. *A Comparison Between Certain Rorschach Factors, Orientation Scores, and College Grades*; Doctoral dissertation; Purdue University; 1951; en | Historical or research context | Historical or research context | Excluded from production RAG |
| 10 | Barbara MacMichael Stewart. *A Study of the Relationship Between Clinical Manifestations of Neurotic Anxiety and Rorschach Test Performance*; Doctoral dissertation; University of Southern California; 1950; en | Historical or research context | Historical or research context | Excluded from production RAG |
| 11 | Paul M. Lerner. *Psychoanalytic Theory and the Rorschach*; The Analytic Press; 1991; en | Historical or research context | Historical or research context | Excluded from production RAG |
| 12 | John E. Exner Jr. (editor). *Issues and Methods in Rorschach Research*; Lawrence Erlbaum Associates; 1995; en | Specialist supplement | Specialized or adjacent field | Excluded from production RAG |
| 13 | Irving B. Weiner. *Principles of Rorschach Interpretation, Second Edition*; Second edition; Lawrence Erlbaum Associates; 2003; en | Core interpretation source | Exner CS interpretation | Verified Exner interpretation support only |
| 14 | John E. Exner Jr. *The Rorschach: A Comprehensive System, Volume 2: Interpretation, Second Edition*; Second edition; John Wiley & Sons; 1991; en | Direct Exner CS source | Exner Comprehensive System | Verified Exner interpretation support only |
| 15 | John E. Exner Jr.; Irving B. Weiner. *The Rorschach: A Comprehensive System, Volume 3: Assessment of Children and Adolescents*; John Wiley & Sons; 1982; en | Direct Exner CS source | Exner Comprehensive System | Excluded from the adult production corpus |
| 16 | J. Reid Meloy; Marvin W. Acklin; Carl B. Gacono; James F. Murray; Charles A. Peterson. *Contemporary Rorschach Interpretation*; Lawrence Erlbaum Associates; 1997; en | Specialist supplement | Specialized or adjacent field | Excluded from production RAG |
| 17 | James H. Kleiger. *Disordered Thinking and the Rorschach: Theory, Research, and Differential Diagnosis*; The Analytic Press; 1999; en | Specialist supplement | Specialized or adjacent field | Excluded from production RAG |
| 18 | John E. Exner Jr.; Manuel Esbert Ramírez (translator). *Manual de Codificación del Rorschach para el Sistema Comprehensivo*; Third Spanish edition; source original fifth edition; Editorial Psimática; 2008; es | Direct Exner CS source | Exner Comprehensive System | Terminology cross-check only; raw text excluded from RAG |
| 19 | Rajendra K. Misra; Meena K. Kharkwal; Maurita A. Kilroy; Komilla Thapa. *Rorschach Test: Theory and Practice*; SAGE Publications; 1996; en | Historical or research context | Historical or research context | Excluded from production RAG |
| 20 | John E. Exner Jr.; 孟宪璋 (translator); 唐迎婵 (translator). *罗夏测验综合系统工作手册（原书第5版）*; First Chinese edition; source original fifth edition; Jinan University Press; 2013; zh | Direct Exner CS source | Exner Comprehensive System | Terminology cross-check only; raw text excluded from RAG |
| 21 | John E. Exner Jr.; 孟宪璋 (translator); 任滨海 (translator); 刘浩鑫 (translator). *罗夏测验解释入门*; First Chinese edition; Jinan University Press; 2013; zh | Core interpretation source | Exner CS interpretation | Terminology cross-check only; raw text excluded from RAG |
| 22 | John E. Exner Jr. *A Rorschach Workbook for the Comprehensive System, Fifth Edition*; Fifth edition; Rorschach Workshops; 2001; en | Direct Exner CS source | Exner Comprehensive System | Used as Exner evidence only after page-level verification |
| 23 | Ewald Bohm; Anne G. Beck (translator); Samuel J. Beck (translator). *A Textbook in Rorschach Test Diagnosis: For Psychologists, Physicians and Teachers*; Grune & Stratton; 1958; en | Historical or research context | Historical Bohm system | Excluded from production RAG |
| 24 | Eric A. Zillmer; Molly Harrower; Barry A. Ritzler; Robert P. Archer. *The Quest for the Nazi Personality: A Psychological Investigation of Nazi War Criminals*; Routledge digital printing; Routledge; 2009; en | Nonprofessional or out of scope | Out of product scope | Excluded from production RAG |
| 25 | Katherine A. Hubbard. *Queer Ink: A Blotted History Towards Liberation*; Routledge; 2020; en | Nonprofessional or out of scope | Out of product scope | Excluded from production RAG |
| 26 | Carl B. Gacono; J. Reid Meloy. *The Rorschach Assessment of Aggressive and Psychopathic Personalities*; Routledge edition; Routledge; 2012; en | Specialist supplement | Specialized or adjacent field | Excluded from production RAG |
| 27 | Carl B. Gacono (editor); F. Barton Evans (editor); Nancy Kaser-Boyd; Lynne A. Gacono. *The Handbook of Forensic Rorschach Assessment*; Lawrence Erlbaum Associates; 2008; en | Specialist supplement | Specialized or adjacent field | Excluded from production RAG |
| 28 | Jessica R. Gurley. *Essentials of Rorschach Assessment: Comprehensive System and R-PAS*; John Wiley & Sons; 2017; en | R-PAS or other-system boundary | CS/R-PAS comparison | Boundary rules only; raw text excluded from RAG |
| 29 | Joni L. Mihura (editor); Gregory J. Meyer (editor). *Uso del sistema de evaluación del desempeño de Rorschach (R-PAS)*; Spanish-language derivative; edition unverified; Publication details unverified; 2018 (source copyright date); es | R-PAS or other-system boundary | R-PAS derivative | Boundary rules only; raw text excluded from RAG |
| 30 | Gregory J. Meyer; Donald J. Viglione; Joni L. Mihura; Robert E. Erard; Philip Erdberg. *R-PAS (Rorschach Performance Assessment System): Administration, Coding, Interpretation, and Technical Manual*; First edition; R-PAS LLC; 2011; en | R-PAS or other-system boundary | R-PAS | Boundary rules only; raw text excluded from RAG |
| 31 | Florence Halpern. *A Clinical Approach to Children's Rorschachs*; Grune & Stratton; 1953; en | Historical or research context | Historical or research context | Excluded from production RAG |
| 32 | Shira Tibon-Czopp; Irving B. Weiner. *Rorschach Assessment of Adolescents: Theory, Research, and Practice*; Springer Science+Business Media New York; 2016; en | Specialist supplement | Specialized or adjacent field | Excluded from production RAG |
| 33 | Nettie Herrington Ledwith. *Rorschach Responses of Elementary School Children: A Normative Study*; University of Pittsburgh Press; 1959; en | Historical or research context | Historical or research context | Excluded from production RAG |
| 34 | Louise Bates Ames; Janet Learned; Ruth W. Metraux; Richard N. Walker. *Child Rorschach Responses: Developmental Trends from Two to Ten Years*; Paul B. Hoeber; 1952; en | Historical or research context | Historical or research context | Excluded from production RAG |
| 35 | Louise Bates Ames; Ruth W. Metraux; Janet Learned Rodell; Richard N. Walker. *Rorschach Responses in Old Age, Revised Edition*; Revised edition; Brunner/Mazel; 1973; en | Historical or research context | Historical or research context | Excluded from production RAG |
| 36 | Hermann Rorschach; Paul Lemkau (translator); Bernard Kronenberg (translator). *Psychodiagnostics: A Diagnostic Test Based on Perception, Including Rorschach's Paper, The Application of the Form Interpretation Test*; Sixth edition; Hans Huber; United States edition by Grune & Stratton; 1964; en | Historical or research context | Original pre-system Rorschach method | Excluded from production RAG |
| 37 | Naamah Akavia. *Subjectivity in Motion: Life, Art, and Movement in the Work of Hermann Rorschach*; Routledge; 2013; en | Nonprofessional or out of scope | Out of product scope | Excluded from production RAG |
| 38 | Florence R. Miale; Michael Selzer. *The Nuremberg Mind: The Psychology of the Nazi Leaders*; First paperback printing; Quadrangle/The New York Times Book Co.; 1977; en | Nonprofessional or out of scope | Out of product scope | Excluded from production RAG |
| 39 | James P. Choca. *The Rorschach Inkblot Test: An Interpretive Guide for Clinicians*; First edition; American Psychological Association; 2013; en | Specialist supplement | Specialized or adjacent field | Excluded from production RAG |
| 40 | Edward Aronow; Marvin Reznikoff; Kevin Moreland. *The Rorschach Technique: Perceptual Basics, Content Interpretation, and Applications*; Allyn and Bacon; 1994; en | Historical or research context | Aronow-Reznikoff-Moreland approach | Excluded from production RAG |
| 41 | Anne Bar Din. *La prueba de Rorschach: Un manual de aplicación pluricultural*; First edition; Siglo XXI Editores; 2001; es | R-PAS or other-system boundary | Pluricultural non-Exner approach | Boundary rules only; raw text excluded from RAG |
| 42 | Hellmut Brinkmann Sch. *El Test de Rorschach: Introducción a su estudio y utilización*; First edition; RIL Editores; 2014; es | Historical or research context | Mixed non-Exner approach | Excluded from production RAG |
| 43 | Robin Groody. *Segredos dos Testes de Rorschach e Zulliger*; Version 2; Self-distributed; no professional publisher identified; 2003; pt | Nonprofessional or out of scope | Nonprofessional test-gaming material | Excluded from production RAG |
| 44 | James P. Choca; Edward D. Rossini. *Assessment Using the Rorschach Inkblot Test*; American Psychological Association; 2018; en | R-PAS or other-system boundary | Basic Rorschach/Herm approach | Boundary rules only; raw text excluded from RAG |
| 45 | 杨东; 吉沉洪. *实用罗夏墨迹测验*; First edition; Chongqing Publishing House; 2008; zh | R-PAS or other-system boundary | Local Chinese non-Exner approach | Boundary rules only; raw text excluded from RAG |
| 46 | Louise Bates Ames; Ruth W. Metraux; Richard N. Walker. *Adolescent Rorschach Responses: Developmental Trends from Ten to Sixteen Years*; Second printing; introduction describes a second edition; Brunner/Mazel; 1971; en | Historical or research context | Historical or research context | Excluded from production RAG |
| 47 | François-David Camps; Gaëlle Malle. *S'entraîner à la cotation du Rorschach et du TAT*; Dunod; 2020; fr | R-PAS or other-system boundary | French projective school | Boundary rules only; raw text excluded from RAG |
| 48 | Damion Searls. *Teste de Rorschach: A Origem*; Publication and translation details unverified; Undated; pt | R-PAS or other-system boundary | Unverified Portuguese derivative | Boundary rules only; raw text excluded from RAG |
| 49 | Project-internal derivative material 1 (private) | Project-internal derivative | Project-internal error record | Excluded from production RAG |
| 50 | Project-internal derivative material 2 (private) | Project-internal derivative | Unsourced internal interpretation note | Excluded from production RAG |
| 51 | Project-internal derivative material 3 (private) | Project-internal derivative | Unsourced internal CS derivative | Excluded from production RAG |
| 52 | John E. Exner Jr. *The Rorschach: A Comprehensive System, Volume 1: Basic Foundations, Third Edition*; Third edition; John Wiley & Sons; 1993; en | Direct Exner CS source | Exner Comprehensive System | Edition and rule lineage only; raw text excluded from RAG |
| 53 | John E. Exner Jr. *The Rorschach: A Comprehensive System, Volume 1: Basic Foundations and Principles of Interpretation, Fourth Edition*; Fourth edition; John Wiley & Sons; 2003; en | Direct Exner CS source | Exner Comprehensive System | Used as Exner evidence only after page-level verification |

## Exner calculation evidence

The app's Upper Section, Lower Section, Special Indices, and input rules were rechecked at the following printed pages. These are printed book pages, not PDF viewer numbers.

| Scope | Direct evidence | Result |
| --- | --- | --- |
| Administration, coding, and Structural Summary | Volume 1, 4th ed., printed pp. 68-157; Workbook, 5th ed., relevant chapters and printed pp. 91-101 | Input rules and the full Structural Summary range were linked to functions, screen output, PDF output, and tests. |
| Upper Section | Volume 1, 4th ed., printed pp. 148-150; Workbook, 5th ed., printed pp. 91-92 | Location, DQ, FQ, determinant, content, Special Score, and Z totals were rechecked. |
| Lower Section | Volume 1, 4th ed., printed pp. 151-155; Workbook, 5th ed., printed pp. 93-99 | Calculations and displays from Core through Self-Perception were checked, and the missing `GHR:PHR` display was restored. |
| Special Indices | Volume 1, 4th ed., printed p. 156; Workbook, 5th ed., printed pp. 100-101 | Conditions and boundaries for PTI, DEPI, CDI, S-CON, HVI, and OBS were checked. |
| Age applicability and adjustments | Volume 1, 4th ed., printed p. 157; Workbook, 5th ed., printed pp. 100-101 | The existing boundary remains: the calculator displays condition fulfillment and the clinician decides applicability. |

## Boundaries from other systems

Sources from other systems do not supplement the calculation oracle. They identify differences that must not be mixed into Exner CS when labels or concepts look familiar.

| Boundary | Difference checked | Calculator and assistant behavior |
| --- | --- | --- |
| Administration | R-PAS controls response count through R-Optimized administration, which is not Exner CS administration. | No automatic conversion of R-PAS administration to CS. |
| Location, DQ, and space | R-PAS Sy, Vg, SI, and SR are not direct equivalents of CS DQ and S. | R-PAS-only codes are not accepted or translated into CS input. |
| Determinants | R-PAS collapses several shading and reflection variants and does not code Cn. Basic Rorschach is also a separate system. | The current Exner determinant list and movement qualifiers remain. |
| Form Quality and norms | R-PAS Form Quality tables and standardized scores are not the CS FQ tables or Structural Summary norms. | R-PAS values are not entered into the CS Structural Summary. |
| Summary and indices | R-PAS does not retain the CS Upper/Lower/Special Indices unchanged. | The app calculates only the Exner CS Structural Summary. |
| Historical and local systems | Klopfer, Beck, Piotrowski, French kan/kob/clob, and local Chinese codes follow different rules. | Familiar letters are not converted into Exner codes; the scope is explained instead. |
| Adjacent tests and judgments | MMPI integration, diagnosis, treatment, and forensic judgment exceed the calculator's scope. | The assistant declines and returns to an Exner CS question. |

## Reference corpus and assistant scope

- The production RAG corpus contains only page-level verified Exner CS content.
- Raw R-PAS, Basic Rorschach, French projective-school, local Chinese, and historical-system text is not placed in the production vector space.
- Other systems contribute only short boundary rules and evaluation questions.
- The assistants decline R-PAS conversion or interpretation, MMPI integration, diagnosis, treatment, legal judgment, and attempts to obtain system information, then return the discussion to Exner CS.
- Separate five-language cases verify that ordinary Exner questions are not overblocked.

## Remaining limitations

- Volume 1, 4th edition, p. 156 and Workbook, 5th edition, p. 101 with RIAP 5 output print a one-point difference in a PTI WSum6 boundary. The app follows the Workbook and RIAP 5: when `R > 16`, the condition remains `WSum6 > 17`.
- No direct prohibition was found for repeating the same non-level Special Score within one response. The product behavior was not changed without evidence.
- The calculator does not collect age to decide S-CON applicability. It displays whether entered values meet the conditions; the clinician who knows age and the complete record decides whether the index applies.
- All 53 families received a body audit, but not every book was fully re-OCRed. High-quality OCR and direct page review were used when important pages were ambiguous.

## Copyright and public scope

The public record contains publication names, editions, publication data, printed pages, source roles, and summarized rules. It excludes individual source files, OCR text, local filenames, private working identifiers, API keys, raw model answers, and actual assessment material. Rules are paraphrased only to the extent needed for verification.

---

Body audit complete: **53 / 53**
