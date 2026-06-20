import type { NextFunction, Request, Response } from "express";

interface IBucket {
  count: number;
  windowStartedAt: number;
}

const WINDOW_MS = 60_000;

/**
 * Minimal in-memory fixed-window rate limiter, keyed by client IP.
 *
 * Known limitations (acceptable for a demo-scale Render Free instance):
 * - State is per-process: resets on restart and is not shared across
 *   instances if the service is ever scaled beyond one dyno.
 * - The bucket map is never pruned, so long-running processes seeing many
 *   distinct IPs will grow memory slowly. Fine for a capstone demo;
 *   revisit with a TTL sweep or a real rate-limit store before any
 *   higher-traffic deployment.
 */
export function createRateLimiter(requestsPerMinute: number) {
  const buckets = new Map<string, IBucket>();

  return function rateLimit(req: Request, res: Response, next: NextFunction): void {
    const key = req.ip ?? "unknown";
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || now - bucket.windowStartedAt >= WINDOW_MS) {
      buckets.set(key, { count: 1, windowStartedAt: now });
      next();
      return;
    }

    if (bucket.count >= requestsPerMinute) {
      res.status(429).json({ error: "Too many requests. Please slow down." });
      return;
    }

    bucket.count += 1;
    next();
  };
}
