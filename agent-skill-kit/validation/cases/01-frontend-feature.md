# Case 01: Frontend Feature

## User Task

Build a user profile editing screen for a TypeScript React app. The screen should load the current user's profile, let the user edit display name and timezone, show loading/error/empty states, and save changes through an API client. Do not implement immediately; start with a spec.

## Expected Skill Route

1. `spec-driven-development`
2. `react-enterprise-rules`
3. `testing-patterns`
4. `typescript-code-review`
5. `code-review`

## Security Route

Use `agent-security-review` only if the implementation touches authentication, user identity, or sensitive profile data beyond display name/timezone.

## Expected Output

The first response should produce a feature spec, not code.

The spec should include:

- goal
- scope and non-goals
- acceptance criteria
- BDD scenarios
- UI states
- API contract
- security notes
- testing plan
- implementation plan

## Success Criteria

- Agent does not start coding immediately.
- Agent identifies that frontend rules apply.
- Agent mentions API boundary and typed response mapping.
- Agent proposes component/hook/API-client tests or equivalent.
- Agent keeps security notes proportional to the profile data risk.
