/**
 * Server config, all read from environment variables (server-side only,
 * never sent to a client). No secrets are required for this server — it
 * has nothing to authenticate to.
 */

export function getPort(): number {
  const parsed = Number.parseInt(process.env.PORT ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 3001;
}

export function getHost(): string {
  return process.env.HOST ?? "0.0.0.0";
}

/**
 * Restricts the Host header the server will accept, mitigating DNS
 * rebinding attacks. Derived from ALLOWED_ORIGIN (e.g.
 * "https://your-vercel-app.vercel.app") if set. Leave unset only for local
 * development.
 */
export function getAllowedHosts(): string[] | undefined {
  const allowedOrigin = process.env.ALLOWED_ORIGIN;
  if (!allowedOrigin) return undefined;
  try {
    return [new URL(allowedOrigin).host];
  } catch {
    console.warn(`ALLOWED_ORIGIN is not a valid URL, ignoring: ${allowedOrigin}`);
    return undefined;
  }
}

export function getRateLimitPerMinute(): number {
  const parsed = Number.parseInt(process.env.RATE_LIMIT_REQUESTS_PER_MINUTE ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 60;
}

export function getServerName(): string {
  return process.env.MCP_SERVER_NAME ?? "ai-product-factory-skill-server";
}

export function getLogLevel(): string {
  return process.env.MCP_LOG_LEVEL ?? "info";
}
