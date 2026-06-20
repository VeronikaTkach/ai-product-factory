# MCP Consumption

## Build vs Consume

Prefer consuming an existing MCP server when:

- it is first-party or well-maintained
- the tool schema matches the need
- permissions can be scoped
- credentials can be managed safely
- audit logging is possible

Build or wrap your own when:

- no trusted server exists
- the public server needs too much access
- the workflow requires internal business rules
- the organization needs stronger logging, filtering, or approval gates

## Transport

## stdio

Best for:

- local development
- prototypes
- CLI tools
- private local utilities

Risks:

- local filesystem or credential exposure if the server is untrusted

## Remote HTTP/SSE

Best for:

- shared team access
- hosted tools
- always-updated server lifecycle
- centralized governance

Risks:

- network exposure
- remote trust boundary
- service availability

## Access Modes

- Forbidden: tool is too risky or untrusted.
- Read-only: safe exploration and analysis.
- Approval-required: writes, sends, deletes, deploys.
- Auto-approved: low-risk, scoped, reversible operations.

Start restrictive and widen only after evidence.
