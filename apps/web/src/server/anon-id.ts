import { randomUUID } from "node:crypto";
import type { NextRequest, NextResponse } from "next/server";

/**
 * Opaque, anonymous client identifier used ONLY to bucket the Live Gemini
 * Mode daily request counter (src/server/live-ai-rate-limit.ts). It is not
 * an auth token, grants no privilege, and is never linked to any stored
 * business idea text. A user can reset their quota at any time by clearing
 * cookies — that's an accepted limitation for a no-auth MVP (see
 * docs/architecture.md, "Live Gemini Mode" for the full caveat).
 */
export const ANON_ID_COOKIE = "aipf_anon_id";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface IAnonIdResult {
  anonId: string;
  isNew: boolean;
}

/** Reads the existing anon id cookie, or generates a fresh one. Does not write anything itself — see attachAnonIdCookie. */
export function getOrCreateAnonId(request: NextRequest): IAnonIdResult {
  const existing = request.cookies.get(ANON_ID_COOKIE)?.value;
  if (existing && UUID_PATTERN.test(existing)) {
    return { anonId: existing, isNew: false };
  }
  return { anonId: randomUUID(), isNew: true };
}

/** Sets the anon id cookie on the response when a new one was generated. httpOnly: not readable/forgeable from client JS. */
export function attachAnonIdCookie(response: NextResponse, anonId: string): void {
  response.cookies.set(ANON_ID_COOKIE, anonId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 400,
  });
}
