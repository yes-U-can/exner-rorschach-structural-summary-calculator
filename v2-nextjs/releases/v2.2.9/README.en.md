# [2026-08-01] v2.2.9 bug-fix release

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## Main changes

### [Card] sorting

The sort button in the [Card] header only applied ascending order. When the record was already arranged by card, clicking the button therefore appeared to do nothing.

The button now alternates between ascending and descending order. Its accessible name and icon indicate the direction that the next click will apply. Rows without a card remain at the end, and rows with the same card retain their existing order.

### Opening the Interpretation Assistant after starting an AI session

When [Interpretation Assistant] was selected from the scoring or reference-document page, starting an AI session with an API key left the user on the previous page instead of opening the assistant.

The app now opens the Interpretation Assistant after a session is started as part of that navigation and preserves the selected language. Starting a session from the general [Start AI session] button at the bottom of the sidebar still keeps the current page open.

### Latest-message button

In the Interpretation Assistant, the button shown while the reader is above the latest message now also indicates whether the AI is responding. Three vertically centered dots move in sequence while a response is being written. The down arrow returns after the response ends. Either state can be clicked to move to the latest message.

The dot motion is reduced when the operating system requests reduced motion.

### Helpful and unhelpful feedback

The selected state of the helpful and unhelpful buttons was too similar to their unselected state. The button background and border now retain their existing appearance, while only the selected thumb changes to a solid icon in the app's blue brand color. This makes the current choice easy to identify without introducing a new feedback color scheme.

The rating is saved as soon as either button is pressed. Choosing [Skip] in the optional reason dialog keeps the rating with no reason codes. Pressing the same selected button again deletes that rating from the server database and returns the button to its unselected state. The question and answer text are not sent to the feedback database.

### Public archive documentation

The archive dates for v1.0.2 and v1.0.3 are now aligned to the same Asia/Seoul date, 2025-10-18. Within that date, v1.0.3 is listed before v1.0.2.

Four-digit technical counts in public documents in all five languages are now written without a thousands separator, as in `5604`, `1015`, `5589`, and `2000`. This avoids ambiguity in Spanish and Portuguese, where a comma may be read as a decimal separator.

This documentation correction is included in v2.2.9. It does not alter the calculation code or deployed artifacts of earlier versions.

## Are existing calculation results affected?

No. This release does not change Structural Summary formulas, available input codes, reference-document content, or AI-answer rules. Existing protocols do not need to be recalculated.

## Testing and verification

- The complete automated suite passed 600 checks in 98 test files, with 7 checks skipped because their execution conditions were unavailable.
- An already sorted sample was checked directly as it changed from `I-X` to `X-I` and back to `I-X`.
- A local test session was started after selecting [Interpretation Assistant] from the scoring page, and the app was confirmed to open the assistant. The test key was removed immediately from the local session and was not sent to OpenAI.
- Automated checks cover the session destination in all five languages, keeping the current page after general session setup, the three streaming dots, and the idle down arrow.
- Automated checks also cover the selected feedback appearance, saving a rating with no reasons, and deleting the stored rating when the same button is pressed again.
- TypeScript validation and static analysis of the changed files passed.

Paid API calls were not run because this release does not change OpenAI response-generation behavior.

## Scope confirmed unchanged

- Structural Summary formulas and result fields are unchanged.
- Reference documents, vector embeddings, AI system prompts, and playbooks are unchanged.
- The existing policy of not storing scoring data or OpenAI API keys in the server database remains in place.

## Technical appendix

<details>
<summary><strong>Commands for reproducing the checks</strong></summary>

```bash
npm test
npm run lint
npx tsc --noEmit
```

</details>
