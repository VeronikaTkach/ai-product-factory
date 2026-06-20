"use client";

import { useState } from "react";
import type {
  IGeneratedBlueprint,
  IResultTab,
  ISelectedSkill,
  TResultTabId,
} from "@/types/blueprint";
import { bundleBlueprintAsMarkdown, downloadMarkdown } from "@/lib/markdown-export";
import { MarkdownPreview } from "./MarkdownPreview";
import { SelectedSkillsPanel } from "./SelectedSkillsPanel";

interface IResultsTabsProps {
  blueprint: IGeneratedBlueprint;
  selectedSkills: ISelectedSkill[];
  onStartOver: () => void;
}

function buildTabs(blueprint: IGeneratedBlueprint): IResultTab[] {
  return [
    { id: "product-spec", label: "Product Spec", markdown: blueprint.productSpec },
    { id: "mvp-scope", label: "MVP Scope", markdown: blueprint.mvpScope },
    { id: "architecture", label: "Architecture", markdown: blueprint.architecture },
    { id: "security", label: "Security", markdown: blueprint.security },
    { id: "roadmap", label: "Roadmap", markdown: blueprint.roadmap },
    { id: "tasks", label: "Tasks", markdown: blueprint.tasks },
    { id: "readiness-score", label: "Readiness Score", markdown: blueprint.readinessScore },
  ];
}

export function ResultsTabs({ blueprint, selectedSkills, onStartOver }: IResultsTabsProps) {
  const tabs = buildTabs(blueprint);
  const [activeTabId, setActiveTabId] = useState<TResultTabId>(tabs[0].id);
  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];

  return (
    <div className="mx-auto max-w-4xl py-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Generated blueprint</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              downloadMarkdown(
                "ai-product-factory-blueprint.md",
                bundleBlueprintAsMarkdown(blueprint),
              )
            }
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Export all (.md)
          </button>
          <button
            type="button"
            onClick={onStartOver}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Start over
          </button>
        </div>
      </div>

      <div className="mb-4">
        <SelectedSkillsPanel skills={selectedSkills} />
      </div>

      <div className="mb-4 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTabId(tab.id)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              tab.id === activeTabId
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            onClick={() => downloadMarkdown(`${activeTab.id}.md`, activeTab.markdown)}
            className="text-xs font-medium text-indigo-600 hover:underline"
          >
            Download this tab (.md)
          </button>
        </div>
        <MarkdownPreview markdown={activeTab.markdown} />
      </div>
    </div>
  );
}
