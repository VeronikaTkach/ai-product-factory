# Service Worker and Cache Strategy

## Strategy by Resource Type

Use different strategies for different resources.

Static app assets:

- prefer precache or stale-while-revalidate
- version cache names
- delete old caches during activation

HTML navigation:

- use network-first or app-shell fallback
- avoid trapping users on stale broken HTML after deploys

Public API data:

- choose network-first, stale-while-revalidate, or cache-first based on freshness needs
- show stale indicators when data may be old

User-specific API data:

- prefer network-first
- cache only after privacy and staleness review
- clear cache on logout or identity switch

Mutations:

- do not silently queue writes unless background sync behavior is specified
- show pending, failed, and retry states
- make retries idempotent where possible

## Update Behavior

Every service worker needs an update plan.

Define:

- when a new service worker activates
- whether users see an "update available" prompt
- whether tabs reload automatically
- how old caches are removed
- how breaking API/app-shell mismatches are avoided

## Cache Safety

Do not cache:

- access tokens
- refresh tokens
- API keys
- payment data
- private documents
- sensitive user records
- admin responses
- personalized responses without explicit policy

Review:

- cache keys
- cache names
- logout cleanup
- multi-account behavior
- offline error states
