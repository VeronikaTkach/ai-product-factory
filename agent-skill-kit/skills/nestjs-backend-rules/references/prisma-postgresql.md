# Prisma and PostgreSQL Rules

## Persistence Boundaries

- Keep Prisma access out of controllers.
- Prefer service or repository methods for database operations.
- Return explicit response shapes instead of raw database records when fields are sensitive.
- Keep database-specific decisions close to persistence code.

## Schema Design

- Use meaningful model names.
- Use explicit relations.
- Add unique constraints for natural uniqueness.
- Add indexes for common filters and joins.
- Use database constraints to protect integrity.
- Avoid optional fields unless the domain truly allows missing data.

## Migrations

Treat migrations as high-risk when they:

- drop columns
- rename columns
- change nullability
- change enum values
- delete data
- backfill large tables

For high-risk migrations, include:

- rollout plan
- rollback thinking
- data backup or backfill strategy
- approval before production execution

For every generated migration:

- ensure `migration.sql` contains only executable SQL and SQL comments
- remove CLI notices, package update prompts, logs, and terminal UI text from the migration file
- do not report a migration as ready until the SQL file has been inspected

## Query Rules

- Use pagination for list endpoints.
- Select only needed fields when records contain sensitive or heavy data.
- Avoid N+1 queries.
- Use transactions for multi-step writes that must succeed or fail together.
- Avoid raw SQL unless Prisma cannot express the query clearly.
- Parameterize raw SQL when it is necessary.

## Transactions

Use transactions when:

- creating related records
- updating balances or counters
- writing audit logs with the main action
- performing state transitions that must be atomic

## Supabase Notes

When using Supabase:

- enable RLS where client-side access exists
- avoid broad service-role usage
- keep service-role keys server-only
- do not expose privileged database operations to the browser
