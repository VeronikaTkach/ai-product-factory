# Agent Card

## Purpose

An Agent Card is the machine-readable identity and contract of a specialist agent.

## Include

- name
- purpose
- capabilities
- non-capabilities
- input schemas
- output schemas
- interaction patterns
- data handling policy
- authentication requirements
- authorization requirements
- rate limits or cost notes
- escalation behavior
- owner and maintenance contact

## Capability Rules

Capabilities should be specific.

Good:

- "Analyze invoices for duplicate charges and return a draft dispute recommendation."

Weak:

- "Helps with finance."

## Security

State:

- data retained or not retained
- whether PII is accepted
- whether actions are read-only, draft-only, or action-allowed
- approval requirements
- audit logging behavior
