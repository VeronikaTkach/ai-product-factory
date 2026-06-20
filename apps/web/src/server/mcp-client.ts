import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { z } from "zod";
import { SkillRecommendationSchema } from "@ai-product-factory/skill-tools";
import type { ISkillRecommendation, TIdeaSignal } from "@ai-product-factory/skill-tools";
import { getMcpServerUrl, getMcpTimeoutMs } from "./config";

const RecommendSkillsToolResultSchema = z.object({
  recommendations: z.array(SkillRecommendationSchema),
});

/**
 * Calls the public MCP server's recommend_skills tool. Returns null on any
 * failure — network error, timeout, rate limit (HTTP 429), malformed/
 * unvalidated response, or MCP_SERVER_URL unset — so the caller can fall
 * back to the local skill-tools recommender without breaking the demo.
 * This function never throws.
 *
 * Never logs the idea text itself. Logged warnings contain only the
 * failure reason (timeout, HTTP status, validation error name), not
 * request content.
 */
export async function fetchRecommendedSkillsFromMcp(
  idea: TIdeaSignal,
  limit: number,
): Promise<ISkillRecommendation[] | null> {
  const serverUrl = getMcpServerUrl();
  if (!serverUrl) return null;

  const timeoutMs = getMcpTimeoutMs();
  const client = new Client({ name: "ai-product-factory-web", version: "0.1.0" });

  try {
    const transport = new StreamableHTTPClientTransport(new URL(serverUrl));
    await client.connect(transport, { timeout: timeoutMs });

    const result = await client.callTool(
      { name: "recommend_skills", arguments: { idea, limit } },
      undefined,
      { timeout: timeoutMs },
    );

    if (result.isError) {
      logMcpWarning("recommend_skills tool returned an error result");
      return null;
    }

    const parsed = RecommendSkillsToolResultSchema.safeParse(result.structuredContent);
    if (!parsed.success) {
      logMcpWarning("recommend_skills returned a response that failed local validation");
      return null;
    }

    return parsed.data.recommendations;
  } catch (error) {
    logMcpWarning(`recommend_skills call failed: ${toSafeErrorSummary(error)}`);
    return null;
  } finally {
    await client.close().catch(() => {
      // Best-effort cleanup; a close failure shouldn't surface as the
      // operation's outcome.
    });
  }
}

function toSafeErrorSummary(error: unknown): string {
  if (error instanceof Error) {
    return error.message ? `${error.name}: ${truncate(error.message, 200)}` : error.name;
  }
  return "unknown error";
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

function logMcpWarning(message: string): void {
  console.warn(`[mcp-client] ${message} — falling back to local skill-tools.`);
}
