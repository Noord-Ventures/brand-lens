import type { DirectionProfile } from "./score";

export const CAVEAT =
  "Built on one designer's reading of eight choices. It won't tell you what your business values — that conversation is still yours to have.";

/** Worked examples are written for this tool, not taken from the businesses named. */
export const EXAMPLE_NOTE = "Illustrative copy — not verified business claims.";

/**
 * Plain-text brief a shop owner can paste to a designer.
 * Pure: same profile + link in, same text out.
 *
 * "Try" / "Use sparingly" rather than "Say" / "Avoid": these are suggestions
 * from eight taste questions, not rules (Culturebot's copy review, 24 Sept).
 */
export function buildBrief(d: DirectionProfile, link?: string): string {
  const lines = [
    `Brand direction: ${d.name}`,
    "",
    d.character,
    "",
    `Tone: ${d.tone.join(", ")}`,
    `Try: ${d.say}`,
    `Use sparingly: ${d.avoid}`,
    "",
    `Mood: ${d.mood}`,
    "",
    `Worked example — ${d.example.business}: “${d.example.headline}”`,
    EXAMPLE_NOTE,
    "",
    CAVEAT,
  ];
  if (link) lines.push("", `Result: ${link}`);
  return lines.join("\n");
}
