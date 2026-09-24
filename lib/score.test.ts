import { describe, expect, it } from "vitest";
import fixtures from "@/data/fixtures.json";
import { parseAnswers, score, tally, QUESTION_COUNT, type Direction } from "./score";

describe("score", () => {
  for (const c of fixtures.cases) {
    it(`${c.a} → ${c.expect} (${c.why})`, () => {
      expect(score(parseAnswers(c.a))).toBe(c.expect as Direction);
    });
  }

  it("tie-break reads the earliest question whose choice is one of the tied directions, not Q1", () => {
    // Q1 = Bold (not tied). Warm 3 / Quiet 3 tie. Q2 chose Warm.
    const result = score(parseAnswers("baabbaab"));
    expect(result).toBe("warm");
    expect(result).not.toBe("bold");
  });

  it("returns null until all questions are answered", () => {
    expect(score(parseAnswers("abab"))).toBeNull();
    expect(score([])).toBeNull();
  });

  it("tallies eight answers to eight", () => {
    const t = tally(parseAnswers("abababab"));
    expect(t.quiet + t.warm + t.bold).toBe(QUESTION_COUNT);
  });

  it("is deterministic and never null over all 256 codes", () => {
    const seen = new Set<Direction>();
    for (let i = 0; i < 2 ** QUESTION_COUNT; i++) {
      const code = i.toString(2).padStart(QUESTION_COUNT, "0").replace(/0/g, "a").replace(/1/g, "b");
      const first = score(parseAnswers(code));
      const second = score(parseAnswers(code));
      expect(first).not.toBeNull();
      expect(second).toBe(first);
      seen.add(first as Direction);
    }
    expect([...seen].sort()).toEqual(["bold", "quiet", "warm"]);
  });
});

describe("parseAnswers", () => {
  it("drops anything after the first invalid character and caps at eight", () => {
    expect(parseAnswers("abx")).toEqual(["a", "b"]);
    expect(parseAnswers("aaaaaaaaaa")).toHaveLength(QUESTION_COUNT);
    expect(parseAnswers("AB")).toEqual(["a", "b"]);
    expect(parseAnswers(null)).toEqual([]);
  });
});
