# Case 06 Fourth Run: Expense Approval Mini App

Date: 2026-06-19

## Case

`validation/cases/06-expense-approval-mini-app.md`

## Observed Behavior

The tested agent produced a feature spec only and did not start implementation.

## Result

Pass. No package updates required from this run.

## What Worked

- The agent followed the spec-first gate and waited for approval before implementation.
- The agent avoided the unrelated Next.js route-handler proxy convention in the API contract, while still calling out the conflict in Context.
- The agent kept manager submission out of scope.
- The agent kept manager visibility limited to pending expenses and kept broader history/detail visibility in Open Questions.
- The agent kept rejection reason out of the DTO and data model until approved.
- The agent rejected client-supplied identity and authority fields.
- The agent used a separate `AuditAction` enum instead of reusing the expense status enum.
- The agent required trusted auth context for identity and role.
- The agent flagged header-based auth stubs as dev/test-only residual risk.
- The agent specified conditional approve/reject transitions with a follow-up existence check for `404` vs `409`.
- The agent required same-transaction audit log creation only after a successful transition.
- The agent included unit, integration, API/e2e, frontend, and concurrency tests.

## Residual Notes

- The spec uses `422` for validation errors while earlier validation notes allowed `400`. This is an acceptable API style choice as long as the implementation and tests are consistent.
- The generated spec was seen in the agent output, but the file was not present in the test folder when this report was recorded. Treat this report as an external run observation rather than a copied artifact.

## Decision

No new guardrails are needed. The previous validation updates appear to be working.
