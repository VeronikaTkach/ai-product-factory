# Case 05 Run: PR Review

Date: 2026-06-19

## Case

`validation/cases/05-pr-review.md`

## Selected Skill Route

1. `code-review`
2. `typescript-code-review`
3. `database-design-rules`
4. `testing-patterns`
5. `agent-security-review`

## Expected First Agent Response

The review should lead with findings, not a summary.

Minimum review content:

- Findings ordered by severity.
- Required checks before merge.
- Specialized reviews needed.
- Merge recommendation.
- Residual risk.
- Short summary after findings.

Expected routing:

- React profile form: `typescript-code-review` plus frontend conventions.
- NestJS profile endpoint: `typescript-code-review`, `nestjs-backend-rules`, `agent-security-review`.
- Prisma model and migration: `database-design-rules`.
- Tests: `testing-patterns`.
- User profile data: `agent-security-review`.

## Evaluation Against Success Criteria

- Agent does not only summarize the PR: pass.
- Agent routes TypeScript code to focused code review: pass.
- Agent routes Prisma/migration changes to database rules: pass.
- Agent routes profile/user data changes to security review: pass.
- Agent checks for tests and migration safety: pass.
- Agent gives a clear merge recommendation or says insufficient context: pass.

## Result

Pass.

## Follow-Up

No package changes required from this case.
