import type { IWorkflowStep } from "@/types/blueprint";

interface IWorkflowProgressProps {
  steps: IWorkflowStep[];
}

const STATUS_STYLES: Record<IWorkflowStep["status"], string> = {
  pending: "bg-slate-100 text-slate-500",
  "in-progress": "bg-indigo-100 text-indigo-700",
  done: "bg-emerald-100 text-emerald-700",
  blocked: "bg-amber-100 text-amber-700",
  error: "bg-red-100 text-red-700",
};

const STATUS_LABEL: Record<IWorkflowStep["status"], string> = {
  pending: "Pending",
  "in-progress": "Running…",
  done: "Done",
  blocked: "Waiting for approval",
  error: "Failed",
};

export function WorkflowProgress({ steps }: IWorkflowProgressProps) {
  return (
    <div className="mx-auto max-w-2xl py-10">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Agent workflow</h2>
      <ol className="space-y-3">
        {steps.map((step) => (
          <li
            key={step.id}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4"
          >
            <div>
              <p className="text-sm font-medium text-slate-900">{step.label} Agent</p>
              <p className="text-xs text-slate-500">{step.description}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[step.status]}`}
            >
              {STATUS_LABEL[step.status]}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
