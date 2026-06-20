# Trace Plan: PR Review Agent

## Goal

- Explain why the agent recommended merge or block.

## Span Types

- `agent.session`: one PR review run.
- `agent.tool`: GitHub PR fetch, file reads, test result reads.
- `agent.skill`: code-review, typescript-code-review, testing-patterns.
- `agent.evaluation`: final merge recommendation.

## Captured Fields

- Actor: PR reviewer agent.
- User intent: review PR for merge readiness.
- Tools: GitHub read APIs.
- Results: summarized findings and recommendation.
- Cost: token cost and run time.

## Redaction

- Do not log tokens.
- Mask secrets found in diff.

## Sampling

- Always keep blocked PRs and high-risk PRs.
- Downsample routine clean reviews.
