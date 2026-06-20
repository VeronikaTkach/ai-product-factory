---
name: testing-patterns
description: Choose and design tests for TypeScript, React, NestJS, Prisma, APIs, bug fixes, and UI flows. Use for test strategy, regression tests, unit/integration/e2e boundaries, Playwright checks, and test-first bug workflows.
---

# Testing Patterns

## When to Use

Use this skill when the task involves:

- choosing what tests to write
- adding regression tests before a fix
- testing React components or hooks
- testing NestJS services, guards, or controllers
- testing API endpoints
- testing Prisma/database behavior
- defining migration verification checks
- writing Playwright UI checks
- reviewing missing test coverage

## When Not to Use

Do not use this skill for:

- code review with no testing question
- database schema design only
- frontend styling only
- roadmap writing
- security threat modeling only

## Workflow

1. Identify the risk level and behavior under test.
2. Read `references/test-selection.md`.
3. Read `references/frontend-testing.md` for React/UI.
4. Read `references/backend-testing.md` for NestJS/API.
5. Read `references/bug-regression.md` for bug fixes.
6. Use templates when drafting test files.
7. Recommend the smallest test suite that catches the meaningful risk.

## Core Rules

- Test behavior, not implementation details.
- Add a failing regression test before fixing a bug when feasible.
- Use unit tests for pure logic.
- Use integration tests for service plus database behavior.
- Use e2e tests for HTTP contract and auth behavior.
- Use Playwright for user-facing UI flows.
- Use verification queries before and after risky migrations.
- Avoid brittle snapshots unless structure is the behavior.
- Mock external systems, not the code under test.

## Output Expectations

When proposing tests:

- name the test type
- state what behavior it protects
- state what to mock or not mock
- include edge cases
- include commands or verification steps when known

## References

- `references/test-selection.md`
- `references/frontend-testing.md`
- `references/backend-testing.md`
- `references/bug-regression.md`

## Templates

- `templates/jest-unit.test.ts`
- `templates/nest-service.spec.ts`
- `templates/playwright.spec.ts`

## Evals

- `evals/trigger-cases.json`
