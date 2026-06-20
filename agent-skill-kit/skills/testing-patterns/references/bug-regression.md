# Bug Regression Workflow

## Rule

When feasible, reproduce the bug before fixing it.

## Steps

1. Capture the failing behavior.
2. Write a failing unit, integration, e2e test, or reproduction command.
3. Confirm the test fails for the right reason.
4. Make the smallest fix.
5. Confirm the test passes.
6. Run nearby tests.
7. Keep the regression test in the codebase.

## Good Reproduction Forms

- unit test for pure logic
- service test for backend rules
- API e2e test for route behavior
- Playwright test for UI behavior
- curl command for HTTP bugs
- SQL query for data bugs

## Avoid

- fixing before understanding root cause
- broad cleanup inside bug fixes
- deleting or weakening tests to pass
- mocking the failing path away
