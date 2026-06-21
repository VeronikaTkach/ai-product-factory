export type TLiveGenerationErrorCode =
  | "unavailable"
  | "rate_limited"
  | "timeout"
  | "invalid_output"
  | "provider_error";

/**
 * Thrown by the live (Gemini) generation path for every failure mode the
 * route handler needs to distinguish: not configured, daily quota
 * exhausted, request timed out, the model returned something that didn't
 * validate, or any other upstream provider error. Each carries a
 * `userMessage` that's safe to show directly in the UI (no API keys, no
 * raw provider error bodies, no business idea text).
 */
export class LiveGenerationError extends Error {
  readonly code: TLiveGenerationErrorCode;
  readonly userMessage: string;

  constructor(code: TLiveGenerationErrorCode, userMessage: string, options?: { cause?: unknown }) {
    super(userMessage, options);
    this.name = "LiveGenerationError";
    this.code = code;
    this.userMessage = userMessage;
  }
}
