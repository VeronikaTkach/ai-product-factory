import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

/**
 * Safe, read-only access to the bundled agent-skill-kit/skills directory.
 *
 * Security model (see agent-security-review, mcp-tool-consumption):
 * - The root path is server config (SKILL_KIT_PATH or a fixed relative
 *   default), never a value supplied by a caller.
 * - Skill ids are only ever used after being matched against a real
 *   directory listing (see readSkillMarkdown). A traversal sequence like
 *   "../../etc" cannot match a real directory name, so it is rejected by
 *   construction rather than by blacklisting characters.
 * - This module never writes, deletes, or executes anything.
 *
 * The default root is resolved relative to process.cwd() of whichever
 * process imports this package (apps/web or packages/mcp-skill-server),
 * each of which sits two directories below the repo root that contains
 * agent-skill-kit/.
 */

const DEFAULT_RELATIVE_ROOT = path.join("..", "..", "agent-skill-kit", "skills");

export function resolveSkillsRoot(): string {
  const configured = process.env.SKILL_KIT_PATH;
  const base = configured && configured.trim().length > 0 ? configured : DEFAULT_RELATIVE_ROOT;
  return path.resolve(process.cwd(), base);
}

export async function listSkillDirectoryNames(): Promise<string[]> {
  const root = resolveSkillsRoot();
  let entries;
  try {
    entries = await readdir(root, { withFileTypes: true });
  } catch (error) {
    console.error("Failed to read skill kit directory", root, error);
    return [];
  }
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

/**
 * Returns the raw SKILL.md content for a skill id, or null if the id does
 * not match a real directory under the skills root. `id` is checked against
 * a live directory listing before being used in any path, so this is safe
 * against path traversal regardless of what string is passed in.
 */
export async function readSkillMarkdown(id: string): Promise<string | null> {
  const knownIds = await listSkillDirectoryNames();
  if (!knownIds.includes(id)) {
    return null;
  }
  const filePath = path.join(resolveSkillsRoot(), id, "SKILL.md");
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    console.error("Failed to read SKILL.md for", id, error);
    return null;
  }
}

export interface IParsedFrontmatter {
  name?: string;
  description?: string;
  body: string;
}

/**
 * Minimal parser for the two-field frontmatter shape used by every
 * SKILL.md in this repository (`name:` and `description:`, single line
 * each). Not a general YAML parser; intentionally narrow to avoid adding
 * a YAML dependency for two scalar fields.
 */
export function parseFrontmatter(markdown: string): IParsedFrontmatter {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { body: markdown.trim() };
  }
  const [, frontmatter, body] = match;
  const name = frontmatter.match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const description = frontmatter.match(/^description:\s*(.+)$/m)?.[1]?.trim();
  return { name, description, body: body.trim() };
}
