import { test, expect } from "@playwright/test";

test("curtains open directly onto the already-rendered homepage, with no black interstitial", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const curtain = page.locator(".velvet-curtain");
  const hero = page.locator(".hero-photo img");

  await expect(curtain).toBeAttached();
  await expect(hero).toBeAttached();
  expect(await curtain.evaluate(element => getComputedStyle(element).backgroundColor))
    .toBe("rgba(0, 0, 0, 0)");

  await expect(page.locator(".velvet-curtain__backdrop, .velvet-curtain__rail, .velvet-curtain__valance, .velvet-curtain__cord, .velvet-curtain__identity"))
    .toHaveCount(0);

  await expect.poll(
    () => hero.evaluate(element => (element as HTMLImageElement).naturalWidth),
    { timeout: 7000 }
  ).toBeGreaterThan(0);

  // The curtain remains over the hero until physically outside the viewport.
  await expect(curtain).toHaveCount(0, { timeout: 14500 });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator(".hero-photo img")).toBeVisible();
});

test("reduced motion skips the curtain and immediately shows the hero", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".velvet-curtain")).toHaveCount(0, { timeout: 3500 });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
