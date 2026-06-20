# Query Performance

## Indexing Principles

- Index known query patterns.
- Index foreign keys used in joins.
- Consider composite indexes for common multi-column filters.
- Put the most selective or equality-filtered columns first in composite indexes when appropriate.
- Avoid unused indexes because they slow writes.

## Pagination

Use pagination for list endpoints.

Prefer cursor pagination when:

- result sets are large
- ordering is stable
- users scroll through data

Offset pagination is acceptable for:

- small admin tables
- simple internal tools
- low-volume lists

## Query Shape

- Select only needed fields.
- Avoid N+1 query patterns.
- Avoid returning large JSON blobs by default.
- Keep text search and vector search concerns explicit.
- Use transactions for consistency, not for long-running reads.

## Review Questions

- What are the top read paths?
- What are the top write paths?
- Which queries must be fast?
- Which queries can be eventually consistent?
- Which filters and sorts are user-facing?
- What is the expected data volume?
