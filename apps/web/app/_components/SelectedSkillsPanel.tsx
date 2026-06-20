import type { ISelectedSkill, TSkillsSource } from "@/types/blueprint";

interface ISelectedSkillsPanelProps {
  skills: ISelectedSkill[];
  source?: TSkillsSource | null;
}

const SOURCE_LABEL: Record<TSkillsSource, string> = {
  mcp: "via public MCP server",
  local: "via local fallback",
};

export function SelectedSkillsPanel({ skills, source }: ISelectedSkillsPanelProps) {
  if (skills.length === 0) return null;

  return (
    <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-indigo-900">Skills selected for this blueprint</p>
        {source && (
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
            {SOURCE_LABEL[source]}
          </span>
        )}
      </div>
      <ul className="space-y-1.5">
        {skills.map((skill) => (
          <li key={skill.id} className="text-sm text-indigo-800">
            <span className="font-medium">{skill.name}</span>
            <span className="text-indigo-700"> — {skill.reason}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
