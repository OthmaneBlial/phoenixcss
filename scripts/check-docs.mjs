import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const markdown = [
  resolve(root, "README.md"),
  ...readdirSync(resolve(root, "docs"))
    .filter((name) => name.endsWith(".md"))
    .map((name) => resolve(root, "docs", name)),
];

let links = 0;
for (const filename of markdown) {
  const source = readFileSync(filename, "utf8");
  for (const [, rawTarget] of source.matchAll(/\]\(([^)]+)\)/g)) {
    const target = rawTarget.trim().split(/\s+"/)[0];
    if (!target || /^(?:#|https?:|mailto:|data:)/i.test(target)) continue;
    const path = decodeURIComponent(target.split("#", 1)[0]);
    if (!path) continue;
    const resolved = resolve(dirname(filename), path);
    assert.ok(
      existsSync(resolved),
      `${filename.replace(`${root}/`, "")} links to missing ${target}`,
    );
    links += 1;
  }
}

console.log(`Documentation links OK: ${links} local targets`);
