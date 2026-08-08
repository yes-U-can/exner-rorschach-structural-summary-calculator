# v2.2.10 문헌 전수감사와 체계 경계

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

v2.2.10에서는 계산기에 참고할 수 있는 자료를 일부 원전만 골라 보는 방식에서 벗어나, 검토 대상 자료 전체를 53개 문헌군으로 정리해 본문과 목차를 다시 확인했습니다. 이 문서는 어떤 자료를 계산 근거로 삼았고, 어떤 자료를 해석 보조·체계 경계·역사 자료로만 사용했는지 공개하기 위한 기록입니다.

**이번 전수감사에서는 현재 구조요약 계산값을 바꿔야 할 새로운 오류가 발견되지 않았습니다. 규칙에 맞게 입력한 기존 프로토콜은 다시 계산할 필요가 없습니다.**

## 감사 방법

- 자료의 제목, 저자, 판, 출판사, 연도와 언어를 원본 앞부분에서 확인했습니다.
- 정식 목차가 있는 자료는 전체 목차를, 목차가 없는 자료는 전체 장 제목 흐름을 확인한 뒤 제품과 관련된 장을 읽었습니다. 수식·표·체크박스·위첨자·아포스트로피·비율은 원본 페이지를 다시 대조했습니다.
- OCR은 검색과 위치 찾기에 사용했으며, OCR 문장이 원본 페이지보다 우선하지 않게 했습니다.
- 제외한 자료도 제목만 보고 버리지 않았습니다. 본문과 목차를 확인한 뒤 Exner 종합체계의 계산 또는 해석 근거가 될 수 없는 이유를 기록했습니다.
- Excel, Perl, v1 GAS와 프로젝트 내부 메모는 구현 계보를 추적하는 자료로만 사용했고, 계산 정답의 근거로 사용하지 않았습니다.

초기 자동 검색은 관련 쪽을 찾는 후보 목록으로만 사용했습니다. 역검증에서 참고문헌과 후면부가 섞인 후보가 확인되어, 53개 문헌군 모두 실제 장 제목과 원본 쪽수를 대조해 다시 지정했습니다. 최종 장부에는 162개 본문 구간과 서로 다른 원본 386쪽이 연결되어 있으며, 자동 키워드 일치만으로 채택된 최종 근거는 없습니다.

## 근거의 우선순위

현재 계산 범위의 최상위 직접 근거는 Exner의 *The Rorschach: A Comprehensive System, Volume 1* 제4판과 *A Rorschach Workbook for the Comprehensive System* 제5판입니다. Volume 1 제3판은 판본 사이의 변화와 구현 계보를 확인할 때만 사용했습니다. 번역본과 해석서는 용어와 해석 원칙을 교차 확인하는 자료이며, R-PAS와 다른 체계의 자료는 종합체계와 섞이지 않게 경계를 확인하는 데만 사용했습니다.

## 53개 문헌군의 분류

| 분류 | 문헌군 수 | 제품에서의 역할 |
| --- | --- | --- |
| Exner CS 직접 원전 | 7 | 계산·부호화의 직접 근거 또는 판본 대조 |
| 핵심 해석 자료 | 2 | 검증된 Exner 해석 원칙의 교차 확인 |
| 전문 보충 자료 | 8 | 특정 주제의 한계·맥락 확인 |
| R-PAS·기타 체계 경계 자료 | 10 | 다른 체계가 섞이지 않게 차이를 확인 |
| 역사·연구 맥락 자료 | 16 | 계산 근거가 아닌 역사·연구 맥락 |
| 프로젝트 내부 파생 자료 | 3 | 오류 계보 추적용, 정답 근거에서 제외 |
| 비전문·제품 범위 밖 자료 | 7 | 본문 확인 후 제품 근거에서 제외 |

## 문헌군별 공개 장부

아래 번호는 공개 설명을 위한 일련번호입니다. 로컬 파일명, 저장 경로, 원본 PDF와 OCR 원문은 공개하지 않습니다.

| 번호 | 서지정보 | 분류 | 체계·접근 | 제품에서의 처리 |
| --- | --- | --- | --- | --- |
| 1 | George A. De Vos; L. Bryce Boyer. *Symbolic Analysis Cross-Culturally: The Rorschach Test*; University of California Press; 1989; en | 역사·연구 맥락 자료 | 역사·연구 맥락 | 생산 RAG에서 제외 |
| 2 | Damion Searls. *The Inkblots: Hermann Rorschach, His Iconic Test, and the Power of Seeing*; Crown Publishers; 2017; en | 비전문·제품 범위 밖 자료 | 제품 범위 밖 | 생산 RAG에서 제외 |
| 3 | Michael A. Britt. *Psych Experiments: From Pavlov's Dogs to Rorschach's Inkblots, Put Psychology's Most Fascinating Studies to the Test*; Adams Media; 2017; en | 비전문·제품 범위 밖 자료 | 제품 범위 밖 | 생산 RAG에서 제외 |
| 4 | Luciano Giromini; Alessandro Zennaro. *Il test di Rorschach: applicazioni e nuovi ambiti di intervento nel terzo millennio*; il Mulino; 2019; it | R-PAS·기타 체계 경계 자료 | R-PAS | 체계 경계 규칙만 사용, 원문은 RAG에서 제외 |
| 5 | Joni L. Mihura; Gregory J. Meyer. *Using the Rorschach Performance Assessment System (R-PAS)*; The Guilford Press; 2018; en | R-PAS·기타 체계 경계 자료 | R-PAS | 체계 경계 규칙만 사용, 원문은 RAG에서 제외 |
| 6 | Jessie Francis-Williams. *Rorschach with Children: A Comparative Study of the Contribution Made by the Rorschach and Other Projective Techniques to Clinical Diagnosis in Work with Children*; First edition; Pergamon Press; 1968; en | 역사·연구 맥락 자료 | 역사·연구 맥락 | 생산 RAG에서 제외 |
| 7 | Ronald J. Ganellen. *Integrating the Rorschach and the MMPI-2 in Personality Assessment*; Routledge edition; Routledge; 2012; en | 전문 보충 자료 | Exner CS·MMPI-2 통합 | 생산 RAG에서 제외 |
| 8 | Lowell M. Wiese. *Rorschach Test Scores as Indicators of Intelligence*; Master's thesis; University of Wyoming; 1951; en | 역사·연구 맥락 자료 | 역사·연구 맥락 | 생산 RAG에서 제외 |
| 9 | Wesley A. Dunn. *A Comparison Between Certain Rorschach Factors, Orientation Scores, and College Grades*; Doctoral dissertation; Purdue University; 1951; en | 역사·연구 맥락 자료 | 역사·연구 맥락 | 생산 RAG에서 제외 |
| 10 | Barbara MacMichael Stewart. *A Study of the Relationship Between Clinical Manifestations of Neurotic Anxiety and Rorschach Test Performance*; Doctoral dissertation; University of Southern California; 1950; en | 역사·연구 맥락 자료 | 역사·연구 맥락 | 생산 RAG에서 제외 |
| 11 | Paul M. Lerner. *Psychoanalytic Theory and the Rorschach*; The Analytic Press; 1991; en | 역사·연구 맥락 자료 | 역사·연구 맥락 | 생산 RAG에서 제외 |
| 12 | John E. Exner Jr. (editor). *Issues and Methods in Rorschach Research*; Lawrence Erlbaum Associates; 1995; en | 전문 보충 자료 | 전문·인접 분야 | 생산 RAG에서 제외 |
| 13 | Irving B. Weiner. *Principles of Rorschach Interpretation, Second Edition*; Second edition; Lawrence Erlbaum Associates; 2003; en | 핵심 해석 자료 | Exner 종합체계 해석 | 검증된 Exner 해석 보조에만 사용 |
| 14 | John E. Exner Jr. *The Rorschach: A Comprehensive System, Volume 2: Interpretation, Second Edition*; Second edition; John Wiley & Sons; 1991; en | Exner CS 직접 원전 | Exner 종합체계 | 검증된 Exner 해석 보조에만 사용 |
| 15 | John E. Exner Jr.; Irving B. Weiner. *The Rorschach: A Comprehensive System, Volume 3: Assessment of Children and Adolescents*; John Wiley & Sons; 1982; en | Exner CS 직접 원전 | Exner 종합체계 | 성인용 생산 코퍼스에서 제외 |
| 16 | J. Reid Meloy; Marvin W. Acklin; Carl B. Gacono; James F. Murray; Charles A. Peterson. *Contemporary Rorschach Interpretation*; Lawrence Erlbaum Associates; 1997; en | 전문 보충 자료 | 전문·인접 분야 | 생산 RAG에서 제외 |
| 17 | James H. Kleiger. *Disordered Thinking and the Rorschach: Theory, Research, and Differential Diagnosis*; The Analytic Press; 1999; en | 전문 보충 자료 | 전문·인접 분야 | 생산 RAG에서 제외 |
| 18 | John E. Exner Jr.; Manuel Esbert Ramírez (translator). *Manual de Codificación del Rorschach para el Sistema Comprehensivo*; Third Spanish edition; source original fifth edition; Editorial Psimática; 2008; es | Exner CS 직접 원전 | Exner 종합체계 | 용어 대조만 사용, 원문은 RAG에서 제외 |
| 19 | Rajendra K. Misra; Meena K. Kharkwal; Maurita A. Kilroy; Komilla Thapa. *Rorschach Test: Theory and Practice*; SAGE Publications; 1996; en | 역사·연구 맥락 자료 | 역사·연구 맥락 | 생산 RAG에서 제외 |
| 20 | John E. Exner Jr.; 孟宪璋 (translator); 唐迎婵 (translator). *罗夏测验综合系统工作手册（原书第5版）*; First Chinese edition; source original fifth edition; Jinan University Press; 2013; zh | Exner CS 직접 원전 | Exner 종합체계 | 용어 대조만 사용, 원문은 RAG에서 제외 |
| 21 | John E. Exner Jr.; 孟宪璋 (translator); 任滨海 (translator); 刘浩鑫 (translator). *罗夏测验解释入门*; First Chinese edition; Jinan University Press; 2013; zh | 핵심 해석 자료 | Exner 종합체계 해석 | 용어 대조만 사용, 원문은 RAG에서 제외 |
| 22 | John E. Exner Jr. *A Rorschach Workbook for the Comprehensive System, Fifth Edition*; Fifth edition; Rorschach Workshops; 2001; en | Exner CS 직접 원전 | Exner 종합체계 | 쪽수 단위 검증 후 Exner 규칙 근거로 사용 |
| 23 | Ewald Bohm; Anne G. Beck (translator); Samuel J. Beck (translator). *A Textbook in Rorschach Test Diagnosis: For Psychologists, Physicians and Teachers*; Grune & Stratton; 1958; en | 역사·연구 맥락 자료 | Bohm 역사 체계 | 생산 RAG에서 제외 |
| 24 | Eric A. Zillmer; Molly Harrower; Barry A. Ritzler; Robert P. Archer. *The Quest for the Nazi Personality: A Psychological Investigation of Nazi War Criminals*; Routledge digital printing; Routledge; 2009; en | 비전문·제품 범위 밖 자료 | 제품 범위 밖 | 생산 RAG에서 제외 |
| 25 | Katherine A. Hubbard. *Queer Ink: A Blotted History Towards Liberation*; Routledge; 2020; en | 비전문·제품 범위 밖 자료 | 제품 범위 밖 | 생산 RAG에서 제외 |
| 26 | Carl B. Gacono; J. Reid Meloy. *The Rorschach Assessment of Aggressive and Psychopathic Personalities*; Routledge edition; Routledge; 2012; en | 전문 보충 자료 | 전문·인접 분야 | 생산 RAG에서 제외 |
| 27 | Carl B. Gacono (editor); F. Barton Evans (editor); Nancy Kaser-Boyd; Lynne A. Gacono. *The Handbook of Forensic Rorschach Assessment*; Lawrence Erlbaum Associates; 2008; en | 전문 보충 자료 | 전문·인접 분야 | 생산 RAG에서 제외 |
| 28 | Jessica R. Gurley. *Essentials of Rorschach Assessment: Comprehensive System and R-PAS*; John Wiley & Sons; 2017; en | R-PAS·기타 체계 경계 자료 | CS·R-PAS 비교 | 체계 경계 규칙만 사용, 원문은 RAG에서 제외 |
| 29 | Joni L. Mihura (editor); Gregory J. Meyer (editor). *Uso del sistema de evaluación del desempeño de Rorschach (R-PAS)*; 스페인어 파생본, 판 정보 미확정; 출판 정보 미확정; 2018 (저작권 표기 기준); es | R-PAS·기타 체계 경계 자료 | R-PAS 파생 자료 | 체계 경계 규칙만 사용, 원문은 RAG에서 제외 |
| 30 | Gregory J. Meyer; Donald J. Viglione; Joni L. Mihura; Robert E. Erard; Philip Erdberg. *R-PAS (Rorschach Performance Assessment System): Administration, Coding, Interpretation, and Technical Manual*; First edition; R-PAS LLC; 2011; en | R-PAS·기타 체계 경계 자료 | R-PAS | 체계 경계 규칙만 사용, 원문은 RAG에서 제외 |
| 31 | Florence Halpern. *A Clinical Approach to Children's Rorschachs*; Grune & Stratton; 1953; en | 역사·연구 맥락 자료 | 역사·연구 맥락 | 생산 RAG에서 제외 |
| 32 | Shira Tibon-Czopp; Irving B. Weiner. *Rorschach Assessment of Adolescents: Theory, Research, and Practice*; Springer Science+Business Media New York; 2016; en | 전문 보충 자료 | 전문·인접 분야 | 생산 RAG에서 제외 |
| 33 | Nettie Herrington Ledwith. *Rorschach Responses of Elementary School Children: A Normative Study*; University of Pittsburgh Press; 1959; en | 역사·연구 맥락 자료 | 역사·연구 맥락 | 생산 RAG에서 제외 |
| 34 | Louise Bates Ames; Janet Learned; Ruth W. Metraux; Richard N. Walker. *Child Rorschach Responses: Developmental Trends from Two to Ten Years*; Paul B. Hoeber; 1952; en | 역사·연구 맥락 자료 | 역사·연구 맥락 | 생산 RAG에서 제외 |
| 35 | Louise Bates Ames; Ruth W. Metraux; Janet Learned Rodell; Richard N. Walker. *Rorschach Responses in Old Age, Revised Edition*; Revised edition; Brunner/Mazel; 1973; en | 역사·연구 맥락 자료 | 역사·연구 맥락 | 생산 RAG에서 제외 |
| 36 | Hermann Rorschach; Paul Lemkau (translator); Bernard Kronenberg (translator). *Psychodiagnostics: A Diagnostic Test Based on Perception, Including Rorschach's Paper, The Application of the Form Interpretation Test*; Sixth edition; Hans Huber; United States edition by Grune & Stratton; 1964; en | 역사·연구 맥락 자료 | Rorschach 초기 원법 | 생산 RAG에서 제외 |
| 37 | Naamah Akavia. *Subjectivity in Motion: Life, Art, and Movement in the Work of Hermann Rorschach*; Routledge; 2013; en | 비전문·제품 범위 밖 자료 | 제품 범위 밖 | 생산 RAG에서 제외 |
| 38 | Florence R. Miale; Michael Selzer. *The Nuremberg Mind: The Psychology of the Nazi Leaders*; First paperback printing; Quadrangle/The New York Times Book Co.; 1977; en | 비전문·제품 범위 밖 자료 | 제품 범위 밖 | 생산 RAG에서 제외 |
| 39 | James P. Choca. *The Rorschach Inkblot Test: An Interpretive Guide for Clinicians*; First edition; American Psychological Association; 2013; en | 전문 보충 자료 | 전문·인접 분야 | 생산 RAG에서 제외 |
| 40 | Edward Aronow; Marvin Reznikoff; Kevin Moreland. *The Rorschach Technique: Perceptual Basics, Content Interpretation, and Applications*; Allyn and Bacon; 1994; en | 역사·연구 맥락 자료 | Aronow·Reznikoff·Moreland 접근 | 생산 RAG에서 제외 |
| 41 | Anne Bar Din. *La prueba de Rorschach: Un manual de aplicación pluricultural*; First edition; Siglo XXI Editores; 2001; es | R-PAS·기타 체계 경계 자료 | 다문화 비Exner 접근 | 체계 경계 규칙만 사용, 원문은 RAG에서 제외 |
| 42 | Hellmut Brinkmann Sch. *El Test de Rorschach: Introducción a su estudio y utilización*; First edition; RIL Editores; 2014; es | 역사·연구 맥락 자료 | 혼합 비Exner 접근 | 생산 RAG에서 제외 |
| 43 | Robin Groody. *Segredos dos Testes de Rorschach e Zulliger*; Version 2; Self-distributed; no professional publisher identified; 2003; pt | 비전문·제품 범위 밖 자료 | 비전문 검사 공략 자료 | 생산 RAG에서 제외 |
| 44 | James P. Choca; Edward D. Rossini. *Assessment Using the Rorschach Inkblot Test*; American Psychological Association; 2018; en | R-PAS·기타 체계 경계 자료 | Basic Rorschach·Herm 접근 | 체계 경계 규칙만 사용, 원문은 RAG에서 제외 |
| 45 | 杨东; 吉沉洪. *实用罗夏墨迹测验*; First edition; Chongqing Publishing House; 2008; zh | R-PAS·기타 체계 경계 자료 | 중국어권 지역 비Exner 체계 | 체계 경계 규칙만 사용, 원문은 RAG에서 제외 |
| 46 | Louise Bates Ames; Ruth W. Metraux; Richard N. Walker. *Adolescent Rorschach Responses: Developmental Trends from Ten to Sixteen Years*; Second printing; introduction describes a second edition; Brunner/Mazel; 1971; en | 역사·연구 맥락 자료 | 역사·연구 맥락 | 생산 RAG에서 제외 |
| 47 | François-David Camps; Gaëlle Malle. *S'entraîner à la cotation du Rorschach et du TAT*; Dunod; 2020; fr | R-PAS·기타 체계 경계 자료 | 프랑스 투사법 | 체계 경계 규칙만 사용, 원문은 RAG에서 제외 |
| 48 | Damion Searls. *Teste de Rorschach: A Origem*; 출판·번역 정보 미확정; 연도 미상; pt | R-PAS·기타 체계 경계 자료 | 서지 미확정 포르투갈어 파생 자료 | 체계 경계 규칙만 사용, 원문은 RAG에서 제외 |
| 49 | 프로젝트 내부 파생 자료 1 (비공개) | 프로젝트 내부 파생 자료 | 프로젝트 내부 오류 기록 | 생산 RAG에서 제외 |
| 50 | 프로젝트 내부 파생 자료 2 (비공개) | 프로젝트 내부 파생 자료 | 출처 미확정 내부 해석 메모 | 생산 RAG에서 제외 |
| 51 | 프로젝트 내부 파생 자료 3 (비공개) | 프로젝트 내부 파생 자료 | 출처 미확정 내부 CS 파생 자료 | 생산 RAG에서 제외 |
| 52 | John E. Exner Jr. *The Rorschach: A Comprehensive System, Volume 1: Basic Foundations, Third Edition*; Third edition; John Wiley & Sons; 1993; en | Exner CS 직접 원전 | Exner 종합체계 | 판본·규칙 계보만 확인, 원문은 RAG에서 제외 |
| 53 | John E. Exner Jr. *The Rorschach: A Comprehensive System, Volume 1: Basic Foundations and Principles of Interpretation, Fourth Edition*; Fourth edition; John Wiley & Sons; 2003; en | Exner CS 직접 원전 | Exner 종합체계 | 쪽수 단위 검증 후 Exner 규칙 근거로 사용 |

## Exner 계산 근거

앱이 실제로 표시하는 Upper Section, Lower Section, Special Indices와 입력 규칙을 다음 인쇄 쪽수에서 다시 확인했습니다. 쪽수는 PDF 뷰어 번호가 아니라 책에 인쇄된 쪽수입니다.

| 확인 범위 | 직접 근거 | 확인 결과 |
| --- | --- | --- |
| 시행·부호화·구조요약 | Volume 1 제4판, 인쇄 pp. 68-157; Workbook 제5판, 관련 장과 인쇄 pp. 91-101 | 입력 규칙과 구조요약 전 범위를 함수·화면·PDF·테스트에 연결했습니다. |
| Upper Section | Volume 1 제4판, 인쇄 pp. 148-150; Workbook 제5판, 인쇄 pp. 91-92 | Location, DQ, FQ, 결정인, 내용, Special Score와 Z 관련 합계를 다시 확인했습니다. |
| Lower Section | Volume 1 제4판, 인쇄 pp. 151-155; Workbook 제5판, 인쇄 pp. 93-99 | Core부터 Self-Perception까지 계산과 표시를 확인하고, 누락된 `GHR:PHR` 표시를 복원했습니다. |
| Special Indices | Volume 1 제4판, 인쇄 p. 156; Workbook 제5판, 인쇄 pp. 100-101 | PTI, DEPI, CDI, S-CON, HVI, OBS의 조건과 경계값을 확인했습니다. |
| 연령 적용과 보정 | Volume 1 제4판, 인쇄 p. 157; Workbook 제5판, 인쇄 pp. 100-101 | 계산기가 조건 충족을 표시하고 적용 여부는 임상가가 판단하는 기존 경계를 유지했습니다. |

## 다른 체계와의 경계

다른 체계의 자료는 계산 정답을 보충하는 자료가 아닙니다. 이름이 비슷한 부호와 개념이 Exner 종합체계에 섞이지 않게 다음 차이를 확인하는 자료입니다.

| 경계 | 확인한 차이 | 계산기와 AI의 동작 |
| --- | --- | --- |
| 시행 | R-PAS는 R-Optimized 시행으로 반응 수를 조절하며 Exner CS 시행과 같지 않습니다. | R-PAS 시행을 CS로 자동 변환하지 않습니다. |
| Location·DQ·공백 | R-PAS의 Sy, Vg, SI, SR은 CS의 DQ와 S에 그대로 대응하지 않습니다. | R-PAS 전용 부호를 CS 입력으로 받거나 임의 변환하지 않습니다. |
| 결정인 | R-PAS는 여러 음영·반사 변형을 합치고 Cn을 사용하지 않습니다. Basic Rorschach도 별도 체계입니다. | 현재 Exner 결정인 목록과 운동 첨자를 유지합니다. |
| 형태질·규준 | R-PAS의 형태질 표와 표준점수는 CS의 FQ 표와 구조요약 규준이 아닙니다. | R-PAS 수치를 CS 구조요약에 넣지 않습니다. |
| 구조요약·지표 | R-PAS는 CS의 Upper/Lower/Special Indices를 그대로 사용하지 않습니다. | 앱은 Exner CS 구조요약만 계산합니다. |
| 다른 역사·지역 체계 | Klopfer·Beck·Piotrowski, 프랑스 투사법의 kan/kob/clob, 중국어권 지역 부호는 서로 다른 규칙입니다. | 비슷한 글자라도 Exner 부호로 바꾸지 않고 범위를 안내합니다. |
| 인접 검사·판단 | MMPI 통합, 진단, 치료, 법정 판단은 구조요약 계산 범위를 벗어납니다. | AI는 요청을 거절하고 Exner CS 질문으로 돌아옵니다. |

## 참조 문서와 AI 적용 범위

- 생산 RAG 코퍼스에는 쪽수 단위로 검증한 Exner 종합체계 내용만 넣습니다.
- R-PAS, Basic Rorschach, 프랑스 투사법, 중국어권 지역 체계와 역사적 체계의 원문은 생산 벡터 공간에 넣지 않습니다.
- 다른 체계에서 확인한 내용은 짧은 경계 규칙과 평가 질문으로만 사용합니다.
- AI 도우미는 R-PAS 변환·해석, MMPI 통합, 진단·치료·법적 판단과 시스템 정보 탈취 요구를 거절하고 Exner 종합체계 질문으로 범위를 되돌립니다.
- 정상적인 Exner 질문은 차단하지 않는지 별도의 다섯 언어 사례로 함께 확인합니다.

## 남아 있는 한계

- Volume 1 제4판 p. 156의 PTI 기준과 Workbook 제5판 p. 101 및 RIAP 5 출력 사이에는 WSum6 경계가 한 점 다르게 인쇄되어 있습니다. 앱은 Workbook과 RIAP 5에 맞춰 `R > 16`일 때 `WSum6 > 17`을 유지합니다.
- 같은 비수준 Special Score를 한 반응에 반복 입력할 수 있는지에 대해서는 직접 금지 문장을 찾지 못했습니다. 근거 없이 동작을 바꾸지 않았습니다.
- S-CON의 연령 적용 여부는 계산기가 피검자 나이를 수집해 결정하지 않습니다. 입력값이 기준을 충족하는지는 표시하고, 실제 적용은 연령과 전체 임상자료를 아는 임상가가 판단합니다.
- 53개 문헌군을 모두 본문 감사했지만 모든 책을 새 OCR로 전면 변환한 것은 아닙니다. 중요한 판독이 모호한 쪽만 고품질 OCR과 원본 페이지 대조를 사용했습니다.

## 저작권과 공개 범위

공개 기록에는 문헌명, 판, 출판 정보, 인쇄 쪽수, 자료의 역할과 확인한 규칙만 남깁니다. 개별 원본 파일, OCR 원문, 로컬 파일명, 비공개 작업 식별자, API 키, 모델 응답 원문과 실제 검사자료는 공개하지 않습니다. 규칙은 필요한 범위에서 요약하며 원문을 길게 복제하지 않습니다.

---

본문감사 완료: **53 / 53**
