# Reference Retrieval Evals

이 폴더는 locale별 참조 코퍼스의 retrieval 품질을 점검하기 위한 curated query set을 둔다.

원칙:

- query set은 locale별로 별도 관리한다.
- `targetCount`는 go-live 전 충족해야 하는 목표 문항 수다.
- 지금 단계의 seed query set은 운영 전 최종본이 아니라, retrieval 품질을 조기 점검하기 위한 시작점이다.
- runtime promotion은 query set coverage, graph integrity, source-priority QA가 모두 통과한 뒤에만 허용한다.
