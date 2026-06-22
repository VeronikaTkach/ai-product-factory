# Proxy Rules

## Directory Pattern

Common shape:

```text
src/app/api/
  push/
    send/route.ts
    subscribe/route.ts
  auth/
    create_user/route.ts
    session/route.ts
    end_session/route.ts
    confirm_email/route.ts
    recover/route.ts
    recover_confirm/route.ts
```

Route names can hide backend paths:

- `create_user` can proxy backend `register`
- `session` can proxy backend `login`
- `end_session` can proxy backend `logout`
- `confirm_email` can proxy backend `verify-email`
- `recover` can proxy backend `password-reset`
- `recover_confirm` can proxy backend `password-reset-confirm`

## Client Rule

Client components and browser code call local Next.js routes only:

```text
/api/auth/create_user
/api/auth/session
/api/push/subscribe
```

They do not call the backend `API_URL` directly.

## Server Rule

`API_URL` is used only in server-side route handlers or server-only modules.

Do not expose it through:

- client env vars
- browser bundles
- frontend API clients
- generated public config

## Proxy Behavior

Route handlers should:

- parse and validate the incoming request
- call the real backend endpoint
- forward required cookies or auth headers intentionally
- return the backend status code when appropriate
- map backend errors to safe client responses
- avoid returning internal backend stack traces or private metadata

## Review Checklist

- Is the project actually Next.js App Router?
- Are all client API calls routed through `src/app/api/**/route.ts`?
- Is `API_URL` absent from client code?
- Are backend route names hidden where required?
- Are auth/session cookies handled deliberately?
- Are error statuses preserved without leaking internals?
