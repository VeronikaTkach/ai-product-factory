# Audit Logs

## When Required

Use audit logs for:

- production deploys
- database writes and deletes
- permission changes
- external communications
- payments
- high-risk tool calls
- policy overrides

## Audit Event Fields

- actor ID
- actor type: human, service, agent, subagent
- action
- target resource
- environment
- timestamp
- approval ID when relevant
- tool or command used
- result
- rollback or compensation action

## Review Questions

- Can we tell who caused the action?
- Can we tell what was approved?
- Can we tell what data or system changed?
- Can we reconstruct the sequence?
- Can we support incident response?

## Safety

- Do not put secrets in audit logs.
- Mask sensitive data.
- Keep audit logs tamper-resistant where possible.
