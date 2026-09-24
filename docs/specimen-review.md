# Specimen review

One Specimen keyed quiet/warm/bold imports data/directions.json directly. Vlak Card/CardLabel/CardBody frame a scoped CSS module. Wired into /result; no scoring changes.

## Checks — 24 September 2026

- npm test: 22/22 passed.
- npm run build: successful Next.js production build including /result.
- Playwright Chromium against local production server: /result?a=abaabaab (quiet), aabbbaaa (warm), babaabba (bold), at 375px and 1280px. No horizontal document overflow; headlines fit.
- Six grayscale PNGs captured using html { filter: grayscale(1) } and visually read by the coding review agent: all three distinguishable, no clipping. Reviewer mislabeled Quiet as serif in prose; computed style confirms Arial/Helvetica sans-serif, 400. Correction recorded here.
- Grayscale cues: Quiet regular sans/fine rule; Warm Georgia serif/inset frame/italic caption; Bold 900-weight uppercase/8px rule. No type revision needed after review.
- Computed headline sizes: mobile 28/30/32px, desktop 36/38/44px. Weights 400/400/900. System-font fallbacks vary by platform.

Local screenshots and metrics: /tmp/brand-lens-specimen-review. Full-sheet A4 one-page printing is outside this component change; component print styles retain ink and typography without backgrounds.

## Integration

Local branch began at main then fast-forwarded to scaffold 9634606 for the existing result route; remote design/specimens starts at the same scaffold commit. PR against main depends on scaffold PR #1. Design delta is components/Specimen.tsx, components/Specimen.module.css, components/Result.tsx and this note. Non-blocking for initial deployment.
