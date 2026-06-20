# Backend Conventions

## Core Principles

- Prefer clear architecture over clever abstractions.
- Keep transport, business logic, and persistence concerns separate.
- Validate input before it reaches business logic.
- Authorize actions close to the boundary and again in sensitive domain operations when needed.
- Make side effects explicit.
- Keep changes focused.
- Preserve existing project conventions when they are clear.

## TypeScript

- DTO classes use PascalCase and end with `Dto`.
- Interfaces start with `I` when used for internal contracts.
- API response type aliases start with `T` when the project uses response aliases.
- Avoid `any`.
- Prefer explicit return types for public service methods.
- Use discriminated unions for multi-state domain results when exceptions are not appropriate.

## Error Handling

- Use NestJS HTTP exceptions at API boundaries.
- Do not expose internal error messages to clients.
- Log internal errors with enough context for debugging.
- Use domain-specific errors inside services when useful, then map them to HTTP exceptions at the boundary.

## API Design

- Use plural resource names for REST routes.
- Keep route handlers small.
- Return stable response shapes.
- Do not return raw Prisma models if they expose internal fields.
- Add pagination for list endpoints that can grow.
- Use explicit query DTOs for filters, sorting, and pagination.

## Dependency Management

- Prefer stable package releases.
- Avoid adding backend dependencies for small helper logic.
- Explain new dependencies and their maintenance/security implications.
- Avoid packages with weak maintenance signals for authentication, crypto, or validation.

## Tests

At minimum, backend changes should define how to verify:

- DTO validation
- service behavior
- authorization behavior
- persistence behavior
- error behavior

Use unit tests for services and guards.

Use integration or e2e tests for controller routes and database behavior when the risk is meaningful.
