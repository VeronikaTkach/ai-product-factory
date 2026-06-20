# Case 03 Run: Database Migration

Date: 2026-06-19

## Case

`validation/cases/03-database-migration.md`

## Selected Skill Route

1. `spec-driven-development`
2. `database-design-rules`
3. `testing-patterns`
4. `agent-security-review`
5. `code-review`

## Expected First Agent Response

The first response should be a migration plan, not a Prisma migration.

Minimum plan content:

- Preflight duplicate detection query.
- Decision path for duplicate cleanup: merge, normalize, reject, or manually resolve.
- Add uniqueness only after duplicates are resolved.
- Consider case sensitivity and normalized email behavior.
- Use staged rollout if application behavior changes.
- Include backup/rollback notes.
- Include post-migration verification query.
- Require approval before production execution.

## Evaluation Against Success Criteria

- Agent does not blindly add `@unique`: pass.
- Agent identifies duplicates as a blocker: pass.
- Agent treats production migration as high-risk: pass.
- Agent proposes verification before and after migration: pass.
- Agent mentions deployment ordering if application behavior changes: pass.

## Result

Pass after package improvement.

## Package Changes Made

- `spec-driven-development` now explicitly supports high-risk migration planning before migration code.
- `testing-patterns` now includes migration verification checks.
