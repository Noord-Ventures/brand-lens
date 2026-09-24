"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, Card, CardBody, CardLabel, CardTitle } from "@noorddev/vlak-react";
import {
  DIRECTIONS,
  QUESTIONS,
  QUESTION_COUNT,
  parseAnswers,
  score,
  tally,
  type Choice,
} from "@/lib/score";

/**
 * The whole state of the app is ?a=<up to 8 chars of a/b>.
 * No database, no auth, no AI: the URL is the result.
 */
export function Lens() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const answers = parseAnswers(params.get("a"));

  const setAnswers = useCallback(
    (next: Choice[], replace = false) => {
      const href = next.length ? `${pathname}?a=${next.join("")}` : pathname;
      if (replace) router.replace(href);
      else router.push(href);
    },
    [pathname, router],
  );

  const result = score(answers);

  if (result) {
    const counts = tally(answers);
    const d = DIRECTIONS[result];
    return (
      <main className="lens">
        <p className="lens-progress">Your direction</p>
        <Card>
          <CardLabel>Brand Lens</CardLabel>
          <CardTitle>{d.name}</CardTitle>
          <CardBody>{d.line}</CardBody>
        </Card>
        <ul className="lens-tally" aria-label="How your answers fell">
          {(Object.keys(DIRECTIONS) as Array<keyof typeof DIRECTIONS>).map((k) => (
            <li key={k}>
              <span>{DIRECTIONS[k].name}</span>
              <span>{counts[k]} / {QUESTION_COUNT}</span>
            </li>
          ))}
        </ul>
        <div className="lens-actions">
          <Button variant="ghost" onClick={() => setAnswers(answers.slice(0, -1))}>
            Change last answer
          </Button>
          <Button variant="subtle" onClick={() => setAnswers([])}>
            Start over
          </Button>
        </div>
      </main>
    );
  }

  const index = answers.length;
  const q = QUESTIONS[index];

  return (
    <main className="lens">
      <p className="lens-progress">
        {index + 1} of {QUESTION_COUNT}
      </p>
      <h1 className="lens-prompt">Which one is more like you?</h1>
      <div className="lens-options" role="group" aria-label={`Question ${q.n}`}>
        {(["a", "b"] as Choice[]).map((c) => (
          <button
            key={c}
            type="button"
            className="lens-option"
            onClick={() => setAnswers([...answers, c])}
          >
            <span className="lens-option-title">{q[c].title}</span>
            <span className="lens-option-detail">{q[c].detail}</span>
          </button>
        ))}
      </div>
      {index > 0 && (
        <div className="lens-actions">
          <Button variant="subtle" size="sm" onClick={() => setAnswers(answers.slice(0, -1))}>
            Back
          </Button>
        </div>
      )}
    </main>
  );
}
