# AI Product Factory

**Kaggle AI Agents Capstone — Agents for Business track.**

A multi-agent system that turns a raw business idea into an implementation-ready MVP blueprint — Product Specification, Architecture, Security/Threat Model, Roadmap, Tasks, and a Readiness Score — with a human approval checkpoint after the Product Spec. It does **not** generate the user's actual product; outputs are planning artifacts only.

See `AI_Product_Factory_PROJECT_PLAN.md` for full product scope, `AI_Product_Factory_DEPLOYMENT_PLAN.md` for the original deployment plan, and `AGENTS.project.md` for the phase-by-phase guardrails this project was built under.

## Architecture

```text
ai-product-factory/ (npm workspaces: apps/*, packages/*)
  apps/web/                   -- Next.js UI + agent orchestrator API (deploy to Vercel)
  packages/
    skill-tools/              -- shared, read-only skill access + readiness heuristic
    mcp-skill-server/         -- public MCP server over skill-tools (deploy to Render Free)
  agent-skill-kit/skills/     -- the actual skill content (read-only source of truth)
  examples/generated-blueprint/  -- one committed example output (KnitConnect scenario)
  docs/                       -- architecture, course-concepts map, demo scenario
```

- **apps/web** — business idea form → visible multi-agent workflow → Product Spec approval gate → results tabs (Product Spec, MVP Scope, Architecture, Security, Roadmap, Tasks, Readiness Score) → Markdown export. Agents are deterministic demo-mode implementations today (no LLM calls yet); `DEMO_MODE=true` is the only implemented path.
- **packages/skill-tools** — read-only access to `agent-skill-kit/skills`: list/get/recommend skills and a content-length readiness heuristic. Shared by both `apps/web` (in-process) and `packages/mcp-skill-server` (over MCP) — neither duplicates the logic.
- **packages/mcp-skill-server** — exposes the same logic as a public, read-only MCP server (`list_skills`, `get_skill`, `recommend_skills`, `score_readiness`) over Streamable HTTP, independently deployable from the web app.

Full detail: `docs/architecture.md` (current implementation state, phase by phase) and `docs/course-concepts-map.md` (how this maps to the course concepts).

## Local Setup

Requires Node.js 20+ and npm 9+ (workspaces support). Run everything from the **repository root** — not from inside `apps/web` or `packages/*` — so npm can resolve the workspace dependency.

```bash
npm install
npm run build:skill-tools   # compiles the shared package; required before web/mcp build or start
```

## Web App Commands

```bash
npm run dev:web      # http://localhost:3000
npm run build:web     # production build (requires build:skill-tools first)
npm run start:web     # serve the production build
```

Equivalent commands also work from inside `apps/web/` directly (`npm run dev`, `npm run build`, `npm run start`), as long as `npm install` and `npm run build:skill-tools` have already run from the root at least once.

See `apps/web/README.md` for API routes and agent details.

## MCP Server Commands

```bash
npm run dev:mcp       # tsx watch, http://localhost:3001
npm run build:mcp     # production build (requires build:skill-tools first)
npm run start:mcp     # serve the production build
```

See `packages/mcp-skill-server/README.md` for the tool list and how to call it with an MCP client.

## Deploying to Vercel (apps/web)

| Setting | Value |
|---|---|
| Framework Preset | Next.js |
| Root Directory | `apps/web` |
| Install Command (override) | `cd ../.. && npm install` |
| Build Command (override) | `cd ../../packages/skill-tools && npm run build && cd ../../apps/web && npm run build` |
| Output Directory | `.next` (default) |

Why the overrides: this is an npm workspaces monorepo, and `packages/skill-tools` must be installed *and compiled* (`tsc` to `dist/`) before `apps/web`'s build can resolve `@ai-product-factory/skill-tools`. The explicit `cd` commands remove any dependency on a build platform auto-detecting the workspace correctly.

Verified locally: a clean build's `.next/server/app/api/blueprint/route.js.nft.json` includes all files under `agent-skill-kit/skills/` (via `outputFileTracingIncludes` in `apps/web/next.config.mjs`), and `next start` correctly serves skill recommendations from that build — see `docs/architecture.md` for detail. This was the one real risk for a Vercel deployment of this monorepo and it is now fixed and verified, not just documented as a caveat.

### Environment Variables (Vercel)

| Variable | Required | Notes |
|---|---|---|
| `DEMO_MODE` | No (defaults to `true`) | Server-side only. Set to `false` only once a real LLM path exists — today that returns `501`. |
| `SKILL_KIT_PATH` | No | Only needed if you change the repository layout; the default resolves correctly as long as `apps/web` stays two directories below the repo root. |

No `NEXT_PUBLIC_*` variables exist in this app. Do not add any LLM API key with a `NEXT_PUBLIC_` prefix.

## Deploying to Render Free (packages/mcp-skill-server)

| Setting | Value |
|---|---|
| Root Directory | *(leave blank — repository root)* |
| Build Command | `npm install && npm run build:skill-tools && npm run build --workspace=packages/mcp-skill-server` |
| Start Command | `npm run start --workspace=packages/mcp-skill-server` |
| Health Check Path | `/health` |

Root Directory must be the repository root (not `packages/mcp-skill-server`) so npm can resolve the local `@ai-product-factory/skill-tools` workspace dependency. Render still injects `PORT` automatically and runs both commands with `cwd` at the repository root; `npm run ... --workspace=packages/mcp-skill-server` itself changes the running process's `cwd` to `packages/mcp-skill-server` (verified locally), which is exactly what the default `SKILL_KIT_PATH` resolution expects.

### Environment Variables (Render)

| Variable | Required | Notes |
|---|---|---|
| `HOST` | Yes | Set to `0.0.0.0` — Render requires binding to all interfaces. |
| `PORT` | No | Injected automatically by Render; do not set manually. |
| `ALLOWED_ORIGIN` | Recommended | The deployed Vercel app's URL. Restricts the `Host` header this server accepts (DNS-rebinding mitigation). Leave unset only for local-only use. |
| `RATE_LIMIT_REQUESTS_PER_MINUTE` | No (defaults to `60`) | Per-IP, in-memory, fixed-window limit on `POST /mcp`. |
| `SKILL_KIT_PATH` | No | Only needed if you change the repository layout; the default (`../../agent-skill-kit/skills`, resolved from this package's `cwd`) works for both local dev and this Render configuration. |
| `MCP_SERVER_NAME` | No | Cosmetic name reported in MCP `initialize` and `GET /health`. |
| `MCP_LOG_LEVEL` | No (defaults to `info`) | `"info"` or `"silent"`. Tool-call logs never include raw request bodies or business idea text. |

See `packages/mcp-skill-server/.env.example` for the same list with inline comments.

## Security Notes

- **No auth, no database, no real LLM calls** — out of scope by explicit project decision; see `AGENTS.project.md`.
- **No secrets required anywhere in this repo.** `apps/web` has nothing beyond `DEMO_MODE`/`SKILL_KIT_PATH`; `packages/mcp-skill-server` calls no LLM or third-party API and needs no credentials.
- **MCP server is strictly read-only.** It can only read files under `agent-skill-kit/skills` (or `SKILL_KIT_PATH`); a skill `id` is validated by Zod and then checked against a live directory listing before touching any path, so path traversal is rejected by construction, not by blacklist. It never writes files or executes shell commands. Verified with a live MCP client, including a rejected `../../../etc/passwd` attempt.
- **Every tool/API input is validated with Zod** at the boundary, both for `apps/web`'s `/api/blueprint` and for each MCP tool (validated twice: once by the MCP SDK's own schema enforcement, once inside the shared tool function).
- **Rate limiting and safe logging** on the public MCP server — see `packages/mcp-skill-server/README.md` for the full list of controls.
- `.gitignore` excludes `.env`/`.env.*` (except `.env.example`) at every level of this monorepo; no `.env` file is committed.

## Deployment Checklist

- [x] Monorepo builds cleanly from a clean state, in dependency order, from the repository root (`npm run build`).
- [x] `apps/web` production build + `next start` verified locally, including a real `/api/blueprint` call.
- [x] `packages/mcp-skill-server` production build + start verified locally, including a real MCP client call to all four tools, a path-traversal rejection, and rate-limit enforcement.
- [x] No absolute local filesystem paths anywhere in source — all path resolution is `process.cwd()`-relative (see `packages/skill-tools/src/reader.ts`).
- [x] No secrets committed; `.gitignore` covers `.env`/`.env.*` at every package level.
- [x] `SKILL_KIT_PATH` default verified to resolve correctly both for local dev (`npm run dev:web`, `npm run dev:mcp`) and for the Render-style invocation (`npm run start --workspace=packages/mcp-skill-server` from the repo root).
- [x] Vercel file-tracing gap fixed and verified (`outputFileTracingIncludes` in `apps/web/next.config.mjs`; confirmed via the build's `.nft.json` trace file).
- [ ] Actually deployed to Vercel and Render — not done in this environment (no Vercel/Render account access here); settings above are ready to use.
- [ ] Public URLs added to the Kaggle Writeup once deployed.
