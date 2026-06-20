# PWA Checklist

## Manifest

Check:

- `name`
- `short_name`
- `description` when useful
- `start_url`
- `scope`
- `display`
- `theme_color`
- `background_color`
- icons with appropriate sizes and maskable support where needed

Rules:

- `start_url` and `scope` must match the deployed app path.
- Icons should be real app icons, not default placeholders.
- Avoid overbroad scope that captures unrelated routes.

## Installability

A PWA should be served from HTTPS, except localhost development.

Check:

- valid manifest
- service worker registered and controlling the app
- icons load successfully
- app works when launched from installed mode
- navigation stays within expected scope

## App Shell

The app shell should load reliably and show useful states:

- loading
- offline
- stale data
- update available
- unsupported browser or feature fallback

## Data Sensitivity

Classify cached data:

- public static assets
- public API data
- user-specific non-sensitive data
- user-specific sensitive data
- secrets or tokens

Secrets and tokens should not be cached. Sensitive user data needs explicit approval and a clear storage policy.
