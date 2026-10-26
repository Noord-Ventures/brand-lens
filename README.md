# Brand Lens

Eight either/or choices. One of three directions at the end — Quiet and precise, Warm and handmade, Bold and direct — that a small business owner could hand to a designer.

The whole state is the URL: `/?a=abaabaab`. No database, no auth, no AI.

## Rules

- Tally the eight answers by direction; highest wins.
- Tie: the direction chosen in the earliest tied question wins. No randomness.
- Questions: `data/questions.json`. Test cases: `data/fixtures.json`.

## Run

```
npm install
npm test        # fixtures against lib/score.ts
npm run dev
```

Built with Next.js and [Vlak](https://vlak.dev) (`@noorddev/vlak-react`).
