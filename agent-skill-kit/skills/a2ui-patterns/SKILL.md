---
name: a2ui-patterns
description: Design safe Agent-to-UI (A2UI) and generative UI patterns using declarative UI intent, trusted component catalogs, hybrid data plus UI outputs, schema validation, and fallback behavior. Use for agent-generated interactive UI, not normal static frontend work.
---

# A2UI Patterns

## When to Use

Use this skill when the task involves:

- agent-generated UI
- A2UI payloads
- declarative UI intent
- trusted component catalogs
- hybrid `data` plus `ui` responses
- schema validation and retry
- safe generative UI
- canvas or interactive agent artifacts

## When Not to Use

Do not use this skill for:

- normal React component implementation
- static UI design
- CSS-only tasks
- MCP tool selection
- A2A agent delegation

## Workflow

1. Decide whether UI adds value beyond text or JSON.
2. Read `references/a2ui-design.md`.
3. Read `references/catalog-security.md` for safe component catalog rules.
4. Read `references/output-patterns.md` to choose LLM-generated UI, tool-template UI, or hybrid output.
5. Use `templates/a2ui-message.json` as a payload shape reference.
6. Define fallback behavior for malformed UI.

## Core Rules

- Agents should declare UI intent, not generate executable UI code.
- The renderer should only use trusted catalog components.
- Production apps should bring their own component catalog.
- Validate A2UI payloads before rendering.
- Provide data output alongside UI when API consumers need it.
- Fall back to text or data when schema validation fails.

## References

- `references/a2ui-design.md`
- `references/catalog-security.md`
- `references/output-patterns.md`

## Templates

- `templates/a2ui-message.json`

## Evals

- `evals/trigger-cases.json`
