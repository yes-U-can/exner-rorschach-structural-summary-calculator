# [2026-07-20] v2.2.6 Correção de erros

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## Principais alterações

### Visão geral

Este patch corrige situações em que mecanismos de busca e prévias de links recebiam informações de idioma diferentes da página exibida. Também corrige um problema da tela de codificação em que `Alt+roda do mouse` podia ser interpretado como deslocamento em alguns navegadores no Windows.

Nas explicações exibidas ao passar o mouse sobre os cabeçalhos [Score] e [G/PHR], os nomes dos campos relacionados agora seguem um único formato entre colchetes: [Card], [Z], [Contents], [Determinants], [FQ] e [Special Score].

O patch não altera as fórmulas do Sumário Estrutural, os dados de codificação, a disposição da tela nem as regras de resposta dos assistentes de IA opcionais. Não é necessário recalcular protocolos existentes.

### Informações de busca em cinco idiomas

Cada página agora mostra o título e a descrição corretos para seu idioma nos resultados de busca e nos links compartilhados. Os favoritos e links externos existentes continuam funcionando.

### Ampliação da tela de codificação

Nos navegadores afetados no Windows, `Alt+roda do mouse` agora amplia ou reduz a tela de codificação em vez de deslocá-la.

O comportamento existente de `Ctrl+roda do mouse` para ampliar toda a página no navegador permanece disponível. A escala mínima e máxima da tela de codificação, a ampliação centrada no ponteiro e as margens de deslocamento também permanecem inalteradas.

## Interface, privacidade e escopo do cálculo

- Nenhuma nova tela ou campo de entrada foi adicionado.
- Os menus visíveis e a disposição da tela não foram alterados.
- Apenas a redação das explicações dos cabeçalhos da tabela de codificação foi padronizada.
- As fórmulas e os resultados do Sumário Estrutural não foram alterados.
- Nenhuma nova informação pessoal é coletada.
- Os dados de codificação salvos automaticamente permanecem apenas no dispositivo. A chave de API é usada de forma criptografada em uma conexão de IA por no máximo 24 horas e é apagada quando a conexão termina.
- A busca de referências e as regras de resposta dos assistentes de codificação e interpretação não foram alteradas.
