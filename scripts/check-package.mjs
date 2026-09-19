import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import * as sass from "sass";

const root = resolve(import.meta.dirname, "..");
const temp = mkdtempSync(join(tmpdir(), "phoenixcss-package-"));
const consumer = join(temp, "consumer");
const cssNames = [
  "phoenix.core.css",
  "phoenix.core.min.css",
  "phoenix.css",
  "phoenix.min.css",
];

try {
  const packOutput = execFileSync(
    "npm",
    ["pack", "--silent", "--pack-destination", temp],
    {
      cwd: root,
      encoding: "utf8",
    },
  );
  const tarballName = packOutput.trim().split("\n").at(-1);
  const manifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  assert.equal(tarballName, `${manifest.name}-${manifest.version}.tgz`);
  const tarball = join(temp, tarballName);

  const entries = execFileSync("tar", ["-tzf", tarball], { encoding: "utf8" })
    .trim()
    .split("\n");
  const required = [
    "package/LICENSE",
    "package/README.md",
    "package/package.json",
    "package/src/sass/_index.scss",
    "package/src/sass/core.scss",
    ...cssNames.map((name) => `package/dist/css/${name}`),
  ];
  for (const file of required)
    assert.ok(entries.includes(file), `Missing ${file}`);
  for (const file of entries) {
    assert.match(
      file,
      /^package\/(?:LICENSE|README\.md|package\.json|dist\/css\/phoenix(?:\.core)?(?:\.min)?\.css|src\/sass\/.+\.scss)$/,
      `Unexpected file in tarball: ${file}`,
    );
  }

  mkdirSync(consumer);
  writeFileSync(
    join(consumer, "package.json"),
    `${JSON.stringify({ name: "phoenixcss-consumer-smoke", version: "1.0.0", private: true })}\n`,
  );
  execFileSync(
    "npm",
    [
      "install",
      "--offline",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      `../${basename(tarball)}`,
    ],
    { cwd: consumer, stdio: "pipe" },
  );

  const installed = join(consumer, "node_modules", manifest.name);
  for (const name of cssNames) {
    assert.deepEqual(
      readFileSync(join(installed, "dist", "css", name)),
      readFileSync(join(root, "dist", "css", name)),
      `Installed ${name} differs from the build`,
    );
  }
  assert.equal(manifest.main, "dist/css/phoenix.css");
  assert.equal(manifest.style, "dist/css/phoenix.min.css");
  assert.equal(manifest.sass, "src/sass/_index.scss");

  const readme = readFileSync(join(installed, "README.md"), "utf8");
  for (const [, target] of readme.matchAll(/\]\(([^)]+)\)/g)) {
    if (/^(?:https?:\/\/|#|mailto:)/.test(target)) continue;
    const relative = target.split("#")[0];
    assert.ok(
      existsSync(join(installed, relative)),
      `Broken package README link: ${target}`,
    );
  }

  const compiled = sass.compileString('@use "phoenixcss/src/sass";\n', {
    loadPaths: [join(consumer, "node_modules")],
  }).css;
  assert.match(compiled, /\.col-6\s*\{/);
  assert.match(compiled, /body\s*\{/);

  writeFileSync(
    join(consumer, "index.html"),
    '<!doctype html><html lang="en"><meta charset="utf-8"><link rel="stylesheet" href="./node_modules/phoenixcss/dist/css/phoenix.core.min.css"><title>Consumer smoke test</title><main><h1>Readable HTML</h1><p>PhoenixCSS from the installed tarball.</p></main></html>\n',
  );
  console.log(
    `Package OK: ${tarballName}, ${entries.length} files, four CSS imports, Sass and README links`,
  );
} finally {
  rmSync(temp, { recursive: true, force: true });
}
