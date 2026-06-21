# Architecture (Current: Phase 1-6A + Live Gemini Mode)

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
                 -> architectAgent -> securityAgent -> planningAgent -> evaluationAgent
                    (generationMode: "demo")
                    OR
                    -> generateLiveBlueprint (generationMode: "live", llm/blueprint-generator.ts)
                    each receiving selectedSkillIds (the user's final selection,
                    PROTECTED_SKILL_IDS merged in server-side)
                    (stage: "blueprint", runs only after the user approves the
                    Product Spec and finalizes the skill selection)
  -> GET /api/health -> { status, demoMode }
```

- Every demo-mode agent (`apps/web/src/server/agents/*.ts`) implements the `IAgent<TInput, TOutput>` contract (`src/types/agents.ts`) and returns deterministic, template-based output — no real LLM calls. The live-mode path (`generationMode: "live"`) is the one place that does call a real LLM (Gemini) — see "Live Gemini Mode" below.
- `DEMO_MODE` (default `true`) is reported by `/api/health` for operator visibility only; it no longer gates `/api/blueprint` — deterministic generation is unconditionally available and is the default. The real generation-mode control is the per-request `generationMode` field plus the server-side `ENABLE_LIVE_AI` gate for live.
- Request and response bodies are validated with Zod (`apps/web/src/server/schemas.ts`) at the API boundary in both directions.
- No database, no auth. State is request-scoped; nothing is persisted server-side except the small in-memory Live Gemini daily-quota counter (see "Live Gemini Mode").
- Secrets: `LLM_API_KEY` is the only one in this app, required only if Live Gemini Mode is enabled; server-side only, never exposed with a `NEXT_PUBLIC_` prefix, never logged.
- `apps/web` resolves `selectedSkills` MCP-first with a local fallback (see the dedicated section below) — `@ai-product-factory/skill-tools` in-process remains the always-available path; calling the deployed public MCP server is additive, not a replacement dependency.
- The recommendation is a starting point, not the final answer: the user can adjust it before approving, and the *final* selection — not the recommendation — drives the blueprint stage's output, in both Demo and Live Gemini modes. See "Manual Skill Selection and Skill-Informed Enrichment" and "Live Gemini Mode" below.

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

**Observed in production: Render Free cold starts cause near-constant local fallback.** Render Free web services spin down after ~15 minutes with no inbound traffic and take 30-60+ seconds to cold-start on the next request — far longer than `MCP_TIMEOUT_MS` (default 4000ms). With low/sporadic traffic to the MCP server, most production requests find it asleep, time out, and fall back to local — observed as `skillsSource: "local"` on effectively every request, not just occasionally. This is the fallback design working exactly as intended (no broken requests, no errors surfaced), but it means the MCP path rarely gets *exercised* in practice unless the instance happens to already be warm.

Mitigation: `.github/workflows/keep-mcp-warm.yml` pings the MCP server's `GET /health` (read-only, no auth, no side effects) every 10 minutes via a scheduled GitHub Actions workflow, comfortably under Render's ~15 minute idle timeout. This is opt-in infrastructure, not application code — it doesn't change `mcp-client.ts`'s behavior or guarantees; it just keeps the upstream server warm so the existing timeout/fallback logic succeeds via the live MCP path more often. Caveats: GitHub disables scheduled workflows automatically after 60 days with no commits to the repository (push anything, or re-enable from the Actions tab, to restart it); a workflow run can also be triggered manually any time via `workflow_dispatch` from the Actions tab for an immediate one-off wake-up instead of waiting for the schedule.

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

## Live Gemini Mode

A controlled, server-gated path to real LLM generation for the blueprint stage, sitting alongside (not replacing) the deterministic agents above. Demo Mode remains the default and is unconditionally available — Live Gemini Mode is strictly additive and off by default.

```text
apps/web/src/
  types/blueprint.ts          -- TGenerationMode = "demo" | "live";
                                  DEFAULT_GENERATION_MODE = "demo"
  server/config.ts             -- isLiveAiFlagEnabled(), getLlmProvider(),
                                   getLlmApiKey(), getLlmModel(),
                                   getLlmTimeoutMs(), getLiveAiDailyLimit(),
                                   isLiveGeminiConfigured() (the 3-gate check)
  server/anon-id.ts             -- opaque httpOnly cookie (aipf_anon_id),
                                    UUID, no PII, used only for rate-limit
                                    bucketing
  server/live-ai-rate-limit.ts  -- in-memory Map<anonId, {count, dateKey}>,
                                    UTC-day buckets, consumeLiveAiQuota()
  server/skill-context.ts       -- getSkillContextForIds(): fetches full
                                    SKILL.md content (truncated ~1200 chars)
                                    for selected skills via skill-tools'
                                    getSkill, for use as prompt context
  server/llm/
    types.ts                    -- ILlmProvider interface (provider
                                    abstraction: generateText(prompt, timeoutMs,
                                    options?: { responseSchema })
    errors.ts                   -- LiveGenerationError, one of: unavailable,
                                    rate_limited, timeout, invalid_output,
                                    provider_error — each with a safe userMessage
    gemini-provider.ts           -- ILlmProvider impl over Gemini's
                                    generateContent REST endpoint, native
                                    fetch + AbortController, JSON response mode,
                                    extended "thinking" disabled, maxOutputTokens
                                    capped (see "Output tuning" below)
    provider.ts                  -- getConfiguredLlmProvider(): returns a
                                    GeminiProvider or null per
                                    isLiveGeminiConfigured()
    blueprint-prompt.ts           -- buildBlueprintPrompt(): one combined
                                     prompt for 4 sections (NOT readinessScore
                                     — see "Readiness Score is always
                                     deterministic" below), embeds
                                     selected-skill guidance verbatim
    blueprint-generator.ts        -- generateLiveBlueprint(): orchestrates
                                     skill-context fetch -> prompt -> provider
                                     call -> JSON.parse -> LiveBlueprintContentSchema
                                     validation; throws LiveGenerationError on
                                     any failure; returns architecture/security/
                                     roadmap/tasks only
  server/orchestrator.ts          -- runBlueprintStage(..., generationMode)
                                      branches Architecture/Security/Roadmap/
                                      Tasks: "demo" -> 3 agents; "live" ->
                                      generateLiveBlueprint. Then ALWAYS calls
                                      evaluationAgent (unconditionally, both
                                      modes) for Readiness Score.
  app/api/blueprint/route.ts       -- enforces the gates server-side,
                                      manages the anon cookie + quota,
                                      maps LiveGenerationError to HTTP status
  app/_components/
    GenerationModeSwitcher.tsx     -- Demo Mode / Live Gemini radio switcher
                                      with the required explanatory copy,
                                      shown on IdeaForm and SpecApproval
    GenerationLoadingBanner.tsx     -- shown during "generating-blueprint";
                                       distinct Demo/Live copy, lists selected
                                       skills as Live's prompt context, spinner
```

### What's live vs. deterministic

- **Spec stage** (`runSpecStage`) — always deterministic, unconditionally. It does not read `generationMode` at all; the field isn't even part of the `stage: "spec"` request schema.
- **Blueprint stage**, `generationMode: "demo"` (default) — the three existing deterministic agents for Architecture/Security/Roadmap+Tasks (Architect, Security, Planning), unchanged from Phase 5/6A.
- **Blueprint stage**, `generationMode: "live"` — one Gemini call producing four sections (`architecture`, `security`, `roadmap`, `tasks`) as a single JSON response, so one user-triggered generation consumes exactly one unit of daily quota.
- **Readiness Score, both modes** — always the deterministic Evaluation agent (`evaluationAgent.run`), called by the orchestrator after either path above completes, on whichever Architecture/Security/Roadmap/Tasks text it was just given. See "Readiness Score is always deterministic" below — this is the fix for an earlier inconsistency where Live mode's Readiness Score was whatever Gemini happened to write, shorter and less structured than Demo's.

### Readiness Score is always deterministic (both modes)

Originally, the Gemini prompt asked for all five sections including `readinessScore`, so Live Gemini's score was free-text from the model — shorter, inconsistently structured, and missing the "Skills Applied" / "How to Improve This Score" sections Demo Mode always has. Fixed by removing `readinessScore` from what Gemini is asked to produce entirely, and always computing it the same way regardless of mode:

```text
runBlueprintStage(..., generationMode):
  if "live":
    { architecture, security, roadmap, tasks } = generateLiveBlueprint(...)   # Gemini, 4 fields only
  else:
    { architecture } = architectAgent.run(...)                                # deterministic
    { security } = securityAgent.run(...)
    { roadmap, tasks } = planningAgent.run(...)

  // unconditional, both branches:
  { readinessScore } = evaluationAgent.run({ idea, productSpec, mvpScope, architecture, security, roadmap, tasks, selectedSkillIds })
```

`evaluationAgent` doesn't care where its inputs came from — it scores whatever Markdown text it's given via `scoreReadiness` (content-length heuristic from `@ai-product-factory/skill-tools`), then appends the same "Skills Applied" (`skill-enrichment.ts`) and "How to Improve This Score" (`readiness-recommendations.ts`) sections either way. Result: the Readiness Score tab always has Component Scores, Final Score, Interpretation, Skills Applied, and How to Improve This Score, in both modes — verified by generating the same idea in both modes and diffing the section headings present in `readinessScore` (identical in both; only the numeric scores/prose differ, since they're computed from different upstream text).

`LiveBlueprintContentSchema` (in `src/server/schemas.ts`) is the 4-field shape Gemini's output is validated against; `BlueprintResponseSchema` (5 fields, including `readinessScore`) remains the shape of the orchestrator's final combined result sent to the client in both modes — unchanged from the client's perspective.

### Output tuning (Gemini-specific)

Empirically, with Gemini's "thinking" enabled and no output schema, a single blueprint-generation prompt produced a 250KB+ response that got truncated mid-JSON by the model's output token limit, which broke `JSON.parse`. Fixed in `gemini-provider.ts`:

- `generationConfig.responseSchema` is now passed (a constrained OpenAPI-style schema matching `LiveBlueprintContentSchema`'s 4 fields), bounding output to exactly that shape.
- `thinkingConfig: { thinkingBudget: 0 }` disables extended "thinking," applied only when the configured model name matches `/2\.5/` (sending this field to a non-thinking-capable model risks an unknown-field error).
- `maxOutputTokens: 8192` caps response length as a hard backstop.
- The prompt itself asks for concise sections ("a few short paragraphs or a handful of bullets per heading, not exhaustive essays").

Default model is `gemini-2.5-flash`; default `LLM_TIMEOUT_MS` is 30000ms (matches the "up to 30 seconds" copy in `GenerationLoadingBanner`). Free-tier quota for any given model varies by Google Cloud project — if generation fails with a `provider_error` citing a 429 "quota exceeded," check which models your key has free quota for and set `LLM_MODEL` accordingly.

### Loading UX

`GenerationLoadingBanner` is shown above `WorkflowProgress` during the `"generating-blueprint"` stage (hidden once an error is present, so the `ErrorBanner` takes over). Copy differs by mode: Demo Mode says generation is deterministic and near-instant; Live Gemini explicitly says "Generating with Live Gemini. This may take up to 30 seconds." and names the selected skills being used as prompt context (so the wait is explained, not just displayed) — both alongside a small spinner. The existing four-step `WorkflowProgress` list (Architect/Security/Planning/Evaluation) is left as-is in both modes: it's still an accurate description of the four logical output sections, and the Evaluation step's existing description ("Calculates the readiness score") is now literally true in both modes rather than only in Demo Mode.

### Server-side enforcement (the request field is not trusted alone)

`isLiveGeminiConfigured()` requires all three: `ENABLE_LIVE_AI=true`, `LLM_PROVIDER=gemini`, `LLM_API_KEY` set. `POST /api/blueprint` re-checks this on every request before attempting generation — a client sending `generationMode: "live"` against a server with these unset gets a clear `503` ("not configured"), never a silent fallback to demo content and never an attempt to call Gemini without a key.

### Daily quota and anonymous identity

`LIVE_AI_DAILY_LIMIT` (default 10) requests per identity per UTC day. Identity is an opaque random UUID in an httpOnly cookie (`aipf_anon_id`) set on first Live attempt — not an auth token, grants no privilege, and is unrelated to any business idea content. The counter lives in a single in-process `Map`, incremented once per *attempt* (before calling Gemini), so a failed call still spends quota — the cost of the upstream call is incurred regardless of whether the output validates.

**Documented limitations, not hidden:**

- **In-memory, not shared.** On Vercel serverless, each function instance has independent memory. A cold start resets all counts to zero; concurrent warm instances don't share counts. The real-world behavior is "best-effort ~N/day per warm instance," not a hard global cap.
- **Bypassable by clearing cookies** or using a different browser/device — there is no real identity behind the anonymous id. Accepted tradeoff for a no-auth MVP per `AGENTS.project.md`.
- **No idea text is ever stored for rate-limiting** — only an id, a count, and a date key.
- A hard, cross-instance guarantee would need a shared store (Redis, Postgres, etc.), explicitly out of scope per `AGENTS.project.md` ("no database unless requested").

### Failure handling — shown, not swallowed

Unlike the silent MCP-recommendation fallback (`skillsSource: "local"` with no user-visible error), a Live Gemini failure is always surfaced. `generateLiveBlueprint` throws `LiveGenerationError` for every failure mode, and the route maps each to a distinct status: `unavailable` → 503, `rate_limited` → 429, `timeout` → 504, `invalid_output`/`provider_error` → 502. Every `userMessage` is written to be safe to show directly — no API key, no raw provider response body, no business idea text. The UI (`ProductFactoryApp`) shows the message via the existing `ErrorBanner` pattern with an added one-click "Switch to Demo Mode" action that immediately retries deterministically — since Demo Mode always works, the user is never stuck.

**Verified locally** (see the Phase 6A-follow-up build verification log): unconfigured server → 503; configured with a deliberately invalid key → 502 with the key absent from logs and the response; daily limit of 2 → third request → 429 with the cookie correctly set/reused across all three requests including the failed ones; a different anonymous identity (no cookie) → fresh quota, not blocked by another user's count; malformed `generationMode` value → 400 from Zod before any orchestrator code runs.

### Skill context in the prompt

`getSkillContextForIds` fetches each selected skill's full `SKILL.md` content via the *local* `skill-tools` `getSkill` (not the MCP server) — content for a known skill id is identical either way since the MCP server is a thin transport over the same bundled files, so a remote call here would add latency with no behavioral difference. `buildBlueprintPrompt` embeds this guidance verbatim (truncated ~1200 chars per skill) so the model — not fixed append-only bullets — decides how to weave the guidance into its output, in contrast to Demo Mode's `skill-enrichment.ts` bullets.

### Provider abstraction

`ILlmProvider` (`llm/types.ts`) is the only interface call sites depend on; `GeminiProvider` is the sole implementation today, using the platform's native `fetch` (no new npm dependency) against `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent` with `responseMimeType: "application/json"` and an `AbortController`-based timeout (`LLM_TIMEOUT_MS`, default 20000ms — more generous than the MCP timeout since generation is slower than a tool call). Adding a second provider later means writing one new file behind this interface; `provider.ts`'s factory and everything upstream of it stay unchanged.

## Target State (Future Phases)

```text
Browser
  -> Next.js App Router page
  -> /api/blueprint
       -> generationMode: "demo" -> deterministic agents (always available)
       -> generationMode: "live" -> Gemini today; provider abstraction
          (llm/types.ts) allows adding further providers without touching
          the orchestrator or route
       -> (optional, for skill recommendation only) MCP client -> Public
          MCP Skill Server (Render Free) -> agent-skill-kit/skills (read-only)
```

Possible later extensions (not built): live generation for the spec stage too (deliberately kept deterministic for now, per `AGENTS.project.md`'s reliability guidance); a shared rate-limit store if a hard cross-instance daily cap becomes necessary; additional `ILlmProvider` implementations (OpenAI, Anthropic, etc.) behind the existing abstraction.

See `AI_Product_Factory_PROJECT_PLAN.md` §15 for phase definitions and `AGENTS.project.md` for the done-criteria gates between phases.
