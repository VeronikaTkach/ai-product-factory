# MCP Debugging

## When Tool Calls Fail

Check transport and schema before rewriting prompts.

Debug:

- active tool list
- tool descriptions
- required parameters
- raw request payload
- raw response payload
- server logs
- authentication errors
- network failures

## MCP Inspector Workflow

Use an inspector or equivalent debug surface to:

- list tools
- inspect schemas
- call tools manually
- validate parameters
- inspect JSON-RPC messages
- reproduce failures outside the main agent

## Common Failure Modes

- hallucinated parameter names
- wrong enum values
- missing required fields
- ambiguous tool descriptions
- too many tools loaded at once
- expired credentials
- remote server unavailable
- write tool used when read tool was intended

## Fix Order

1. Fix tool schema if unclear.
2. Reduce loaded tools if attention dilution occurs.
3. Add examples if parameters are hard.
4. Add policy gates for risky tools.
5. Adjust prompts last.
