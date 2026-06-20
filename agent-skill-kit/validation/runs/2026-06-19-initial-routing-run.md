# Initial Routing Run

Date: 2026-06-19

## Scope

Manual validation of the first five validation cases against:

- `AGENTS.template.md`
- `skill-library-map.md`
- relevant `SKILL.md` files
- relevant references where needed

This run checks routing and expected behavior. It does not yet validate generated code quality.

## Summary

Overall result: pass with minor improvements recommended.

The skill routes are coherent and match the intended package flow:

```text
AGENTS.md
-> skill-library-map.md
-> narrow task skill
-> references/templates/examples as needed
-> testing/review/security skills
```

## Case 01: Frontend Feature

Expected route:

1. `spec-driven-development`
2. `react-enterprise-rules`
3. `testing-patterns`
4. `typescript-code-review`
5. `code-review`

Result: pass.

Observations:

- `spec-driven-development` clearly prevents immediate coding and requires acceptance criteria, BDD, API contract, security notes, and testing plan.
- `react-enterprise-rules` covers React, TypeScript, API clients, UI states, and typed boundaries.
- Security routing is mostly correct. Because "current user profile" touches user identity, the spec should include lightweight security notes. Full `agent-security-review` is only needed when backend/auth/user data handling is implemented or changed.

Improvement:

- No file change required for this case.

## Case 02: Backend Endpoint

Expected route:

1. `spec-driven-development`
2. `nestjs-backend-rules`
3. `database-design-rules`
4. `testing-patterns`
5. `agent-security-review`
6. `typescript-code-review`
7. `code-review`

Result: pass.

Observations:

- `nestjs-backend-rules` explicitly says not to trust client-provided user IDs and to enforce authorization server-side.
- `agent-security-review` covers auth/authz, user data, database writes, and approval boundaries.
- `database-design-rules` covers data integrity and transaction concerns.

Improvement:

- No file change required for this case.

## Case 03: Database Migration

Expected route:

1. `spec-driven-development`
2. `database-design-rules`
3. `testing-patterns`
4. `agent-security-review`
5. `code-review`

Result: pass with improvement needed.

Observations:

- `database-design-rules` strongly covers duplicate detection, migration risk, rollback, and expand-migrate-contract thinking.
- `agent-security-review` correctly applies because production data migration is high risk.
- `spec-driven-development` is useful for planning this before migration code, but its "When Not to Use" wording could be misread as excluding database-only planning.
- `testing-patterns` does not clearly mention migration verification queries.

Recommended changes:

- Clarify that `spec-driven-development` applies to high-risk migrations that need a plan before implementation.
- Add migration verification checks to `testing-patterns`.

## Case 04: Security-Sensitive Agent Action

Expected route:

1. `spec-driven-development`
2. `mcp-tool-consumption`
3. `agent-security-review`
4. `observability-rules`
5. `testing-patterns`
6. `code-review`

Result: pass.

Observations:

- `mcp-tool-consumption` covers read/write access, server trust, and tool permission modes.
- `agent-security-review` covers PII, external communications, Vibe Diff, approvals, and high-risk actions.
- `observability-rules` covers traces and audit logs.

Improvement:

- No file change required for this case.

## Case 05: PR Review

Expected route:

1. `code-review`
2. `typescript-code-review`
3. `database-design-rules`
4. `testing-patterns`
5. `agent-security-review`

Result: pass.

Observations:

- `code-review` is correctly positioned as the orchestration skill for PR-level review.
- `risk-routing.md` routes TypeScript, database, tests, and security-sensitive changes to the right skills.
- The expected output format matches the skill.

Improvement:

- No file change required for this case.

## Next Validation Step

Run the same cases as actual agent prompts and compare outputs against success criteria.

Suggested order:

1. Case 01: check whether the agent starts with spec instead of code.
2. Case 03: check whether the agent avoids blindly adding `@unique`.
3. Case 04: check whether the agent requires approval before sending email.
