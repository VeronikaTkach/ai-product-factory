# Case 06 Third Run: Expense Approval Mini App

Date: 2026-06-19

## Case

`validation/cases/06-expense-approval-mini-app.md`

## Observed Behavior

The tested agent produced a feature spec first and incorporated the latest read-visibility guardrail.

## Result

Pass with two scope-contract improvements recommended.

## What Worked

- The agent did not start coding.
- The agent kept manager expense submission out of scope.
- The agent kept manager visibility limited to pending expenses and put broader manager history/detail access in Open Questions.
- The agent rejected client-supplied identity and authority fields.
- The agent required trusted auth context for identity and role.
- The agent flagged header-based auth stubs as dev/test-only residual risk.
- The agent used conditional update plus explicit existence check for `404` vs `409`.
- The agent required same-transaction audit logs after successful approve/reject.

## Issues Found

### P2: Unrelated route-handler convention entered the API contract

The spec added a Next.js-style route-handler proxy convention even though the case states React + NestJS + Axios. If a repository-level instruction conflicts with the stated stack, the conflict should be called out in Context or Open Questions, not embedded into the API contract.

### P2: Open Question fields entered the contract

The spec listed rejection reason as an Open Question but also added optional `reason` to the reject request and audit model. Unresolved questions should not become API or data model commitments before approval.

### P3: Audit action reused status semantics

The audit model used a status-like enum for `action`. That is implementation-adjacent, but audit actions and resource statuses should be modeled separately when they represent different concepts.

## Package Updates

- Added spec guidance to keep unresolved Open Questions out of API contracts and data models.
- Added spec guidance not to import unrelated project conventions or proxy layers into the contract.
- Added database guidance to avoid reusing status enums for audit actions.
- Added validation expectations for route/proxy convention drift and Open Question contract drift.
