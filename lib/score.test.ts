import { describe, expect, it } from "vitest";
import fixtures from "@/data/fixtures.json";
import {
  DIRECTIONS,
  ORDER,
  QUESTIONS,
  QUESTION_COUNT,
  isComplete,
  parseAnswers,
  score,
  tally,
  type Direction,
} from "./score";

const all256 = Array.from({ length: 256 }, (_, i) =>
  i.toString(2).padStart(8, "0").replace(/0/g, "a").replace(/1/g, "b"),
);

describe("question set", () => {
  it("has eight questions, each option mapped to a distinct direction", () => {
    expect(QUESTIONS).toHaveLength(8);
    for (const q of QUESTIONS) {
      expect(ORDER).toContain(q.a.direction);
      expect(ORDER).toContain(q.b.direction);
      expect(q.a.direction).not.toBe(q.b.direction);
    }
  });

  it("has slot counts Quiet 6 / Warm 5 / Bold 5", () => {
    const slots: Record<string, number> = {};
    for (const q of QUESTIONS) for (const o of [q.a, q.b]) slots[o.direction] = (slots[o.direction] ?? 0) + 1;
    expect(slots).toEqual({ quiet: 6, warm: 5, bold: 5 });
  });

  it("has a full profile for every direction", () => {
    for (const d of ORDER) {
      const p = DIRECTIONS[d];
      expect(p.name).toBeTruthy();
      expect(p.line).toBeTruthy();
      expect(p.character).toBeTruthy();
      expect(p.tone.length).toBeGreaterThan(0);
      expect(p.say).toBeTruthy();
      expect(p.avoid).toBeTruthy();
      expect(p.mood).toBeTruthy();
      expect(p.example.business).toBeTruthy();
      expect(p.example.headline).toBeTruthy();
    }
  });
});

describe("score", () => {
  for (const c of fixtures.cases) {
    it(`${c.a} → ${c.expect} (${c.why})`, () => {
      expect(score(parseAnswers(c.a))).toBe(c.expect as Direction);
    });
  }

  it("tie-break is not simply 'read Q1'", () => {
    expect(score(parseAnswers("baabbaab"))).not.toBe("bold");
  });

  it("returns null until all questions are answered", () => {
    expect(score(parseAnswers("abab"))).toBeNull();
    expect(score([])).toBeNull();
  });

  it("tallies eight answers to eight", () => {
    const t = tally(parseAnswers("abababab"));
    expect(t.quiet + t.warm + t.bold).toBe(QUESTION_COUNT);
  });

  it("is deterministic over all 256 codes", () => {
    for (const a of all256) expect(score(parseAnswers(a))).toBe(score(parseAnswers(a)));
  });

  it("reaches all three directions across the 256 codes", () => {
    expect(new Set(all256.map((a) => score(parseAnswers(a))))).toEqual(new Set(ORDER));
  });
});

describe("parseAnswers / isComplete", () => {
  it("drops anything after the first invalid character and caps at eight", () => {
    expect(parseAnswers("abx")).toEqual(["a", "b"]);
    expect(parseAnswers("aaaaaaaaaa")).toHaveLength(QUESTION_COUNT);
    expect(parseAnswers("AB")).toEqual(["a", "b"]);
    expect(parseAnswers(null)).toEqual([]);
  });

  it("isComplete accepts exactly eight a|b and nothing else", () => {
    expect(isComplete("abababab")).toBe(true);
    expect(isComplete("ABABABAB")).toBe(true);
    expect(isComplete("abababa")).toBe(false);
    expect(isComplete("ababababa")).toBe(false);
    expect(isComplete("abababac")).toBe(false);
    expect(isComplete("")).toBe(false);
    expect(isComplete(null)).toBe(false);
  });
});
