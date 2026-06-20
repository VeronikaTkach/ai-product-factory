/**
 * Deterministic, skill-informed enrichment. No LLM call: each selected
 * skill id maps to a fixed set of bullets per blueprint section, looked up
 * here and appended by the Architect/Security/Planning agents. This is how
 * manual skill selection visibly changes the generated artifacts, not just
 * the "selected skills" list shown in the UI.
 *
 * Only the skills explicitly required by this feature are covered; any
 * other selected skill id (e.g. react-enterprise-rules) simply contributes
 * no bullets — selecting it still shows up in selectedSkills, but doesn't
 * change generated text. Extending coverage means adding another entry
 * below.
 */

export interface ISkillEnrichmentBullets {
  architecture?: string[];
  security?: string[];
  roadmap?: string[];
  tasks?: string[];
}

const SKILL_ENRICHMENT: Record<string, ISkillEnrichmentBullets> = {
  "agent-security-review": {
    security: [
      "Run the agent-security-review checklist (auth, secrets, sensitive data, tool permissions) before this feature ships.",
      "Require explicit human approval before any high-risk action identified by this checklist reaches production.",
      "Flag any newly identified sensitive-data field for classification before storage or transmission.",
    ],
  },
  "database-design-rules": {
    architecture: [
      "Add explicit data model constraints (NOT NULL, foreign keys, unique constraints) for every entity introduced above.",
      "Add an ownership check (e.g. `WHERE owner_id = :userId`) on every query that reads or writes user-owned rows.",
      "Add indexes on foreign keys and frequently filtered columns before this schema goes to production.",
    ],
  },
  "testing-patterns": {
    tasks: [
      "Add a test strategy: unit tests for pure logic, integration tests for service+database behavior, e2e tests for the primary user flow.",
      "Add a regression test for every bug fix before merging.",
    ],
    roadmap: ["Add a hardening phase covering test coverage and regression checks before public launch."],
  },
  "observability-rules": {
    architecture: [
      "Add distributed traces across the agent/orchestrator boundary for debugging multi-step flows.",
      "Add cost and latency metrics per agent call to catch regressions.",
    ],
    security: ["Add structured audit logs for every state-changing action, including actor ID and timestamp."],
  },
  "mcp-tool-consumption": {
    security: [
      "Classify every external tool/MCP call as read-only, write, or approval-required, and enforce that classification server-side.",
    ],
    architecture: [
      "Document the tool access policy (which agents/tools can call which external systems) before adding new integrations.",
    ],
  },
  "agentic-commerce-rules": {
    security: [
      "Add explicit payment, payout, and refund controls, including spending limits and approval gates for high-value transactions.",
      "Add fraud and dispute handling: flag suspicious transactions and define a chargeback/dispute resolution process.",
    ],
  },
  "a2a-agent-design": {
    architecture: [
      "Define explicit boundaries between agents/services and document what each one owns.",
      "Define delegation rules: which agent can invoke which other agent, and how failures propagate.",
    ],
  },
  "a2ui-patterns": {
    architecture: [
      "Render any agent-generated UI/output through a trusted, schema-validated component catalog — never raw HTML/markdown from an untrusted source.",
      "Validate agent-generated UI payloads against a schema before rendering; fail safe (show plain text) on validation failure.",
    ],
  },
};

export function getEnrichmentBullets(
  selectedSkillIds: string[],
  section: keyof ISkillEnrichmentBullets,
): string[] {
  return selectedSkillIds.flatMap((id) => SKILL_ENRICHMENT[id]?.[section] ?? []);
}

/** Selected skill ids that have at least one enrichment rule defined, in selection order. */
export function getAppliedEnrichmentSkillIds(selectedSkillIds: string[]): string[] {
  return selectedSkillIds.filter((id) => id in SKILL_ENRICHMENT);
}
