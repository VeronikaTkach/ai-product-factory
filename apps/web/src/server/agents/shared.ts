import type { IBusinessIdea } from "@/types/blueprint";

export function describeDataSensitivity(idea: IBusinessIdea): string {
  const flags: string[] = [];
  if (idea.hasPersonalData) flags.push("personal data (names, emails, or similar)");
  if (idea.hasFinancialData) flags.push("financial data (payments or similar)");
  if (idea.hasHealthData) flags.push("health data");

  const flagSummary =
    flags.length > 0
      ? `This product handles: ${flags.join(", ")}.`
      : "No sensitive data categories were flagged.";

  const notes = idea.sensitiveInfoNotes
    ? `Additional notes: ${idea.sensitiveInfoNotes}`
    : "";

  return [flagSummary, notes].filter(Boolean).join("\n\n");
}
