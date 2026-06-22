# Agentic Engineering Skill Kit

A portable skill library for agent-assisted software development.

This kit packages reusable agent skills, routing guidance, and roadmap documents for building production-minded agentic workflows around TypeScript, React, Next.js, PWA, NestJS, PostgreSQL, Prisma, MCP, browser validation, security review, evaluation, observability, A2A, A2UI, and agentic commerce patterns.

## What's Included

- `skills/` - reusable agent skills.
- `skill-library-map.md` - when to use each skill and how to combine them.
- `AGENTS.template.md` - starter instructions for new projects.
- `docs/` - roadmap documents.
- `examples/` - usage examples.

## Skills

- `spec-driven-development`
- `react-enterprise-rules`
- `frontend-production-review`
- `nextjs-route-handler-proxy`
- `pwa-rules`
- `nestjs-backend-rules`
- `database-design-rules`
- `testing-patterns`
- `browser-test-cases`
- `typescript-code-review`
- `code-review`
- `agent-security-review`
- `mcp-tool-consumption`
- `observability-rules`
- `a2a-agent-design`
- `a2ui-patterns`
- `agentic-commerce-rules`

## Use in a New Project

### Option 1: Copy the Kit

```bash
cp -R agent-skill-kit /path/to/my-project/agent-skill-kit
cp /path/to/my-project/agent-skill-kit/AGENTS.template.md /path/to/my-project/AGENTS.md
```

### Option 2: Git Submodule

```bash
git submodule add https://github.com/VeronikaTkach/agentic-engineering-skill-kit.git agent-skill-kit
cp agent-skill-kit/AGENTS.template.md AGENTS.md
```

Then tell your coding agent:

```text
Work according to AGENTS.md. Before substantial work, read agent-skill-kit/skill-library-map.md and use the narrowest relevant skill from agent-skill-kit/skills.
```

Note: these are project-local skills. If your agent runtime cannot invoke them as native registered skills, ask it to read the relevant skill file directly:

```text
agent-skill-kit/skills/<skill-name>/SKILL.md
```

## Public MCP Access

The skill library is also available through a public, read-only MCP Skill Server:

```text
https://ai-product-factory-mcp.onrender.com/mcp
```

Health check:

```text
https://ai-product-factory-mcp.onrender.com/health
```

Use this option when your agent client supports the MCP Streamable HTTP transport and you want to discover or retrieve skills without vendoring the kit into a project.

Available tools:

- `list_skills` - list available skills and metadata.
- `get_skill` - retrieve a specific skill by id.
- `recommend_skills` - recommend skills for a project or business idea context.
- `score_readiness` - compute a simple readiness score for generated blueprint artifacts.

Example client setup, adapted to your MCP-compatible tool:

```json
{
  "name": "agentic-engineering-skill-kit",
  "transport": "streamable-http",
  "url": "https://ai-product-factory-mcp.onrender.com/mcp"
}
```

Limitations:

- The public MCP server is read-only. It cannot write files, execute commands, access secrets, or read arbitrary filesystem paths.
- It exposes only the bundled skill content and lightweight recommendation/scoring tools.
- It is hosted on Render Free, so the first request after inactivity can take 30-90 seconds while the service wakes up.
- Availability is best-effort for demonstration and experimentation. For production workflows, vendor the kit into your project or deploy your own MCP server.
- Client configuration differs across Claude, Cursor, Codex, and other MCP clients. Use the endpoint above with any client that supports Streamable HTTP MCP servers.

## Optional Project Context

The kit works out of the box with only:

```text
AGENTS.md
agent-skill-kit/
```

For projects with a defined scope, stack, deadline, security model, or deployment target, add optional project-specific context files at the repository root:

- `AGENTS.project.md` - local agent instructions and scope boundaries.
- `PROJECT_PLAN.md` - product goals, phases, and deliverables.
- `DEPLOYMENT_PLAN.md` - hosting, stack, environment, and release rules.
- `docs/project-brief.md` - concise product or business context.

The generated `AGENTS.md` tells agents to read these files when they exist. If none are present, agents proceed with the base skill routing guidance.

## Quick Prompts

Use these prompts as starting points.

### Start a Project Session

```text
Work according to AGENTS.md. Read agent-skill-kit/skill-library-map.md first, then choose the narrowest relevant skill for the task.
If a skill is not registered in your runtime, read its local SKILL.md file directly from agent-skill-kit/skills.
```

### Create a Feature Spec

```text
Use spec-driven-development to create a feature spec for [feature]. Include acceptance criteria, BDD scenarios, API contract, data model notes, security notes, and testing plan. Do not implement yet.
```

### Implement an Approved Spec

```text
Implement the approved spec. Use react-enterprise-rules for frontend, nestjs-backend-rules for backend, database-design-rules for persistence changes, and testing-patterns for tests.
```

### Build or Review a PWA

```text
Use pwa-rules for this PWA work. Cover manifest, service worker strategy, offline/online UX, cache invalidation, app update behavior, installability, Lighthouse checks, and browser/device testing.
```

### Senior Frontend Production Review

```text
Use frontend-production-review. Ask whether this is a BIG or SMALL review, then review architecture, code quality, tests, and performance with concrete tradeoffs and recommendations.
```

### Next.js Route Handler Proxy

```text
Use nextjs-route-handler-proxy for this Next.js App Router API proxy work. Client code must call local route handlers only; API_URL must stay server-side.
```

### Browser Test Case

```text
Use browser-test-cases to run the [case id] case from .claude/test-cases.json. Report console errors, page errors, failed requests, final URL, and pass/fail status.
```

### Focused TypeScript Review

```text
Review this diff with typescript-code-review. Focus on typing, async behavior, framework boundaries, and error handling.
```

### PR-Level Review

```text
Run code-review for this PR. Include findings, required checks, specialized reviews needed, merge recommendation, and residual risk.
```

### Security Review

```text
Use agent-security-review for this change. Focus on authorization, sensitive data exposure, tool permissions, high-risk actions, and approval requirements.
```

## Recommended Workflow

For new features:

1. Start with `spec-driven-development`.
2. Use implementation skills for affected layers.
3. Use `nextjs-route-handler-proxy` when a Next.js App Router project proxies backend APIs through route handlers.
4. Use `pwa-rules` when the app is installable, offline-capable, or uses service workers/cache storage.
5. Use `testing-patterns`.
6. Use `browser-test-cases` when validating saved browser scenarios.
7. Use `typescript-code-review`.
8. Use `frontend-production-review` for senior frontend production reviews.
9. Use `agent-security-review` when sensitive data, permissions, tools, production, or external actions are involved.
10. Use `code-review` before merge.

## Status

Current version: `0.1.0`

This is an initial course-derived kit. It should be tested on real project cases before treating it as stable.
