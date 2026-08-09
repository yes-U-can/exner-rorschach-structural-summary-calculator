# [2026-07-20] v2.2.6 Bug-Fix Release

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## Main changes

### Overview

This patch fixes cases where search engines and link previews received language information that did not match the visible page. It also corrects a scoring-screen problem in which `Alt+mouse wheel` zoom could be interpreted as panning in some Windows browsers.

In the explanations shown when [Score] and [G/PHR] headers are hovered, related field names now use one consistent bracketed style: [Card], [Z], [Contents], [Determinants], [FQ], and [Special Score].

The patch does not change Structural Summary formulas, scoring inputs, screen layout, or the response rules used by the optional AI assistants. Existing protocols do not need to be recalculated.

### Five-language search information

Each language page now shows the correct localized title and description in search results and shared links. Existing bookmarks and external links remain valid.

### Scoring-screen zoom

In affected Windows browsers, `Alt+mouse wheel` now zooms the scoring screen instead of panning it.

The existing `Ctrl+mouse wheel` behavior for browser-level zoom remains available. The scoring screen's minimum and maximum scale, pointer-centered zoom, and movement margins are unchanged.

## Interface, privacy, and calculation scope

- No new screen or input field was added.
- Visible menus and layout were not changed.
- Only the wording in the scoring-header explanations was standardized.
- Structural Summary formulas and results were not changed.
- No new personal information is collected.
- Autosaved scoring data remains on the user's device. An API key is used in encrypted form for an AI connection for up to 24 hours and is deleted when the connection ends.
- Reference search and the Coding and Interpretation Assistant response rules were not changed.
