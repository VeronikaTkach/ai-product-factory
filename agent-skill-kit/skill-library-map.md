# Skill Library Map

## Purpose

This map explains when to use each skill in `./skills/` and how to combine them during agent-assisted development.

Use it as an operating guide, not as a replacement for the skills themselves.

## Skill Roles

## Planning

### spec-driven-development

Use before coding when the requirement is still fuzzy.

Best for:

- feature specs
- acceptance criteria
- BDD scenarios
- API and data model planning
- implementation prompts for coding agents

## Frontend Implementation

### react-enterprise-rules

Use when generating, refactoring, or reviewing frontend application code.

Best for:

- React components
- hooks
- FSD architecture
- Redux Toolkit usage
- API clients
- Tailwind, shadcn/ui, Radix UI conventions

### pwa-rules

Use when a frontend app is installable, offline-capable, or uses service workers, Web App Manifest, Cache Storage, push notifications, background sync, or app update flows.

Best for:

- PWA planning and review
- Web App Manifest
- service worker lifecycle
- cache strategy
- offline and poor-network UX
- app update prompts
- installability checks
- Lighthouse PWA checks
- browser/device validation

## Backend Implementation

### nestjs-backend-rules

Use when generating, refactoring, or reviewing backend application code.

Best for:

- NestJS modules
- controllers
- services
- DTOs
- guards
- Prisma-backed service methods
- backend validation and authorization boundaries

## Database Design

### database-design-rules

Use when schema, migrations, indexes, constraints, or data integrity are involved.

Best for:

- PostgreSQL modeling
- Prisma schema review
- Supabase/RLS notes
- migration planning
- query performance review

## MCP and Tool Access

### mcp-tool-consumption

Use when connecting, auditing, debugging, or governing MCP servers and tools.

Best for:

- MCP adoption decisions
- stdio vs remote transport
- public MCP audit
- read-only vs write access
- tool schema debugging
- MCP Inspector workflows
- tool permission policies

## Agent-to-Agent Design

### a2a-agent-design

Use when a workflow needs delegation to a specialist agent rather than a bounded tool call.

Best for:

- tool vs agent decisions
- Agent Cards
- agent registries
- orchestrator and specialist boundaries
- remote specialist agents
- A2A trust and failure behavior

## Agent-to-UI Design

### a2ui-patterns

Use when an agent should return safe interactive UI instead of plain text or raw JSON.

Best for:

- A2UI payloads
- trusted component catalogs
- hybrid `data` plus `ui` outputs
- schema validation and fallback
- safe generative UI patterns

## Agentic Commerce

### agentic-commerce-rules

Use only when agents can transact, order, reserve, pay, refund, or initiate commerce actions.

Best for:

- AP2/UCP-style workflows
- purchasing policies
- spending limits
- payment consent
- receipts and audit trails
- refund/dispute readiness

## Testing

### testing-patterns

Use when deciding what tests to write or when a bug fix needs a regression test.

Best for:

- unit vs integration vs e2e decisions
- React tests
- NestJS tests
- API tests
- Playwright checks
- regression-first bug workflow

## Specialized Code Review

### typescript-code-review

Use for focused TypeScript code review.

Best for:

- typing issues
- async/error handling
- React correctness
- NestJS correctness
- Prisma query code
- architecture boundaries inside code

## PR and Integration Review

### code-review

Use for PR-level review and merge readiness.

Best for:

- PR summaries
- risk assessment
- required checks
- merge recommendation
- routing to specialized review skills

## Security Review

### agent-security-review

Use as a security gate when changes touch sensitive actions or data.

Best for:

- auth/authz
- secrets
- PII
- database writes/deletes
- MCP/tool permissions
- external communications
- production actions
- Effective Trust controls

## Observability

### observability-rules

Use when agent behavior must be explainable, auditable, measurable, or debuggable.

Best for:

- agent traces
- tool call logs
- audit events
- token and cost tracking
- self-repair loop analysis
- eval telemetry
- production incident forensics

## Recommended Workflows

## New Feature

1. `spec-driven-development`
2. `react-enterprise-rules` and/or `nestjs-backend-rules`
3. `pwa-rules` if installability, service workers, offline behavior, or cache storage are involved
4. `database-design-rules` if persistence changes
5. `testing-patterns`
6. `typescript-code-review`
7. `agent-security-review` if sensitive
8. `code-review`

## PWA Feature or App

1. `spec-driven-development`
2. `react-enterprise-rules`
3. `pwa-rules`
4. `testing-patterns`
5. `agent-security-review` if offline data, auth, push, payments, or sensitive cached data are involved
6. `typescript-code-review`
7. `code-review`

## Backend Endpoint

1. `spec-driven-development`
2. `nestjs-backend-rules`
3. `database-design-rules` if persistence changes
4. `testing-patterns`
5. `typescript-code-review`
6. `agent-security-review`
7. `code-review`

## MCP Integration

1. `spec-driven-development` if the workflow is not clear
2. `mcp-tool-consumption`
3. `agent-security-review`
4. `observability-rules` for tool call logs and audit needs
5. `code-review` if repository changes are made

## Multi-Agent Workflow

1. `spec-driven-development`
2. `a2a-agent-design`
3. `mcp-tool-consumption` for tools used by each agent
4. `agent-security-review`
5. `observability-rules`
6. `testing-patterns`
7. `code-review`

## Generative UI Workflow

1. `spec-driven-development`
2. `a2ui-patterns`
3. `react-enterprise-rules` for renderer/catalog implementation
4. `agent-security-review` if UI actions mutate state
5. `testing-patterns`
6. `code-review`

## Agentic Commerce Workflow

1. `spec-driven-development`
2. `agentic-commerce-rules`
3. `agent-security-review`
4. `observability-rules`
5. `database-design-rules` if transactions are persisted
6. `testing-patterns`
7. `code-review`

## Frontend Feature

1. `spec-driven-development` if behavior is not obvious
2. `react-enterprise-rules`
3. `testing-patterns`
4. `typescript-code-review`
5. `code-review`

## Database Migration

1. `database-design-rules`
2. `nestjs-backend-rules` if application code changes
3. `testing-patterns`
4. `agent-security-review` for destructive or production data changes
5. `code-review`

## Bug Fix

1. `testing-patterns` for failing test or reproduction
2. implementation skill for the affected layer
3. `typescript-code-review`
4. `agent-security-review` if sensitive
5. `code-review`

## PR Review

1. `code-review`
2. Route to `typescript-code-review`, `database-design-rules`, `testing-patterns`, `mcp-tool-consumption`, `observability-rules`, or `agent-security-review` based on risk.

## Routing Rule

Use the narrowest skill that can do the job.

Use `code-review` only when reviewing a broad diff or deciding merge readiness.

Use protocol-specific skills only when the protocol is part of the problem:

- MCP for tools.
- A2A for agent delegation.
- A2UI for generated UI.
- Agentic commerce for transactions.
