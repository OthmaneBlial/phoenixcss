import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import postcss from "postcss";
import { validateCss } from "../scripts/check-css.mjs";

const root = resolve(import.meta.dirname, "..");
const cssDir = resolve(root, "dist/css");

function output(name, suffix = "") {
  const filename = resolve(cssDir, `${name}${suffix}.css`);
  assert.ok(statSync(filename).size > 0, `${filename} is empty`);
  return readFileSync(filename, "utf8");
}

const core = output("phoenix.core");
const coreMin = output("phoenix.core", ".min");
const full = output("phoenix");
const fullMin = output("phoenix", ".min");

test("both real CSS entry points pass the release structure checks", () => {
  validateCss("phoenix.core", core, coreMin, 8 * 1024);
  validateCss("phoenix", full, fullMin, 12 * 1024);
});

test("the checker rejects an invalid media query", () => {
  const broken = full.replace(
    "@media (min-width: 600px)",
    "@media (min-width: var(--breakpoint-sm))",
  );
  assert.notEqual(broken, full);
  assert.throws(
    () => validateCss("phoenix", broken, fullMin, 12 * 1024),
    /invalid media query/,
  );
});

test("the checker rejects optional selectors in core and conflicting rules", () => {
  assert.throws(
    () =>
      validateCss(
        "phoenix.core",
        `${core}\n.btn { color: red; }`,
        coreMin,
        8 * 1024,
      ),
    /Optional selector in core/,
  );
  assert.throws(
    () =>
      validateCss(
        "phoenix",
        `${full}\n.row { display: grid; }`,
        fullMin,
        12 * 1024,
      ),
    /Conflicting declaration/,
  );
});

test("the checker rejects a source map and a breached size budget", () => {
  assert.throws(
    () =>
      validateCss(
        "phoenix.core",
        core,
        `${coreMin}/*# sourceMappingURL=inline */`,
        8 * 1024,
      ),
    /source map/,
  );
  assert.throws(() => validateCss("phoenix", full, fullMin, 1), /gzip budget/);
});

test("the compiled grid stacks before 600px and splits col-6 at 600px", () => {
  const ast = postcss.parse(full);
  const base = [];
  const desktop = [];
  ast.walkRules((rule) => {
    const isColumn = rule.selectors.some(
      (selector) =>
        selector.includes(".col-6") || selector.includes("[class^=col-]"),
    );
    if (!isColumn) return;
    const declaration = rule.nodes.find(
      (node) => node.type === "decl" && node.prop === "flex",
    );
    if (!declaration) return;
    if (rule.parent.type === "root") base.push(declaration.value);
    if (
      rule.parent.type === "atrule" &&
      rule.parent.name === "media" &&
      rule.parent.params.includes("min-width: 600px")
    ) {
      desktop.push(declaration.value);
    }
  });
  assert.ok(base.some((value) => value.includes("100%")));
  assert.ok(desktop.some((value) => value.includes("50%")));
});

test("the docs link snippet names an output that the build actually emits", () => {
  const html = readFileSync(resolve(root, "docs/index.html"), "utf8");
  const snippet = html.match(/<code id="start-link">([^<]*)<\/code>/)?.[1];
  assert.ok(snippet, "missing installation snippet");
  const filename = snippet.match(/href="\.\/([^"]+)"/)?.[1];
  assert.equal(filename, "phoenix.core.min.css");
  assert.ok(statSync(resolve(cssDir, filename)).size > 0);
});
