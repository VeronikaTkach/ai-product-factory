import type { IAgent, IBusinessAnalystInput, IBusinessAnalystOutput } from "@/types/agents";
import { describeDataSensitivity } from "./shared";

/**
 * Demo-mode implementation: deterministic template interpolation, not a
 * generated result. Swap the body for a real LLM call in a later phase
 * without changing the IAgent contract.
 */
export const businessAnalystAgent: IAgent<IBusinessAnalystInput, IBusinessAnalystOutput> = {
  id: "business-analyst",
  run({ idea }) {
    const name = idea.productName || "Untitled Product";
    const description = idea.businessDescription || "No business description provided.";
    const dataNotes = describeDataSensitivity(idea);

    const productSpec = `# Product Specification: ${name}

## Vision

${description}

## Target Audience

${idea.targetUsers || "Not specified."}

Geography: ${idea.geography || "Not specified."}
Market type: ${idea.marketType}

## Problem

${idea.problemStatement || "Not specified."}

Current alternatives: ${idea.currentAlternatives || "Not specified."}

## Solution

${idea.coreIdea || "Not specified."}

Key features: ${idea.keyFeatures || "Not specified."}

## Constraints

- Budget: ${idea.budget || "Not specified."}
- Timeline: ${idea.timeline || "Not specified."}
- Team size: ${idea.teamSize || "Not specified."}

## Data and Security Notes

${dataNotes}

## MVP Boundaries

See the MVP Scope tab for in-scope and out-of-scope items.
`;

    const mvpScope = `# MVP Scope: ${name}

## In Scope

- Core flow described in the founder's idea: ${idea.coreIdea || "core flow not specified"}.
- Key features: ${idea.keyFeatures || "not specified"}.

## Out of Scope

- Advanced personalization or recommendation engines.
- Multi-currency or multi-region billing.
- Native mobile apps.
- Any feature not required to validate the core problem: ${idea.problemStatement || "not specified"}.
`;

    return { productSpec, mvpScope };
  },
};
