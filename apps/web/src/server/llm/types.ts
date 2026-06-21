/**
 * Provider abstraction for Live Gemini Mode. Only Gemini is implemented
 * today (see gemini-provider.ts), but every call site depends on this
 * interface, not on Gemini specifics, so adding another provider later
 * means writing one new file, not touching the orchestrator or route.
 */
export interface IGenerateTextOptions {
  /**
   * An optional JSON-Schema-like constraint (provider-specific format) the
   * model should structure its output to. Providers that support it (e.g.
   * Gemini's `responseSchema`) should use it both to enforce shape and to
   * keep output from running unbounded — providers that don't support it
   * can ignore this and rely on the caller's own parsing/validation.
   */
  responseSchema?: unknown;
}

export interface ILlmProvider {
  readonly id: string;
  /**
   * Sends `prompt` to the model and returns its raw text response. Callers
   * are responsible for parsing/validating that text (see
   * blueprint-generator.ts) — this interface makes no assumption about
   * response format beyond the optional `responseSchema` hint.
   *
   * Must reject with a LiveGenerationError (src/server/llm/errors.ts) on
   * timeout or provider failure — never let a raw provider exception or
   * raw HTTP error body escape this boundary.
   */
  generateText(prompt: string, timeoutMs: number, options?: IGenerateTextOptions): Promise<string>;
}
