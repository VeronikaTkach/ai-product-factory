# Case 03: Database Migration

## User Task

We need to make `users.email` unique in a PostgreSQL database managed by Prisma. Existing duplicate emails may exist. Plan the migration safely before any code or migration is written.

## Expected Skill Route

1. `spec-driven-development`
2. `database-design-rules`
3. `testing-patterns`
4. `agent-security-review`
5. `code-review`

## Expected Output

The response should be a migration plan, not a migration file.

The plan should include:

- duplicate detection
- cleanup/backfill strategy
- expand-migrate-contract thinking if needed
- production risk
- rollback notes
- tests or verification queries
- approval requirement for production

## Success Criteria

- Agent does not blindly add `@unique`.
- Agent identifies duplicates as a blocker.
- Agent treats production migration as high-risk.
- Agent proposes verification before and after migration.
- Agent mentions deployment ordering if application behavior changes.
