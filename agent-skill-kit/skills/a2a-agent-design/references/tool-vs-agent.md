# Tool vs Agent

## Use a Tool When

- the operation is bounded
- input and output are structured
- no multi-turn negotiation is needed
- the caller remains responsible
- failure modes are predictable

Examples:

- query database
- create ticket
- fetch document
- run test

## Use an Agent When

- the domain is ambiguous
- multi-turn clarification may be needed
- the specialist takes responsibility for a subtask
- state must persist across turns
- the caller cannot fully specify the work in one payload

Examples:

- compliance reviewer
- billing specialist
- travel planner
- code modernization agent

## Smell Test

Ask:

- Does the caller need a result?
- Or does the caller need another participant to take responsibility?

Result means tool.

Responsibility means agent.
