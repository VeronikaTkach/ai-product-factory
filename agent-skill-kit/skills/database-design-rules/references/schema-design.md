# Schema Design

## Modeling Principles

- Model business invariants explicitly.
- Use foreign keys for relationships.
- Use unique constraints for natural uniqueness.
- Use check constraints when values must stay within a valid range.
- Keep timestamps consistent across models.
- Avoid storing derived data unless there is a performance reason and a refresh strategy.

## Nullability

Allow `NULL` only when the domain distinguishes unknown, missing, or not applicable.

Avoid nullable fields for:

- required names
- ownership fields
- status fields
- monetary values
- foreign keys that define required relationships

## Status Fields

Use enums when:

- the allowed states are stable
- invalid states must be impossible
- state transitions matter

Document allowed transitions when status drives behavior.

Do not reuse a status enum for audit actions or domain events when the words describe different concepts. Prefer a separate enum such as `ExpenseStatus = PENDING | APPROVED | REJECTED` and `ExpenseAuditAction = APPROVE | REJECT`.

## Money

- Store money as integer minor units such as cents.
- Store currency explicitly when more than one currency is possible.
- Avoid floating point values for money.
- Define a domain maximum for monetary fields when the database column has a practical range.
- Mirror money bounds in DTO validation so invalid values fail before database insertion.

## Audit Fields

Common fields:

- `createdAt`
- `updatedAt`
- `createdById` when ownership matters
- `deletedAt` for soft deletes when required

Soft deletes require query discipline and indexes that account for active records.

## Sensitive Data

- Avoid storing secrets unless absolutely required.
- Hash passwords with a modern password hashing algorithm.
- Do not store raw tokens when a hash or reference is enough.
- Separate private metadata from public response shapes.
