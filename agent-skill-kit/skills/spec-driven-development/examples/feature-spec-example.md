# Feature Spec: Draft Order Creation

## Goal

Allow authenticated users to create a draft order from selected cart items.

## Context

Users can add items to a cart, but there is no durable draft order. Support needs a draft order record so users can resume checkout later.

## Scope

- Add API endpoint for creating a draft order.
- Persist order owner, total, currency, and status.
- Return a stable response shape for the frontend.

## Non-Goals

- Payment processing.
- Inventory reservation.
- Email notifications.

## Assumptions

- The user is authenticated before creating an order.
- Cart item validation already exists.
- Currency is `USD` for the first version.

## User Stories

- As an authenticated user, I want to create a draft order, so that I can continue checkout later.

## Acceptance Criteria

- Unauthenticated users receive 401.
- A draft order is created with owner ID from auth context, not from the request body.
- The response does not expose internal fields.
- Empty carts are rejected with 400.

## BDD Scenarios

```gherkin
Scenario: Authenticated user creates a draft order
  Given Alice is authenticated
  And Alice has selected cart items
  When Alice creates a draft order
  Then the API returns the draft order ID
  And the order owner is Alice
  And the order status is draft
```

```gherkin
Scenario: Unauthenticated user cannot create a draft order
  Given the caller is not authenticated
  When the caller creates a draft order
  Then the API responds with 401
  And no order is created
```

## API Contract

- Route: `POST /orders`
- Request: `{ "cartItemIds": string[] }`
- Response: `{ "id": string, "status": "draft", "totalCents": number, "currency": "USD" }`
- Errors: `400` empty cart, `401` unauthenticated

## Data Model Notes

- `Order.ownerId` references `User.id`.
- `Order.status` starts as `draft`.
- `Order.totalCents` is integer minor units.

## Security and Permissions

- User identity must come from trusted auth context.
- Request body must not accept `ownerId`.
- Order response must not expose internal audit fields.

## Testing Plan

- API e2e test for unauthenticated request.
- Service test for draft order creation.
- Regression test that request body `ownerId` is ignored or rejected.

## Implementation Plan

1. Add DTO validation.
2. Add service method using authenticated user ID.
3. Add controller route.
4. Add tests for auth and empty cart behavior.
