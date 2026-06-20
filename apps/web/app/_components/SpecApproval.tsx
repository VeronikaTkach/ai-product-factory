import type { ISelectedSkill, TSkillsSource } from "@/types/blueprint";
import type { ISkillMetadata } from "@ai-product-factory/skill-tools";
import { MarkdownPreview } from "./MarkdownPreview";
import { SkillSelector } from "./SkillSelector";

interface ISpecApprovalProps {
  productSpecMarkdown: string;
  mvpScopeMarkdown: string;
  recommendedSkills: ISelectedSkill[];
  skillsSource?: TSkillsSource | null;
  availableSkills: ISkillMetadata[];
  selectedSkillIds: string[];
  onSkillSelectionChange: (ids: string[]) => void;
  onResetSkills: () => void;
  onApprove: () => void;
  onRequestChanges: () => void;
}

export function SpecApproval({
  productSpecMarkdown,
  mvpScopeMarkdown,
  recommendedSkills,
  skillsSource,
  availableSkills,
  selectedSkillIds,
  onSkillSelectionChange,
  onResetSkills,
  onApprove,
  onRequestChanges,
}: ISpecApprovalProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-6 py-10">
      <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
        Human-in-the-loop checkpoint: review the Product Spec below. Architecture,
        Security, Roadmap, and Tasks will not be generated until you approve it.
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <MarkdownPreview markdown={productSpecMarkdown} />
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <MarkdownPreview markdown={mvpScopeMarkdown} />
      </div>

      <SkillSelector
        availableSkills={availableSkills}
        recommendedSkills={recommendedSkills}
        selectedSkillIds={selectedSkillIds}
        skillsSource={skillsSource ?? null}
        onChange={onSkillSelectionChange}
        onReset={onResetSkills}
      />

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onApprove}
          className="rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Approve and continue
        </button>
        <button
          type="button"
          onClick={onRequestChanges}
          className="rounded-md border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Request changes
        </button>
      </div>
    </div>
  );
}
