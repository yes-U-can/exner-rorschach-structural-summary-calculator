# Exner Rorschach Structural Summary Calculator

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

This is the public source and release archive for the `Exner Rorschach Comprehensive System Structural Summary Calculator`. Reference-grounded AI assistants are available as optional features.

This repository publishes the patch notes and source code for released versions. v1 is preserved as a Google Apps Script web app, and v2 as the current version 2 web app.

MOW plans, builds, deploys, operates, and maintains the web app. The Seoul Institute of Clinical Psychology (SICP) contributes to checking the initial calculation results and reviewing the app from the perspective of real clinical use.

Credits and the early learning references are documented in [ACKNOWLEDGEMENTS.md](./ACKNOWLEDGEMENTS.en.md).

## Documentation and languages

Each patch note explains what changed, the conditions that may be affected, whether existing results need to be recalculated, and the calculation sources.

- Public guides and patch notes are accompanied by [English](./README.en.md), [日本語](./README.ja.md), [Español](./README.es.md), and [Português (Brasil)](./README.pt-BR.md) versions.
- The web app supports 5 interface languages: Korean, English, Japanese, Spanish, and Portuguese.

## What is available

- [v2] Live web app: [exner.yesucan.co.kr](https://exner.yesucan.co.kr)
- [v2] Latest version 2 release: [v2-nextjs/releases/v2.2.12](./v2-nextjs/releases/v2.2.12/README.en.md)
- [v2] v2.2.10 calculation sources and literature scope: [calculation sources and literature scope](./v2-nextjs/methodology/reference-audit-v2.2.10/README.en.md)
- [v2] Version 2 release archive: [v2-nextjs/releases](./v2-nextjs/releases/)
- [v2] Version 2 public source: [v2-nextjs/source](./v2-nextjs/source/)
- [Google Apps Script] Version 1 release archive: [v1-gas/releases](./v1-gas/releases/)
- Latest v1 deployment: [v1.4.1 deployment](https://script.google.com/macros/s/AKfycbxMCx13pkrSzFs8f2qXfmxy2LRhkBpZTItFTIfEOoOi-zwurbysnKGfDIYtAeEdQP99/exec)
- Latest v1 source: [v1-gas/current](./v1-gas/current/)

## v2.2.12

v2.2.12 starts using Vercel Web Analytics for cookie-free, anonymous, aggregated visitor statistics. It also fixes the scoring table shifting briefly after a refresh and adds the Seoul Institute of Clinical Psychology symbol, institute names, and website link to the top of the start dialog.

Structural Summary inputs, calculation results, AI chat content, and API keys are not included in visitor statistics. The scoring formulas, coding rules, and outputs have not changed, so existing protocols do not need to be recalculated. See the [v2.2.12 patch note](./v2-nextjs/releases/v2.2.12/README.en.md) for details.

## v2.2.11

v2.2.11 adjusts the calculation start rule so that a record with R of 10–13 can be calculated after the existing validity warning when cards I–X have all been entered. When cards I–X have all been entered and R is 14 or more, calculation proceeds as before. If any card is missing, calculation does not proceed regardless of the response count, and the missing cards are identified.

The Spanish name is standardized as Sumario Estructural and the Portuguese name as Sumário Estrutural. The service name Yes, U Can! remains unchanged, while the Korean search description states the free-use information more clearly.

The formulas, calculated values, and privacy handling have not changed. Existing protocols do not need to be recalculated. Records with a low response count should be used for study and review while considering the displayed validity warning and clinical limitations.

## v2.2.10

v2.2.10 restores the missing `GHR:PHR` ratio to the Lower Section on screen and in the PDF, following the original Structural Summary layout. It also organizes the ordinary Lower Section PDF tables and the Special Indices decision display. GHR and PHR were already classified and totaled, so existing protocols do not need to be recalculated.

Calculations follow the printed pages of the Exner Comprehensive System Volume 1, 4th edition, and Workbook, 5th edition. Rules from R-PAS and other Rorschach systems are not mixed into Exner Comprehensive System calculations. v2.2.10 does not change any formula or decision rule.

The Interpersonal references in all five languages now explain `GHR:PHR`. The AI assistants also keep their answers within the Exner Comprehensive System. Publications, editions, printed pages, source roles, and remaining limitations are listed in the [v2.2.10 patch note](./v2-nextjs/releases/v2.2.10/README.en.md) and [calculation sources and literature scope](./v2-nextjs/methodology/reference-audit-v2.2.10/README.en.md).

## v2.2.9

v2.2.9 is a bug-fix release that makes the [Card] sort button alternate between ascending and descending order and opens the intended Interpretation Assistant after an AI session is started during navigation. In the Interpretation Assistant, the button shown while the reader is above the latest message now displays either three dots or a down arrow according to the AI response state. Selecting helpful or unhelpful feedback leaves the button background unchanged and turns only the thumb into a solid icon in the app's blue brand color. Feedback can be saved without a reason, and selecting the same rating again removes it.

Structural Summary formulas and AI-answer rules are unchanged, so existing protocols do not need to be recalculated. See the [v2.2.9 patch note](./v2-nextjs/releases/v2.2.9/README.en.md) for details.

## v2.2.8

v2.2.8 is a bug-fix release that prevents the same Content code from being counted twice in one response and makes desktop and mobile handle response codes in the same way. Sample data no longer overwrites an existing autosave, the latest edit is saved, and damaged autosave data is not restored.

The Structural Summary formulas did not change. Existing protocols entered according to the rules do not need to be recalculated. Review the original material and recalculate only when a record contains a duplicate Content code in one response; desktop and mobile stored different Level 1 or Level 2 Special Score values; the mobile interface stored only formless determinants (`C`, `C'`, `T`, `V`, `Y`, or `Cn`) with an [FQ] value other than `none`; or an unsupported Z code or a Z score that does not belong to the card remains in the record. The S-CON documents and AI-answer rules now state all 12 criteria and the 8-criterion boundary in all five languages; no age field was added. See the [v2.2.8 patch note](./v2-nextjs/releases/v2.2.8/README.en.md) for details.

## v2.2.7

v2.2.7 is a bug-fix release that prevents three kinds of incomplete scoring-table input from passing into calculation. The standalone `S` was removed from the location options so that white-space responses are always recorded as `WS`, `DS`, or `DdS`; the same determinant or duplicate codes from the same movement family can no longer be entered for one response; and calculation can no longer run with blank Form Quality. In records where every response is pure form (`F`), Lambda is reported as the pure F count instead of the infinity symbol.

Existing protocols entered by the rules do not need to be recalculated. If an older autosave still contains one of these values, the app preserves the original, stops calculation, and identifies the rows to review in all five languages. See the [v2.2.7 patch note](./v2-nextjs/releases/v2.2.7/README.en.md) for details.

## v2.2.6

v2.2.6 makes each language page show the correct localized title and description in search results and shared links. Existing bookmarks and external links remain valid.

It also fixes cases in some Windows browsers where `Alt+mouse wheel` on the scoring screen panned instead of zooming. Item names in the scoring-header explanations now use consistent brackets. Structural Summary formulas and results, scoring inputs, screen layout, reference search, and AI-answer behavior are unchanged, so existing protocols do not need to be recalculated. See the [v2.2.6 patch note](./v2-nextjs/releases/v2.2.6/README.en.md) for details.

## v2.2.5

Starting with v2.2.5, the scoring table no longer offers `M`, `FM`, or `m` without an active/passive suffix; complete codes such as `Ma`, `Mp`, and `Ma-p` are used instead. The `M`, `FM`, and `m` totals in the Structural Summary and calculations such as EB, MQual, and W:M remain unchanged.

Existing protocols that already use complete codes do not need to be recalculated. If an older browser autosave contains a movement code without its active/passive suffix, the app preserves the original entry, stops calculation, and identifies the row and code that need review. The five-language references and AI assistants explain the same input boundary. See the [v2.2.5 patch note](./v2-nextjs/releases/v2.2.5/README.en.md) for the affected conditions and the hypothetical CDI boundary example.

## v2.2.4

v2.2.4 improves the reference documents and the optional AI assistants' search and safety behavior without changing Structural Summary formulas or scoring-table input. Existing Structural Summary results do not need to be recalculated.

The five-language references use professional terminology for each language, and their page titles and order follow the coding and interpretation sequence. The Coding and Interpretation Assistants do not answer questions outside Exner CS or requests for non-public information, and ask users to wait when requests are repeated excessively. See the [v2.2.4 patch note](./v2-nextjs/releases/v2.2.4/) for details.

The scoring start-choice dialog, reference-document readability, and the coding assistant's scroll control were also refined.

## v2.2.3

v2.2.3 improves five-language search and link-preview information and protection against excessive AI-response feedback requests without changing formulas or screen layout. Existing Structural Summary results do not need to be recalculated.

The search and sharing title is `Yes, U Can!` in every language. The localized description states that the open-source Exner Rorschach Comprehensive System Structural Summary calculator requires no registration, installation, or payment and does not replace professional clinical judgment. Like and dislike feedback does not store conversation text and rejects submissions that are excessively large or frequent. See the [v2.2.3 patch note](./v2-nextjs/releases/v2.2.3/) for the changes and privacy details.

## v2.2.2

v2.2.2 corrects the boundary between calculations that include Cn and those that exclude it. In the conventional display label `FC:CF+C`, the right-hand value is `CF+C+Cn`, while this app excludes Cn from WSumC, S-CON criterion 7, and Color-Shading calculations. **The displayed Cn value for completed protocols was already correct in v2.2.1, so this point alone does not require recalculation.** The patch also prevents an unfinished row with blank Form Quality (FQ) from being provisionally classified as GHR or PHR.

Each index follows its definition in the Exner Comprehensive System; notation and behavior from other programs or systems are not mixed into the calculation. The left sidebar is now fully opaque.

## v2.2.1

v2.2.1 corrected calculations in the **Upper Section, Lower Section, and Special Indices** displayed by the app without changing the screen or adding input fields. It corrected extreme D/AdjD values, EBPer display conditions, the ordered GHR/PHR rules, denominator handling when WDA% or Afr equals 0, and the Cn-inclusive right-hand value of `FC:CF+C`.

The calculation boundaries follow Exner Comprehensive System rules and completed Structural Summary examples.

## v2.2.0

v2.2.0 is the first v2.2.x release to gather the main desktop navigation in a left sidebar and reshape the interpretation assistant as a conventional AI conversation view. It also organized answer stopping, message copying and feedback, conversation scrolling, reference documents, the version archive, and scoring-table zooming and panning.

The AI assistants were restricted from expanding beyond the Exner Comprehensive System. The D/AdjD, EBPer, GHR/PHR, and Cn-boundary corrections released in v2.2.1 and v2.2.2 are included in the current version.

## [v2] Version 2 release history

- **[2026-08-21] v2.2.11 (bug-fix release)** [Patch note](./v2-nextjs/releases/v2.2.11/README.en.md) [Source](./v2-nextjs/source/)
- **[2026-08-08] v2.2.10 (bug-fix release)** [Patch note](./v2-nextjs/releases/v2.2.10/README.en.md) [Source](./v2-nextjs/source/)
- **[2026-08-01] v2.2.9 (bug-fix release)** [Patch note](./v2-nextjs/releases/v2.2.9/README.en.md) [Source](./v2-nextjs/source/)
- **[2026-07-31] v2.2.8 (bug-fix release)** [Patch note](./v2-nextjs/releases/v2.2.8/README.en.md) [Source](./v2-nextjs/source/)
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
- **[2025-10-18] v1.0.2 (hotfix)** [Deployment](https://script.google.com/macros/s/AKfycbwtBFge9jPS03Mz4QD5IlUDfHOetaVGsIe48y9dZESkfWtsJ-dnYv9S5iZ_4wxx4dCOUw/exec) [Patch note/source](./v1-gas/releases/v1.0.2/)
- **[2025-10-17] v1.0.1 (hotfix)** [Deployment](https://script.google.com/macros/s/AKfycbwNNeJsgRx0sEnZO4X9XxEUEthQlVS3Ttk6k_OSmIj8aTPlpdBQV1653hmBtzLnVX8Q/exec) [Patch note/source](./v1-gas/releases/v1.0.1/)
- **[2025-10-16] v1.0.0 (major release)** [Deployment](https://script.google.com/macros/s/AKfycbxYTxqKcmRNJhpE8eCGTBZPyUFVJIRQiUTbyW48lJKg2E7Bgc5RKSitdDTVcE3bzk07JA/exec) [Patch note/source](./v1-gas/releases/v1.0.0/)
