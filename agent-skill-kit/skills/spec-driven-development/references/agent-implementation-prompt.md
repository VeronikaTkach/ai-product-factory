# Agent Implementation Prompt

## Purpose

When handing a spec to a coding agent, include enough constraints to prevent guessing, broad refactors, or unsafe actions.

## Prompt Structure

Use:

```text
Implement the spec in [path].

Constraints:
- Follow existing project conventions.
- Keep the diff focused.
- Do not introduce new dependencies without approval.
- Do not perform unrelated refactors.
- Add or update tests listed in the spec.
- Run [commands] before finishing.

Before coding:
- Inspect the relevant files.
- Summarize the implementation plan.
- Call out risky assumptions.

After coding:
- Summarize changed files.
- Report tests/checks run.
- List residual risks.
```

## Required Guardrails

Include:

- target stack
- affected modules
- test commands
- dependency rules
- security constraints
- migration constraints
- approval points

## Bug Fix Prompt

For bugs, require:

- reproduction first
- failing test or command first when feasible
- minimal fix
- no unrelated cleanup
- regression test kept in the codebase

## High-Risk Prompt Additions

For database, production, permissions, payments, or external communications:

- require dry-run or draft mode when possible
- require Vibe Diff before execution
- require human approval
- require rollback notes
