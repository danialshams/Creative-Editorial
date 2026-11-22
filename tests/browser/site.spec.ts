import { expect, test } from "@playwright/test";

test("RTL page, curtain exit, local image loading, and responsive layout", async ({ page }, info) => {
  const jsErrors: string[] = [];
  page.on("pageerror", error => jsErrors.push(error.message));
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".velvet-curtain")).toBeHidden({ timeout: 18_000 });
  await expect(page.getByRole("heading", { level: 1, name: /هنرِ/ })).toBeVisible();
  const dir = await page.locator("html").getAttribute("dir");
  expect(dir).toBe("rtl");
  const headingDir = await page.getByRole("heading", { level: 1 }).evaluate(el => getComputedStyle(el).direction);
  expect(headingDir).toBe("rtl");

  for (const section of ["collections", "spaces", "objects", "atelier", "journal"]) {
    await page.locator("#" + section).scrollIntoViewIfNeeded();
    await page.waitForTimeout(230);
  }
  await page.waitForTimeout(700);
  const imageElements = page.locator("img");
  for (let index = 0; index < await imageElements.count(); index++) {
    const image = imageElements.nth(index);
    if (await image.isVisible()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(async () => image.evaluate(element => (element as HTMLImageElement).naturalWidth), { timeout: 8_000 }).toBeGreaterThan(0);
    }
  }
  const invalid = await imageElements.evaluateAll(imgs => (imgs as HTMLImageElement[])
    .filter(img => img.getClientRects().length > 0 && (!img.complete || img.naturalWidth === 0))
    .map(img => ({ src: img.getAttribute("src"), complete: img.complete, width: img.naturalWidth })));
  expect(invalid, "All local editorial photography should decode successfully").toEqual([]);
  const sources = await page.locator("img").evaluateAll(imgs => imgs.map(img => img.getAttribute("src") || ""));
  expect(sources.length).toBeGreaterThanOrEqual(12);
  expect(sources.every(src => src.startsWith("/images/"))).toBe(true);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow, "No horizontal overflow").toBeLessThanOrEqual(2);
  expect(jsErrors).toEqual([]);

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.screenshot({ path: info.outputPath("homepage.png"), fullPage: true, animations: "disabled" });
});

test("Search, product modal and demo cart are interactive", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".velvet-curtain")).toBeHidden({ timeout: 18_000 });
  await page.getByRole("button", { name: "جست‌وجو" }).click();
  await expect(page.getByRole("dialog", { name: "جست‌وجو" })).toBeVisible();
  await page.getByRole("textbox", { name: "نام محصول، متریال یا دسته را جست‌وجو کنید" }).fill("صندلی");
  await page.getByRole("dialog", { name: "جست‌وجو" }).getByRole("button", { name: /صندلی چوبی کیارو/ }).click();
  await expect(page.getByRole("dialog", { name: /صندلی چوبی کیارو/ })).toBeVisible();
  await page.getByRole("button", { name: /افزودن به سبد نمایشی/ }).click();
  await expect(page.getByRole("dialog", { name: "سبد خرید" })).toBeVisible();
  await expect(page.getByText(/صندلی چوبی کیارو/).first()).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "سبد خرید" })).toBeHidden();
});

test("Mobile header menu opens and closes on Escape", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile navigation only");
  await page.goto("/");
  await expect(page.locator(".velvet-curtain")).toBeHidden({ timeout: 18_000 });
  await page.getByRole("button", { name: "بازکردن فهرست" }).click();
  await expect(page.getByRole("dialog", { name: "فهرست" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "فهرست" })).toBeHidden();
});


test("WebGL velvet curtains reveal the homepage and clear the overlay", async ({ page }, info) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const stage = page.locator(".velvet-curtain");
  await expect(stage).toBeVisible({ timeout: 5_000 });
  await expect(stage.locator("canvas")).toBeVisible();
  await page.waitForTimeout(1850);
  if (await stage.isVisible()) {
    await page.screenshot({ path: info.outputPath("curtain-mid-open.png"), animations: "allow" });
  }
  await expect(stage).toBeHidden({ timeout: 18_000 });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
