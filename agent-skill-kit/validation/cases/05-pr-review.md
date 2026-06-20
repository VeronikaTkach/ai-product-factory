# Case 05: PR Review

## User Task

Review a PR that changes a React profile form, adds a NestJS profile update endpoint, updates a Prisma user model, and adds a migration. Decide if it is ready to merge. Assume the diff is available.

## Expected Skill Route

1. `code-review`
2. `typescript-code-review`
3. `database-design-rules`
4. `testing-patterns`
5. `agent-security-review`

## Expected Output

The review should include:

- findings first, ordered by severity
- required checks
- specialized reviews needed
- merge recommendation
- residual risk
- summary

## Success Criteria

- Agent does not only summarize the PR.
- Agent routes TypeScript code to focused code review.
- Agent routes Prisma/migration changes to database rules.
- Agent routes profile/user data changes to security review.
- Agent checks for tests and migration safety.
- Agent gives a clear merge recommendation or says insufficient context.
