# Demo Scenario

## Purpose

A single, repeatable scenario used for screenshots, the YouTube video, and judging. It must work fully in `DEMO_MODE=true` with no live LLM calls.

## The Idea

> A founder wants to build a marketplace for knitting instructors where learners buy courses, communicate with teachers, and purchase handmade products.

## Suggested Form Input

| Field | Value |
|---|---|
| Product name | KnitConnect |
| Industry | Education / Marketplace |
| Business description | A marketplace connecting knitting instructors with learners for courses, live guidance, and handmade goods. |
| Target users | Hobbyist and beginner knitters, independent knitting instructors |
| Geography | English-speaking markets (US, UK, Canada, Australia) initially |
| Market type | Marketplace |
| Problem statement | Independent knitting instructors have no single platform to sell courses, sell handmade products, and communicate with learners; learners struggle to find vetted instructors. |
| Current alternatives | Generic course platforms (Udemy, Skillshare), generic marketplaces (Etsy), social media DMs |
| Core idea | A two-sided marketplace combining course sales, instructor-learner messaging, and a handmade-goods storefront |
| Key features | Course catalog, checkout, instructor profiles, in-app messaging, product storefront, reviews |
| Budget | Bootstrapped, under $20k for MVP |
| Timeline | 3-4 months to MVP |
| Team size | 2 founders, 1 contract designer |
| Personal data | Yes (names, emails, messages) |
| Financial data | Yes (payments for courses and products) |
| Health data | No |
| Sensitive information | Buyer/seller messages may contain addresses for shipping handmade goods |

## Walkthrough Steps

1. Open the app (intro screen).
2. Click "Start" and fill the business idea form with the values above.
3. Submit the form and observe the visible agent workflow progress (Business Analyst step running).
4. Review the generated Product Spec and MVP Scope, and the **Skills for this blueprint** selector shown above the approve buttons — it lists the skills recommended by the MCP-first/local-fallback Skill Router, with a badge showing whether they came from the public MCP server or the local fallback.
5. Optionally adjust the skill selection: uncheck a recommended skill, check additional skills from the full catalog, or click "Reset to recommended skills." `spec-driven-development` is always selected and cannot be unchecked.
6. Click "Approve and Continue" at the Product Spec approval step — the final skill selection (not just the original recommendation) is sent to the blueprint stage.
7. Observe the remaining workflow steps run (Architect, Security, Planning, Evaluation).
8. Review the Results tabs: Product Spec, MVP Scope, Architecture, Security, Roadmap, Tasks, Readiness Score. Sections like "Skill-Informed Architecture Notes," "Skill-Informed Security Notes," and the Readiness Score's "Skills Applied" list reflect the final skill selection from step 5/6.
9. Download one tab as Markdown, then use "Export All" to download the full blueprint bundle.

## Why This Scenario

- Has clear personal and financial data, so the Security Agent output (data classification, STRIDE, approval-required actions) is visible and meaningful.
- Has an obvious MVP boundary (marketplace core vs. live video, advanced search, recommendations) so the MVP Scope and Roadmap outputs are easy to evaluate at a glance.
- Matches the committed example blueprint in `examples/generated-blueprint/`, so demo output and repository example stay consistent.

## Reliability Notes

- The demo must run with `DEMO_MODE=true` and produce the same output every time (see `examples/generated-blueprint/` for the canonical reference output).
- Do not rely on live LLM responses for recording or judging; live mode is for stretch demonstration only once implemented.
