import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import postcss from "postcss";

export function validateCss(name, expanded, minified, budget) {
  const gzipBytes = gzipSync(minified, { level: 9 }).length;

  assert.ok(minified.length < expanded.length, `${name} is not minified`);
  assert.ok(gzipBytes <= budget, `${name} exceeds its gzip budget`);
  assert.ok(
    !minified.includes("sourceMappingURL="),
    `${name} has a source map`,
  );

  const css = postcss.parse(expanded);
  const declarations = new Map();
  css.walkAtRules("media", (rule) => {
    assert.ok(
      !rule.params.includes("var("),
      `${name} has an invalid media query`,
    );
  });
  css.walkRules((rule) => {
    const conditions = [];
    for (
      let parent = rule.parent;
      parent.type !== "root";
      parent = parent.parent
    ) {
      if (parent.type === "atrule")
        conditions.unshift(`${parent.name} ${parent.params}`);
    }
    for (const selector of rule.selectors) {
      if (name === "phoenix.core") {
        assert.doesNotMatch(
          selector,
          /\.(?:btn|card|row|col-\d|modal|nav|phx-sidebar|phx-footer|phx-header|phx-main)(?:\b|[-_:])/,
          `Optional selector in core: ${selector}`,
        );
      }
      for (const declaration of rule.nodes.filter(
        (node) => node.type === "decl",
      )) {
        const key = `${conditions.join("|")}|${selector}|${declaration.prop}`;
        const previous = declarations.get(key);
        assert.ok(
          previous === undefined || previous === declaration.value,
          `Conflicting declaration for ${key}`,
        );
        declarations.set(key, declaration.value);
      }
    }
  });

  return { rawBytes: minified.length, gzipBytes };
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  for (const [name, budget] of [
    ["phoenix.core", 8 * 1024],
    ["phoenix", 12 * 1024],
  ]) {
    const expanded = readFileSync(`dist/css/${name}.css`, "utf8");
    const minified = readFileSync(`dist/css/${name}.min.css`, "utf8");
    const result = validateCss(name, expanded, minified, budget);
    console.log(
      `${name}: ${result.rawBytes} raw bytes, ${result.gzipBytes} gzip bytes; structure OK`,
    );
  }
}
