# Validation Suite

This folder contains reusable cases for testing whether the skill kit routes work correctly.

## Structure

- `cases/` - committed validation scenarios.
- `runs/` - optional run outputs. Keep only useful, reviewable results.

## How to Run a Case

1. Start a fresh agent session in a test project.
2. Tell the agent to work according to `AGENTS.md`.
3. Paste one validation case as the task.
4. Check whether the agent selects the expected skills.
5. Check whether the output matches the success criteria.
6. Record notes in `runs/` only when the result is useful.

## What to Evaluate

- Skill routing: did the agent choose the right skill chain?
- Progressive disclosure: did it read only relevant references?
- Output quality: did it produce the expected artifact?
- Security awareness: did it flag high-risk actions when needed?
- Testing discipline: did it propose tests before or alongside implementation?
- Review discipline: did it separate focused code review from PR-level review?
