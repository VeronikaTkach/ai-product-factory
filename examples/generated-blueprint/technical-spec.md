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
