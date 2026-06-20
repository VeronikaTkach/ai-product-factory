# Agent and Tool Security

## Tool Access Model

Treat every tool as a capability grant.

For each tool, check:

- what it can read
- what it can write
- what external systems it can contact
- whether it can execute code
- whether it can spend money or send messages
- whether it can modify production state

## MCP Security

Review MCP servers for:

- source trust
- tool schema clarity
- permission scope
- credential handling
- read/write separation
- production access
- audit logging
- prompt injection exposure

Avoid:

- public unverified MCPs in production
- broad filesystem access
- broad project access
- write access to production data by default
- credentials embedded in prompts or config files

## Contextual Authorization

A tool call should be allowed only when:

- the tool is allowed for this actor
- the environment allows the tool
- the arguments match the user's original intent
- the action is within the current task
- the action does not exceed approved scope

Use a policy server or gateway for sensitive tools.

## Sandboxing

Generated scripts and agent-driven command execution should run in:

- restricted workspaces
- containers or isolated profiles when possible
- least-privilege environments
- non-production targets by default

Sandbox controls should limit:

- filesystem access
- network egress
- credentials
- production endpoints

## Agent Observability

Security review should ask whether the system tracks:

- tool calls
- tool arguments
- model calls
- file edits
- external requests
- actor identity
- approval decisions
- rollback events

Without traces, security incidents become guesswork.
