import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";

const site = resolve(import.meta.dirname, "../site");
const pages = [
  "index.html",
  "examples/core.html",
  "examples/semantic.html",
  "examples/themed.html",
  "examples/host-collision.html",
];

for (const page of pages) {
  const filename = resolve(site, page);
  const html = readFileSync(filename, "utf8");
  assert.ok(!html.includes("../dist/css/"), `${page} points outside the site`);
  assert.ok(!html.includes("cdnjs.cloudflare.com"), `${page} needs a CDN`);

  for (const [tag] of html.matchAll(
    /<(?:a|link|script|img|source|iframe)\b[^>]*>/gi,
  )) {
    for (const [, value] of tag.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      if (/^(?:#|https?:|mailto:|data:)/.test(value)) continue;
      const target = resolve(dirname(filename), value.split("#")[0]);
      assert.ok(
        !relative(site, target).startsWith(".."),
        `${page} escapes the site`,
      );
      assert.ok(existsSync(target), `${page} has a missing asset: ${value}`);
    }
  }
  console.log(`${page}: local references OK`);
}

for (const name of ["phoenix.min.css", "phoenix.core.min.css"]) {
  const built = readFileSync(resolve(import.meta.dirname, "../dist/css", name));
  const staged = readFileSync(resolve(site, "assets", name));
  assert.deepEqual(staged, built, `${name} differs from the built artifact`);
}

console.log("Staged CSS matches the build");
