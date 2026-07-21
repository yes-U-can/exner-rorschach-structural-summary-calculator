# [2026-07-20] v2.2.6 Bug-Fix Release

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## Main changes

### Overview

This patch fixes cases where search engines and link previews received language information that did not match the visible page. It also corrects a scoring-screen problem in which `Alt+mouse wheel` zoom could be interpreted as panning in some Windows browser input paths.

In the explanations shown when [Score] and [G/PHR] headers are hovered, related field names now use one consistent bracketed style: [Card], [Z], [Contents], [Determinants], [FQ], and [Special Score].

The patch does not change Structural Summary formulas, scoring inputs, screen layout, or the response rules used by the optional AI assistants. Existing protocols do not need to be recalculated.

### Five-language search information

The default address without a language parameter is the Korean page. On the default addresses for About, Terms, Privacy, Reference Documents, and Version Archive, however, the visible page could be Korean while the search title and canonical address were emitted as English. The visible language, search title, description, and canonical address now agree on Korean.

Brazilian Portuguese pages keep the existing `?lang=pt` address so bookmarks and outside links remain valid. The language tag supplied to search engines and assistive technology is now the more accurate `pt-BR`.

Every indexable page now supplies the following information under the same rule:

- its own canonical address
- Korean, English, Japanese, Spanish, and Brazilian Portuguese alternate addresses
- the Korean default address used when no language is selected
- localized titles, descriptions, and preview images for search and link sharing

Existing bookmarks and external links are unchanged.

### Scoring-screen zoom

In some Windows browsers, the wheel event did not fully preserve the fact that `Alt` was being held. The scoring screen could therefore pan instead of zooming. The app now also tracks the keyboard's `Alt` state and gives zoom priority over panning.

The existing `Ctrl+mouse wheel` behavior for browser-level zoom remains available. The scoring screen's minimum and maximum scale, pointer-centered zoom, and movement margins are unchanged.

## Testing and verification

- Queryless public pages were checked to ensure that they emit Korean titles, descriptions, and canonical addresses.
- Every indexable URL in all five languages was checked for a self-canonical address, the four other localized alternatives, and the Korean default address.
- Page language, alternate links, sitemap entries, and structured data were checked for consistent `pt-BR` tagging on Brazilian Portuguese pages.
- The existing exclusion of AI-only and API routes from search indexing was rechecked.
- Separate event cases for `Alt`, the Windows alternate-input state, and `Ctrl` were used to confirm that scoring-screen zoom and browser zoom do not take over each other's controls.
- All five tooltip locales were checked to ensure that referenced scoring fields use the same bracketed style.
- The full automated suite passed 458 checks across 82 test files; 7 checks were skipped because their run conditions were unavailable. The production build, static code checks, five-language copy audit, and secret and dependency audits also passed.

Automated checks verify metadata and input-event rules. The time at which search results change still depends on each search engine's recrawl schedule, and the physical keyboard and mouse interaction is also checked on the deployed page.

## UI/UX, privacy, and calculation scope

- No new screen or input field was added.
- Visible menus and layout were not changed.
- Only the wording in the scoring-header explanations was standardized.
- Structural Summary formulas and results were not changed.
- No new personal information is collected.
- The existing rule that scoring data and OpenAI API keys are not stored in the server database remains unchanged.
- The AI corpus, embeddings, and Coding and Interpretation Assistant response rules were not changed.

## Public scope and security boundary

The public source includes localized search metadata, canonical and alternate-language addresses, the sitemap, scoring-screen zoom handling, and the related automated checks.

Environment variables, API keys, private deployment settings, local paths, and internal work records are not published.

## Technical appendix

<details>
<summary><strong>Commands for developers to repeat the checks</strong></summary>

```bash
npm test
npm run lint
npm run build
npm run security:check
```

</details>
