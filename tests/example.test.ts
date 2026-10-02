import { describe, expect, it } from "vitest";

describe("CI tests", () => {
  it("debería funcionar Vitest", () => {
    expect(2 + 2).toBe(4);
  });
});
