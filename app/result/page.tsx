import { redirect } from "next/navigation";
import { Result } from "@/components/Result";
import { isComplete, parseAnswers, score } from "@/lib/score";

type Params = { a?: string | string[] };

/**
 * /result?a=xxxxxxxx — re-derived from the URL alone. Anything that is not
 * exactly eight a|b characters goes back to the questions with one line.
 */
export default async function ResultPage({ searchParams }: { searchParams: Promise<Params> }) {
  const { a } = await searchParams;
  const raw = typeof a === "string" ? a.toLowerCase() : "";
  if (!isComplete(raw)) redirect("/?bad=1");
  const direction = score(parseAnswers(raw));
  if (!direction) redirect("/?bad=1");
  return <Result direction={direction} code={raw} />;
}
