# State Transitions

## Purpose

Use explicit state transition rules for workflows such as approval, rejection, cancellation, publishing, payment, and finalization.

## Rules

- Define allowed source and target states.
- Reject invalid transitions with a clear error.
- Do not trust the client to tell the current state.
- Keep transition logic in the service/domain layer.
- Write audit logs in the same transaction as successful transitions.

## Conditional Update Pattern

For concurrent approve/reject style workflows, prefer a conditional update:

```text
update only where id = targetId and status = expectedCurrentStatus
```

If no row is updated:

- return `409 Conflict`
- do not create an audit log
- do not report success

Then create the audit log in the same transaction after the state transition succeeds.

## 404 vs 409

A conditional update that affects zero rows means the target either does not exist or exists but is not in the expected current state.

Choose one behavior explicitly:

- return a generic `409 Conflict` when hiding existence is acceptable
- run a safe follow-up existence check to map missing records to `404 Not Found` and invalid state to `409 Conflict`

Do not claim that a conditional update alone can distinguish both cases.

## Why Re-Fetch Alone Is Not Enough

Fetching a record inside a transaction and then updating it can still be fragile if two requests observe the same state before either transition commits.

Use one of:

- conditional update
- row lock
- serializable transaction

For Prisma applications, conditional update or `updateMany` with the expected current state is often the simplest pattern.

## Review Checklist

- Are allowed transitions explicit?
- Is the current state checked server-side?
- Is the update conditional on expected current state?
- Does invalid transition return 409?
- Is audit logging atomic with the successful transition?
- Are double-submit or race conditions tested?
