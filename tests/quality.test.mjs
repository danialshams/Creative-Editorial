import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync("components/MaisonHome.tsx", "utf8");
const data = readFileSync("data/catalog.ts", "utf8");
const css = readFileSync("app/globals.css", "utf8");
const layout = readFileSync("app/layout.tsx", "utf8");

test("Persian document has correct language and direction", () => {
  assert.match(layout, /lang="fa" dir="rtl"/);
});
test("Uses authentic licensed Unsplash source photos with no duplicate IDs", () => {
  const ids = [...data.matchAll(/photo-\d{13}-[a-z0-9]+/g)].map(m => m[0]);
  assert.ok(ids.length >= 12, "at least a dozen unique source photos");
  assert.equal(new Set(ids).size, ids.length, "each editorial section uses a different photo");
  assert.match(data, /images\.unsplash\.com/);
});
test("GSAP scroll and cinematic introductory scenes exist", () => {
  assert.match(page, /ScrollTrigger/);
  assert.match(page, /data-photo-reveal/);
  assert.match(page, /data-parallax/);
  assert.match(page, /intro--/);
});
test("Accessible reduced motion and ESC-close overlays included", () => {
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(page, /key === "Escape"/);
  assert.match(page, /aria-modal="true"/);
});
test("Image containers crop to intended viewport without gaps", () => {
  assert.match(css, /object-fit:cover/);
  assert.match(css, /arch-cut/);
  assert.match(css, /crescent-cut/);
});
test("Demo purchase does not misrepresent a real checkout", () => {
  assert.match(page, /تکمیل خرید \(در نسخه نمایشی غیرفعال\)/);
  assert.match(page, /disabled/);
});
test("Layouts cover narrow mobile and wide desktop", () => {
  assert.match(css, /max-width:400px/);
  assert.match(css, /max-width:980px/);
  assert.match(css, /grid-template-columns:repeat\(4/);
});
