"use client";

import { useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@noorddev/vlak-react";
import { QUESTIONS, QUESTION_COUNT, parseAnswers, type Choice } from "@/lib/score";

/**
 * Questions live at /?a=<up to 8 chars of a/b>; the eighth answer sends you
 * to /result?a=<8 chars>. No database, no auth, no AI: the URL is the state.
 */
export function Lens() {
  const router = useRouter();
  const params = useSearchParams();
  const answers = parseAnswers(params.get("a"));
  const badLink = params.get("bad") === "1" && answers.length === 0;

  const go = useCallback(
    (next: Choice[]) => {
      const code = next.join("");
      if (next.length === QUESTION_COUNT) router.push(`/result?a=${code}`);
      else router.push(next.length ? `/?a=${code}` : "/");
    },
    [router],
  );

  const complete = answers.length === QUESTION_COUNT;
  useEffect(() => {
    if (complete) router.replace(`/result?a=${answers.join("")}`);
  }, [complete, answers, router]);
  if (complete) return null;

  const index = answers.length;
  const q = QUESTIONS[index];

  return (
    <main className="lens">
      {index === 0 && (
        <header className="lens-intro">
          <h1 className="lens-title">Find a starting point for your brand.</h1>
          {badLink && (
            <p className="lens-notice" role="status">
              That link didn&apos;t carry your answers. Eight questions, two minutes.
            </p>
          )}
        </header>
      )}
      <p className="lens-progress">
        {index + 1} of {QUESTION_COUNT}
      </p>
      <h2 className="lens-prompt">Which one is more like you?</h2>
      <div className="lens-options" role="group" aria-label={`Question ${q.n}`}>
        {(["a", "b"] as Choice[]).map((c) => (
          <button key={c} type="button" className="lens-option" onClick={() => go([...answers, c])}>
            <span className="lens-option-title">{q[c].title}</span>
            <span className="lens-option-detail">{q[c].detail}</span>
          </button>
        ))}
      </div>
      <p className="lens-helper">Pick what feels closer. There are no right answers.</p>
      {index > 0 && (
        <div className="lens-actions">
          <Button variant="subtle" size="sm" onClick={() => go(answers.slice(0, -1))}>
            Back
          </Button>
        </div>
      )}
    </main>
  );
}
