/**
 * DEMO_MODE is the only generation path implemented so far (Phase 3).
 * Live LLM calls are a later phase; isDemoMode() being false today is a
 * deliberate "not implemented yet" signal, not a silent fallback.
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
