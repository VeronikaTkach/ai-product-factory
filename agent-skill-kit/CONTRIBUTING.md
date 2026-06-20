# Contributing

## Skill Design Rules

- Keep `SKILL.md` concise and trigger-focused.
- Put detailed guidance in `references/`.
- Add templates only when they are directly useful.
- Add examples that show the desired output style.
- Add `evals/trigger-cases.json` for routing checks.
- Prefer small, specific skills over broad monolithic skills.

## Review Checklist

Before merging a skill change:

- `SKILL.md` has clear positive and negative triggers.
- References are linked from `SKILL.md`.
- JSON files parse successfully.
- No secrets or project-private data are included.
- The skill does not duplicate another skill's responsibility.

## Versioning

Use semantic versioning:

- Patch: wording, examples, small corrections.
- Minor: new skill or meaningful new references.
- Major: routing or structure changes that affect consumers.
