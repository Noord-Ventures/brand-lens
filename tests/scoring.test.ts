// Reference scorer + fixtures for Brand Lens.
// Engineer: replace `score` with the import from the real module; fixtures stay.
import { describe, it, expect } from "vitest";
import questions from "../data/questions.json";

type Dir = "quiet" | "warm" | "bold";

export function score(a: string): Dir {
  if (!/^[ab]{8}$/.test(a)) throw new Error("answers must be 8 chars of a|b");
  const picks = questions.map((q, i) => q[a[i] as "a" | "b"].direction as Dir);
  const tally: Record<Dir, number> = { quiet: 0, warm: 0, bold: 0 };
  for (const d of picks) tally[d]++;
  const max = Math.max(...Object.values(tally));
  const tied = (Object.keys(tally) as Dir[]).filter((d) => tally[d] === max);
  if (tied.length === 1) return tied[0];
  // earliest question whose chosen option belongs to a tied direction
  return picks.find((d) => tied.includes(d))!;
}

const all256 = Array.from({ length: 256 }, (_, i) =>
  i.toString(2).padStart(8, "0").replace(/0/g, "a").replace(/1/g, "b"),
);

describe("question set", () => {
  it("has eight questions, each option mapped to one direction", () => {
    expect(questions).toHaveLength(8);
    for (const q of questions) {
      expect(["quiet", "warm", "bold"]).toContain(q.a.direction);
      expect(["quiet", "warm", "bold"]).toContain(q.b.direction);
      expect(q.a.direction).not.toBe(q.b.direction);
    }
  });
  it("has slot counts Quiet 6 / Warm 5 / Bold 5", () => {
    const slots: Record<string, number> = {};
    for (const q of questions) for (const o of [q.a, q.b]) slots[o.direction] = (slots[o.direction] ?? 0) + 1;
    expect(slots).toEqual({ quiet: 6, warm: 5, bold: 5 });
  });
});

describe("scoring", () => {
  const cases: [string, Dir, string][] = [
    ["abaabaab", "quiet", "Quiet 6, Bold 1, Warm 1"],
    ["aabbbaaa", "warm", "Warm 5, Quiet 3"],
    ["babaabba", "bold", "Bold 4, Warm 3, Quiet 1"],
    ["bbaaaaaa", "bold", "Bold 3 / Quiet 3 tie; Q1 chose Bold"],
    ["bbbbbbbb", "bold", "Bold 3 / Quiet 3 tie; Q1 chose Bold"],
    ["aaaaaaaa", "quiet", "Quiet 3 / Warm 3 tie; Q1 chose Quiet"],
  ];
  for (const [a, want, why] of cases) {
    it(`${a} → ${want} (${why})`, () => expect(score(a)).toBe(want));
  }
  it("is deterministic", () => {
    for (const a of all256) expect(score(a)).toBe(score(a));
  });
  it("reaches all three directions across the 256 possible answer strings", () => {
    expect(new Set(all256.map(score))).toEqual(new Set(["quiet", "warm", "bold"]));
  });
  it("rejects malformed input", () => {
    expect(() => score("abc")).toThrow();
  });
});
