# Auth, Data, and Secrets

## Authentication

- Do not trust client-provided user IDs.
- Derive identity from trusted auth context.
- Keep session and access tokens scoped and short-lived.
- Do not put tokens in logs, prompts, screenshots, or client bundles.

## Auth Stubs

Header-based auth stubs such as `x-user-id` or `x-user-role` are acceptable only for local development or tests.

Rules:

- Mark header-based auth as dev/test-only.
- Do not treat client-set headers as a production security boundary.
- If an upstream gateway is assumed to set headers, state that assumption explicitly.
- Security review must list stub auth as residual risk.
- Production exposure requires real authentication and trusted identity propagation.

## Authorization

Authentication answers who the actor is.

Authorization answers whether that actor can perform this action on this resource.

Check:

- role or permission requirements
- resource ownership
- tenant boundary
- environment boundary
- action type
- approval requirement
- list-view and detail-view visibility separately

## Client-Supplied Authority Fields

Reject client-supplied authority fields unless the product contract explicitly requires a compatibility exception.

Examples:

- `employeeId`
- `managerId`
- `actorId`
- `role`
- `status`
- `approvedBy`
- `decidedBy`

These values should come from trusted auth context, server-side policy, or controlled state transitions.

## Sensitive Data

Sensitive data includes:

- PII
- credentials
- tokens
- payment data
- private business data
- internal URLs
- customer records
- audit logs

Rules:

- return only fields needed by the caller
- mask PII in logs when possible
- avoid logging request bodies for sensitive endpoints
- use explicit response mappers instead of raw database records
- avoid broad exports

## Secrets

Reject:

- hardcoded API keys
- secrets in examples
- secrets in `.env` committed to source control
- secrets pasted into prompts
- service-role keys in browser code

Prefer:

- environment variables
- secret managers
- short-lived tokens
- scoped credentials

## Database Safety

Review:

- destructive operations
- bulk updates
- missing `where` clauses
- transaction boundaries
- raw SQL interpolation
- missing tenant filters
- missing ownership filters
- migration rollout and rollback

High-risk database actions require explicit approval.
