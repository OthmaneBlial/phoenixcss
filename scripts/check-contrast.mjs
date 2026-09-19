import { readFileSync } from "node:fs";
import postcss from "postcss";

const css = postcss.parse(readFileSync("dist/css/phoenix.css", "utf8"));
const root = css.nodes.find(
  (node) => node.type === "rule" && node.selector === ":root",
);
const theme = postcss.parse(readFileSync("examples/slate.css", "utf8"));
const slate = theme.nodes.find(
  (node) =>
    node.type === "rule" && node.selector === ':root[data-phx-theme="slate"]',
);

if (!root || !slate) {
  throw new Error("Build the CSS and check the alternate palette fixture");
}

function declarations(rule) {
  return new Map(
    rule.nodes
      .filter((node) => node.type === "decl")
      .map((node) => [node.prop, node.value]),
  );
}

const defaultColors = declarations(root);
const slateColors = new Map([...defaultColors, ...declarations(slate)]);

function resolve(colors, name, visited = new Set()) {
  if (visited.has(name)) throw new Error(`Circular color token: ${name}`);
  visited.add(name);
  const value = colors.get(name);
  if (!value) throw new Error(`Missing color token: ${name}`);
  const reference = value.match(/^var\((--[\w-]+)\)$/);
  return reference ? resolve(colors, reference[1], visited) : value;
}

function luminance(color) {
  const channels = /^#[\da-f]{6}$/i.test(color)
    ? color
        .slice(1)
        .match(/.{2}/g)
        .map((channel) => parseInt(channel, 16))
    : /^rgb\([\d.,\s]+\)$/.test(color)
      ? color.slice(4, -1).split(",").map(Number)
      : null;
  if (!channels || channels.length !== 3) {
    throw new Error(`Unsupported color: ${color}`);
  }
  const linear = channels
    .map((channel) => channel / 255)
    .map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    );
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

function contrast(first, second) {
  const [lighter, darker] = [luminance(first), luminance(second)].sort(
    (a, b) => b - a,
  );
  return (lighter + 0.05) / (darker + 0.05);
}

const pairs = [
  ["body", "--phx-text", "--phx-surface", 4.5],
  ["muted surface text", "--phx-text", "--phx-surface-muted", 4.5],
  ["link", "--phx-link", "--phx-surface", 4.5],
  ["placeholder", "--phx-placeholder", "--phx-surface", 4.5],
  ["heading and outline", "--phx-action", "--phx-surface", 4.5],
  ["primary button", "--phx-action-text", "--phx-action", 4.5],
  ["primary button hover", "--phx-action-text", "--phx-action-hover", 4.5],
  ["success button", "--phx-action-text", "--phx-success", 4.5],
  ["success button hover", "--phx-action-text", "--phx-success-hover", 4.5],
  ["danger button", "--phx-action-text", "--phx-danger", 4.5],
  ["danger button hover", "--phx-action-text", "--phx-danger-hover", 4.5],
  ["navigation accent", "--phx-nav-accent", "--phx-nav-surface", 4.5],
  ["navigation text", "--phx-nav-text", "--phx-nav-surface", 4.5],
  ["control border", "--phx-border", "--phx-surface", 3],
  ["focus outline", "--phx-focus", "--phx-surface", 3],
];

let failures = 0;
for (const [palette, colors] of [
  ["default", defaultColors],
  ["slate", slateColors],
]) {
  for (const [name, foreground, background, minimum] of pairs) {
    const first = resolve(colors, foreground);
    const second = resolve(colors, background);
    const value = contrast(first, second);
    const result = value >= minimum ? "PASS" : "FAIL";
    if (result === "FAIL") failures += 1;
    console.log(`${result} ${palette} ${name}: ${value.toFixed(2)}:1`);
  }
}

if (failures) process.exitCode = 1;
