# TypeScript Review Checklist

## Typing

- Avoid `any`.
- Check unknown external data is validated or narrowed.
- Check nullable values before use.
- Prefer explicit public function return types.
- Avoid unsafe type assertions.
- Use discriminated unions for multi-state flows.

## Async and Errors

- Await promises intentionally.
- Handle rejected promises.
- Avoid swallowing errors.
- Use appropriate framework exceptions.
- Preserve useful debugging context.

## Architecture

- Check layer boundaries.
- Keep UI, business logic, and data access separate.
- Avoid circular dependencies.
- Avoid unrelated refactors.
- Avoid duplicated business rules.

## Maintainability

- Prefer simple functions.
- Keep names meaningful.
- Avoid mega-functions.
- Keep side effects visible.
- Avoid hidden global state.

## Dependencies

- Question new dependencies.
- Avoid unmaintained packages.
- Avoid dependency use for trivial logic.
- Watch for hallucinated package names.
