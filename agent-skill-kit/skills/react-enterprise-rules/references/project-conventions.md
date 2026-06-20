# Project Conventions

## Core Principles

- Prefer maintainable code over clever code.
- Prioritize readability and explicitness.
- Avoid unnecessary abstractions.
- Keep business logic separate from presentation logic.
- Preserve existing project conventions when they are clear.
- Explain architectural decisions before making broad changes.

## TypeScript

- API response type aliases start with `T`.
- Interfaces start with `I`.
- React component props use interfaces.
- Avoid `any` unless there is a documented boundary reason.
- Prefer discriminated unions over boolean flag combinations.
- Keep domain types near the domain that owns them.
- Validate untrusted external data before using it as trusted UI state.

Example:

```ts
type TUserResponse = {
  id: string;
  name: string;
};

interface IUserProfileCardProps {
  userId: string;
}
```

## Naming

- Components use PascalCase.
- Hooks start with `use`.
- Event handlers start with `handle`.
- Boolean variables start with `is`, `has`, `can`, or `should`.
- Global constants use `UPPER_SNAKE_CASE`.
- File names should follow the local project convention. If none exists, use kebab-case for component folders and camelCase for utilities.

## React

- Use functional components.
- Prefer hooks over class components.
- Keep components focused on one responsibility.
- Extract reusable behavior into custom hooks.
- Avoid deeply nested component trees.
- Avoid mixing data fetching, transformation, and rendering in a single component.

## Framework Selection

Use Vite when:

- building SPA applications
- creating dashboards
- creating admin panels
- creating Telegram Mini Apps
- SEO is not required

Use Next.js when:

- SEO is required
- SSR or SSG is required
- metadata generation matters
- marketing pages are involved
- server components or server actions provide clear value

Always explain the framework choice before implementation.

## UI and Styling

Preferred stack:

- Tailwind CSS
- shadcn/ui
- Radix UI

Rules:

- Prefer shadcn/ui for application-level components.
- Use Radix primitives when behavior needs customization.
- Avoid introducing another UI library without a strong reason.
- Use semantic color names or design tokens when available.
- Avoid inline styles.
- Keep spacing and typography consistent.
- Include accessible labels, focus states, and keyboard behavior.

## API Integration

- Use Axios unless the project already standardizes on another client.
- Centralize Axios configuration.
- Use interceptors for auth and shared error handling.
- Keep API calls outside presentational components.
- Transform API data at the boundary layer.
- Represent loading, error, empty, and success states explicitly.
- Mirror important backend validation bounds in forms when they affect user experience, such as max money amounts, max description lengths, and max URL lengths. The backend remains authoritative, but the UI should prevent predictable rejected submissions.

## Localization

- Use JSON-based localization files when localization is required.
- Keep translations separated by locale.
- Avoid hardcoded user-facing strings in reusable components.

## Dependency Management

- Prefer stable releases.
- Avoid alpha, beta, and release-candidate versions unless explicitly requested.
- Verify compatibility between framework and library versions.
- Explain why a new dependency is introduced.
