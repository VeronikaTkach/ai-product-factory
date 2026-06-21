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

- **apps/web** — business idea form → visible multi-agent workflow → Product Spec approval gate → results tabs (Product Spec, MVP Scope, Architecture, Security, Roadmap, Tasks, Readiness Score) → Markdown export. The Product Spec is always deterministic. Architecture/Security/Roadmap/Tasks support two generation modes, chosen via a switcher in the UI: deterministic **Demo Mode** (default, always available) or **Live Gemini Mode** (optional, server-gated — see below). The **Readiness Score is always computed deterministically in both modes** by the same Evaluation logic, scoring whichever Architecture/Security/Roadmap/Tasks text was just produced — so it's consistently rich (component scores, interpretation, skills applied, "How to improve this score") regardless of generation mode.
- **packages/skill-tools** — read-only access to `agent-skill-kit/skills`: list/get/recommend skills and a content-length readiness heuristic. Shared by both `apps/web` and `packages/mcp-skill-server` — neither duplicates the logic.
- **packages/mcp-skill-server** — exposes the same logic as a public, read-only MCP server (`list_skills`, `get_skill`, `recommend_skills`, `score_readiness`) over Streamable HTTP, independently deployable from the web app.

**Skill recommendation is MCP-first with a local fallback.** When `MCP_SERVER_URL` is set, `apps/web`'s spec stage tries the public MCP server's `recommend_skills` tool first (bounded by `MCP_TIMEOUT_MS`); on any failure — network error, timeout, rate limit, or an invalid response — it falls back to `@ai-product-factory/skill-tools` in-process automatically, with no user-visible error. The API response includes `skillsSource: "mcp" | "local"` so the UI can show which path produced the result. See `docs/architecture.md` for the full design.

**Recommended skills are a starting point, not the final answer.** Before approving the Product Spec, the user sees the full skill catalog (`GET /api/skills`, read from `agent-skill-kit/skills` via `skill-tools`) as an editable checklist: recommended skills are pre-checked with their recommendation reason, `spec-driven-development` is always selected and can't be unchecked, and the user can check/uncheck anything else or reset back to the recommendation. The *final* selection — not the original recommendation — is sent to the blueprint stage. In **Demo Mode** it deterministically changes the generated Architecture, Security, Roadmap, Tasks, and Readiness Score sections via fixed skill-to-bullets rules (no LLM call; see "Skill-Informed Enrichment" in `docs/architecture.md`). In **Live Gemini Mode**, the same selected skills' full guidance is sent as prompt context so the model's output is shaped by them. From the results screen, "Adjust skills and regenerate" returns to this same screen (Product Spec and skill selection preserved) to try a different selection or mode.

**Live Gemini Mode is optional and off by default.** Demo Mode always works, with or without any Gemini configuration. Live Gemini only runs when the server has `ENABLE_LIVE_AI=true`, `LLM_PROVIDER=gemini`, and `LLM_API_KEY` set, and the caller hasn't exhausted a per-user daily quota (`LIVE_AI_DAILY_LIMIT`, default 10) tracked via an anonymous, PII-free cookie. Any Live failure (unavailable, rate-limited, timeout, invalid output) shows a clear message with a one-click "Switch to Demo Mode" action — see "Live Gemini Mode" in `apps/web/README.md` and `docs/architecture.md` for the full design, including documented limitations of the in-memory daily limit on serverless deployments.

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
| `DEMO_MODE` | No (defaults to `true`) | Server-side only, reported by `/api/health`; no longer gates anything (superseded by per-request `generationMode` + `ENABLE_LIVE_AI`). |
| `SKILL_KIT_PATH` | No | Only needed if you change the repository layout; the default resolves correctly as long as `apps/web` stays two directories below the repo root. |
| `MCP_SERVER_URL` | No | Server-side only, never exposed to the client. The deployed MCP server's URL including `/mcp`, e.g. `https://ai-product-factory-mcp.onrender.com/mcp`. When set, the spec stage tries `recommend_skills` there first, falling back to local `skill-tools` on any failure. Leave unset to always use the local package. |
| `MCP_TIMEOUT_MS` | No (defaults to `4000`) | Per-request timeout for the `MCP_SERVER_URL` call above. Recommended range 3000-5000ms. |
| `ENABLE_LIVE_AI` | No (defaults to `false`) | Server-side kill switch for Live Gemini Mode. Must be `true`, alongside `LLM_PROVIDER=gemini` and `LLM_API_KEY`, for the Live option to work — otherwise it returns a clear "not configured" error and Demo Mode remains available. |
| `LLM_PROVIDER` | Only if enabling Live | Must be exactly `gemini` — the only implemented provider. |
| `LLM_API_KEY` | Only if enabling Live | Server-side only, never exposed to the client, never logged. |
| `LLM_MODEL` | No (defaults to `gemini-2.5-flash`) | Gemini model id; free-tier quota varies by Google Cloud project. |
| `LLM_TIMEOUT_MS` | No (defaults to `30000`) | Per-request timeout for the Gemini call. |
| `LIVE_AI_DAILY_LIMIT` | No (defaults to `10`) | Per-anonymous-user, per-UTC-day cap on Live Gemini requests — see the in-memory-limiter caveat below. |

No `NEXT_PUBLIC_*` variables exist in this app. Do not add any LLM API key — or `MCP_SERVER_URL` — with a `NEXT_PUBLIC_` prefix.

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
| `ALLOWED_ORIGIN` | Recommended | **This MCP server's own public Render URL** (e.g. `https://ai-product-factory-mcp.onrender.com`) — **not** the Vercel frontend's URL. Restricts the `Host` header this server accepts (DNS-rebinding mitigation), not browser CORS. Setting it to the Vercel URL instead causes Render's own health check to fail. Leave unset only for local-only use. |
| `RATE_LIMIT_REQUESTS_PER_MINUTE` | No (defaults to `60`) | Per-IP, in-memory, fixed-window limit on `POST /mcp`. |
| `SKILL_KIT_PATH` | No | Only needed if you change the repository layout; the default (`../../agent-skill-kit/skills`, resolved from this package's `cwd`) works for both local dev and this Render configuration. |
| `MCP_SERVER_NAME` | No | Cosmetic name reported in MCP `initialize` and `GET /health`. |
| `MCP_LOG_LEVEL` | No (defaults to `info`) | `"info"` or `"silent"`. Tool-call logs never include raw request bodies or business idea text. |

See `packages/mcp-skill-server/.env.example` for the same list with inline comments.

## Security Notes

- **No auth, no database** — out of scope by explicit project decision; see `AGENTS.project.md`.
- **Real LLM calls exist only behind Live Gemini Mode**, off by default and gated server-side by three env vars plus a per-user daily quota — see "Live Gemini Mode" in `apps/web/README.md`. Demo Mode (deterministic, no external calls) remains the default and always works.
- **No secrets required for the default deployment.** `apps/web` needs nothing beyond `DEMO_MODE`/`SKILL_KIT_PATH` unless you opt into Live Gemini Mode (`LLM_API_KEY`); `packages/mcp-skill-server` calls no LLM or third-party API and needs no credentials.
- **The Live Gemini daily limit is in-memory and best-effort**, not a hard guarantee — see "Live Gemini Mode" in `apps/web/README.md` for the documented cold-start and multi-instance caveats on serverless. It uses an opaque, PII-free anonymous cookie, never raw business idea text, for bucketing.
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
- [x] `packages/mcp-skill-server` deployed to Render at `https://ai-product-factory-mcp.onrender.com`.
- [x] MCP-first skill recommendation with local fallback verified: succeeds via the live Render MCP server when `MCP_SERVER_URL` is set, and falls back to local `skill-tools` automatically when it isn't (or on a simulated failure) — see `docs/architecture.md`.
- [x] Manual skill selection verified end-to-end: `GET /api/skills` returns the full catalog; a manually-adjusted `finalSelectedSkillIds` (recommended skills plus extra ones added, one removed) produced visibly different Architecture/Security/Roadmap/Tasks/Readiness Score output; an invalid skill id was rejected by Zod; `spec-driven-development` stayed selected even when omitted from the request.
- [x] Demo Mode verified to work with zero Gemini env vars set (default behavior unchanged).
- [x] Live Gemini Mode verified end-to-end with a deliberately invalid API key: server correctly returns 503 when unconfigured, 502 with a clear message when the upstream call fails (key never appears in logs or the response), 429 once the per-user daily quota is exhausted, and the anonymous rate-limit cookie is set/reused correctly across requests including on error responses.
- [x] `apps/web` deployed to Vercel.
- [x] Keep-warm workflow added (`.github/workflows/keep-mcp-warm.yml`, pings the Render MCP server's `/health` every 10 minutes) to mitigate Render Free cold starts — without it, production requests can land on a sleeping instance and silently use the local skill-tools fallback almost every time, since Render's 30-60s+ cold-start time far exceeds `MCP_TIMEOUT_MS` (default 4000ms). See "Remote MCP-first Skill Recommendation with Local Fallback" in `docs/architecture.md`.
- [ ] Public URLs added to the Kaggle Writeup once `apps/web`'s production URL is finalized.
