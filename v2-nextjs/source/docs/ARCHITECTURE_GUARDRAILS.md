# Architecture Guardrails

Status: Active  
Owner: Product + Engineering  
Last Updated: 2026-03-03

## Purpose

This document defines non-negotiable rules for building and operating this product with AI assistants.
If a future change conflicts with these guardrails, create/update an ADR first.

## Non-Negotiable Rules

1. AI is an assistive tool, not a diagnostic authority.
2. Final responsibility belongs to a human user.
3. Admin must not read raw end-user chat content by default.
4. Internal endpoints must be fail-closed:
   - missing secret/config => deny request
5. Authorization is strict:
   - users can access only their own data
6. Collect minimum data needed for operation and audit.
7. Log metadata for traceability, not raw sensitive payloads.
8. Safety interventions must be explicit and logged.
9. BYOK keys must be encrypted at rest, decrypted only immediately before provider calls, and never decrypted for status checks.
10. AI chat message bodies must not be retained as account history; use browser-session ephemeral context only.
11. Any exception to these rules requires an ADR and explicit approval.

## Security and Privacy Baseline

1. No secrets in source code, commits, PR comments, or screenshots.
2. No `.env*` files tracked by git.
3. Secrets must be managed via environment variables (Vercel/Neon/local env).
4. Production and development databases must stay separated.
5. Role-based access control (RBAC) is required for all admin APIs/pages.

## AI-Audit Baseline (No Raw Chat)

Required logging fields per AI response flow:

1. `userId` (or pseudonymous user id)
2. `userRole`
3. `provider`, `modelId`
4. `billingMode` (`byok`)
5. `systemPromptVersion`
6. `retrievedDocIds` (or doc slugs)
7. `inputTokenEstimate`, `outputTokenEstimate`
8. `streamStatus` and failure/partial status metadata
9. `autoRiskFlag` (level + type)
10. `interventionTriggered` (boolean + reason)
11. `createdAt`

## Engineering Workflow Guardrails

1. Every PR must include:
   - threat/abuse impact check
   - privacy impact check
   - tests for new auth/validation logic
2. Any schema change must include:
   - migration
   - rollback note
   - data backfill plan (if needed)
3. Any prompt/RAG behavior change must include:
   - prompt version bump
   - measurable metric impact hypothesis
4. Any AI assistant behavior change must pass the AI quality gates:
   - static contracts: `npm run ai:evaluate-contracts`
   - saved eval artifact audit: `npm run ai:evaluate-artifacts`
   - human rubric review for release-candidate answer samples when clinical usefulness is being claimed
5. Public showcase documentation must follow `docs/ops/PUBLIC_RELEASE_DOCUMENTATION.md`.
6. Public release evidence must summarize process and metadata, not raw prompts, raw model answers, private assessment payloads, API keys, or local runtime logs.

## AI Collaboration Contract

When using AI coding assistants:

1. Do not ask the assistant to weaken auth/privacy checks "for speed".
2. Ask for explicit tradeoffs and failure modes.
3. Require file-level references and test impact in every implementation summary.
4. If policy ambiguity exists, the assistant must stop and request policy clarification.

## AI Chat Architecture Guardrail

Reference:

1. `docs/AI_SYSTEM_MASTERPLAN.md`

Additional non-negotiable rules for AI chat implementation:

1. No hidden behavioral prompt layer outside the public `SICP note`.
2. `SICP note` must always apply and must remain user-visible in read-only form.
3. User interpretation notes may be added only as browser-session ephemeral chat context, not as durable account history.
4. Builtin reference docs remain the builtin RAG corpus.
5. Locale is a RAG corpus boundary, not just a UI translation setting.
6. Coding assist must support human reasoning, not silently replace it.
7. Coding-assist ephemeral context must stay separated from interpretation ephemeral context.
