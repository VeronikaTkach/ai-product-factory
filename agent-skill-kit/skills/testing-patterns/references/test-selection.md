# Test Selection

## Unit Tests

Use for:

- pure functions
- validators
- mappers
- reducers
- domain calculations

Benefits:

- fast
- precise failure signal
- easy to run often

## Integration Tests

Use for:

- service plus database behavior
- API client plus mocked server
- module wiring
- persistence logic

Benefits:

- catches boundary mistakes
- verifies real collaboration between units

## E2E Tests

Use for:

- API route contracts
- auth flows
- critical user journeys
- browser behavior

Benefits:

- catches system-level regressions
- protects real workflows

## Risk-Based Coverage

Higher coverage is required when code touches:

- authentication
- authorization
- payments
- database writes
- migrations
- user data
- public API contracts
- high-traffic UI flows

## What Not to Over-Test

- framework behavior
- trivial getters/setters
- static layout with no behavior
- implementation details likely to change
