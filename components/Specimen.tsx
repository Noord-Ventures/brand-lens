import type { Direction } from "@/lib/score";

/**
 * A deliberately simple live specimen: one colour block, one headline set in
 * the direction's register. Designer owns the real specimens in a follow-up.
 */
const STYLES: Record<
  Direction,
  { background: string; ink: string; accent: string; fontFamily: string; fontWeight: number; letterSpacing: string; lineHeight: number; fontSize: string }
> = {
  quiet: {
    background: "#F6F4EF",
    ink: "#1C1C21",
    accent: "#3D6B9E",
    fontFamily: "inherit",
    fontWeight: 400,
    letterSpacing: "-0.005em",
    lineHeight: 1.35,
    fontSize: "1.375rem",
  },
  warm: {
    background: "#EFE5D6",
    ink: "#2E2923",
    accent: "#2F5D3A",
    fontFamily: "Georgia, 'Iowan Old Style', 'Times New Roman', serif",
    fontWeight: 500,
    letterSpacing: "0",
    lineHeight: 1.3,
    fontSize: "1.5rem",
  },
  bold: {
    background: "#E4231B",
    ink: "#000000",
    accent: "#000000",
    fontFamily: "inherit",
    fontWeight: 800,
    letterSpacing: "-0.03em",
    lineHeight: 1.0,
    fontSize: "2.25rem",
  },
};

export function Specimen({ direction, business, headline }: { direction: Direction; business: string; headline: string }) {
  const s = STYLES[direction];
  return (
    <figure
      className="lens-specimen"
      style={{ background: s.background, color: s.ink, borderRadius: direction === "warm" ? "0.75rem" : 0 }}
      aria-label={`Mood specimen for ${direction}`}
    >
      <span className="lens-specimen-accent" style={{ background: s.accent }} aria-hidden="true" />
      <p
        className="lens-specimen-headline"
        style={{
          fontFamily: s.fontFamily,
          fontWeight: s.fontWeight,
          letterSpacing: s.letterSpacing,
          lineHeight: s.lineHeight,
          fontSize: s.fontSize,
        }}
      >
        {headline}
      </p>
      <figcaption className="lens-specimen-business">{business}</figcaption>
    </figure>
  );
}
