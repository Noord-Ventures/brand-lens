import type { DirectionProfile } from "./score";

export const CAVEAT =
  "Built on one designer's reading of eight choices. It won't tell you what your business values — that conversation is still yours to have.";

/**
 * Plain-text brief a shop owner can paste to a designer.
 * Pure: same profile + link in, same text out.
 */
export function buildBrief(d: DirectionProfile, link?: string): string {
  const lines = [
    `Brand direction: ${d.name}`,
    "",
    d.character,
    "",
    `Tone: ${d.tone.join(", ")}`,
    `Say: ${d.say}`,
    `Avoid: ${d.avoid}`,
    "",
    `Mood: ${d.mood}`,
    "",
    `Worked example — ${d.example.business}: “${d.example.headline}”`,
    "",
    CAVEAT,
  ];
  if (link) lines.push("", `Result: ${link}`);
  return lines.join("\n");
}
