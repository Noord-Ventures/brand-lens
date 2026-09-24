import type { Direction } from "@/lib/score";
import { EXAMPLE_NOTE } from "@/lib/brief";
import directions from "@/data/directions.json";
import { Card, CardBody, CardLabel } from "@noorddev/vlak-react";
import styles from "./Specimen.module.css";

/** Copy stays in directions.json; only the visual recipes live in CSS. */
export function Specimen({ direction }: { direction: Direction }) {
  const d = directions.find((entry) => entry.id === direction)!;
  return (
    <Card>
      <CardLabel>{EXAMPLE_NOTE}</CardLabel>
      <figure className={`${styles.specimen} ${styles[direction]}`} data-specimen={direction} aria-label={`${d.name} specimen`}>
        <p className={styles.headline}>{d.example.headline}</p>
        <figcaption className={styles.business}>{d.example.business}</figcaption>
      </figure>
      <CardBody>{d.mood}</CardBody>
      <CardBody><span className={styles.toneLabel}>Tone: </span>{d.tone.join(" · ")}</CardBody>
    </Card>
  );
}
