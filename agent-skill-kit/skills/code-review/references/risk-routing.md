# Risk Routing

## TypeScript Code Changed

Use `typescript-code-review` when the diff includes:

- React components or hooks
- NestJS code
- shared TypeScript utilities
- API clients
- Prisma query code

## Database Changed

Use `database-design-rules` when the diff includes:

- Prisma schema
- migrations
- SQL
- indexes
- constraints
- data backfills
- RLS policies

## Tests Changed or Missing

Use `testing-patterns` when:

- behavior changed without tests
- a bug fix has no regression test
- auth or data behavior changed
- UI flow changed
- only snapshots were added for complex behavior

## Security Sensitive

Use a security review when the diff includes:

- authentication
- authorization
- secrets
- payments
- user data
- external API calls
- MCP/tool execution
- production deployment
- destructive actions

## High Integration Risk

Flag high integration risk when:

- many unrelated files changed
- public contracts changed
- migrations and app code must deploy in order
- large refactors are mixed with feature work
- ownership boundaries are unclear
