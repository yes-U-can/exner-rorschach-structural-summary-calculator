---
canonicalRoute: "scoring-input/location"
locale: "pt"
docKind: "coding-overview"
canonicalTitle: "scoring-input/location"
displayTitle: "[Codificação/Localização] Location"
aliases:
  - "Location"
  - "codificação de localização"
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
authorityPolicy: "curated-internal-reference"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/provenance-pt-location-2026-03-10.md"
---

# Nome do documento: [Codificação/Localização] Location

## Apelidos e busca

- Location
- codificação de localização
- `W`, `WS`, `D`, `DS`, `Dd`, `DdS`, `S`

## Definição central

Location codifica que parte da mancha a pessoa usa para construir a resposta.
A pergunta principal é se a pessoa usa a mancha inteira, um detalhe comum, um detalhe incomum, e se integra espaço branco.

## Condições de aplicação

- Fixe a localização com precisão na folha de localização ou no inquérito.
- Se a mancha inteira é usada, codifique [`W`](ref://scoring-input/location/W).
- Se um detalhe comum é usado, codifique [`D`](ref://scoring-input/location/D).
- Se um detalhe pouco frequente é usado, codifique [`Dd`](ref://scoring-input/location/Dd).
- Se o espaço branco é integrado, acrescente `S` ao código básico: [`WS`](ref://scoring-input/location/WS), [`DS`](ref://scoring-input/location/DS), [`DdS`](ref://scoring-input/location/DdS).
- `S` não funciona sozinho como código básico; ele modifica outra decisão de localização.

## Cuidados e diferenciação

- Location não descreve organização nem ajuste formal. Isso é codificado separadamente em [`DQ`](ref://scoring-input/dq) e [`FQ`](ref://scoring-input/fq).
- `D` e `Dd` não se separam apenas por tamanho; a distinção depende de uso comum versus incomum da área.
- Espaço branco não deve ser presumido. Ele precisa ter papel real na resposta.
- Na interpretação, as frequências de `W`, `D`, `Dd` e `S` reaparecem na upper section do Structural Summary.

## Referências cruzadas

- [[Codificação/Localização] W](ref://scoring-input/location/W)
- [[Codificação/Localização] WS](ref://scoring-input/location/WS)
- [[Codificação/Localização] D](ref://scoring-input/location/D)
- [[Codificação/Localização] DS](ref://scoring-input/location/DS)
- [[Codificação/Localização] Dd](ref://scoring-input/location/Dd)
- [[Codificação/Localização] DdS](ref://scoring-input/location/DdS)
- [[Codificação/Localização] S](ref://scoring-input/location/S)
- [[Interpretação/Upper Section] W](ref://result-interpretation/upper-section/W)
- [[Interpretação/Upper Section] D](ref://result-interpretation/upper-section/D)
- [[Interpretação/Upper Section] Dd](ref://result-interpretation/upper-section/Dd)
- [[Interpretação/Upper Section] S](ref://result-interpretation/upper-section/S)

## Nota de base

- A comparação detalhada de fontes ficou separada na nota interna de provenance.
