/**
 * DEMO_MODE is the only generation path implemented so far (Phase 3).
 * Live LLM calls are a later phase; isDemoMode() being false today is a
 * deliberate "not implemented yet" signal, not a silent fallback.
 */
export function isDemoMode(): boolean {
  return process.env.DEMO_MODE !== "false";
}
