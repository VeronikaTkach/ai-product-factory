import type { IAgent, IArchitectInput, IArchitectOutput } from "@/types/agents";

export const architectAgent: IAgent<IArchitectInput, IArchitectOutput> = {
  id: "architect",
  run({ idea }) {
    const name = idea.productName || "Untitled Product";

    const architecture = `# Technical Architecture: ${name}

## Recommended Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS.
- Backend: Next.js API Routes, TypeScript.
- Database: PostgreSQL once persistence is required beyond the MVP demo.

## System Architecture

\`\`\`text
Browser
  -> Next.js frontend
  -> Next.js API routes
       -> Core domain services for: ${idea.keyFeatures || "key features (not specified)"}
  -> PostgreSQL (once persistence is added)
\`\`\`

## Scalability Notes

Revisit caching and async processing once usage data justifies it; do not over-build for scale before validating the idea.

## Deployment Notes

Vercel-first deployment, consistent with the AI Product Factory deployment plan.
`;

    return { architecture };
  },
};
