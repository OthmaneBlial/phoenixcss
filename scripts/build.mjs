import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import cssnano from "cssnano";
import postcss from "postcss";
import * as sass from "sass";

const root = resolve(import.meta.dirname, "..");
const output = resolve(root, "dist/css");

rmSync(resolve(root, "dist"), { recursive: true, force: true });
mkdirSync(output, { recursive: true });

for (const [entry, name] of [
  ["src/sass/core.scss", "phoenix.core"],
  ["src/sass/_index.scss", "phoenix"],
]) {
  const compiled = sass.compile(resolve(root, entry), {
    style: "expanded",
    sourceMap: false,
  }).css;
  const css = compiled.endsWith("\n") ? compiled : `${compiled}\n`;
  writeFileSync(resolve(output, `${name}.css`), css);

  const minified = await postcss([cssnano({ preset: "default" })]).process(
    readFileSync(resolve(output, `${name}.css`), "utf8"),
    { from: undefined, map: false },
  );
  writeFileSync(resolve(output, `${name}.min.css`), `${minified.css}\n`);
}
