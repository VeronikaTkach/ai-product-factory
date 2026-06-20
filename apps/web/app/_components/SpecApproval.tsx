import type { ISelectedSkill } from "@/types/blueprint";
import { MarkdownPreview } from "./MarkdownPreview";
import { SelectedSkillsPanel } from "./SelectedSkillsPanel";

interface ISpecApprovalProps {
  productSpecMarkdown: string;
  mvpScopeMarkdown: string;
  selectedSkills: ISelectedSkill[];
  onApprove: () => void;
  onRequestChanges: () => void;
}

export function SpecApproval({
  productSpecMarkdown,
  mvpScopeMarkdown,
  selectedSkills,
  onApprove,
  onRequestChanges,
}: ISpecApprovalProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-6 py-10">
      <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
        Human-in-the-loop checkpoint: review the Product Spec below. Architecture,
        Security, Roadmap, and Tasks will not be generated until you approve it.
      </div>

      <SelectedSkillsPanel skills={selectedSkills} />

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <MarkdownPreview markdown={productSpecMarkdown} />
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <MarkdownPreview markdown={mvpScopeMarkdown} />
      </div>

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
