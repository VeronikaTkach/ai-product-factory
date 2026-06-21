import type { TGenerationMode } from "@/types/blueprint";

interface IGenerationModeSwitcherProps {
  mode: TGenerationMode;
  onChange: (mode: TGenerationMode) => void;
}

/**
 * Demo Mode vs Live Gemini Mode switcher. Shown on the idea form (initial
 * choice) and again on the spec approval / adjust-skills screen, so a user
 * can change mode right before triggering generation or after a Live
 * failure — see ProductFactoryApp's handling of LiveGenerationError.
 *
 * This component never reads any server config — both options are always
 * shown regardless of whether Live Gemini is actually configured on the
 * server. If it isn't, the user finds out via a clear error after
 * attempting it (see app/api/blueprint/route.ts), not from a disabled
 * button here. This keeps the client free of any signal about server env
 * vars, per the "never expose server config to the client" requirement.
 */
export function GenerationModeSwitcher({ mode, onChange }: IGenerationModeSwitcherProps) {
  return (
    <fieldset className="rounded-lg border border-slate-200 bg-white p-4">
      <legend className="px-1 text-sm font-semibold text-slate-900">Generation mode</legend>
      <p className="mb-2 text-xs text-slate-500">
        Applies to Architecture, Security, Roadmap, Tasks, and Readiness Score, generated after
        you approve the Product Spec. The Product Spec itself is always deterministic.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <ModeOption
          id="generation-mode-demo"
          label="Demo Mode"
          description="Demo Mode uses deterministic, skill-informed generation. Always reliable, no external calls."
          checked={mode === "demo"}
          onSelect={() => onChange("demo")}
        />
        <ModeOption
          id="generation-mode-live"
          label="Live Gemini"
          // "10" matches LIVE_AI_DAILY_LIMIT's documented default
          // (apps/web/src/server/config.ts). The server enforces the
          // real configured value regardless of this copy.
          description="Live Gemini uses a server-side Gemini API key. It's limited to 10 requests per day per user — do not submit sensitive real data."
          checked={mode === "live"}
          onSelect={() => onChange("live")}
        />
      </div>
    </fieldset>
  );
}

function ModeOption({
  id,
  label,
  description,
  checked,
  onSelect,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer flex-col gap-1 rounded-md border p-3 text-sm ${
        checked ? "border-indigo-400 bg-indigo-50" : "border-slate-200 hover:bg-slate-50"
      }`}
    >
      <span className="flex items-center gap-2 font-medium text-slate-900">
        <input
          id={id}
          type="radio"
          name="generation-mode"
          checked={checked}
          onChange={onSelect}
          className="h-4 w-4"
        />
        {label}
      </span>
      <span className="text-xs text-slate-600">{description}</span>
    </label>
  );
}
