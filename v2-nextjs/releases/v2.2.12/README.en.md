# [2026-09-01] v2.2.12 Bug-fix Release

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## This release

v2.2.12 starts using Vercel Web Analytics for cookie-free, anonymous, aggregated visitor statistics. It also fixes the scoring table shifting briefly after a refresh and adds the Seoul Institute of Clinical Psychology symbol, institute names, and website link to the top of the start dialog.

The scoring formulas, coding rules, and outputs have not changed. Existing protocols do not need to be recalculated.

## What changed?

Vercel Web Analytics is used to view anonymous, aggregated information such as pages visited, referral source, approximate country or region, browser, operating system, and device type.

Vercel Web Analytics does not use cookies to identify visitors or link activity across different days or websites.

The scoring table no longer appears briefly in a preliminary position before settling after a refresh. It is shown only after its final position has been determined.

The start dialog now shows the Seoul Institute of Clinical Psychology symbol and its Korean and English names. Selecting this brand area opens the institute website in a new tab.

## Who is affected?

This applies to everyone who visits the web app. Desktop users will especially notice that the scoring table remains visually stable after a refresh. The calculator and AI assistants work as before.

## Do existing results need to be recalculated?

No. The scoring formulas, coding rules, and outputs have not changed, so existing protocols do not need to be recalculated.

## Privacy and clinical limitations

Structural Summary inputs, calculation results, AI chat content, and API keys are not included in visitor statistics. Only visitor statistics and on-screen presentation have changed; calculations and clinical judgment are unaffected.

This service does not replace professional clinical judgment.
