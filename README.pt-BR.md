# Calculadora do Sumário Estrutural do Sistema Compreensivo de Rorschach de Exner

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

Este é o arquivo público de código-fonte e versões da `Calculadora do Sumário Estrutural do Sistema Compreensivo de Rorschach de Exner`. Os assistentes de IA baseados nos documentos de referência são oferecidos como recursos opcionais.

Este repositório publica as notas de atualização e o código-fonte das versões lançadas. A v1 é preservada como aplicativo web do Google Apps Script, e a v2 como o aplicativo web atual da versão 2.

A MOW planeja, desenvolve, publica, opera e mantém o aplicativo. O Seoul Institute of Clinical Psychology (SICP) contribui para conferir os resultados de cálculo iniciais e revisar o aplicativo sob a perspectiva do uso clínico real.

Os agradecimentos e os materiais consultados no aprendizado inicial estão reunidos em [ACKNOWLEDGEMENTS.md](./ACKNOWLEDGEMENTS.pt-BR.md).

## Documentação e idiomas

Cada nota de atualização explica o que mudou, as condições que podem ser afetadas, se resultados existentes precisam ser recalculados e as fontes de cálculo.

- Os guias públicos e as notas de atualização têm versões em [English](./README.en.md), [日本語](./README.ja.md), [Español](./README.es.md) e [Português (Brasil)](./README.pt-BR.md).
- A interface do aplicativo oferece 5 idiomas: coreano, inglês, japonês, espanhol e português.

## Conteúdo publicado

- [v2] Aplicativo web: [exner.yesucan.co.kr](https://exner.yesucan.co.kr)
- [v2] Versão 2 mais recente: [v2-nextjs/releases/v2.2.10](./v2-nextjs/releases/v2.2.10/README.pt-BR.md)
- [v2] Fontes de cálculo e escopo bibliográfico da v2.2.10: [fontes de cálculo e escopo bibliográfico](./v2-nextjs/methodology/reference-audit-v2.2.10/README.pt-BR.md)
- [v2] Histórico de versões 2: [v2-nextjs/releases](./v2-nextjs/releases/)
- [v2] Código-fonte público da versão 2: [v2-nextjs/source](./v2-nextjs/source/)
- [Google Apps Script] Histórico de versões 1: [v1-gas/releases](./v1-gas/releases/)
- Versão executável mais recente da v1: [implantação v1.4.1](https://script.google.com/macros/s/AKfycbxMCx13pkrSzFs8f2qXfmxy2LRhkBpZTItFTIfEOoOi-zwurbysnKGfDIYtAeEdQP99/exec)
- Código-fonte mais recente da v1: [v1-gas/current](./v1-gas/current/)

## v2.2.10

A v2.2.10 restaura a razão `GHR:PHR` ausente na Lower Section da tela e do PDF, seguindo a disposição original do Sumário Estrutural. Também organiza as tabelas comuns da Lower Section no PDF e a apresentação das decisões dos Special Indices. GHR e PHR já eram classificados e somados, portanto não é necessário recalcular protocolos existentes.

Os cálculos seguem as páginas impressas do Volume 1, 4.ª edição, e do Workbook, 5.ª edição, do Sistema Compreensivo de Exner. As regras do R-PAS e de outros sistemas de Rorschach não são misturadas aos cálculos do Sistema Compreensivo de Exner. A v2.2.10 não altera fórmulas nem critérios de decisão.

Os documentos Interpersonal em cinco idiomas agora explicam `GHR:PHR`. Os assistentes de IA também respondem somente dentro do Sistema Compreensivo de Exner. As obras, edições, páginas impressas, o papel de cada material e as limitações restantes estão na [nota da v2.2.10](./v2-nextjs/releases/v2.2.10/README.pt-BR.md) e em [fontes de cálculo e escopo bibliográfico](./v2-nextjs/methodology/reference-audit-v2.2.10/README.pt-BR.md).

## v2.2.9

A v2.2.9 é uma correção de erros que permite alternar entre a ordem crescente e a decrescente com o botão [Card] e abre o Assistente de Interpretação pretendido quando uma sessão de IA é iniciada durante esse acesso. No Assistente de Interpretação, quando a pessoa está lendo acima da mensagem mais recente, o botão mostra três pontos ou uma seta para baixo conforme o estado da resposta da IA. Ao selecionar uma avaliação útil ou não útil, o fundo do botão permanece igual; apenas o polegar passa a ser um ícone sólido no azul do aplicativo. A avaliação pode ser salva sem informar um motivo e é removida ao selecionar novamente a mesma opção.

As fórmulas do Sumário Estrutural e as regras de resposta da IA não mudaram, portanto protocolos existentes não precisam ser recalculados. Consulte a [nota da v2.2.9](./v2-nextjs/releases/v2.2.9/README.pt-BR.md) para mais detalhes.

## v2.2.8

A v2.2.8 é uma correção de erros que impede a contagem dupla do mesmo código de Conteúdo em uma resposta e faz com que as versões para computador e celular tratem os códigos da mesma forma. Os dados de exemplo não substituem mais um salvamento automático existente, a última alteração é salva e dados de salvamento automático danificados não são restaurados.

As fórmulas do Sumário Estrutural não mudaram. Protocolos existentes inseridos conforme as regras não precisam ser recalculados. Devem ser revistos com o material original e recalculados apenas os registros que contenham um código de Conteúdo duplicado em uma resposta; que tenham armazenado valores diferentes entre as versões para computador e celular para Special Scores Level 1 e Level 2; que tenham armazenado na interface móvel apenas determinantes sem forma (`C`, `C'`, `T`, `V`, `Y` ou `Cn`) com um valor de [FQ] diferente de `none`; ou que conservem um código Z não aceito ou um escore Z que não pertença ao cartão. Os documentos de S-CON e as regras de resposta de IA agora apresentam os 12 critérios e o limite de 8 critérios nos cinco idiomas; nenhum campo de idade foi adicionado. Consulte a [nota da v2.2.8](./v2-nextjs/releases/v2.2.8/README.pt-BR.md) para mais detalhes.

## v2.2.7

A v2.2.7 é um patch de correção de erros que impede que três entradas incompletas da tabela de codificação sigam para o cálculo. O `S` isolado foi removido das opções de localização, de modo que as respostas de espaço em branco sejam sempre registradas como `WS`, `DS` ou `DdS`; o mesmo determinante ou códigos da mesma família de movimento não podem mais ser inseridos em duplicidade em uma mesma resposta; e não é mais possível calcular com a Qualidade Formal em branco. Nos registros em que todas as respostas são de forma pura (`F`), o Lambda é informado como o número de respostas de F pura em vez do símbolo de infinito.

Os protocolos existentes inseridos conforme as regras não precisam ser recalculados. Se dados antigos salvos automaticamente contiverem esses valores, o aplicativo preserva o original, interrompe o cálculo e indica nos cinco idiomas as linhas que precisam de revisão. Consulte a [nota da v2.2.7](./v2-nextjs/releases/v2.2.7/README.pt-BR.md) para mais detalhes.

## v2.2.6

A v2.2.6 faz cada página mostrar o título e a descrição corretos para seu idioma nos resultados de busca e nos links compartilhados. Os favoritos e links externos existentes continuam funcionando.

Também foi corrigido um problema de alguns navegadores no Windows em que `Alt+roda do mouse` deslocava a tela de codificação em vez de ampliá-la. Os nomes dos campos nas explicações dos cabeçalhos da tabela agora usam colchetes de forma consistente. As fórmulas e os resultados do Sumário Estrutural, os dados de codificação, a disposição da tela, a busca de referências e as respostas de IA permanecem inalterados; portanto, não é necessário recalcular protocolos existentes. Consulte a [nota da v2.2.6](./v2-nextjs/releases/v2.2.6/README.pt-BR.md) para mais detalhes.

## v2.2.5

A partir da v2.2.5, a tabela de codificação deixa de oferecer `M`, `FM` e `m` sem sufixo ativo ou passivo; em seu lugar, são usados códigos completos como `Ma`, `Mp` e `Ma-p`. Os totais `M`, `FM` e `m` do Sumário Estrutural e os cálculos de EB, MQual e W:M permanecem inalterados.

Protocolos existentes que já usam códigos completos não precisam ser recalculados. Se um salvamento automático antigo contiver um código de movimento sem o sufixo ativo ou passivo, o aplicativo preserva a entrada original, interrompe o cálculo e identifica a linha e o código que precisam de revisão. Os documentos de referência e os assistentes de IA em cinco idiomas explicam o mesmo limite de entrada. A [nota da v2.2.5](./v2-nextjs/releases/v2.2.5/README.pt-BR.md) explica as condições afetadas e o exemplo hipotético no limite do CDI.

## v2.2.4

A v2.2.4 melhora os documentos de referência e o comportamento de busca e segurança dos assistentes de IA opcionais, sem alterar as fórmulas do Sumário Estrutural nem a entrada da tabela de codificação. Não é necessário recalcular resultados existentes.

Os documentos de referência usam a terminologia profissional de cada idioma, e seus títulos e ordem seguem o fluxo de codificação e interpretação. Os assistentes de codificação e interpretação não respondem perguntas fora do Exner CS nem solicitações de informações não públicas, e pedem que o usuário aguarde quando as solicitações se repetem em excesso. A [nota da v2.2.4](./v2-nextjs/releases/v2.2.4/) apresenta os detalhes.

Também foram aperfeiçoados o diálogo para escolher como iniciar a codificação, a legibilidade dos documentos de referência e o controle de rolagem do assistente de codificação.

## v2.2.3

A v2.2.3 melhora as informações de busca e pré-visualização de links em cinco idiomas e a proteção contra solicitações excessivas de avaliação de respostas de IA, sem alterar fórmulas nem a disposição da tela. Não é necessário recalcular resultados existentes.

O título usado em buscas e compartilhamentos é `Yes, U Can!` em todos os idiomas. A descrição localizada informa que a calculadora de Sumário Estrutural do Sistema Compreensivo de Rorschach de Exner é de código aberto, não exige cadastro, instalação ou pagamento e não substitui o julgamento clínico profissional. A avaliação positiva ou negativa não armazena o texto da conversa e rejeita envios excessivamente grandes ou frequentes. A [nota da v2.2.3](./v2-nextjs/releases/v2.2.3/) explica as mudanças e a privacidade.

## v2.2.2

A v2.2.2 corrige o limite entre os cálculos que incluem Cn e aqueles que o excluem. No rótulo convencional `FC:CF+C`, o valor à direita é `CF+C+Cn`, enquanto este aplicativo exclui Cn de WSumC, do critério 7 de S-CON e dos cálculos Color-Shading. **O valor exibido de Cn para protocolos completos já estava correto na v2.2.1, portanto esse ponto isolado não exige novo cálculo.** A atualização também impede que uma linha incompleta com Qualidade Formal (FQ) em branco receba classificação provisória GHR ou PHR.

Cada índice segue sua definição no Sistema Compreensivo de Exner; a notação e o comportamento de outros programas ou sistemas não são misturados ao cálculo. A barra lateral esquerda agora é totalmente opaca.

## v2.2.1

A v2.2.1 corrigiu os cálculos de **Upper Section, Lower Section e Special Indices** exibidos pelo aplicativo, sem alterar a tela nem acrescentar campos de entrada. Foram corrigidos os valores extremos de D/AdjD, as condições de exibição de EBPer, a ordem das regras GHR/PHR, os denominadores iguais a 0 de WDA% e Afr e a inclusão de Cn no valor à direita de `FC:CF+C`.

Os limites de cálculo seguem as regras do Sistema Compreensivo de Exner e exemplos completos do Sumário Estrutural.

## v2.2.0

A v2.2.0 é a primeira versão v2.2.x a reunir a navegação principal do desktop em uma barra lateral esquerda e apresentar o assistente de interpretação como uma conversa convencional com IA. Também organizou a interrupção das respostas, a cópia e avaliação de mensagens, a rolagem da área de conversa, os documentos de referência, o arquivo de versões e o zoom e deslocamento da tabela de codificação.

Os assistentes de IA foram limitados ao Sistema Compreensivo de Exner. As correções de D/AdjD, EBPer, GHR/PHR e dos limites de Cn publicadas nas versões v2.2.1 e v2.2.2 estão incluídas na versão atual.

## [v2] Histórico de versões 2

- **[2026-08-08] v2.2.10 (correção de erros)** [Nota da versão](./v2-nextjs/releases/v2.2.10/README.pt-BR.md) [Código-fonte](./v2-nextjs/source/)
- **[2026-08-01] v2.2.9 (correção de erros)** [Nota da versão](./v2-nextjs/releases/v2.2.9/README.pt-BR.md) [Código-fonte](./v2-nextjs/source/)
- **[2026-07-31] v2.2.8 (correção de erros)** [Nota da versão](./v2-nextjs/releases/v2.2.8/README.pt-BR.md) [Código-fonte](./v2-nextjs/source/)
- **[2026-07-23] v2.2.7 (correção de erros)** [Nota da versão](./v2-nextjs/releases/v2.2.7/README.pt-BR.md) [Código-fonte](./v2-nextjs/source/)
- **[2026-07-20] v2.2.6 (correção de erros)** [Nota da versão](./v2-nextjs/releases/v2.2.6/README.pt-BR.md) [Código-fonte](./v2-nextjs/source/)
- **[2026-07-19] v2.2.5 (correção de erros)** [Nota da versão](./v2-nextjs/releases/v2.2.5/README.pt-BR.md) [Código-fonte](./v2-nextjs/source/)
- **[2026-07-18] v2.2.4 (correção de erros)** [Nota da versão](./v2-nextjs/releases/v2.2.4/) [Código-fonte](./v2-nextjs/source/)
- **[2026-07-17] v2.2.3 (correção de erros)** [Nota da versão](./v2-nextjs/releases/v2.2.3/) [Código-fonte](./v2-nextjs/source/)
- **[2026-07-16] v2.2.2 (hotfix)** [Nota da versão](./v2-nextjs/releases/v2.2.2/) [Código-fonte](./v2-nextjs/source/)
- **[2026-07-15] v2.2.1 (hotfix)** [Nota da versão](./v2-nextjs/releases/v2.2.1/) [Código-fonte](./v2-nextjs/source/)
- **[2026-07-14] v2.2.0 (versão menor)** [Nota da versão](./v2-nextjs/releases/v2.2.0/) [Código-fonte](./v2-nextjs/source/)
- **[2026-07-13] v2.1.10 (correção de erros)** [Nota da versão](./v2-nextjs/releases/v2.1.10/) [Código-fonte](./v2-nextjs/source/)
- **[2026-07-12] v2.1.9 (correção de erros)** [Nota da versão](./v2-nextjs/releases/v2.1.9/) [Código-fonte](./v2-nextjs/source/)
- **[2026-07-11] v2.1.8 (correção de erros)** [Nota da versão](./v2-nextjs/releases/v2.1.8/) [Código-fonte](./v2-nextjs/source/)
- **[2026-07-05] v2.1.7 (correção de erros)** [Nota da versão](./v2-nextjs/releases/v2.1.7/) [Código-fonte](./v2-nextjs/source/)
- **[2026-07-04] v2.1.6 (correção de erros)** [Nota da versão](./v2-nextjs/releases/v2.1.6/) [Código-fonte](./v2-nextjs/source/)
- **[2026-07-03] v2.1.5 (correção de erros)** [Nota da versão](./v2-nextjs/releases/v2.1.5/) [Código-fonte](./v2-nextjs/source/)
- **[2026-07-02] v2.1.4 (correção de erros)** [Nota da versão](./v2-nextjs/releases/v2.1.4/) [Código-fonte](./v2-nextjs/source/)
- **[2026-06-29] v2.1.3 (correção de erros)** [Nota da versão](./v2-nextjs/releases/v2.1.3/) [Código-fonte](./v2-nextjs/source/)
- **[2026-06-28] v2.1.2 (correção de erros)** [Nota da versão](./v2-nextjs/releases/v2.1.2/) [Código-fonte](./v2-nextjs/source/)
- **[2026-06-27] v2.1.1 (correção de erros)** [Nota da versão](./v2-nextjs/releases/v2.1.1/) [Código-fonte](./v2-nextjs/source/)
- **[2026-06-22] v2.1.0 (versão menor)** [Nota da versão](./v2-nextjs/releases/v2.1.0/) [Código-fonte](./v2-nextjs/source/)
- **[2026-06-11] v2.0.3 (correção de erros)** [Nota da versão](./v2-nextjs/releases/v2.0.3/) [Código-fonte](./v2-nextjs/source/)
- **[2026-05-21] v2.0.2 (correção de erros)** [Nota da versão](./v2-nextjs/releases/v2.0.2/) [Código-fonte](./v2-nextjs/source/)
- **[2026-04-27] v2.0.1 (correção de erros)** [Nota da versão](./v2-nextjs/releases/v2.0.1/) [Código-fonte](./v2-nextjs/source/)
- **[2026-02-15] v2.0.0 (versão principal)** [Nota da versão](./v2-nextjs/releases/v2.0.0/) [Código-fonte](./v2-nextjs/source/)

## Como usar o arquivo v1 GAS

1. Abra o link de `nota da versão/código-fonte` da versão desejada.
2. Na pasta `source/`, confira `Code.gs`, `index.html` e `styles.html`.
3. Crie um projeto no Google Apps Script, adicione arquivos com os mesmos nomes e cole o conteúdo.
4. Publique-o como aplicativo web GAS ou abra o `link de implantação` da versão para executá-la diretamente.

## [Google Apps Script] Histórico de versões 1

- **[2026-01-07] v1.4.1 (correção de erros)** [Implantação](https://script.google.com/macros/s/AKfycbxMCx13pkrSzFs8f2qXfmxy2LRhkBpZTItFTIfEOoOi-zwurbysnKGfDIYtAeEdQP99/exec) [Nota da versão/código-fonte](./v1-gas/releases/v1.4.1/)
- **[2026-01-03] v1.4.0 (versão menor)** [Implantação](https://script.google.com/macros/s/AKfycbxWtI1q27rXuH4feBEGpoy0fIhXZU0ROJ2gRv5RbaQVPxnNgznTI9czHDrVzaS7wSMM/exec) [Nota da versão/código-fonte](./v1-gas/releases/v1.4.0/)
- **[2025-12-24] v1.3.3 (correção de erros)** [Implantação](https://script.google.com/macros/s/AKfycbyMG31uNG0mPIdyrzQ_86CSuSaACpFoOqy-kZGXk0uV7L92jBFAJijt1kV6nLMzcO2N/exec) [Nota da versão/código-fonte](./v1-gas/releases/v1.3.3/)
- **[2025-11-27] v1.3.2 (correção de erros)** [Implantação](https://script.google.com/macros/s/AKfycbxbuGLdEaj0mW6eIB5QHTax86b9FcKrsfLogy0wDLauJPwbbkQC5BHey0j_ERqXtVqE/exec) [Nota da versão/código-fonte](./v1-gas/releases/v1.3.2/)
- **[2025-11-26] v1.3.1 (correção de erros)** [Implantação](https://script.google.com/macros/s/AKfycbwOQ61Y34-iVRKB0T3isOVRzFP9xhxtQMrLZoRvVbS6PwSfEaFYzWvjuTF8IItY2p-T/exec) [Nota da versão/código-fonte](./v1-gas/releases/v1.3.1/) [Vídeo de uso](https://youtu.be/GH145Wwh-YA)
- **[2025-11-25] v1.3.0 (versão menor)** [Implantação](https://script.google.com/macros/s/AKfycbyethWbTOltcalcWo-kyXtunNSoJNMyKdKs_y7AYfV6bPE2R09ONcaCtDHSTvXTukE/exec) [Nota da versão/código-fonte](./v1-gas/releases/v1.3.0/)
- **[2025-11-21] v1.2.1 (correção de erros)** [Implantação](https://script.google.com/macros/s/AKfycbw6n2R3LgAncLvoXmin89SodbHB6brREdaxFfK2yHADdZelEskafqLH35xL0LFvSqMv/exec) [Nota da versão/código-fonte](./v1-gas/releases/v1.2.1/)
- **[2025-11-20] v1.2.0 (versão menor)** [Implantação](https://script.google.com/macros/s/AKfycbwD7zBLaAzC5r4VjH1yt7gxfG98vvBp4gsaC3VFQW0bCwe6MNfVXmR8LIjUEpIkTZTE/exec) [Nota da versão/código-fonte](./v1-gas/releases/v1.2.0/)
- **[2025-10-25] v1.1.2 (correção de erros)** [Implantação](https://script.google.com/macros/s/AKfycbxn8zeFQalOvh-jnZ_-REjafG2kCT1RkjyJvUahtCkXVyn6PJs9xJLZ0basm5kKEO4j2A/exec) [Nota da versão/código-fonte](./v1-gas/releases/v1.1.2/)
- **[2025-10-24] v1.1.1 (correção de erros)** [Implantação](https://script.google.com/macros/s/AKfycbw6XZZ7D3qiCeSsJPG6aj3DzMMPdA2p0kWhT8WU21WGVFqUltOmAXs3zOx4kXw2u5ul6Q/exec) [Nota da versão/código-fonte](./v1-gas/releases/v1.1.1/)
- **[2025-10-23] v1.1.0 (versão menor)** [Implantação](https://script.google.com/macros/s/AKfycbw2J6gd4Sf_Tjx6s9GdQrWu4b_tOtqwFLtKJCs-vSFRR0c4NZ0Mlb5UFm7-V9zkBPzitg/exec) [Nota da versão/código-fonte](./v1-gas/releases/v1.1.0/)
- **[2025-10-20] v1.0.4 (hotfix)** [Implantação](https://script.google.com/macros/s/AKfycbw1GLfIvehoz4wAzC4LicjD_oB0Dpy_sLJ30da9qobx5X4wa3nJr0pLewV0lVPPv1ptGw/exec) [Nota da versão/código-fonte](./v1-gas/releases/v1.0.4/)
- **[2025-10-18] v1.0.3 (correção de erros)** [Implantação](https://script.google.com/macros/s/AKfycbzoiaofs_I5Ue4p7Eo5XQp0OmUtmbbqkpJuwD-FQ1R4PLscULJB_AHVBb-VylICEKJB1A/exec) [Nota da versão/código-fonte](./v1-gas/releases/v1.0.3/)
- **[2025-10-18] v1.0.2 (hotfix)** [Implantação](https://script.google.com/macros/s/AKfycbwtBFge9jPS03Mz4QD5IlUDfHOetaVGsIe48y9dZESkfWtsJ-dnYv9S5iZ_4wxx4dCOUw/exec) [Nota da versão/código-fonte](./v1-gas/releases/v1.0.2/)
- **[2025-10-17] v1.0.1 (hotfix)** [Implantação](https://script.google.com/macros/s/AKfycbwNNeJsgRx0sEnZO4X9XxEUEthQlVS3Ttk6k_OSmIj8aTPlpdBQV1653hmBtzLnVX8Q/exec) [Nota da versão/código-fonte](./v1-gas/releases/v1.0.1/)
- **[2025-10-16] v1.0.0 (versão principal)** [Implantação](https://script.google.com/macros/s/AKfycbxYTxqKcmRNJhpE8eCGTBZPyUFVJIRQiUTbyW48lJKg2E7Bgc5RKSitdDTVcE3bzk07JA/exec) [Nota da versão/código-fonte](./v1-gas/releases/v1.0.0/)
