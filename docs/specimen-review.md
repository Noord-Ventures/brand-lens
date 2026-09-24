# Brand Lens: sentence case and structural grid correction

Requested by Renato: remove all-caps; align composition to the background grid.

## Implementation
- Section headings and Bold specimen no longer use uppercase transforms. Bold retains 900 weight, 32–44px scale and its heavy rule. Quiet sans and Warm serif remain unchanged.
- Uses Vlak's existing `html::before` grid, not a second overlay. Layout aliases the actual `--grid-size`, `--pad` and `--gutter` tokens.
- Up to 480px: native 25px outer gutters, fluid content width.
- 481–835px: two-module frame, 388px wide, at x=20px.
- From 836px: four-module frame, 796px wide; two 388px columns separated by the native 20px gutter.
- From 1244px: frame moves one full module inward to x=224px. No arbitrary centering between grid lines.
- Headings, Card edges, specimen edges and result columns share native grid anchors. Local `.rs-card` overrides remove Vlak's default padding and 360px maximum width. Specimens retain internal padding as their own typographic compositions.
- Integrated scaffold 3415e02 copy corrections; removed duplicate mood/example-label rendering in Result. The shared EXAMPLE_NOTE labels both specimen and exported brief. Scoring unchanged.

## Executed checks
- `npm test`: 24 tests pass (17 scoring + 7 brief).
- `npm run typecheck`: passes.
- `npx playwright test --reporter=list --workers=2`: 28 browser cases pass, no skips. Config builds and starts a fresh production server.
- Chromium: questions + actual Quiet (`abaabaab`), Warm (`baabbaab`), Bold (`bbbbbbbb`) result pages at 375, 480, 481, 768, 835, 836 and 1280px.
- Assertions inspect computed grid background, DOM bounding boxes, all relevant left anchors, frame/column/figure widths, uppercase transforms and overflow (including elements clipped by Vlak overflow rules).
- Result tests require the expected specimen and both Cards; a redirect cannot silently count as a pass.

Install browser once: `npx playwright install chromium`. Run via `npm run test:visual`.

## Scope
Browser geometry/computed-style checks, not screenshot-based aesthetic approval. This revision does not certify one-page A4 pagination or a complete accessibility audit. Initial grayscale review preceded Renato's correction and is not evidence for this revised layout.
