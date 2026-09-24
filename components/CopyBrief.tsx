"use client";

import { useState } from "react";
import { Button } from "@noorddev/vlak-react";

export function CopyBrief({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "copied" | "manual">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("manual");
    }
  }

  return (
    <div className="lens-copy">
      <Button onClick={copy}>Copy my designer brief</Button>
      {state === "copied" && (
        <p className="lens-confirm" role="status">
          Brief copied. Make it yours with your designer.
        </p>
      )}
      {state === "manual" && (
        <textarea
          className="lens-brief"
          readOnly
          rows={14}
          value={text}
          aria-label="Your designer brief — select and copy"
          onFocus={(e) => e.currentTarget.select()}
        />
      )}
    </div>
  );
}
