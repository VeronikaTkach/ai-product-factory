# Frontend Testing

## React Component Tests

Use component tests for:

- conditional rendering
- form validation
- user interaction
- loading/error/empty states
- accessibility expectations

Prefer React Testing Library style:

- query by role or label
- interact like a user
- avoid testing internal state

## Hook Tests

Use hook tests when:

- the hook has reusable stateful behavior
- async loading/error behavior matters
- edge cases are easier to isolate outside a component

## Playwright

Use Playwright for:

- login and checkout flows
- navigation
- responsive critical paths
- visual behavior that unit tests cannot see
- browser-only bugs

## Snapshot Tests

Use snapshots sparingly.

Good fit:

- stable serialized output
- generated schema

Poor fit:

- frequently changing UI markup
- broad component trees
