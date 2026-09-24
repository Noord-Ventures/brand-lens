import { test, expect } from '@playwright/test';

const widths = [375, 480, 481, 768, 835, 836, 1280];
const pages = [
  { name: 'questions', path: '/' },
  { name: 'quiet', path: '/result?a=abaabaab' },
  { name: 'warm', path: '/result?a=baabbaab' },
  { name: 'bold', path: '/result?a=bbbbbbbb' },
];
for (const width of widths) for (const route of pages) {
  test(`${route.name} at ${width}: case, grid anchors and overflow`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(route.path);
    await expect(page.locator('.lens')).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    // Require the actual specimen: invalid URLs must not pass after redirecting.
    if (route.name !== 'questions') {
      await expect(page.locator(`[data-specimen="${route.name}"]`)).toHaveCount(1);
      await expect(page.locator('.rs-card')).toHaveCount(2);
    }
    const metrics = await page.evaluate(() => {
      const box = (el: Element) => { const r = el.getBoundingClientRect(); return { x: r.x, right: r.right, width: r.width }; };
      const lens = document.querySelector('.lens')!;
      const grid = getComputedStyle(document.documentElement, '::before');
      return {
        lens: box(lens),
        grid: { image: grid.backgroundImage, position: grid.backgroundPosition, size: grid.backgroundSize },
        uppercase: [...lens.querySelectorAll('*')].filter(el => el.getClientRects().length && getComputedStyle(el).textTransform === 'uppercase').map(el => el.textContent),
        outside: [...lens.querySelectorAll('*')].filter(el => el.getClientRects().length && (box(el).x < -1 || box(el).right > innerWidth + 1)).map(el => el.className),
        overflow: document.documentElement.scrollWidth > innerWidth || document.body.scrollWidth > innerWidth,
        anchors: [...lens.querySelectorAll('.lens-title, .lens-prompt, .lens-h, .rs-card, .rs-card-title, .rs-card-label, [data-specimen], .lens-options > *, .lens-sayavoid > *')].map(el => ({ tag: el.className, ...box(el) })),
        columns: [...lens.querySelectorAll('.lens-options > *, .lens-sayavoid > *')].map(box),
      };
    });
    expect(metrics.uppercase).toEqual([]);
    expect(metrics.outside).toEqual([]);
    expect(metrics.overflow).toBe(false);
    expect(metrics.grid.image).not.toBe('none');
    const left = width <= 480 ? 25 : width >= 1244 ? 224 : 20;
    const contentWidth = width <= 480 ? width - 50 : width >= 836 ? 796 : 388;
    expect(metrics.lens.x).toBeCloseTo(left, 1);
    expect(metrics.lens.width).toBeCloseTo(contentWidth, 1);
    expect(metrics.grid.position).toBe(width <= 480 ? '0px 0px' : '20px 0px');
    expect(metrics.grid.size).toBe(width <= 480 ? `${width}px 100%` : '204px 100%');
    for (const anchor of metrics.anchors) {
      const offset = width <= 480 ? anchor.x - left : (anchor.x - 20) % 204;
      expect(Math.abs(offset), `off-grid left edge: ${anchor.tag}`).toBeLessThan(1);
    }
    for (const col of metrics.columns) expect(col.width).toBeCloseTo(width >= 836 ? 388 : contentWidth, 1);
    if (route.name !== 'questions') {
      const fig = await page.locator('[data-specimen]').boundingBox();
      expect(fig!.x).toBeCloseTo(left, 1);
      expect(fig!.width).toBeCloseTo(contentWidth, 1);
    }
  });
}
