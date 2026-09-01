# [2026-09-01] v2.2.12 Correção de erros

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## Esta versão

A v2.2.12 muda as estatísticas de visitas para um sistema sem cookies, anônimo e agregado. As entradas do Sumário Estrutural, os resultados dos cálculos, o conteúdo das conversas com IA e as chaves API não são incluídos nas estatísticas de visitas.

As fórmulas e os resultados não foram alterados. Não é necessário recalcular os protocolos existentes.

## O que mudou?

As novas visitas não são mais medidas com o Google Analytics. A partir de agora, o Vercel Web Analytics permite consultar de forma anônima e agregada informações como páginas visitadas, origem do acesso, país ou região aproximados, navegador, sistema operacional e tipo de dispositivo.

O Vercel Web Analytics não usa cookies para identificar visitantes nem vincula atividades entre dias ou sites diferentes.

## Quem é afetado?

A mudança se aplica a todas as pessoas que visitam o aplicativo web. Não há nada para configurar ou selecionar em uma janela de consentimento. A calculadora e os assistentes de IA funcionam como antes.

## É necessário recalcular os resultados existentes?

Não. As fórmulas, os critérios de codificação e os resultados não foram alterados, portanto não é necessário recalcular os protocolos existentes.

## Privacidade e limitações clínicas

As entradas do Sumário Estrutural, os resultados dos cálculos, o conteúdo das conversas com IA e as chaves API não são incluídos nas estatísticas de visitas. Esta mudança afeta apenas a forma de medir as visitas gerais e não influencia os cálculos nem o julgamento clínico.

Este serviço não substitui o julgamento clínico profissional.
