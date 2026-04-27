---
canonicalRoute: "scoring-input/location"
locale: "pt"
docKind: "coding-overview"
canonicalTitle: "scoring-input/location"
displayTitle: "[Codificacao/Localizacao] Location"
aliases:
  - "Location"
  - "codificacao de localizacao"
  - "W, WS, D, DS, Dd, DdS, S"
relatedRoutes:
  - "scoring-input/location/W"
  - "scoring-input/location/WS"
  - "scoring-input/location/D"
  - "scoring-input/location/DS"
  - "scoring-input/location/Dd"
  - "scoring-input/location/DdS"
  - "scoring-input/location/S"
  - "result-interpretation/upper-section/W"
  - "result-interpretation/upper-section/D"
  - "result-interpretation/upper-section/Dd"
  - "result-interpretation/upper-section/S"
authorityPolicy: "exner-base"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/provenance-pt-location-2026-03-10.md"
---

# Nome do documento: [Codificacao/Localizacao] Location

## Apelidos e busca

- Location
- codificacao de localizacao
- `W`, `WS`, `D`, `DS`, `Dd`, `DdS`, `S`

## Definicao central

Location codifica que parte da mancha a pessoa usa para construir a resposta.
A pergunta principal e se a pessoa usa a mancha inteira, um detalhe comum, um detalhe incomum, e se integra espaco branco.

## Condicoes de aplicacao

- Fixe a localizacao com precisao na folha de localizacao ou no inquerito.
- Se a mancha inteira e usada, codifique [`W`](ref://scoring-input/location/W).
- Se um detalhe comum e usado, codifique [`D`](ref://scoring-input/location/D).
- Se um detalhe pouco frequente e usado, codifique [`Dd`](ref://scoring-input/location/Dd).
- Se o espaco branco e integrado, acrescente `S` ao codigo basico: [`WS`](ref://scoring-input/location/WS), [`DS`](ref://scoring-input/location/DS), [`DdS`](ref://scoring-input/location/DdS).
- `S` nao funciona sozinho como codigo basico; ele modifica outra decisao de localizacao.

## Cuidados e diferenciacao

- Location nao descreve organizacao nem ajuste formal. Isso e codificado separadamente em [`DQ`](ref://scoring-input/dq) e [`FQ`](ref://scoring-input/fq).
- `D` e `Dd` nao se separam apenas por tamanho; a distincao depende de uso comum versus incomum da area.
- Espaco branco nao deve ser presumido. Ele precisa ter papel real na resposta.
- Na interpretacao, as frequencias de `W`, `D`, `Dd` e `S` reaparecem na upper section do Structural Summary.

## Referencias cruzadas

- [[Codificacao/Localizacao] W](ref://scoring-input/location/W)
- [[Codificacao/Localizacao] WS](ref://scoring-input/location/WS)
- [[Codificacao/Localizacao] D](ref://scoring-input/location/D)
- [[Codificacao/Localizacao] DS](ref://scoring-input/location/DS)
- [[Codificacao/Localizacao] Dd](ref://scoring-input/location/Dd)
- [[Codificacao/Localizacao] DdS](ref://scoring-input/location/DdS)
- [[Codificacao/Localizacao] S](ref://scoring-input/location/S)
- [[Interpretacao/Upper Section] W](ref://result-interpretation/upper-section/W)
- [[Interpretacao/Upper Section] D](ref://result-interpretation/upper-section/D)
- [[Interpretacao/Upper Section] Dd](ref://result-interpretation/upper-section/Dd)
- [[Interpretacao/Upper Section] S](ref://result-interpretation/upper-section/S)

## Nota de base

- A comparacao detalhada de fontes ficou separada na nota interna de provenance.
