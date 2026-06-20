# PWA Testing

## Automated Checks

Run where available:

- production build
- typecheck
- unit/component tests
- service worker registration tests when practical
- Lighthouse PWA audit
- manifest validation

## Manual Checks

Verify in a real browser:

- install prompt or installability state
- app launches from installed icon
- app loads on refresh
- app behavior with network offline
- app behavior on slow network
- app update flow after a new build
- cache clears on logout or identity change when user data is cached

## Browser Coverage

At minimum, test the target browsers named by the project.

Common PWA targets:

- Chrome desktop
- Chrome Android
- Safari iOS
- Safari macOS when relevant

Safari/iOS support differs from Chromium. Do not assume all PWA APIs behave the same across browsers.

## Report Format

Report:

- checks run
- browsers/devices used
- offline flows verified
- installability result
- Lighthouse result if run
- checks not run and why
- residual risks
