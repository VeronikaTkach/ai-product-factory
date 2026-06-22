# Review Sections

## Architecture Review

Evaluate:

- system design and component boundaries
- dependency graph and coupling risk
- data flow and bottlenecks
- scaling characteristics and single points of failure
- security boundaries such as authorization, data access, and API limits

## Code Quality Review

Evaluate:

- project structure and module organization
- DRY violations
- error handling patterns
- missing edge cases
- technical debt
- over-engineered or fragile code

## Test Review

Evaluate:

- unit, integration, and e2e coverage
- assertion quality
- missing edge cases
- failure scenarios not tested
- whether tests protect behavior rather than implementation details

## Performance Review

Evaluate:

- N+1 requests or inefficient I/O
- memory consumption risks
- CPU hotspots and heavy code paths
- caching opportunities
- latency and scaling problems
