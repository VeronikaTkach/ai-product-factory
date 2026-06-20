# Case 02: Backend Endpoint

## User Task

Create a NestJS endpoint that lets an authenticated user create a draft order from cart item IDs. The user ID must come from auth context, not from the request body. Do not implement immediately; start with a spec.

## Expected Skill Route

1. `spec-driven-development`
2. `nestjs-backend-rules`
3. `database-design-rules`
4. `testing-patterns`
5. `agent-security-review`
6. `typescript-code-review`
7. `code-review`

## Expected Output

The first response should produce a spec, not code.

The spec should include:

- endpoint contract
- DTO validation
- ownership/security requirements
- data model notes
- transaction or consistency notes
- tests for unauthenticated access
- tests for ignoring/rejecting request body `ownerId`

## Success Criteria

- Agent explicitly rejects trusting client-provided user ID.
- Agent identifies authenticated user context as source of truth.
- Agent routes persistence concerns to database rules.
- Agent routes auth/user data risk to security review.
- Agent proposes API e2e or integration tests.
