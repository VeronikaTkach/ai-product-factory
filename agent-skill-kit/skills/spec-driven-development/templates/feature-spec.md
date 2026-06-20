# Feature Spec: [Name]

## Goal

[Concrete outcome.]

## Context

[Why this matters and what exists today.]

## Scope

- [Included item]

## Non-Goals

- [Excluded item]

## Assumptions

- [Assumption]

## User Stories

- As a [actor], I want [capability], so that [outcome].

## Acceptance Criteria

- [Testable criterion]

## BDD Scenarios

```gherkin
Scenario: [Happy path]
  Given [starting state]
  When [action]
  Then [expected outcome]
```

```gherkin
Scenario: [Failure path]
  Given [starting state]
  When [invalid or unauthorized action]
  Then [expected rejection]
```

## UX Notes

- [States, copy, accessibility, responsive behavior.]

## API Contract

- Route: `[METHOD] /path`
- Request: `[shape]`
- Response: `[shape]`
- Errors: `[status and reason]`

## Data Model Notes

- [Entities, fields, constraints, migration notes.]

## Security and Permissions

- [Auth, authorization, sensitive data, approval needs.]

## Testing Plan

- Unit: [what]
- Integration: [what]
- E2E/UI: [what]

## Observability

- [Logs, metrics, audit events.]

## Rollout and Migration Notes

- [Rollout, rollback, migration ordering.]

## Implementation Plan

1. [Step]
2. [Step]
3. [Verification]

## Open Questions

- [Question]
