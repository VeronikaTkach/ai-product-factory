---
name: database-design-rules
description: Apply PostgreSQL, Prisma, Supabase, schema design, migrations, indexes, constraints, data integrity, and database review conventions. Use for database modeling, migration planning, query review, and persistence design. Do not use for frontend-only work.
---

# Database Design Rules

## When to Use

Use this skill when the task involves:

- designing PostgreSQL schemas
- writing or reviewing Prisma models
- planning migrations
- adding indexes or constraints
- reviewing data integrity risks
- designing Supabase access patterns
- reviewing query performance
- planning destructive or high-risk data changes

## When Not to Use

Do not use this skill for:

- frontend-only React work
- generic TypeScript review without persistence concerns
- NestJS controller/service structure unless database design is involved
- UI testing
- roadmap writing

## Trigger Examples

Positive triggers:

- "Design a PostgreSQL schema for invoices."
- "Review this Prisma model."
- "Plan a migration for adding order status."
- "Should this column be nullable?"
- "Add indexes for this query pattern."

Negative triggers:

- "Create a React component."
- "Review this Redux slice."
- "Write Playwright tests for the checkout page."
- "Review TypeScript typing in this hook."
- "Write a global agent roadmap."

## Workflow

1. Identify the domain entities, relationships, and invariants.
2. Read `references/schema-design.md` for modeling rules.
3. Read `references/migrations.md` for migration planning or schema changes.
4. Read `references/query-performance.md` for indexes, query shape, and performance.
5. Read `references/supabase.md` if Supabase Auth, RLS, Storage, or Realtime are involved.
6. Use `templates/prisma-model.prisma` for model shape examples.
7. Produce a concise design with risks, constraints, and verification steps.

## Core Rules

- Data integrity belongs in the database where possible.
- Prefer explicit relationships and constraints.
- Avoid nullable fields unless the domain really allows missing data.
- Add indexes for known access patterns, not guesses.
- Treat destructive migrations as high-risk.
- Do not expose service-role credentials to clients.
- Use transactions for multi-step writes that must be atomic.
- Prefer clear schema evolution over clever migration shortcuts.

## Output Expectations

When designing:

- list entities and relationships
- identify required constraints
- identify likely indexes
- note migration risks
- note authorization/RLS implications when relevant

When reviewing:

- check nullability
- check uniqueness
- check referential integrity
- check index coverage
- check migration safety
- check sensitive data exposure

## References

- `references/schema-design.md`
- `references/migrations.md`
- `references/query-performance.md`
- `references/supabase.md`

## Templates

- `templates/prisma-model.prisma`

## Evals

- `evals/trigger-cases.json`
