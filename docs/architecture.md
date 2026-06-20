# Architecture (Current: Phase 1-6A)

This describes what exists today, not the full target system. See `AI_Product_Factory_DEPLOYMENT_PLAN.md` for the target Vercel + Render architecture and later-phase additions (real LLM calls).

## Repository Structure

```text
ai-product-factory/ (npm workspaces: apps/*, packages/*)
  apps/
    web/                    -- Next.js MVP UI + orchestrator API (Vercel)
  packages/
    skill-tools/            -- shared, read-only skill access layer
    mcp-skill-server/       -- public MCP server over skill-tools (Render Free)
  agent-skill-kit/
    skills/                 -- the actual skill content, read by skill-tools
  examples/generated-blueprint/
  docs/
```

`packages/skill-tools` is the single source of truth for skill discovery, recommendation, and readiness scoring. `apps/web` and `packages/mcp-skill-server` both depend on it as an npm workspace package (`@ai-product-factory/skill-tools`) — neither duplicates the logic.

## Current State: apps/web

```text
Browser
  -> Next.js App Router page (apps/web/app/page.tsx)
  -> ProductFactoryApp (client component, local React state)
       -> IdeaForm
       -> WorkflowProgress (visible agent step status, driven by real API calls)
       -> SpecApproval (human-in-the-loop gate) + SelectedSkillsPanel
       -> ResultsTabs (Product Spec, MVP Scope, Architecture, Security, Roadmap, Tasks, Readiness Score) + SelectedSkillsPanel
       -> Markdown export (client-side Blob download)
  -> fetch("/api/blueprint") (apps/web/src/lib/blueprint-client.ts)
       -> POST /api/blueprint (Zod-validated request/response)
            -> orchestrator (apps/web/src/server/orchestrator.ts)
                 -> businessAnalystAgent + recommendSkillsDirect (from @ai-product-factory/skill-tools)
                    (stage: "spec", runs before approval)
                 -> architectAgent -> securityAgent -> planningAgent -> evaluationAgent
                    (stage: "blueprint", runs only after the user approves the Product Spec)
  -> GET /api/health -> { status, demoMode }
```

- Every agent (`apps/web/src/server/agents/*.ts`) implements the `IAgent<TInput, TOutput>` contract (`src/types/agents.ts`) but still returns deterministic, template-based demo output — no real LLM calls yet.
- `DEMO_MODE` (default `true`) gates generation: if explicitly set to `false`, `/api/blueprint` returns `501 Not Implemented` rather than silently faking a live response, since live LLM calls are a later phase.
- Request and response bodies are validated with Zod (`apps/web/src/server/schemas.ts`) at the API boundary in both directions.
- No database, no auth. State is request-scoped; nothing is persisted server-side.
- Secrets: none introduced yet. `DEMO_MODE` is a plain server-side env var, never exposed with a `NEXT_PUBLIC_` prefix.
- `apps/web` calls the skill tools **in-process** via `@ai-product-factory/skill-tools` — it does not call the public MCP server over the network. The MCP server (Phase 4B) is a separate, independently deployable exposure of the same logic, primarily for the course's MCP/tool-integration demonstration and for any external MCP client. apps/web could be switched to call it remotely in a later pass, but that is not required for the orchestrator to work.

## Why a Single `/api/blueprint` Endpoint

Following the deployment plan's "Alternative simplified MVP" (`AI_Product_Factory_DEPLOYMENT_PLAN.md` §5), one endpoint accepts a `stage` field (`"spec"` | `"blueprint"`) instead of one route per agent. This keeps the approval-gate boundary explicit in the request shape itself and avoids one route per agent before real LLM orchestration needs exist.

## packages/skill-tools (shared, Phase 4A)

Read-only skill access layer over the bundled `agent-skill-kit/skills` directory, built once and shared by both `apps/web` and `packages/mcp-skill-server`.

```text
packages/skill-tools/src/
  reader.ts      -- fs.readdir/readFile only; resolves the skills root from
                    SKILL_KIT_PATH or a fixed relative default; a skill id is
                    only ever used after being matched against a real
                    directory listing, so path traversal cannot succeed
  tags.ts        -- deterministic keyword inference over each skill's own
                    description (no LLM, no external lookups)
  schemas.ts     -- Zod: SkillIdSchema, GetSkillInputSchema, IdeaSignalSchema,
                    RecommendSkillsInputSchema, ScoreReadinessInputSchema,
                    plus output-shape schemas (SkillMetadataSchema, etc.)
  metadata.ts    -- getAllSkillMetadata(): parses every SKILL.md frontmatter
  recommender.ts -- recommendSkills(idea, limit): rule-based Skill Router
  readiness.ts   -- scoreReadiness(input): content-length heuristic, kept
                    separate from the Evaluation agent's own fixed template
  tools.ts       -- the four tool functions, each validating its own input
                    with Zod: listSkills, getSkill, recommendSkills,
                    scoreReadiness
  index.ts       -- barrel; also exports recommendSkillsDirect, a typed
                    entry point for callers (apps/web's orchestrator) that
                    already hold a validated idea and want to skip a
                    redundant re-parse
```

Note: `IdeaSignalSchema` (used by `recommend_skills`) is a deliberately smaller, public-facing shape than `apps/web`'s full business-idea form schema — only the fields `recommendSkills` actually uses, each defaulted so a partial caller still works. This keeps the shared package's contract decoupled from `apps/web`'s internal form.

Safety properties (see `agent-security-review`, `mcp-tool-consumption`):

- Reads are confined to `agent-skill-kit/skills` (or `SKILL_KIT_PATH`, an operator-set env var — never a value from a request body).
- `getSkill`'s `id` is checked against a live `fs.readdir` listing before being used in any path; a traversal string like `../../etc/passwd` cannot match a real directory name, so it is rejected by construction, not by blacklist. Verified at both the in-process layer and through the live MCP tool call (see Verification in the Phase 4B summary).
- No `fs.writeFile`, no `child_process`, no shell execution anywhere in this package.
- Every tool function validates its own input with Zod — not just whatever sits in front of it (a Next.js route, or an MCP transport).
- Built with `tsc` to `dist/` (CommonJS) so it can be `require`d as a normal npm package by both a Next.js app and a plain Node server, with no bundler-specific configuration needed in either consumer.

**Skill Router integration:** `runSpecStage` in apps/web's orchestrator calls `recommendSkillsDirect(idea, 5)` alongside the Business Analyst agent and returns the result as `selectedSkills` in the `/api/blueprint` (`stage: "spec"`) response. The UI renders this via `SelectedSkillsPanel` on both the Product Spec approval screen and the final results screen.

**Vercel file-tracing fix (Phase 6A):** Next.js file tracing cannot statically see that `/api/blueprint` needs `agent-skill-kit/skills/**` at runtime, since those files are read dynamically via `fs`, not imported. `apps/web/next.config.mjs` now sets `outputFileTracingRoot` (widened to the monorepo root, since `agent-skill-kit/` lives two directories above `apps/web`) and `outputFileTracingIncludes` (`"/api/blueprint": ["../../agent-skill-kit/skills/**/*"]`). Verified locally: a production build's `.next/server/app/api/blueprint/route.js.nft.json` includes all 113 files under `agent-skill-kit/skills/`, and `next start` correctly serves `recommend_skills`-derived `selectedSkills` from a clean build. `packages/mcp-skill-server` never had this problem on Render, since Render deploys the whole repository checkout, not a traced serverless bundle.

## packages/mcp-skill-server (Phase 4B)

A small Express server exposing `packages/skill-tools` over the Model Context Protocol, using the official `@modelcontextprotocol/sdk`'s **Streamable HTTP** transport, in **stateless mode**: a fresh `McpServer` + `StreamableHTTPServerTransport` is created per `POST /mcp` request (no session map, no cross-request state), since every tool is a pure read.

```text
Public MCP client (or apps/web, in a later pass)
  -> POST /mcp  (StreamableHTTPServerTransport, stateless)
       -> McpServer
            -> list_skills       -> @ai-product-factory/skill-tools listSkills()
            -> get_skill         -> ...getSkill({id})
            -> recommend_skills  -> ...recommendSkills({idea, limit})
            -> score_readiness   -> ...scoreReadiness({...6 text fields})
  -> GET /health -> { status, server, skillCount }
```

Why Express: the MCP TypeScript SDK's own HTTP examples use it for JSON body parsing and routing in front of `StreamableHTTPServerTransport`; using it here avoids hand-rolling raw `http` body buffering for POST, which is easy to get subtly wrong. `createMcpExpressApp()` (from the SDK) also wires up DNS-rebinding `Host` header validation automatically for localhost binding, and accepts an `allowedHosts` allowlist for non-localhost binding (used here via `ALLOWED_ORIGIN`).

Security controls (see `packages/mcp-skill-server/README.md` for the full list):

- Read-only tools only; reuses `skill-tools`' path-traversal-safe reader — no new filesystem code in this package.
- Every tool input is validated twice: once by the MCP SDK against the registered Zod `inputSchema` (rejecting bad calls before our handler even runs), and again inside `skill-tools`' own functions.
- No secrets: this server calls no LLM and no third-party API.
- DNS-rebinding mitigation via `ALLOWED_ORIGIN` -> `allowedHosts`. `ALLOWED_ORIGIN` must be this server's own public origin (its Render URL), not the Vercel frontend's URL — it restricts the `Host` header this server accepts on incoming requests, which is unrelated to browser CORS. Setting it to the wrong origin causes Render's own health check to fail (observed in practice).
- Basic per-IP, in-memory, fixed-window rate limiting on `POST /mcp` (`RATE_LIMIT_REQUESTS_PER_MINUTE`, default 60).
- Logging (`src/logging.ts`) records only tool name, timing, outcome, and small fields each tool explicitly passes (result counts, a skill id, a score, a content *length*) — never raw request bodies or business idea text.
- `GET /health` for Render's health check, independent of rate limiting.

**Why this does not change apps/web's behavior:** `apps/web` was not modified to call this server — it still calls `@ai-product-factory/skill-tools` in-process via the orchestrator, exactly as in Phase 4A. `packages/mcp-skill-server` is an additional, independently deployable exposure of the same shared logic, not a replacement dependency for the web app.

## Security and Evaluation Agents (Phase 5)

Both agents are still demo-mode (deterministic, no LLM call) but now derive their output from the submitted idea instead of returning a fixed template.

### Security Agent

```text
apps/web/src/server/agents/
  security-signals.ts  -- detectSecuritySignals(idea): keyword + flag detection
                           (personal/financial/health data flags, plus keyword
                           matches for messaging, seller/instructor, user-
                           generated content, and moderation/reviews)
  security.ts           -- builds, from those signals:
                             - Data Classification table (one row per
                               detected category, never empty)
                             - STRIDE table — all 6 categories always present;
                               each row's risk/mitigation is tailored when a
                               relevant signal fires, generic otherwise
                             - Security Risks (conditional bullets)
                             - Approval-Required Actions (conditional bullets:
                               payments/payouts, seller verification changes,
                               deleting user content, exposing private
                               messages, admin moderation — plus a standing
                               "any auth change" baseline so the list is
                               never empty)
                             - Security Recommendations (conditional bullets)
```

Detection is deterministic keyword matching against `businessDescription`, `coreIdea`, `keyFeatures`, and `problemStatement` (same style as `packages/skill-tools`' `recommender.ts`), plus the existing `hasPersonalData`/`hasFinancialData`/`hasHealthData` flags. No LLM call.

### Evaluation Agent

```text
apps/web/src/server/agents/evaluation.ts
  -> scoreReadiness({ productSpec, mvpScope, architecture, security, roadmap, tasks })
       from @ai-product-factory/skill-tools (the same function the public
       MCP server's score_readiness tool calls)
  -> renders the real component scores/notes into the Component Scores table
  -> derives the Interpretation paragraph from the actual scores: a tier
     statement (>=85 ready / 70-84 mostly ready / <70 needs work), the
     weakest-scoring component named explicitly, and a standing reminder to
     check the Security tab's Approval-Required Actions
```

This replaces four previously-fixed numbers (80/78/75/78) with a score that changes when the upstream agents' output changes — verified by running the full idea-to-blueprint flow for the KnitConnect scenario, which produced Specification 90, Architecture 59, Security 95, Delivery 71, final 79 (numbers will differ for the committed example in `examples/generated-blueprint/`, which scores its own, separately-written architecture/roadmap/tasks content at 95/88/95/95, final 93 — both are correct outputs of the same heuristic against different input text).

**Public MCP tool surface:** unchanged. `packages/skill-tools`' `scoreReadiness` had one cosmetic change — the fourth component label changed from "Implementation readiness" to "Delivery readiness" to match this phase's wording — but the `score_readiness` tool's input/output **shape** (`{component, score, notes}[]` + `finalScore`) is identical, so this is a content change, not a tool surface change.

## Target State (Future Phases)

```text
Browser
  -> Next.js App Router page
  -> /api/blueprint (real LLM provider wrapper instead of demo agents, DEMO_MODE fallback retained)
       -> (optional) MCP client -> Public MCP Skill Server (Render Free)
                                     -> agent-skill-kit/skills (read-only, same skill-tools logic)
```

See `AI_Product_Factory_PROJECT_PLAN.md` §15 for phase definitions and `AGENTS.project.md` for the done-criteria gates between phases.
