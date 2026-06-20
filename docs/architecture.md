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
       -> SpecApproval (human-in-the-loop gate) + SkillSelector (editable)
       -> ResultsTabs (Product Spec, MVP Scope, Architecture, Security, Roadmap, Tasks, Readiness Score) + SelectedSkillsPanel (read-only, final selection)
       -> Markdown export (client-side Blob download)
  -> fetch("/api/skills") -> GET /api/skills -> { skills } (full catalog, local skill-tools, no MCP)
  -> fetch("/api/blueprint") (apps/web/src/lib/blueprint-client.ts)
       -> POST /api/blueprint (Zod-validated request/response)
            -> orchestrator (apps/web/src/server/orchestrator.ts)
                 -> businessAnalystAgent + resolveSelectedSkills
                    (MCP-first via mcp-client.ts, falls back to
                    recommendSkillsDirect from @ai-product-factory/skill-tools)
                    (stage: "spec", runs before approval; returns recommended
                    selectedSkills + skillsSource, not yet the final selection)
                 -> architectAgent -> securityAgent -> planningAgent -> evaluationAgent,
                    each receiving selectedSkillIds (the user's final selection,
                    PROTECTED_SKILL_IDS merged in server-side)
                    (stage: "blueprint", runs only after the user approves the
                    Product Spec and finalizes the skill selection)
  -> GET /api/health -> { status, demoMode }
```

- Every agent (`apps/web/src/server/agents/*.ts`) implements the `IAgent<TInput, TOutput>` contract (`src/types/agents.ts`) but still returns deterministic, template-based demo output — no real LLM calls yet.
- `DEMO_MODE` (default `true`) gates generation: if explicitly set to `false`, `/api/blueprint` returns `501 Not Implemented` rather than silently faking a live response, since live LLM calls are a later phase.
- Request and response bodies are validated with Zod (`apps/web/src/server/schemas.ts`) at the API boundary in both directions.
- No database, no auth. State is request-scoped; nothing is persisted server-side.
- Secrets: none introduced yet. `DEMO_MODE` is a plain server-side env var, never exposed with a `NEXT_PUBLIC_` prefix.
- `apps/web` resolves `selectedSkills` MCP-first with a local fallback (see the dedicated section below) — `@ai-product-factory/skill-tools` in-process remains the always-available path; calling the deployed public MCP server is additive, not a replacement dependency.
- The recommendation is a starting point, not the final answer: the user can adjust it before approving, and the *final* selection — not the recommendation — drives the blueprint stage's output. See "Manual Skill Selection and Skill-Informed Enrichment" below.

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

**Skill Router integration:** `runSpecStage` in apps/web's orchestrator resolves `selectedSkills` alongside the Business Analyst agent and returns the result, plus `skillsSource`, in the `/api/blueprint` (`stage: "spec"`) response. The UI renders this via `SelectedSkillsPanel` on both the Product Spec approval screen and the final results screen. See "Remote MCP-first Skill Recommendation with Local Fallback" below for how `selectedSkills` is actually resolved.

## Remote MCP-first Skill Recommendation with Local Fallback (Phase 6A follow-up)

`apps/web` can resolve `selectedSkills` from the deployed public MCP server instead of always calling `@ai-product-factory/skill-tools` in-process — optionally, and with an automatic fallback so a slow or unavailable MCP server never breaks the demo.

```text
apps/web/src/server/
  config.ts       -- getMcpServerUrl() (from MCP_SERVER_URL, null if unset
                     or invalid), getMcpTimeoutMs() (from MCP_TIMEOUT_MS,
                     default 4000)
  mcp-client.ts   -- fetchRecommendedSkillsFromMcp(idea, limit): calls the
                     public MCP server's recommend_skills tool via the
                     official @modelcontextprotocol/sdk Client +
                     StreamableHTTPClientTransport, bounded by a per-request
                     timeout; validates the structuredContent response with
                     skill-tools' own SkillRecommendationSchema before
                     trusting it; returns null on ANY failure (never throws)
  orchestrator.ts -- resolveSelectedSkills(idea): tries
                     fetchRecommendedSkillsFromMcp first; on null, falls
                     back to recommendSkillsDirect(idea, limit) from
                     @ai-product-factory/skill-tools, in-process
```

Behavior:

- **`MCP_SERVER_URL` unset (default):** the remote call is skipped entirely — `getMcpServerUrl()` returns `null` before any network code runs. Behavior is identical to Phase 4A/4B: always local, always in-process.
- **`MCP_SERVER_URL` set and the call succeeds:** `selectedSkills` comes from the live MCP server; the API response's `skillsSource` field is `"mcp"`.
- **`MCP_SERVER_URL` set and the call fails for any reason** — network error, the configured `MCP_TIMEOUT_MS` (default 4000ms, recommended 3000-5000ms) elapsing, an HTTP 429 from the MCP server's own rate limiter, an MCP tool error result (`isError: true`), or a response that fails Zod validation — `mcp-client.ts` returns `null` and the orchestrator falls back to `recommendSkillsDirect`. `skillsSource` is `"local"`. The user never sees an error; the spec stage completes normally.

Safety and observability:

- **No tool surface change.** The remote call targets the exact same `recommend_skills` tool documented in `packages/mcp-skill-server/README.md`, with the same input/output shape. Nothing about the public MCP server changed for this feature.
- **Response is validated, not trusted.** `mcp-client.ts` parses `result.structuredContent` against `SkillRecommendationSchema` (from `@ai-product-factory/skill-tools`) with `safeParse` before returning it — a malformed or unexpected shape is treated as a failure, not passed through.
- **`MCP_SERVER_URL` is server-side only**, read directly from `process.env` inside `src/server/`; it is never sent to the client and has no `NEXT_PUBLIC_` counterpart.
- **Failure logging never includes the idea text.** `logMcpWarning()` logs only the failure reason (error name/message, truncated to 200 characters, or "tool returned an error result" / "failed local validation") — never the business idea or the MCP response content.
- **`skillsSource` is informational only.** Both paths produce the same `ISkillRecommendation[]` shape; the UI and downstream agents behave identically either way.

**Vercel file-tracing fix (Phase 6A):** Next.js file tracing cannot statically see that `/api/blueprint` (and, as of the manual skill selector below, `/api/skills`) needs `agent-skill-kit/skills/**` at runtime, since those files are read dynamically via `fs`, not imported. `apps/web/next.config.mjs` sets `outputFileTracingRoot` (widened to the monorepo root, since `agent-skill-kit/` lives two directories above `apps/web`) and `outputFileTracingIncludes` for both routes. Verified locally: both routes' `.next/server/app/api/{blueprint,skills}/route.js.nft.json` include all 113 files under `agent-skill-kit/skills/`, and `next start` correctly serves `recommend_skills`-derived `selectedSkills` and the `/api/skills` catalog from a clean build. `packages/mcp-skill-server` never had this problem on Render, since Render deploys the whole repository checkout, not a traced serverless bundle.

## Manual Skill Selection and Skill-Informed Enrichment

The Skill Router's recommendation (MCP-first or local) is a *starting point*, not the final answer. Before the user can approve the Product Spec, `SpecApproval` renders an editable `SkillSelector` showing the full skill catalog, and the user's **final** selection — not the original recommendation — is what the blueprint stage actually uses.

```text
apps/web/
  app/api/skills/route.ts         -- GET; { skills: ISkillMetadata[] } from
                                      @ai-product-factory/skill-tools' listSkills(),
                                      always local (no MCP call — this is just
                                      "what skills exist", not idea-specific
                                      recommendation)
  app/_components/SkillSelector.tsx -- checklist of every available skill:
                                        - recommended skills pre-checked, with
                                          their recommendation reason
                                        - spec-driven-development always
                                          checked and disabled ("required")
                                        - "Reset to recommended skills" button
                                        - copy: "Recommended skills are
                                          selected automatically. You can
                                          adjust them before generating the
                                          full blueprint."
  src/types/blueprint.ts           -- PROTECTED_SKILL_IDS = ["spec-driven-development"]
  src/server/orchestrator.ts       -- runBlueprintStage(idea, productSpec,
                                       mvpScope, finalSelectedSkillIds) merges
                                       PROTECTED_SKILL_IDS in server-side
                                       (defense in depth — a stale or crafted
                                       client request can't drop it) and
                                       passes the merged selectedSkillIds to
                                       every downstream agent
  src/server/agents/skill-enrichment.ts -- the deterministic, skill-id-keyed
                                            bullet map described below
```

### Request/response shape

- `POST /api/blueprint` (`stage: "blueprint"`) gained `finalSelectedSkillIds: string[]`, validated with `z.array(SkillIdSchema).max(50).default([])` (reusing `skill-tools`' own kebab-case id schema — an invalid id is rejected with `400` before the orchestrator ever runs).
- The public MCP server's tool surface is unchanged — this is purely an `apps/web` request/response addition, not a new MCP tool.

### Deterministic, skill-informed enrichment (no LLM)

`skill-enrichment.ts` maps a fixed set of skill ids to fixed bullets per blueprint section (`architecture`, `security`, `roadmap`, `tasks`). Architect/Security/Planning append a "Skill-Informed ___ Notes" section when any selected skill has a rule for that section; Evaluation lists which selected skills contributed notes in a "Skills Applied" section. Selecting a skill with no enrichment rule (e.g. `react-enterprise-rules`) is harmless — it just contributes nothing.

| Skill | Section(s) affected | What it adds |
|---|---|---|
| `agent-security-review` | Security | Security checklist, a human-approval gate for high-risk actions, sensitive-data classification reminder |
| `database-design-rules` | Architecture | Data model constraints, per-row ownership checks, indexing |
| `testing-patterns` | Tasks, Roadmap | Unit/integration/e2e test strategy, regression tests, a hardening phase |
| `observability-rules` | Architecture, Security | Distributed traces, cost/latency metrics, structured audit logs |
| `mcp-tool-consumption` | Security, Architecture | Read-only/write/approval-required tool classification, a documented tool access policy |
| `agentic-commerce-rules` | Security | Payment/payout/refund controls with spending limits, fraud/dispute handling |
| `a2a-agent-design` | Architecture | Explicit agent/service ownership boundaries, delegation rules |
| `a2ui-patterns` | Architecture | Trusted, schema-validated rendering of agent-generated UI/output |

Verified end-to-end: selecting all eight skills above for the KnitConnect scenario produced all eight "Skill-Informed ___ Notes" blocks across Architecture/Security/Roadmap/Tasks, a "Skills Applied" line in the Readiness Score naming all eight, and a different final score than the unmodified recommendation — see `examples/generated-blueprint/` for the committed result.

### How to Improve This Score

The Readiness Score's "How to Improve This Score" section (`apps/web/src/server/agents/readiness-recommendations.ts`) is a separate, deterministic recommendation pass — not part of the `scoreReadiness` heuristic itself — computed fresh on every blueprint generation from the current idea, signals, components, and `selectedSkillIds`, so it changes when the user adjusts their skill selection and regenerates. Two kinds of line, kept deliberately distinct so the list never reads as "just select more skills":

- **Skill recommendations** — only emitted when a concrete signal makes a skill relevant *and* it isn't already selected: `agent-security-review` for any sensitive-data signal, `agentic-commerce-rules` for payments, `database-design-rules` for user-generated content, `observability-rules` for moderation/reviews, and `testing-patterns` specifically when Delivery readiness is the weakest component. Once the user adds the skill, that line disappears on the next generation — verified by generating the same idea with a minimal skill set (lines present) and the full relevant set (lines gone).
- **Process/safeguard recommendations** — standing reminders tied to a signal but not solved by any skill (e.g. "require human approval before enabling payments," "confirm message contents are never logged"). These persist regardless of skill selection, since they're operational decisions, not blueprint content.
- A weakest-component line (when the lowest score is below 85) names the component and a concrete way to expand it.

Shown in both the Readiness Score UI tab and the Markdown export — it's just another section of the same `readinessScore` string both render.

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
