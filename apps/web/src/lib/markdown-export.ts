import type { IGeneratedBlueprint } from "@/types/blueprint";

export function downloadMarkdown(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function bundleBlueprintAsMarkdown(blueprint: IGeneratedBlueprint): string {
  return [
    blueprint.productSpec,
    blueprint.mvpScope,
    blueprint.architecture,
    blueprint.security,
    blueprint.roadmap,
    blueprint.tasks,
    blueprint.readinessScore,
  ].join("\n\n---\n\n");
}
