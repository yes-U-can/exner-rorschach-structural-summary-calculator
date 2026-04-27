---
canonicalRoute: "scoring-input/z"
locale: "pt"
docKind: "coding-overview"
canonicalTitle: "scoring-input/z"
displayTitle: "[Codificacao/Z] Z"
aliases:
  - "Z"
  - "atividade organizacional"
  - "codificacao Z"
relatedRoutes:
  - "scoring-input/z/ZW"
  - "scoring-input/z/ZA"
  - "scoring-input/z/ZD"
  - "scoring-input/z/ZS"
  - "scoring-input/location/W"
  - "scoring-input/location/D"
  - "scoring-input/location/Dd"
  - "scoring-input/location/S"
  - "scoring-input/dq/+"
  - "scoring-input/dq/v/+"
  - "scoring-input/dq/o"
  - "result-interpretation/upper-section/Zf"
  - "result-interpretation/upper-section/ZSum"
  - "result-interpretation/upper-section/ZEst"
  - "result-interpretation/upper-section/Zd"
  - "result-interpretation/lower-section/processing/Zd_proc"
authorityPolicy: "exner-base"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/provenance-pt-z-2026-03-11.md"
---

# Nome do documento: [Codificacao/Z] Z

## Apelidos e busca

- Z
- atividade organizacional
- codificacao Z

## Definicao central

`Z` codifica atividade organizacional na resposta.
Ele so e atribuido quando a resposta usa forma e se encaixa em um dos quatro padroes Z: `ZW`, `ZA`, `ZD` ou `ZS`.

## Condicoes de aplicacao

- A resposta precisa incluir uso de forma.
- Considere `Z` quando a resposta mostra organizacao entre partes da mancha ou entre a area da mancha e o espaco branco.
- Se mais de um padrao Z puder valer na mesma resposta, mantenha o tipo com maior valor do cartao.
- `Wv` nao recebe `Z`.
- Respostas puramente vagas, sem suporte formal suficiente, nao recebem `Z`.

## Cuidados e diferenciacao

- `Z` nao e um codigo de localizacao. Ele usa informacao de [`W`](ref://scoring-input/location/W), [`D`](ref://scoring-input/location/D), [`Dd`](ref://scoring-input/location/Dd) e [`S`](ref://scoring-input/location/S), mas codifica outra coisa.
- Listar partes da mancha nao basta. Precisa haver integracao ou relacao significativa.
- Em respostas globais, `ZW` tambem exige DQ compativel.
- `ZS` exige integracao real de espaco branco, nao apenas area branca visivel dentro da resposta.

## Referencias cruzadas

- [[Codificacao/Z] ZW](ref://scoring-input/z/ZW)
- [[Codificacao/Z] ZA](ref://scoring-input/z/ZA)
- [[Codificacao/Z] ZD](ref://scoring-input/z/ZD)
- [[Codificacao/Z] ZS](ref://scoring-input/z/ZS)
- [[Codificacao/Localizacao] W](ref://scoring-input/location/W)
- [[Codificacao/Localizacao] D](ref://scoring-input/location/D)
- [[Codificacao/Localizacao] Dd](ref://scoring-input/location/Dd)
- [[Codificacao/Localizacao] S](ref://scoring-input/location/S)
- [[Codificacao/Qualidade Desenvolvimental] +](ref://scoring-input/dq/%2B)
- [[Codificacao/Qualidade Desenvolvimental] v/+](ref://scoring-input/dq/v/%2B)
- [[Codificacao/Qualidade Desenvolvimental] o](ref://scoring-input/dq/o)
- [[Interpretacao/Upper Section] Zf](ref://result-interpretation/upper-section/Zf)
- [[Interpretacao/Upper Section] ZSum](ref://result-interpretation/upper-section/ZSum)
- [[Interpretacao/Upper Section] ZEst](ref://result-interpretation/upper-section/ZEst)
- [[Interpretacao/Upper Section] Zd](ref://result-interpretation/upper-section/Zd)
- [[Interpretacao/Processing] Zd](ref://result-interpretation/lower-section/processing/Zd_proc)

## Nota de base

- A comparacao detalhada de fontes ficou separada na nota interna de provenance.
