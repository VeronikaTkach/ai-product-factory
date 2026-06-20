---
name: spec-driven-development
description: Convert product ideas, bugs, features, or agent tasks into production-ready technical specifications, BDD scenarios, acceptance criteria, API contracts, data model notes, test plans, and implementation guardrails before coding.
---

# Spec-Driven Development

## When to Use

Use this skill when the task involves:

- turning an idea into an implementation-ready spec
- planning a new feature before coding
- defining acceptance criteria
- writing BDD or Gherkin scenarios
- preparing API contracts
- defining data model requirements
- planning tests before implementation
- clarifying ambiguous requirements
- preparing an agent prompt for project or feature generation
- planning high-risk migrations before any migration code is written

## When Not to Use

Do not use this skill for:

- narrow code review after implementation
- styling-only frontend edits
- simple one-line fixes with obvious behavior
- security review only
- narrow database schema review when the requirements are already clear

## Trigger Examples

Positive triggers:

- "Turn this feature idea into a technical spec."
- "Write acceptance criteria before we implement this."
- "Create BDD scenarios for checkout."
- "Plan the API contract and data model for this feature."
- "Prepare a prompt for an agent to build this safely."

Negative triggers:

- "Review this TypeScript function."
- "Create a React component from this existing design."
- "Add an index to this Prisma model."
- "Check this endpoint for auth bugs."
- "Write Playwright code for this already specified flow."

## Workflow

1. Restate the user goal in concrete terms.
2. Identify users, actors, and systems involved.
3. Ask only blocking clarification questions. Otherwise make explicit assumptions.
4. Define scope and non-goals.
5. Define behavior with acceptance criteria.
6. Add BDD scenarios for core, edge, and failure paths.
7. Read `references/spec-structure.md` for the full spec shape.
8. Read `references/bdd-scenarios.md` when behavior needs scenario coverage.
9. Read `references/agent-implementation-prompt.md` when the spec will be handed to a coding agent.
10. Define API, data, UI, and integration contracts where relevant.
11. Identify security, privacy, and permission requirements.
12. Define test strategy before implementation.
13. Define implementation phases and review gates.

## Scope Discipline

- Do not expand roles, permissions, or allowed actions beyond the user's wording.
- If the user says "employee can submit", do not silently change that to "any authenticated user can submit".
- If a broader permission might be useful, put it in Open Questions instead of making it an assumption.
- Treat ambiguous authority as a product decision, not an implementation detail.
- Do not silently accept client-supplied identity or authority fields such as `employeeId`, `managerId`, `actorId`, `role`, or `status`.
- Prefer rejecting forbidden identity or authority fields in write DTOs unless compatibility requirements explicitly demand ignoring them.
- Do not import unrelated project conventions, framework routes, or proxy layers into the spec unless the task or repository context clearly requires them.
- Do not add fields, endpoints, tables, or DTO properties that are still listed as Open Questions.
- Keep non-goals explicit so coding agents do not grow the feature.

## Spec Structure

Use this structure unless the project already has a stronger convention:

```text
# Feature Spec: Name

## Goal
## Context
## Scope
## Non-Goals
## Assumptions
## User Stories
## Acceptance Criteria
## BDD Scenarios
## UX Notes
## API Contract
## Data Model Notes
## Security and Permissions
## Testing Plan
## Observability
## Rollout and Migration Notes
## Implementation Plan
## Open Questions
```

## BDD Pattern

Use Gherkin-style scenarios:

```gherkin
Scenario: User completes the primary action
  Given the required starting state
  When the user performs the action
  Then the system produces the expected outcome
```

Include:

- happy path
- validation failure
- permission failure
- empty state
- retry or recovery path when relevant

## Agent Guardrails

When the spec will be used by a coding agent, include:

- files or modules likely affected
- stack and framework constraints
- dependency rules
- test commands to run
- prohibited shortcuts
- approval points for high-risk actions

## Output Expectations

Produce a spec that is:

- concrete enough for implementation
- structured enough for review
- testable
- explicit about assumptions
- clear about risks
- short enough to stay useful

Do not turn the spec into a long essay. Prefer crisp sections and actionable bullets.

## References

- `references/spec-structure.md`
- `references/bdd-scenarios.md`
- `references/agent-implementation-prompt.md`

## Templates

- `templates/feature-spec.md`
- `templates/bugfix-spec.md`

## Examples

- `examples/feature-spec-example.md`

## Evals

- `evals/trigger-cases.json`
