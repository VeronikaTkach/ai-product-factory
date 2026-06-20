# Prisma Review

## Query Safety

- Avoid N+1 queries.
- Select only needed fields.
- Do not return raw records with sensitive fields.
- Use pagination for list endpoints.
- Use transactions for atomic multi-step writes.

## Data Integrity

- Check required relations.
- Check uniqueness expectations.
- Check race conditions around create/update flows.
- Check status transitions.

## Raw SQL

- Avoid raw SQL unless justified.
- Parameterize raw queries.
- Do not interpolate user input.

## Error Behavior

- Map not-found results to clear errors.
- Avoid leaking database errors to clients.
- Consider unique constraint conflict behavior.
