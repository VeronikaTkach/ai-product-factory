import type { ISelectedSkill } from "@/types/blueprint";

interface ISelectedSkillsPanelProps {
  skills: ISelectedSkill[];
}

export function SelectedSkillsPanel({ skills }: ISelectedSkillsPanelProps) {
  if (skills.length === 0) return null;

  return (
    <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
      <p className="mb-2 text-sm font-semibold text-indigo-900">
        Skills selected for this blueprint
      </p>
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
