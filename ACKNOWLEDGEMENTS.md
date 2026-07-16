# Acknowledgements

## RorScore

제가 심리학 지식을 바탕으로 처음 프로그래밍을 배워가던 때, RorScore는 로샤
구조요약 계산 로직을 코드로 표현할 수 있다는 것을 보여준 첫 교과서 같은
프로젝트였습니다.

처음부터 이 감사의 마음을 기록하고 싶었지만, 당시에는 프로그래밍을 배우고
프로젝트를 구현하는 과정에 몰두하느라 그 참고 자료를 다시 찾지 못한 채 시간이
흘렀습니다. 이후 이 저장소와 공개용 기록을 정리하는 과정에서 RorScore를 다시
찾게 되었고, 늦게나마 그 배움의 출발점을 이곳에 남깁니다.

이 프로젝트는 RorScore의 코드를 그대로 복사하거나 포함하지는 않았습니다. 다만
초기 Google Apps Script 구현을 시작하던 시기에, Jeremy Leader의 RorScore가
중요한 학습 참고 자료였음에 깊이 감사를 표합니다.

- RorScore by Jeremy Leader: https://github.com/jleader/RorScore

## 2019 Excel scoring workbook

초기 v1 Google Apps Script 계산기를 만들 때, 다음 Excel workbook의 셀 수식을 구조요약 계산을 프로그래밍 언어로 옮기는 참고 자료로 사용했습니다.

- `(Rorschach) Scoring Program (2019.08.04) _Ju-Ri_20251007161337.xlsx`
- workbook 안의 제작 표기: `[Scoring Program] _by. Ju-Ri`
- 당시 파일을 받은 곳으로 사용자가 확인한 [Naver Blog 게시물](https://blog.naver.com/jin_k84/221539279596)

workbook에 적힌 `Ju-Ri`만으로 제작자의 실명을 추정하지 않습니다. 원본 파일도 이 공개 저장소에 재배포하지 않습니다.

이 자료는 프로그래밍을 배우기 전 Excel 수식으로 계산 구조를 이해하고, 이후 v1 GAS의 JavaScript 구현을 시작하는 데 실질적인 도움을 주었습니다. 그 기여와 배움의 계보를 뒤늦게나마 명시합니다.

동시에 v2.2.1 감사에서는 이 workbook을 정답으로 가정하지 않았습니다. 실제 셀 수식, v1 GAS, v2 TypeScript, Exner의 명시 규칙과 완성 예제, International Rorschach Institute의 CHESSSS 구현을 교차대조했습니다. 그 결과 workbook의 D/AdjD 상한과 EBPer 처리 등 일부 차이를 확인했고, 계보와 수정 범위를 [v2.2.1 릴리즈 노트](./v2-nextjs/releases/v2.2.1/)에 공개했습니다.
