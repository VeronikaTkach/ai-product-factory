import { listSkillDirectoryNames, parseFrontmatter, readSkillMarkdown } from "./reader";
import { inferTags } from "./tags";
import type { ISkillMetadata } from "./types";

export async function getAllSkillMetadata(): Promise<ISkillMetadata[]> {
  const ids = await listSkillDirectoryNames();
  const results = await Promise.all(ids.map((id) => buildMetadata(id)));
  return results.filter((result): result is ISkillMetadata => result !== null);
}

async function buildMetadata(id: string): Promise<ISkillMetadata | null> {
  const markdown = await readSkillMarkdown(id);
  if (!markdown) return null;
  const { name, description } = parseFrontmatter(markdown);
  const resolvedDescription = description ?? "";
  return {
    id,
    name: name ?? id,
    description: resolvedDescription,
    tags: inferTags(resolvedDescription),
  };
}
