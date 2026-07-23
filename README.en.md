# Exner Rorschach Structural Summary Calculator

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

This is the public source and release archive for the `Exner Rorschach Comprehensive System Structural Summary Calculator`. Reference-grounded AI assistants are available as optional features.

This repository publishes the patch notes and source code for released versions. v1 is preserved as a Google Apps Script web app, and v2 as a Next.js web app.

MOW plans, builds, deploys, operates, and maintains the web app. The Seoul Institute of Clinical Psychology (SICP) reviewed the initial transfer of calculation logic, compared calculated results, and provides clinical review based on real use.

Credits and the early learning references are documented in [ACKNOWLEDGEMENTS.md](./ACKNOWLEDGEMENTS.en.md).

## Documentation and languages

Each patch note records what changed, the conditions that may be affected, whether existing results need to be recalculated, and the evidence used for verification.

- Korean is the canonical source for the document's factual content.
- Reader-facing public guides and patch notes are accompanied by [English](./README.en.md), [日本語](./README.ja.md), [Español](./README.es.md), and [Português (Brasil)](./README.pt-BR.md) versions.
- The web app supports 5 interface languages: Korean, English, Japanese, Spanish, and Portuguese.
- When the canonical source changes, automated checks confirm that numbers, formulas, links, versions, and dates have been updated in all four companion versions.
- Exact identifiers such as commands, file paths, API names, and model names remain unchanged and are explained when necessary.

## What is available

- [Next.js] Live web app: [exner.yesucan.co.kr](https://exner.yesucan.co.kr)
- [Next.js] Latest version 2 release: [v2-nextjs/releases/v2.2.7](./v2-nextjs/releases/v2.2.7/README.en.md)
- [Next.js] v2.2.2 calculation accuracy recheck: [v2-nextjs/source/docs/ops/2026-07-17-v2.2.2-calculation-reaudit.md](./v2-nextjs/source/docs/ops/2026-07-17-v2.2.2-calculation-reaudit.md)
- [Next.js] v2.2.2 Cn explanation and live GPT-5.5 checks in 5 languages: [v2-nextjs/source/docs/ai-evals/2026-07-17-v2.2.2-live-eval-report.md](./v2-nextjs/source/docs/ai-evals/2026-07-17-v2.2.2-live-eval-report.md)
- [Next.js] v2.2.0 UI validation: [v2-nextjs/source/docs/ops/2026-07-14-v2.2.0-workspace-shell-validation.md](./v2-nextjs/source/docs/ops/2026-07-14-v2.2.0-workspace-shell-validation.md)
- [Next.js] v2.2.0 AI scope validation: [v2-nextjs/source/docs/ai-evals/2026-07-15-v2.2.0-exner-domain-boundary-report.md](./v2-nextjs/source/docs/ai-evals/2026-07-15-v2.2.0-exner-domain-boundary-report.md)
- [Next.js] v2.1.2 case study on controlling AI answers: [docs/case-studies/v2.1.2-ai-harness.md](./docs/case-studies/v2.1.2-ai-harness.md)
- [Next.js] Guide to AI answer-quality checks: [v2-nextjs/source/docs/ai-evals/README.md](./v2-nextjs/source/docs/ai-evals/README.md)
- [Next.js] Human review rubric for AI answers: [v2-nextjs/source/docs/ai-evals/HUMAN_RUBRIC.md](./v2-nextjs/source/docs/ai-evals/HUMAN_RUBRIC.md)
- [Next.js] Version 2 release archive: [v2-nextjs/releases](./v2-nextjs/releases/)
- [Next.js] Version 2 public source: [v2-nextjs/source](./v2-nextjs/source/)
- [Google Apps Script] Version 1 release archive: [v1-gas/releases](./v1-gas/releases/)
- Latest v1 deployment: [v1.4.1 deployment](https://script.google.com/macros/s/AKfycbxMCx13pkrSzFs8f2qXfmxy2LRhkBpZTItFTIfEOoOi-zwurbysnKGfDIYtAeEdQP99/exec)
- Latest v1 source: [v1-gas/current](./v1-gas/current/)

## v2.1.x AI quality improvements

The v2.1.x series improved the AI assistants in stages: completing answers, finding the right reference document, respecting the clinician's judgment, and avoiding storage of private information. These patches did not repeat the same work. Each subsequent patch addressed an issue found during actual use.

- **v2.1.2-v2.1.6:** organized answer length, interruption detection, conversation context, clinical limits, and automated quality criteria.
- **v2.1.7:** established consistent formats and public boundaries for README files, change records, and release notes.
- **v2.1.8:** reviewed the five-language reference library and rebuilt all material searched by the AI assistants.
- **v2.1.9:** made retrieval more reliable for short codes and multilingual questions.
- **v2.1.10:** corrected remaining Japanese code recognition, broad interpretation questions, and new-database setup.

The connected work from v2.1.8 through v2.1.10 is documented across the corresponding patch notes.

## v2.2.7

v2.2.7 is a bug-fix release that prevents three kinds of incomplete scoring-table input from passing into calculation. The standalone `S` was removed from the location options so that white-space responses are always recorded as `WS`, `DS`, or `DdS`; duplicate codes from the same movement family can no longer be entered for one response; and calculation can no longer run with blank Form Quality. In records where every response is pure form (`F`), Lambda is reported as the pure F count instead of the infinity symbol.

Existing protocols entered by the rules do not need to be recalculated. If an older autosave still contains one of these values, the app preserves the original, stops calculation, and identifies the rows to review in all five languages. The release also introduces a rule list that automatically checks whether the five-language reference documents state the same clinical rules. See the [v2.2.7 patch note](./v2-nextjs/releases/v2.2.7/README.en.md) for details.

## v2.2.6

v2.2.6 aligns the search title, description, canonical address, and alternate-language information of all five language versions with the language shown on screen. Queryless addresses now consistently use Korean, while the existing `?lang=pt` address is preserved and identified to search engines as Brazilian Portuguese with `pt-BR`.

It also fixes cases in some Windows browsers where `Alt+mouse wheel` on the scoring screen panned instead of zooming. Item names in the scoring-header explanations now use consistent brackets. Structural Summary formulas and results, scoring inputs, screen layout, the AI corpus, and assistant response rules are unchanged, so existing protocols do not need to be recalculated. See the [v2.2.6 patch note](./v2-nextjs/releases/v2.2.6/README.en.md) for details.

## v2.2.5

v2.2.5 separates movement determinant input for an individual response from the family totals shown in the Structural Summary. The scoring table no longer offers `M`, `FM`, or `m` without an active/passive suffix; complete codes such as `Ma`, `Mp`, and `Ma-p` are used instead. The `M`, `FM`, and `m` totals in the Structural Summary and calculations such as EB, MQual, and W:M remain unchanged.

Existing protocols that already use complete codes do not need to be recalculated. If an older browser autosave contains a movement code without its active/passive suffix, the app preserves the original entry, stops calculation, and identifies the row and code that need review. The release rechecked the five-language reference documents, 5,604 search vectors, 365 retrieval questions, and live GPT-5.5 boundary questions. See the [v2.2.5 patch note](./v2-nextjs/releases/v2.2.5/README.en.md) for the affected conditions and the hypothetical CDI boundary example.

## v2.2.4

v2.2.4 reorganized the human-readable reference documents and the material searched by the optional AI assistants without changing Structural Summary formulas or scoring-table input. Existing Structural Summary results do not need to be recalculated.

Terminology and prose in all five languages were checked against professional target-language sources, and page titles and document order were aligned with the actual coding and interpretation sequence. The release refreshed 1,015 reference documents and 5,589 search vectors, with 0 missing, stale, or content-hash-mismatched vectors. It also strengthened the assistants' Exner CS scope, prompt-injection refusal, and request limits, and passed 66 live GPT-5.5 single-turn and multi-turn scenarios across all five languages. See the [v2.2.4 patch note](./v2-nextjs/releases/v2.2.4/) for details and public evidence.

A follow-up also refined the scoring start-choice dialog, reference-document readability, and the coding assistant's scroll control.

## v2.2.3

v2.2.3 reorganized public documentation, five-language search and link-preview metadata, and protection against excessive writes to the AI response-feedback database without changing formulas or screen layout. Existing Structural Summary results do not need to be recalculated.

The search and sharing title is `Yes, U Can!` in every language. The localized description states that the open-source Exner Rorschach Comprehensive System Structural Summary calculator requires no registration, installation, or payment and does not replace professional clinical judgment. The like and dislike feedback mechanism continues to avoid storing conversation text while limiting request size and writes per session. See the [v2.2.3 patch note](./v2-nextjs/releases/v2.2.3/) for date normalization and security boundaries.

## v2.2.2

v2.2.2 rechecked the calculations that include and exclude Cn. In the conventional display label `FC:CF+C`, the right-hand value is `CF+C+Cn`, while this app excludes Cn from WSumC, S-CON criterion 7, and Color-Shading calculations. **The displayed Cn value for completed protocols was already correct in v2.2.1, so this point alone does not require recalculation.** The patch also prevents an unfinished row with blank Form Quality (FQ) from being provisionally classified as GHR or PHR.

The 2019 Excel workbook, the original RorScore program, v1 GAS, the current v2 code, CHESSSS, RAP3, and RIAP5 each cover different parts of the calculation, so no single source was treated as the sole answer. The release passed 376 calculation and feature checks, 101 AI-answer criteria, and 222 production-page builds. It also checked 10 direct Cn questions and 5 representative questions with live GPT-5.5 calls in all 5 languages. The only UI change was making the left sidebar fully opaque; mobile-specific refinement continues in later v2.2.x work.

## v2.2.1

v2.2.1 corrected calculations in the **Upper Section, Lower Section, and Special Indices** displayed by the app without changing the UI/UX or adding input fields. It corrected extreme D/AdjD values, EBPer display conditions, the ordered GHR/PHR rules, denominator handling when WDA% or Afr equals 0, and the Cn-inclusive right-hand value of `FC:CF+C`.

The release also disclosed for the first time the public location and role of the 2019 Excel workbook consulted during early v1 development. Verification included 25 calculations using the same codes with notes in different languages, 2,000 repeatable synthetic protocols, and live GPT-5.5 coding and interpretation calls.

## v2.2.0

v2.2.0 is the first v2.2.x release to gather the main desktop navigation in a left sidebar and reshape the interpretation assistant as a conventional AI conversation view. It also organized answer stopping, message copying and feedback, conversation scrolling, reference documents, the version archive, and scoring-table zooming and panning.

The GPT-5.5 assistants were restricted from expanding beyond the Exner Comprehensive System, and their behavior was checked with live Korean, Japanese, and English API calls. Calculation items identified during the v2.2.0 review were corrected in v2.2.1 and v2.2.2. Use v2.2.0 for the UI/UX record and the v2.2.2 calculation report for the current calculation basis. Mobile screens are refined separately in later v2.2.x work.

## [Next.js] Version 2 release history

- **[2026-07-23] v2.2.7 (bug-fix release)** [Patch note](./v2-nextjs/releases/v2.2.7/README.en.md) [Source](./v2-nextjs/source/)
- **[2026-07-20] v2.2.6 (bug-fix release)** [Patch note](./v2-nextjs/releases/v2.2.6/README.en.md) [Source](./v2-nextjs/source/)
- **[2026-07-19] v2.2.5 (bug-fix release)** [Patch note](./v2-nextjs/releases/v2.2.5/README.en.md) [Source](./v2-nextjs/source/)
- **[2026-07-18] v2.2.4 (bug-fix release)** [Patch note](./v2-nextjs/releases/v2.2.4/) [Source](./v2-nextjs/source/)
- **[2026-07-17] v2.2.3 (bug-fix release)** [Patch note](./v2-nextjs/releases/v2.2.3/) [Source](./v2-nextjs/source/)
- **[2026-07-16] v2.2.2 (hotfix)** [Patch note](./v2-nextjs/releases/v2.2.2/) [Source](./v2-nextjs/source/)
- **[2026-07-15] v2.2.1 (hotfix)** [Patch note](./v2-nextjs/releases/v2.2.1/) [Source](./v2-nextjs/source/)
- **[2026-07-14] v2.2.0 (minor release)** [Patch note](./v2-nextjs/releases/v2.2.0/) [Source](./v2-nextjs/source/)
- **[2026-07-13] v2.1.10 (bug-fix release)** [Patch note](./v2-nextjs/releases/v2.1.10/) [Source](./v2-nextjs/source/)
- **[2026-07-12] v2.1.9 (bug-fix release)** [Patch note](./v2-nextjs/releases/v2.1.9/) [Source](./v2-nextjs/source/)
- **[2026-07-11] v2.1.8 (bug-fix release)** [Patch note](./v2-nextjs/releases/v2.1.8/) [Source](./v2-nextjs/source/)
- **[2026-07-05] v2.1.7 (bug-fix release)** [Patch note](./v2-nextjs/releases/v2.1.7/) [Source](./v2-nextjs/source/)
- **[2026-07-04] v2.1.6 (bug-fix release)** [Patch note](./v2-nextjs/releases/v2.1.6/) [Source](./v2-nextjs/source/)
- **[2026-07-03] v2.1.5 (bug-fix release)** [Patch note](./v2-nextjs/releases/v2.1.5/) [Source](./v2-nextjs/source/)
- **[2026-07-02] v2.1.4 (bug-fix release)** [Patch note](./v2-nextjs/releases/v2.1.4/) [Source](./v2-nextjs/source/)
- **[2026-06-29] v2.1.3 (bug-fix release)** [Patch note](./v2-nextjs/releases/v2.1.3/) [Source](./v2-nextjs/source/)
- **[2026-06-28] v2.1.2 (bug-fix release)** [Patch note](./v2-nextjs/releases/v2.1.2/) [Source](./v2-nextjs/source/)
- **[2026-06-27] v2.1.1 (bug-fix release)** [Patch note](./v2-nextjs/releases/v2.1.1/) [Source](./v2-nextjs/source/)
- **[2026-06-22] v2.1.0 (minor release)** [Patch note](./v2-nextjs/releases/v2.1.0/) [Source](./v2-nextjs/source/)
- **[2026-06-11] v2.0.3 (bug-fix release)** [Patch note](./v2-nextjs/releases/v2.0.3/) [Source](./v2-nextjs/source/)
- **[2026-05-21] v2.0.2 (bug-fix release)** [Patch note](./v2-nextjs/releases/v2.0.2/) [Source](./v2-nextjs/source/)
- **[2026-04-27] v2.0.1 (bug-fix release)** [Patch note](./v2-nextjs/releases/v2.0.1/) [Source](./v2-nextjs/source/)
- **[2026-02-15] v2.0.0 (major release)** [Patch note](./v2-nextjs/releases/v2.0.0/) [Source](./v2-nextjs/source/)

<details>
<summary><strong>Run the v2 source locally</strong></summary>

1. Open [v2-nextjs/source](./v2-nextjs/source/).
2. Install dependencies with `npm install`.
3. Create a local environment file from `.env.example`.
4. Check the app with `npm run build` or `npm run dev`.

The public repository does not include production environment variables, Vercel settings, local logs, caches, private work notes, API keys, raw model answers, or private assessment payloads.

</details>

## Using the v1 GAS archive

1. Open the `patch note/source` link for the version you need.
2. In its `source/` directory, open `Code.gs`, `index.html`, and `styles.html`.
3. Create a Google Apps Script project, add files with the same names, and paste in the source.
4. Deploy it as a GAS web app, or open the release's `deployment link` to run that version directly.

## [Google Apps Script] Version 1 release history

- **[2026-01-07] v1.4.1 (bug-fix release)** [Deployment](https://script.google.com/macros/s/AKfycbxMCx13pkrSzFs8f2qXfmxy2LRhkBpZTItFTIfEOoOi-zwurbysnKGfDIYtAeEdQP99/exec) [Patch note/source](./v1-gas/releases/v1.4.1/)
- **[2026-01-03] v1.4.0 (minor release)** [Deployment](https://script.google.com/macros/s/AKfycbxWtI1q27rXuH4feBEGpoy0fIhXZU0ROJ2gRv5RbaQVPxnNgznTI9czHDrVzaS7wSMM/exec) [Patch note/source](./v1-gas/releases/v1.4.0/)
- **[2025-12-24] v1.3.3 (bug-fix release)** [Deployment](https://script.google.com/macros/s/AKfycbyMG31uNG0mPIdyrzQ_86CSuSaACpFoOqy-kZGXk0uV7L92jBFAJijt1kV6nLMzcO2N/exec) [Patch note/source](./v1-gas/releases/v1.3.3/)
- **[2025-11-27] v1.3.2 (bug-fix release)** [Deployment](https://script.google.com/macros/s/AKfycbxbuGLdEaj0mW6eIB5QHTax86b9FcKrsfLogy0wDLauJPwbbkQC5BHey0j_ERqXtVqE/exec) [Patch note/source](./v1-gas/releases/v1.3.2/)
- **[2025-11-26] v1.3.1 (bug-fix release)** [Deployment](https://script.google.com/macros/s/AKfycbwOQ61Y34-iVRKB0T3isOVRzFP9xhxtQMrLZoRvVbS6PwSfEaFYzWvjuTF8IItY2p-T/exec) [Patch note/source](./v1-gas/releases/v1.3.1/) [How-to video](https://youtu.be/GH145Wwh-YA)
- **[2025-11-25] v1.3.0 (minor release)** [Deployment](https://script.google.com/macros/s/AKfycbyethWbTOltcalcWo-kyXtunNSoJNMyKdKs_y7AYfV6bPE2R09ONcaCtDHSTvXTukE/exec) [Patch note/source](./v1-gas/releases/v1.3.0/)
- **[2025-11-21] v1.2.1 (bug-fix release)** [Deployment](https://script.google.com/macros/s/AKfycbw6n2R3LgAncLvoXmin89SodbHB6brREdaxFfK2yHADdZelEskafqLH35xL0LFvSqMv/exec) [Patch note/source](./v1-gas/releases/v1.2.1/)
- **[2025-11-20] v1.2.0 (minor release)** [Deployment](https://script.google.com/macros/s/AKfycbwD7zBLaAzC5r4VjH1yt7gxfG98vvBp4gsaC3VFQW0bCwe6MNfVXmR8LIjUEpIkTZTE/exec) [Patch note/source](./v1-gas/releases/v1.2.0/)
- **[2025-10-25] v1.1.2 (bug-fix release)** [Deployment](https://script.google.com/macros/s/AKfycbxn8zeFQalOvh-jnZ_-REjafG2kCT1RkjyJvUahtCkXVyn6PJs9xJLZ0basm5kKEO4j2A/exec) [Patch note/source](./v1-gas/releases/v1.1.2/)
- **[2025-10-24] v1.1.1 (bug-fix release)** [Deployment](https://script.google.com/macros/s/AKfycbw6XZZ7D3qiCeSsJPG6aj3DzMMPdA2p0kWhT8WU21WGVFqUltOmAXs3zOx4kXw2u5ul6Q/exec) [Patch note/source](./v1-gas/releases/v1.1.1/)
- **[2025-10-23] v1.1.0 (minor release)** [Deployment](https://script.google.com/macros/s/AKfycbw2J6gd4Sf_Tjx6s9GdQrWu4b_tOtqwFLtKJCs-vSFRR0c4NZ0Mlb5UFm7-V9zkBPzitg/exec) [Patch note/source](./v1-gas/releases/v1.1.0/)
- **[2025-10-20] v1.0.4 (hotfix)** [Deployment](https://script.google.com/macros/s/AKfycbw1GLfIvehoz4wAzC4LicjD_oB0Dpy_sLJ30da9qobx5X4wa3nJr0pLewV0lVPPv1ptGw/exec) [Patch note/source](./v1-gas/releases/v1.0.4/)
- **[2025-10-18] v1.0.3 (bug-fix release)** [Deployment](https://script.google.com/macros/s/AKfycbzoiaofs_I5Ue4p7Eo5XQp0OmUtmbbqkpJuwD-FQ1R4PLscULJB_AHVBb-VylICEKJB1A/exec) [Patch note/source](./v1-gas/releases/v1.0.3/)
- **[2025-10-19] v1.0.2 (hotfix)** [Deployment](https://script.google.com/macros/s/AKfycbwtBFge9jPS03Mz4QD5IlUDfHOetaVGsIe48y9dZESkfWtsJ-dnYv9S5iZ_4wxx4dCOUw/exec) [Patch note/source](./v1-gas/releases/v1.0.2/)
- **[2025-10-17] v1.0.1 (hotfix)** [Deployment](https://script.google.com/macros/s/AKfycbwNNeJsgRx0sEnZO4X9XxEUEthQlVS3Ttk6k_OSmIj8aTPlpdBQV1653hmBtzLnVX8Q/exec) [Patch note/source](./v1-gas/releases/v1.0.1/)
- **[2025-10-16] v1.0.0 (major release)** [Deployment](https://script.google.com/macros/s/AKfycbxYTxqKcmRNJhpE8eCGTBZPyUFVJIRQiUTbyW48lJKg2E7Bgc5RKSitdDTVcE3bzk07JA/exec) [Patch note/source](./v1-gas/releases/v1.0.0/)
