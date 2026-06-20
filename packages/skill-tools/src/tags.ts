const TAG_KEYWORDS: Record<string, string[]> = {
  planning: ["specification", "spec", "acceptance criteria", "bdd"],
  frontend: ["react", "frontend", "tailwind", "shadcn", "radix"],
  backend: ["nestjs", "backend"],
  database: ["postgresql", "prisma", "supabase", "database", "schema", "migration"],
  mcp: ["mcp"],
  testing: ["test", "playwright", "regression"],
  agents: ["agent", "a2a", "orchestrat", "delegation"],
  "generative-ui": ["a2ui", "generative ui", "declarative ui"],
  security: ["security", "auth", "secrets", "risk", "trust"],
  observability: ["observability", "trace", "audit", "telemetry", "cost tracking"],
  commerce: ["commerce", "payment", "purchas", "ap2", "ucp"],
  pwa: ["pwa", "service worker", "offline", "manifest", "installab"],
  review: ["review", "pr", "diff"],
};

/** Lightweight, deterministic keyword inference over a skill's own description. No LLM, no external lookups. */
export function inferTags(description: string): string[] {
  const lower = description.toLowerCase();
  return Object.entries(TAG_KEYWORDS)
    .filter(([, keywords]) => keywords.some((keyword) => lower.includes(keyword)))
    .map(([tag]) => tag);
}
