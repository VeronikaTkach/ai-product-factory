# Task Breakdown: KnitConnect

## Milestone 1 — Catalog and Profiles

- [ ] Define `User`, `Course` data models.
- [ ] Build instructor profile page (bio, course list).
- [ ] Build course catalog page with search/filter.
- [ ] Build course detail page.

## Milestone 2 — Checkout and Payments

- [ ] Define `Order` data model.
- [ ] Integrate payment processor (Stripe Connect) for course checkout.
- [ ] Build checkout flow UI.
- [ ] Send order confirmation emails.
- [ ] Enforce server-side authorization on order creation (reject client-supplied price/status fields).

## Milestone 3 — Messaging and Storefront

- [ ] Define `Message`, `Product` data models.
- [ ] Build in-app messaging thread UI, authorized strictly by participant ID.
- [ ] Build product storefront listing and checkout for handmade goods.

## Milestone 4 — Reviews and Launch Hardening

- [ ] Define `Review` data model, linked to completed orders only.
- [ ] Build review submission and display UI.
- [ ] Add rate limiting on public catalog and checkout endpoints.
- [ ] Add audit logging for order state transitions.
- [ ] Run a security review pass against the threat model before beta launch.

## Dependencies

See `roadmap.md` for milestone-level dependencies.
