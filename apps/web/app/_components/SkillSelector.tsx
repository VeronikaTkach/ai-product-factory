import type { ISelectedSkill, TSkillsSource } from "@/types/blueprint";
import { PROTECTED_SKILL_IDS } from "@/types/blueprint";
import type { ISkillMetadata } from "@ai-product-factory/skill-tools";

interface ISkillSelectorProps {
  availableSkills: ISkillMetadata[];
  recommendedSkills: ISelectedSkill[];
  selectedSkillIds: string[];
  skillsSource: TSkillsSource | null;
  onChange: (ids: string[]) => void;
  onReset: () => void;
}

const SOURCE_LABEL: Record<TSkillsSource, string> = {
  mcp: "via public MCP server",
  local: "via local fallback",
};

export function SkillSelector({
  availableSkills,
  recommendedSkills,
  selectedSkillIds,
  skillsSource,
  onChange,
  onReset,
}: ISkillSelectorProps) {
  if (availableSkills.length === 0) return null;

  const recommendedById = new Map(recommendedSkills.map((skill) => [skill.id, skill]));

  const sortedSkills = [...availableSkills].sort((a, b) => {
    const aProtected = PROTECTED_SKILL_IDS.includes(a.id);
    const bProtected = PROTECTED_SKILL_IDS.includes(b.id);
    if (aProtected !== bProtected) return aProtected ? -1 : 1;

    const aRecommended = recommendedById.has(a.id);
    const bRecommended = recommendedById.has(b.id);
    if (aRecommended !== bRecommended) return aRecommended ? -1 : 1;

    return a.name.localeCompare(b.name);
  });

  function toggle(id: string) {
    if (PROTECTED_SKILL_IDS.includes(id)) return;
    const next = selectedSkillIds.includes(id)
      ? selectedSkillIds.filter((existingId) => existingId !== id)
      : [...selectedSkillIds, id];
    onChange(next);
  }

  return (
    <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-indigo-900">Skills for this blueprint</p>
        {skillsSource && (
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
            Recommendations {SOURCE_LABEL[skillsSource]}
          </span>
        )}
      </div>
      <p className="mb-3 text-xs text-indigo-700">
        Recommended skills are selected automatically. You can adjust them before generating the
        full blueprint.
      </p>

      <ul className="mb-3 max-h-64 space-y-2 overflow-y-auto pr-1">
        {sortedSkills.map((skill) => {
          const isProtected = PROTECTED_SKILL_IDS.includes(skill.id);
          const isRecommended = recommendedById.has(skill.id);
          const isChecked = selectedSkillIds.includes(skill.id);
          const reason = recommendedById.get(skill.id)?.reason;

          return (
            <li key={skill.id} className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={isChecked}
                disabled={isProtected}
                onChange={() => toggle(skill.id)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 disabled:opacity-60"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-indigo-900">{skill.name}</span>
                  {isProtected && (
                    <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                      required
                    </span>
                  )}
                  {!isProtected && isRecommended && (
                    <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
                      recommended
                    </span>
                  )}
                </div>
                <p className="text-xs text-indigo-700">{reason ?? skill.description}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={onReset}
        className="text-xs font-medium text-indigo-600 hover:underline"
      >
        Reset to recommended skills
      </button>
    </div>
  );
}
