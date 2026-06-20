# Case 01 Run: Frontend Feature

Date: 2026-06-19

## Case

`validation/cases/01-frontend-feature.md`

## Selected Skill Route

1. `spec-driven-development`
2. `react-enterprise-rules`
3. `testing-patterns`
4. `typescript-code-review`
5. `code-review`

Security note: include lightweight security notes in the spec because the feature concerns the current user's profile. Full `agent-security-review` is deferred unless backend/auth/user identity handling is implemented or changed.

## Simulated First Agent Response

# Feature Spec: User Profile Editing Screen

## Goal

Allow the current authenticated user to view and update their display name and timezone from a TypeScript React profile editing screen.

## Context

The app needs a self-service profile screen. The feature is frontend-focused but depends on a typed API boundary for loading and saving profile data.

## Scope

- Load the current user's profile.
- Display editable fields for display name and timezone.
- Show loading, error, empty, dirty, saving, and saved states.
- Save profile changes through an API client.
- Use TypeScript types for API response and UI state.
- Keep API logic outside presentational components.

## Non-Goals

- Authentication implementation.
- Backend endpoint implementation.
- Password, email, avatar, billing, or role editing.
- Timezone database design.
- Global profile state unless the existing app already uses it.

## Assumptions

- The user is already authenticated.
- A current-user profile API exists or will be provided.
- Display name and timezone are not treated as highly sensitive fields.
- The project uses React, TypeScript, Tailwind, and Axios.

## User Stories

- As an authenticated user, I want to edit my display name and timezone so that my account reflects my preferred profile information.

## Acceptance Criteria

- The screen shows a loading state while the profile request is pending.
- The screen shows an error state if loading fails.
- The screen shows an empty or fallback state if no profile is returned.
- The form is populated from the loaded profile.
- The save action is disabled while saving.
- The save action validates that display name is not empty.
- The save action sends only editable fields: `displayName` and `timezone`.
- The UI shows success feedback after a successful save.
- The UI preserves or restores the previous state if save fails.
- API response data is transformed at the boundary before reaching UI state.

## BDD Scenarios

```gherkin
Scenario: User loads profile editing screen
  Given the user is authenticated
  When the profile screen opens
  Then the app requests the current user's profile
  And the form displays display name and timezone
```

```gherkin
Scenario: User saves valid profile changes
  Given the profile form is loaded
  And the user changes display name or timezone
  When the user saves the form
  Then the app sends the updated fields to the profile API
  And the screen shows saved feedback
```

```gherkin
Scenario: User cannot save an empty display name
  Given the profile form is loaded
  When the user clears display name
  Then the save action is blocked
  And the user sees a validation message
```

```gherkin
Scenario: Profile save fails
  Given the profile form is loaded
  When the save request fails
  Then the app shows an error message
  And the user's unsaved edits remain visible
```

## UX Notes

- Include loading, error, empty, editing, saving, and saved states.
- Use accessible labels for all fields.
- Save button should communicate pending state.
- Avoid layout shift between states where practical.

## API Contract

Load current profile:

```text
GET /profile/me
```

Response:

```ts
type TProfileResponse = {
  id: string;
  displayName: string;
  timezone: string;
};
```

Update current profile:

```text
PATCH /profile/me
```

Request:

```ts
type TUpdateProfileRequest = {
  displayName: string;
  timezone: string;
};
```

UI model:

```ts
type TProfile = {
  id: string;
  displayName: string;
  timezone: string;
};
```

## Data Model Notes

- No frontend-owned database changes.
- Treat timezone as a controlled value list when the product has an approved list.

## Security and Permissions

- The frontend must not accept or send a user ID for update.
- The backend must derive user identity from auth context.
- Do not expose tokens or auth internals in UI state or logs.
- Full `agent-security-review` is required if backend auth, profile ownership, or sensitive fields are added.

## Testing Plan

- Component test: renders loading, error, empty, and success states.
- Form test: blocks empty display name.
- Hook/API-client test: maps `TProfileResponse` to `TProfile`.
- Interaction test: save button is disabled while saving.
- Optional Playwright smoke test: authenticated user edits and saves timezone.

## Implementation Plan

1. Create typed profile API client.
2. Create profile loading/saving hook.
3. Create profile form component.
4. Compose screen/page with states.
5. Add focused tests for validation and API state behavior.
6. Run `typescript-code-review`, then `code-review`.

## Open Questions

- Does the app already have a timezone list?
- Does the project use a query library or local hook state for server data?
- Where should success feedback appear in the existing design system?

## Evaluation Against Success Criteria

- Agent does not start coding immediately: pass.
- Agent identifies frontend rules apply: pass.
- Agent mentions API boundary and typed response mapping: pass.
- Agent proposes component/hook/API-client tests or equivalent: pass.
- Agent keeps security notes proportional to profile data risk: pass.

## Result

Pass.

## Follow-Up

No package changes required from this case.
