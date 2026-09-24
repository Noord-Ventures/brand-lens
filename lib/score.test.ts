import { describe, expect, it } from "vitest";
import fixtures from "@/data/fixtures.json";
import { parseAnswers, score, tally, QUESTION_COUNT, type Direction } from "./score";

describe("score", () => {
  for (const c of fixtures.cases) {
    it(`${c.a} → ${c.expect} (${c.why})`, () => {
      expect(score(parseAnswers(c.a))).toBe(c.expect as Direction);
    });
  }

  it("returns null until all questions are answered", () => {
    expect(score(parseAnswers("abab"))).toBeNull();
    expect(score([])).toBeNull();
  });

  it("tallies eight answers to eight", () => {
    const t = tally(parseAnswers("abababab"));
    expect(t.quiet + t.warm + t.bold).toBe(QUESTION_COUNT);
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
