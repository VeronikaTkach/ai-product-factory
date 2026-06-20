---
name: pwa-rules
description: Plan, implement, and review Progressive Web Apps. Use for Web App Manifest, service workers, cache strategy, offline UX, app installability, update prompts, push notifications, background sync, Lighthouse PWA checks, and browser/device validation.
---

# PWA Rules

## When to Use

Use this skill when work touches:

- PWA setup or review
- Web App Manifest
- service workers
- Cache Storage
- offline or poor-network behavior
- install prompts and app icons
- app update UX
- push notifications
- background sync
- Lighthouse PWA checks
- mobile browser validation

## When Not to Use

Do not use this skill for ordinary React UI changes with no installability, service worker, cache, offline, notification, or app-shell behavior.

## Workflow

1. Read `references/pwa-checklist.md`.
2. Read `references/service-worker-cache.md` if service workers, caching, offline mode, or update behavior are involved.
3. Read `references/pwa-testing.md` before claiming the PWA is ready.
4. Define the PWA goal: installable shell, offline read mode, offline writes, push notifications, or full app resilience.
5. Choose a cache strategy per asset/data type.
6. Define what must never be cached.
7. Define offline, stale data, and app update UX.
8. Add tests and manual checks that match the risk.
9. Run build and PWA checks where available.
10. Report checks not run and residual risk.

## Guardrails

- Do not cache auth tokens, secrets, private API responses, or user-sensitive data unless the product explicitly accepts that risk and storage is protected.
- Do not claim offline support unless the user can complete the named workflow offline.
- Do not use a cache-first strategy for user-specific API data unless staleness and privacy risks are addressed.
- Do not ship a service worker without an update strategy.
- Do not call a PWA installable until manifest, icons, HTTPS/local origin, and service worker checks pass.
- Do not add push notifications or background sync without permission UX and failure behavior.
- Keep PWA scope explicit. A marketing site PWA, admin dashboard PWA, and offline-first field app need different guarantees.

## Output Expectations

For PWA implementation or review, report:

- PWA goal and scope
- manifest status
- service worker strategy
- cache rules by resource type
- offline UX
- update UX
- sensitive-data caching decision
- tests and manual checks run
- checks not run
- residual risks

## References

- `references/pwa-checklist.md`
- `references/service-worker-cache.md`
- `references/pwa-testing.md`
