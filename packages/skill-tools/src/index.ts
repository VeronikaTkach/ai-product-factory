export * from "./types";
export * from "./schemas";
export { listSkills, getSkill, recommendSkills, scoreReadiness } from "./tools";
export { resolveSkillsRoot } from "./reader";

/**
 * Typed entry point for callers that already hold a validated TIdeaSignal
 * (e.g. apps/web's orchestrator, which validates the full business idea
 * upstream via its own Zod schema). Avoids re-running Zod parsing for a
 * value that is already known to be valid, while `recommendSkills` from
 * `./tools` remains the unknown-input entry point for MCP/HTTP callers.
 */
export { recommendSkills as recommendSkillsDirect } from "./recommender";
