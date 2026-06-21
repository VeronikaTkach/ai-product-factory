import { getSkill } from "@ai-product-factory/skill-tools";

const MAX_CONTENT_CHARS = 1200;

export interface ISkillContextEntry {
  id: string;
  name: string;
  description: string;
  content: string;
}

/**
 * Fetches the full SKILL.md content for each selected skill, for use as
 * Live Gemini prompt context (see llm/blueprint-generator.ts).
 *
 * Deliberately uses the local @ai-product-factory/skill-tools `getSkill`
 * directly rather than the MCP server: skill *content* for a known id is
 * identical either way (the MCP server is a thin transport over the same
 * bundled agent-skill-kit/skills files), so calling it remotely here would
 * only add latency with no behavioral difference. MCP-first only applies
 * to *recommendation* (recommend_skills), where the MCP server and the
 * local fallback could in principle diverge — see src/server/mcp-client.ts.
 *
 * Unknown/missing skill ids are skipped rather than failing the whole
 * request — a stale or hand-edited id shouldn't block generation.
 */
export async function getSkillContextForIds(selectedSkillIds: string[]): Promise<ISkillContextEntry[]> {
  const results = await Promise.all(
    selectedSkillIds.map(async (id) => {
      try {
        const skill = await getSkill({ id });
        return {
          id: skill.id,
          name: skill.name,
          description: skill.description,
          content: truncate(skill.content, MAX_CONTENT_CHARS),
        };
      } catch {
        return null;
      }
    }),
  );

  return results.filter((entry): entry is ISkillContextEntry => entry !== null);
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}
