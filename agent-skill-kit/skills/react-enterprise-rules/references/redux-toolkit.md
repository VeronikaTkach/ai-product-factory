# Redux Toolkit Rules

## When to Use Redux Toolkit

Use Redux Toolkit when state is:

- global across distant parts of the app
- long-lived
- shared by multiple routes
- difficult to represent in URL state
- not already handled by server cache tooling

Do not use Redux for:

- local form fields
- modal open state used by one component
- hover or focus state
- temporary UI-only flags
- data that belongs in a query cache

## Slice Design

- Keep slices domain-oriented.
- Keep reducers small.
- Prefer explicit state variants.
- Avoid deeply nested mutable structures.
- Keep async state readable.

Example state shape:

```ts
type TRequestStatus = "idle" | "loading" | "success" | "error";

interface IUsersState {
  items: TUser[];
  status: TRequestStatus;
  errorMessage: string | null;
}
```

## Async Logic

Use `createAsyncThunk` when:

- the project does not use RTK Query
- the async operation belongs to global state
- loading and error states must be shared

Prefer service/API modules for actual HTTP calls.

Do not put Axios calls directly inside components.

## Selectors

- Export selectors from the slice model.
- Use selectors to hide state shape from UI.
- Use memoized selectors when deriving expensive data.

## Component Usage

- Components dispatch user intents, not low-level implementation details.
- Components read state through selectors.
- Components should not know API response shapes when a boundary transform is needed.

## Review Checklist

- Is Redux necessary here?
- Is the slice domain-oriented?
- Are loading and error states represented?
- Are selectors exported?
- Are API calls isolated?
- Are action names meaningful?
- Is temporary UI state kept local?
