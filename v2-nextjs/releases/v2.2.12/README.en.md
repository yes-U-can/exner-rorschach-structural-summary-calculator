# [2026-09-01] v2.2.12 Bug-fix Release

[한국어](./README.md) | [English](./README.en.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português (Brasil)](./README.pt-BR.md)

## This release

v2.2.12 changes visitor statistics to a cookie-free, anonymous, and aggregated approach. Structural Summary inputs, calculation results, AI chat content, and API keys are not included in visitor statistics.

The scoring formulas and outputs have not changed. Existing protocols do not need to be recalculated.

## What changed?

New visits are no longer measured with Google Analytics. Vercel Web Analytics is now used to view anonymous, aggregated information such as pages visited, referral source, approximate country or region, browser, operating system, and device type.

Vercel Web Analytics does not use cookies to identify visitors or link activity across different days or websites.

## Who is affected?

This applies to everyone who visits the web app. There is nothing to configure or select in a consent dialog. The calculator and AI assistants work as before.

## Do existing results need to be recalculated?

No. The scoring formulas, coding rules, and outputs have not changed, so existing protocols do not need to be recalculated.

## Privacy and clinical limitations

Structural Summary inputs, calculation results, AI chat content, and API keys are not included in visitor statistics. This change applies only to how general visit patterns are measured and does not affect calculations or clinical judgment.

This service does not replace professional clinical judgment.
