# AI Product Factory — Web App

Next.js MVP for AI Product Factory. Turns a business idea into a Markdown MVP
blueprint via a multi-agent workflow with a human approval gate. See the
repository root `AI_Product_Factory_PROJECT_PLAN.md`, `AI_Product_Factory_DEPLOYMENT_PLAN.md`,
and `AGENTS.project.md` for full scope and phase boundaries.

This app is part of an npm workspaces monorepo (see the root `package.json`).
Run `npm install` from the **repository root**, not from inside `apps/web`.

## Commands

```bash
# from the repository root
npm install
npm run build:skill-tools   # builds the shared package apps/web depends on
npm run dev:web              # http://localhost:3000
npm run build:web            # production build + type check
```

Or from inside `apps/web` directly (after the root `npm install` and
`npm run build:skill-tools` have run at least once):

```bash
npm run dev
npm run build
npm run start
```

## Environment Variables

| Variable | Default | Notes |
|---|---|---|
| `DEMO_MODE` | `true` (any value other than the literal string `"false"`) | Server-side only. When `false`, `/api/blueprint` returns `501` — live LLM generation is not implemented yet. |
| `SKILL_KIT_PATH` | `../../agent-skill-kit/skills` (resolved relative to `process.cwd()`) | Server-side only. Where `@ai-product-factory/skill-tools` reads `SKILL.md` files from. Read-only. |

See `.env.example` in this directory. No `NEXT_PUBLIC_*` secrets exist in this app. Do not add LLM API keys to client-readable env vars.

## API Routes

- `POST /api/blueprint` — body `{ stage: "spec", idea }` or `{ stage: "blueprint", idea, productSpec, mvpScope }`. Validated with Zod in both directions. See `src/server/schemas.ts`.
- `GET /api/health` — `{ status: "ok", demoMode: boolean }`.

## Architecture

See `../../docs/architecture.md` for the current request flow (UI → `/api/blueprint` → orchestrator → typed demo agents) and the full monorepo/package structure.

## Agents

Each agent in `src/server/agents/` implements `IAgent<TInput, TOutput>` (`src/types/agents.ts`) and currently returns deterministic template output — no real LLM calls. The orchestrator (`src/server/orchestrator.ts`) chains them: Business Analyst runs before the Product Spec approval gate; Architect → Security → Planning → Evaluation run after approval, each receiving the prior agent's output.

## Skill Tools

This app depends on `@ai-product-factory/skill-tools` (`packages/skill-tools`), an npm workspace package shared with `packages/mcp-skill-server`. The orchestrator calls `recommendSkillsDirect(idea, 5)` from it during the `spec` stage and returns the result as `selectedSkills`, rendered by `SelectedSkillsPanel` on the approval and results screens.

This app calls the skill tools **in-process** — it does not make a network call to the public MCP server in `packages/mcp-skill-server`. That server (Phase 4B) is an independently deployable exposure of the same shared logic over MCP, not a dependency of this app. See `../../docs/architecture.md` and `../../packages/mcp-skill-server/README.md` for that server's design, tool list, and Render deployment settings.
