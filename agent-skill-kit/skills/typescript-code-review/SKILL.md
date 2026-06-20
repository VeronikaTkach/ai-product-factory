---
name: typescript-code-review
description: Review TypeScript, React, NestJS, Prisma, and project architecture code for typing, boundaries, async behavior, error handling, maintainability, and framework-specific correctness. Use for code diffs or files, not for broad PR risk summaries.
---

# TypeScript Code Review

## When to Use

Use this skill when reviewing:

- TypeScript files
- React components and hooks
- NestJS controllers, services, DTOs, guards, and modules
- Prisma-backed service code
- shared utilities
- API clients
- typed contracts

## When Not to Use

Do not use this skill for:

- high-level PR merge decisions
- database schema design without TypeScript code
- security-only threat modeling
- UI visual QA
- roadmap writing

## Workflow

1. Identify the code area: frontend, backend, shared, or persistence.
2. Read `references/review-checklist.md`.
3. Read `references/frontend-review.md` for React/frontend code.
4. Read `references/backend-review.md` for NestJS/backend code.
5. Read `references/prisma-review.md` for Prisma/database access code.
6. Report findings first, ordered by severity.
7. Include file/line references when available.
8. Keep style preferences separate from correctness issues.

## Severity

- Critical: security issue, data loss, broken auth, production crash.
- High: likely runtime bug, broken contract, missing validation, severe architecture violation.
- Medium: maintainability issue, fragile typing, unclear async flow, missing edge case.
- Low: style, naming, minor cleanup.

## Output Format

Use:

```text
Findings
- [Severity] File:line - Issue. Why it matters. Suggested fix.

Open Questions
- ...

Summary
- ...
```

If there are no issues, say so clearly and mention residual risk or missing tests.

## References

- `references/review-checklist.md`
- `references/frontend-review.md`
- `references/backend-review.md`
- `references/prisma-review.md`

## Evals

- `evals/trigger-cases.json`
