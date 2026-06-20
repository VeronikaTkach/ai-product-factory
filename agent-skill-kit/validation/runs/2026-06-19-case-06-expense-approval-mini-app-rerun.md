# Case 06 Rerun: Expense Approval Mini App

Date: 2026-06-19

## Case

`validation/cases/06-expense-approval-mini-app.md`

## Observed Behavior

The tested agent followed the expected project-local skill flow and produced a feature spec before implementation.

## Result

Pass with one important authorization-scope improvement recommended.

## What Worked

- The agent did not start coding.
- The agent produced a feature spec first and waited for approval.
- The agent rejected client-supplied `employeeId`, `status`, and `role` instead of silently ignoring them.
- The agent kept `POST /expenses` employee-only and put manager self-submission into Open Questions.
- The agent flagged header-based auth stubs as dev/test-only and residual risk.
- The agent required trusted auth context for identity and role.
- The agent used a conditional update plus follow-up existence check for approve/reject `404` vs `409`.
- The agent required same-transaction audit log creation after successful finalization.
- The agent proposed validation, authorization, audit, and concurrency tests.

## Issues Found

### P2: Manager detail visibility was broadened

The task says managers can see pending expenses from all employees. The agent assumed managers can also view a single expense by ID even when it is not pending, describing this as needed for review history.

That may be a reasonable product feature, but it is broader read access than the task granted. It should be placed in Open Questions unless the user explicitly approves manager history visibility.

## Package Updates

- Added a spec reference reminder not to broaden detail-view visibility from list-view wording.
- Added security review guidance to check list-view and detail-view visibility separately.
- Added validation case expectations that manager read visibility must not expand from pending expenses to all expenses without an Open Question.
