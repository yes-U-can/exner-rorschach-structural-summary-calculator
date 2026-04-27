---
canonicalRoute: "scoring-input/gphr"
locale: "pt"
docKind: "coding-overview"
canonicalTitle: "scoring-input/gphr"
displayTitle: "[Codificacao/GHR-PHR] GHR/PHR"
aliases:
  - "GHR/PHR"
  - "representacao humana"
  - "boa representacao humana"
  - "ma representacao humana"
relatedRoutes:
  - "scoring-input/gphr/GHR"
  - "scoring-input/gphr/PHR"
  - "scoring-input/contents/H"
  - "scoring-input/contents/Hd"
  - "scoring-input/determinants/M"
  - "scoring-input/special-score/COP"
  - "scoring-input/special-score/AG"
  - "scoring-input/special-score/MOR"
  - "result-interpretation/lower-section/interpersonal/HumanCont"
  - "result-interpretation/lower-section/interpersonal/PureH"
  - "result-interpretation/lower-section/selfPerception/H_ratio"
authorityPolicy: "exner-base"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/provenance-pt-gphr-2026-03-11.md"
---

# Nome do documento: [Codificacao/GHR-PHR] GHR/PHR

## Apelidos e busca

- GHR/PHR
- representacao humana
- boa representacao humana
- ma representacao humana

## Definicao central

`GHR` e `PHR` sao codigos especiais usados para qualificar a qualidade de uma resposta representacional humana.
Eles nao sao escolhidos por impressao clinica geral, mas por uma sequencia de decisao apoiada em codigos que ja foram atribuidos.

## Condicoes de aplicacao

- Primeiro confirme que a resposta entra no dominio de representacao humana.
- Isso pode acontecer por conteudo humano, determinante `M` ou uma resposta `FM` com [`COP`](ref://scoring-input/special-score/COP) ou [`AG`](ref://scoring-input/special-score/AG).
- Depois siga a sequencia de decisao para definir se a resposta termina em [`GHR`](ref://scoring-input/gphr/GHR) ou [`PHR`](ref://scoring-input/gphr/PHR).
- A decisao final depende de qualidade formal, escores cognitivos especiais, `AG`, `MOR`, `An`, `Hd`, popularidade e outros sinais ja codificados.

## Cuidados e diferenciacao

- `GHR` e `PHR` nao sao atribuidos juntos; a resposta termina em um ou no outro.
- Conteudo humano sozinho nao basta para fechar a decisao.
- `GHR` nao significa "pessoa boa" e `PHR` nao significa "pessoa ruim"; sao classificacoes do sistema para representacao humana.
- Essas decisoes alimentam variaveis posteriores como [`HumanCont`](ref://result-interpretation/lower-section/interpersonal/HumanCont), [`PureH`](ref://result-interpretation/lower-section/interpersonal/PureH) e [`H ratio`](ref://result-interpretation/lower-section/selfPerception/H_ratio).

## Referencias cruzadas

- [[Codificacao/GHR-PHR] GHR](ref://scoring-input/gphr/GHR)
- [[Codificacao/GHR-PHR] PHR](ref://scoring-input/gphr/PHR)
- [[Codificacao/Conteudo] H](ref://scoring-input/contents/H)
- [[Codificacao/Conteudo] Hd](ref://scoring-input/contents/Hd)
- [[Codificacao/Determinantes] M](ref://scoring-input/determinants/M)
- [[Codificacao/Escore Especial] COP](ref://scoring-input/special-score/COP)
- [[Codificacao/Escore Especial] AG](ref://scoring-input/special-score/AG)
- [[Codificacao/Escore Especial] MOR](ref://scoring-input/special-score/MOR)
- [[Interpretacao/Interpersonal] Human Content](ref://result-interpretation/lower-section/interpersonal/HumanCont)
- [[Interpretacao/Interpersonal] Pure H](ref://result-interpretation/lower-section/interpersonal/PureH)
- [[Interpretacao/Autopercepcao] H ratio](ref://result-interpretation/lower-section/selfPerception/H_ratio)

## Nota de base

- A comparacao detalhada de fontes ficou separada na nota interna de provenance.
