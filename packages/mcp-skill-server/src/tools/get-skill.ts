import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { GetSkillInputSchema, SkillDetailSchema, getSkill } from "@ai-product-factory/skill-tools";
import { logToolCall } from "../logging";
import { toMessage } from "./util";

export function registerGetSkillTool(server: McpServer): void {
  server.registerTool(
    "get_skill",
    {
      title: "Get Skill",
      description:
        "Get the full SKILL.md content and metadata for one skill id from the bundled agent-skill-kit (read-only). Use list_skills first to discover valid ids.",
      inputSchema: GetSkillInputSchema.shape,
      outputSchema: SkillDetailSchema.shape,
    },
    async (args) => {
      const start = Date.now();
      try {
        const skill = await getSkill(args);
        logToolCall("get_skill", {
          durationMs: Date.now() - start,
          success: true,
          skillId: skill.id,
        });
        return {
          content: [{ type: "text", text: JSON.stringify(skill) }],
          structuredContent: { ...skill },
        };
      } catch (error) {
        logToolCall("get_skill", { durationMs: Date.now() - start, success: false });
        return {
          content: [{ type: "text", text: `Failed to get skill: ${toMessage(error)}` }],
          isError: true,
        };
      }
    },
  );
}
