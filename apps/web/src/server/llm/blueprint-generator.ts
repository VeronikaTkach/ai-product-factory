import type { IBusinessIdea } from "@/types/blueprint";
import { LiveBlueprintContentSchema, type TLiveBlueprintContent } from "@/server/schemas";
import { getLlmTimeoutMs } from "@/server/config";
import { getSkillContextForIds } from "@/server/skill-context";
import { buildBlueprintPrompt } from "./blueprint-prompt";
import { LiveGenerationError } from "./errors";
import { getConfiguredLlmProvider } from "./provider";

/**
 * Gemini's `responseSchema` (a constrained subset of OpenAPI schema)
 * mirrors LiveBlueprintContentSchema's shape — four fields, no
 * readinessScore (see that schema's docstring for why). Passing this keeps
 * the model's output bounded to exactly these fields — empirically, this
 * also prevented the runaway, eventually-truncated-mid-JSON output seen
 * without it (see gemini-provider.ts's docstring for what was observed).
 */
const GEMINI_BLUEPRINT_CONTENT_SCHEMA = {
  type: "OBJECT",
  properties: {
    architecture: { type: "STRING" },
    security: { type: "STRING" },
    roadmap: { type: "STRING" },
    tasks: { type: "STRING" },
  },
  required: ["architecture", "security", "roadmap", "tasks"],
};

/**
 * Live Gemini path for the blueprint stage. Returns only
 * architecture/security/roadmap/tasks — readinessScore is deliberately not
 * requested from the model; the orchestrator computes it afterward via the
 * same deterministic Evaluation agent Demo Mode uses, so Readiness Score
 * is consistently rich in both modes (see orchestrator.ts).
 *
 * Throws LiveGenerationError for every failure mode (unavailable, timeout,
 * invalid output, provider error) — callers must not swallow it silently;
 * per the feature requirements, Live Gemini failures are shown to the
 * user, not silently substituted with demo content.
 */
export async function generateLiveBlueprint(input: {
  idea: IBusinessIdea;
  productSpec: string;
  mvpScope: string;
  selectedSkillIds: string[];
}): Promise<TLiveBlueprintContent> {
  const provider = getConfiguredLlmProvider();
  if (!provider) {
    throw new LiveGenerationError(
      "unavailable",
      "Live Gemini Mode is not configured on this server. Switch to Demo Mode to continue.",
    );
  }

  const skillContext = await getSkillContextForIds(input.selectedSkillIds);
  const prompt = buildBlueprintPrompt({
    idea: input.idea,
    productSpec: input.productSpec,
    mvpScope: input.mvpScope,
    skillContext,
  });

  const rawText = await provider.generateText(prompt, getLlmTimeoutMs(), {
    responseSchema: GEMINI_BLUEPRINT_CONTENT_SCHEMA,
  });

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawText);
  } catch (error) {
    throw new LiveGenerationError(
      "invalid_output",
      "Live Gemini returned a response that wasn't valid JSON. Switch to Demo Mode to continue.",
      { cause: error },
    );
  }

  const result = LiveBlueprintContentSchema.safeParse(parsedJson);
  if (!result.success) {
    throw new LiveGenerationError(
      "invalid_output",
      "Live Gemini returned content in an unexpected shape. Switch to Demo Mode to continue.",
    );
  }

  return result.data;
}
