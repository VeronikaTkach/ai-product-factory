import type { ISelectedSkill, TGenerationMode } from "@/types/blueprint";

interface IGenerationLoadingBannerProps {
  generationMode: TGenerationMode;
  selectedSkills: ISelectedSkill[];
}

/**
 * Shown above WorkflowProgress during the "generating-blueprint" stage.
 * Demo and Live Gemini have distinct copy since their actual wait times
 * are very different (Demo: near-instant; Live: a real network call to
 * Gemini, which can take up to the configured LLM_TIMEOUT_MS — default
 * 30s). Naming the selected skills here makes it clear *why* Live Gemini
 * takes longer than Demo Mode: it's not just generating text, it's using
 * the user's chosen skill guidance as prompt context.
 */
export function GenerationLoadingBanner({ generationMode, selectedSkills }: IGenerationLoadingBannerProps) {
  const isLive = generationMode === "live";

  return (
    <div
      className={`mx-auto mb-4 max-w-2xl rounded-lg border p-4 text-sm ${
        isLive ? "border-indigo-300 bg-indigo-50 text-indigo-800" : "border-slate-200 bg-slate-50 text-slate-700"
      }`}
    >
      <div className="flex items-start gap-3">
        <Spinner accent={isLive} />
        <div>
          <p className="font-semibold">
            {isLive
              ? "Generating with Live Gemini. This may take up to 30 seconds."
              : "Generating with Demo Mode — deterministic, usually instant."}
          </p>
          {isLive && (
            <p className="mt-1 text-xs text-indigo-700">
              {selectedSkills.length > 0
                ? `Using ${selectedSkills.length} selected skill${selectedSkills.length === 1 ? "" : "s"} as prompt context: ${selectedSkills.map((skill) => skill.name).join(", ")}.`
                : "No skills selected — Gemini will use general best practices."}
            </p>
          )}
          <p className="mt-1 text-xs text-slate-500">
            The Readiness Score is always calculated by this app's deterministic evaluator, not by Gemini,
            so it stays consistent in either mode.
          </p>
        </div>
      </div>
    </div>
  );
}

function Spinner({ accent }: { accent: boolean }) {
  return (
    <span
      className={`mt-0.5 inline-block h-4 w-4 flex-shrink-0 animate-spin rounded-full border-2 border-t-transparent ${
        accent ? "border-indigo-400" : "border-slate-300"
      }`}
      aria-hidden="true"
    />
  );
}
