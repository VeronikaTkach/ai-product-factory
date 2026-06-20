import { describe, expect, it } from "vitest";

import { functionUnderTest } from "./function-under-test";

describe("functionUnderTest", () => {
  it("returns the expected result for the primary case", () => {
    expect(functionUnderTest("input")).toBe("expected");
  });

  it("handles the edge case", () => {
    expect(functionUnderTest("")).toBe("fallback");
  });
});
