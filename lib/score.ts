import questionsJson from "@/data/questions.json";
import directionsJson from "@/data/directions.json";
import resultsJson from "@/data/results.json";

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

export interface DirectionProfile {
  id: Direction;
  name: string;
  /** Culturebot's one-line result voice (data/results.json). */
  line: string;
  character: string;
  tone: string[];
  say: string;
  avoid: string;
  mood: string;
  example: { business: string; headline: string };
}

export const QUESTIONS: Question[] = questionsJson as Question[];
export const QUESTION_COUNT = QUESTIONS.length;
export const ORDER: Direction[] = ["quiet", "warm", "bold"];

const voice = resultsJson as Record<Direction, { name: string; line: string }>;

export const DIRECTIONS: Record<Direction, DirectionProfile> = Object.fromEntries(
  (directionsJson as Omit<DirectionProfile, "line">[]).map((d) => [
    d.id,
    { ...d, line: voice[d.id]?.line ?? "" },
  ]),
) as Record<Direction, DirectionProfile>;

const COMPLETE = new RegExp(`^[ab]{${QUESTION_COUNT}}$`);

/** True only for exactly QUESTION_COUNT characters of a|b (case-insensitive). */
export function isComplete(raw: string | null | undefined): raw is string {
  return typeof raw === "string" && COMPLETE.test(raw.toLowerCase());
}

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
 * whose chosen direction is one of the tied directions wins. Deterministic;
 * no randomness. Returns null until all questions are answered.
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
