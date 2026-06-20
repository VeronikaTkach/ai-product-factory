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
| `MCP_SERVER_URL` | unset (local fallback always used) | Server-side only, never exposed to the client. Deployed MCP server URL including `/mcp`. See "Skill Tools" below. |
| `MCP_TIMEOUT_MS` | `4000` | Per-request timeout (ms) for the `MCP_SERVER_URL` call. |

See `.env.example` in this directory. No `NEXT_PUBLIC_*` secrets exist in this app. Do not add LLM API keys to client-readable env vars.

## API Routes

- `POST /api/blueprint` — body `{ stage: "spec", idea }` or `{ stage: "blueprint", idea, productSpec, mvpScope }`. Validated with Zod in both directions. See `src/server/schemas.ts`.
- `GET /api/health` — `{ status: "ok", demoMode: boolean }`.

## Architecture

See `../../docs/architecture.md` for the current request flow (UI → `/api/blueprint` → orchestrator → typed demo agents) and the full monorepo/package structure.

## Agents

Each agent in `src/server/agents/` implements `IAgent<TInput, TOutput>` (`src/types/agents.ts`) and currently returns deterministic template output — no real LLM calls. The orchestrator (`src/server/orchestrator.ts`) chains them: Business Analyst runs before the Product Spec approval gate; Architect → Security → Planning → Evaluation run after approval, each receiving the prior agent's output.

## Skill Tools

This app depends on `@ai-product-factory/skill-tools` (`packages/skill-tools`), an npm workspace package shared with `packages/mcp-skill-server`. During the `spec` stage, the orchestrator (`src/server/orchestrator.ts`) resolves `selectedSkills` via **MCP-first with a local fallback**:

1. If `MCP_SERVER_URL` is set, `src/server/mcp-client.ts` calls the public MCP server's `recommend_skills` tool (bounded by `MCP_TIMEOUT_MS`, default 4000ms) and validates the response shape before using it.
2. On any failure — `MCP_SERVER_URL` unset, network error, timeout, rate limit (HTTP 429), an `isError` tool result, or a response that fails validation — it falls back to `recommendSkillsDirect(idea, 5)` from `@ai-product-factory/skill-tools`, in-process, with no user-visible error.

The API response includes `skillsSource: "mcp" | "local"` alongside `selectedSkills`, rendered as a small badge by `SelectedSkillsPanel` on the approval and results screens. Failure warnings are logged server-side with the failure reason only — never the submitted business idea text.

This app calling the MCP server is optional and additive: with `MCP_SERVER_URL` unset, behavior is identical to Phase 4A/4B (always local). See `../../docs/architecture.md` and `../../packages/mcp-skill-server/README.md` for that server's design, tool list, and Render deployment settings.
