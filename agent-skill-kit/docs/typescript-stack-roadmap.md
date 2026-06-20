# TypeScript Stack Roadmap

## Purpose

Apply the global agent ecosystem roadmap to a TypeScript-first product stack.

This document is stack-specific. It should guide project setup, skill creation, code review, and architecture decisions for applications built with React, TypeScript, Next.js or Vite, NestJS, PostgreSQL, Prisma, Supabase, MCP, and agent-assisted development.

## Preferred Stack

### Frontend

- React
- TypeScript
- Vite for SPA, dashboards, admin panels, and Telegram Mini Apps
- Next.js when SEO, SSR, metadata, or server components matter
- Tailwind CSS
- shadcn/ui
- Radix UI

### Backend

- TypeScript
- NestJS
- PostgreSQL
- Prisma ORM
- Zod or class-validator depending on project conventions

### Platform

- Supabase for Auth, Storage, Realtime, and managed PostgreSQL when appropriate
- GitHub for source control and PR workflow
- Playwright for browser and regression testing

### AI Tooling

- Claude Code or Codex for coding work
- MCP for tool access
- project skills for reusable rules
- browser automation for UI verification
- GitHub automation for review and issue workflows

## Architecture Principles

## 1. Feature-Sliced Frontend

Use FSD for non-trivial apps.

Preferred layers:

- `app`
- `processes`
- `pages`
- `widgets`
- `features`
- `entities`
- `shared`

Rules:

- lower layers must not import from upper layers
- business logic should not live inside presentational components
- API clients should stay out of UI components
- shared code must be genuinely reusable
- avoid premature abstractions

## 2. Typed Boundaries

Type external data at the boundary.

Use:

- DTOs for backend contracts
- Prisma types for database operations
- explicit API response aliases
- validation schemas for untrusted input

Rules:

- avoid `any`
- use discriminated unions for state variants
- keep types close to the domain
- transform API data before it reaches UI state

## 3. State Strategy

Use the smallest state tool that fits.

Order of preference:

1. local component state
2. URL state
3. server/cache state
4. Redux Toolkit for true global client state

Do not put temporary UI state into Redux.

## 4. Backend Modularity

Use NestJS modules around business domains.

Preferred boundaries:

- module
- controller
- service
- repository or Prisma access layer
- DTOs
- guards
- interceptors
- pipes

Rules:

- controllers should stay thin
- validation happens at the boundary
- authorization must be explicit
- domain logic should be testable outside transport code

## 5. Database Discipline

Use PostgreSQL as the durable source of truth.

Rules:

- migrations are reviewed
- indexes are intentional
- constraints protect data integrity
- destructive operations require approval
- schema changes include rollback thinking

## Agent-Assisted Workflow

## Standard Feature Workflow

1. Write or update a spec.
2. Define acceptance criteria.
3. Identify affected layers.
4. Ask the agent for an implementation plan.
5. Review the plan.
6. Generate focused code changes.
7. Run type checks, lint, and tests.
8. Run browser checks for UI changes.
9. Run code review skill.
10. Submit PR with summary and risk notes.

## Bug Fix Workflow

1. Collect evidence.
2. Produce failing test or reproduction command.
3. Identify root cause.
4. Make minimal fix.
5. Keep unrelated refactors out.
6. Preserve the regression test.
7. Run focused verification.

## Project Generation Workflow

Before code generation, require:

- framework choice with justification
- folder structure
- package list with versions
- testing strategy
- lint/typecheck strategy
- environment variables
- security assumptions
- deployment target

## Skills Roadmap

## Existing

### react-enterprise-rules

Purpose:

- React and TypeScript conventions
- FSD frontend architecture
- UI library rules
- Redux Toolkit guidance
- frontend review checklist

Next improvements:

- add detailed references
- add templates
- add examples
- add eval trigger cases

## High Priority

### nestjs-backend-rules

Purpose:

- module boundaries
- DTO and validation rules
- guards and authorization
- Prisma usage
- error handling
- testing conventions

### database-design-rules

Purpose:

- PostgreSQL schema design
- migrations
- indexes
- constraints
- Prisma modeling
- Supabase conventions

### typescript-code-review

Purpose:

- architecture review
- TypeScript correctness
- security review
- dependency review
- performance review

### spec-driven-development

Purpose:

- write technical specs
- convert ideas into acceptance criteria
- generate BDD scenarios
- keep docs and code aligned

## Medium Priority

### playwright-ui-verification

Purpose:

- UI smoke tests
- screenshot checks
- interaction verification
- responsive behavior checks

### agent-security-review

Purpose:

- secrets
- dependency risks
- unsafe tool access
- missing authorization
- high-risk actions

### agent-evaluation

Purpose:

- eval cases
- scoring rubrics
- regression checks
- trajectory review

## MCP Roadmap

## Already Useful

### Figma MCP

Use for:

- design inspection
- component extraction
- design-to-code workflows

### Database MCP

Use for:

- schema inspection
- query generation
- migration analysis
- read-only exploration

## Near Term

### GitHub MCP

Use for:

- PR review
- issue creation
- repository analysis
- release notes

### Playwright MCP

Use for:

- E2E testing
- browser automation
- visual regression
- UI verification

## Medium Term

### Documentation MCPs

Use for:

- framework docs
- cloud docs
- API references
- up-to-date version checks

## Security Rules for This Stack

## Frontend

- never expose secrets in client code
- avoid trusting browser-only authorization
- validate server responses
- sanitize rendered user content
- use accessible UI primitives

## Backend

- validate all external input
- enforce authorization server-side
- use least-privilege database credentials
- avoid raw SQL unless justified
- log security-relevant events
- do not leak internal errors

## Database

- enable row-level security when using Supabase where appropriate
- avoid broad service-role usage
- review migrations
- require approval for destructive changes

## Agent Tooling

- use sandboxed execution for generated scripts
- avoid production writes by default
- require human approval for deploys and migrations
- log MCP tool usage
- audit external skills and MCP servers

## Evaluation for This Stack

## Required Signals

- TypeScript typecheck
- ESLint
- unit tests
- integration tests where relevant
- Playwright for user-facing UI
- security scan
- dependency scan

## Agent-Specific Signals

- did the agent read relevant files first
- did it use the right skill
- did it keep changes focused
- did it preserve architecture boundaries
- did it run appropriate verification
- did it explain risks clearly

## Roadmap Phases

## Phase 1: Frontend Skill Completion

- finish `react-enterprise-rules`
- add references, examples, templates, evals
- use it for frontend generation and review

## Phase 2: Backend and Database Skills

- create `nestjs-backend-rules`
- create `database-design-rules`
- add shared API contract conventions

## Phase 3: Review and Security Skills

- create `typescript-code-review`
- create `agent-security-review`
- integrate with PR workflow

## Phase 4: Automation

- connect GitHub MCP
- connect Playwright MCP
- create repeatable PR review workflow
- add browser-based UI verification

## Phase 5: Production Agent Workflows

- add eval harness
- add observability conventions
- define HITL policies
- experiment with TypeScript agent frameworks such as Mastra, Vercel AI SDK, and LangGraph JS

## Framework Positioning

Google ADK and Agents CLI are useful reference architectures for lifecycle concepts such as scaffold, evaluate, deploy, and observe.

They are not the primary implementation stack for this roadmap because the preferred stack is TypeScript-first.

Borrow the patterns. Do not inherit the stack unless a project explicitly needs it.
