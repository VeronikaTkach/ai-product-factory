---
name: frontend-production-review
description: Perform senior/staff-level frontend production reviews. Use when the user asks for BIG or SMALL frontend review, architecture/code quality/test/performance review, production readiness, risk assessment, tradeoffs, or recommendations before implementation.
---

# Frontend Production Review

## When to Use

Use this skill for:

- senior frontend code review
- production-readiness review
- architecture review
- code quality review
- test review
- performance review
- BIG or SMALL review workflow
- tradeoff-heavy recommendations

## When Not to Use

Do not use this skill for:

- implementing code directly
- backend-only review
- database-only review
- security-only review
- narrow TypeScript issue review that fits `typescript-code-review`

## Workflow

1. Ask whether the review is `BIG` or `SMALL` if the user did not specify.
2. Read `references/review-process.md`.
3. For BIG reviews, cover sections in order: Architecture, Code Quality, Tests, Performance.
4. For SMALL reviews, use one focused question per section and keep output concise.
5. After each BIG review section, pause and ask for feedback before continuing unless the user explicitly asks for a full uninterrupted review.
6. Use the issue format from `references/issue-format.md`.
7. Give one clear recommendation per issue.
8. Do not implement changes until the user confirms.

## Core Principles

- Review as if the system is production, not a student project.
- Correctness and edge cases matter more than speed.
- Mark duplication aggressively when it creates maintenance risk.
- Prefer explicit decisions over clever implicit behavior.
- Do not assume priorities or deadlines; ask when tradeoffs depend on them.
- Keep recommendations concrete and decision-oriented.

## Output Expectations

For each issue:

- describe the problem clearly
- explain why it matters
- give 2-3 options, including "do nothing" when reasonable
- compare effort, risk, impact, and maintenance cost
- recommend one option with rationale

## References

- `references/review-process.md`
- `references/issue-format.md`
- `references/review-sections.md`

## Evals

- `evals/trigger-cases.json`
