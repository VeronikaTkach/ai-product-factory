# Frontend Review

## React

- Components should have one clear responsibility.
- Hooks should not violate rules of hooks.
- Effects should have correct dependencies.
- Derived state should not be duplicated unnecessarily.
- Loading, error, empty, and success states should be represented.

## Type Boundaries

- API response types should not leak directly into UI when transformation is needed.
- Props should be explicit.
- Optional props should have clear defaults or checks.

## State

- Prefer local state before Redux.
- Avoid putting temporary UI state in global stores.
- Keep selectors stable and meaningful.

## UI Quality

- Check accessibility labels.
- Check keyboard behavior for interactive controls.
- Check text overflow and responsive layout risk when visible from code.
