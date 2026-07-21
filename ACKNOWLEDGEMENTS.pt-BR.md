# Agradecimentos

[한국어](./ACKNOWLEDGEMENTS.md) | [English](./ACKNOWLEDGEMENTS.en.md) | [日本語](./ACKNOWLEDGEMENTS.ja.md) | [Español](./ACKNOWLEDGEMENTS.es.md) | [Português (Brasil)](./ACKNOWLEDGEMENTS.pt-BR.md)

## RorScore

Na fase inicial do desenvolvimento, quando a programação ainda estava sendo aprendida a partir de conhecimentos de psicologia, o RorScore funcionou como um primeiro livro-texto: mostrou que a lógica de cálculo do Sumário Estrutural de Rorschach podia ser expressa em código.

Havia a intenção de registrar este agradecimento desde o começo, mas o material de referência não foi localizado novamente enquanto a atenção estava voltada ao aprendizado de programação e à primeira implementação. Mais tarde, durante a organização deste repositório e de seu registro público, o RorScore foi reencontrado, permitindo registrar aqui, ainda que tardiamente, esse ponto de partida.

Este projeto não copia nem incorpora o código do RorScore. Ainda assim, o RorScore, de Jeremy Leader, foi uma referência importante de aprendizado quando começou a implementação inicial em Google Apps Script, e essa contribuição é reconhecida com profunda gratidão.

- [RorScore, de Jeremy Leader](https://github.com/jleader/RorScore)
- [Principal arquivo Perl do RorScore: `bin/rorschach.pl`](https://github.com/jleader/RorScore/blob/master/bin/rorschach.pl)

## Planilha de pontuação de 2019

Durante o desenvolvimento da calculadora inicial v1 em Google Apps Script, as fórmulas de célula de uma planilha de Excel de 2019 distribuída publicamente foram usadas como referência para transferir os cálculos do Sumário Estrutural para uma linguagem de programação.

- Página de distribuição pública: [publicação no Naver Blog](https://blog.naver.com/jin_k84/221539279596)
- Indicação de autoria presente na planilha: `[Scoring Program] _by. Ju-Ri`

O nome real da pessoa autora não é inferido apenas a partir da indicação `Ju-Ri` presente na planilha. O arquivo original também não é redistribuído neste repositório público.

Esse material ajudou de forma concreta a compreender a estrutura de cálculo por meio de fórmulas do Excel antes do aprendizado de programação e, depois, a iniciar a implementação em JavaScript da v1 GAS. Sua contribuição para a trajetória de aprendizado do projeto é reconhecida aqui, ainda que tardiamente.

Os trabalhos posteriores sobre exatidão dos cálculos não adotaram nem essa planilha nem o RorScore como fonte única de verdade. Foram comparadas entre si as fórmulas reais das células do Excel, o arquivo original do RorScore, o código de cálculo das versões v1 e v2, as regras do Sistema Compreensivo de Exner adotadas por este aplicativo e exemplos completos de Sumário Estrutural. O CHESSSS foi usado apenas como referência complementar nos pontos que podiam ser verificados diretamente em sua documentação pública. Quando os materiais públicos divergiam ou não explicavam suficientemente uma questão, nenhuma conclusão categórica foi adotada e os limites das evidências também foram registrados.

Em particular, a lista de entrada da planilha de 2019 continha apenas códigos de movimento classificados como ativos ou passivos, enquanto `M`, `FM` e `m` no RorScore eram totais por tipo de movimento calculados a partir desses códigos. Os dois grupos tinham funções diferentes, mas apareceram juntos em um único menu suspenso da v1 e permaneceram assim até a v2. O histórico dessa implementação, a função de cada material e os limites das evidências estão descritos nas [notas da versão v2.2.2](./v2-nextjs/releases/v2.2.2/) e nas [notas da versão v2.2.5](./v2-nextjs/releases/v2.2.5/README.pt-BR.md).

## Ferramentas de desenvolvimento e revisão independente com IA

O OpenAI Codex foi usado na implementação e nos testes repetidos da v2. Claude Fable 5 e Claude Opus 4.8 foram usados na revisão independente antes da publicação.

A concordância entre ferramentas de IA não é tratada como prova de que um cálculo ou julgamento clínico esteja correto. A MOW mantém a responsabilidade final pelo produto e compara referências profissionais públicas, saídas reproduzíveis do programa e testes de regressão, além da revisão clínica realizada pelo Seoul Institute of Clinical Psychology sob a perspectiva do uso real.
