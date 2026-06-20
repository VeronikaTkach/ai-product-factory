# Roadmap: KnitConnect

## Milestones

### Milestone 1 — Catalog and Profiles (Weeks 1-4)

- Instructor profile pages.
- Course catalog with search/filter.
- Course detail page.

### Milestone 2 — Checkout and Payments (Weeks 5-7)

- Checkout flow for courses.
- Payment processor integration (Stripe Connect).
- Order confirmation emails.

### Milestone 3 — Messaging and Storefront (Weeks 8-10)

- In-app messaging between learner and instructor.
- Product storefront and checkout for handmade goods.

### Milestone 4 — Reviews and Launch Hardening (Weeks 11-13)

- Review system for completed orders.
- Security hardening pass (auth, rate limiting, role checks).
- Beta launch with a small cohort of instructors.

## Delivery Phases

1. **Foundation** — auth, instructor/learner roles, course catalog (read-only).
2. **Transactions** — checkout, payments, order history.
3. **Engagement** — messaging, storefront, reviews.
4. **Hardening** — security pass, monitoring, beta launch.

## Dependencies

- Checkout (Milestone 2) depends on instructor profiles and course catalog (Milestone 1).
- Messaging (Milestone 3) depends on completed orders existing (Milestone 2) for order-linked context.
- Reviews (Milestone 4) depend on completed orders (Milestone 2).
- Security hardening (Milestone 4) should not be deferred past beta launch given financial and personal data in scope.
