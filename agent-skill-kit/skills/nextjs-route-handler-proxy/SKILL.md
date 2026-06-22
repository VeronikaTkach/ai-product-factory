---
name: nextjs-route-handler-proxy
description: Apply Next.js App Router route-handler proxy rules. Use when client requests must go through `src/app/api/**/route.ts`, backend paths are hidden behind local route names, and `API_URL` must remain server-side. Do not use for non-Next.js projects.
---

# Next.js Route Handler Proxy

## When to Use

Use this skill when:

- the project uses Next.js App Router
- API calls must go through `src/app/api/**/route.ts`
- client code must not call the backend directly
- backend paths should be hidden from the browser
- `API_URL` must stay server-side
- auth/session/push routes are proxied through route handlers

## When Not to Use

Do not use this skill for:

- Vite-only apps
- plain React SPAs with direct backend API clients
- NestJS backend implementation
- projects without Next.js App Router

If the project stack is not Next.js App Router, put this convention in Open Questions instead of applying it.

## Workflow

1. Confirm the project uses Next.js App Router.
2. Read `references/proxy-rules.md`.
3. Map user-facing route handler names to backend endpoints.
4. Keep backend URLs and `API_URL` out of client code.
5. Implement or review route handlers as server-only proxy boundaries.
6. Review auth, cookies, headers, and error propagation.
7. Add tests or browser checks for the route handler behavior.

## Guardrails

- Client code calls only local route handlers.
- Do not expose real backend URLs in browser bundles.
- Folder names may intentionally hide backend route names, such as `create_user` for register.
- Route handlers should validate input before forwarding when practical.
- Route handlers should preserve meaningful backend status codes.
- Do not leak backend internal error bodies to the client.
- Keep secrets, service tokens, and `API_URL` server-side only.

## References

- `references/proxy-rules.md`

## Evals

- `evals/trigger-cases.json`
