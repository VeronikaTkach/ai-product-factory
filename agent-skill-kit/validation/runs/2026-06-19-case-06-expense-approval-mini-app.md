# Case 06 Run: Expense Approval Mini App

Date: 2026-06-19

## Case

`validation/cases/06-expense-approval-mini-app.md`

## Observed Behavior

The tested agent first attempted to invoke `spec-driven-development` as a registered harness skill. The harness returned:

```text
Unknown skill: spec-driven-development
```

The agent then correctly treated it as a project-local skill, read the local skill files directly, and followed their guidance.

## Result

Pass with small package improvements recommended.

## What Worked

- The agent did not start coding.
- The agent produced a feature spec first.
- The agent did not broaden employee submit permission to managers.
- The agent put manager self-submission into Open Questions instead of assuming it.
- The agent flagged header-based auth as dev/test-only and residual risk.
- The agent required trusted auth context for identity.
- The agent identified approve/reject as manager-only.
- The agent required audit logs for successful approve/reject.
- The agent specified a conditional state transition pattern for concurrent finalization safety.
- The agent proposed tests for validation, authorization, audit logs, and double-finalization.

## Issues Found

### P2: Project-local skills need clearer guidance

The agent recovered from the unknown native skill error, but the package should explicitly say these skills are project-local files unless installed into a native skill registry.

### P2: Client-supplied identity fields should usually be rejected

The spec says a body-supplied `employeeId` is ignored. That protects ownership, but rejecting forbidden authority fields is a stronger API contract and a clearer signal to malicious or confused clients.

### P3: 404 vs 409 with conditional update needs an explicit decision

A conditional update returning zero rows cannot distinguish "not found" from "not pending" without a follow-up existence check.
