# Case File Format

Expected file:

```text
.claude/test-cases.json
```

Common shape:

```json
{
  "baseUrl": "http://localhost:3000",
  "cases": [
    {
      "id": "login_success",
      "path": "/login",
      "actions": [],
      "expect": {
        "urlIncludes": "/dashboard"
      }
    }
  ]
}
```

## Execution Rules

- Read `baseUrl`.
- Find the case by `id`.
- If `path` exists, use `baseUrl + path`.
- If `path` is absent, use `baseUrl`.
- Pass the case `actions` to the browser/debug tool.
- Compare the returned `finalUrl` with `expect.urlIncludes` when present.

## Result Analysis

Check:

- `consoleErrors`
- `pageErrors`
- `failedRequests`
- `finalUrl`
- expected URL match

Any non-empty error list or failed URL expectation should be reported clearly.
