# Agent Instructions

Use this project with the shared skill library in:

```text
./agent-skill-kit/skills
```

Before starting substantial work, read:

```text
./agent-skill-kit/skill-library-map.md
```

These skills are project-local files. If your agent runtime cannot invoke them as registered native skills, read the relevant file directly:

```text
./agent-skill-kit/skills/<skill-name>/SKILL.md
```

## Optional Project Context

This skill kit is project-agnostic and works without additional project files.

If the repository includes project-specific context files, read them after this file and before substantial work:

- `AGENTS.project.md`
- `PROJECT_PLAN.md`
- `DEPLOYMENT_PLAN.md`
- `docs/project-brief.md`

Project-specific context may define product goals, stack choices, scope boundaries, deployment targets, security requirements, or delivery phases.

If none of these files exist, proceed using this `AGENTS.md`, `agent-skill-kit/skill-library-map.md`, and the narrowest relevant skill for the user's request.

When project-specific instructions conflict with this file, follow the more specific project instruction unless it weakens safety, security, review discipline, or explicit user instructions.

## Skill Routing

Use the narrowest relevant skill:

- `spec-driven-development` before coding unclear features.
- `react-enterprise-rules` for React, TypeScript frontend, FSD, Redux, Tailwind, shadcn/ui, Radix.
- `frontend-production-review` for senior frontend production reviews with architecture, code quality, tests, and performance sections.
- `nextjs-route-handler-proxy` for Next.js App Router route handlers that proxy backend APIs and keep `API_URL` server-side.
- `pwa-rules` for PWA manifest, service workers, cache strategy, offline UX, installability, and update behavior.
- `nestjs-backend-rules` for NestJS backend code.
- `database-design-rules` for PostgreSQL, Prisma, Supabase, schema, migrations, indexes.
- `testing-patterns` for unit, integration, e2e, Playwright, and regression test strategy.
- `browser-test-cases` for `.claude/test-cases.json` browser scenario execution and analysis.
- `typescript-code-review` for focused TypeScript code review.
- `code-review` for PR-level review and merge readiness.
- `agent-security-review` for auth, secrets, sensitive data, MCP/tools, production actions.
- `mcp-tool-consumption` for MCP adoption, debugging, permissions, and tool governance.
- `observability-rules` for traces, audit logs, cost, eval telemetry, and debugging.
- `a2a-agent-design` for Agent Cards, registries, and remote specialist agents.
- `a2ui-patterns` for safe agent-generated UI and trusted component catalogs.
- `agentic-commerce-rules` for agentic payments, ordering, spending limits, receipts, and approvals.

## Workflow

For new features:

1. Start with `spec-driven-development`.
2. Use implementation skills for the affected layer.
3. Use `nextjs-route-handler-proxy` when the feature touches Next.js App Router proxy routes.
4. Use `pwa-rules` when the feature touches installability, service workers, cache storage, offline behavior, or app update UX.
5. Use `testing-patterns`.
6. Use `browser-test-cases` when validating saved browser scenarios.
7. Use `typescript-code-review`.
8. Use `frontend-production-review` for senior frontend production reviews.
9. Use `agent-security-review` when sensitive data, permissions, tools, production, or external actions are involved.
10. Use `code-review` before merge.

## Guardrails

- Do not perform destructive actions without explicit approval.
- Do not add dependencies without explaining why.
- Do not use unverified public MCP servers with production data.
- Keep diffs focused.
- Add or update tests for meaningful behavior changes.
- Report assumptions, checks run, and residual risk.
