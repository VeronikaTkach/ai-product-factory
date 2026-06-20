# Case 06 Implementation Run: Expense Approval Mini App

Date: 2026-06-19

## Case

`validation/cases/06-expense-approval-mini-app.md`

## Observed Behavior

The tested agent implemented the approved Expense Approval Mini App spec in backend and frontend slices, then ran security, TypeScript, and PR-level review.

## Result

Pass with follow-up guardrails added.

## What Worked

- The agent implemented after explicit spec approval.
- The agent used the intended skill sequence for backend, frontend, testing, security review, TypeScript review, and PR-level review.
- Backend implementation preserved the approved scope: no manager submission, no manager finalized-history view, no rejection reason field, no Next.js proxy layer.
- Backend used trusted auth context, role guards, forbidden-field rejection, conditional approve/reject updates, and same-transaction audit logs.
- Frontend used a Vite + React + TypeScript SPA, Axios client, FSD-style layering, local state instead of unnecessary Redux, and explicit 409 conflict handling.
- Tests were reported as passing: backend unit, backend e2e/contract, backend typecheck, backend build, Prisma validate/generate, frontend component tests, frontend typecheck, and frontend build.
- The final review honestly separated checks that ran from checks that did not run.
- The report did not claim `prisma migrate dev` succeeded without a live Postgres database.
- The report labeled the double-finalization test as simulated rather than real database concurrency coverage.

## Issues Found

### P2: Missing upper bounds for persisted numeric and string inputs

The implementation validated `amountCents > 0`, enums, and URL shape, but did not add an upper bound for `amountCents` or length bounds for `description` and `receiptUrl`.

This can push invalid data to Prisma/Postgres and produce uncontrolled 500 responses or unnecessary storage pressure. The package should remind agents to add product-defined upper bounds for money and max lengths for free-text and URL/string inputs.

### P2: Real database migration and concurrency were not verified

No live Postgres or Docker daemon was available. The agent correctly generated SQL and reported the migration as unapplied. Concurrency coverage was mocked/simulated, not a real database race.

This is acceptable for the sandbox, but reports must distinguish simulated coverage from real DB verification.

### P3: Greenfield scaffold hygiene needs an explicit review check

The implementation created `.env` with placeholder credentials and did not yet add a `.gitignore` for generated project artifacts. This is low-risk in a temporary test folder, but should be checked before committing any generated app.

## Package Updates

- Added NestJS validation guidance for upper bounds and max lengths.
- Added database design guidance for money bounds mirrored in DTO validation.
- Added backend testing guidance to label mocked transaction/concurrency tests as simulated coverage.
- Added migration verification guidance to report unapplied migrations when no live database is available.
- Added PR review guidance for greenfield scaffold hygiene.
- Added case 06 expectations for bounded validation, scaffold hygiene, and simulated-vs-real concurrency coverage.
