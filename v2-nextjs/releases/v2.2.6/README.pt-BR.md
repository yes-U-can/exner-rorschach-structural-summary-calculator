# [2026-07-20] v2.2.6 Correção de erros

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## Principais alterações

### Visão geral

Este patch corrige situações em que mecanismos de busca e prévias de links recebiam informações de idioma diferentes da página exibida. Também corrige um problema da tela de codificação em que `Alt+roda do mouse` podia ser interpretado como deslocamento em alguns fluxos de entrada de navegadores no Windows.

Nas explicações exibidas ao passar o mouse sobre os cabeçalhos [Score] e [G/PHR], os nomes dos campos relacionados agora seguem um único formato entre colchetes: [Card], [Z], [Contents], [Determinants], [FQ] e [Special Score].

O patch não altera as fórmulas do Sumário Estrutural, os dados de codificação, a disposição da tela nem as regras de resposta dos assistentes de IA opcionais. Não é necessário recalcular protocolos existentes.

### Informações de busca em cinco idiomas

O endereço padrão sem parâmetro de idioma corresponde à página em coreano. No entanto, nos endereços padrão de Sobre o serviço, Termos de uso, Política de privacidade, Documentos de referência e Arquivo de versões, a página visível podia estar em coreano enquanto o título de busca e o endereço canônico eram emitidos em inglês. Agora o idioma visível, o título, a descrição e o endereço canônico estão todos alinhados em coreano.

As páginas em português do Brasil mantêm o endereço `?lang=pt` para preservar favoritos e links externos. A etiqueta de idioma fornecida aos mecanismos de busca e às tecnologias assistivas passa a ser a forma mais precisa `pt-BR`.

Cada página indexável fornece, segundo a mesma regra:

- seu próprio endereço canônico
- endereços alternativos em coreano, inglês, japonês, espanhol e português do Brasil
- o endereço padrão em coreano quando nenhum idioma é selecionado
- títulos, descrições e imagens de prévia localizados para buscas e compartilhamento de links

Os favoritos e links externos existentes não mudam.

### Ampliação da tela de codificação

Em alguns navegadores no Windows, o evento da roda não preservava por completo o estado da tecla `Alt`. Por isso, a tela de codificação podia se deslocar em vez de ampliar ou reduzir. O aplicativo agora também acompanha o estado de `Alt` no teclado e dá prioridade à ampliação sobre o deslocamento.

O comportamento existente de `Ctrl+roda do mouse` para ampliar toda a página no navegador permanece disponível. A escala mínima e máxima da tela de codificação, a ampliação centrada no ponteiro e as margens de deslocamento também permanecem inalteradas.

## Testes e verificação

- Foi verificado que as principais páginas públicas sem parâmetro de idioma emitam títulos, descrições e endereços canônicos em coreano.
- Cada URL indexável nos cinco idiomas foi verificada quanto ao endereço canônico próprio, às quatro alternativas restantes e ao endereço padrão em coreano.
- Foi confirmada a consistência de `pt-BR` no idioma da página, nos links alternativos, no mapa do site e nos dados estruturados das páginas em português do Brasil.
- A exclusão existente das rotas exclusivas de IA e das rotas de API da indexação foi verificada novamente.
- Casos separados de `Alt`, do estado de entrada alternativo do Windows e de `Ctrl` confirmaram que a ampliação da tela de codificação e a ampliação do navegador não assumem o controle uma da outra.
- Os cinco idiomas foram verificados para confirmar que os campos citados nas explicações dos cabeçalhos usam os mesmos colchetes.
- O conjunto completo passou por 458 verificações em 82 arquivos de teste; 7 foram ignoradas porque suas condições de execução não estavam disponíveis. A compilação de produção, a análise estática do código, a revisão dos textos nos cinco idiomas e as auditorias de segredos e dependências também foram concluídas com êxito.

Os testes automáticos verificam os metadados e as regras dos eventos de entrada. O momento em que os resultados de busca são atualizados depende do ciclo de rastreamento de cada mecanismo, e a interação física do teclado e do mouse também é verificada na página implantada.

## UI/UX, privacidade e escopo do cálculo

- Nenhuma nova tela ou campo de entrada foi adicionado.
- Os menus visíveis e a disposição da tela não foram alterados.
- Apenas a redação das explicações dos cabeçalhos da tabela de codificação foi padronizada.
- As fórmulas e os resultados do Sumário Estrutural não foram alterados.
- Nenhuma nova informação pessoal é coletada.
- Permanece a regra de não armazenar dados de codificação nem chaves API da OpenAI no banco de dados do servidor.
- O corpus de IA, os embeddings e as regras de resposta dos assistentes de codificação e interpretação não foram alterados.

## Escopo público e limite de segurança

O código público inclui metadados de busca localizados, endereços canônicos e alternativos, o mapa do site, o tratamento da ampliação da tela de codificação e os testes automáticos relacionados.

Variáveis de ambiente, chaves API, configurações privadas de implantação, caminhos locais e registros internos de trabalho não são publicados.

## Apêndice técnico

<details>
<summary><strong>Comandos para desenvolvedores repetirem os testes</strong></summary>

```bash
npm test
npm run lint
npm run build
npm run security:check
```

</details>
