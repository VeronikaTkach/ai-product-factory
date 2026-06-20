# Feature-Sliced Design Rules

## Preferred Layers

Use these layers for non-trivial frontend applications:

- `app`
- `processes`
- `pages`
- `widgets`
- `features`
- `entities`
- `shared`

Not every project needs every layer. Start with the smallest useful structure.

## Layer Responsibilities

## app

Application setup:

- providers
- routing
- global styles
- app-level store setup
- error boundaries

## processes

Long-running cross-page flows:

- onboarding
- checkout
- multi-step authentication

Use only when a real process spans multiple pages or features.

## pages

Route-level composition.

Pages compose widgets, features, and entities. They should avoid owning deep business logic.

## widgets

Large UI blocks that combine multiple features or entities.

Examples:

- sidebar
- dashboard header
- order table with filters

## features

User actions and business capabilities.

Examples:

- login form
- add to cart
- update profile
- filter orders

## entities

Domain objects and their UI/model helpers.

Examples:

- user
- order
- product
- invoice

## shared

Reusable infrastructure:

- UI primitives
- API client
- utilities
- config
- generic hooks
- constants

## Import Rules

- A layer may import from layers below it.
- A layer must not import from layers above it.
- `shared` must not import from business layers.
- Avoid cross-feature imports.
- Prefer public APIs through `index.ts` files for feature/entity boundaries.

## File Organization

Recommended slice structure:

```text
features/update-profile/
  api/
  model/
  ui/
  lib/
  index.ts
```

Use only folders that are needed.

## Public API

Each feature or entity should expose a small public API:

```ts
export { UpdateProfileForm } from "./ui/UpdateProfileForm";
export type { TUpdateProfilePayload } from "./model/types";
```

Do not import deep internals from another slice unless there is a strong reason.

## Common Mistakes

- putting all reusable code in `shared` too early
- importing a feature from another feature
- storing API clients inside components
- placing business rules in route pages
- using Redux for local form state
- creating layers before the project needs them
