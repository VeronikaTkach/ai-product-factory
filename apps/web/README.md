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
| `DEMO_MODE` | `true` (any value other than the literal string `"false"`) | Server-side only. Reported by `/api/health` only — deterministic demo generation is now unconditionally available regardless of this value (superseded by per-request `generationMode` + `ENABLE_LIVE_AI`; see below). |
| `SKILL_KIT_PATH` | `../../agent-skill-kit/skills` (resolved relative to `process.cwd()`) | Server-side only. Where `@ai-product-factory/skill-tools` reads `SKILL.md` files from. Read-only. |
| `MCP_SERVER_URL` | unset (local fallback always used) | Server-side only, never exposed to the client. Deployed MCP server URL including `/mcp`. See "Skill Tools" below. |
| `MCP_TIMEOUT_MS` | `4000` | Per-request timeout (ms) for the `MCP_SERVER_URL` call. |
| `ENABLE_LIVE_AI` | `false` | Server-side kill switch for Live Gemini Mode. See "Live Gemini Mode" below. |
| `LLM_PROVIDER` | unset | Only `"gemini"` is implemented. |
| `LLM_API_KEY` | unset | Server-side only — never sent to the client, logged, or echoed in any error. |
| `LLM_MODEL` | `gemini-2.5-flash` | Gemini model id; free-tier quota varies by Google Cloud project — verify against current Gemini API docs and your own key's quota before relying on a specific model name long-term. |
| `LLM_TIMEOUT_MS` | `30000` | Per-request timeout (ms) for the Gemini call; matches the "up to 30 seconds" copy in the UI loader. |
| `LIVE_AI_DAILY_LIMIT` | `10` | Per-anonymous-user, per-UTC-day cap on Live Gemini requests. |

See `.env.example` in this directory. No `NEXT_PUBLIC_*` secrets exist in this app. Do not add LLM API keys to client-readable env vars.

## API Routes

- `POST /api/blueprint` — body `{ stage: "spec", idea }` or `{ stage: "blueprint", idea, productSpec, mvpScope, finalSelectedSkillIds, generationMode }`. Validated with Zod in both directions. See `src/server/schemas.ts`.
- `GET /api/skills` — `{ skills: ISkillMetadata[] }`, the full catalog from `agent-skill-kit/skills` (always local — no MCP call), used by the manual skill selector.
- `GET /api/health` — `{ status: "ok", demoMode: boolean }`.

## Architecture

See `../../docs/architecture.md` for the current request flow (UI → `/api/blueprint` → orchestrator → typed demo agents) and the full monorepo/package structure.

## Agents

Each agent in `src/server/agents/` implements `IAgent<TInput, TOutput>` (`src/types/agents.ts`) and currently returns deterministic template output — no real LLM calls. The orchestrator (`src/server/orchestrator.ts`) chains them: Business Analyst runs before the Product Spec approval gate; Architect → Security → Planning → Evaluation run after approval, each receiving the prior agent's output and the user's final `selectedSkillIds`.

Architect, Security, and Planning append a "Skill-Informed ___ Notes" section when the final skill selection includes a skill with deterministic enrichment rules (`src/server/agents/skill-enrichment.ts`); Evaluation lists which selected skills contributed notes. See "Manual Skill Selection" in `../../docs/architecture.md` for the full list of covered skills and the enrichment rules themselves.

## Skill Tools

This app depends on `@ai-product-factory/skill-tools` (`packages/skill-tools`), an npm workspace package shared with `packages/mcp-skill-server`. During the `spec` stage, the orchestrator (`src/server/orchestrator.ts`) resolves `selectedSkills` via **MCP-first with a local fallback**:

1. If `MCP_SERVER_URL` is set, `src/server/mcp-client.ts` calls the public MCP server's `recommend_skills` tool (bounded by `MCP_TIMEOUT_MS`, default 4000ms) and validates the response shape before using it.
2. On any failure — `MCP_SERVER_URL` unset, network error, timeout, rate limit (HTTP 429), an `isError` tool result, or a response that fails validation — it falls back to `recommendSkillsDirect(idea, 5)` from `@ai-product-factory/skill-tools`, in-process, with no user-visible error.

The API response includes `skillsSource: "mcp" | "local"` alongside `selectedSkills`, rendered as a small badge by `SelectedSkillsPanel` on the approval and results screens. Failure warnings are logged server-side with the failure reason only — never the submitted business idea text.

This app calling the MCP server is optional and additive: with `MCP_SERVER_URL` unset, behavior is identical to Phase 4A/4B (always local). See `../../docs/architecture.md` and `../../packages/mcp-skill-server/README.md` for that server's design, tool list, and Render deployment settings.

## Manual Skill Selection

Recommended skills are a starting point, not the final answer. Between the spec stage and approval, `SpecApproval` renders `SkillSelector`, which:

- Loads the full skill catalog via `GET /api/skills` (separate from the idea-specific `recommend_skills` call).
- Shows "Recommended skills are selected automatically. You can adjust them before generating the full blueprint."
- Pre-checks the recommended skills (with their recommendation reason) and lets the user check/uncheck any other catalog skill.
- Keeps `spec-driven-development` checked and disabled — it cannot be removed (`PROTECTED_SKILL_IDS` in `src/types/blueprint.ts`).
- Has a "Reset to recommended skills" button.

The resulting `selectedSkillIds` (not the original recommendation) is sent as `finalSelectedSkillIds` when the user clicks "Approve and continue." The orchestrator merges `PROTECTED_SKILL_IDS` back in server-side regardless of what the client sent, so the baseline can't be dropped by a stale client or a crafted request.

## Live Gemini Mode

Demo Mode (deterministic) is the default and is always available, with or without any of the `ENABLE_LIVE_AI`/`LLM_*` env vars set. `GenerationModeSwitcher` (shown on the idea form and again on the spec approval / adjust-skills screen) lets the user pick "Demo Mode" or "Live Gemini" for the **blueprint stage only** — the Product Spec is always generated deterministically regardless of this choice.

**What's live vs. deterministic:**

- Spec stage (`runSpecStage`) — always deterministic. Ignores `generationMode` entirely.
- Blueprint stage (`runBlueprintStage`), Architecture/Security/Roadmap/Tasks, `generationMode: "demo"` — the existing three deterministic agents (Architect, Security, Planning), unchanged.
- Blueprint stage, Architecture/Security/Roadmap/Tasks, `generationMode: "live"` — a single Gemini call (`src/server/llm/blueprint-generator.ts`) that produces four sections (`architecture`, `security`, `roadmap`, `tasks`) as one JSON response, using the same `selectedSkillIds` as prompt context (full `SKILL.md` content fetched via `@ai-product-factory/skill-tools`' `getSkill`, truncated to ~1200 chars each — see `src/server/skill-context.ts`).
- **Readiness Score, both modes — always deterministic.** The orchestrator calls the existing `evaluationAgent` unconditionally on whichever Architecture/Security/Roadmap/Tasks text it just produced (Gemini's or the agents'), so the Readiness Score tab is consistently rich — Component Scores, Final Score, Interpretation, Skills Applied, and "How to Improve This Score" — in both modes. Gemini is never asked to generate a readiness score; `LiveBlueprintContentSchema` (`src/server/schemas.ts`) is the 4-field shape it's validated against.

**Server-side enforcement (the client cannot bypass this):** Live Gemini only runs if all three are true: `ENABLE_LIVE_AI=true`, `LLM_PROVIDER=gemini`, and `LLM_API_KEY` is set (`isLiveGeminiConfigured()` in `src/server/config.ts`), AND the caller's daily quota isn't exhausted. `POST /api/blueprint` re-checks this on every request regardless of what the client sends.

**Daily quota:** `LIVE_AI_DAILY_LIMIT` (default 10) requests per anonymous user per UTC day, tracked by `src/server/live-ai-rate-limit.ts` — an in-memory `Map` keyed by an opaque, httpOnly cookie (`src/server/anon-id.ts`, cookie name `aipf_anon_id`). The cookie carries no PII and isn't used for anything except this counter; no business idea text is ever stored for rate-limiting. **Documented limitations:** this is a single-process, in-memory store — on Vercel serverless, a cold start resets all counts to zero and concurrent warm instances don't share counts, so the real-world limit is "best-effort ~N/day per warm instance," not a hard guarantee; a user can also reset their own observed quota by clearing cookies. A hard global cap would need a shared store (Redis, Postgres, etc.), which is out of scope per `AGENTS.project.md` ("no database unless requested").

**Failure handling:** unlike the silent MCP-recommendation fallback, a Live Gemini failure is never silently swallowed into a demo result. `generateLiveBlueprint` throws a typed `LiveGenerationError` (`src/server/llm/errors.ts`) for every failure mode — not configured (503), rate-limited (429), timeout (504), invalid/unparseable output (502), or any other provider error (502) — and the route returns the corresponding status with a clear, safe message (never the API key, never a raw provider error body, never business idea text in logs). The UI surfaces that message and offers a one-click "Switch to Demo Mode" action that immediately retries deterministically, so a Live failure never leaves the user stuck.

**Provider abstraction:** `src/server/llm/types.ts` defines `ILlmProvider` (`generateText(prompt, timeoutMs, options?)`); `gemini-provider.ts` is the only implementation today, using the platform's native `fetch` against the Gemini `generateContent` REST endpoint with `responseMimeType: "application/json"`, an optional `responseSchema` constraint, and an `AbortController` timeout — no new npm dependency. Extended "thinking" is disabled (`thinkingConfig.thinkingBudget: 0`, only sent for 2.5-family models) and `maxOutputTokens` is capped at 8192 — without this, a real run produced a 250KB+ response truncated mid-JSON. Adding another provider later means writing one new file behind the same interface, not touching the orchestrator or route.

**Loading UX:** `GenerationLoadingBanner` is shown during the `"generating-blueprint"` stage with mode-specific copy — Demo Mode says generation is near-instant; Live Gemini says "Generating with Live Gemini. This may take up to 30 seconds." and lists the selected skills being used as prompt context — alongside a spinner. It's hidden once an error appears, so `ErrorBanner` (with its "Switch to Demo Mode" action) takes over.
