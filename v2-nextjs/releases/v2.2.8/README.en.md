# [2026-07-31] v2.2.8 bug-fix release

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## Main changes

### Overview

This release fixes a problem in which entering the same Content code twice in one response caused that code to be counted twice. For example, entering `Bt` in two slots could inflate the numerator of the Isolation Index and, in a boundary record, could also change the CDI result. Once a Content code is selected, it can no longer be selected again in another slot of the same response. If a duplicate remains in an older autosave, the app preserves the original data, stops calculation, and identifies the row that needs review.

Desktop and mobile now handle Level 1 and Level 2 conflicts in the `DV`, `DR`, `INCOM`, and `FABCOM` families in the same way. The newly selected code is retained. If both levels are already present in older saved data, Level 1 is retained and the clinician is asked to review the original material. The correct level must be determined from that material. No blank Special Score is stored in the slot from which the conflicting code was removed.

This release does not change the Structural Summary formulas. Existing protocols entered according to the scoring rules do not need to be recalculated. Only records that meet a condition listed under “Which records can be affected?” require review against the original material and recalculation.

### Autosave and input data

- Opening the sample data no longer overwrites an existing autosave.
- The most recent edit is saved even when the screen is closed or the user moves to another page immediately after editing.
- Damaged or excessively large autosave data is not restored as a valid record.
- Unknown Z codes and Z scores that do not belong to the selected card are blocked before calculation.
- CSV filenames use the device's local date. Exported files are safer to open in spreadsheet software, while clinically valid values and scoring codes keep their original values.

### S-CON and reference documents

The S-CON reference document in all five languages now states all 12 criteria and the `8 or more` decision boundary. As before, the calculator counts the 12 criteria, checks the result at 8 or more, and displays the notice that S-CON applies to examinees aged 15 or older. No age field has been added; clinicians remain responsible for deciding whether the age condition applies.

When age has not been provided in an S-CON question, the AI interpretation assistant now reports the number of criteria met and asks for the exact age. It must not declare S-CON positive or negative or produce report-ready wording without that information.

### AI assistants and feedback privacy

- When AI connection or chat requests are repeated excessively, the app asks the user to wait briefly.
- Throughout an ongoing conversation, the assistant does not answer requests to disclose non-public information and provides emergency-help guidance for crisis-related language.
- AI-answer feedback does not store conversation text or IP addresses and is retained for no more than 180 days.

## Which records can be affected?

Existing Structural Summary results do not need to be recalculated unless one of these conditions applies:

1. The same Content code was entered more than once in a single response.
2. Desktop and mobile stored different Level 1 and Level 2 Special Score values.
3. An unsupported Z code or a Z score that does not belong to the card remains in imported data or an older autosave.
4. A record entered on the mobile interface contains only formless determinants such as `C`, `C'`, `T`, `V`, `Y`, or `Cn`, but [FQ] was stored as a value other than `none`.

For an affected record, review the original response material, correct the duplicate or invalid code, and recalculate. The app does not replace the clinician's coding judgment.

## Interface, privacy, and calculation scope

- No new screen or age field was added.
- A Content code already selected in one slot is disabled in the other slots, and invalid saved data receives an explanation in all five languages.
- Unselected Structural Summary result tabs now have a subtle border, making them easier to distinguish from the current tab. In the S-CON, DEPI, CDI, and HVI cards, the summary checkbox and its first line of text are vertically centered.
- The calculation formulas and Structural Summary result sections were not changed.
- Autosaved scoring data remains on the user's device. An API key is used in encrypted form for an AI connection for up to 24 hours and is deleted when the connection ends.
- Feedback records only predefined reasons and aggregate information, not conversation text or raw IP addresses.

## Clinical considerations

The existing criteria apply when the same Special Score without a Level 1 or Level 2 distinction is repeated and when FQ is determined for formless determinants. Level 1 and Level 2 conflicts are handled consistently on desktop and mobile.

The AI assistants do not guarantee the accuracy of every clinical answer. Clinicians remain responsible for final interpretation and for deciding whether the S-CON age condition applies.
