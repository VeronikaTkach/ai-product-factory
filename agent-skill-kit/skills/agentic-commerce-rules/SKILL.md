---
name: agentic-commerce-rules
description: Design and review agentic commerce workflows involving purchasing, payments, AP2, UCP, spending limits, merchant discovery, consent, approvals, receipts, refunds, and audit trails. Use only when agents can transact, order, reserve, pay, or initiate commerce actions.
---

# Agentic Commerce Rules

## When to Use

Use this skill when the task involves:

- agentic purchasing
- payments
- AP2 or agent payment protocols
- UCP or merchant/order discovery
- checkout automation
- spending limits
- refunds
- receipts
- commerce approvals
- autonomous ordering or reservation

## When Not to Use

Do not use this skill for:

- ordinary ecommerce UI with no agentic transaction
- generic database schema design
- payment styling
- non-commerce external API calls
- PR review without commerce risk

## Workflow

1. Identify transaction type: discover, quote, reserve, order, pay, refund.
2. Read `references/commerce-boundaries.md`.
3. Read `references/payment-safety.md` for consent, limits, and approval.
4. Read `references/audit-receipts.md` for traceability.
5. Use `templates/commerce-policy.md` for policy design.
6. Require human approval for payment or irreversible commerce actions unless policy explicitly allows automation.

## Core Rules

- Discovery and comparison can be read-only.
- Cart or order drafts are draft-only until approved.
- Payment and purchase are action-allowed and high-risk.
- Spending limits must be explicit.
- Merchant and item identity must be verified.
- Receipts and audit trails are mandatory.
- Refunds and cancellations need clear authority.
- Never let an agent infer payment consent from vague intent.

## References

- `references/commerce-boundaries.md`
- `references/payment-safety.md`
- `references/audit-receipts.md`

## Templates

- `templates/commerce-policy.md`

## Evals

- `evals/trigger-cases.json`
