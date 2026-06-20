---
name: observability-rules
description: Design observability for agents, tools, code workflows, evaluation, audit logs, OpenTelemetry-style traces, cost tracking, self-repair loops, and production debugging. Use when planning or reviewing telemetry, traces, logs, metrics, and auditability.
---

# Observability Rules

## When to Use

Use this skill when the task involves:

- agent traces
- tool call logging
- audit logs
- evaluation telemetry
- token cost tracking
- self-repair loop analysis
- production debugging
- OpenTelemetry-style spans
- incident forensics

## When Not to Use

Do not use this skill for:

- generic code style review
- frontend layout work
- database schema design only
- writing tests only
- MCP adoption unless telemetry is the focus

## Workflow

1. Identify what decision or failure must be explainable.
2. Read `references/agent-tracing.md`.
3. Read `references/audit-logs.md` for compliance or high-risk actions.
4. Read `references/evaluation-telemetry.md` for eval, cost, and trajectory signals.
5. Use `templates/trace-plan.md` when planning instrumentation.
6. Define what to log, what not to log, retention, and sampling.

## Core Rules

- You cannot evaluate or secure what you cannot see.
- Track tool calls with arguments and results, but avoid logging secrets or PII.
- Capture enough context to explain intent, action, and outcome.
- Use audit logs for high-risk actions.
- Track cost and retries for agent workflows.
- Retain failed, high-cost, and high-risk traces preferentially.

## References

- `references/agent-tracing.md`
- `references/audit-logs.md`
- `references/evaluation-telemetry.md`

## Templates

- `templates/trace-plan.md`

## Evals

- `evals/trigger-cases.json`
