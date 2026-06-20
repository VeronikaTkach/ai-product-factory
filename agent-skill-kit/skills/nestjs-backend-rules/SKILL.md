---
name: nestjs-backend-rules
description: Apply NestJS, TypeScript, PostgreSQL, Prisma, validation, authentication, authorization, and backend architecture conventions when creating, refactoring, or reviewing backend code. Do not use for frontend-only work.
---

# NestJS Backend Rules

## When to Use

Use this skill when the task involves:

- creating or refactoring NestJS modules
- designing backend API boundaries
- writing controllers, services, DTOs, guards, pipes, or interceptors
- integrating Prisma or PostgreSQL
- implementing authentication or authorization
- validating external input
- reviewing TypeScript backend code
- designing backend tests

## When Not to Use

Do not use this skill for:

- frontend-only React work
- UI component design
- CSS or Tailwind-only tasks
- generic roadmap writing
- database-only conceptual design with no backend code
- MCP server security review unless NestJS code is involved

## Trigger Examples

Positive triggers:

- "Create a NestJS module for orders."
- "Add DTO validation for this endpoint."
- "Review this NestJS service."
- "Implement a Prisma repository for users."
- "Add an authorization guard for admin routes."

Negative triggers:

- "Create a React profile card."
- "Refactor this page according to FSD."
- "Design a global agent ecosystem roadmap."
- "Audit a public MCP server."
- "Write Tailwind styles for a dashboard."

## Workflow

1. Identify whether the task is API design, feature implementation, refactoring, or review.
2. Check `references/backend-conventions.md` for global backend rules.
3. Check `references/nestjs-architecture.md` for module, controller, service, provider, and dependency rules.
4. Check `references/prisma-postgresql.md` when persistence, transactions, migrations, or query shape are involved.
5. Check `references/security-validation.md` when auth, authorization, validation, secrets, or high-risk actions are involved.
6. Check `references/state-transitions.md` when approval, rejection, cancellation, publishing, payment, or finalization changes state.
7. Use `templates/` when creating new NestJS files.
8. Use `examples/` as style references.
9. Keep diffs focused and include verification steps.

## Core Rules

- Keep controllers thin.
- Put business logic in services or domain-level providers.
- Validate all external input at the boundary.
- Enforce authorization server-side.
- Keep Prisma/database access isolated from controllers.
- Use explicit TypeScript types and DTOs.
- Avoid leaking internal errors to API clients.
- Avoid raw SQL unless justified and parameterized.
- Treat migrations and destructive data changes as high-risk.
- Preserve existing project conventions when they are clear.

## Output Expectations

When generating code:

- include module wiring where needed
- include DTOs for request bodies and query params
- include typed responses or documented return shapes
- include authorization checks where the endpoint is not public
- include error handling with appropriate HTTP exceptions
- include test suggestions or focused verification steps

When reviewing code:

- identify missing validation
- identify missing authorization
- identify controller/service boundary violations
- identify unsafe Prisma or SQL usage
- identify error handling gaps
- identify transaction and consistency risks

## References

- `references/backend-conventions.md`
- `references/nestjs-architecture.md`
- `references/prisma-postgresql.md`
- `references/security-validation.md`
- `references/state-transitions.md`

## Templates

- `templates/module.ts`
- `templates/controller.ts`
- `templates/service.ts`
- `templates/dto.ts`
- `templates/guard.ts`

## Evals

- `evals/trigger-cases.json`
