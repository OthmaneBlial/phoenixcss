import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { performance } from "node:perf_hooks";
import { gzipSync } from "node:zlib";
import postcss from "postcss";

const root = resolve(import.meta.dirname, "..");
const args = new Set(process.argv.slice(2));
const allowed = new Set(["--build", "--compare", "--json", "--selectors"]);
for (const arg of args) {
  if (!allowed.has(arg)) {
    throw new Error("Unknown option: " + arg);
  }
}

const competitors = [
  {
    name: "Pico classless",
    package: "@picocss/pico@2.1.1",
    member: "package/css/pico.classless.min.css",
    source: "https://www.npmjs.com/package/@picocss/pico/v/2.1.1",
  },
  {
    name: "Water",
    package: "water.css@2.1.1",
    member: "package/out/water.min.css",
    source: "https://www.npmjs.com/package/water.css/v/2.1.1",
  },
  {
    name: "MVP",
    package: "mvp.css@1.18.0",
    member: "package/mvp.css",
    source: "https://www.npmjs.com/package/mvp.css/v/1.18.0",
  },
];

let buildMilliseconds = null;
if (args.has("--build")) {
  const start = performance.now();
  execFileSync("npm", ["run", "build"], { cwd: root, stdio: "pipe" });
  buildMilliseconds = Math.round(performance.now() - start);
}

function measure(name, bytes, source) {
  const css = bytes.toString("utf8");
  const selectors = new Set();
  let rules = 0;
  let mediaQueries = 0;
  const parsed = postcss.parse(css, { from: name });
  parsed.walkRules((rule) => {
    rules += 1;
    for (const selector of rule.selectors) {
      selectors.add(selector.trim());
    }
  });
  parsed.walkAtRules("media", () => {
    mediaQueries += 1;
  });
  return {
    name,
    source,
    bytes: bytes.length,
    gzipBytes: gzipSync(bytes, { level: 9 }).length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    rules,
    selectors: [...selectors].sort(),
    mediaQueries,
    hasInlineSourceMap: css.includes("sourceMappingURL=data:"),
  };
}

const results = [];
for (const [name, filename] of [
  ["Phoenix full", "dist/css/phoenix.css"],
  ["Phoenix full min", "dist/css/phoenix.min.css"],
  ["Phoenix core", "dist/css/phoenix.core.css"],
  ["Phoenix core min", "dist/css/phoenix.core.min.css"],
]) {
  try {
    const bytes = readFileSync(join(root, filename));
    results.push(measure(name, bytes, filename));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}
if (results.length < 2) {
  throw new Error("Build the project first, or pass --build.");
}

if (args.has("--compare")) {
  const competitorStyles = new Map();
  const temporary = mkdtempSync(join(tmpdir(), "phoenixcss-comparison-"));
  try {
    for (const competitor of competitors) {
      const archiveName = execFileSync(
        "npm",
        [
          "pack",
          competitor.package,
          "--pack-destination",
          temporary,
          "--silent",
        ],
        { cwd: temporary, encoding: "utf8" },
      ).trim();
      const bytes = execFileSync(
        "tar",
        ["-xOzf", join(temporary, basename(archiveName)), competitor.member],
        { maxBuffer: 16 * 1024 * 1024 },
      );
      competitorStyles.set(competitor.name, bytes);
      results.push(measure(competitor.name, bytes, competitor.source));
    }
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }

  // The HTML is byte-identical in each generated page; only its CSS changes.
  const fixture = readFileSync(join(root, "examples/semantic.html"), "utf8");
  const destination = join(root, "dist/comparison");
  for (const result of results.filter(
    (entry) =>
      entry.name.endsWith(" min") ||
      competitors.some((item) => item.name === entry.name),
  )) {
    const slug = result.name.toLowerCase().replaceAll(" ", "-");
    const directory = join(destination, slug);
    mkdirSync(directory, { recursive: true });
    const html = fixture.replace("../dist/css/phoenix.min.css", "./style.css");
    if (html === fixture) {
      throw new Error("Fixture stylesheet path not found.");
    }
    writeFileSync(join(directory, "index.html"), html);
    if (result.source.startsWith("dist/")) {
      writeFileSync(
        join(directory, "style.css"),
        readFileSync(join(root, result.source)),
      );
    } else {
      writeFileSync(
        join(directory, "style.css"),
        competitorStyles.get(result.name),
      );
    }
  }
}

if (args.has("--json")) {
  process.stdout.write(
    JSON.stringify(
      {
        node: process.version,
        buildMilliseconds,
        results: results.map(({ selectors, ...result }) => ({
          ...result,
          selectorCount: selectors.length,
          ...(args.has("--selectors") ? { selectors } : {}),
        })),
      },
      null,
      2,
    ) + "\n",
  );
} else {
  process.stdout.write(
    "| Stylesheet | Raw bytes | Gzip bytes | Rules | Unique selectors | Media queries | Inline map |\n" +
      "| --- | ---: | ---: | ---: | ---: | ---: | --- |\n",
  );
  for (const result of results) {
    process.stdout.write(
      "| " +
        result.name +
        " | " +
        result.bytes +
        " | " +
        result.gzipBytes +
        " | " +
        result.rules +
        " | " +
        result.selectors.length +
        " | " +
        result.mediaQueries +
        " | " +
        (result.hasInlineSourceMap ? "yes" : "no") +
        " |\n",
    );
  }
  if (buildMilliseconds !== null) {
    process.stdout.write("Build duration: " + buildMilliseconds + " ms\n");
  }
  if (args.has("--selectors")) {
    for (const result of results) {
      process.stdout.write("\n" + result.name + " selectors:\n");
      process.stdout.write(result.selectors.join("\n") + "\n");
    }
  }
}
