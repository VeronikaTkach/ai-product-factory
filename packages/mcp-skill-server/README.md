# AI Product Factory — MCP Skill Server

Public, read-only MCP server exposing the bundled `agent-skill-kit/skills` over the Model Context Protocol (Streamable HTTP transport). Intended for deployment as a small Render Free web service, separate from the `apps/web` Vercel deployment. See `../../docs/architecture.md` for the full design and security model, and `../../AI_Product_Factory_DEPLOYMENT_PLAN.md` for the broader deployment plan.

This server does not call an LLM, does not require auth, and has no database. It is a thin MCP transport over `@ai-product-factory/skill-tools`, the same read-only logic `apps/web` uses in-process.

## Tools

| Tool | Input | Output |
|---|---|---|
| `list_skills` | none | `{ skills: ISkillMetadata[] }` |
| `get_skill` | `{ id: string }` (kebab-case) | `{ id, name, description, tags, content }` |
| `recommend_skills` | `{ idea: { businessDescription, coreIdea, keyFeatures, problemStatement, hasPersonalData, hasFinancialData, hasHealthData, sensitiveInfoNotes }, limit? }` | `{ recommendations: { id, name, reason }[] }` |
| `score_readiness` | `{ productSpec, mvpScope, architecture, security, roadmap, tasks }` (all strings) | `{ components: {component, score, notes}[], finalScore }` |

All inputs are validated with Zod (`@ai-product-factory/skill-tools`'s schemas) both by the MCP SDK's own schema enforcement and again inside each tool function. Invalid input returns an MCP tool error (`isError: true`), not a transport crash.

## Local Development

```bash
npm install            # from the repo root (npm workspaces)
npm run build:skill-tools   # builds the shared package this server depends on
cd packages/mcp-skill-server
cp .env.example .env
npm run dev             # tsx watch, http://localhost:3001
```

Or from the repo root: `npm run dev:mcp`.

## Build and Run (production-style)

```bash
npm run build:skill-tools   # from repo root
npm run build:mcp           # from repo root
node packages/mcp-skill-server/dist/server.js
```

## Testing the Tools

Manual smoke test with `curl` (health + method guard):

```bash
curl http://localhost:3001/health
curl -i -X POST http://localhost:3001/mcp   # GET is 405; use a real MCP client for POST
```

For an actual tool call, use an MCP client (e.g. the `@modelcontextprotocol/sdk` `Client` + `StreamableHTTPClientTransport`, or any MCP-compatible inspector) pointed at `http://localhost:3001/mcp`.

## Render Free Deployment

This is an npm workspace package, so Render must run its install/build from the **repository root**, not from `packages/mcp-skill-server` — otherwise npm cannot resolve the local `@ai-product-factory/skill-tools` dependency.

| Setting | Value |
|---|---|
| Root Directory | *(leave blank — repo root)* |
| Build Command | `npm install && npm run build:skill-tools && npm run build --workspace=packages/mcp-skill-server` |
| Start Command | `npm run start --workspace=packages/mcp-skill-server` |
| Health Check Path | `/health` |

Render injects `PORT` automatically; this server reads it via `process.env.PORT`. Set `HOST=0.0.0.0` (Render requirement), `ALLOWED_ORIGIN` to **this MCP server's own Render URL** (e.g. `https://ai-product-factory-mcp.onrender.com`) — **not** the Vercel frontend's URL — and the other variables in `.env.example` as Render environment variables.

`ALLOWED_ORIGIN` is read into `allowedHosts` (see Security Controls below) and restricts the `Host` header this server accepts on *incoming* requests. Setting it to the Vercel app's URL instead of this server's own URL will cause Express to reject every request with an unmatched `Host` header — including Render's own health check, which will then fail.

## Security Controls

- **Read-only, scoped filesystem access.** Reads are confined to `agent-skill-kit/skills` (or `SKILL_KIT_PATH`); `get_skill`'s `id` is validated by Zod (kebab-case) and then checked against a live directory listing before touching any path — a traversal string cannot match a real directory name. No `fs.writeFile`, no `child_process`, no shell execution anywhere in this server or `@ai-product-factory/skill-tools`.
- **No secrets.** This server doesn't call an LLM or any third-party API, so there is nothing to leak; `.env.example` contains no credentials.
- **DNS-rebinding protection.** `ALLOWED_ORIGIN` restricts the accepted `Host` header — set it to this server's own public origin (its Render URL), not the Vercel frontend's URL. This is not browser CORS; it has nothing to do with which origins are allowed to call this server, only which `Host` header value incoming requests must present. Leave it set in any non-local deployment.
- **Rate limiting.** A basic in-memory per-IP fixed-window limiter (`RATE_LIMIT_REQUESTS_PER_MINUTE`, default 60) is applied to `POST /mcp`. Known limitation: per-process memory, not shared across instances — acceptable at demo scale (see `src/rate-limit.ts`).
- **Safe logging.** `src/logging.ts` logs only tool name, timing, outcome, and small fields each tool explicitly passes (result counts, a skill id, a score, or a content *length*) — never raw request bodies or business idea text.
- **No auth, no database, no LLM calls** — out of scope by design for this phase; see `AGENTS.project.md`.
