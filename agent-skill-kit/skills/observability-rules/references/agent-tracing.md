# Agent Tracing

## Trace Shape

Represent each agent session as a trace tree.

Useful span types:

- `agent.session`
- `agent.model`
- `agent.tool`
- `agent.skill`
- `agent.file_edit`
- `agent.browser`
- `agent.evaluation`

## What to Capture

- user request
- selected skills
- model calls
- tool calls
- tool arguments
- tool outputs summary
- file edits
- errors and retries
- user corrections
- final action

## What Not to Capture

- raw secrets
- full tokens
- sensitive request bodies
- unnecessary PII
- private customer data unless masked and justified

## Sampling

Keep:

- failures
- high-cost sessions
- high-risk actions
- abandoned sessions
- sessions with many corrections
- security policy violations

Drop or downsample routine successes.
