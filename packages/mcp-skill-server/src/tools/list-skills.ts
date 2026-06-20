import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { SkillMetadataSchema, listSkills } from "@ai-product-factory/skill-tools";
import { logToolCall } from "../logging";
import { toMessage } from "./util";

export function registerListSkillsTool(server: McpServer): void {
  server.registerTool(
    "list_skills",
    {
      title: "List Skills",
      description:
        "List every skill available in the bundled agent-skill-kit (read-only), with id, name, description, and inferred tags.",
      outputSchema: { skills: z.array(SkillMetadataSchema) },
    },
    async () => {
      const start = Date.now();
      try {
        const skills = await listSkills();
        logToolCall("list_skills", {
          durationMs: Date.now() - start,
          success: true,
          resultCount: skills.length,
        });
        return {
          content: [{ type: "text", text: JSON.stringify(skills) }],
          structuredContent: { skills },
        };
      } catch (error) {
        logToolCall("list_skills", { durationMs: Date.now() - start, success: false });
        return {
          content: [{ type: "text", text: `Failed to list skills: ${toMessage(error)}` }],
          isError: true,
        };
      }
    },
  );
}
