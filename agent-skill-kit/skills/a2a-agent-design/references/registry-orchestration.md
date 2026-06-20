# Registry and Orchestration

## Direct Endpoint

Use direct endpoints when:

- the vendor or agent is fixed
- trust relationship is established
- discovery is not needed
- simpler operation is preferred

## Registry

Use a registry when:

- multiple agents may satisfy a task
- internal teams publish specialists
- discovery and governance matter
- versioning matters
- authentication validation should be centralized

## Orchestrator Responsibilities

- understand user intent
- choose specialist
- pass minimum necessary context
- maintain overall workflow state
- handle clarification loops
- enforce policy
- handle failures and fallback

## Failure Modes

- specialist unavailable
- specialist asks for more information
- specialist exceeds scope
- conflicting agent outputs
- hidden cost growth
- data policy mismatch

Plan fallbacks before production use.
