---
name: agent-security-review
description: Review agentic, backend, database, MCP/tool, and automation changes for security risks, authorization gaps, secrets, dependency risk, unsafe tool access, high-risk actions, and Effective Trust controls. Use as a security gate, not a general code review.
---

# Agent Security Review

## When to Use

Use this skill when a task or diff touches:

- authentication or authorization
- user data or sensitive data
- secrets, tokens, credentials, or environment variables
- database writes, deletes, migrations, or bulk updates
- external APIs, webhooks, email, payments, or notifications
- MCP servers or tool execution
- agent permissions, tool allowlists, or sandboxing
- production deployment or infrastructure changes
- AI-generated code that can perform real-world actions

## When Not to Use

Do not use this skill for:

- general TypeScript style review
- frontend-only layout changes with no data/security impact
- test strategy only
- database modeling without access or migration risk
- PR summary without security-sensitive changes

## Trigger Examples

Positive triggers:

- "Review this endpoint for authorization issues."
- "Check this MCP tool for unsafe permissions."
- "Is this migration safe for production data?"
- "Review this agent workflow before it can send emails."
- "Check whether secrets or PII can leak in this code."

Negative triggers:

- "Review this React component's spacing."
- "Choose Vite or Next.js."
- "Write a unit test for this pure function."
- "Summarize this roadmap."
- "Rename this TypeScript interface."

## Workflow

1. Identify protected assets: users, data, money, infrastructure, credentials, external systems.
2. Identify actors: human user, service, agent, subagent, MCP server, external caller.
3. Identify actions: read, write, delete, deploy, send, pay, publish, permission change.
4. Read `references/security-review-checklist.md` for the baseline review.
5. Read `references/auth-data.md` for auth, authorization, PII, secrets, and database safety.
6. Read `references/agent-tool-security.md` for MCP, tools, sandboxes, and agent permissions.
7. Read `references/high-risk-actions.md` when production, data deletion, communications, payments, or permission changes are involved.
8. Check dependency and package risk.
9. Check high-risk actions for human approval and Vibe Diff.
10. Report findings first, ordered by severity.

## Security Model

Use Effective Trust as the guiding model.

Trust must be continuously earned through:

- scoped identity
- least privilege
- sandboxed execution
- dependency verification
- policy gates
- human approval
- audit logs
- observability
- rollback or circuit breaker paths

## Review Checklist

## Authentication

- Is the caller authenticated?
- Is identity taken from trusted auth context?
- Are tokens short-lived and scoped?
- Are service-role credentials server-only?

## Authorization

- Is the action allowed for this actor?
- Is resource ownership checked?
- Are role checks too broad?
- Are high-risk operations protected by explicit approval?

## Data Protection

- Are secrets absent from prompts, logs, client code, and source control?
- Is PII masked or minimized?
- Are raw database records exposing private fields?
- Are logs safe enough for production?

## Database and State

- Are destructive actions controlled?
- Are migrations reversible or staged?
- Are bulk updates bounded?
- Are transactions used for atomic writes?

## Agent and Tool Access

- Is tool access scoped to the task?
- Are MCP servers trusted or audited?
- Can a tool call exfiltrate data?
- Is there a policy server or gateway for sensitive tools?
- Are tool arguments sanitized?

## Runtime Safety

- Is execution sandboxed?
- Is network egress limited?
- Are generated scripts isolated?
- Is there a checkpoint or rollback path?

## Human Approval

Require explicit approval for:

- production deploys
- permission changes
- destructive data changes
- external communications
- financial operations
- broad access grants

High-risk approvals should include a Vibe Diff: a plain-language summary of what will happen and why it matches the user's intent.

## Output Format

Use:

```text
Findings
- [Severity] File:line - Issue. Why it matters. Suggested fix.

Required Controls
- ...

Approval Required
- Yes/No, with reason.

Vibe Diff Needed
- Yes/No, with reason.

Residual Risk
- ...
```

If there are no security findings, say so clearly and list residual risk.

## References

- `references/security-review-checklist.md`
- `references/auth-data.md`
- `references/agent-tool-security.md`
- `references/high-risk-actions.md`

## Templates

- `templates/security-review-output.md`

## Examples

- `examples/security-findings-example.md`

## Evals

- `evals/trigger-cases.json`
