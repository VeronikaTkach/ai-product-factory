# High-Risk Actions

## Actions Requiring Approval

Require explicit human approval for:

- production deployment
- infrastructure changes
- IAM or permission changes
- database migrations
- data deletion
- bulk updates
- billing or payment operations
- email or notification campaigns
- public content publication
- external API actions with irreversible effects

## Vibe Diff

High-risk approval should include a Vibe Diff:

- original user intent
- proposed action
- affected system
- affected data
- exact command or tool call when relevant
- expected outcome
- rollback plan
- residual risk

The approval prompt should be understandable without reading generated code.

## Approval Fatigue

Avoid asking for approval on low-risk routine steps.

Do ask when:

- the action crosses an environment boundary
- the action mutates durable state
- the action affects other users
- the action grants access
- the action sends or publishes externally
- the action spends money

## Circuit Breakers

High-risk workflows should have a way to stop or roll back:

- transaction rollback
- version control checkpoint
- feature flag
- queued draft instead of immediate send
- dry-run mode
- read-only preview
- staged deployment

## Audit Trail

Record:

- who approved
- what was approved
- when it ran
- tool or command used
- affected resources
- result
- rollback action if any
