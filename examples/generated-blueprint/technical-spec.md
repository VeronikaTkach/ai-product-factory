# Technical Architecture: KnitConnect

## Recommended Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS.
- Backend: Next.js API Routes, TypeScript.
- Database: PostgreSQL (course/product/order/message data has real relational structure and needs durability beyond MVP demo storage).
- Payments: third-party processor (e.g., Stripe Connect, for splitting payouts between platform and instructors).

## System Architecture

```text
Browser (learner / instructor)
  -> Next.js frontend
  -> Next.js API routes
       -> Course service
       -> Messaging service
       -> Storefront/order service
       -> Payment provider (Stripe Connect)
  -> PostgreSQL (courses, products, orders, messages, reviews)
```

## Database Entities

- `User` (learner or instructor role)
- `Course` (owned by instructor)
- `Product` (owned by instructor)
- `Order` (course or product, buyer, payment status)
- `Message` (thread between learner and instructor)
- `Review` (linked to a completed order)

## API Modules

- `courses` — list, detail, create/update (instructor only)
- `products` — list, detail, create/update (instructor only)
- `orders` — checkout, order history
- `messages` — thread list, send message
- `reviews` — create, list by course/product

## Integration Points

- Payment processor for checkout and instructor payouts.
- Email provider for order confirmations and message notifications.

## Scalability Notes

- Course catalog and storefront reads are the dominant traffic pattern; cache catalog listings.
- Messaging is low-volume at MVP scale; no need for a dedicated real-time infrastructure (polling or simple websocket is sufficient).

## Deployment Notes

- Vercel for frontend and API routes.
- Managed PostgreSQL (e.g., Vercel Postgres, Supabase, or Render) once persistence is added — out of scope for the AI Product Factory MVP itself, which only generates this recommendation.

## Skill-Informed Architecture Notes

These notes were added automatically because `database-design-rules`, `mcp-tool-consumption`, `observability-rules`, `a2a-agent-design`, and `a2ui-patterns` were included in the final skill selection before this blueprint was generated (see `docs/architecture.md`, "Manual Skill Selection"):

- Add explicit data model constraints (NOT NULL, foreign keys, unique constraints) for every entity introduced above.
- Add an ownership check (e.g. `WHERE owner_id = :userId`) on every query that reads or writes user-owned rows.
- Add indexes on foreign keys and frequently filtered columns before this schema goes to production.
- Document the tool access policy (which agents/tools can call which external systems) before adding new integrations.
- Add distributed traces across the agent/orchestrator boundary for debugging multi-step flows.
- Add cost and latency metrics per agent call to catch regressions.
- Define explicit boundaries between agents/services and document what each one owns.
- Define delegation rules: which agent can invoke which other agent, and how failures propagate.
- Render any agent-generated UI/output through a trusted, schema-validated component catalog — never raw HTML/markdown from an untrusted source.
- Validate agent-generated UI payloads against a schema before rendering; fail safe (show plain text) on validation failure.
