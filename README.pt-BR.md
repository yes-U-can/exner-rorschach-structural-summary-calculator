# Calculadora do Sumário Estrutural do Sistema Compreensivo de Rorschach de Exner

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

Este é o arquivo público de código-fonte e versões da `Calculadora do Sumário Estrutural do Sistema Compreensivo de Rorschach de Exner`. Os assistentes de IA baseados nos documentos de referência são oferecidos como recursos opcionais.

Este repositório publica as notas de atualização e o código-fonte das versões lançadas. A v1 é preservada como aplicativo web do Google Apps Script, e a v2 como aplicativo web em Next.js.

A MOW planeja, desenvolve, publica, opera e mantém o aplicativo. O Seoul Institute of Clinical Psychology (SICP) revisou a transferência inicial da lógica de cálculo, comparou os resultados calculados e realiza revisão clínica a partir da experiência de uso real.

Os agradecimentos e os materiais consultados no aprendizado inicial estão reunidos em [ACKNOWLEDGEMENTS.md](./ACKNOWLEDGEMENTS.pt-BR.md).

## Documentação e idiomas

Cada nota de atualização registra o que mudou, as condições que podem ser afetadas, se resultados existentes precisam ser recalculados e as evidências usadas na verificação.

- O documento em coreano é a fonte canônica do conteúdo factual.
- Os guias públicos e as notas de atualização destinados aos leitores têm versões em [English](./README.en.md), [日本語](./README.ja.md), [Español](./README.es.md) e [Português (Brasil)](./README.pt-BR.md).
- A interface do aplicativo oferece 5 idiomas: coreano, inglês, japonês, espanhol e português.
- Quando a fonte canônica muda, verificações automáticas confirmam se números, fórmulas, links, versões e datas também foram atualizados nas quatro traduções.
- Identificadores que exigem precisão, como comandos, caminhos de arquivos, nomes de APIs e modelos, permanecem na forma original e são explicados quando necessário.

## Conteúdo publicado

- [Next.js] Aplicativo web: [exner.yesucan.co.kr](https://exner.yesucan.co.kr)
- [Next.js] Versão 2 mais recente: [v2-nextjs/releases/v2.2.10](./v2-nextjs/releases/v2.2.10/README.pt-BR.md)
- [Next.js] Fontes de cálculo e escopo bibliográfico da v2.2.10: [v2-nextjs/methodology/reference-audit-v2.2.10](./v2-nextjs/methodology/reference-audit-v2.2.10/README.pt-BR.md)
- [Next.js] Verificação de fontes primárias da v2.2.10: [v2-nextjs/source/docs/ops/2026-08-04-v2.2.10-calculation-source-crosscheck.md](./v2-nextjs/source/docs/ops/2026-08-04-v2.2.10-calculation-source-crosscheck.md)
- [Next.js] Nova verificação da precisão de cálculo da v2.2.2: [v2-nextjs/source/docs/ops/2026-07-17-v2.2.2-calculation-reaudit.md](./v2-nextjs/source/docs/ops/2026-07-17-v2.2.2-calculation-reaudit.md)
- [Next.js] Explicação de Cn da v2.2.2 e verificações do limite de resposta em 5 idiomas: [v2-nextjs/source/docs/ai-evals/2026-07-17-v2.2.2-live-eval-report.md](./v2-nextjs/source/docs/ai-evals/2026-07-17-v2.2.2-live-eval-report.md)
- [Next.js] Validação da interface da v2.2.0: [v2-nextjs/source/docs/ops/2026-07-14-v2.2.0-workspace-shell-validation.md](./v2-nextjs/source/docs/ops/2026-07-14-v2.2.0-workspace-shell-validation.md)
- [Next.js] Validação dos limites temáticos de IA da v2.2.0: [v2-nextjs/source/docs/ai-evals/2026-07-15-v2.2.0-exner-domain-boundary-report.md](./v2-nextjs/source/docs/ai-evals/2026-07-15-v2.2.0-exner-domain-boundary-report.md)
- [Next.js] Estudo de caso sobre o controle de respostas de IA na v2.1.2: [docs/case-studies/v2.1.2-ai-harness.md](./docs/case-studies/v2.1.2-ai-harness.md)
- [Next.js] Guia de avaliação da qualidade das respostas de IA: [v2-nextjs/source/docs/ai-evals/README.md](./v2-nextjs/source/docs/ai-evals/README.md)
- [Next.js] Critérios de revisão humana das respostas de IA: [v2-nextjs/source/docs/ai-evals/HUMAN_RUBRIC.md](./v2-nextjs/source/docs/ai-evals/HUMAN_RUBRIC.md)
- [Next.js] Histórico de versões 2: [v2-nextjs/releases](./v2-nextjs/releases/)
- [Next.js] Código-fonte público da versão 2: [v2-nextjs/source](./v2-nextjs/source/)
- [Google Apps Script] Histórico de versões 1: [v1-gas/releases](./v1-gas/releases/)
- Versão executável mais recente da v1: [implantação v1.4.1](https://script.google.com/macros/s/AKfycbxMCx13pkrSzFs8f2qXfmxy2LRhkBpZTItFTIfEOoOi-zwurbysnKGfDIYtAeEdQP99/exec)
- Código-fonte mais recente da v1: [v1-gas/current](./v1-gas/current/)

## Evolução da qualidade de IA na v2.1.x

Na série v2.1.x, os assistentes de IA foram aprimorados em etapas para concluir as respostas, localizar os documentos de referência adequados, não substituir o julgamento do profissional e não guardar informações privadas. Não foi uma repetição do mesmo trabalho: cada atualização corrigiu novos problemas observados durante o uso real.

- **v2.1.2-v2.1.6:** foram organizados o tamanho das respostas, a detecção de interrupções, o contexto da conversa, os limites clínicos e os critérios de avaliação automática.
- **v2.1.7:** foram organizados o formato e o escopo público dos arquivos README, registros de mudanças e notas de atualização.
- **v2.1.8:** os documentos de referência em cinco idiomas foram revisados e todo o material pesquisado pelos assistentes de IA foi atualizado.
- **v2.1.9:** a recuperação de documentos ficou mais estável para códigos curtos e perguntas em vários idiomas.
- **v2.1.10:** foram corrigidos os problemas restantes de reconhecimento de códigos em japonês, perguntas amplas de interpretação e configuração de um banco de dados novo.

O trabalho relacionado da v2.1.8 à v2.1.10 está registrado nas respectivas notas de atualização.

## v2.2.10

A v2.2.10 restaura a razão `GHR:PHR` ausente na Lower Section da tela e do PDF, seguindo a disposição original do Sumário Estrutural. Também organiza as tabelas comuns da Lower Section no PDF e recupera as decisões gerais e os separadores dos Special Indices. GHR e PHR já eram classificados e somados, portanto não é necessário recalcular protocolos existentes.

Para esta versão, 50 obras publicadas foram classificadas como fontes diretas de cálculo, apoio interpretativo, limites com outros sistemas de Rorschach, contexto histórico e de pesquisa ou materiais fora do escopo do produto; em seguida, seus sumários e capítulos pertinentes foram revisados. A base de cálculo do Sistema Compreensivo de Exner foi novamente comparada às páginas impressas do Volume 1, 4.ª edição, e do Workbook, 5.ª edição, abrangendo a Upper Section, a Lower Section, os seis Special Indices e as principais regras de entrada. O R-PAS e outros sistemas de Rorschach não foram misturados à base de cálculo; foram examinados para distinguir termos semelhantes que têm significados diferentes. A auditoria não encontrou nenhum novo defeito que altere os resultados calculados.

Os documentos Interpersonal em cinco idiomas agora explicam `GHR:PHR`. Também foram reforçados os limites de resposta para que as regras de outros sistemas de Rorschach não sejam misturadas aos cálculos do Sistema Compreensivo de Exner. As obras, edições, páginas impressas, o papel de cada material e as limitações restantes estão na [nota da v2.2.10](./v2-nextjs/releases/v2.2.10/README.pt-BR.md), em [fontes de cálculo e escopo bibliográfico](./v2-nextjs/methodology/reference-audit-v2.2.10/README.pt-BR.md) e na [verificação das fontes de cálculo](./v2-nextjs/source/docs/ops/2026-08-04-v2.2.10-calculation-source-crosscheck.md).

## v2.2.9

A v2.2.9 é uma correção de erros que permite alternar entre a ordem crescente e a decrescente com o botão [Card] e abre o Assistente de Interpretação pretendido quando uma sessão de IA é iniciada durante esse acesso. No Assistente de Interpretação, quando a pessoa está lendo acima da mensagem mais recente, o botão mostra três pontos ou uma seta para baixo conforme o estado da resposta da IA. Ao selecionar uma avaliação útil ou não útil, o fundo do botão permanece igual; apenas o polegar passa a ser um ícone sólido no azul do aplicativo. Os testes automáticos também cobrem o salvamento, a opção de pular os motivos e a exclusão ao pressionar novamente o mesmo botão.

As fórmulas do Sumário Estrutural e as regras de resposta da IA não mudaram, portanto protocolos existentes não precisam ser recalculados. Também foram alinhadas as datas de arquivo da v1.0.2 e da v1.0.3 e a notação das contagens técnicas de quatro algarismos nos documentos dos cinco idiomas. Consulte a [nota da v2.2.9](./v2-nextjs/releases/v2.2.9/README.pt-BR.md) para mais detalhes.

## v2.2.8

A v2.2.8 é uma correção de erros que impede a contagem dupla do mesmo código de Conteúdo em uma resposta e unifica as regras de normalização das interfaces de computador e móvel. Os dados de exemplo não substituem mais um salvamento automático existente, e foram reforçados o salvamento da última edição e a validação de dados danificados.

As fórmulas do Sumário Estrutural não mudaram. Protocolos existentes inseridos conforme as regras não precisam ser recalculados. Devem ser revistos com o material original e recalculados apenas os registros que contenham um código de Conteúdo duplicado em uma resposta; que tenham armazenado resultados diferentes entre as interfaces de computador e móvel para Special Scores Level 1 e Level 2; que tenham armazenado na interface móvel apenas determinantes sem forma (`C`, `C'`, `T`, `V`, `Y` ou `Cn`) com um valor de [FQ] diferente de `none`; ou que conservem um código Z não aceito ou um escore Z que não pertença ao cartão. Os documentos de S-CON e as regras de resposta de IA agora apresentam os 12 critérios e o limite de 8 critérios nos cinco idiomas; nenhum campo de idade foi adicionado. Consulte a [nota da v2.2.8](./v2-nextjs/releases/v2.2.8/README.pt-BR.md) para mais detalhes.

## v2.2.7

A v2.2.7 é um patch de correção de erros que impede que três entradas incompletas da tabela de codificação sigam para o cálculo. O `S` isolado foi removido das opções de localização, de modo que as respostas de espaço em branco sejam sempre registradas como `WS`, `DS` ou `DdS`; o mesmo determinante ou códigos da mesma família de movimento não podem mais ser inseridos em duplicidade em uma mesma resposta; e não é mais possível calcular com a Qualidade Formal em branco. Nos registros em que todas as respostas são de forma pura (`F`), o Lambda é informado como o número de respostas de F pura em vez do símbolo de infinito.

Os protocolos existentes inseridos conforme as regras não precisam ser recalculados. Se dados antigos salvos automaticamente contiverem esses valores, o aplicativo preserva o original, interrompe o cálculo e indica nos cinco idiomas as linhas que precisam de revisão. Também foi introduzida uma lista de regras que verifica automaticamente se os documentos de referência nos cinco idiomas declaram as mesmas regras clínicas. Consulte a [nota da v2.2.7](./v2-nextjs/releases/v2.2.7/README.pt-BR.md) para mais detalhes.

## v2.2.6

A v2.2.6 alinha o título, a descrição, o endereço canônico e as alternativas de idioma das cinco versões com o idioma exibido na tela. Endereços sem parâmetro de idioma passam a usar o coreano de forma consistente, enquanto o endereço `?lang=pt` é preservado e identificado aos mecanismos de busca como português do Brasil por meio de `pt-BR`.

Também foi corrigido um problema de alguns navegadores no Windows em que `Alt+roda do mouse` deslocava a tela de codificação em vez de ampliá-la. Os nomes dos campos nas explicações dos cabeçalhos da tabela agora usam colchetes de forma consistente. As fórmulas e os resultados do Sumário Estrutural, os dados de codificação, a disposição da tela, o corpus de IA e as regras de resposta permanecem inalterados; portanto, não é necessário recalcular protocolos existentes. Consulte a [nota da v2.2.6](./v2-nextjs/releases/v2.2.6/README.pt-BR.md) para mais detalhes.

## v2.2.5

A v2.2.5 separa a entrada do determinante de movimento de cada resposta dos totais de família exibidos no Sumário Estrutural. A tabela de codificação deixa de oferecer `M`, `FM` e `m` sem sufixo ativo ou passivo; em seu lugar, são usados códigos completos como `Ma`, `Mp` e `Ma-p`. Os totais `M`, `FM` e `m` do Sumário Estrutural e os cálculos de EB, MQual e W:M permanecem inalterados.

Protocolos existentes que já usam códigos completos não precisam ser recalculados. Se um salvamento automático antigo contiver um código de movimento sem o sufixo ativo ou passivo, o aplicativo preserva a entrada original, interrompe o cálculo e identifica a linha e o código que precisam de revisão. Os documentos de referência e os limites de resposta em cinco idiomas também foram verificados. A [nota da v2.2.5](./v2-nextjs/releases/v2.2.5/README.pt-BR.md) explica as condições afetadas e o exemplo hipotético no limite do CDI.

## v2.2.4

A v2.2.4 reorganizou os documentos de referência destinados às pessoas e o material pesquisado pelos assistentes de IA opcionais, sem alterar as fórmulas do Sumário Estrutural nem a entrada da tabela de codificação. Não é necessário recalcular resultados existentes.

Os termos e a redação dos cinco idiomas foram comparados com fontes profissionais de cada idioma, e os títulos e a ordem dos documentos foram alinhados ao fluxo real de codificação e interpretação. Foram atualizados 1015 documentos de referência e reforçados o escopo Exner CS, a recusa de injeções de prompt e os limites de solicitações. A [nota da v2.2.4](./v2-nextjs/releases/v2.2.4/) apresenta os detalhes.

Uma revisão posterior também aperfeiçoou a escolha da forma de iniciar a codificação, a legibilidade dos documentos de referência e o controle de rolagem do assistente de codificação.

## v2.2.3

A v2.2.3 reorganizou a documentação pública, os metadados de busca e pré-visualização de links em cinco idiomas e a proteção contra gravações excessivas no banco de dados de avaliação de respostas de IA, sem alterar fórmulas nem a disposição da tela. Não é necessário recalcular resultados existentes.

O título usado em buscas e compartilhamentos é `Yes, U Can!` em todos os idiomas. A descrição localizada informa que a calculadora de Sumário Estrutural do Sistema Compreensivo de Rorschach de Exner é de código aberto, não exige cadastro, instalação ou pagamento e não substitui o julgamento clínico profissional. A avaliação positiva ou negativa continua sem guardar o texto da conversa e passa a limitar o tamanho das solicitações e a frequência de gravações por sessão. A [nota da v2.2.3](./v2-nextjs/releases/v2.2.3/) explica a organização das datas e os limites de segurança.

## v2.2.2

A v2.2.2 voltou a separar os cálculos que incluem Cn daqueles que o excluem. No rótulo convencional `FC:CF+C`, o valor à direita é `CF+C+Cn`, enquanto este aplicativo exclui Cn de WSumC, do critério 7 de S-CON e dos cálculos Color-Shading. **O valor exibido de Cn para protocolos completos já estava correto na v2.2.1, portanto esse ponto isolado não exige novo cálculo.** A atualização também impede que uma linha incompleta com Qualidade Formal (FQ) em branco receba classificação provisória GHR ou PHR.

A planilha Excel de 2019, o programa original RorScore, a v1 GAS, o código atual da v2, CHESSSS, RAP3 e RIAP5 permitem verificar partes diferentes do cálculo; por isso, nenhum deles foi tratado como autoridade única. Foram verificados o cálculo, os recursos, os limites de resposta e as páginas de distribuição. A única mudança de interface foi tornar a barra lateral esquerda totalmente opaca; a otimização específica para dispositivos móveis continua em versões posteriores da v2.2.x.

## v2.2.1

A v2.2.1 corrigiu os cálculos de **Upper Section, Lower Section e Special Indices** exibidos pelo aplicativo, sem alterar a UI/UX nem acrescentar campos de entrada. Foram corrigidos os valores extremos de D/AdjD, as condições de exibição de EBPer, a ordem das regras GHR/PHR, os denominadores iguais a 0 de WDA% e Afr e a inclusão de Cn no valor à direita de `FC:CF+C`.

A versão também informou pela primeira vez a localização pública e a função da planilha Excel de 2019 consultada no desenvolvimento inicial da v1. A verificação incluiu cálculos com os mesmos códigos e notas em diferentes idiomas e protocolos sintéticos reproduzíveis.

## v2.2.0

A v2.2.0 é a primeira versão v2.2.x a reunir a navegação principal do desktop em uma barra lateral esquerda e apresentar o assistente de interpretação como uma conversa convencional com IA. Também organizou a interrupção das respostas, a cópia e avaliação de mensagens, a rolagem da área de conversa, os documentos de referência, o arquivo de versões e o zoom e deslocamento da tabela de codificação.

Os assistentes de IA foram limitados ao Sistema Compreensivo de Exner. Os pontos de cálculo identificados durante a revisão da v2.2.0 foram corrigidos na v2.2.1 e na v2.2.2. Consulte a v2.2.0 para o registro de UI/UX e o relatório de cálculo da v2.2.2 para os critérios atuais. As telas para dispositivos móveis são aperfeiçoadas separadamente nas versões posteriores da v2.2.x.

## [Next.js] Histórico de versões 2

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

<details>
<summary><strong>Como executar diretamente o código-fonte da v2</strong></summary>

1. Abra a pasta [v2-nextjs/source](./v2-nextjs/source/).
2. Instale as dependências com `npm install`.
3. Crie um arquivo local de variáveis de ambiente a partir de `.env.example`.
4. Verifique o aplicativo com `npm run build` ou `npm run dev`.

</details>

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
