# Security and Threat Model: KnitConnect

## Data Classification

| Data | Category | Notes |
|---|---|---|
| Names, emails, profile data | Personal data | Required for accounts and communication between users |
| Payment and payout details | Financial data | Should never be stored directly; delegate to a payment processor's tokenized flow |
| Private messages between users | Personal data | May contain personal details (e.g. addresses); never expose outside the participant pair |
| Seller/instructor identity and verification status | Operational | Determines who is trusted to sell or teach on the platform |
| User-generated content (courses, listings, materials) | Operational | Owned by the uploading user; subject to takedown/removal requests |
| Reviews, ratings, and reports | Operational | Can reveal disputes between users; moderation actions need an audit trail |
| Other sensitive information | Personal data | Buyer/seller messages may contain addresses for shipping handmade goods |

## STRIDE Threat Model

| Category | Risk | Mitigation |
|---|---|---|
| Spoofing | Fake seller/instructor account impersonating a verified seller or instructor | Verify seller/instructor identity before granting seller status; require MFA for seller accounts |
| Tampering | Client tampers with order, price, or payout status fields | Enforce server-side authorization on all write paths; never trust client-supplied price or status fields |
| Repudiation | Disputes over payment, payout, or refund with no audit trail | Log all payment/payout state transitions with timestamps and actor IDs |
| Information Disclosure | Private messages between users exposed to the wrong user or a third party | Authorize message threads strictly by participant ID; never log or export message contents |
| Denial of Service | Public catalog/storefront scraping or checkout abuse | Rate-limit public catalog, search, and checkout endpoints |
| Elevation of Privilege | Regular user performs an admin moderation action (remove listing, suspend user, edit another user's review) | Enforce role checks server-side on every moderation endpoint; never trust a client-supplied role field |

## Security Risks

- Storing raw payment data in-house — avoid entirely; use a payment processor's tokenized flow.
- Trusting client-supplied identity or role fields (`userId`, `role`, `sellerId`) in write requests — always derive identity from the authenticated session server-side.
- Personal details embedded in free-text messages (e.g. addresses) are harder to redact or audit than a structured field — consider structured fields before scaling.
- User-generated content may include copyright-infringing or policy-violating material — plan a takedown/removal process before launch.
- Onboarding a seller/instructor without identity verification before enabling payouts increases fraud and chargeback risk.

## Approval-Required Actions

- Enabling payments or instructor/seller payouts (real money movement).
- Changing seller/instructor verification rules or requirements.
- Deleting user-generated content (courses, listings, materials) — may be irreversible.
- Exposing or sharing private messages with a third party.
- Admin moderation actions (removing a listing, suspending a user).
- Any change to authentication or session handling.

## Security Recommendations

- Use a managed auth/identity provider rather than building custom auth.
- Keep payment data out of the application database entirely; delegate to the payment processor.
- Define a clear seller/instructor verification process before allowing payouts.
- Add an audit log for moderation actions and a process for handling disputed reviews/reports.
- Add structured fields (e.g. shipping address) before scaling, instead of relying on free-text messages for sensitive data.

## Skill-Informed Security Notes

Added automatically because `agent-security-review`, `mcp-tool-consumption`, `agentic-commerce-rules`, and `observability-rules` were included in the final skill selection before this blueprint was generated:

- Run the agent-security-review checklist (auth, secrets, sensitive data, tool permissions) before this feature ships.
- Require explicit human approval before any high-risk action identified by this checklist reaches production.
- Flag any newly identified sensitive-data field for classification before storage or transmission.
- Classify every external tool/MCP call as read-only, write, or approval-required, and enforce that classification server-side.
- Add explicit payment, payout, and refund controls, including spending limits and approval gates for high-value transactions.
- Add fraud and dispute handling: flag suspicious transactions and define a chargeback/dispute resolution process.
- Add structured audit logs for every state-changing action, including actor ID and timestamp.
