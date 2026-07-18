# Acknowledgements

## RorScore

심리학 지식을 바탕으로 처음 프로그래밍을 익혀가던 초기 개발 과정에서,
RorScore는 로샤 구조요약 계산 로직을 코드로 표현할 수 있다는 것을 보여준
첫 교과서 같은 프로젝트였습니다.

처음부터 이 감사의 마음을 기록하고 싶었지만, 당시에는 프로그래밍을 배우고
프로젝트를 구현하는 과정에 몰두하느라 그 참고 자료를 다시 찾지 못한 채 시간이
흘렀습니다. 이후 이 저장소와 공개용 기록을 정리하는 과정에서 RorScore를 다시
찾게 되었고, 늦게나마 그 배움의 출발점을 이곳에 남깁니다.

이 프로젝트는 RorScore의 코드를 그대로 복사하거나 포함하지는 않았습니다. 다만
초기 Google Apps Script 구현을 시작하던 시기에, Jeremy Leader의 RorScore가
중요한 학습 참고 자료였음에 깊이 감사를 표합니다.

- [RorScore by Jeremy Leader](https://github.com/jleader/RorScore)
- [RorScore의 주요 Perl 파일: `bin/rorschach.pl`](https://github.com/jleader/RorScore/blob/master/bin/rorschach.pl)

## 2019 Excel scoring workbook

초기 v1 Google Apps Script 계산기를 만들 때, 공개 배포된 2019 Excel workbook의 셀 수식을 구조요약 계산을 프로그래밍 언어로 옮기는 참고 자료로 사용했습니다.

- 공개 배포 위치: [Naver Blog 게시물](https://blog.naver.com/jin_k84/221539279596)
- workbook 안의 제작 표기: `[Scoring Program] _by. Ju-Ri`

workbook에 적힌 `Ju-Ri`만으로 제작자의 실명을 추정하지 않습니다. 원본 파일도 이 공개 저장소에 재배포하지 않습니다.

이 자료는 프로그래밍을 배우기 전 Excel 수식으로 계산 구조를 이해하고, 이후 v1 GAS의 JavaScript 구현을 시작하는 데 실질적인 도움을 주었습니다. 그 기여와 배움의 계보를 뒤늦게나마 명시합니다.

v2.2.2 재검산에서는 이 workbook이나 RorScore 어느 하나도 단독 정답으로 가정하지 않았습니다. Excel의 실제 셀 수식, RorScore의 주요 원본 파일, v1과 v2의 계산 코드, 이 앱이 채택한 Exner 종합체계 규칙, 완성된 구조요약 예시를 서로 비교했습니다. CHESSSS는 공개 설명서에서 직접 확인할 수 있는 범위만 보조 자료로 사용했습니다.

v2.2.5에서는 개별 반응에 넣는 운동 부호와 구조요약에서 보여주는 합계 항목을 다시 구분했습니다. 2019 workbook의 입력 목록에는 능동형·수동형이 구분된 운동 부호만 있었고, RorScore의 `M`, `FM`, `m`은 이 부호들을 읽은 뒤 만드는 운동 종류별 합계였습니다. v1에서는 서로 역할이 다른 두 항목이 한 드롭다운에 함께 나타났고, 이 상태가 v2까지 이어졌습니다. 정확한 수작업 경로는 남은 기록만으로 단정하지 않았으며, 확인된 자료의 역할과 앱에서 생긴 구현 오류를 구분해 [v2.2.5 패치노트](./v2-nextjs/releases/v2.2.5/)에 기록했습니다.

이 비교를 통해 Excel에서 확인된 차이, RorScore에 구현되지 않았거나 앱과 다르게 표현된 부분, v1으로 옮기는 과정에서 생긴 별도의 실수를 구분할 수 있었습니다. Excel 화면의 `FC:CF+C` 오른쪽 값에는 Cn이 포함되어 있었고, 현재 앱은 이 화면값과 WSumC·S-CON·Color-Shading에서 Cn을 다루는 방식을 서로 분리합니다. 공개 자료끼리 설명이 다르거나 충분히 밝히지 않은 부분은 단정하지 않고 근거의 한계도 함께 기록했습니다. 자세한 내용은 [v2.2.2 릴리즈 노트](./v2-nextjs/releases/v2.2.2/)에서 확인할 수 있습니다.

## AI 개발 및 독립 검토 도구

v2의 구현과 반복 검사는 OpenAI Codex를 사용했습니다. 공개 전 독립 검토에는 Claude Fable 5와 Claude Opus 4.8을 사용했습니다.

AI 도구 사이의 의견 일치를 계산이나 임상 판단의 정답으로 삼지는 않습니다. 제품의 최종 결정과 책임은 MOW에 있으며, 공개 전문 자료, 재현 가능한 프로그램 출력과 회귀 검사, 서울임상심리연구소의 실제 사용 관점에서 이루어지는 임상 검토를 함께 대조합니다.
