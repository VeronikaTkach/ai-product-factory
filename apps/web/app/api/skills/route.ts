import { NextResponse } from "next/server";
import { listSkills } from "@ai-product-factory/skill-tools";

/**
 * Full skill catalog for the manual skill selector UI. Always reads the
 * local bundled agent-skill-kit/skills via @ai-product-factory/skill-tools
 * — this is just metadata about the repository's own skill kit, so there's
 * no need to go through the public MCP server (and no idea-specific
 * recommendation logic involved, unlike /api/blueprint's recommend_skills
 * call).
 */
export async function GET() {
  const skills = await listSkills();
  return NextResponse.json({ skills });
}
