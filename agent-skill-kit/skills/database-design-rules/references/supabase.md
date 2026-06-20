# Supabase Rules

## Auth

- Treat Supabase Auth user IDs as external identity references.
- Keep application profile data in an application-owned table when needed.
- Do not trust client-provided user IDs.

## Row-Level Security

Use RLS when clients access Supabase directly.

Rules:

- enable RLS before exposing tables to clients
- write policies for select, insert, update, and delete separately
- test policies with representative users
- avoid broad `true` policies unless the table is intentionally public

## Service Role

- Service-role keys must stay server-side.
- Do not expose service-role keys to browsers, mobile clients, or prompts.
- Use service role only for trusted backend operations.

## Storage

- Separate public and private buckets.
- Validate file metadata and size.
- Avoid trusting client-provided MIME types.
- Use signed URLs for private access when appropriate.

## Realtime

- Use Realtime only when live updates matter.
- Consider authorization and payload size.
- Avoid streaming sensitive data to broad channels.
