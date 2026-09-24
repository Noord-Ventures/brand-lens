import { describe, expect, it } from "vitest";
import { CAVEAT, buildBrief } from "./brief";
import { DIRECTIONS, ORDER } from "./score";

describe("buildBrief", () => {
  for (const d of ORDER) {
    it(`${d}: carries every field the result page shows`, () => {
      const p = DIRECTIONS[d];
      const text = buildBrief(p, "https://example.test/result?a=abababab");
      expect(text).toContain(p.name);
      expect(text).toContain(p.character);
      for (const t of p.tone) expect(text).toContain(t);
      expect(text).toContain(p.say);
      expect(text).toContain(p.avoid);
      expect(text).toContain(p.mood);
      expect(text).toContain(p.example.business);
      expect(text).toContain(p.example.headline);
      expect(text).toContain(CAVEAT);
      expect(text).toContain("https://example.test/result?a=abababab");
    });
  }

  it("is pure", () => {
    expect(buildBrief(DIRECTIONS.quiet)).toBe(buildBrief(DIRECTIONS.quiet));
  });

  it("never claims a validated diagnosis", () => {
    for (const d of ORDER) expect(buildBrief(DIRECTIONS[d]).toLowerCase()).not.toMatch(/validated|diagnos/);
  });
});
