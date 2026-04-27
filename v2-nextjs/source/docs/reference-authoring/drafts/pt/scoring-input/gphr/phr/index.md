---
canonicalRoute: "scoring-input/gphr/PHR"
locale: "pt"
docKind: "coding-entry"
canonicalTitle: "scoring-input/gphr/PHR"
displayTitle: "[Codificacao/GHR-PHR] PHR"
aliases:
  - "PHR"
  - "ma representacao humana"
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
authorityPolicy: "exner-base"
status: "draft"
runtimeReady: false
provenanceNote: "docs/reference-authoring/notes/provenance-pt-gphr-2026-03-11.md"
---

# Nome do documento: [Codificacao/GHR-PHR] PHR

## Apelidos e busca

- PHR
- ma representacao humana
- resposta representacional humana pobre

## Definicao central

`PHR` marca uma resposta representacional humana relativamente mais pobre, distorcida ou fragil dentro da sequencia do sistema.
Assim como `GHR`, ele nao e escolhido por impressao livre, mas por criterios sucessivos da sequencia.

## Condicoes de aplicacao

- A resposta precisa primeiro qualificar-se como representacao humana.
- `PHR` e atribuido cedo quando ha `FQ-`, `FQ none`, `CONTAM` ou qualquer escore cognitivo de nivel 2.
- Codigos como `FABCOM`, [`MOR`](ref://scoring-input/special-score/MOR), conteudo [`An`](ref://scoring-input/contents/An), [`AG`](ref://scoring-input/special-score/AG), `INCOM`, `DR` ou conteudo [`Hd`](ref://scoring-input/contents/Hd) tambem podem empurrar para `PHR` no ponto correspondente da sequencia.
- Se um criterio de `PHR` aparece antes de um criterio de `GHR`, a decisao fecha em `PHR`.

## Cuidados e diferenciacao

- `PHR` nao significa simplesmente "conteudo negativo"; ele classifica a qualidade da representacao humana.
- Nem toda resposta com `Hd` e decidida imediatamente; a sequencia completa ainda importa, mesmo que `Hd` seja um sinal importante.
- `PHR` e `GHR` nao sao duplicados; a resposta termina em um ou no outro.
- A interpretacao posterior deve apoiar-se no protocolo inteiro, nao em `PHR` isolado.

## Referencias cruzadas

- [[Codificacao/GHR-PHR] GHR/PHR](ref://scoring-input/gphr)
- [[Codificacao/GHR-PHR] GHR](ref://scoring-input/gphr/GHR)
- [[Codificacao/Conteudo] Hd](ref://scoring-input/contents/Hd)
- [[Codificacao/Conteudo] An](ref://scoring-input/contents/An)
- [[Codificacao/Escore Especial] AG](ref://scoring-input/special-score/AG)
- [[Codificacao/Escore Especial] MOR](ref://scoring-input/special-score/MOR)
- [[Interpretacao/Interpersonal] Human Content](ref://result-interpretation/lower-section/interpersonal/HumanCont)
- [[Interpretacao/Autopercepcao] H ratio](ref://result-interpretation/lower-section/selfPerception/H_ratio)

## Nota de base

- A comparacao detalhada de fontes ficou separada na nota interna de provenance.
