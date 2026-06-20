import { getLogLevel } from "./config";

interface IToolLogFields {
  durationMs: number;
  success: boolean;
  [key: string]: unknown;
}

/**
 * Logs tool-call metadata only: tool name, timing, outcome, and small
 * numeric/id fields each tool explicitly passes in (e.g. result counts,
 * a skill id, a score). Never log raw request bodies, full tool
 * arguments, or business idea text anywhere in this server.
 */
export function logToolCall(toolName: string, fields: IToolLogFields): void {
  if (getLogLevel() === "silent") return;
  console.log(
    JSON.stringify({
      type: "tool_call",
      tool: toolName,
      timestamp: new Date().toISOString(),
      ...fields,
    }),
  );
}
