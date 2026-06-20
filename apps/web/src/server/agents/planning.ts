import type { IAgent, IPlanningInput, IPlanningOutput } from "@/types/agents";
import { getEnrichmentBullets } from "./skill-enrichment";

export const planningAgent: IAgent<IPlanningInput, IPlanningOutput> = {
  id: "planning",
  run({ idea, selectedSkillIds }) {
    const name = idea.productName || "Untitled Product";

    const roadmapEnrichment = getEnrichmentBullets(selectedSkillIds, "roadmap");
    const roadmapEnrichmentSection =
      roadmapEnrichment.length > 0
        ? `\n## Skill-Informed Roadmap Notes\n\n${roadmapEnrichment.map((bullet) => `- ${bullet}`).join("\n")}\n`
        : "";

    const roadmap = `# Roadmap: ${name}

## Milestones

1. **Foundation** — core domain model and primary user flow for: ${idea.coreIdea || "core idea (not specified)"}.
2. **Transactions/Engagement** — features supporting: ${idea.keyFeatures || "key features (not specified)"}.
3. **Hardening** — security pass aligned to the threat model, then beta launch.

## Delivery Phases

- Phase 1: read-only core flows.
- Phase 2: write flows and primary transactions.
- Phase 3: security hardening and monitoring before public launch.
${roadmapEnrichmentSection}`;

    const tasksEnrichment = getEnrichmentBullets(selectedSkillIds, "tasks");
    const tasksEnrichmentSection =
      tasksEnrichment.length > 0
        ? `\n## Skill-Informed Tasks\n\n${tasksEnrichment.map((bullet) => `- [ ] ${bullet}`).join("\n")}\n`
        : "";

    const tasks = `# Task Breakdown: ${name}

## Foundation

- [ ] Define core data model for: ${idea.coreIdea || "core idea (not specified)"}.
- [ ] Build primary read flow UI.

## Transactions/Engagement

- [ ] Implement: ${idea.keyFeatures || "key features (not specified)"}.
- [ ] Enforce server-side authorization on all write paths.

## Hardening

- [ ] Add rate limiting on public and write endpoints.
- [ ] Add audit logging for sensitive state transitions.
- [ ] Run a security review pass against the threat model before launch.
${tasksEnrichmentSection}`;

    return { roadmap, tasks };
  },
};
