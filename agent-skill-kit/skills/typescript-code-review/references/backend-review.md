# Backend Review

## NestJS Boundaries

- Controllers should stay thin.
- Services should contain business logic.
- DTOs should validate input.
- Guards should enforce route-level auth.
- Persistence should not be called directly from controllers.

## API Safety

- Validate body, params, and query input.
- Do not trust client-provided user IDs.
- Do not return sensitive internal fields.
- Use appropriate HTTP exceptions.
- Bound pagination limits.

## Build Output

- Production build output should not include test files, e2e specs, test fixtures, coverage, or TypeScript build info unless intentionally packaged.
- For NestJS projects, check `tsconfig`/build config excludes `**/*.spec.ts` and `test/**` from deployable artifacts.
- Treat "tests compiled into dist" as a release hygiene finding even when runtime behavior is unaffected.

## Authorization

- Authentication is not authorization.
- Check resource ownership.
- Check role or permission requirements.
- Avoid broad admin-only shortcuts when domain permissions matter.

## Background Work

- Long-running jobs should be idempotent where possible.
- Avoid unbounded retries.
- Log enough context for debugging.
