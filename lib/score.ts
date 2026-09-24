import questionsJson from "@/data/questions.json";

export type Direction = "quiet" | "warm" | "bold";
export type Choice = "a" | "b";

export interface Option {
  title: string;
  detail: string;
  direction: Direction;
}

export interface Question {
  n: number;
  a: Option;
  b: Option;
}

export const QUESTIONS: Question[] = questionsJson as Question[];
export const QUESTION_COUNT = QUESTIONS.length;

export const DIRECTIONS: Record<Direction, { name: string; line: string }> = {
  quiet: { name: "Quiet and precise", line: "Say less, get it exactly right." },
  warm: { name: "Warm and handmade", line: "Made by people, for people you know by name." },
  bold: { name: "Bold and direct", line: "One colour, one message, no apology." },
};

const ORDER: Direction[] = ["quiet", "warm", "bold"];

/** Keep only leading valid a/b characters, at most QUESTION_COUNT. */
export function parseAnswers(raw: string | null | undefined): Choice[] {
  if (!raw) return [];
  const out: Choice[] = [];
  for (const ch of raw.toLowerCase()) {
    if (ch !== "a" && ch !== "b") break;
    out.push(ch);
    if (out.length === QUESTION_COUNT) break;
  }
  return out;
}

export function tally(answers: Choice[]): Record<Direction, number> {
  const counts: Record<Direction, number> = { quiet: 0, warm: 0, bold: 0 };
  answers.forEach((choice, i) => {
    const q = QUESTIONS[i];
    if (q) counts[q[choice].direction] += 1;
  });
  return counts;
}

/**
 * Highest tally wins. On a tie, the direction chosen in the earliest question
 * that involves a tied direction wins. Deterministic; no randomness.
 * Returns null until all questions are answered.
 */
export function score(answers: Choice[]): Direction | null {
  if (answers.length < QUESTION_COUNT) return null;
  const counts = tally(answers);
  const max = Math.max(...ORDER.map((d) => counts[d]));
  const tied = ORDER.filter((d) => counts[d] === max);
  if (tied.length === 1) return tied[0];
  for (let i = 0; i < QUESTIONS.length; i++) {
    const chosen = QUESTIONS[i][answers[i]].direction;
    if (tied.includes(chosen)) return chosen;
  }
  return tied[0];
}
