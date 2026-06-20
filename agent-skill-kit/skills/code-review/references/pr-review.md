# PR Review

## Review Goals

- Understand what changed.
- Identify correctness, security, data, and integration risks.
- Check whether verification matches risk.
- Keep human attention on meaningful decisions.

## Required PR Signals

A strong PR should include:

- concise description
- affected areas
- user-facing behavior changes
- tests run
- screenshots for UI changes when relevant
- migration notes for database changes
- rollback notes for risky changes
- scaffold hygiene for greenfield projects: `.gitignore`, `.env.example`, no committed real `.env`, no `node_modules`, no `dist`, no coverage artifacts
- deployable artifact hygiene: production builds should not include tests, e2e specs, fixtures, coverage, or local build-cache files

## Findings Priority

Report findings before summaries.

Order by severity:

1. Critical
2. High
3. Medium
4. Low

Do not bury blocking issues in prose.

## Merge Recommendation

Use:

- Ready: no blocking issues and checks are sufficient.
- Ready after fixes: small clear fixes needed.
- Not ready: blocking correctness, security, data, or test gaps.
- Insufficient context: cannot judge without missing diff, tests, or runtime information.
