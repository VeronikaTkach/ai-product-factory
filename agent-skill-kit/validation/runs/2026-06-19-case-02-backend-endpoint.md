# Case 02 Run: Backend Endpoint

Date: 2026-06-19

## Case

`validation/cases/02-backend-endpoint.md`

## Selected Skill Route

1. `spec-driven-development`
2. `nestjs-backend-rules`
3. `database-design-rules`
4. `testing-patterns`
5. `agent-security-review`
6. `typescript-code-review`
7. `code-review`

## Expected First Agent Response

The first response should be a spec, not code.

Minimum spec content:

- Goal: authenticated user creates a draft order from cart item IDs.
- API contract: `POST /orders`, DTO with `cartItemIds`, no `ownerId` in request.
- Auth rule: user ID comes only from trusted auth context.
- Authorization rule: caller can only create orders for self.
- Data notes: order owner relation, draft status, total calculation, transaction if cart/order writes must be atomic.
- Security notes: reject client-provided ownership, avoid raw database records, validate cart ownership.
- Tests: unauthenticated request, empty cart, foreign cart item, request body `ownerId` ignored/rejected, successful draft creation.

## Evaluation Against Success Criteria

- Agent explicitly rejects trusting client-provided user ID: pass.
- Agent identifies authenticated user context as source of truth: pass.
- Agent routes persistence concerns to database rules: pass.
- Agent routes auth/user data risk to security review: pass.
- Agent proposes API e2e or integration tests: pass.

## Result

Pass.

## Follow-Up

No package changes required from this case.
