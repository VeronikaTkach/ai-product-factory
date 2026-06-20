import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { listSkills } from "@ai-product-factory/skill-tools";
import {
  getAllowedHosts,
  getHost,
  getPort,
  getRateLimitPerMinute,
  getServerName,
} from "./config";
import { createRateLimiter } from "./rate-limit";
import { registerGetSkillTool } from "./tools/get-skill";
import { registerListSkillsTool } from "./tools/list-skills";
import { registerRecommendSkillsTool } from "./tools/recommend-skills";
import { registerScoreReadinessTool } from "./tools/score-readiness";

/**
 * Public, read-only MCP server over the bundled agent-skill-kit/skills.
 *
 * Stateless by design: a fresh McpServer + StreamableHTTPServerTransport
 * is created per POST /mcp request (no session map, no cross-request
 * state), since every tool here is a pure read over local files. See
 * docs/architecture.md for the full security model.
 */
function buildServer(): McpServer {
  const server = new McpServer({ name: getServerName(), version: "0.1.0" });
  registerListSkillsTool(server);
  registerGetSkillTool(server);
  registerRecommendSkillsTool(server);
  registerScoreReadinessTool(server);
  return server;
}

const host = getHost();
const app = createMcpExpressApp({ host, allowedHosts: getAllowedHosts() });

const rateLimit = createRateLimiter(getRateLimitPerMinute());
app.use("/mcp", rateLimit);

app.post("/mcp", async (req, res) => {
  const server = buildServer();
  try {
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
    res.on("close", () => {
      transport.close();
      server.close();
    });
  } catch (error) {
    console.error("Error handling MCP request", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal server error" },
        id: null,
      });
    }
  }
});

app.get("/mcp", (_req, res) => {
  res.status(405).set("Allow", "POST").json({
    jsonrpc: "2.0",
    error: { code: -32000, message: "Method not allowed." },
    id: null,
  });
});

app.delete("/mcp", (_req, res) => {
  res.status(405).set("Allow", "POST").json({
    jsonrpc: "2.0",
    error: { code: -32000, message: "Method not allowed." },
    id: null,
  });
});

app.get("/health", async (_req, res) => {
  try {
    const skills = await listSkills();
    res.json({ status: "ok", server: getServerName(), skillCount: skills.length });
  } catch (error) {
    res.status(503).json({
      status: "error",
      message: error instanceof Error ? error.message : "unknown error",
    });
  }
});

const port = getPort();
app.listen(port, host, () => {
  console.log(`MCP Skill Server listening on ${host}:${port} (POST /mcp, GET /health)`);
});

process.on("SIGTERM", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));
