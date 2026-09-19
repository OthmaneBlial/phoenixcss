import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const site = resolve(root, "site");

function writePage(source, destination, cssPrefix) {
  const original = readFileSync(resolve(root, source), "utf8");
  const html = original
    .replaceAll("../dist/css/", cssPrefix)
    .replaceAll('href="../examples/', 'href="./examples/')
    .replaceAll('src="../examples/', 'src="./examples/');
  if (html === original) {
    throw new Error(`No CSS path to rewrite in ${source}`);
  }
  writeFileSync(resolve(site, destination), html);
}

rmSync(site, { recursive: true, force: true });
mkdirSync(resolve(site, "assets"), { recursive: true });
mkdirSync(resolve(site, "examples"), { recursive: true });

for (const name of ["phoenix.min.css", "phoenix.core.min.css"]) {
  copyFileSync(resolve(root, "dist/css", name), resolve(site, "assets", name));
}

writePage("docs/index.html", "index.html", "./assets/");
copyFileSync(resolve(root, "docs/demo.js"), resolve(site, "demo.js"));
copyFileSync(resolve(root, "docs/site.css"), resolve(site, "site.css"));
copyFileSync(resolve(root, "docs/favicon.svg"), resolve(site, "favicon.svg"));

for (const name of [
  "semantic",
  "core",
  "themed",
  "host-collision",
  "guide",
  "form",
  "landing",
]) {
  writePage(`examples/${name}.html`, `examples/${name}.html`, "../assets/");
}
copyFileSync(
  resolve(root, "examples/slate.css"),
  resolve(site, "examples/slate.css"),
);
