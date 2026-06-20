# Catalog Security

## Trusted Catalog

The renderer should expose a limited catalog:

- layout components
- display components
- form controls
- safe actions
- approved charts or visualizations

## Rules

- Unknown components are rejected.
- Unknown actions are rejected.
- Payloads are schema-validated.
- Text is escaped or rendered safely.
- Component actions map to known client events.
- The agent cannot inject arbitrary JavaScript.

## Production Catalog

Production apps should map A2UI types to existing design-system components.

Document:

- component name
- allowed props
- allowed children
- allowed actions
- data binding rules

## Fallback

If validation fails:

- do not render partial unsafe UI
- log validation error
- retry generation when appropriate
- return text or data fallback
