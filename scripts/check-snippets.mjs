import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const html = readFileSync(resolve(root, "docs/index.html"), "utf8");

const targets = [...html.matchAll(/data-copy-target="([^"]+)"/g)].map(
  ([, id]) => id,
);
assert.deepEqual(
  [...new Set(targets)],
  targets,
  "documentation copy targets must be unique",
);
assert.ok(
  targets.length >= 3,
  "the getting-started guide needs three copyable snippets",
);

for (const id of targets) {
  const source = html.match(
    new RegExp(`<code id="${id}">([\\s\\S]*?)</code>`),
  )?.[1];
  assert.ok(source, `copy target ${id} has no matching code block`);
  assert.ok(source.trim(), `copy target ${id} is empty`);
}

const commands = html.match(
  /<code id="start-commands">([\s\S]*?)<\/code>/,
)?.[1];
assert.match(
  commands,
  /git clone https:\/\/github\.com\/OthmaneBlial\/phoenixcss\.git/,
);
assert.match(commands, /npm ci/);
assert.match(commands, /npm run build/);
assert.match(commands, /python3 -m http\.server/);

const stylesheet = html.match(/<code id="start-link">([\s\S]*?)<\/code>/)?.[1];
assert.match(stylesheet, /\.\/phoenix\.core\.min\.css/);
assert.doesNotMatch(stylesheet, /\.\.\/dist|node_modules/);

const grid = html.match(/<code id="grid-code">([\s\S]*?)<\/code>/)?.[1];
assert.match(grid, /class="row"/);
assert.match(grid, /class="col-6"/);
assert.doesNotMatch(grid, /\.\.\/dist|node_modules/);

console.log(`Documentation snippets OK: ${targets.length} copyable blocks`);
