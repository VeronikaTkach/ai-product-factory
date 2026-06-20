---
name: react-enterprise-rules
description: Apply React, TypeScript, FSD, Redux Toolkit, Tailwind, shadcn/ui, Radix, and Axios conventions when creating, refactoring, or reviewing enterprise frontend code. Do not use for backend-only or database-only work.
---

# React Enterprise Rules

## When to Use

Use this skill when the task involves:

- creating or refactoring React components
- designing frontend architecture
- choosing Vite or Next.js
- applying Feature-Sliced Design
- writing TypeScript frontend code
- creating API client code
- using Redux Toolkit
- using Tailwind CSS, shadcn/ui, or Radix UI
- reviewing frontend code

## When Not to Use

Do not use this skill for:

- backend-only NestJS work
- database schema design
- agent security review
- infrastructure or deployment tasks
- generic writing tasks with no frontend code

## Trigger Examples

Positive triggers:

- "Create a React component for the user profile card."
- "Refactor this page according to FSD."
- "Review this Redux slice."
- "Add an Axios API client for orders."
- "Should this app use Vite or Next.js?"

Negative triggers:

- "Design a PostgreSQL schema."
- "Create a NestJS auth guard."
- "Audit this MCP server for security."
- "Write a product roadmap."
- "Configure Docker deployment."

## Workflow

1. Identify whether the work is application generation, feature implementation, refactoring, or review.
2. Check `references/project-conventions.md` for global frontend rules.
3. Check `references/fsd.md` when architecture or imports are involved.
4. Check `references/redux-toolkit.md` when global state is involved.
5. Use `templates/` when creating new files.
6. Use `examples/` as style references.
7. Keep changes focused and explain architectural decisions.

## Core Rules

- Prefer maintainable code over clever code.
- Keep business logic separate from presentation logic.
- Type external data at the boundary.
- Use local state before global state.
- Follow FSD boundaries for non-trivial apps.
- Prefer Tailwind CSS, shadcn/ui, and Radix UI for UI.
- Use Axios for API clients unless the project already uses another client.
- Avoid adding dependencies without explaining why.
- Preserve existing project conventions when they are clear.

## Output Expectations

When generating code:

- provide focused files
- include explicit TypeScript types
- keep imports consistent with FSD
- include loading, error, and empty states where relevant
- avoid placeholder business logic in production-facing code

When reviewing code:

- identify architecture violations
- identify unsafe or untyped boundaries
- identify unnecessary Redux usage
- identify UI accessibility gaps
- suggest concrete changes

## References

- `references/project-conventions.md`
- `references/fsd.md`
- `references/redux-toolkit.md`

## Templates

- `templates/component.tsx`
- `templates/page.tsx`
- `templates/hook.ts`
- `templates/slice.ts`

## Evals

- `evals/trigger-cases.json`
