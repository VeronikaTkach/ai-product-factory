---
name: code-review
description: Perform high-level PR, diff, or integration review with summary, risk assessment, merge readiness, required checks, and routing to specialized review skills. Use for PR-level review, not narrow TypeScript-only or database-only inspection.
---

# Code Review

## When to Use

Use this skill when the task involves:

- reviewing a PR or broad diff
- deciding merge readiness
- writing a PR risk assessment
- summarizing AI-generated changes
- identifying required follow-up checks
- coordinating specialized review passes

## When Not to Use

Do not use this skill for:

- narrow TypeScript file review only
- database schema design only
- writing tests only
- creating frontend/backend code
- security threat modeling only

## Workflow

1. Identify changed areas and user intent.
2. Read `references/pr-review.md`.
3. Read `references/risk-routing.md` to decide which specialized reviews are needed.
4. Inspect the diff or files.
5. Lead with findings ordered by severity.
6. Include required checks before merge.
7. Give a merge recommendation when enough context exists.

## Specialized Review Routing

Route to:

- `typescript-code-review` for TypeScript, React, NestJS, Prisma code correctness.
- `database-design-rules` for schema, migration, index, and data integrity changes.
- `testing-patterns` for missing or weak test coverage.
- `agent-security-review` in the future for auth, secrets, MCP/tooling, payments, or high-risk operations.

## Output Format

Use:

```text
Findings
- [Severity] File:line - Issue. Why it matters. Suggested fix.

Required Checks
- ...

Specialized Reviews Needed
- ...

Merge Recommendation
- Ready / Not ready / Ready after fixes / Insufficient context

Summary
- ...
```

If no issues are found, say so clearly and list residual risk.

## References

- `references/pr-review.md`
- `references/risk-routing.md`

## Templates

- `templates/pr-review-output.md`

## Evals

- `evals/trigger-cases.json`
