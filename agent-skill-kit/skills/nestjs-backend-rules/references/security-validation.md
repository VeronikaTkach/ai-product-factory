# Security and Validation

## Input Validation

Validate:

- request bodies
- query parameters
- route params
- uploaded file metadata
- external webhook payloads

Rules:

- reject unknown or malformed input early
- transform numeric and boolean query params explicitly
- bound pagination limits
- add product-defined upper bounds for numeric inputs that map to bounded database columns
- add `@MaxLength` or equivalent for free-text and URL/string fields
- validate enum values
- validate IDs before database usage when possible

Examples:

- money in cents should have both a lower bound and an agreed upper bound before persistence
- descriptions, comments, URLs, and names should have length limits even in internal tools
- validation should fail with a controlled 4xx response before Prisma or the database throws a 500

## Authentication

- Keep authentication logic centralized.
- Do not trust client-provided user IDs.
- Read authenticated user identity from trusted auth context.
- Avoid long-lived broad tokens.
- Keep secrets out of prompts, logs, and client bundles.

## Authorization

Authorization should answer:

- who is acting
- what action they want
- which resource is targeted
- whether the action is allowed in this context

Use guards for route-level checks.

Use policy/service checks for resource-level decisions.

## Sensitive Data

- Do not return password hashes, tokens, internal flags, or private metadata.
- Mask PII in logs where possible.
- Avoid logging full request bodies on sensitive endpoints.
- Keep audit logs for high-risk operations.

## High-Risk Actions

Require explicit approval or strong safeguards for:

- production data deletion
- permission changes
- billing changes
- bulk updates
- irreversible migrations
- external communications

## Common Backend Risks

- missing authorization after authentication
- trusting browser state
- returning raw database models
- unbounded list queries
- unsafe raw SQL
- weak error handling
- secrets in environment examples or logs
- background jobs without idempotency
