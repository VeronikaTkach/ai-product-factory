# Course Concepts Map

How AI Product Factory demonstrates the course concepts, and where to find each one in the repository or running demo.

| Course concept | Where it is demonstrated | Status |
|---|---|---|
| Multi-agent system | Typed `IAgent` modules (`apps/web/src/server/agents/`) chained by a server-side orchestrator behind `POST /api/blueprint` | Orchestrator wired (Phase 3, demo-mode output); real LLM calls in a later phase |
| Agent skills | `agent-skill-kit/skills/` used by this project per `AGENTS.project.md` skill routing; selected skills are now surfaced to the end user via `SelectedSkillsPanel` | In place |
| MCP Server / Tool Integration | Public MCP server (`packages/mcp-skill-server`, Streamable HTTP transport via `@modelcontextprotocol/sdk`) exposing `list_skills`, `get_skill`, `recommend_skills`, `score_readiness` over the shared `packages/skill-tools` read-only layer | Phase 4A (local tool layer) and Phase 4B (public MCP server) both done; verified end-to-end with a real MCP client; deployment to Render Free still pending (Phase 6) |
| Security | Security agent (`apps/web/src/server/agents/security.ts`) detects signals (data sensitivity flags + keyword matches via `security-signals.ts`) and builds tailored Data Classification, full 6-category STRIDE coverage, Security Risks, Approval-Required Actions, and Recommendations sections — content varies per idea, not a fixed template | Phase 5 done (deterministic, rule-based; no LLM call) |
| Human-in-the-loop | Product Spec approval step blocks Architecture/Security/Roadmap generation until the user approves; enforced by the orchestrator's two-stage API contract (`spec` vs. `blueprint`) | Implemented in UI (Phase 2) and orchestrator (Phase 3) |
| Specification-driven development | Product Spec → Architecture → Roadmap flow; `spec-driven-development` skill used for planning this repo's features | In place |
| Deployability | Vercel-first deployment plan, optional Render Free MCP server, public GitHub repo; monorepo is deployment-ready (root `README.md`, `next.config.mjs` file-tracing fix, verified build/start commands from repo root) | Phase 6A done — deployment-ready and verified locally; not yet actually deployed (no live URLs yet) |
| Evaluation | Evaluation agent (`apps/web/src/server/agents/evaluation.ts`) reuses `packages/skill-tools`' `scoreReadiness` (the same heuristic the public MCP server's `score_readiness` tool exposes) to compute real component scores and a final score, plus a derived interpretation naming the weakest component | Phase 5 done (deterministic heuristic, shared with MCP server; not a live evaluation model) |

## Notes

- "Demo mode" outputs are deterministic and committed as the canonical example in `examples/generated-blueprint/`.
- Phases are tracked in `AI_Product_Factory_PROJECT_PLAN.md` §15 and `AGENTS.project.md`.
