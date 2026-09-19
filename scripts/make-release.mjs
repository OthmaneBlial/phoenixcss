import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const manifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const expectedTag = `v${manifest.version}`;
assert.equal(
  process.argv[2] ?? expectedTag,
  expectedTag,
  `Expected tag ${expectedTag}`,
);

const temp = mkdtempSync(join(tmpdir(), "phoenixcss-release-"));
const output = join(root, "dist", "release");
const filenames = [
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
  const tarball = packOutput.trim().split("\n").at(-1);
  assert.equal(tarball, `${manifest.name}-${manifest.version}.tgz`);

  mkdirSync(output, { recursive: true });
  for (const filename of filenames) {
    copyFileSync(join(root, "dist", "css", filename), join(output, filename));
  }
  copyFileSync(join(temp, tarball), join(output, tarball));

  const checksums = [...filenames, tarball].sort().map((filename) => {
    const hash = createHash("sha256")
      .update(readFileSync(join(output, filename)))
      .digest("hex");
    return `${hash}  ${filename}`;
  });
  writeFileSync(join(output, "SHA256SUMS.txt"), `${checksums.join("\n")}\n`);
  console.log(`Release assets prepared for ${expectedTag} in dist/release`);
} finally {
  rmSync(temp, { recursive: true, force: true });
}
