---
name: mcp-tool-consumption
description: Choose, audit, connect, debug, and govern MCP servers and tools. Use for MCP integration planning, public MCP review, tool permission scoping, stdio/SSE transport decisions, MCP Inspector workflows, and read/write policy decisions.
---

# MCP Tool Consumption

## When to Use

Use this skill when the task involves:

- choosing whether to use or build an MCP server
- connecting a tool through MCP
- auditing a public MCP server
- debugging MCP tool schemas or calls
- deciding stdio vs remote transport
- scoping MCP permissions
- making MCP read-only or approval-gated
- designing an MCP tool registry

## When Not to Use

Do not use this skill for:

- generic API integration with no MCP
- frontend component work
- NestJS-only backend structure
- A2A agent delegation
- PR review without MCP/tool concerns

## Workflow

1. Identify the external system and the action type: read, write, delete, send, deploy.
2. Read `references/mcp-consumption.md` for selection and transport rules.
3. Read `references/mcp-security.md` for public server, credentials, scope, and production risk.
4. Read `references/mcp-debugging.md` when tool calls fail or schemas are unclear.
5. Use `templates/mcp-adoption-checklist.md` for adoption decisions.
6. Report recommended access mode: forbidden, read-only, approval-required, or auto-approved.

## Core Rules

- Do not build a custom wrapper when a trusted MCP server already exists.
- Do not use unverified public MCP servers in production.
- Prefer read-only access until write operations are justified.
- Scope every MCP server to the smallest useful project, repo, dataset, or environment.
- Keep credentials outside prompts and source control.
- Use MCP Inspector or raw transport debugging before changing prompts.
- Log tool usage for audit.

## Output Expectations

When recommending an MCP:

- state why MCP is appropriate
- identify trust level
- identify transport
- identify permissions
- identify credential handling
- identify audit and approval needs

## References

- `references/mcp-consumption.md`
- `references/mcp-security.md`
- `references/mcp-debugging.md`

## Templates

- `templates/mcp-adoption-checklist.md`

## Evals

- `evals/trigger-cases.json`
