# AGENTS.project.md — AI Product Factory (Kaggle Capstone)

Project-specific instructions. Read after `AGENTS.md` and the skill kit map. This file does not repeat universal skill-routing rules — see `AGENTS.md` for those.

## Required Reading Before Substantial Work

1. `AI_Product_Factory_PROJECT_PLAN.md` — product scope, agents, user flow, course concepts, deliverables.
2. `AI_Product_Factory_DEPLOYMENT_PLAN.md` — stack, repo layout, env vars, deployment steps.
3. This file — MVP boundaries and project-specific guardrails.

If anything below conflicts with the two plan files, the plan files win for product/architecture decisions; this file wins for agent behavior and guardrails.

## What This Project Is

A multi-agent system that turns a business idea into a Markdown MVP blueprint (Product Spec → Architecture → Security/Threat Model → Roadmap/Tasks → Readiness Score), with a human approval gate after the Product Spec. It does **not** build the user's product.

## MVP Scope (in scope)

- Business idea intake form.
- Five agents: Business Analyst, Architect, Security, Planning, Evaluation — run via an orchestrator (Next.js API routes or equivalent), not as a generated full app.
- Human approval checkpoint after Product Spec, before Architecture/Security/Roadmap proceed.
- Skill Router that selects relevant skills from `agent-skill-kit/skills` per idea/data sensitivity.
- Markdown export of generated artifacts (`/specs/*.md`, `roadmap.md`, `tasks.md`, `readiness-score.md`).
- Local or remote read-only MCP-style tool layer exposing: `list_skills`, `get_skill`, `recommend_skills`, `score_readiness`.
- Demo mode (`DEMO_MODE=true`) with deterministic mock outputs for reliable judging/recording.
- One committed example generated blueprint under `examples/generated-blueprint/`.

## Out of Scope (do not build unless explicitly requested)

- Generating a complete frontend or backend application for the **user's submitted idea**.
- Production deployment of any generated application.
- Authentication/authorization, user accounts, login flows.
- A persistent database (Postgres/Prisma/Supabase) — MVP storage is request-scoped + Markdown export only.
- Payments, live procurement, or any destructive/real-world action.
- Write access on the MCP server (it is read-only by design — see Security Rules).

## Target Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui — hosted on Vercel.
- **Orchestrator:** Next.js API Routes, TypeScript, Zod for request/response validation, server-side LLM provider wrapper.
- **MCP Skill Server:** Node.js + TypeScript, read-only tools, bundled `agent-skill-kit`; hosted on Render Free (or as a Vercel serverless endpoint for the lowest-cost variant).
- **AI layer:** interchangeable provider wrapper, API key server-side only, mock mode supported.
- **Storage:** none for MVP — local JSON/Markdown export and committed example artifacts only.

Do not introduce NestJS, PostgreSQL, Prisma, or GitHub MCP export unless the user explicitly asks — these are listed only as optional later additions in the deployment plan.

## Development Phases

Follow `AI_Product_Factory_PROJECT_PLAN.md` §15 order. Do not jump ahead to a later phase without confirming the current phase's done criteria are met.

1. **Planning Artifacts** — `PROJECT_PLAN.md`, `docs/course-concepts-map.md`, `docs/demo-scenario.md`, `docs/architecture.md`, one example blueprint.
2. **MVP UI** — idea form, agent workflow screen, approval step, results tabs, export controls.
3. **Agent Orchestrator** — typed agent interfaces, all five agents wired with mock/demo mode support.
4. **Skills and MCP Tooling** — skill metadata reader, skill selection logic, MCP-style tool access, Markdown export.
5. **Security and Evaluation** — sensitive data detection, STRIDE generation, approval-required action detection, readiness scoring.
6. **Polish and Submission** — screenshots, README, writeup draft, video, public link verification.

### Done Criteria Per Pass

Before declaring any implementation pass complete, confirm:

- The change matches the current phase's scope above — nothing from a later phase was added speculatively.
- No auth, database, or full-app generation was introduced (unless the user explicitly asked).
- New API routes validate input with Zod and keep `LLM_API_KEY` server-side only.
- If the MCP server was touched: it remains read-only, cannot read outside `agent-skill-kit/skills`, cannot execute shell commands, and rejects unvalidated input.
- Demo mode still works end-to-end (mock outputs render in all affected screens/tabs).
- Any new Markdown export matches the structure in the project plan (`/specs/`, `roadmap.md`, `tasks.md`, `readiness-score.md`).
- Relevant skill from `agent-skill-kit/skills` was applied (see Skill Usage below) and, for non-trivial changes, `testing-patterns` and `code-review` were run.
- No secrets, `.env.local`, or absolute local paths were committed.

## Security Rules for Public MCP

The MCP Skill Server is public-facing (Render Free) and must stay strictly read-only:

- Only exposes: `list_skills`, `get_skill`, `recommend_skills`, `score_readiness` (optionally `get_course_concepts_map`, `generate_artifact_bundle`, `validate_blueprint`).
- Can only read files under the bundled `agent-skill-kit/skills` path (`SKILL_KIT_PATH`) — never arbitrary filesystem paths.
- Must never execute shell commands, spawn processes, or access secrets/env vars beyond its own config.
- Must never write to the server filesystem.
- All tool inputs must be validated (Zod or equivalent) before use.
- Apply rate limiting where the host supports it (`RATE_LIMIT_REQUESTS_PER_MINUTE`).
- Log tool calls for debugging but never log raw user-submitted business idea content as a persistent record beyond what's needed for the active request.
- Use `agent-security-review` whenever MCP tool surface, input validation, or permissions are touched.

## Deployment Assumptions

- **Primary:** Vercel-first. The Next.js web app, API routes, and agent orchestrator all deploy to Vercel (Hobby tier target, $0/month).
- **Optional:** the public MCP Skill Server may run on Render Free as a separately deployed service (recommended for the competition narrative), or be folded into Vercel serverless endpoints for the lowest-cost variant.
- Render Starter is a fallback only if Render Free proves too slow near the submission deadline — do not default to it.
- No database is assumed in either deployment variant.
- `MCP_SERVER_URL`, `LLM_API_KEY`, and `LLM_PROVIDER` are server-side env vars only — never reference them in client code or with a `NEXT_PUBLIC_` prefix.
- See `AI_Product_Factory_DEPLOYMENT_PLAN.md` §5–§7 for exact env vars, build settings, and cost breakdown before changing deployment config.

## Skill Usage

- Treat `agent-skill-kit/skills` as project-local skills — read `SKILL.md` directly when the runtime can't invoke them as native skills.
- Prioritize for this project: `spec-driven-development` (before any new agent/feature), `mcp-tool-consumption` (MCP server work), `agent-security-review` (MCP, sensitive data, approval gates), `a2a-agent-design` (orchestrator/agent boundaries), `database-design-rules` (only if persistence is explicitly added), `testing-patterns`, `code-review`.
- Route to the narrowest skill per `agent-skill-kit/skill-library-map.md`; do not invoke broad review skills for small, single-layer changes.

## Project-Specific Guardrails

- Do not add authentication, accounts, or session management to the MVP demo — it must work with no login.
- Do not add a database or persistence layer unless the user explicitly requests it; default storage is request-scoped + Markdown export.
- Do not generate a working application for the user's submitted business idea — outputs are planning artifacts only.
- Keep the Product Spec approval gate functional in any UI/orchestrator change — downstream agents (Architect, Security, Planning, Evaluation) must not run before approval.
- Preserve demo mode (`DEMO_MODE=true`) across all changes so judging/recording stays reliable without live LLM calls.
