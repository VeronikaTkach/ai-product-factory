# Spec Structure

## Goal

State the outcome in one or two concrete sentences.

Good:

- "Allow authenticated users to create draft orders from selected cart items."

Weak:

- "Make ordering better."

## Context

Include:

- why the feature matters
- who uses it
- related systems
- current behavior
- constraints

## Scope

List what is included.

Use specific nouns:

- pages
- endpoints
- tables
- jobs
- permissions
- integrations

## Non-Goals

List what is intentionally excluded.

This prevents the agent from expanding the work.

## Assumptions

Use assumptions when reasonable progress is possible without blocking the user.

Ask questions only when an assumption would be risky or likely wrong.

Do not use assumptions to broaden authority.

Examples:

- If the user says "employee can submit", do not assume managers can submit too.
- If the user says "manager can approve", do not assume admins, owners, or agents can approve.
- If the user says "managers can see pending records", do not assume managers can view finalized records through a detail endpoint.
- Put broader role behavior in Open Questions unless explicitly requested.
- For write APIs, do not quietly accept client-supplied identity or authority fields. Fields such as `employeeId`, `managerId`, `actorId`, `role`, and `status` should usually be omitted from request DTOs and rejected when supplied.
- Keep unresolved Open Questions out of the main API contract and data model. For example, if rejection reasons are undecided, do not add `reason` to the request DTO or audit table yet.

## User Stories

Use:

```text
As a [actor], I want [capability], so that [outcome].
```

## Acceptance Criteria

Acceptance criteria should be testable.

Good:

- "Unauthenticated users receive 401."
- "Users cannot access orders owned by another user."
- "The submit button is disabled while the request is pending."

Weak:

- "The flow should be nice."
- "The API should be secure."

## Contracts

Add only the contracts relevant to the task:

- UI states
- API routes
- request DTOs
- response shapes
- database model notes
- events or jobs
- external integrations

Do not add framework-specific routing or proxy layers from unrelated project instructions unless they are required by the current task and stack. If repository instructions conflict with the stated stack, describe the conflict in Context or Open Questions instead of embedding the convention into the API contract.

## Security and Permissions

Define:

- who can access the feature
- who cannot access the feature
- which records each actor can list and which records each actor can view by ID
- which client-supplied fields must be rejected because they imply identity, role, ownership, authority, or state
- which data is sensitive
- which actions mutate state
- whether approval is required
- logging or audit requirements

## Testing Plan

Map tests to risk:

- unit tests for pure logic
- integration tests for service/database behavior
- API e2e tests for route contracts and auth
- Playwright tests for critical UI flows
- regression tests for bugs

## Implementation Plan

Break implementation into reviewable steps.

Avoid giant agent tasks.

Each step should have:

- affected files or modules
- expected output
- verification step
