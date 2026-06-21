import { LiveGenerationError } from "./errors";
import type { IGenerateTextOptions, ILlmProvider } from "./types";

const MAX_OUTPUT_TOKENS = 8192;

/**
 * Thin wrapper over the Gemini "generateContent" REST endpoint. Uses the
 * platform's native fetch (no new npm dependency) with an AbortController
 * timeout. Requests JSON-mode output (responseMimeType: "application/json"),
 * and a `responseSchema` when the caller provides one, since
 * blueprint-generator.ts needs structured output, not free text.
 *
 * `thinkingConfig.thinkingBudget: 0` disables extended "thinking" on
 * thinking-capable models (e.g. 2.5-flash). Discovered empirically: with
 * thinking enabled and no schema, a single blueprint-generation prompt
 * produced a 250KB+ response that got truncated mid-JSON by the output
 * token limit, which JSON.parse then rejected. Disabling thinking and
 * supplying a strict responseSchema fixed both the latency and the
 * truncation — this is tuning for *this* generation task (structured
 * Markdown-in-JSON, not open-ended reasoning), not a general claim that
 * thinking is undesirable for other Gemini use cases.
 *
 * Security/privacy notes:
 * - The API key is only ever read from server-side config and only ever
 *   appended to the request URL sent to Google's API — never logged, never
 *   included in any error message returned to the client.
 * - On any non-2xx response or network failure, only the HTTP status (or
 *   "network error") is surfaced — never the raw response body, which
 *   could (in principle) echo back request content.
 */
export class GeminiProvider implements ILlmProvider {
  readonly id = "gemini";

  constructor(
    private readonly apiKey: string,
    private readonly model: string,
  ) {}

  async generateText(prompt: string, timeoutMs: number, options?: IGenerateTextOptions): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    let response: Response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            ...(options?.responseSchema ? { responseSchema: options.responseSchema } : {}),
            temperature: 0.4,
            maxOutputTokens: MAX_OUTPUT_TOKENS,
            // thinkingConfig is only a recognized field for the 2.5 model
            // family; sending it to a model that doesn't support "thinking"
            // risks an unknown-field error, so it's only included when the
            // configured model name suggests support.
            ...(/2\.5/.test(this.model) ? { thinkingConfig: { thinkingBudget: 0 } } : {}),
          },
        }),
      });
    } catch (error) {
      if (controller.signal.aborted) {
        throw new LiveGenerationError(
          "timeout",
          "Live Gemini did not respond in time. Try again, or switch to Demo Mode to continue.",
          { cause: error },
        );
      }
      throw new LiveGenerationError(
        "provider_error",
        "Live Gemini is unreachable right now. Try again, or switch to Demo Mode to continue.",
        { cause: error },
      );
    } finally {
      clearTimeout(timer);
    }

    if (!response.ok) {
      throw new LiveGenerationError(
        "provider_error",
        `Live Gemini returned an error (status ${response.status}). Try again, or switch to Demo Mode to continue.`,
      );
    }

    let payload: unknown;
    try {
      payload = await response.json();
    } catch (error) {
      throw new LiveGenerationError(
        "invalid_output",
        "Live Gemini returned a response that could not be read. Switch to Demo Mode to continue.",
        { cause: error },
      );
    }

    const text = extractText(payload);
    if (text === null) {
      throw new LiveGenerationError(
        "invalid_output",
        "Live Gemini did not return usable content (it may have been blocked by safety filters). Switch to Demo Mode to continue.",
      );
    }

    return text;
  }
}

function extractText(payload: unknown): string | null {
  if (typeof payload !== "object" || payload === null) return null;
  const candidates = (payload as { candidates?: unknown }).candidates;
  if (!Array.isArray(candidates) || candidates.length === 0) return null;

  const first = candidates[0] as { content?: { parts?: unknown } } | undefined;
  const parts = first?.content?.parts;
  if (!Array.isArray(parts) || parts.length === 0) return null;

  const textPart = parts.find(
    (part): part is { text: string } =>
      typeof part === "object" && part !== null && typeof (part as { text?: unknown }).text === "string",
  );
  return textPart ? textPart.text : null;
}
