---
canonicalRoute: "scoring-input/gphr/PHR"
locale: "pt"
docKind: "coding-entry"
canonicalTitle: "scoring-input/gphr/PHR"
displayTitle: "[Codificação/GHR-PHR] PHR"
aliases:
  - "PHR"
  - "ma representação humana"
  - "resposta representacional humana pobre"
relatedRoutes:
  - "scoring-input/gphr"
  - "scoring-input/gphr/GHR"
  - "scoring-input/contents/Hd"
  - "scoring-input/contents/An"
  - "scoring-input/special-score/AG"
  - "scoring-input/special-score/MOR"
  - "result-interpretation/lower-section/interpersonal/HumanCont"
  - "result-interpretation/lower-section/selfPerception/H_ratio"
authorityPolicy: "curated-internal-reference"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/provenance-pt-gphr-2026-03-11.md"
---

# Nome do documento: [Codificação/GHR-PHR] PHR

## Apelidos e busca

- PHR
- ma representação humana
- resposta representacional humana pobre

## Definição central

`PHR` marca uma resposta representacional humana relativamente mais pobre, distorcida ou frágil dentro da sequência do sistema.
Assim como `GHR`, ele não é escolhido por impressão livre, mas por critérios sucessivos da sequência.

## Condições de aplicação

- A resposta precisa primeiro qualificar-se como representação humana.
- `PHR` é atribuído cedo quando há `FQ-`, `FQ none`, `CONTAM` ou qualquer escore cognitivo de nível 2.
- Códigos como `FABCOM`, [`MOR`](ref://scoring-input/special-score/MOR), conteúdo [`An`](ref://scoring-input/contents/An), [`AG`](ref://scoring-input/special-score/AG), `INCOM`, `DR` ou conteúdo [`Hd`](ref://scoring-input/contents/Hd) também podem empurrar para `PHR` no ponto correspondente da sequência.
- Se um critério de `PHR` aparece antes de um critério de `GHR`, a decisão fecha em `PHR`.

## Cuidados e diferenciação

- `PHR` não significa simplesmente "conteúdo negativo"; ele classifica a qualidade da representação humana.
- Nem toda resposta com `Hd` e decidida imediatamente; a sequência completa ainda importa, mesmo que `Hd` seja um sinal importante.
- `PHR` e `GHR` não são duplicados; a resposta termina em um ou no outro.
- A interpretação posterior deve apoiar-se no protocolo inteiro, não em `PHR` isolado.

## Referências cruzadas

- [[Codificação/GHR-PHR] GHR/PHR](ref://scoring-input/gphr)
- [[Codificação/GHR-PHR] GHR](ref://scoring-input/gphr/GHR)
- [[Codificação/Conteúdo] Hd](ref://scoring-input/contents/Hd)
- [[Codificação/Conteúdo] An](ref://scoring-input/contents/An)
- [[Codificação/Escore Especial] AG](ref://scoring-input/special-score/AG)
- [[Codificação/Escore Especial] MOR](ref://scoring-input/special-score/MOR)
- [[Interpretação/Interpersonal] Human Content](ref://result-interpretation/lower-section/interpersonal/HumanCont)
- [[Interpretação/Autopercepção] H ratio](ref://result-interpretation/lower-section/selfPerception/H_ratio)

## Nota de base

- A comparação detalhada de fontes ficou separada na nota interna de provenance.
