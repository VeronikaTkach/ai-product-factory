# Case 06 Senior Code Review

Date: 2026-06-19

## Case

`validation/cases/06-expense-approval-mini-app.md`

## Observed Behavior

A senior developer review was performed against the generated Expense Approval Mini App code after spec, implementation, review, and follow-up fixes.

## Result

Pass with additional prevention guardrails added.

## Findings

### P1: Migration SQL contained non-SQL CLI output

The generated Prisma migration file included a Prisma package update notice appended after the SQL statements. A migration file with terminal UI text is not executable by Postgres and can fail `prisma migrate deploy` or direct SQL execution.

Prevention: migration review must inspect generated SQL content, especially the file tail, and reject CLI notices, logs, prompts, or terminal decorations inside `migration.sql`.

### P2: Production backend build included tests

The NestJS build emitted `.spec` files and `test/` files into `dist`. Runtime behavior was unaffected, but deployable artifacts should not package tests, fixtures, coverage, or build-cache files.

Prevention: TypeScript/backend review and PR review should check deployable artifact hygiene and build exclusions.

### P3: Frontend did not mirror new backend bounds

Backend validation was fixed with max amount and string length bounds, but the frontend form still only checked positive amount and did not mirror known limits. Backend correctness was protected, but UX would surface predictable rejected submissions only after server round trips.

Prevention: frontend rules should remind agents to mirror important backend validation bounds in form UX.

## Package Updates

- Added migration SQL-only checks to database migration guidance.
- Added Prisma/PostgreSQL migration file hygiene guidance.
- Added frontend guidance to mirror known backend validation bounds.
- Added TypeScript backend review guidance for deployable build output.
- Added PR review guidance for production artifact hygiene.
- Added case 06 expectations for migration content review, frontend bounds mirroring, and build artifact review.
