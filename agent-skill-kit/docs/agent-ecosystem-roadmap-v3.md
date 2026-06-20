# Agent Ecosystem Roadmap v3

## Purpose

Create a global roadmap for building, evaluating, securing, and operating agentic systems.

This document is intentionally stack-agnostic. It should remain useful for frontend apps, backend services, internal automation, coding agents, customer-facing agents, and multi-agent workflows.

## Core Thesis

Vibe coding is useful for exploration.

Agentic engineering is required for production.

The difference is not the model. The difference is the harness around the model:

- clear specifications
- scoped tools
- reusable skills
- open protocols
- security controls
- evaluation pipelines
- observability
- human review
- production governance

## Roadmap Layers

1. Agentic engineering foundation
2. Open protocols
3. Skills architecture
4. Agent runtime patterns
5. Spec-driven development
6. Security and effective trust
7. Evaluation
8. Observability
9. Human-in-the-loop governance
10. PR review and integration
11. Production maturity phases

---

# 1. Agentic Engineering Foundation

## Vibe Coding

Best for:

- exploration
- prototypes
- throwaway scripts
- learning unfamiliar APIs
- quick UI experiments

Risks:

- weak specifications
- hidden security flaws
- unreviewable diffs
- hallucinated dependencies
- high token burn
- fragile maintenance

## Agentic Engineering

Best for:

- production systems
- shared team workflows
- agent products
- business-critical automation
- multi-agent or tool-heavy systems

Requires:

- specs before code
- tests and evals before scale
- reusable skills instead of repeated prompts
- controlled tool access
- observable trajectories
- human approval for high-risk actions

## Guiding Principle

The model is not the product architecture.

The product architecture is the harness that turns model output into reliable work.

---

# 2. Open Protocols

## Principle

Prefer open, interoperable protocols over bespoke integrations.

Each protocol has a distinct role:

- MCP connects agents to tools.
- A2A connects agents to other agents.
- A2UI lets agents describe safe interactive UI.
- AP2 and UCP support commerce and payments.

## MCP: Agent-to-Tool

Use MCP for:

- database access
- file and repository tools
- design tools
- browser automation
- documentation search
- internal APIs

Best practices:

- audit public MCP servers before connecting them
- prefer internal registries for approved tools
- use MCP Inspector or transport-level debugging when tool calls fail
- use development or read-only environments for sensitive data
- log tool usage for audit trails
- scope servers to the smallest useful project and permission set

Avoid:

- unverified public MCPs in production
- hardcoded credentials
- wide access to all projects
- write access to production data by default

## A2A: Agent-to-Agent

Use A2A when the caller needs another agent to take responsibility, not just return a value.

Good fit:

- remote specialist agents
- multi-turn delegation
- agent marketplaces
- private enterprise agent registries
- domain agents maintained by the team that owns the domain

Core concepts:

- Agent Card: machine-readable capability and policy description
- Agent Registry: discoverable catalog of approved agents
- Agent Executor: translation layer between A2A and the underlying runtime
- A2A Endpoint: exposed compliant interface

Architecture decision:

- Use tools for bounded operations.
- Use A2A for unbounded, collaborative, multi-turn work.

## A2UI: Agent-to-UI

Use A2UI when interaction or visualization adds value beyond raw text or JSON.

Principles:

- agents declare UI intent
- clients render trusted components
- agents do not generate executable frontend code
- production apps bring their own component catalog
- malformed UI payloads must fall back to text or data output

Useful patterns:

- LLM-generated UI for intent-driven exploration
- tool-generated UI for deterministic layouts
- hybrid output with both `data` and `ui`

## AP2 and UCP: Commerce

Treat commerce protocols as future-facing unless the product actually needs payments, ordering, procurement, or agentic transactions.

Use only with strong:

- identity
- authorization
- spending limits
- audit trails
- human approval checkpoints

---

# 3. Skills Architecture

## Principle

Skills are the unit of reusable agent capability.

They should be small, owned, versioned, testable, and portable across compatible runtimes.

## What Belongs in a Skill

Use a skill for:

- repeated workflows
- domain-specific rules
- project conventions
- review checklists
- tool usage procedures
- output formats
- templates

Do not use a skill for:

- vague global advice
- one-off prompts
- unrelated bundled workflows
- secrets or credentials
- giant always-loaded documentation

## Skill Structure

Recommended folder:

```text
skill-name/
  SKILL.md
  references/
  templates/
  examples/
  evals/
  scripts/
```

`SKILL.md` should stay concise. It is the routing interface.

Use supporting files for details that should load only when needed.

## Skill Lifecycle

1. Define the job in one sentence.
2. Write positive and negative trigger examples.
3. Write evaluation cases before expanding the skill body.
4. Draft the skill.
5. Test trigger behavior.
6. Test output quality and tool trajectory.
7. Check token footprint under co-loaded conditions.
8. Assign ownership.
9. Pin and review external dependencies.
10. Promote through authority tiers.

## Authority Tiers

### Read-Only

Allowed:

- read files
- inspect code
- summarize data
- generate recommendations

Required:

- trigger tests
- representative output checks

### Draft-Only

Allowed:

- create drafts
- propose diffs
- generate messages or plans

Required:

- human review before execution or publication
- larger golden dataset
- clear output format

### Action-Allowed

Allowed:

- mutate systems
- send messages
- deploy
- modify data

Required:

- adversarial testing
- policy gates
- audit logs
- rollback plan
- human approval for high-risk operations

## Eval Coverage

A production-ready skill needs coverage for:

- trigger failure
- execution failure
- regression against existing skills
- token budget failure
- tool trajectory errors
- security and dependency risks

## Skill Governance

- Treat skills like code.
- Review skills in PRs.
- Version and pin external skills.
- Prefer first-party skills for vendor-specific tools.
- Audit community skills before adoption.
- Let domain teams own domain skills.

---

# 4. Agent Runtime Patterns

## Local Coding Agent

Best for:

- multi-file edits
- codebase exploration
- running tests
- iterative debugging

## Background Agent

Best for:

- well-specified tasks
- test generation
- migrations
- PR-producing workflows

## Single Agent

Best for:

- simple tasks
- prototypes
- constrained workflows

Limit:

- tool overload
- context overload
- fragile monolithic prompts

## Specialized Subagents

Best for:

- reducing search space
- isolating context
- separating responsibilities
- improving tool choice

## Orchestrator + Specialists

Best for:

- multi-domain workflows
- remote agent delegation
- enterprise virtual teams

Use MCP for tools.

Use A2A for agent delegation.

Use skills for procedural expertise.

---

# 5. Spec-Driven Development

## Principle

Code is easier to regenerate than intent.

The specification is the source of truth.

## Specification Contents

A production-grade spec should include:

- user goal
- business context
- technical design
- API contracts
- data schemas
- dependencies and versions
- non-functional requirements
- security constraints
- observability needs
- acceptance criteria
- BDD scenarios
- edge cases

## BDD Pattern

Use Gherkin-style scenarios when behavior matters:

```gherkin
Scenario: User submits a valid refund request
  Given the user has a completed order
  When they request a refund
  Then the system creates a draft refund for human review
```

## Execution Modes

### Architect

Use for:

- project generation
- architecture planning
- folder structure
- stack selection

Rule:

- propose the plan before coding.

### Builder

Use for:

- feature implementation
- matching existing style
- adding tests

Rule:

- keep diffs focused.

### Forensic Specialist

Use for:

- bug fixing
- root cause analysis
- logs and reproduction

Rule:

- produce a failing test or reproduction command before the fix.

### Author

Use for:

- docs
- changelogs
- specs
- comments

Rule:

- docs and code must stay synchronized.

### Librarian

Use for:

- data access
- SQL
- file movement
- reporting

Rule:

- show the query or command used to generate output.

---

# 6. Security and Effective Trust

## Principle

Trust is not granted once. Trust is continuously earned.

Effective Trust depends on:

- supply chain integrity
- identity
- scoped permissions
- runtime behavior
- human authorization
- observability
- governance

## Security Baseline

Required controls:

- sandboxed execution
- least privilege
- secret scanning
- dependency verification
- scoped MCP access
- read-only defaults for sensitive systems
- audit logs
- human approval for high-risk actions

## Context as Perimeter

An agent can have valid credentials and still perform the wrong action.

Security must evaluate:

- who requested the action
- what the original intent was
- what tool is being called
- what arguments are being passed
- what environment is targeted
- whether the action matches policy

## Policy Server

Use a policy server or agent gateway to intercept tool calls.

It should support:

- structural gating by role and environment
- semantic gating by intent and content
- blocked tools by environment
- approved tools by role
- argument sanitization
- PII masking
- clear violation messages

## Zero Ambient Authority

Agents should not inherit the developer's full permissions.

Use:

- dedicated agent identities
- JIT token downscoping
- short-lived credentials
- file-tree allowlists
- deny-by-default access

## Vibe Diff

For high-risk actions, approval must explain what will happen in plain language.

Use for:

- production deploys
- database migrations
- data deletion
- IAM changes
- financial operations
- external communications

## Runtime Security

Track:

- Runtime Agent Bill of Materials
- active tools
- active models
- active data sources
- dependency changes
- network access
- intent drift
- trust decay

Use checkpoints and circuit breakers to freeze or roll back unsafe activity.

---

# 7. Evaluation

## Principle

Tests check deterministic behavior.

Evaluations check agent behavior under uncertainty.

A mature pipeline uses both.

## Evaluation Dimensions

1. Intent satisfaction
2. Functional correctness
3. Visual and behavioral correctness
4. Cost and efficiency
5. Code quality and convention matching
6. Trajectory quality
7. Self-repair behavior

## Evaluation Methods

- unit and integration tests
- linting and type checks
- security scanning
- dependency scanning
- LLM-as-judge rubrics
- agent-as-judge trace review
- Playwright or browser testing
- screenshot comparison
- trajectory inspection
- human review
- online sampling
- standardized benchmarks

## Trajectory Evaluation

Evaluate not only the final answer but also:

- files read
- tools used
- skill invocations
- order of operations
- recovery after failure
- number of user corrections
- token cost

Correct output from a fragile path is not reliable success.

---

# 8. Observability

## Principle

You cannot evaluate or secure what you cannot see.

## Track

- user request
- session prefix
- model calls
- tool calls
- tool arguments
- tool outputs
- skills loaded
- retrievals
- file edits
- errors
- retries
- user corrections
- token usage
- wall-clock latency
- final actions

## Recommended Direction

Adopt OpenTelemetry-style traces for agent sessions.

Represent each session as a trace tree with spans for:

- task/session
- model reasoning step
- tool call
- skill load
- file operation
- browser action
- evaluation result

Use tail-based sampling to retain high-risk or high-cost sessions.

---

# 9. Human-in-the-Loop Governance

## Principle

Humans remain responsible for critical decisions.

Require approval for:

- production deployments
- infrastructure changes
- database migrations
- destructive data actions
- permission changes
- public publishing
- external notifications
- financial operations

Avoid approval fatigue by:

- batching low-risk approvals
- showing clear risk summaries
- using Vibe Diff for high-risk actions
- automating deterministic checks
- escalating only meaningful decisions

---

# 10. PR Review and Integration

## Problem

AI increases code production speed.

The bottleneck moves to review, integration, and verification.

## Required PR Signals

Every AI-assisted PR should include:

- summary of changes
- risk assessment
- tests run
- security considerations
- affected files or modules
- rollback notes when relevant

## Review Tiers

### Tier 1: Managed

Use SaaS or platform-native AI reviewer.

Best for:

- generic style
- basic bugs
- low setup

### Tier 2: Hybrid

Use repository-owned review skills in CI.

Best for:

- team-specific rules
- custom security checks
- lightweight automation

### Tier 3: Custom Runtime

Use a deployed review agent with memory, graph retrieval, and subagents.

Best for:

- large codebases
- compliance workflows
- cross-PR context
- complex impact analysis

## Integration Practices

- keep batch sizes small
- avoid unrelated refactors in bug fixes
- require reproduction before fixes
- use conditional approvals only with reliable CI
- assign ownership boundaries to reduce merge conflicts

---

# 11. Production Maturity Phases

## Phase 1: Personal Harness

Build:

- project instructions
- first skills
- basic MCPs
- local tests
- manual review habit

## Phase 2: Team Harness

Build:

- shared skill library
- specs folder
- PR review checklist
- CI checks
- security scanning
- evaluation cases
- approved MCP registry

## Phase 3: Governed Agentic Engineering

Build:

- policy server
- audit logs
- evaluation pipeline
- observability traces
- HITL rules
- skill authority tiers
- sandboxed execution

## Phase 4: Production Agent Platform

Build:

- deployed agents
- durable memory
- online evaluation
- agent registries
- A2A orchestration
- advanced review agents
- incident response for agent behavior

---

# Current Practical Priorities

1. Separate global roadmap from stack-specific rules.
2. Turn stack rules into small skills.
3. Add eval cases for every skill.
4. Add GitHub and browser automation where useful.
5. Build security and review workflows before enabling high-risk autonomy.

## Guiding Principle

Build reusable expertise, not larger prompts.
