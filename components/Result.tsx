"use client";

import Link from "next/link";
import { Card, CardBody, CardLabel, CardTitle } from "@noorddev/vlak-react";
import { DIRECTIONS, ORDER, QUESTION_COUNT, parseAnswers, tally, type Direction } from "@/lib/score";
import { CAVEAT, buildBrief } from "@/lib/brief";
import { Specimen } from "./Specimen";
import { CopyBrief } from "./CopyBrief";

export function Result({ direction, code }: { direction: Direction; code: string }) {
  const d = DIRECTIONS[direction];
  const counts = tally(parseAnswers(code));
  const link = typeof window !== "undefined" ? `${window.location.origin}/result?a=${code}` : undefined;
  const brief = buildBrief(d, link);

  return (
    <main className="lens lens-result">
      <p className="lens-progress">Your direction</p>
      <Card>
        <CardLabel>A direction to explore—not a verdict.</CardLabel>
        <CardTitle>{d.name}</CardTitle>
        <CardBody>{d.line}</CardBody>
      </Card>

      <section className="lens-section">
        <p className="lens-character">{d.character}</p>
        <ul className="lens-tone" aria-label="Tone">
          {d.tone.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      <section className="lens-section lens-sayavoid">
        <div>
          <h2 className="lens-h">Say</h2>
          <p>{d.say}</p>
        </div>
        <div>
          <h2 className="lens-h">Avoid</h2>
          <p>{d.avoid}</p>
        </div>
      </section>

      <section className="lens-section">
        <h2 className="lens-h">Mood</h2>
        <Specimen direction={direction} />
      </section>

      <section className="lens-section">
        <CopyBrief text={brief} />
      </section>

      <ul className="lens-tally" aria-label="How your answers fell">
        {ORDER.map((k) => (
          <li key={k}>
            <span>{DIRECTIONS[k].name}</span>
            <span>
              {counts[k]} / {QUESTION_COUNT}
            </span>
          </li>
        ))}
      </ul>

      <p className="lens-caveat">{CAVEAT}</p>

      <div className="lens-actions">
        <Link className="lens-link" href={`/?a=${code.slice(0, -1)}`}>
          Change last answer
        </Link>
        <Link className="lens-link" href="/">
          Start over
        </Link>
      </div>
    </main>
  );
}
