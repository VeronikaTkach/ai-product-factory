---
name: a2a-agent-design
description: Design Agent-to-Agent (A2A) specialist agents, orchestrators, Agent Cards, registries, delegation boundaries, and remote agent collaboration. Use when deciding agent vs tool, exposing an agent through A2A, or consuming remote specialist agents.
---

# A2A Agent Design

## When to Use

Use this skill when the task involves:

- deciding whether a capability should be a tool or agent
- designing remote specialist agents
- creating Agent Cards
- designing agent registries
- orchestrating multiple agents
- exposing an agent through A2A
- consuming remote A2A agents
- defining delegation boundaries

## When Not to Use

Do not use this skill for:

- MCP tool integration only
- frontend UI generation
- database schema design
- ordinary backend endpoints
- PR review

## Workflow

1. Decide whether the capability is bounded tool work or unbounded specialist work.
2. Read `references/tool-vs-agent.md`.
3. Read `references/agent-card.md` when defining a specialist.
4. Read `references/registry-orchestration.md` when discovery or delegation is involved.
5. Use `templates/agent-card.md` to draft the agent interface.
6. Define trust, permissions, state, and failure behavior.

## Core Rules

- Use tools for bounded operations.
- Use agents for multi-turn, ambiguous, responsibility-taking work.
- Keep specialist agents domain-bound.
- Define capabilities and limits clearly.
- Make security and data handling part of the Agent Card.
- Prefer private registries for enterprise internal agents.
- Do not treat remote agents as trusted just because they speak A2A.

## References

- `references/tool-vs-agent.md`
- `references/agent-card.md`
- `references/registry-orchestration.md`

## Templates

- `templates/agent-card.md`

## Evals

- `evals/trigger-cases.json`
