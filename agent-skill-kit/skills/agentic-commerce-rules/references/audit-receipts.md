# Audit and Receipts

## Required Records

For commerce actions, record:

- user
- agent
- merchant
- item or service
- amount
- currency
- consent text or approval ID
- timestamp
- payment reference
- receipt
- cancellation or refund policy

## Receipt Handling

- Store receipts in a durable location.
- Do not expose payment credentials.
- Mask sensitive payment details.
- Link receipt to the user and transaction.

## Disputes and Refunds

The system should be able to answer:

- who approved the transaction
- what was purchased
- why the agent chose it
- whether it matched policy
- whether refund is available

## Observability

Retain traces for:

- failed payments
- policy violations
- amount changes
- user complaints
- refunds or disputes
