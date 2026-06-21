/**
 * DEMO_MODE historically gated the entire /api/blueprint route behind a
 * 501 ("live LLM mode is not implemented yet") since there was no live
 * generation path. Now that Live Gemini Mode exists (gated separately by
 * ENABLE_LIVE_AI/LLM_PROVIDER/LLM_API_KEY and the per-request
 * generationMode field), deterministic demo generation is unconditionally
 * available and is always the default — DEMO_MODE no longer blocks
 * anything. It's kept only as a reported config value (see
 * GET /api/health) for operators who want to confirm what's deployed.
 */
export function isDemoMode(): boolean {
  return process.env.DEMO_MODE !== "false";
}

/**
 * Base URL of the public MCP Skill Server (e.g. its Render URL + "/mcp").
 * Server-side only — never exposed to the client. Unset by default, in
 * which case the orchestrator skips the remote call entirely and uses
 * @ai-product-factory/skill-tools locally (see src/server/mcp-client.ts).
 */
export function getMcpServerUrl(): string | null {
  const url = process.env.MCP_SERVER_URL;
  if (!url || url.trim().length === 0) return null;
  try {
    // eslint-disable-next-line no-new
    new URL(url);
    return url;
  } catch {
    console.warn("MCP_SERVER_URL is not a valid URL; ignoring and using local skill-tools.");
    return null;
  }
}

/**
 * Per-request timeout for calls to the public MCP server, in milliseconds.
 * Kept short (recommended 3000-5000ms) so a slow or unresponsive MCP
 * server never makes the demo feel broken — the orchestrator falls back
 * to local skill-tools once this elapses.
 */
export function getMcpTimeoutMs(): number {
  const parsed = Number.parseInt(process.env.MCP_TIMEOUT_MS ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 4000;
}

/**
 * Live Gemini Mode config. All server-side only — none of these are ever
 * sent to the client. See docs/architecture.md, "Live Gemini Mode", for
 * the full gating logic and src/server/llm/ for the provider that reads
 * them.
 */

/** Server-side kill switch. Live Gemini Mode never runs unless this is "true". */
export function isLiveAiFlagEnabled(): boolean {
  return process.env.ENABLE_LIVE_AI === "true";
}

/** Only "gemini" is implemented today; the provider abstraction (src/server/llm/) supports adding others later. */
export function getLlmProvider(): string | null {
  const provider = process.env.LLM_PROVIDER;
  return provider && provider.trim().length > 0 ? provider.trim() : null;
}

/** Never logged, never returned in any response, never read on the client. */
export function getLlmApiKey(): string | null {
  const key = process.env.LLM_API_KEY;
  return key && key.trim().length > 0 ? key.trim() : null;
}

/**
 * Default model is gemini-2.5-flash. Free-tier quota for any given model
 * varies by Google Cloud project — if generation fails with a 429
 * "quota exceeded" provider_error, check which models your key actually
 * has free quota for (GET /v1beta/models?key=... lists them) and set
 * LLM_MODEL accordingly. Model names/availability can also change upstream
 * over time — verify against current Gemini API docs.
 */
export function getLlmModel(): string {
  const model = process.env.LLM_MODEL;
  return model && model.trim().length > 0 ? model.trim() : "gemini-2.5-flash";
}

/**
 * Generation can take longer than the MCP timeout; default is intentionally
 * more generous. Empirically, a full blueprint-generation prompt against
 * gemini-2.5-flash with thinking disabled (see gemini-provider.ts) still
 * takes meaningfully longer than a trivial prompt — keep this comfortably
 * above your observed latency for whichever model you configure.
 */
export function getLlmTimeoutMs(): number {
  const parsed = Number.parseInt(process.env.LLM_TIMEOUT_MS ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 30000;
}

/** Per-anonymous-user, per-UTC-day cap on Live Gemini requests. See src/server/live-ai-rate-limit.ts. */
export function getLiveAiDailyLimit(): number {
  const parsed = Number.parseInt(process.env.LIVE_AI_DAILY_LIMIT ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 10;
}

/**
 * True only when all three gates pass: the operator opted in
 * (ENABLE_LIVE_AI=true), the configured provider is the one implemented
 * (LLM_PROVIDER=gemini), and a key is present (LLM_API_KEY). This is
 * re-checked on every request server-side — a client claiming
 * generationMode: "live" cannot bypass it.
 */
export function isLiveGeminiConfigured(): boolean {
  return isLiveAiFlagEnabled() && getLlmProvider() === "gemini" && getLlmApiKey() !== null;
}
