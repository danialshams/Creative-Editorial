import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const page = readFileSync("components/MaisonHome.tsx", "utf8");
const data = readFileSync("data/catalog.ts", "utf8");
const css = readFileSync("app/globals.css", "utf8");
const layout = readFileSync("app/layout.tsx", "utf8");
const assets = [
 "hero","collection-one","collection-two","category-seating","category-lighting",
 "category-objects","material-one","material-two","journal","product-chiaro",
 "product-terre","product-casa","product-lume"
];

test("Persian page has native RTL and large Persian editorial hero", () => {
 assert.match(layout, /lang="fa" dir="rtl"/);
 assert.match(page, /هنرِ/);
 assert.match(page, /زندگی\./);
 assert.match(css, /\.hero-content\{direction:rtl\}/);
 assert.match(css, /\.hero-title\{direction:rtl/);
});
test("All bespoke visual assets exist as local WebP with unique paths", () => {
 assert.equal(new Set(assets).size,assets.length);
 for(const name of assets) {
   assert.ok(existsSync(join("public","images",name+".webp")), "missing image "+name);
   assert.ok(data.includes('localPhoto("'+name+'")'), "unreferenced image "+name);
 }
 assert.doesNotMatch(data,/https?:\/\/|unsplash|sourceImage/);
});
test("Spring-physics velvet curtains open from the centre with a safe fallback", () => {
 const curtain = readFileSync("components/PhysicsCurtain.tsx", "utf8");
 assert.match(page,/PhysicsCurtain/);
 assert.match(curtain,/oldX|point\.px/);
 assert.match(curtain,/const spring/);
 assert.match(curtain,/drawCloth/);
 assert.match(curtain,/requestAnimationFrame/);
 assert.match(curtain,/progress: 1/);
 assert.match(curtain,/6500/);
 assert.match(css,/physics-curtain--painted/);
});

test("Balanced restrained photographic masks, not every image shaped", () => {
 assert.match(page,/arch-cut/);
 assert.match(page,/crescent-cut/);
 assert.equal((page.match(/spaces-card--arch|spaces-card--crescent/g)||[]).length,0);
});
test("Motion and accessibility are supported", () => {
 assert.match(page,/ScrollTrigger/);
 assert.match(page,/data-photo-reveal/);
 assert.match(page,/data-parallax/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(page,/key === "Escape"/);
 assert.match(page,/aria-modal="true"/);
});
test("Images always fill their sections and mobile widths are covered", () => {
 assert.match(css,/object-fit:cover/);
 assert.match(css,/max-width:400px/);
 assert.match(css,/max-width:980px/);
});
test("No misleading real checkout", () => {
 assert.match(page,/تکمیل خرید \(در نسخه نمایشی غیرفعال\)/);
 assert.match(page,/disabled/);
});
