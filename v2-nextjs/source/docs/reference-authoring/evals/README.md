# Reference Retrieval Evals

이 폴더는 locale별 참조 코퍼스의 retrieval 품질을 점검하기 위한 curated query set을 둔다.

원칙:

- query set은 locale별로 별도 관리한다.
- `targetCount`는 go-live 전 충족해야 하는 목표 문항 수다.
- 지금 단계의 seed query set은 운영 전 최종본이 아니라, retrieval 품질을 조기 점검하기 위한 시작점이다.
- runtime promotion은 query set coverage, graph integrity, source-priority QA가 모두 통과한 뒤에만 허용한다.

평가 세트 역할은 구분해서 기록한다.

- locale별 `*-curated-query-set.json`은 기존 동작이 다시 깨지지 않는지 확인하는 회귀 계약이다. alias와 정답 route가 밀접하므로 실제 사용자 정확도의 독립 추정치로 해석하지 않는다.
- `hybrid-retrieval-dev-v1.json`은 실제 OpenAI query embedding과 runtime vector DB를 함께 시험하는 개발용 challenge set이다. 구현 조정에 사용했으므로 blind held-out이라고 부르지 않는다.
- 향후 blind held-out 세트는 retrieval 구현과 개발 세트를 보지 않은 별도 작성·검수 절차로 만들고, 최초 최종 평가 전까지 동결해야 한다.
