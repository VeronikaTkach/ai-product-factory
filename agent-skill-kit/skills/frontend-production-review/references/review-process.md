# Review Process

## Scope Question

Before starting, ask:

```text
Is this a BIG or SMALL review?
```

If the user has already specified the scope, do not ask again.

## BIG Review

Use when reviewing a production feature, broad diff, app area, architecture, or release readiness.

Flow:

1. Architecture Review
2. Pause for feedback
3. Code Quality Review
4. Pause for feedback
5. Test Review
6. Pause for feedback
7. Performance Review
8. Final recommendation

Each section should identify the top 3-4 real risks.

## SMALL Review

Use when the change is narrow or the user asks for quick feedback.

Flow:

1. Architecture: one focused question or finding
2. Code Quality: one focused question or finding
3. Tests: one focused question or finding
4. Performance: one focused question or finding
5. Final recommendation

Do not pause after every section for SMALL reviews unless the user asks for coworking mode.

## Implementation Gate

Do not implement fixes during review unless the user explicitly approves the specific fix scope.
