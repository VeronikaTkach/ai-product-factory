import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  RecommendSkillsInputSchema,
  SkillRecommendationSchema,
  recommendSkills,
} from "@ai-product-factory/skill-tools";
import { logToolCall } from "../logging";
import { toMessage } from "./util";

export function registerRecommendSkillsTool(server: McpServer): void {
  server.registerTool(
    "recommend_skills",
    {
      title: "Recommend Skills",
      description:
        "Recommend relevant skills from the bundled agent-skill-kit for a business idea signal (description, core idea, key features, problem statement, and data-sensitivity flags). Deterministic and rule-based — no LLM call.",
      inputSchema: RecommendSkillsInputSchema.shape,
      outputSchema: { recommendations: z.array(SkillRecommendationSchema) },
    },
    async (args) => {
      const start = Date.now();
      try {
        const recommendations = await recommendSkills(args);
        // Log only lengths, never the idea text itself.
        const idea = (args as { idea?: Record<string, unknown> }).idea ?? {};
        const ideaTextLength = ["businessDescription", "coreIdea", "keyFeatures", "problemStatement"]
          .map((key) => String(idea[key] ?? "").length)
          .reduce((sum, len) => sum + len, 0);
        logToolCall("recommend_skills", {
          durationMs: Date.now() - start,
          success: true,
          resultCount: recommendations.length,
          ideaTextLength,
        });
        return {
          content: [{ type: "text", text: JSON.stringify(recommendations) }],
          structuredContent: { recommendations },
        };
      } catch (error) {
        logToolCall("recommend_skills", { durationMs: Date.now() - start, success: false });
        return {
          content: [{ type: "text", text: `Failed to recommend skills: ${toMessage(error)}` }],
          isError: true,
        };
      }
    },
  );
}
