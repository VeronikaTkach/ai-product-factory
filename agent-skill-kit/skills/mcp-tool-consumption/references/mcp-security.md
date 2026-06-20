# MCP Security

## Public Server Review

Before connecting a public MCP server, check:

- source repository
- maintainer trust
- recent activity
- dependency health
- requested permissions
- credential handling
- tool descriptions
- write capabilities
- network behavior

## Production Rules

- Do not connect unverified public MCP servers to production data.
- Do not grant broad filesystem access.
- Do not grant broad cloud project access.
- Use development or obfuscated data for exploration.
- Use read-only mode where possible.
- Require approval for writes and destructive actions.

## Credential Handling

- Never paste API keys into prompts.
- Use environment variables or secret managers.
- Scope credentials to the server's exact need.
- Rotate credentials if exposed.
- Avoid service-role credentials unless the server runs in a trusted backend boundary.

## Tool Schema Quality

Good tool schemas:

- have clear names
- have precise parameter descriptions
- avoid broad stringly-typed payloads
- distinguish read and write tools
- return structured data

Weak schemas increase hallucinated tool calls.
