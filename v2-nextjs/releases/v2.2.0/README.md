# [2026-07-16] v2.2.0 마이너 릴리즈

## 요약

v2.2.0은 계산기를 중심에 둔 채 웹앱의 데스크톱 UI/UX를 하나의 AI SaaS형 작업공간으로 재구성하고, 구조요약 계산 로직·GPT-5.5 도우미·개인정보 최소수집 피드백 경계를 함께 재검증한 v2.2.x 첫 릴리즈입니다.

이번 릴리즈에서는 UI만 바꾼 것이 아닙니다. 저자 보유 2019 Excel 프로토타입, v1 GAS 계보, 현재 TypeScript 구현, 점수열과 구조요약 결과가 함께 공개된 외부 사례를 교차대조해 계산 로직의 일곱 경계 결함을 수정했습니다. 또한 Exner Comprehensive System 밖의 질문과 prompt injection을 차단하고, 한국어·일본어·영어 시나리오에서 코딩 도우미와 해석 도우미의 실제 GPT-5.5 production-parity 경로를 다시 평가했습니다.

## 핵심 요약

### 앱 shell과 공통 UI

- 기존 header와 footer를 고정 데스크톱 rail, overlay sidebar, 모바일 drawer를 사용하는 하나의 `AppShell`로 교체했습니다.
- 사이드바는 본문을 밀지 않고, 열린 상태에서 다른 페이지로 이동해도 유지되며, 언어·테마·AI 세션 제어를 한곳에 모읍니다.
- 로그인 전에는 AI 세션 시작, 로그인 후에는 AI 세션 종료만 표시하고, 종료 전에 확인 dialog를 거칩니다.
- 기존 계산기 단축키와 사이드바 단축키, 채점 화면 확대·축소·이동 조작을 모은 다국어 키보드 단축키 dialog를 추가했습니다.
- 계산기, 해석 도우미, 참조 문서, 서비스 소개, 이용약관, 개인정보처리방침, 버전 아카이브에 같은 page background와 보정된 light/dark theme를 적용했습니다.
- 서비스·약관·개인정보 페이지의 불필요한 외곽 card와 페이지 전체 복사 버튼을 제거했습니다.

### BYOK와 해석 도우미

- OpenAI API key와 `OpenAI GPT-5.5` 표시를 같은 줄에 배치하고, 제목 중복과 자동 모델 선택 안내를 제거해 세션 dialog를 간결하게 정리했습니다.
- API key 비저장·24시간 HttpOnly cookie·세션 종료 시 삭제 안내를 중앙 정렬하고, 검증 오류가 dialog 높이를 흔들지 않도록 action row에 고정했습니다.
- 해석 도우미를 card 없는 전체 작업공간으로 바꾸고, 긴 대화가 페이지 전체를 늘리지 않도록 내부 message scroller를 사용합니다.
- AI 응답을 따라가는 자동 scroll은 사용자가 위로 이동하면 해제되며, 다시 최신 응답으로 이동할 수 있습니다.
- 응답 중지, message 복사, 사용자 prompt 탐색 rail, glass prompt composer, 구조요약 붙여넣기 상태를 추가했습니다.
- 사용자와 AI message에 copy action을 제공하고, AI message에는 좋아요·싫어요와 사전 정의 이유 선택 dialog를 추가했습니다.
- 질문·답변 원문이나 자유 서술은 피드백 DB에 저장하지 않습니다. 평가는 reason code와 workflow, locale, model, completion, length bucket 같은 최소 메타데이터만 별도 PostgreSQL DB에 180일 보관합니다.

### 채점 화면

- row handle이 표 경계에 걸친 채 잘리지 않도록 overflow와 layering을 수정했습니다.
- plain click, `Shift + Click`, `Ctrl/Command + Click` 다중 선택과 drag preview를 안정화했습니다.
- filled, empty, disabled dropdown이 같은 크기와 정렬을 유지하면서 상태별 대비만 달라지도록 보정했습니다.
- 기본 desktop viewport에서는 표가 화면에 맞고, 좁은 화면에서는 채점 영역 내부만 가로 scroll하도록 열 너비와 canvas 경계를 조정했습니다.
- `Alt + 마우스 스크롤`은 pointer 위치를 기준으로 채점 화면을 40~125% 범위에서 부드럽게 확대·축소하고, `Ctrl + 드래그`는 확대된 채점 화면을 이동합니다. 최소 축소 시 보이는 상·하 배경 여유는 최대 확대 시에도 동일하게 보존됩니다.
- 행 순서 안내는 표 아래의 header 색 footer cap에 표시합니다.
- 하단 action은 왼쪽의 추가·삭제·안내와 중앙의 결과 계산하기·입력값 초기화하기로 정리했습니다.

### 참조 문서와 버전 아카이브

- 참조 검색 form이 검색 결과와 상세 문서에서 모두 유지되고, 검색어도 상세 route로 이어집니다.
- 빈 검색 결과, taxonomy control, 문서 복사와 toast를 다섯 언어로 정리했습니다.
- 참조 문서 본문을 외곽 card 없는 읽기 화면으로 바꾸고 검색·taxonomy·본문 중심선을 맞췄습니다.
- 버전 2와 GAS 버전 1 기록을 배경을 공유하는 Notion-style disclosure로 정리하고, 펼침·접힘 때 scrollbar 유무로 화면이 흔들리지 않게 했습니다.
- GAS 실행 안내는 제목 옆의 keyboard-focusable 정보 tooltip으로 옮겼습니다.

## 계산 로직 독립 감사

기존 계산 체계 전체가 무너져 있던 것은 아닙니다. 주요 집계와 비율은 독립 사례에서 대체로 일치했습니다. 다만 “결함이 전혀 없었다”는 결론도 사실이 아니었고, 다음 일곱 경계 결함을 확인해 수정했습니다.

| 항목 | 수정 내용 |
| --- | --- |
| EBPer | `EA >= 4`, M과 WSumC 양수, 비율 `>= 2.5`일 때만 표시 |
| 능동·수동 운동 | `Ma-p`, `FMa-p`, `ma-p`를 능동과 수동 양쪽에 각각 합산 |
| `3r+(2)/R` | 반사반응 `Fr+rF` 가중치를 2에서 표준식의 3으로 수정 |
| HVI | Zd 보조조건의 경계를 `> 3.0`에서 `> 3.5`로 수정 |
| ZEst | 마지막 유효 경계 `Zf=50`이 `173`을 반환하도록 수정 |
| D/AdjD | 음의 구간에서 JavaScript `-0`이 표시되지 않도록 정규화 |
| Lambda | 모든 반응이 순수 F일 때 0이 아니라 `∞`로 처리 |

계산 oracle은 다음 네 갈래를 사용했습니다.

- [Essentials of Rorschach Assessment의 sample computerized score reports](https://elmirmohammedmemorypsy.com/wp-content/uploads/2021/04/essentials-of-rorschach-assessment.pdf)
- [Engelman et al., “Why am I so stuck?”](https://www.therapeuticassessment.com/docs/Engelman_et_al_2016_copy.pdf)
- [Tibon Czopp et al. amnestic syndrome 사례](https://pubmed.ncbi.nlm.nih.gov/23985019/)와 [정오표](https://www.tandfonline.com/doi/pdf/10.1080/13554794.2014.910345)
- 저자 보유 2019 Excel 프로토타입의 실제 수식. 원본 파일과 사적 원자료는 공개하지 않습니다.

출판 표와 공개 점수열이 충돌한 두 항목은 앱을 표 한 칸에 억지로 맞추지 않고 차이를 감사 문서와 회귀 테스트 주석에 남겼습니다. 자세한 수식, TypeScript 대응 코드, 대표 기대값과 한계는 [v2.2.0 구조요약 계산 로직 독립 감사](../../source/docs/ops/2026-07-15-v2.2.0-calculation-audit.md)에 기록했습니다.

국가별 집단 평균은 동일 점수열의 계산 정답지가 아닙니다. 문화권 차이는 계산 산식이 아니라 부호화·규준·해석 적용에 주로 영향을 주므로, 한국·일본·영어권 자료는 GPT-5.5 문화·연령 시나리오 평가에 별도로 사용했습니다.

## AI 경계와 실전 평가

- R-PAS 일반 해석, MMPI 일반 해석, 무관한 질문, prompt injection, 시스템 prompt·secret 탈취 요청을 Exner(CS) 도우미 경계 밖으로 분류합니다.
- 유효한 Exner 비교·감별 질문은 다른 체계의 일반 해석으로 확장하지 않고 경계를 설명하는 범위에서만 허용합니다.
- S-CON 양성·음성 해석 적용 연령을 만 15세 이상으로 계산 화면, 다섯 언어 코퍼스, 고정 harness에 일치시켰습니다.
- 명시적 Popular(`P`) 질문이 canonical Popular 문서를 먼저 검색하도록 hybrid retrieval을 보강했습니다.
- 한국어·일본어·영어 각 3개, 총 9개 문화·연령 시나리오를 코딩 도우미와 해석 도우미에서 각각 평가했습니다.

상세 증거:

- [Exner domain boundary report](../../source/docs/ai-evals/2026-07-15-v2.2.0-exner-domain-boundary-report.md)
- [Cultural validity and retrieval report](../../source/docs/ai-evals/2026-07-15-v2.2.0-cultural-validity-report.md)
- [Chat streaming and continuity validation](../../source/docs/ai-evals/2026-07-13-v2.2.0-chat-ux-streaming-validation.md)
- [Workspace shell and UI validation](../../source/docs/ops/2026-07-14-v2.2.0-workspace-shell-validation.md)

## 독립 검토와 구현 역할

이번 AI/RAG 보강은 한 모델의 제안을 그대로 채택하는 방식으로 진행하지 않았습니다.

- **Claude Fable 5**: 기존 RAG·코퍼스·검색 구조에 대한 독립 검토, 반론 제기, 정정 감사
- **GPT-5.6 Sol / Codex**: 실제 저장소와 DB 상태에서 후보를 재현하고, 코드 수정·계산 교차감사·회귀 테스트·GPT-5.5 live eval을 수행

검토 중 제기된 주장 가운데 실제 코드·timestamp·token 수·검색 결과와 맞지 않는 부분은 반증하고 제외했으며, 재현된 결함만 구현에 반영했습니다. 이 역할 표기는 개발 과정의 감사자와 구현자를 구분하기 위한 기록이며, Anthropic 또는 OpenAI의 임상적 인증이나 성능 보증을 뜻하지 않습니다.

## 검증

- unit/integration: `63` files, `319` passed, `6` intentionally skipped
- 계산·CSV 집중 검증: `5` files, `18` passed
- 독립 계산 oracle `4`개, D-table `81`개 반단위 경계, `Zf=50`, all-pure-F, negative-zero, row-order invariance 통과
- production build: `222/222` static page 생성
- i18n audit: `5` locale files, `12` UI copy files 통과
- AI contract: `91/91` 통과
- AI release gate: `7/7` 단계 통과
- GPT-5.5 문화·연령 production-parity final: `18/18`, issue `0`, incomplete `0`
- domain boundary final: single-turn `10/10`, multi-turn `4/4`, valid-route `2/2`
- OpenAI vector runtime: `6,632/6,632`, stale `0`, five locales ready
- 일회용 PostgreSQL에서 feedback migration `2/2`, aggregate-only schema, 180일 retention, RAG DB 분리 통과
- dependency audit: 알려진 취약점 `0`
- saved eval artifact: API key 형태 secret, raw prompt, raw model answer field 없음

주요 검증 명령:

```bash
npm run i18n:audit
npx tsc --noEmit
npm run lint
npm test
npm run build
npm run docs:verify-release
npm run ai:release-gate
npm run feedback:db:verify-fresh-replay
npm run security:check
git diff --check
```

## 공개 범위와 보안 경계

공개 source snapshot에는 앱 shell, UI 변경, 계산 수정, 테스트, 다섯 언어 사용자 문구, 공개 참조 코퍼스, 집계형 eval 증거와 기술 보고서를 포함합니다.

API key, `.env*`, Vercel local state, Neon connection string, raw prompt, raw model answer, chat message, response memo, Structural Summary private payload, patient data, 비공개 원문 provenance, 저자 보유 Excel 원본, 운영 DB 정보, runtime log와 cache는 공개하지 않습니다.

GPT-5.5 고정 모델, BYOK, API key 비저장, chat 비저장, HITL, 전문가의 임상 판단 비대체 원칙은 유지합니다. 계산과 AI 도우미의 자동 검증 통과는 임상적 타당성 인증이나 모든 미래 응답에 대한 보증을 뜻하지 않습니다.

## 남아 있는 한계

- 이번 계산 감사가 모든 가능한 반응 조합을 수학적으로 증명한 것은 아닙니다.
- 계산기는 연령을 직접 입력받지 않으므로 만 14세 이하 S-CON 해석 보류는 사용자가 확인해야 합니다.
- GPT-5.5 평가는 개발 과정에서 조정한 시나리오이며 blind held-out 임상 benchmark가 아닙니다.
- 실제 임상 유용성, 다국어 문장 품질, 안전성은 전문가의 사람 검토가 계속 필요합니다.
- v2.2.0은 desktop 중심의 첫 v2.2.x UX 릴리즈입니다. 모바일 전용 동선과 세부 최적화는 후속 v2.2.x에서 계속합니다.
