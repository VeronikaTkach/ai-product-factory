import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  ReadinessResultSchema,
  ScoreReadinessInputSchema,
  scoreReadiness,
} from "@ai-product-factory/skill-tools";
import { logToolCall } from "../logging";
import { toMessage } from "./util";

export function registerScoreReadinessTool(server: McpServer): void {
  server.registerTool(
    "score_readiness",
    {
      title: "Score Readiness",
      description:
        "Compute a deterministic, content-length-based readiness heuristic across Product Spec, MVP Scope, Architecture, Security, Roadmap, and Tasks text. A placeholder heuristic, not a live evaluation model.",
      inputSchema: ScoreReadinessInputSchema.shape,
      outputSchema: ReadinessResultSchema.shape,
    },
    async (args) => {
      const start = Date.now();
      try {
        const result = scoreReadiness(args);
        logToolCall("score_readiness", {
          durationMs: Date.now() - start,
          success: true,
          finalScore: result.finalScore,
        });
        return {
          content: [{ type: "text", text: JSON.stringify(result) }],
          structuredContent: { ...result },
        };
      } catch (error) {
        logToolCall("score_readiness", { durationMs: Date.now() - start, success: false });
        return {
          content: [{ type: "text", text: `Failed to score readiness: ${toMessage(error)}` }],
          isError: true,
        };
      }
    },
  );
}
