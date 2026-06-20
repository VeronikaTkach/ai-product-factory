# Backend Testing

## NestJS Service Tests

Use for:

- business rules
- error behavior
- authorization policy helpers
- orchestration logic

Mock:

- external APIs
- email providers
- payment gateways

Avoid mocking:

- the function under test
- simple domain code that should run directly

## Controller and API Tests

Use for:

- request validation
- route contracts
- auth behavior
- response shape
- HTTP status codes

## Database Tests

Use when:

- query behavior matters
- constraints matter
- transactions matter
- Prisma mappings matter

Prefer isolated test databases or transaction rollback patterns.

When a transaction or concurrency path is tested with mocks, label it as simulated coverage. Do not present it as equivalent to a real database concurrency test.

## Migration Verification

For risky migrations, define checks before writing or running the migration:

- preflight query for affected row count
- query for invalid existing data
- duplicate detection query before adding uniqueness
- post-migration constraint verification
- rollback or restore verification when available
- application-level smoke test after deployment

If no live database is available, generate and review migration SQL, but report the migration as not applied.

## Guards

Test:

- unauthenticated access
- insufficient permissions
- valid permissions
- resource ownership when guard handles it
