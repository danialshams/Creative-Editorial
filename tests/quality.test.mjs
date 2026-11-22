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
test("Independent 3D WebGL velvet curtain opens with a safe exit", () => {
 const curtain = readFileSync("components/VelvetCurtainIntro.tsx", "utf8");
 const simulation = readFileSync("components/velvet-simulation.ts", "utf8");
 const curtainCSS = readFileSync("components/VelvetCurtainIntro.css", "utf8");
 assert.match(page,/VelvetCurtainIntro/);
 assert.doesNotMatch(page,/PhysicsCurtain/);
 assert.match(curtain,/createVelvetScene/);
 assert.match(curtain,/onComplete/);
 assert.match(curtain,/isOffscreen/);
 assert.match(curtain,/onRevealStart/);
 assert.match(curtain,/heroReady/);
 assert.match(curtain,/hero\.decode/);
 assert.doesNotMatch(curtain,/__backdrop|__valance|__rail|__cord|__identity/);
 assert.match(curtain,/prefers-reduced-motion/);
 assert.match(simulation,/Verlet/);
 assert.match(simulation,/WebGL/);
 assert.match(simulation,/gravity|GRAVITY|1400 \* dt \* dt/i);
 assert.match(simulation,/clampRail/);
 assert.doesNotMatch(simulation,/knotX|knotY|const tie =/);
 assert.match(simulation,/isOffscreen\(\)/);
 assert.match(simulation,/x >= -3/);
 assert.match(simulation,/x <= width \+ 3/);
 assert.match(curtainCSS,/velvet-curtain--fallback/);
 assert.match(curtainCSS,/#bda27a/);
 assert.match(curtainCSS,/background: transparent/);
 assert.match(curtain,/duration: 5\.6/);
 assert.match(simulation,/const rowDelay = 0\.38 \* low \* low/);
 assert.match(simulation,/const rowGather = ease/);
 assert.match(simulation,/vec3 goldHem/);
 assert.match(simulation,/float tasselTip/);
 assert.match(curtainCSS,/left-curtain-top-first/);
 assert.match(curtainCSS,/right-curtain-top-first/);
 assert.match(curtain,/sine\.inOut/);
 assert.match(curtain,/useLayoutEffect/);
 assert.match(curtainCSS,/\.velvet-curtain__fallback\s*\{[^}]*display:\s*none/s);
 assert.match(curtainCSS,/\.velvet-curtain--fallback \.velvet-curtain__fallback \{ display: block; \}/);
 assert.doesNotMatch(curtainCSS,/velvet-curtain--released|velvet-curtain__valance/);
 assert.match(page,/onRevealStart=\{beginCurtainReveal\}/);
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
