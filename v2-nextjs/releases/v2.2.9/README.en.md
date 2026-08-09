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

The rating is saved as soon as either button is pressed. Choosing [Skip] in the optional reason dialog keeps the rating with no reason. Pressing the same selected button again deletes the rating and returns the button to its unselected state. Question and answer text are not included in the feedback record.

## Are existing calculation results affected?

No. This release does not change Structural Summary formulas, available input codes, reference-document content, or AI-answer rules. Existing protocols do not need to be recalculated.
