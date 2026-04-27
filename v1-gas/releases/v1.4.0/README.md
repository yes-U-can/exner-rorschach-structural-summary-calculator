# v1.4.0

## Metadata

| Field | Value |
| --- | --- |
| Version | `v1.4.0` |
| Release date | 2026-01-03 |
| Release type | 마이너 패치 |
| GAS deployment | [Open GAS app](https://script.google.com/macros/s/AKfycbxWtI1q27rXuH4feBEGpoy0fIhXZU0ROJ2gRv5RbaQVPxnNgznTI9czHDrVzaS7wSMM/exec) |

## Patch Notes

# 주요 수정사항

## *개요*

1.4.0 마이너 패치가 적용되었습니다.

> **다국어 지원 기능을 추가했습니다.**
>
- 한국어, 영어, 일본어, 스페인어, 포르투갈어 5개 언어를 지원합니다.

    웹앱 우측 상단에 언어 선택 버튼(🌐)을 추가하여 언제든지 언어를 전환할 수 있습니다.

- 모든 UI 텍스트, 모달 메시지, 안내 문구, 슬롯 경고 메시지, 푸터 텍스트가 5개 언어로 번역되었습니다.
- 더보기 탭의 모든 항목 설명이 5개 언어로 번역되었습니다.

또한 일련의 변경점은 [Gems 챗봇](https://gemini.google.com/gem/1QDCPHshPvq5J9iIKeV-1Nvy0EFzKPN6Y?usp=sharing)에 반영되었습니다.

---

## *세부사항*

### *다국어 지원 기능 추가*

웹앱에 5개 언어(한국어, 영어, 일본어, 스페인어, 포르투갈어) 지원 기능을 추가하고,

모든 UI 텍스트를 번역했습니다.

> **언어 선택 버튼**
>
- 웹앱 우측 상단에 지구본 아이콘(🌐) 버튼 추가
- 페이지 로드 시 JavaScript가 `language-selector-collapsed` 클래스를 추가하여 버튼 표시
- 초기 모달이 열려 있어도 언어 선택 버튼이 모달 위에 표시됨 (z-index: 10001 > 1000)
- 초기 모달이 닫힌 후에도 언어 선택 버튼이 계속 표시됨
- 마우스 호버 시 언어 선택 옵션(한국어, English, 日本語, Español, Português) 표시
- 선택한 언어는 로컬 스토리지에 저장되어 다음 방문 시에도 유지됨

> **기술적 세부사항**
>
- 번역 데이터 구조

    ---

    - `translations` 객체: 기본 UI 텍스트 번역 (201개 항목)

        ---

        - 애플리케이션 기본 요소 (app_title, tab_scoring, tab_notice)
        - 버튼 텍스트 (btn_calc, btn_reset, btn_add, btn_del)
        - 초기 접속 모달 (modal_welcome_title, modal_welcome_new, modal_welcome_load, modal_welcome_provider 등)
        - 초기화 확인 모달 (modal_reset_title, modal_reset_msg, modal_reset_yes, modal_reset_no)
        - AI 해석 요청 모달 (modal_ai_title, modal_ai_msg, modal_ai_open, modal_ai_cancel)
        - 링크 및 기타 (link_manual, link_bug, link_patch, link_lab, link_privacy)
        - 개인정보처리방침 (privacy_title, privacy_notice_title, privacy_notice_text)
        - 안내 메시지 (list_header, loader_calc, loader_sub, guide_response, tooltip_info)
        - 결과 화면 탭 및 버튼 (tab_upper, tab_lower, tab_special, btn_rawdata, btn_summary, btn_print, btn_ai)
        - Special Indices 체크박스 라벨 (scon_main, scon_note, depi_main, cdi_main, hvi_main, obs_main, obs_r1, obs_r2, obs_r3)
        - 슬롯 경고 메시지 (toast_warning_over_scoring, toast_warning_category_dup, toast_warning_hierarchy, toast_warning_too_many_responses, toast_warning_validity, toast_info_reset 및 각 메시지 텍스트)
        - 푸터 텍스트 (footer_title, footer_copyright)

    - `listTranslations` 객체: 더보기 탭 항목 설명 번역

        ---

        - `category`: 카테고리 이름 (10개 카테고리)
        - `categoryDesc`: 카테고리 설명 (10개 카테고리)
        - `items`: 개별 항목 설명 (106개 항목)


- 동적 텍스트 업데이트

    ---

    - `changeLanguage()` 함수: 언어 변경 시 모든 UI 텍스트를 동적으로 업데이트
    - `updateAllTexts()` 함수: 현재 선택된 언어에 맞게 모든 텍스트 요소 업데이트
    - `generateListTable()` 함수: 더보기 탭 테이블을 현재 언어로 재생성
    - `updateLanguageButtons()` 함수: 언어 선택 버튼의 활성 상태 업데이트

- 번역 함수

    ---

    - `t(key)`: 번역 키를 받아 현재 언어에 맞는 텍스트 반환
    - `getTranslatedCategoryName()`: 카테고리 이름 번역 가져오기
    - `getTranslatedCategoryDescription()`: 카테고리 설명 번역 가져오기
    - `getTranslatedItemDescription()`: 개별 항목 설명 번역 가져오기


### *번역 현황 및 언어별 비교*

모든 UI 요소와 더보기 탭 항목 설명이 5개 언어로 완전히 번역되었습니다.

> 번역 완료 항목
>
>
>
> | 카테고리 | 완료 | 총계 |
> | --- | --- | --- |
> | **기본 UI 텍스트** | 45개 | 45개 |
> | **결과 화면 탭/버튼** | 7개 | 7개 |
> | **체크박스 라벨** | 9개 | 9개 |
> | **슬롯 경고 메시지** | 12개 | 12개 |
> | **푸터 텍스트** | 2개 | 2개 |
> | **카테고리 이름** | 10개 | 10개 |
> | **카테고리 설명** | 10개 | 10개 |
> | **항목 설명** | 106개 | 106개 |
> | **총계** | **201개** | **201개** |
>
> > 언어별 번역 완성도
> >
> >
> >
> > | 언어 | 완료 | 완성도 |
> > | --- | --- | --- |
> > | **한국어 (ko)** | 201개 | 100% ✅ |
> > | **영어 (en)** | 201개 | 100% ✅ |
> > | **일본어 (ja)** | 201개 | 100% ✅ |
> > | **스페인어 (es)** | 201개 | 100% ✅ |
> > | **포르투갈어 (pt)** | 201개 | 100% ✅ |
> >
> > ✅ **모든 언어의 번역이 완료되었습니다.**
> >

### *주요 UI 요소별 언어별 번역 비교*

번역이 부족한 부분은 제보해주세요, 수정하겠습니다.

> **애플리케이션 기본 요소**
>

| 번역 키 | 한국어 (ko) | 영어 (en) | 일본어 (ja) | 스페인어 (es) | 포르투갈어 (pt) |
| --- | --- | --- | --- | --- | --- |
| `app_title` | 로샤 구조 요약지 계산 프로그램 | Rorschach Structural Summary Calculator | ロールシャッハ構造一覧表計算プログラム | Calculadora del Sumario Estructural de Rorschach | Calculadora do Sumário Estrutural de Rorschach |
| `tab_scoring` | 채점 & 구조 요약 | Scoring & Structural Summary | スコアリング & 構造一覧表 | Codificación y Sumario Estructural | Codificação e Sumário Estrutural |
| `tab_notice` | 더보기 | More | その他 | Más | Mais |

> **버튼 텍스트**
>

| 번역 키 | 한국어 (ko) | 영어 (en) | 일본어 (ja) | 스페인어 (es) | 포르투갈어 (pt) |
| --- | --- | --- | --- | --- | --- |
| `btn_calc` | 결과 계산하기 | Calculate Results | 結果を計算する | Calcular Resultados | Calcular Resultados |
| `btn_reset` | 입력값 초기화하기 | Reset Input | 入力をリセット | Restablecer Entrada | Redefinir Entrada |
| `btn_add` | 추가 | Add | 追加 | Añadir | Adicionar |
| `btn_del` | 삭제 | Delete | 削除 | Eliminar | Excluir |

> **초기 접속 모달**
>

| 번역 키 | 한국어 (ko) | 영어 (en) | 일본어 (ja) | 스페인어 (es) | 포르투갈어 (pt) |
| --- | --- | --- | --- | --- | --- |
| `modal_welcome_title` | 로샤 구조 요약지 계산 프로그램 | Rorschach Structural Summary Calculator | ロールシャッハ構造一覧表計算プログラム | Calculadora del Sumario Estructural de Rorschach | Calculadora do Sumário Estrutural de Rorschach |
| `modal_welcome_new` | 새로 만들기 | Create New | 新規作成 | Crear Nuevo | Criar Novo |
| `modal_welcome_load` | 샘플 데이터로 시작하기 | Start with Sample Data | サンプルデータで開始 | Iniciar con Datos de Muestra | Iniciar com Dados de Amostra |
| `modal_welcome_load_saved` | 자동저장된 내용 불러오기 | Load Auto-saved Content | 自動保存された内容を読み込む | Cargar Contenido Auto-guardado | Carregar Conteúdo Auto-salvo |
| `modal_welcome_continue` | 작업 이어하기 | Continue Work | 作業を続ける | Continuar Trabajo | Continuar Trabalho |
| `modal_welcome_provider` | 서울임상심리연구소 제공 | Provided by Seoul Institute of Clinical Psychology | ソウル臨床心理研究所提供 | Proporcionado por Instituto de Psicología Clínica de Seúl | Fornecido por Instituto de Psicologia Clínica de Seul |

> **초기화 확인 모달**
>

| 번역 키 | 한국어 (ko) | 영어 (en) | 일본어 (ja) | 스페인어 (es) | 포르투갈어 (pt) |
| --- | --- | --- | --- | --- | --- |
| `modal_reset_title` | 다시 한 번 확인해 주세요 | Please confirm again | 再確認してください | Por favor confirme de nuevo | Por favor, confirme novamente |
| `modal_reset_msg` | 현재 입력된 모든 값들을 초기화 하시겠습니까? | Do you want to reset all current inputs? | 現在の入力値をすべてリセットしますか？ | ¿Desea restablecer todos los valores introducidos? | Deseja redefinir todos os valores inseridos? |
| `modal_reset_yes` | 예 | Yes | はい | Sí | Sim |
| `modal_reset_no` | 아니오 | No | いいえ | No | Não |

> **AI 해석 요청 모달**
>

| 번역 키 | 한국어 (ko) | 영어 (en) | 일본어 (ja) | 스페인어 (es) | 포르투갈어 (pt) |
| --- | --- | --- | --- | --- | --- |
| `modal_ai_title` | 준비 단계: 이전 화면에서 초록색 버튼들을 눌러 csv 파일을 다운로드 해주세요. | Preparation Step: Please download the CSV file by clicking the green buttons on the previous screen. | 準備段階：前の画面の緑色のボタンを押してCSVファイルをダウンロードしてください。 | Paso de preparación: Descargue el archivo CSV haciendo clic en los botones verdes de la pantalla anterior. | Etapa de preparação: Baixe o arquivo CSV clicando nos botões verdes na tela anterior. |
| `modal_ai_msg` | 현재 연결되는 AI 챗봇은 구글 계정이 있어야 사용 가능한 Gemini Gems입니다. | The AI chatbot currently connected is Gemini Gems, which requires a Google account. | 現在接続されているAIチャットボットは、Googleアカウントが必要なGemini Gemsです。 | El chatbot de IA conectado actualmente es Gemini Gems, que requiere una cuenta de Google. | O chatbot de IA conectado atualmente é Gemini Gems, que requer uma conta do Google. |
| `modal_ai_open` | 새로운 창에서 열기 | Open in New Window | 新しいウィンドウで開く | Abrir en Nueva Ventana | Abrir em Nova Janela |
| `modal_ai_cancel` | 결과 화면으로 돌아가기 | Return to Results | 結果画面に戻る | Volver a Resultados | Voltar para Resultados |

> **링크 및 기타**
>

| 번역 키 | 한국어 (ko) | 영어 (en) | 일본어 (ja) | 스페인어 (es) | 포르투갈어 (pt) |
| --- | --- | --- | --- | --- | --- |
| `link_manual` | 프로그램 사용법 | User Manual | プログラムの使い方 | Manual de Usuario | Manual do Usuário |
| `link_bug` | 버그 및 개선사항 제보 | Report Bugs & Improvements | バグ・改善報告 | Reportar Errores y Mejoras | Relatar Erros e Melhorias |
| `link_patch` | 프로그램 패치 노트 | Patch Notes | パッチノート | Notas del Parche | Notas de Atualização |
| `link_lab` | 서울임상심리연구소 | Seoul Clinical Psychology Institute | ソウル臨床心理研究所 | Instituto de Psicología Clínica de Seúl | Instituto de Psicologia Clínica de Seul |
| `link_privacy` | 개인정보처리방침 | Privacy Policy | 個人情報処理方針 | Política de Privacidad | Política de Privacidade |

> **개인정보처리방침**
>

| 번역 키 | 한국어 (ko) | 영어 (en) | 일본어 (ja) | 스페인어 (es) | 포르투갈어 (pt) |
| --- | --- | --- | --- | --- | --- |
| `privacy_title` | 개인정보처리방침 (Privacy Policy) | Privacy Policy | 個人情報処理方針 (Privacy Policy) | Política de Privacidad | Política de Privacidade |
| `privacy_notice_title` | ※ 브라우저 저장소(LocalStorage) 사용 고지 | ※ Browser Storage (LocalStorage) Usage Notice | ※ ブラウザ保存域(LocalStorage)使用告知 | ※ Aviso de Uso de Almacenamiento del Navegador (LocalStorage) | ※ Aviso de Uso de Armazenamento do Navegador (LocalStorage) |
| `privacy_notice_text` | 본 앱은 귀하의 채점 편의를 위해 '채점 & 구조 요약' 탭에 입력한 데이터를 귀하의 컴퓨터 브라우저 내의 로컬 스토리지(LocalStorage)에 임시 저장합니다. 이 데이터는 서버로 전송되거나 운영자가 접근할 수 없으며, 브라우저를 재방문할 때 입력 내용을 복원하기 위한 목적으로만 사용됩니다. | This app temporarily stores data entered in the 'Scoring & Structural Summary' tab in your computer's browser's local storage (LocalStorage) for your scoring convenience. This data is not transmitted to the server or accessible by the operator, and is used solely for the purpose of restoring input content when you revisit the browser. | 本アプリは、ご利用者の採点の便宜のため、「採点 & 構造一覧表」タブに入力したデータを、ご利用者のコンピュータのブラウザ内のローカルストレージ(LocalStorage)に一時保存します。このデータはサーバーに送信されたり、運営者がアクセスすることはできず、ブラウザを再訪問する際に入力内容を復元する目的でのみ使用されます。 | Esta aplicación almacena temporalmente los datos ingresados en la pestaña 'Codificación y Sumario Estructural' en el almacenamiento local (LocalStorage) del navegador de su computadora para su conveniencia de codificación. Estos datos no se transmiten al servidor ni son accesibles por el operador, y se usan únicamente para restaurar el contenido de entrada cuando vuelva a visitar el navegador. | Este aplicativo armazena temporariamente os dados inseridos na aba 'Codificação e Sumário Estrutural' no armazenamento local (LocalStorage) do navegador do seu computador para sua conveniência de codificação. Esses dados não são transmitidos ao servidor nem acessíveis pelo operador, e são usados apenas para restaurar o conteúdo de entrada quando você revisitar o navegador. |

> **안내 메시지**
>

| 번역 키 | 한국어 (ko) | 영어 (en) | 일본어 (ja) | 스페인어 (es) | 포르투갈어 (pt) |
| --- | --- | --- | --- | --- | --- |
| `list_header` | 각 채점 항목의 코드 목록과 설명입니다. | Code list and descriptions for each scoring item. | 各スコアリング項目のコード一覧と説明です。 | Lista de códigos y descripción de cada ítem de codificación. | Lista de códigos e descrição de cada item de pontuação. |
| `loader_calc` | 계산 중... | Calculating... | 計算中... | Calculando... | Calculando... |
| `loader_sub` | 계산 결과는 브라우저에 자동저장되므로 나중에 불러올 수 있습니다 | Calculation results are auto-saved in the browser and can be loaded later. | 計算結果はブラウザに自動保存されるため、後で読み込むことができます。 | Los resultados del cálculo se guardan automáticamente en el navegador y se pueden cargar más tarde. | Os resultados do cálculo são salvos automaticamente no navegador e podem ser carregados posteriormente. |
| `guide_response` | [Response] 항목은 피검자의 언어 반응을 메모하는 공간이며, 계산에 영향을 주지 않으므로 비워둬도 괜찮습니다.<br>[Score]와 [G/PHR] 항목은 자동으로 계산되므로 직접 입력할 필요가 없습니다.<br>단, [Score]는 [Card]와 [Z] 유형을 선택해야 값이 자동 계산됩니다. | The [Response] section is for noting the subject's verbal responses; it does not affect calculations, so it can be left blank.<br>The [Score] and [G/PHR] sections are calculated automatically, so no manual input is needed.<br>However, for [Score], values are automatically calculated only after selecting the [Card] and [Z] types. | [Response]項目は被検者の言語反応をメモする場所であり、計算には影響しないため空欄でも構いません。<br>[Score]と[G/PHR]項目は自動的に計算されるため、直接入力する必要はありません。<br>ただし、[Score]は[Card]（図版）と[Z]（組織化）のタイプを選択しないと値が自動計算されません。 | La sección [Response] es para anotar las respuestas verbales del sujeto; no afecta a los cálculos, por lo que puede dejarse en blanco.<br>Las secciones [Score] y [G/PHR] se calculan automáticamente, por lo que no es necesario introducirlas manualmente.<br>Sin embargo, para [Score], los valores solo se calculan automáticamente después de seleccionar los tipos de [Card] (Lámina) y [Z]. | A seção [Response] serve para anotar as respostas verbais do sujeito; não afeta os cálculos, portanto pode ser deixada em branco.<br>As seções [Score] e [G/PHR] são calculados automaticamente, portanto não é necessária entrada manual.<br>No entanto, para [Score], os valores são calculados automaticamente apenas após a seleção dos tipos de [Card] (Cartão) e [Z]. |
| `tooltip_info` | 최하단의 행에 대해서만 조작 가능하며,\n최대 50개까지 가능합니다.\n\n[Tip]\n반응 행의 순서는 결과 계산에 영향을 미치지 않습니다, 예를 들어\n8번째 행에 6번 카드에 대한 내용을 기록하였고\n14번째 행에 2번 카드에 대한 내용을 기록하여도 문제 없습니다. | Only the bottommost row can be manipulated,\nand up to 50 rows are possible.\n\n[Tip]\nThe order of response rows does not affect the calculation results. For example,\nrecording content for Card 6 in the 8th row and\nrecording content for Card 2 in the 14th row is fine. | 最下行のみ操作可能で、\n最大50個まで可能です。\n\n[Tip]\n反応行の順序は結果計算に影響しません。例えば\n8行目に6番カードの内容を記録し、\n14行目に2番カードの内容を記録しても問題ありません。 | Solo se puede manipular la fila inferior,\ny hasta 50 filas son posibles.\n\n[Tip]\nEl orden de las filas de respuesta no afecta los resultados del cálculo. Por ejemplo,\nregistrar contenido para la Lámina 6 en la fila 8 y\nregistrar contenido para la Lámina 2 en la fila 14 está bien. | Apenas a linha inferior pode ser manipulada,\ne até 50 linhas são possíveis.\n\n[Dica]\nA ordem das linhas de resposta não afeta os resultados do cálculo. Por exemplo,\nregistrar conteúdo para o Cartão 6 na linha 8 e\nregistrar conteúdo para o Cartão 2 na linha 14 está bem. |

> **결과 화면 탭 및 버튼**
>

| 번역 키 | 한국어 (ko) | 영어 (en) | 일본어 (ja) | 스페인어 (es) | 포르투갈어 (pt) |
| --- | --- | --- | --- | --- | --- |
| `tab_upper` | 상위 섹션 | Upper Section | 上位セクション | Sección Superior | Seção Superior |
| `tab_lower` | 하위 섹션 | Lower Section | 下位セクション | Sección Inferior | Seção Inferior |
| `tab_special` | 특수 지표 | Special Indices | 特殊指標 | Índices Especiales | Índices Especiais |
| `btn_rawdata` | Raw Data | Raw Data | Raw Data | Raw Data | Raw Data |
| `btn_summary` | Summary | Summary | Summary | Summary | Summary |
| `btn_print` | 인쇄 | Print | 印刷 | Imprimir | Imprimir |
| `btn_ai` | AI에게 해석 부탁하기 | Request AI Interpretation | AI解釈をリクエスト | Solicitar Interpretación de IA | Solicitar Interpretação de IA |

> **Special Indices 체크박스 라벨**
>

| 번역 키 | 한국어 (ko) | 영어 (en) | 일본어 (ja) | 스페인어 (es) | 포르투갈어 (pt) |
| --- | --- | --- | --- | --- | --- |
| `scon_main` | 8개 이상 해당될 경우 체크 | Check if 8 or more criteria are met | 8個以上該当する場合チェック | Marcar si se cumplen 8 o más criterios | Marcar se 8 ou mais critérios forem atendidos |
| `scon_note` | ( 주의 : 14세 이상의 수검자에게만 적용 ) | ( Note: Applies only to examinees aged 14 or older ) | ( 注意：14歳以上の受検者にのみ適用 ) | ( Nota: Se aplica solo a examinados de 14 años o más ) | ( Nota: Aplica-se apenas a examinandos com 14 anos ou mais ) |
| `depi_main` | 5개 이상 해당될 경우 체크 | Check if 5 or more criteria are met | 5個以上該当する場合チェック | Marcar si se cumplen 5 o más criterios | Marcar se 5 ou mais critérios forem atendidos |
| `cdi_main` | 4개 이상이면 체크 | Check if 4 or more criteria are met | 4個以上の場合チェック | Marcar si se cumplen 4 o más criterios | Marcar se 4 ou mais critérios forem atendidos |
| `hvi_main` | (1)번을 만족시키고 아래 (2)~(8) 항목 중 4개 이상 해당될 경우 체크 | Check if criterion (1) is met and 4 or more of criteria (2)~(8) are met | (1)を満たし、(2)~(8)項目のうち4個以上該当する場合チェック | Marcar si se cumple el criterio (1) y 4 o más de los criterios (2)~(8) | Marcar se o critério (1) for atendido e 4 ou mais dos critérios (2)~(8) forem atendidos |
| `obs_main` | 아래 조건 중 1개 이상 해당되면 체크 | Check if 1 or more of the conditions below are met | 以下の条件のうち1個以上該当する場合チェック | Marcar si se cumple 1 o más de las condiciones siguientes | Marcar se 1 ou mais das condições abaixo forem atendidas |
| `obs_r1` | (1)~(5) 모두 해당 | All of (1)~(5) are met | (1)~(5)すべて該当 | Todos los criterios (1)~(5) se cumplen | Todos os critérios (1)~(5) são atendidos |
| `obs_r2` | (1)~(4) 중에서 2개 이상 해당 | 2 or more of (1)~(4) are met | (1)~(4)のうち2個以上該当 | 2 o más de (1)~(4) se cumplen | 2 ou mais de (1)~(4) são atendidos |
| `obs_r3` | (1)~(5) 중에서 3개 이상 해당 | 3 or more of (1)~(5) are met | (1)~(5)のうち3個以上該当 | 3 o más de (1)~(5) se cumplen | 3 ou mais de (1)~(5) são atendidos |

> **슬롯 경고 메시지**
>

| 번역 키 | 한국어 (ko) | 영어 (en) | 일본어 (ja) | 스페인어 (es) | 포르투갈어 (pt) |
| --- | --- | --- | --- | --- | --- |
| `toast_warning_over_scoring` | 💡 과잉 채점 주의 | 💡 Over-scoring Warning | 💡 過剰採点注意 | 💡 Advertencia de Sobre-codificación | 💡 Aviso de Sobre-pontuação |
| `toast_warning_over_scoring_msg` | 결정인이 4개 이상인 경우는 드뭅니다.\n1. 수검자가 직접 말한 내용인가요?\n2. 혹시 형태(F)를 중복 채점하지 않았나요? | Having 4 or more determinants is rare.\n1. Did the examinee actually say this?\n2. Did you accidentally score Form (F) multiple times? | 決定因が4個以上の場合は稀です。\n1. 被検者が実際に言った内容ですか？\n2. 形態(F)を重複して採点していませんか？ | Tener 4 o más determinantes es raro.\n1. ¿El examinado realmente dijo esto?\n2. ¿Codificó accidentalmente la Forma (F) múltiples veces? | Ter 4 ou mais determinantes é raro.\n1. O examinando realmente disse isso?\n2. Você pontuou acidentalmente a Forma (F) várias vezes? |
| `toast_warning_category_dup` | 💡 범주 중복 확인 | 💡 Category Duplication Check | 💡 カテゴリ重複確認 | 💡 Verificación de Duplicación de Categoría | 💡 Verificación de Duplicación de Categoría |
| `toast_warning_category_dup_msg` | 사물의 개수가 아닙니다. 같은 범주(예: 동물 A)는 한 번만 입력하세요. | This is not about the number of objects. Enter the same category (e.g., Animal A) only once. | 対象の個数ではありません。同じカテゴリ（例：動物A）は一度だけ入力してください。 | No se trata del número de objetos. Ingrese la misma categoría (ej: Animal A) solo una vez. | Não se trata do número de objetos. Insira a mesma categoria (ex: Animal A) apenas uma vez. |
| `toast_warning_hierarchy` | 💡 위계(Hierarchy) 점검 | 💡 Hierarchy Check | 💡 階層(Hierarchy)点検 | 💡 Verificación de Jerarquía | 💡 Verificação de Hierarquia |
| `toast_warning_hierarchy_msg` | 점수가 많습니다. 동일한 표현에 대해 인지 점수를 중복 입력하지 않도록 주의하세요. (상위 점수가 하위 점수를 포함함) | Too many scores. Be careful not to enter cognitive scores multiple times for the same expression. (Higher scores include lower scores.) | 点数が多すぎます。同じ表現に対して認知点数を重複入力しないよう注意してください。（上位点数は下位点数を含みます） | Demasiadas puntuaciones. Tenga cuidado de no ingresar puntuaciones cognitivas múltiples veces para la misma expresión. (Las puntuaciones superiores incluyen las inferiores.) | Muitas pontuações. Tenha cuidado para não inserir pontuações cognitivas múltiplas vezes para a mesma expressão. (Pontuações superiores incluem as inferiores.) |
| `toast_warning_too_many_responses` | 💡 반응 과다 주의 (R ≥ 45) | 💡 Too Many Responses Warning (R ≥ 45) | 💡 反応過多注意 (R ≥ 45) | 💡 Advertencia de Demasiadas Respuestas (R ≥ 45) | 💡 Aviso de Muitas Respostas (R ≥ 45) |
| `toast_warning_too_many_responses_msg` | 반응 수가 너무 많습니다. 검사 실시 과정을 점검해 보세요. | The number of responses is too high. Please review the test administration process. | 反応数が多すぎます。検査実施過程を点検してください。 | El número de respuestas es demasiado alto. Por favor, revise el proceso de administración de la prueba. | O número de respostas é muito alto. Por favor, revise o processo de administração do teste. |
| `toast_warning_validity` | ⚠️ 타당도 주의 | ⚠️ Validity Warning | ⚠️ 妥当性注意 | ⚠️ Advertencia de Validez | ⚠️ Aviso de Validade |
| `toast_warning_validity_msg` | 반응 수가 14개 미만이면 프로파일의 타당도가 낮아져 해석의 신뢰도가 떨어질 수 있습니다. | If the number of responses is less than 14, the profile validity may be low, reducing the reliability of interpretation. | 反応数が14個未満の場合、プロファイルの妥当性が低くなり、解釈の信頼性が低下する可能性があります。 | Si el número de respuestas es menor que 14, la validez del perfil puede ser baja, reduciendo la confiabilidad de la interpretación. | Se o número de respostas for menor que 14, a validade do perfil pode ser baixa, reduzindo a confiabilidade da interpretação. |
| `toast_info_reset` | 초기화 완료 | Reset Complete | 初期化完了 | Reinicio Completo | Redefinição Completa |
| `toast_info_reset_msg` | 모든 입력값이 초기화되었습니다. | All input values have been reset. | すべての入力値が初期化されました。 | Todos los valores de entrada han sido reiniciados. | Todos os valores de entrada foram redefinidos. |

> **푸터 텍스트**
>

| 번역 키 | 한국어 (ko) | 영어 (en) | 일본어 (ja) | 스페인어 (es) | 포르투갈어 (pt) |
| --- | --- | --- | --- | --- | --- |
| `footer_title` | Computing Program for Rorschach Structural Summary [v1.4.0] | Computing Program for Rorschach Structural Summary [v1.4.0] | ロールシャッハ構造一覧表計算プログラム [v1.4.0] | Programa de Cálculo del Sumario Estructural de Rorschach [v1.4.0] | Programa de Cálculo do Sumário Estrutural de Rorschach [v1.4.0] |
| `footer_copyright` | © 1997–2026 서울임상심리연구소 (Seoul Institute of Clinical Psychology, SICP). All rights reserved. | © 1997–2026 서울임상심리연구소 (Seoul Institute of Clinical Psychology, SICP). All rights reserved. | © 1997–2026 서울임상심리연구소 (Seoul Institute of Clinical Psychology, SICP). All rights reserved. | © 1997–2026 서울임상심리연구소 (Seoul Institute of Clinical Psychology, SICP). All rights reserved. | © 1997–2026 서울임상심리연구소 (Seoul Institute of Clinical Psychology, SICP). All rights reserved. |

> **더보기 탭 카테고리 이름**
>

| 카테고리 키 | 한국어 (ko) | 영어 (en) | 일본어 (ja) | 스페인어 (es) | 포르투갈어 (pt) |
| --- | --- | --- | --- | --- | --- |
| `Card` | Card (카드) | Card | Card (カード) | Card (Lámina) | Card (Cartão) |
| `Location` | Location (영역) | Location | Location (領域) | Location (Ubicación) | Location (Localização) |
| `DQ` | DQ (발달질) | DQ (Developmental Quality) | DQ (発達質) | DQ (Calidad Evolutiva) | DQ (Qualidade Evolutiva) |
| `Determinants` | Determinants (결정인) | Determinants | Determinants (決定因) | Determinants (Determinantes) | Determinants (Determinantes) |
| `FQ` | FQ (형태질) | FQ (Form Quality) | FQ (形態質) | FQ (Calidad de Forma) | FQ (Qualidade de Forma) |
| `Pair` | Pair (쌍반응) | Pair | Pair (対反応) | Pair (Par) | Pair (Par) |
| `Contents` | Contents (내용) | Contents | Contents (内容) | Contents (Contenido) | Contents (Conteúdo) |
| `Popular` | Popular (평범반응) | Popular | Popular (平凡反応) | Popular | Popular |
| `Z` | Z (조직화 활동) | Z (Organizational Activity) | Z (組織化活動) | Z (Actividad Organizacional) | Z (Atividade Organizacional) |
| `Special Score` | Special Score (특수 점수) | Special Score | Special Score (特殊点数) | Special Score (Puntuación Especial) | Special Score (Pontuação Especial) |

> **더보기 탭 카테고리 설명 및 개별 항목 설명**

더보기 탭의 카테고리 설명(10개)과 개별 항목 설명(106개)이 모두 5개 언어로 번역되었습니다.
>
- **카테고리 설명 (10개)**

    ---

    | 카테고리 | 한국어 (ko) | 영어 (en) | 일본어 (ja) | 스페인어 (es) | 포르투갈어 (pt) |
    | --- | --- | --- | --- | --- | --- |
    | **Card** | 피험자에게 제시되는 로르샤흐 잉크 반점 검사의 표준화된 10장 카드를 나타내는 항목입니다. | Items representing the 10 standardized cards of the Rorschach Inkblot Test presented to the subject. | 被検者に提示されるロールシャッハ・インクブロット・テストの標準化された10枚の図版を表す項目です。 | Ítems que representan las 10 láminas estandarizadas de la prueba de manchas de tinta de Rorschach presentadas al sujeto. | Itens que representam os 10 cartões padronizados do teste de mancha de tinta de Rorschach apresentados ao sujeito. |
    | **Location** | 피험자가 잉크 반점의 어느 부분에 초점을 맞추어 반응했는지를 나타내는 채점 항목입니다. | Scoring item indicating which part of the inkblot the subject focused on for the response. | 被検者がインクブロットのどの部分に焦点を当てて反応したかを示すスコアリング項目です。 | Ítem de codificación que indica en qué parte de la mancha de tinta se centró el sujeto para la respuesta. | Item de codificação que indica em qual parte da mancha de tinta o sujeito focou para a resposta. |
    | **DQ** | 피험자가 반응을 구성하기 위해 반점의 위치적 경계를 어떻게 사용했는지의 질적 수준을 나타내는 채점 항목입니다. | Scoring item indicating the quality of how the subject used the location boundaries to form the response. | 被検者が反応を構成するために、ブロットの位置的境界をどのように使用したかの質的水準を示すスコアリング項目です。 | Ítem de codificación que indica la calidad de cómo el sujeto utilizó los límites de la ubicación para formar la respuesta. | Item de codificação que indica a qualidade de como o sujeito usou os limites de localização para formar a resposta. |
    | **Determinants** | 피험자가 반응을 형성할 때 잉크 반점의 어떤 특징(형태, 색채, 움직임, 명암 등)을 사용했는지를 나타내는 가장 중요한 채점 항목입니다. | The most critical scoring item, indicating which features of the inkblot (form, color, movement, shading, etc.) were used to form the response. | 反応を形成する際に、インクブロットのどの特徴（形態、色彩、運動、濃淡など）を使用したかを示す最も重要なスコアリング項目です。 | El ítem de codificación más crítico, que indica qué características de la mancha (forma, color, movimiento, sombreado, etc.) se utilizaron para formar la respuesta. | O item de codificação mais crítico, indicando quais características da mancha (forma, cor, movimento, sombreamento, etc.) foram usadas para formar a resposta. |
    | **FQ** | 피험자가 지각한 반응의 형태가 잉크 반점의 실제 모양과 얼마나 잘 일치하는지의 질적 수준을 나타내는 채점 항목입니다. | Scoring item indicating the quality of fit between the form perceived by the subject and the actual shape of the inkblot. | 被検者が知覚した反応の形態が、インクブロットの実際の形状とどれだけよく一致しているかの質的水準を示すスコアリング項目です。 | Ítem de codificación que indica la calidad del ajuste entre la forma percibida por el sujeto y la forma real de la mancha de tinta. | Item de codificação que indica a qualidade do ajuste entre a forma percebida pelo sujeito e a forma real da mancha de tinta. |
    | **Pair** | 반응 내용에 두 개의 동일한 대상이 대칭적으로 지각되었을 때 채점하여 처리 효율성을 탐색하는 항목입니다. | Item scored when two identical objects are perceived symmetrically, used to explore processing efficiency. | 反応内容に2つの同一の対象が対称的に知覚された場合にスコアリングし、処理の効率性を探索する項目です。 | Ítem codificado cuando se perciben simétricamente dos objetos idénticos, utilizado para explorar la eficiencia del procesamiento. | Item codificado quando dois objetos idênticos são percebidos simetricamente, usado para explorar a eficiência do processamento. |
    | **Contents** | 피험자가 보고한 반응의 주제적 내용을 분류하는 채점 항목입니다. | Scoring item classifying the thematic content of the response reported by the subject. | 被検者が報告した反応の主題的内容を分類するスコアリング項目です。 | Ítem de codificación que clasifica el contenido temático de la respuesta reportada por el sujeto. | Item de codificação que classifica o conteúdo temático da resposta relatada pelo sujeito. |
    | **Popular** | 특정 반점에 대해 인구의 대다수가 흔히 지각하는 반응의 출현 여부를 나타내는 항목입니다. | Item indicating the presence of responses commonly perceived by the majority of the population for a specific blot. | 特定のブロットに対して、人口の大多数が一般的に知覚する反応の出現有無を示す項目です。 | Ítem que indica la presencia de respuestas comúnmente percibidas por la mayoría de la población para una mancha específica. | Item que indica a presença de respostas comumente percebidas pela maioria da população para uma mancha específica. |
    | **Z** | 피험자가 여러 개의 반점 영역을 통합하여 반응을 형성하는 인지적 노력의 정도를 나타내는 채점 항목입니다. | Scoring item indicating the degree of cognitive effort used to organize multiple blot areas into a response. | 複数のブロット領域を統合して反응を形成する際の認知的努力の程度を示すスコアリング項目です。 | Ítem de codificación que indica el grado de esfuerzo cognitivo utilizado para organizar múltiples áreas de la mancha en una respuesta. | Item de codificação que indica o grau de esforço cognitivo usado para organizar múltiplas áreas da mancha em uma resposta. |
    | **Special Score** | 비전형적이거나 병리적인 사고 과정을 나타내는 언어적, 개념적 이상 반응이 나타날 때 채점하는 항목입니다. | Item scored when verbal or conceptual deviations appear, indicating atypical or pathological thought processes. | 非定型的または病理的な思考過程を示す言語的、概念的な逸脱反応が現れた場合にスコアリングする項目です。 | Ítem codificado cuando aparecen desviaciones verbales o conceptuales que indican procesos de pensamiento atípicos o patológicos. | Item codificado quando aparecem desvios verbais ou conceituais, indicando processos de pensamento atípicos ou patológicos. |

- **Card (10개 항목)**

    ---

    | 항목 코드 | 한국어 (ko) | 영어 (en) | 일본어 (ja) | 스페인어 (es) | 포르투갈어 (pt) |
    | --- | --- | --- | --- | --- | --- |
    | I | 낯선 상황에 직면했을 때의 대처 방식과 자아상을 탐색하는 흑백 카드 | Achromatic card exploring self-image and coping styles in novel situations. | 慣れない状況に直面した際の対処様式と自己像を探索する黒白カード。 | Lámina acromática que explora la autoimagen y los estilos de afrontamiento ante situaciones nuevas. | Cartão acromático que explora a autoimagem e os estilos de enfrentamento em situações novas. |
    | II | 붉은 색채가 포함되어 공격성이나 분노 등 강렬한 정서적 자극에 대한 대처 양상을 시사 | Contains red color, suggesting coping patterns for intense emotional stimuli like aggression or anger. | 赤色が混在し、攻撃性や怒りなど強烈な情動刺激への対処様相を示唆。 | Contiene color rojo, sugiriendo patrones de afrontamiento ante estímulos emocionales intensos como agresión o ira. | Contém a cor vermelha, sugerindo padrões de enfrentamento para estímulos emocionais intensos como agressão ou raiva. |
    | III | 인간 움직임(M)이 가장 빈번하며 대인관계 지각 및 사회적 상호작용 방식을 시사 | Elicits Human Movement (M) most frequently, suggesting interpersonal perception and social interaction styles. | 人間運動反応(M)が最も頻繁で、対人知覚および社会的相互作用の様式を示唆。 | Suscita Movimiento Humano (M) con mayor frecuencia, sugiriendo percepción interpersonal y estilos de interacción social. | Elicita Movimento Humano (M) com maior frequência, sugerindo percepção interpessoal e estilos de interação social. |
    | IV | 육중하고 어두운 형태적 특성으로 인해 권위적 대상이나 초자아에 대한 태도를 반영 | Reflects attitudes toward authority figures or the superego due to its massive and dark formal qualities. | 重厚で暗い形態的特性により、権威的対象や超自我に対する態度を反映。 | Refleja actitudes hacia figuras de autoridad o el superyó debido a sus cualidades formales masivas y oscuras. | Reflete atitudes em relação a figuras de autoridade ou ao superego devido às suas qualidades formais maciças e escuras. |
    | V | 가장 평이하고 구조화된 흑백 카드로 현실 검증력의 기초가 되는 평범 반응(P)을 탐색 | The most structured achromatic card, used to explore Popular responses (P) underlying reality testing. | 最も平凡で構造化された黒白カードで、現実検討力の基礎となる平凡反応(P)を探索。 | La lámina acromática más estructurada, utilizada para explorar respuestas Populares (P) que subyacen a la prueba de realidad. | O cartão acromático mais estruturado, usado para explorar respostas Populares (P) subjacentes ao teste de realidade. |
    | VI | 상단과 하단의 질감 차이가 두드러져 친밀감 및 의존 욕구(질감 반응)를 탐색하기 용이 | Prominent texture differences facilitate exploration of intimacy and dependency needs (texture responses). | 上部と下部の質感の差が著しく、親密感および依存欲求（質感反応）の探索が容易。 | Las diferencias de textura prominentes facilitan la exploración de la intimidad y las necesidades de dependencia (respuestas de textura). | As diferenças de textura proeminentes facilitam a exploração da intimidade e das necessidades de dependência (respostas de textura). |
    | VII | 공간이 뚫린 형태적 특성으로 인해 여성성이나 모성적 대상과 관련된 투사를 자주 유발 | Often evokes projections related to femininity or maternal figures due to its open interior space. | 空間が空いた形態的特性により、女性性や母性的大象に関連する投影を頻繁に誘発。 | A menudo evoca proyecciones relacionadas con la feminidad o figuras maternas debido a su espacio interior abierto. | Frequentemente evoca projeções relacionadas à feminilidade ou figuras maternas devido ao seu espaço interior aberto. |
    | VIII | 최초의 전면 다채색 카드로 정서적 상황에서의 처리 능력 및 통합 능력을 탐색 | The first fully chromatic card, exploring processing and integration abilities in emotional situations. | 最初の全面有彩色のカードで、情動的状況における処理能力および統合能力を探索。 | La primera lámina totalmente cromática, explora las habilidades de procesamiento e integración en situaciones emocionales. | O primeiro cartão totalmente cromático, explorando habilidades de processamento e integração em situações emocionais. |
    | IX | 색채가 혼합되고 형태가 모호하여 복잡한 정서적 상황에서의 대처와 조직화 노력을 요함 | Blended colors and vague forms require coping and organizational effort in complex emotional situations. | 色彩が混合し形態が曖昧なため、複雑な情動的状況での対処と組織化の努力を要する。 | Colores mezclados y formas vagas requieren esfuerzo de afrontamiento y organización en situaciones emocionales complejas. | Cores misturadas e formas vagas exigem esforço de enfrentamento e organização em situações emocionais complexas. |
    | X | 여러 개의 분산된 세부 영역들로 구성되어 파편화된 자극을 통합하는 능력과 시각적 조절력을 확인 | Composed of scattered details, checking visual control and the ability to integrate fragmented stimuli. | 複数の分散した細部領域で構成され、断片化された刺激を統合する能力と視覚的コントロールを確認。 | Compuesto por detalles dispersos, verifica el control visual y la capacidad de integrar estímulos fragmentados. | Composto por detalhes dispersos, verifica o controle visual e a capacidade de integrar estímulos fragmentados. |

- **Location (7개 항목)**

    ---

    | 항목 코드 | 한국어 (ko) | 영어 (en) | 일본어 (ja) | 스페인어 (es) | 포르투갈어 (pt) |
    | --- | --- | --- | --- | --- | --- |
    | W | 잉크 반점의 전체(Whole)를 모두 사용하여 반응 | Response using the entire inkblot (Whole). | インクブロットの全体(Whole)をすべて使用して反応。 | Respuesta utilizando la mancha de tinta completa (Whole). | Resposta usando toda a mancha de tinta (Whole). |
    | WS | 전체(W) 영역을 주된 자극으로 사용하며 흰 공간(S)을 배경이나 대상으로 통합 | Uses the Whole (W) area as the main stimulus, integrating white Space (S) as background or object. | 全体(W)領域を主な刺激として使用し、白い空間(S)を背景や対象として統合。 | Utiliza el área Global (W) como estímulo principal, integrando el Espacio en blanco (S) como fondo u objeto. | Utiliza a área Global (W) como estímulo principal, integrando o Espaço em branco (S) como fundo ou objeto. |
    | D | 반점의 영역 중 빈번하게 식별되는 흔한 세부 영역(Common Detail)을 사용 | Uses a frequently identified Common Detail area of the blot. | ブロット領域のうち頻繁に識別される普通部分領域(Common Detail)を使用。 | Utiliza un área de Detalle Usual frecuentemente identificada de la mancha. | Utiliza uma área de Detalhe Comum frequentemente identificada da mancha. |
    | DS | 흔한 세부 영역(D)을 주된 자극으로 사용하며 흰 공간(S)을 배경이나 대상으로 통합 | Uses a Common Detail (D) as the main stimulus, integrating white Space (S). | 普通部分領域(D)を主な刺激として使用し、白い空間(S)を背景や対象として統合。 | Utiliza un Detalle Usual (D) como estímulo principal, integrando el Espacio en blanco (S). | Utiliza um Detalhe Comum (D) como estímulo principal, integrando o Espaço em branco (S). |
    | Dd | 반점의 영역 중 빈도가 낮고 드물게 식별되는 특이한 세부 영역(Unusual Detail)을 사용 | Uses an Unusual Detail area identified infrequently. | ブロット領域のうち頻度が低く稀に識別される特殊部分領域(Unusual Detail)を使用。 | Utiliza un área de Detalle Inusual identificada con poca frecuencia. | Utiliza uma área de Detalhe Incomum identificada com pouca frequência. |
    | DdS | 드문 세부 영역(Dd)을 주된 자극으로 사용하며 흰 공간(S)을 배경이나 대상으로 통합 | Uses an Unusual Detail (Dd) as the main stimulus, integrating white Space (S). | 特殊部分領域(Dd)を主な刺激として使用し、白い空間(S)を背景や対象として統合。 | Utiliza un Detalle Inusual (Dd) como estímulo principal, integrando el Espacio en blanco (S). | Utiliza um Detalhe Incomum (Dd) como estímulo principal, integrando o Espaço em branco (S). |
    | S | 잉크가 묻은 부분이 아닌 흰 배경 공간(Space)만을 단독으로 사용하여 반응 | Response using only the white background Space, not the inked area. | インクがついた部分ではなく、白い背景空間(Space)のみを単独で使用して反応。 | Respuesta utilizando solo el Espacio en blanco de fondo, no el área entintada. | Resposta usando apenas o Espaço em branco de fondo, não a área com tinta. |

- **DQ (4개 항목)**

    ---

    | 항목 코드 | 한국어 (ko) | 영어 (en) | 일본어 (ja) | 스페인어 (es) | 포르투갈어 (pt) |
    | --- | --- | --- | --- | --- | --- |
    | + | 두 개 이상의 대상을 의미 있게 통합하였으며 그 형태가 구체적이고 명확함 | Meaningful integration of two or more objects with specific and distinct forms. | 2つ以上の対象を有意味に統合し、その形態が具体的で明確。 | Integración significativa de dos o más objetos con formas específicas y distintas. | Integração significativa de dois ou mais objetos com formas específicas e distintas. |
    | o | 단일한 대상을 지각했거나 대상 간의 통합 없이 단순히 나열하였으며 형태가 명확함 | Perception of a single object or simple listing without integration; form is distinct. | 単一の対象を知覚したか、対象間の統合なく単に羅列しており、形態が明確。 | Percepción de un solo objeto o lista simple sin integración; la forma es clara. | Percepção de um único objeto ou lista simples sem integração; a forma é clara. |
    | v/+ | 두 개 이상의 대상을 통합하려 시도했으나 지각된 대상의 형태가 구체적이지 않고 모호함 | Attempt to integrate two or more objects, but perceived forms are vague and nonspecific. | 2つ以上の対象を統合しようと試みたが、知覚された対象の形態が具体的でなく曖昧。 | Intento de integrar dos o más objetos, pero las formas percibidas son vagas y no específicas. | Tentativa de integrar dois ou mais objetos, mas as formas percebidas são vagas e não específicas. |
    | v | 형태가 구체적이지 않고 모호한 대상(구름, 연기 등)을 지각했으며 통합하려는 노력도 없음 | Perception of vague, nonspecific objects (clouds, smoke) with no effort to integrate. | 形態が具体的でなく曖昧な対象（雲、煙など）を知覚し、統合しようとする努力もない。 | Percepción de objetos vagos y no específicos (nubes, humo) sin esfuerzo por integrar. | Percepção de objetos vagos e não específicos (nuvens, fumaça) sem esforço para integrar. |

- **Determinants (24개 항목)**

    ---

    | 항목 코드 | 한국어 (ko) | 영어 (en) | 일본어 (ja) | 스페인어 (es) | 포르투갈어 (pt) |
    | --- | --- | --- | --- | --- | --- |
    | F | 오직 형태(Form)만을 유일한 근거로 사용하여 반응 | Response based solely on Form. | 形態(Form)のみを唯一の根拠として使用して反応。 | Respuesta basada únicamente en la Forma. | Resposta baseada apenas na Forma. |
    | M | 인간(Human) 혹은 인간적 행위의 움직임이 지각된 반응 | Response perceiving human or human-like movement. | 人間(Human)あるいは人間的行為の運動が知覚された反応。 | Respuesta que percibe movimiento humano o similar al humano. | Resposta percebendo movimento humano ou semelhante ao humano. |
    | Ma | 인간 움직임(M) 중 움직임의 에너지가 능동적(Active)인 경우 | Human Movement (M) where the energy is Active. | 人間運動(M)のうち、運動のエネルギーが能動的(Active)な場合。 | Movimiento Humano (M) donde la energía es Activa. | Movimento Humano (M) onde a energia é Ativa. |
    | Ma-p | 인간 움직임(M) 내에 능동(a)과 수동(p)의 에너지가 공존하는 경우 | Human Movement (M) containing both active (a) and passive (p) energy. | 人間運動(M)内に能動(a)と受動(p)のエネルギーが共存する場合。 | Movimiento Humano (M) que contiene energía activa (a) y pasiva (p). | Movimento Humano (M) contendo energia ativa (a) e passiva (p). |
    | Mp | 인간 움직임(M) 중 움직임의 에너지가 수동적(Passive)인 경우 | Human Movement (M) where the energy is Passive. | 人間運動(M)のうち、運動のエネルギーが受動的(Passive)な場合。 | Movimiento Humano (M) donde la energía es Pasiva. | Movimento Humano (M) onde a energia é Passiva. |
    | FM | 동물(Animal)의 생태에 부합하는 움직임이 지각된 반응 | Response perceiving movement appropriate to animal species. | 動物(Animal)の生態に合致する運動が知覚された反応。 | Respuesta que percibe movimiento apropiado para la especie animal. | Resposta percebendo movimento apropriado para a espécie animal. |
    | FMa | 동물 움직임(FM) 중 움직임의 에너지가 능동적(Active)인 경우 | Animal Movement (FM) where the energy is Active. | 動物運動(FM)のうち、運動のエネルギーが能動的(Active)な場合。 | Movimiento Animal (FM) donde la energía es Activa. | Movimento Animal (FM) onde a energia é Ativa. |
    | FMp | 동물 움직임(FM) 중 움직임의 에너지가 수동적(Passive)인 경우 | Animal Movement (FM) where the energy is Passive. | 動物運動(FM)のうち、運動のエネルギーが受動的(Passive)な場合。 | Movimiento Animal (FM) donde la energía es Pasiva. | Movimento Animal (FM) onde a energia é Passiva. |
    | m | 무생물(Inanimate)이나 자연의 힘에 의한 움직임이 지각된 반응 | Response perceiving movement of inanimate objects or natural forces. | 無生物(Inanimate)や自然の力による運動が知覚された反応。 | Respuesta que percibe movimiento de objetos inanimados o fuerzas naturales. | Resposta percebendo movimento de objetos inanimados ou forças naturais. |
    | ma | 무생물 움직임(m) 중 움직임의 에너지가 능동적(Active)인 경우 | Inanimate Movement (m) where the energy is Active. | 無生物運動(m)のうち、運動のエネルギーが能動的(Active)な場合。 | Movimiento Inanimado (m) donde la energía es Activa. | Movimento Inanimado (m) onde a energia é Ativa. |
    | mp | 무생물 움직임(m) 중 움직임의 에너지가 수동적(Passive)인 경우 | Inanimate Movement (m) where the energy is Passive. | 無生物運動(m)のうち、運動のエネルギーが受動的(Passive)な場合。 | Movimiento Inanimado (m) donde la energía es Pasiva. | Movimento Inanimado (m) onde a energia é Passiva. |
    | FC | 형태가 주된 결정요인이며 색채(C)가 부수적으로 통합되어 사용됨 | Form is the primary determinant, with Color (C) integrated secondarily. | 形態が主な決定因であり、色彩(C)が付随的に統合され使用される。 | La Forma es el determinante principal, con el Color (C) integrado secundariamente. | A Forma é o determinante principal, com a Cor (C) integrada secundariamente. |
    | CF | 색채가 주된 결정요인이며 형태(F)는 모호하거나 부수적인 역할을 함 | Color is the primary determinant, with Form (F) being vague or secondary. | 色彩が主な決定因であり、形態(F)は曖昧か付随的な役割を果たす。 | El Color es el determinante principal, siendo la Forma (F) vaga o secundaria. | A Cor é o determinante principal, sendo a Forma (F) vaga ou secundária. |
    | C | 형태를 전혀 고려하지 않고 오직 순수 색채(Pure Color)만을 근거로 반응 | Response based solely on Pure Color, ignoring form. | 形態を全く考慮せず、ただ純粋色彩(Pure Color)のみを根拠に反応。 | Respuesta basada únicamente en Color Puro, ignorando la forma. | Resposta baseada apenas em Cor Pura, ignorando a forma. |
    | Cn | 대상을 지각하는 대신 색채의 이름(Color Naming)만을 나열하거나 보고 | Listing or reporting Color Naming instead of perceiving an object. | 対象を知覚する代わりに色彩の名前(Color Naming)のみを羅列または報告。 | Nombrar el Color (Color Naming) en lugar de percibir un objeto. | Nomeação de Cores (Color Naming) em vez de perceber um objeto. |
    | FC' | 형태가 주된 결정요인이며 무채색(C')이 부수적으로 통합되어 사용됨 | Form is primary, with Achromatic Color (C') integrated secondarily. | 形態が主な決定因であり、無彩色(C')が付随的に統合され使用される。 | La Forma es principal, con Color Acromático (C') integrado secundariamente. | A Forma é principal, com Cor Acromática (C') integrada secundariamente. |
    | C'F | 무채색(검정/회색)이 주된 결정요인이며 형태(F)는 모호하거나 부수적인 역할을 함 | Achromatic Color (black/gray) is primary; Form (F) is vague/secondary. | 無彩色（黒/灰色）が主な決定因であり、形態(F)は曖昧か付随的な役割を果たす。 | El Color Acromático es principal; la Forma (F) es vaga/secundaria. | A Cor Acromática é principal; a Forma (F) é vaga/secundária. |
    | C' | 형태를 전혀 고려하지 않고 오직 순수 무채색(Pure Achromatic Color)만을 근거로 반응 | Response based solely on Pure Achromatic Color, ignoring form. | 形態を全く考慮せず、ただ純粋無彩色(Pure Achromatic Color)のみを根拠に反応。 | Respuesta basada únicamente en Color Acromático Puro, ignorando la forma. | Resposta baseada apenas em Cor Acromática Pura, ignorando a forma. |
    | FT | 형태가 주된 결정요인이며 질감(Texture)이 부수적으로 통합되어 사용됨 | Form is primary, with Texture (T) integrated secondarily. | 形態が主な決定因であり、質感(Texture)が付随的に統合され使用される。 | La Forma es principal, con Textura (T) integrada secundariamente. | A Forma é principal, com Textura (T) integrada secundariamente. |
    | TF | 질감(T)이 주된 결정요인이며 형태(F)는 모호하거나 부수적인 역할을 함 | Texture (T) is primary; Form (F) is vague/secondary. | 質感(T)が主な決定因であり、形態(F)は曖昧か付随的な役割を果たす。 | La Textura (T) es principal; la Forma (F) es vaga/secundaria. | A Textura (T) é principal; a Forma (F) é vaga/secundária. |
    | T | 형태를 전혀 고려하지 않고 오직 순수 질감(Pure Texture)만을 근거로 반응 | Response based solely on Pure Texture, ignoring form. | 形態を全く考慮せず、ただ純粋質感(Pure Texture)のみを根拠に反応。 | Respuesta basada únicamente en Textura Pura, ignorando la forma. | Resposta baseada apenas em Textura Pura, ignorando a forma. |
    | FV | 형태가 주된 결정요인이며 명암에 의한 깊이감(Vista)이 부수적으로 통합되어 사용됨 | Form is primary, with Vista (shading depth) integrated secondarily. | 形態が主な決定因であり、濃淡による奥行き(Vista)が付随的に統合され使用される。 | La Forma es principal, con Vista (profundidad por sombreado) integrada secundariamente. | A Forma é principal, com Vista (profundidade por sombreamento) integrada secundariamente. |
    | VF | 깊이감(V)이 주된 결정요인이며 형태(F)는 모호하거나 부수적인 역할을 함 | Vista (V) is primary; Form (F) is vague/secondary. | 奥行き(V)が主な決定因であり、形態(F)は曖昧か付随的な役割を果たす。 | Vista (V) es principal; la Forma (F) es vaga/secundaria. | Vista (V) é principal; a Forma (F) é vaga/secundária. |
    | V | 형태를 전혀 고려하지 않고 오직 명암에 의한 깊이감(Pure Vista)만을 근거로 반응 | Response based solely on Pure Vista, ignoring form. | 形態を全く考慮せず、ただ濃淡による奥行き(Pure Vista)のみを根拠に反応。 | Respuesta basada únicamente en Vista Pura, ignorando la forma. | Resposta baseada apenas em Vista Pura, ignorando a forma. |
    | FY | 형태가 주된 결정요인이며 확산된 명암(Y)이 부수적으로 통합되어 사용됨 | Form is primary, with Diffuse Shading (Y) integrated secondarily. | 形態が主な決定因であり、拡散した濃淡(Y)が付随的に統合され使用される。 | La Forma es principal, con Sombreado Difuso (Y) integrado secundariamente. | A Forma é principal, com Sombreamento Difuso (Y) integrado secundariamente. |
    | YF | 확산된 명암(Y)이 주된 결정요인이며 형태(F)는 모호하거나 부수적인 역할을 함 | Diffuse Shading (Y) is primary; Form (F) is vague/secondary. | 拡散した濃淡(Y)が主な決定因であり、形態(F)は曖昧か付随的な役割を果たす。 | El Sombreado Difuso (Y) es principal; la Forma (F) es vaga/secundaria. | O Sombreamento Difuso (Y) é principal; a Forma (F) é vaga/secundária. |
    | Y | 형태를 전혀 고려하지 않고 오직 순수 확산 명암(Pure Diffuse Shading)만을 근거로 반응 | Response based solely on Pure Diffuse Shading, ignoring form. | 形態を全く考慮せず、ただ純粋拡散濃淡(Pure Diffuse Shading)のみを根拠に反応。 | Respuesta basada únicamente en Sombreado Difuso Puro, ignorando la forma. | Resposta baseada apenas em Sombreamento Difuso Puro, ignorando a forma. |
    | FD | 명암(Shading)의 도움 없이 형태나 크기 원근법을 통해 깊이감(Dimension)을 지각 | Perception of Dimension using form or size perspective without Shading. | 濃淡(Shading)の助けなしに、形態や大きさの遠近法を通じて次元(Dimension)を知覚。 | Percepción de Dimensión usando perspectiva de forma o tamaño sin Sombreado. | Percepção de Dimensão usando perspectiva de forma ou tamanho sem Sombreamento. |
    | Fr | 반영(Reflection)이 주된 결정요인이며 형태(F)는 부수적으로 사용됨 | Reflection is primary; Form (F) is secondary. | 反射(Reflection)が主な決定因であり、形態(F)は付随的に使用される。 | Reflejo es principal; la Forma (F) es secundaria. | Reflexo é principal; a Forma (F) é secundária. |
    | rF | 반영(Reflection)이 주된 결정요인이며 형태(F)는 모호하거나 부수적인 역할을 함 | Reflection is primary; Form (F) is vague or secondary. | 反射(Reflection)が主な決定因であり、形態(F)は曖昧か付随的な役割を果たす。 | Reflejo es principal; la Forma (F) es vaga o secundaria. | Reflexo é principal; a Forma (F) é vaga ou secundária. |

- **FQ (5개 항목)**

    ---

    | 항목 코드 | 한국어 (ko) | 영어 (en) | 일본어 (ja) | 스페인어 (es) | 포르투갈어 (pt) |
    | --- | --- | --- | --- | --- | --- |
    | + | 형태가 비범할 정도로 정교하고 구체적이며 과도하게 상세화된(Superior) 경우 | Form is extraordinarily elaborated, specific, and detailed (Superior). | 形態が非凡なほど精巧で具体的であり、過度に詳細化された(Superior)場合。 | La forma es extraordinariamente elaborada, específica y detallada (Superior). | A forma é extraordinariamente elaborada, específica e detalhada (Superior). |
    | o | 규준 집단에서 흔하게 보고되며 형태적으로 적절하고 평범한(Ordinary) 반응 | Form is appropriate and common in normative samples (Ordinary). | 基準集団で一般的に報告され、形態的に適切で平凡な(Ordinary)反応。 | La forma es apropiada y común en muestras normativas (Ordinaria). | A forma é apropriada e comum em amostras normativas (Ordinária). |
    | u | 형태적으로 적절하지만 규준 집단에서 드물게 보고되는 독특한(Unusual) 반응 | Form is appropriate but infrequently reported in norms (Unusual). | 形態的に適切だが、基準集団で稀に報告される独特な(Unusual)反応。 | La forma es apropiada pero reportada infrecuentemente en normas (Inusual). | A forma é apropriada mas raramente relatada em normas (Incomum). |
    | - | 반점의 형태적 특징과 거의 일치하지 않으며 현실을 심각하게 왜곡한(Distorted) 반응 | Distorted response that barely matches blot features and distorts reality. | ブロットの形態的特徴とほとんど一致せず、現実を深刻に歪曲した(Distorted)反応。 | Respuesta distorsionada que apenas coincide con las características de la mancha. | Resposta distorcida que mal corresponde às características da mancha. |
    | none | 형태가 전혀 포함되지 않은 반응(순수 C, 순수 T 등)에 적용 | Applied to responses containing no form (Pure C, Pure T, etc.). | 形態が全く含まれない反応（純粋C、純粋Tなど）に適用。 | Aplicado a respuestas que no contienen forma (Color Puro, Textura Pura, etc.). | Aplicado a respostas que não contêm forma (Cor Pura, Textura Pura, etc.). |

- **Pair (1개 항목)**

    ---

    | 항목 코드 | 한국어 (ko) | 영어 (en) | 일본어 (ja) | 스페인어 (es) | 포르투갈어 (pt) |
    | --- | --- | --- | --- | --- | --- |
    | (2) | 반응 내용에 두 개의 동일한 대상이 대칭적으로 나란히 지각되었음을 의미 | Indicates perception of two identical objects perceived symmetrically. | 反応内容に2つの同一の対象が対称的に並んで知覚されたことを意味。 | Indica la percepción de dos objetos idénticos percibidos simétricamente. | Indica a percepção de dois objetos idênticos percebidos simetricamente. |

- **Contents (27개 항목)**

    ---

    | 항목 코드 | 한국어 (ko) | 영어 (en) | 일본어 (ja) | 스페인어 (es) | 포르투갈어 (pt) |
    | --- | --- | --- | --- | --- | --- |
    | H | 현실에 존재하는 온전한 형태의 인간(Human) | Whole Human form existing in reality. | 現実に存在する完全な形態の人間(Human)。 | Forma Humana completa existente en la realidad. | Forma Humana completa existente na realidade. |
    | (H) | 유령, 거인, 요정, 악마 등 현실에 존재하지 않는 신화적/공상적 인간 형상 | Mythological/fictional human figures like ghosts, giants, fairies, demons. | 幽霊、巨人、妖精、悪魔など現実に存在しない神話的/空想的人間形象。 | Figuras humanas mitológicas/ficticias como fantasmas, gigantes, hadas, demonios. | Figuras humanas mitológicas/fictícias como fantasmas, gigantes, fadas, demônios. |
    | Hd | 인간의 팔, 다리, 얼굴 등 신체의 일부분 | Parts of the human body like arms, legs, face (Human Detail). | 人間の腕、脚、顔など身体の一部分(Human Detail)。 | Partes del cuerpo humano como brazos, piernas, cara (Detalle Humano). | Partes do corpo humano como braços, pernas, rosto (Detalhe Humano). |
    | (Hd) | 신화적/공상적 인간 형상의 신체 일부분(예: 천사의 날개, 악마의 뿔) | Parts of fictional/mythological human figures (e.g., angel wings). | 神話的/空想的人間形象の身体の一部分（例：天使の翼、悪魔の角）。 | Partes de figuras humanas ficticias/mitológicas (ej., alas de ángel). | Partes de figuras humanas fictícias/mitológicas (ex., asas de anjo). |
    | Hx | 구체적 형상 없이 인간의 정서나 감각적 경험(Human Experience) 자체를 투사 | Projection of Human Experience or emotion without specific form. | 具体的な形象なく人間の情動や感覚的経験(Human Experience)自体を投映。 | Proyección de Experiencia Humana o emoción sin forma específica. | Projeção de Experiência Humana ou emoção sem forma específica. |
    | A | 개, 고양이, 곤충 등 현실에 존재하는 온전한 형태의 동물 | Whole Animals existing in reality, like dogs, cats, insects. | 犬、猫、昆虫など現実に存在する完全な形態の動物。 | Animales completos existentes en la realidad, como perros, gatos, insectos. | Animais completos existentes na realidade, como cães, gatos, insetos. |
    | (A) | 유니콘, 용, 킹콩 등 현실에 존재하지 않는 신화적/공상적 동물 | Mythological/fictional animals like unicorns, dragons, King Kong. | ユニコーン、龍、キングコングなど現実に存在しない神話的/空想的動物。 | Animales mitológicos/ficticios como unicornios, dragones. | Animais mitológicos/fictícios como unicórnios, dragões. |
    | Ad | 동물의 머리, 다리 등 신체의 일부분 | Parts of animal bodies like heads, legs (Animal Detail). | 動物の頭、脚など身体の一部分(Animal Detail)。 | Partes de cuerpos de animales como cabezas, patas (Detalle Animal). | Partes de corpos de animais como cabeças, pernas (Detalhe Animal). |
    | (Ad) | 신화적/공상적 동물의 신체 일부분(예: 용의 머리, 천마의 날개) | Parts of fictional/mythological animals (e.g., dragon's head). | 神話的/空想的動物の身体の一部分（例：龍の頭、天馬の翼）。 | Partes de animales ficticios/mitológicos (ej., cabeza de dragón). | Partes de animais fictícios/mitológicos (ex., cabeça de dragão). |
    | An | 골격, 내장 기관, 해부도 등 신체 내부 구조(Anatomy) | Internal body structures like skeletons, organs, anatomy charts. | 骨格、内臓器官、解剖図など身体内部構造(Anatomy)。 | Estructuras internas del cuerpo como esqueletos, órganos (Anatomía). | Estruturas internas do corpo como esqueletos, órgãos (Anatomia). |
    | Art | 그림, 조각상, 보석, 장식품 등 예술적 혹은 장식적 대상(Art) | Artistic or decorative objects like paintings, statues, jewelry. | 絵画、彫刻、宝石、装飾品など芸術的あるいは装飾的対象(Art)。 | Objetos artísticos o decorativos como pinturas, estatuas, joyas (Arte). | Objetos artísticos ou decorativos como pinturas, estátuas, joias (Arte). |
    | Ay | 토템, 투구, 역사적 유물 등 인류학적(Anthropology) 맥락을 지닌 대상 | Objects with Anthropological context like totems, helmets, artifacts. | トーテム、兜、歴史的遺物など人類学的(Anthropology)文脈を持つ対象。 | Objetos con contexto Antropológico como tótems, cascos, artefactos. | Objetos com contexto Antropológico como totens, capacetes, artefatos. |
    | Bl | 피(Blood) 혹은 혈흔 | Blood or bloodstains. | 血(Blood)あるいは血痕。 | Sangre o manchas de sangre. | Sangue ou manchas de sangue. |
    | Bt | 꽃, 나무, 잎, 덤불 등 식물(Botany) 전반 | Plants in general like flowers, trees, leaves, bushes (Botany). | 花、木、葉、茂みなど植物(Botany)全般。 | Plantas en general como flores, árboles, hojas (Botánica). | Plantas em geral como flores, árvores, folhas (Botânica). |
    | Cg | 옷, 모자, 신발, 장신구 등 착용하는 의복(Clothing) | Clothing items worn like clothes, hats, shoes, accessories. | 服、帽子、靴、装飾品など着用する衣服(Clothing)。 | Prendas de vestir como ropa, sombreros, zapatos (Ropa). | Itens de vestuário como roupas, chapéus, sapatos (Roupas). |
    | Cl | 구름(Cloud)을 단독으로 지각한 경우 (안개나 비는 Na로 분류) | Clouds perceived alone (fog/rain are Na). | 雲(Cloud)を単独で知覚した場合（霧や雨はNaに分類）。 | Nubes percibidas solas (niebla/lluvia son Na). | Nuvens percebidas sozinhas (neblina/chuva são Na). |
    | Ex | 폭발(Explosion) 장면이나 폭죽 등 | Explosion scenes or fireworks. | 爆発(Explosion)場面や花火など。 | Escenas de Explosión o fuegos artificiales. | Cenas de Explosão ou fogos de artifício. |
    | Fd | 사람이 먹을 수 있는 음식(Food)이나 식재료 (살아있는 동물은 A) | Edible Food for humans (living animals are A). | 人間が食べられる食べ物(Food)や食材（生きている動物はA）。 | Comida comestible para humanos (animales vivos son A). | Comida comestível para humanos (animais vivos são A). |
    | Fi | 불(Fire), 불꽃, 혹은 연기 | Fire, flames, or smoke. | 火(Fire)、炎、あるいは煙。 | Fuego, llamas o humo. | Fogo, chamas ou fumaça. |
    | Ge | 지도, 섬, 강, 호수 등 지리학적(Geography) 형상 | Geographical forms like maps, islands, rivers, lakes. | 地図、島、川、湖など地理学的(Geography)形象。 | Formas Geográficas como mapas, islas, ríos. | Formas Geográficas como mapas, ilhas, rios. |
    | Hh | 가구, 식기, 침구 등 가정용품(Household) | Household items like furniture, dishes, bedding. | 家具、食器、寝具など家庭用品(Household)。 | Artículos del Hogar como muebles, platos. | Itens Domésticos como móveis, pratos. |
    | Id | 위의 범주에 포함되지 않는 독특하고 개별적인(Idiosyncratic) 내용 | Idiosyncratic content not fitting other categories. | 上記の範疇に含まれない独特で個別的な(Idiosyncratic)内容。 | Contenido Idiosincrásico no incluido en otras categorías. | Conteúdo Idiossincrático não incluído em outras categorias. |
    | Ls | 산, 바다, 도시 전경 등 풍경(Landscape) | Landscapes like mountains, seas, cityscapes. | 山、海、都市全景など風景(Landscape)。 | Paisajes como montañas, mares, paisajes urbanos. | Paisagens como montanhas, mares, paisagens urbanas. |
    | Na | 태양, 비, 안개, 무지개 등 식물을 제외한 자연 현상(Nature) | Nature phenomena excluding plants (sun, rain, fog, rainbows). | 太陽、雨、霧、虹など植物を除いた自然現象(Nature)。 | Fenómenos de la Naturaleza excluyendo plantas (sol, lluvia). | Fenômenos da Natureza excluindo plantas (sol, chuva). |
    | Sc | 현미경, 비행기, 모터, 무기 등 과학/공학적 산물(Science) | Scientific/engineering products like microscopes, planes, motors. | 顕微鏡、飛行機、モーター、武器など科学/工学的産物(Science)。 | Productos de Ciencia/ingeniería como microscopios, aviones. | Produtos de Ciência/engenharia como microscópios, aviões. |
    | Sx | 성 기관, 성행위, 속옷 등 성(Sex)과 관련된 내용 | Sex-related content like organs, intercourse, lingerie. | 性器官、性行為、下着など性(Sex)と関連した内容。 | Contenido Sexual como órganos, actos, lencería. | Conteúdo Sexual como órgãos, atos, lingerie. |
    | Xy | 엑스레이, MRI, 골격 사진(X-ray) 등 | X-ray, MRI, skeletal images. | レントゲン、MRI、骨格写真(X-ray)など。 | Rayos X, resonancias magnéticas, imágenes esqueléticas. | Raio X, ressonância magnética, imagens esqueléticas. |

- **Popular (1개 항목)**

    ---

    | 항목 코드 | 한국어 (ko) | 영어 (en) | 일본어 (ja) | 스페인어 (es) | 포르투갈어 (pt) |
    | --- | --- | --- | --- | --- | --- |
    | P | 해당 반점 영역에서 규준 집단의 1/3 이상이 보고하는 문화적으로 매우 흔한 평범 반응 | Popular response reported by 1/3+ of the normative group for that blot area. | 当該ブロット領域で基準集団の1/3以上が報告する文化的に非常にありふれた平凡反応。 | Respuesta Popular reportada por 1/3+ del grupo normativo en esa área. | Resposta Popular relatada por 1/3+ do grupo normativo naquela área. |

- **Z (4개 항목)**

    ---

    | 항목 코드 | 한국어 (ko) | 영어 (en) | 일본어 (ja) | 스페인어 (es) | 포르투갈어 (pt) |
    | --- | --- | --- | --- | --- | --- |
    | ZW | 반점 전체(W)를 사용하면서 발달질이 양호(+, o, v/+)하여 조직화 점수가 부여되는 경우 | Z score given for Whole (W) usage with good developmental quality (+, o, v/+). | ブロット全体(W)を使用しながら発達質が良好(+, o, v/+)で組織化スコアが付与される場合。 | Puntuación Z por uso Global (W) con buena calidad evolutiva (+, o, v/+). | Pontuação Z para uso Global (W) com boa qualidade evolutiva (+, o, v/+). |
    | ZA | 서로 인접한(Adjacent) 두 개 이상의 영역을 의미 있게 통합하여 반응을 형성 | Meaningful integration of two or more Adjacent areas. | 互いに隣接(Adjacent)した2つ以上の領域を有意味に統合して反応を形成。 | Integración significativa de dos o más áreas Adyacentes. | Integração significativa de duas ou mais áreas Adjacentes. |
    | ZD | 서로 인접하지 않고 떨어져 있는(Distant) 두 개 이상의 영역을 의미 있게 통합 | Meaningful integration of two or more Distant (non-adjacent) areas. | 互いに隣接せず離れている(Distant)2つ以上の領域を有意味に統合。 | Integración significativa de dos o más áreas Distantes (no adyacentes). | Integração significativa de duas ou mais áreas Distantes (não adjacentes). |
    | ZS | 흰 공간(S)을 다른 영역과 의미 있게 통합(Space)하여 반응을 형성 | Meaningful integration of white Space (S) with other areas. | 白い空間(S)を他の領域と有意味に統合(Space)して反応を形成。 | Integración significativa del Espacio en blanco (S) con otras áreas. | Integração significativa do Espaço em branco (S) com outras áreas. |

- **Special Score (27개 항목)**

    ---

    | 항목 코드 | 한국어 (ko) | 영어 (en) | 일본어 (ja) | 스페인어 (es) | 포르투갈어 (pt) |
    | --- | --- | --- | --- | --- | --- |
    | DV1 | 부적절하거나 독특한 단어를 사용했으나 의미 전달은 가능한 경미한 언어 일탈 | Mild verbal slippage using inappropriate words but meaning is clear (Deviant Verbalization). | 不適切または独特な単語を使用したが意味伝達は可能な軽微な言語逸脱。 | Desliz verbal leve usando palabras inapropiadas, pero el significado es claro. | Deslize verbal leve usando palavras inadequadas, mas o significado é claro. |
    | DV2 | 의미를 알 수 없는 신조어를 쓰거나 심각하게 부적절한 단어를 사용한 심각한 언어 일탈 | Severe verbal slippage using neologisms or grossly inappropriate words. | 意味不明な造語を使ったり深刻に不適切な単語を使用した深刻な言語逸脱。 | Desliz verbal severo usando neologismos o palabras gravemente inapropiadas. | Deslize verbal severo usando neologismos ou palavras grosseiramente inadequadas. |
    | INCOM1 | 하나의 대상 내에 불가능한 속성을 결합(예: 빨간 곰)했으나 정도가 경미한 경우 | Mild combination of impossible features in one object (e.g., red bear) (Incongruous Combination). | 一つの対象内に不可能な属性を結合（例：赤い熊）したが程度が軽微な場合。 | Combinación leve de características imposibles en un objeto (ej., oso rojo). | Combinação leve de características impossíveis em um objeto (ex., urso vermelho). |
    | INCOM2 | 하나의 대상 내에 기괴하고 불가능한 속성을 결합(예: 날개 달린 남자)한 심각한 경우 | Severe/bizarre combination of impossible features (e.g., winged man). | 一つの対象内に奇怪で不可能な属性を結合（例：翼のある男）した深刻な場合。 | Combinación severa/bizarra de características imposibles (ej., hombre alado). | Combinação severa/bizarra de características impossíveis (ex., homem alado). |
    | DR1 | 질문과 무관한 이야기를 하거나 주제에서 경미하게 벗어난 일탈적 반응 | Deviant Response wandering slightly off-topic or irrelevant details. | 質問と無関係な話をしたり主題から軽微に外れた逸脱反応。 | Respuesta Desviada que se aparta ligeramente del tema o detalles irrelevantes. | Resposta Desviada que foge ligeiramente do tópico ou detalhes irrelevantes. |
    | DR2 | 완전히 엉뚱한 대답을 하거나 사고의 흐름이 기괴하게 단절된 심각한 일탈적 반응 | Severe deviation with totally irrelevant answers or bizarre disjointed thought. | 完全に的外れな回答をしたり思考の流れが奇怪に断絶された深刻な逸脱反応。 | Desviación severa con respuestas totalmente irrelevantes o pensamiento bizarro. | Desvio severo com respostas totalmente irrelevantes ou pensamento bizarro. |
    | FABCOM1 | 두 대상 간의 관계가 비현실적이지만(예: 토끼가 춤을 춤) 정도가 경미한 결합 | Implausible relationship between objects (e.g., dancing rabbits), but mild (Fabulized Combination). | 2つの対象間の関係が非現実的だが（例：ウサギが踊る）程度が軽微な結合。 | Relación inverosímil entre objetos (ej., conejos bailando), pero leve. | Relação implausível entre objetos (ex., coelhos dançando), mas leve. |
    | FABCOM2 | 두 대상 간의 관계가 기괴하고 불가능한(예: 두 사람이 심장을 공유함) 심각한 결합 | Bizarre and impossible relationship between objects (e.g., two people sharing a heart). | 2つの対象間の関係が奇怪で不可能な（例：二人が心臓を共有する）深刻な結合。 | Relación bizarra e imposible entre objetos (ej., dos personas comparten un corazón). | Relação bizarra e impossível entre objetos (ex., duas pessoas compartilham um coração). |
    | ALOG | 반응의 이유를 설명할 때 인과관계가 맞지 않거나 억지스러운 논리(Illogical)를 사용 | Uses forced or causal logic that doesn't make sense to explain a response (Alogic). | 反応の理由を説明する際、因果関係が合わないか、こじつけの論理(Illogical)を使用。 | Usa lógica forzada o causal que no tiene sentido para explicar una respuesta. | Usa lógica forçada ou causal que não faz sentido para explicar uma resposta. |
    | CONTAM | 두 가지 지각이 융합되어 현실에 없는 기괴한 단일 대상을 형성(Contamination) | Two perceptions fuse to form a single bizarre object not found in reality (Contamination). | 2つの知覚が融合して現実にない奇怪な単一対象を形成(Contamination)。 | Dos percepciones se fusionan para formar un objeto bizarro que no existe en la realidad. | Duas percepções se fundem para formar um objeto bizarro que não existe na realidade. |
    | AB | 반점의 형태를 인간의 감정이나 추상적 개념(예: 우울함, 분노)으로 상징화(Abstraction) | Symbolizing blot form as human emotion or abstract concept (e.g., depression) (Abstraction). | ブロットの形態を人間の感情や抽象的概念（例：憂鬱、怒り）に象徴化(Abstraction)。 | Simbolizar la forma de la mancha como emoción humana o concepto abstracto. | Simbolizar a forma da mancha como emoção humana ou conceito abstrato. |
    | AG | 싸움, 파괴, 위협 등 현재 수행 중인 명백한 공격적 움직임(Aggression)이 묘사됨 | Description of clear Aggressive movement like fighting, destroying, threatening. | 戦い、破壊、脅威など現在遂行中の明白な攻撃的動き(Aggression)が描写される。 | Descripción de movimiento Agresivo claro como pelear, destruir. | Descrição de movimento Agressivo claro como lutar, destruir. |
    | COP | 두 대상이 긍정적이고 협력적인 상호작용(Cooperation)을 하고 있음이 명백히 묘사됨 | Clear description of positive, Cooperative interaction between two objects. | 2つの対象が肯定的で協力的な相互作用(Cooperation)をしていることが明白に描写される。 | Descripción clara de interacción positiva y Cooperativa entre dos objetos. | Descrição clara de interação positiva e Cooperativa entre dois objetos. |
    | CP | 무채색(흑백) 반점에서 존재하지 않는 유채색을 투사(Color Projection)하여 지각 | Perceiving chromatic color projected onto an achromatic blot (Color Projection). | 無彩色（黒白）ブロットに存在しない有彩色を投映(Color Projection)して知覚。 | Percibir color cromático proyectado en una mancha acromática. | Perceber cor cromática projetada em uma mancha acromática. |
    | GHR | 적응적이고 현실적인 대인관계 지각을 나타내는 인간 표상(Good Human Representation) | Human representation indicating adaptive, realistic interpersonal perception. | 適応的で現実的な対人関係知覚を表す人間表象(Good Human Representation)。 | Representación humana que indica percepción interpersonal adaptativa. | Representação humana indicando percepção interpessoal adaptativa. |
    | MOR | 대상이 죽었거나 파괴되었거나 손상된 특징 혹은 우울/불쾌한 감정(Morbid)이 포함됨 | Object is dead, destroyed, damaged, or includes dysphoric feeling (Morbid). | 対象が死んだり、破壊されたり、損傷した特徴、あるいは憂鬱/不快な感情(Morbid)が含まれる。 | El objeto está muerto, destruido, dañado o incluye sentimiento disfórico. | O objeto está morto, destruído, danificado ou inclui sentimento disfórico. |
    | PER | 반응을 정당화하기 위해 개인적인 경험이나 지식을 구체적으로 언급(Personalization) | Citing personal experience/knowledge to justify a response (Personalization). | 反応を正当化するために個人的な経験や知識を具体的に言及(Personalization)。 | Citar experiencia/conocimiento personal para justificar una respuesta. | Citar experiência/conhecimento pessoal para justificar uma resposta. |
    | PHR | 왜곡되거나 손상된 대인관계 지각을 나타내는 인간 표상(Poor Human Representation) | Human representation indicating distorted or damaged interpersonal perception. | 歪曲されたり損傷した対人関係知覚を表す人間表象(Poor Human Representation)。 | Representación humana que indica percepción interpersonal distorsionada. | Representação humana indicando percepção interpessoal distorcida. |
    | PSV | 이전의 반응 내용을 부적절하게 반복하거나 같은 위치/단어를 기계적으로 반복(Perseveration) | Inappropriate repetition of previous content or mechanical repetition (Perseveration). | 以前の反応内容を不適切に繰り返したり、同じ位置/単語を機械的に反復(Perseveration)。 | Repetición inapropiada de contenido previo o repetición mecánica. | Repetição inadequada de conteúdo anterior ou repetição mecânica. |


> **Title 속성**
>
- **언어 선택 버튼**: 지구본 아이콘 버튼과 각 언어 버튼의 `title` 속성
- **CSV 내보내기 버튼**: "Raw Data", "Summary" 버튼의 `title` 속성
- **슬롯 제어 버튼**: 채점 영역의 "+", "-" 버튼의 `title` 속성

| 번역 키 | 한국어 (ko) | 영어 (en) | 일본어 (ja) | 스페인어 (es) | 포르투갈어 (pt) |
| --- | --- | --- | --- | --- | --- |
| `title_select_language` | 언어 선택 | Select Language | 言語を選択 | Seleccionar Idioma | Selecionar Idioma |
- `title_lang_ko`, `title_lang_en`, `title_lang_ja`, `title_lang_es`, `title_lang_pt`: 각 언어 버튼의 title
- `title_export_rawdata`: CSV 내보내기(Raw Data) 버튼의 title
- `title_export_summary`: CSV 내보내기(Summary) 버튼의 title
- `title_add_slot`: 슬롯 추가 버튼의 title
- `title_delete_slot`: 슬롯 삭제 버튼의 title

### *더보기 탭 스타일 개선*

더보기 탭의 긴 텍스트가 표를 넘어가는 문제를 해결하기 위해 다음과 같이 수정되었습니다

- **줄바꿈 제거**: `word-wrap`, `word-break`, `overflow-wrap` 속성 제거, `white-space: nowrap` 적용
- **헤더 넓이 조정**: `table-layout: fixed` 제거, 테이블에 `min-width: 800px` 설정
- **횡스크롤 활성화**: `.table-wrapper:has(#list-table-body)`에 `overflow-x: auto` 추가
- **설명 셀**: `white-space: normal`로 유지하여 긴 설명은 줄바꿈 가능

### *코드 품질 개선*

불필요한 인라인 주석을 제거하고, 목차 및 주석의 정합성을 개선하였습니다.

- 인라인 주석 정리
- 목차 및 주석 정합성

---

# 향후 로드맵

다음 번 메이저 패치에서 배너 광고 삽입을 고려 중에 있습니다.

## Source files

- `source/Code.gs`
- `source/index.html`
- `source/styles.html`

## How to use

이 버전의 코드를 재현하려면 `source/` 안의 파일을 Google Apps Script 프로젝트에 같은 파일명으로 만든 뒤 그대로 붙여넣습니다.
GAS 프로젝트에서 웹앱으로 배포하면 해당 버전의 계산기를 직접 실행할 수 있습니다.
