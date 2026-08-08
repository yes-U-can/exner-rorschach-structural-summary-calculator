# v2.2.10 文献全数監査と体系境界

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

v2.2.10では、一部の主要文献だけを確認する方法から進み、保有資料全体を53の文献群に整理して、目次と関連章を再確認しました。本書では、計算根拠として用いた資料と、解釈補助・体系境界・歴史的文脈・除外判断にのみ用いた資料を記録します。

**今回の全数監査では、現在の構造一覧表の計算値を変更すべき新たな不具合は見つかりませんでした。規則に従って入力した既存プロトコルを再計算する必要はありません。**

## 監査方法

- 書名、著者、版、出版社、出版年、言語を原資料の前付けで確認しました。
- 正式な目次がある資料はその全体を、目次がない資料は章題の流れ全体を確認してから、製品に関係する章を読みました。数式、表、チェックボックス、上付き文字、アポストロフィ、比率は原ページと照合しました。
- OCRは検索と位置確認に用い、OCR文を原ページより優先しませんでした。
- 除外資料も書名だけで判断せず、目次と本文を確認してからExner包括システムの計算・解釈根拠にできない理由を記録しました。
- Excel、Perl、v1 GAS、プロジェクト内部メモは実装系譜の追跡だけに用い、計算の正解根拠には用いませんでした。

最初の自動検索は候補ページの抽出だけに用いました。逆検証で参考文献などの後付け部分が候補に混在していたため、53文献群すべてについて実際の章題と原ページを照合し、改めて指定しました。最終台帳には本文162区間と重複を除く原ページ386頁が結び付けられており、一般的なキーワード一致だけを最終根拠にした項目はありません。

## 根拠の優先順位

現在の計算範囲における最上位の直接根拠は、Exnerの *The Rorschach: A Comprehensive System, Volume 1* 第4版と *A Rorschach Workbook for the Comprehensive System* 第5版です。Volume 1第3版は版間差と実装系譜の確認にのみ用いました。翻訳書と解釈書は用語・解釈原則の照合資料であり、R-PASその他の体系は包括システムとの混入を防ぐ境界資料としてのみ用いました。

## 53文献群の分類

| 分類 | 文献群数 | 製品での役割 |
| --- | --- | --- |
| Exner CS直接原典 | 7 | 計算・コーディングの直接根拠または版間比較 |
| 中核解釈資料 | 2 | 検証済みExner解釈原則の照合 |
| 専門補足資料 | 8 | 特定領域の文脈と限界の確認 |
| R-PAS・他体系境界資料 | 10 | 体系混入を防ぐ差異確認 |
| 歴史・研究文脈資料 | 16 | 計算根拠ではない歴史・研究文脈 |
| プロジェクト内部派生資料 | 3 | 誤りの系譜追跡用、正解根拠から除外 |
| 非専門・製品範囲外資料 | 7 | 本文確認後に製品根拠から除外 |

## 文献群別公開台帳

以下の番号は公開説明用の通し番号です。ローカルのファイル名、保存経路、原PDF、OCR原文は公開しません。

| 番号 | 書誌情報 | 分類 | 体系・アプローチ | 製品での扱い |
| --- | --- | --- | --- | --- |
| 1 | George A. De Vos; L. Bryce Boyer. *Symbolic Analysis Cross-Culturally: The Rorschach Test*; University of California Press; 1989; en | 歴史・研究文脈資料 | 歴史・研究文脈 | 本番RAGから除外 |
| 2 | Damion Searls. *The Inkblots: Hermann Rorschach, His Iconic Test, and the Power of Seeing*; Crown Publishers; 2017; en | 非専門・製品範囲外資料 | 製品範囲外 | 本番RAGから除外 |
| 3 | Michael A. Britt. *Psych Experiments: From Pavlov's Dogs to Rorschach's Inkblots, Put Psychology's Most Fascinating Studies to the Test*; Adams Media; 2017; en | 非専門・製品範囲外資料 | 製品範囲外 | 本番RAGから除外 |
| 4 | Luciano Giromini; Alessandro Zennaro. *Il test di Rorschach: applicazioni e nuovi ambiti di intervento nel terzo millennio*; il Mulino; 2019; it | R-PAS・他体系境界資料 | R-PAS | 体系境界規則のみ、原文はRAGから除外 |
| 5 | Joni L. Mihura; Gregory J. Meyer. *Using the Rorschach Performance Assessment System (R-PAS)*; The Guilford Press; 2018; en | R-PAS・他体系境界資料 | R-PAS | 体系境界規則のみ、原文はRAGから除外 |
| 6 | Jessie Francis-Williams. *Rorschach with Children: A Comparative Study of the Contribution Made by the Rorschach and Other Projective Techniques to Clinical Diagnosis in Work with Children*; First edition; Pergamon Press; 1968; en | 歴史・研究文脈資料 | 歴史・研究文脈 | 本番RAGから除外 |
| 7 | Ronald J. Ganellen. *Integrating the Rorschach and the MMPI-2 in Personality Assessment*; Routledge edition; Routledge; 2012; en | 専門補足資料 | Exner CS・MMPI-2統合 | 本番RAGから除外 |
| 8 | Lowell M. Wiese. *Rorschach Test Scores as Indicators of Intelligence*; Master's thesis; University of Wyoming; 1951; en | 歴史・研究文脈資料 | 歴史・研究文脈 | 本番RAGから除外 |
| 9 | Wesley A. Dunn. *A Comparison Between Certain Rorschach Factors, Orientation Scores, and College Grades*; Doctoral dissertation; Purdue University; 1951; en | 歴史・研究文脈資料 | 歴史・研究文脈 | 本番RAGから除外 |
| 10 | Barbara MacMichael Stewart. *A Study of the Relationship Between Clinical Manifestations of Neurotic Anxiety and Rorschach Test Performance*; Doctoral dissertation; University of Southern California; 1950; en | 歴史・研究文脈資料 | 歴史・研究文脈 | 本番RAGから除外 |
| 11 | Paul M. Lerner. *Psychoanalytic Theory and the Rorschach*; The Analytic Press; 1991; en | 歴史・研究文脈資料 | 歴史・研究文脈 | 本番RAGから除外 |
| 12 | John E. Exner Jr. (editor). *Issues and Methods in Rorschach Research*; Lawrence Erlbaum Associates; 1995; en | 専門補足資料 | 専門・隣接領域 | 本番RAGから除外 |
| 13 | Irving B. Weiner. *Principles of Rorschach Interpretation, Second Edition*; Second edition; Lawrence Erlbaum Associates; 2003; en | 中核解釈資料 | Exner包括システム解釈 | 検証済みExner解釈補助にのみ使用 |
| 14 | John E. Exner Jr. *The Rorschach: A Comprehensive System, Volume 2: Interpretation, Second Edition*; Second edition; John Wiley & Sons; 1991; en | Exner CS直接原典 | Exner包括システム | 検証済みExner解釈補助にのみ使用 |
| 15 | John E. Exner Jr.; Irving B. Weiner. *The Rorschach: A Comprehensive System, Volume 3: Assessment of Children and Adolescents*; John Wiley & Sons; 1982; en | Exner CS直接原典 | Exner包括システム | 成人用本番コーパスから除外 |
| 16 | J. Reid Meloy; Marvin W. Acklin; Carl B. Gacono; James F. Murray; Charles A. Peterson. *Contemporary Rorschach Interpretation*; Lawrence Erlbaum Associates; 1997; en | 専門補足資料 | 専門・隣接領域 | 本番RAGから除外 |
| 17 | James H. Kleiger. *Disordered Thinking and the Rorschach: Theory, Research, and Differential Diagnosis*; The Analytic Press; 1999; en | 専門補足資料 | 専門・隣接領域 | 本番RAGから除外 |
| 18 | John E. Exner Jr.; Manuel Esbert Ramírez (translator). *Manual de Codificación del Rorschach para el Sistema Comprehensivo*; Third Spanish edition; source original fifth edition; Editorial Psimática; 2008; es | Exner CS直接原典 | Exner包括システム | 用語照合のみ、原文はRAGから除外 |
| 19 | Rajendra K. Misra; Meena K. Kharkwal; Maurita A. Kilroy; Komilla Thapa. *Rorschach Test: Theory and Practice*; SAGE Publications; 1996; en | 歴史・研究文脈資料 | 歴史・研究文脈 | 本番RAGから除外 |
| 20 | John E. Exner Jr.; 孟宪璋 (translator); 唐迎婵 (translator). *罗夏测验综合系统工作手册（原书第5版）*; First Chinese edition; source original fifth edition; Jinan University Press; 2013; zh | Exner CS直接原典 | Exner包括システム | 用語照合のみ、原文はRAGから除外 |
| 21 | John E. Exner Jr.; 孟宪璋 (translator); 任滨海 (translator); 刘浩鑫 (translator). *罗夏测验解释入门*; First Chinese edition; Jinan University Press; 2013; zh | 中核解釈資料 | Exner包括システム解釈 | 用語照合のみ、原文はRAGから除外 |
| 22 | John E. Exner Jr. *A Rorschach Workbook for the Comprehensive System, Fifth Edition*; Fifth edition; Rorschach Workshops; 2001; en | Exner CS直接原典 | Exner包括システム | ページ単位確認後にExner規則根拠として使用 |
| 23 | Ewald Bohm; Anne G. Beck (translator); Samuel J. Beck (translator). *A Textbook in Rorschach Test Diagnosis: For Psychologists, Physicians and Teachers*; Grune & Stratton; 1958; en | 歴史・研究文脈資料 | Bohm歴史体系 | 本番RAGから除外 |
| 24 | Eric A. Zillmer; Molly Harrower; Barry A. Ritzler; Robert P. Archer. *The Quest for the Nazi Personality: A Psychological Investigation of Nazi War Criminals*; Routledge digital printing; Routledge; 2009; en | 非専門・製品範囲外資料 | 製品範囲外 | 本番RAGから除外 |
| 25 | Katherine A. Hubbard. *Queer Ink: A Blotted History Towards Liberation*; Routledge; 2020; en | 非専門・製品範囲外資料 | 製品範囲外 | 本番RAGから除外 |
| 26 | Carl B. Gacono; J. Reid Meloy. *The Rorschach Assessment of Aggressive and Psychopathic Personalities*; Routledge edition; Routledge; 2012; en | 専門補足資料 | 専門・隣接領域 | 本番RAGから除外 |
| 27 | Carl B. Gacono (editor); F. Barton Evans (editor); Nancy Kaser-Boyd; Lynne A. Gacono. *The Handbook of Forensic Rorschach Assessment*; Lawrence Erlbaum Associates; 2008; en | 専門補足資料 | 専門・隣接領域 | 本番RAGから除外 |
| 28 | Jessica R. Gurley. *Essentials of Rorschach Assessment: Comprehensive System and R-PAS*; John Wiley & Sons; 2017; en | R-PAS・他体系境界資料 | CS・R-PAS比較 | 体系境界規則のみ、原文はRAGから除外 |
| 29 | Joni L. Mihura (editor); Gregory J. Meyer (editor). *Uso del sistema de evaluación del desempeño de Rorschach (R-PAS)*; スペイン語派生版、版情報未確認; 出版情報未確認; 2018（著作権表記による）; es | R-PAS・他体系境界資料 | R-PAS派生資料 | 体系境界規則のみ、原文はRAGから除外 |
| 30 | Gregory J. Meyer; Donald J. Viglione; Joni L. Mihura; Robert E. Erard; Philip Erdberg. *R-PAS (Rorschach Performance Assessment System): Administration, Coding, Interpretation, and Technical Manual*; First edition; R-PAS LLC; 2011; en | R-PAS・他体系境界資料 | R-PAS | 体系境界規則のみ、原文はRAGから除外 |
| 31 | Florence Halpern. *A Clinical Approach to Children's Rorschachs*; Grune & Stratton; 1953; en | 歴史・研究文脈資料 | 歴史・研究文脈 | 本番RAGから除外 |
| 32 | Shira Tibon-Czopp; Irving B. Weiner. *Rorschach Assessment of Adolescents: Theory, Research, and Practice*; Springer Science+Business Media New York; 2016; en | 専門補足資料 | 専門・隣接領域 | 本番RAGから除外 |
| 33 | Nettie Herrington Ledwith. *Rorschach Responses of Elementary School Children: A Normative Study*; University of Pittsburgh Press; 1959; en | 歴史・研究文脈資料 | 歴史・研究文脈 | 本番RAGから除外 |
| 34 | Louise Bates Ames; Janet Learned; Ruth W. Metraux; Richard N. Walker. *Child Rorschach Responses: Developmental Trends from Two to Ten Years*; Paul B. Hoeber; 1952; en | 歴史・研究文脈資料 | 歴史・研究文脈 | 本番RAGから除外 |
| 35 | Louise Bates Ames; Ruth W. Metraux; Janet Learned Rodell; Richard N. Walker. *Rorschach Responses in Old Age, Revised Edition*; Revised edition; Brunner/Mazel; 1973; en | 歴史・研究文脈資料 | 歴史・研究文脈 | 本番RAGから除外 |
| 36 | Hermann Rorschach; Paul Lemkau (translator); Bernard Kronenberg (translator). *Psychodiagnostics: A Diagnostic Test Based on Perception, Including Rorschach's Paper, The Application of the Form Interpretation Test*; Sixth edition; Hans Huber; United States edition by Grune & Stratton; 1964; en | 歴史・研究文脈資料 | 体系化以前のRorschach原法 | 本番RAGから除外 |
| 37 | Naamah Akavia. *Subjectivity in Motion: Life, Art, and Movement in the Work of Hermann Rorschach*; Routledge; 2013; en | 非専門・製品範囲外資料 | 製品範囲外 | 本番RAGから除外 |
| 38 | Florence R. Miale; Michael Selzer. *The Nuremberg Mind: The Psychology of the Nazi Leaders*; First paperback printing; Quadrangle/The New York Times Book Co.; 1977; en | 非専門・製品範囲外資料 | 製品範囲外 | 本番RAGから除外 |
| 39 | James P. Choca. *The Rorschach Inkblot Test: An Interpretive Guide for Clinicians*; First edition; American Psychological Association; 2013; en | 専門補足資料 | 専門・隣接領域 | 本番RAGから除外 |
| 40 | Edward Aronow; Marvin Reznikoff; Kevin Moreland. *The Rorschach Technique: Perceptual Basics, Content Interpretation, and Applications*; Allyn and Bacon; 1994; en | 歴史・研究文脈資料 | Aronow・Reznikoff・Morelandアプローチ | 本番RAGから除外 |
| 41 | Anne Bar Din. *La prueba de Rorschach: Un manual de aplicación pluricultural*; First edition; Siglo XXI Editores; 2001; es | R-PAS・他体系境界資料 | 多文化的非Exnerアプローチ | 体系境界規則のみ、原文はRAGから除外 |
| 42 | Hellmut Brinkmann Sch. *El Test de Rorschach: Introducción a su estudio y utilización*; First edition; RIL Editores; 2014; es | 歴史・研究文脈資料 | 混合非Exnerアプローチ | 本番RAGから除外 |
| 43 | Robin Groody. *Segredos dos Testes de Rorschach e Zulliger*; Version 2; Self-distributed; no professional publisher identified; 2003; pt | 非専門・製品範囲外資料 | 非専門的な攻略資料 | 本番RAGから除外 |
| 44 | James P. Choca; Edward D. Rossini. *Assessment Using the Rorschach Inkblot Test*; American Psychological Association; 2018; en | R-PAS・他体系境界資料 | Basic Rorschach・Hermアプローチ | 体系境界規則のみ、原文はRAGから除外 |
| 45 | 杨东; 吉沉洪. *实用罗夏墨迹测验*; First edition; Chongqing Publishing House; 2008; zh | R-PAS・他体系境界資料 | 中国語圏の地域的非Exner体系 | 体系境界規則のみ、原文はRAGから除外 |
| 46 | Louise Bates Ames; Ruth W. Metraux; Richard N. Walker. *Adolescent Rorschach Responses: Developmental Trends from Ten to Sixteen Years*; Second printing; introduction describes a second edition; Brunner/Mazel; 1971; en | 歴史・研究文脈資料 | 歴史・研究文脈 | 本番RAGから除外 |
| 47 | François-David Camps; Gaëlle Malle. *S'entraîner à la cotation du Rorschach et du TAT*; Dunod; 2020; fr | R-PAS・他体系境界資料 | フランス投映法 | 体系境界規則のみ、原文はRAGから除外 |
| 48 | Damion Searls. *Teste de Rorschach: A Origem*; 出版・翻訳情報未確認; 刊行年不明; pt | R-PAS・他体系境界資料 | 書誌未確定のポルトガル語派生資料 | 体系境界規則のみ、原文はRAGから除外 |
| 49 | プロジェクト内部派生資料1（非公開） | プロジェクト内部派生資料 | プロジェクト内部の誤り記録 | 本番RAGから除外 |
| 50 | プロジェクト内部派生資料2（非公開） | プロジェクト内部派生資料 | 出典未確定の内部解釈メモ | 本番RAGから除外 |
| 51 | プロジェクト内部派生資料3（非公開） | プロジェクト内部派生資料 | 出典未確定の内部CS派生資料 | 本番RAGから除外 |
| 52 | John E. Exner Jr. *The Rorschach: A Comprehensive System, Volume 1: Basic Foundations, Third Edition*; Third edition; John Wiley & Sons; 1993; en | Exner CS直接原典 | Exner包括システム | 版・規則系譜のみ、原文はRAGから除外 |
| 53 | John E. Exner Jr. *The Rorschach: A Comprehensive System, Volume 1: Basic Foundations and Principles of Interpretation, Fourth Edition*; Fourth edition; John Wiley & Sons; 2003; en | Exner CS直接原典 | Exner包括システム | ページ単位確認後にExner規則根拠として使用 |

## Exner計算根拠

アプリが表示するUpper Section、Lower Section、Special Indicesと入力規則を、次の印刷ページで再確認しました。PDFビューアのページ番号ではなく、書籍に印刷されたページ番号です。

| 確認範囲 | 直接根拠 | 確認結果 |
| --- | --- | --- |
| 施行・コーディング・構造一覧表 | Volume 1第4版、印刷pp. 68-157；Workbook第5版、関連章および印刷pp. 91-101 | 入力規則と構造一覧表全範囲を関数・画面・PDF・テストに対応づけました。 |
| Upper Section | Volume 1第4版、印刷pp. 148-150；Workbook第5版、印刷pp. 91-92 | Location、DQ、FQ、決定因、内容、Special Score、Z関連合計を再確認しました。 |
| Lower Section | Volume 1第4版、印刷pp. 151-155；Workbook第5版、印刷pp. 93-99 | CoreからSelf-Perceptionまでの計算と表示を確認し、欠けていた`GHR:PHR`表示を復元しました。 |
| Special Indices | Volume 1第4版、印刷p. 156；Workbook第5版、印刷pp. 100-101 | PTI、DEPI、CDI、S-CON、HVI、OBSの条件と境界を確認しました。 |
| 年齢適用と調整 | Volume 1第4版、印刷p. 157；Workbook第5版、印刷pp. 100-101 | 計算機は条件充足を表示し、適用可否は臨床家が判断する既存境界を維持しました。 |

## 他体系との境界

他体系の資料は計算根拠を補う資料ではありません。似た記号や概念がExner包括システムに混入しないよう、次の差を確認するために用います。

| 境界 | 確認した差 | 計算機とAIの動作 |
| --- | --- | --- |
| 施行 | R-PASはR-Optimized施行で反応数を調整し、Exner CS施行とは異なります。 | R-PAS施行をCSへ自動変換しません。 |
| Location・DQ・空白 | R-PASのSy、Vg、SI、SRはCSのDQとSに直接対応しません。 | R-PAS専用符号をCS入力として受け取ったり変換したりしません。 |
| 決定因 | R-PASは複数の陰影・反射変形を統合し、Cnを用いません。Basic Rorschachも別体系です。 | 現在のExner決定因一覧と運動添字を維持します。 |
| 形態質・規準 | R-PASの形態質表と標準得点はCSのFQ表や構造一覧表規準ではありません。 | R-PAS数値をCS構造一覧表に入れません。 |
| 構造一覧表・指標 | R-PASはCSのUpper/Lower/Special Indicesをそのまま維持しません。 | アプリはExner CS構造一覧表だけを計算します。 |
| 歴史的・地域的体系 | Klopfer、Beck、Piotrowski、フランス投映法のkan/kob/clob、中国の地域符号は別規則です。 | 似た文字でもExner符号へ変換せず、範囲を案内します。 |
| 隣接検査・判断 | MMPI統合、診断、治療、法的判断は計算機の範囲外です。 | AIは依頼を断りExner CSの質問へ戻します。 |

## 参照文書とAIの適用範囲

- 本番RAGコーパスには、ページ単位で確認したExner包括システムの内容だけを収録します。
- R-PAS、Basic Rorschach、フランス投映法、中国の地域体系、歴史的体系の原文は本番ベクトル空間に入れません。
- 他体系の内容は短い境界規則と評価質問にのみ反映します。
- AI補助機能はR-PASの変換・解釈、MMPI統合、診断・治療・法的判断、システム情報の取得要求を断り、Exner包括システムの質問へ戻します。
- 通常のExner質問を過剰に遮断しないことも、五言語の別ケースで確認します。

## 残る限界

- Volume 1第4版p.156とWorkbook第5版p.101・RIAP 5出力では、PTIのWSum6境界が一点異なります。アプリはWorkbookとRIAP 5に従い、`R > 16`の場合は`WSum6 > 17`を維持します。
- 同じ非レベルSpecial Scoreを一反応内で重複入力することを直接禁止する記述は見つかりませんでした。根拠なく動作を変更していません。
- 計算機はS-CONの適用年齢を判断するための年齢を収集しません。入力値が条件を満たすかを表示し、年齢と全臨床資料を把握する臨床家が適用可否を判断します。
- 53文献群すべてを本文監査しましたが、全書を新しいOCRで全面変換したわけではありません。重要ページの判読が曖昧な場合に高品質OCRと原ページ照合を用いました。

## 著作権と公開範囲

公開記録には文献名、版、出版情報、印刷ページ、資料の役割、確認した規則だけを残します。個別の原資料ファイル、OCR原文、ローカルファイル名、非公開の作業識別子、APIキー、モデル回答原文、実際の検査資料は公開しません。規則は検証に必要な範囲だけ要約し、原文を長く複製しません。

---

本文監査完了: **53 / 53**
