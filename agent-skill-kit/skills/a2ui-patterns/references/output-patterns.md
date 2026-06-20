# Output Patterns

## Text Only

Use when:

- answer is simple
- no interaction is needed

## Data Only

Use when:

- API consumer is another system
- UI is not needed
- client already owns rendering

## LLM-Generated UI

Use when:

- intent varies
- layout should adapt
- exploration matters

Risks:

- schema errors
- inconsistent layout
- token cost

## Tool-Template UI

Use when:

- layout is deterministic
- inputs map to a known structure
- predictable output matters

## Hybrid Output

Use for flexible consumers:

```json
{
  "data": {},
  "ui": {},
  "ui_available": true
}
```

API clients use `data`.

Human-facing clients render `ui`.
