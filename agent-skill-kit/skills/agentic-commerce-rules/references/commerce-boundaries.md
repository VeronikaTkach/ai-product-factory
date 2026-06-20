# Commerce Boundaries

## Authority Tiers

## Read-Only

Allowed:

- search merchants
- compare products
- check availability
- estimate price

## Draft-Only

Allowed:

- create cart
- prepare order
- draft refund request
- prepare payment intent

Requires:

- human review before execution

## Action-Allowed

Allowed:

- place order
- pay
- refund
- reserve inventory

Requires:

- explicit policy
- user consent
- audit trail
- spending limits
- rollback or cancellation path where possible

## Agent Responsibility

The agent must distinguish:

- "find options"
- "prepare purchase"
- "buy now"

Ambiguous user intent must not trigger payment.
