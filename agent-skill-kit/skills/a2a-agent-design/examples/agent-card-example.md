# Agent Card: Compliance Review Agent

## Purpose

- Reviews proposed PR changes for compliance policy drift.

## Capabilities

- Inspect PR summary and changed files.
- Compare changes against internal compliance rules.
- Produce findings and required follow-ups.

## Non-Capabilities

- Does not merge PRs.
- Does not modify code.
- Does not approve exceptions.

## Interaction Pattern

- Multi-turn clarification allowed.

## Data Handling

- PII accepted: no.
- Retention: trace summaries only.

## Authority Tier

- Draft-only.
- Human approval required for policy exceptions.

## Security

- Authenticated internal callers only.
- Audit logs required for each review.
