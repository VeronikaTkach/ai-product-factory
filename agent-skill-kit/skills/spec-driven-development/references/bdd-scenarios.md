# BDD Scenarios

## Purpose

BDD scenarios turn fuzzy intent into testable behavior.

Use them when:

- user behavior matters
- permissions matter
- validation matters
- edge cases are important
- a coding agent needs precise guidance

## Format

```gherkin
Scenario: Short behavior name
  Given the starting state
  When the actor performs an action
  Then the system produces the expected outcome
```

## Scenario Types

Include at least:

- happy path
- validation failure
- permission failure
- empty state
- loading or pending state when UI is involved
- retry or recovery path when relevant

## Good Scenario

```gherkin
Scenario: User cannot view another user's order
  Given Alice is authenticated
  And Bob owns an existing order
  When Alice requests Bob's order by ID
  Then the API responds with 403
  And no order details are returned
```

## Weak Scenario

```gherkin
Scenario: Orders are secure
  Given a user
  When they use the app
  Then it works safely
```

## Tips

- Keep each scenario focused on one behavior.
- Do not include implementation details unless they affect behavior.
- Use business language.
- Include negative paths.
- Make scenarios easy to convert into tests.
