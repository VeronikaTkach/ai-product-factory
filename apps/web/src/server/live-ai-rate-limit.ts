/**
 * In-memory, per-anonymous-id, per-UTC-day counter gating Live Gemini Mode.
 *
 * Known limitations (document, don't hide):
 * - This is a single-process Map, not a shared store. On Vercel serverless,
 *   each function instance has its own memory; a cold start resets all
 *   counts to zero, and concurrent warm instances do not share counts. The
 *   effective limit is "best-effort ~N/day per warm instance," not a hard
 *   global guarantee.
 * - The bucket key is the anonymous cookie id (src/server/anon-id.ts), not
 *   a real identity. Clearing cookies (or using a different browser/device)
 *   resets a user's observed quota. This is an accepted tradeoff for a
 *   no-auth MVP — see docs/architecture.md, "Live Gemini Mode".
 * - No business idea text is ever stored here — only an id, a count, and a
 *   date key.
 *
 * A real deployment that needs a hard cap would need a shared store
 * (Redis, Postgres, etc.) — explicitly out of scope per AGENTS.project.md
 * ("no database unless requested").
 */

interface IBucket {
  count: number;
  dateKey: string;
}

const buckets = new Map<string, IBucket>();

function utcDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export interface IQuotaCheckResult {
  allowed: boolean;
  remaining: number;
  limit: number;
}

/**
 * Atomically checks and consumes one unit of quota for `anonId`. Call this
 * once per Live Gemini attempt (before calling the provider), so a failed
 * generation still counts against the quota — the cost of calling the
 * upstream API is incurred per attempt, not per success.
 */
export function consumeLiveAiQuota(anonId: string, limit: number): IQuotaCheckResult {
  const dateKey = utcDateKey();
  const existing = buckets.get(anonId);

  if (!existing || existing.dateKey !== dateKey) {
    buckets.set(anonId, { count: 1, dateKey });
    return { allowed: true, remaining: Math.max(limit - 1, 0), limit };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, limit };
  }

  existing.count += 1;
  return { allowed: true, remaining: Math.max(limit - existing.count, 0), limit };
}
