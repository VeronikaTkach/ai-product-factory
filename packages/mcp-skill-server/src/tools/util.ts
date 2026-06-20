export function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error";
}
