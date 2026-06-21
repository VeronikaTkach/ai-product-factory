import { getLlmApiKey, getLlmModel, getLlmProvider, isLiveGeminiConfigured } from "@/server/config";
import { GeminiProvider } from "./gemini-provider";
import type { ILlmProvider } from "./types";

/**
 * Returns a configured provider, or null if Live Gemini Mode isn't fully
 * configured (see isLiveGeminiConfigured — the same three-gate check the
 * route handler uses). Callers must treat null as "live mode unavailable"
 * and respond accordingly; this function never throws to signal that.
 *
 * Only "gemini" is implemented. If LLM_PROVIDER is set to anything else,
 * this returns null (treated as unconfigured) rather than guessing.
 */
export function getConfiguredLlmProvider(): ILlmProvider | null {
  if (!isLiveGeminiConfigured()) return null;

  const provider = getLlmProvider();
  const apiKey = getLlmApiKey();
  if (provider === "gemini" && apiKey) {
    return new GeminiProvider(apiKey, getLlmModel());
  }
  return null;
}
