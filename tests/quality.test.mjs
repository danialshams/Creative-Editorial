import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
test("Next.js document uses correct Persian RTL context", () => {
  const file = read("src/app/layout.tsx");
  assert.match(file, /lang="fa" dir="rtl"/);
});
test("three distinctive watches and unique IDs", () => {
  const source = read("src/lib/collection.ts");
  for (const id of ["eclipse", "solstice", "nocturne"]) assert.match(source, new RegExp('id: "' + id + '"'));
});
test("interactive drawers and reduced motion support", () => {
  const file = read("src/components/Experience.tsx");
  assert.match(file, /aria-modal="true"/);
  assert.match(file, /Escape/);
  assert.match(file, /prefers-reduced-motion/);
});
test("main elements, brand assets and responsive CSS exist", () => {
  for (const f of ["src/components/WatchVisual.tsx", "src/app/globals.css", "src/app/icon.svg", ".github/workflows/quality.yml"]) assert.ok(existsSync(f), `${f} missing`);
  const css = read("src/app/globals.css");
  assert.match(css, /@media\s*\(max-width:\s*640px\)/);
  assert.match(css, /focus-visible/);
});
