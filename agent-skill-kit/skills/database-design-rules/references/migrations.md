# Migrations

## Risk Levels

## Low Risk

- add nullable column
- add new table with no existing data dependency
- add non-unique index concurrently where supported

## Medium Risk

- add non-null column with default
- add unique constraint
- change relation cardinality
- backfill data

## High Risk

- drop column or table
- rename column used by application code
- change enum values
- change nullability to non-null
- large table backfill
- destructive data cleanup

## Safe Migration Pattern

For risky changes, prefer expand-migrate-contract:

1. Add new structure without breaking old code.
2. Deploy code that writes both old and new shape if needed.
3. Backfill data.
4. Read from the new shape.
5. Remove old structure in a later migration.

## Migration Review Checklist

- Is the migration reversible or is rollback documented?
- Does it lock a large table?
- Does application code need to deploy before or after it?
- Is there a backfill?
- Are defaults safe?
- Are existing rows valid under new constraints?
- Is production approval required?
- Does the migration file contain only executable migration content?

## Prisma Notes

- Review generated migrations before applying.
- Do not blindly run destructive generated migrations.
- Prefer explicit naming for important constraints and indexes when supported.
- Keep schema and application deployment order clear.
- When generating migration SQL with CLI commands, keep stdout notices, update prompts, logs, and terminal decorations out of `migration.sql`.
- Before marking a migration ready, inspect the generated SQL file tail and fail the review if it contains non-SQL text such as package update notices.
