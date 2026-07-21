# Acknowledgements

[한국어](./ACKNOWLEDGEMENTS.md) | [English](./ACKNOWLEDGEMENTS.en.md) | [日本語](./ACKNOWLEDGEMENTS.ja.md) | [Español](./ACKNOWLEDGEMENTS.es.md) | [Português (Brasil)](./ACKNOWLEDGEMENTS.pt-BR.md)

## RorScore

When this project was first taking shape and programming was still new to its creator, RorScore served almost like an introductory textbook. It showed that the logic of a Rorschach Structural Summary could be expressed in code.

An acknowledgement was intended from the beginning, but the reference could not be found again while attention was focused on learning to program and building the first implementation. RorScore was located later while this repository and its public record were being organized, making it possible to record that starting point here at last.

This project does not copy or include RorScore code. Jeremy Leader's RorScore was nevertheless an important learning reference when the initial Google Apps Script implementation began, and that contribution is gratefully acknowledged.

- [RorScore by Jeremy Leader](https://github.com/jleader/RorScore)
- [Main Perl file in RorScore: `bin/rorschach.pl`](https://github.com/jleader/RorScore/blob/master/bin/rorschach.pl)

## 2019 Excel scoring workbook

While the initial v1 Google Apps Script calculator was being developed, the cell formulas in a publicly distributed 2019 Excel workbook were used as a reference for translating Structural Summary calculations into a programming language.

- Public distribution page: [Naver Blog post](https://blog.naver.com/jin_k84/221539279596)
- Authorship text shown in the workbook: `[Scoring Program] _by. Ju-Ri`

The creator's real name is not inferred from the name `Ju-Ri` shown in the workbook. The original workbook is also not redistributed in this public repository.

This material was genuinely helpful in understanding the calculation structure through Excel formulas before learning to program, and later in beginning the JavaScript implementation for v1 GAS. Its place in the project's learning history is acknowledged here.

Later calculation-accuracy work did not treat either this workbook or RorScore as a sole source of truth. The actual Excel cell formulas, the original RorScore file, the v1 and v2 calculation code, the Exner Comprehensive System rules adopted by this application, and completed Structural Summary examples were compared with one another. CHESSSS was used only as a supplementary reference where its public documentation could be checked directly. Where public materials differed or did not explain a point sufficiently, the project avoided a firm conclusion and recorded the limits of the available evidence.

In particular, the input list in the 2019 workbook contained only movement codes with active or passive quality, while `M`, `FM`, and `m` in RorScore were totals derived from those codes by movement type. These two groups served different purposes, but they appeared together in one v1 dropdown and remained there through v2. The history of that implementation and the limits of the supporting evidence are described in the [v2.2.2 release note](./v2-nextjs/releases/v2.2.2/) and the [v2.2.5 patch note](./v2-nextjs/releases/v2.2.5/README.en.md).

## AI development and independent review tools

OpenAI Codex was used for implementation and repeated testing in v2. Claude Fable 5 and Claude Opus 4.8 were used for independent review before publication.

Agreement between AI tools is not treated as proof of a calculation or clinical judgment. MOW retains final responsibility for the product and compares public professional references, reproducible program output and regression tests, and the clinical review conducted by the Seoul Institute of Clinical Psychology from the perspective of actual use.
