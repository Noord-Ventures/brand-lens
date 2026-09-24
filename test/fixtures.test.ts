import { describe, expect, it } from "vitest";
import { score } from "../lib/score";
import questions from "../data/questions.json";

/**
 * Fixtures for the scoring function. Written against PM's spec of record:
 * eight forced choices, each option maps to one direction, tally wins,
 * tie-break = direction chosen in the earliest question involved in the tie.
 *
 * Direction ids: "quiet" | "warm" | "bold" (see data/questions.json).
 * If lib/score.ts returns an object, it must expose `.direction`; a bare
 * string is also accepted. Adjust `directionOf` if Engineer picks another shape.
 */
type Direction = "quiet" | "warm" | "bold";

function directionOf(result: unknown): Direction {
  if (typeof result === "string") return result as Direction;
  if (result && typeof result === "object" && "direction" in result) {
    return (result as { direction: Direction }).direction;
  }
  throw new Error(`Unrecognised score() return shape: ${JSON.stringify(result)}`);
}

/** Independent reference tally, so the fixtures are checked against the data file, not against score() itself. */
function referenceTally(answers: string): Record<Direction, number> {
  const tally: Record<Direction, number> = { quiet: 0, warm: 0, bold: 0 };
  answers.split("").forEach((ch, i) => {
    const q = questions.questions[i] as { a: { direction: Direction }; b: { direction: Direction } };
    tally[q[ch as "a" | "b"].direction] += 1;
  });
  return tally;
}

interface Fixture {
  name: string;
  answers: string;
  expected: Direction;
  why: string;
}

const clearWinners: Fixture[] = [
  {
    name: "Dutch notary",
    answers: "abbabaab",
    expected: "quiet",
    why: "Steel letters, porcelain, white box, empty church, concrete, 'never get it wrong'. Quiet 6, Warm 2.",
  },
  {
    name: "Cheese shop with regulars (Kaaswinkel Dijkstra)",
    answers: "baababba",
    expected: "warm",
    why: "Stoneware, Dille & Kamille, paper and twine, regulars' table, 'they know me'. Warm 5, Bold 3.",
  },
  {
    name: "Bike repair shop (Fietsen Van Loon)",
    answers: "bbaaabbb",
    expected: "bold",
    why: "Hand-painted sign, Swatch, cheese market, the queue, painted plywood. Bold 5, Quiet 3.",
  },
];

const ties: Fixture[] = [
  {
    name: "Quiet/Warm 4–4, earliest tied question is Q1 (Quiet)",
    answers: "aababaaa",
    expected: "quiet",
    why: "Quiet: Q1,Q4,Q5,Q7. Warm: Q2,Q3,Q6,Q8. Bold 0. Q1 was answered Quiet → Quiet.",
  },
  {
    name: "Bold/Warm 4–4, earliest tied question is Q1 (Bold)",
    answers: "baabaaba",
    expected: "bold",
    why: "Bold: Q1,Q3,Q5,Q7. Warm: Q2,Q4,Q6,Q8. Quiet 0. Q1 was answered Bold → Bold.",
  },
];

describe("data/questions.json", () => {
  it("has eight questions, each option tagged with a known direction", () => {
    expect(questions.questions).toHaveLength(8);
    for (const q of questions.questions) {
      expect(["quiet", "warm", "bold"]).toContain(q.a.direction);
      expect(["quiet", "warm", "bold"]).toContain(q.b.direction);
      expect(q.a.direction).not.toBe(q.b.direction);
    }
  });

  it("matches PM's slot counts (Quiet 6, Warm 5, Bold 5)", () => {
    const counts: Record<Direction, number> = { quiet: 0, warm: 0, bold: 0 };
    for (const q of questions.questions) {
      counts[q.a.direction as Direction] += 1;
      counts[q.b.direction as Direction] += 1;
    }
    expect(counts).toEqual(questions.slotCounts);
  });
});

describe("fixtures are internally consistent with the data file", () => {
  for (const f of clearWinners) {
    it(`${f.name}: reference tally has a unique winner = ${f.expected}`, () => {
      const t = referenceTally(f.answers);
      const max = Math.max(...Object.values(t));
      const winners = (Object.keys(t) as Direction[]).filter((d) => t[d] === max);
      expect(winners).toEqual([f.expected]);
    });
  }
  for (const f of ties) {
    it(`${f.name}: reference tally really is a tie`, () => {
      const t = referenceTally(f.answers);
      const max = Math.max(...Object.values(t));
      const winners = (Object.keys(t) as Direction[]).filter((d) => t[d] === max);
      expect(winners.length).toBeGreaterThan(1);
      expect(winners).toContain(f.expected);
    });
  }
});

describe("score(): clear winners", () => {
  for (const f of clearWinners) {
    it(`${f.name} → ${f.expected} (${f.why})`, () => {
      expect(directionOf(score(f.answers))).toBe(f.expected);
    });
  }
});

describe("score(): tie-break = earliest tied question", () => {
  for (const f of ties) {
    it(`${f.name} → ${f.expected}`, () => {
      expect(directionOf(score(f.answers))).toBe(f.expected);
    });
  }
});

describe("score(): determinism and reachability", () => {
  it("same input, same output, across repeated calls", () => {
    const a = "abbabaab";
    const first = directionOf(score(a));
    for (let i = 0; i < 20; i++) expect(directionOf(score(a))).toBe(first);
  });

  it("all three directions are reachable across the 256 possible answer strings", () => {
    const seen = new Set<Direction>();
    for (let i = 0; i < 256; i++) {
      const answers = i.toString(2).padStart(8, "0").replace(/0/g, "a").replace(/1/g, "b");
      seen.add(directionOf(score(answers)));
    }
    expect([...seen].sort()).toEqual(["bold", "quiet", "warm"]);
  });

  it("agrees with the reference tally on every non-tied answer string", () => {
    for (let i = 0; i < 256; i++) {
      const answers = i.toString(2).padStart(8, "0").replace(/0/g, "a").replace(/1/g, "b");
      const t = referenceTally(answers);
      const max = Math.max(...Object.values(t));
      const winners = (Object.keys(t) as Direction[]).filter((d) => t[d] === max);
      if (winners.length === 1) expect(directionOf(score(answers))).toBe(winners[0]);
    }
  });
});
