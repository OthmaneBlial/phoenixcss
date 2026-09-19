import { readFileSync } from "node:fs";
import postcss from "postcss";

const css = postcss.parse(readFileSync("dist/css/phoenix.css", "utf8"));
const root = css.nodes.find(
  (node) => node.type === "rule" && node.selector === ":root",
);

if (!root) {
  throw new Error("Build the CSS first: npm run build");
}

const colors = new Map(
  root.nodes
    .filter((node) => node.type === "decl")
    .map((node) => [node.prop, node.value]),
);

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
  ["body", "--dark-color", "--light-color"],
  ["heading and outline", "--primary-color", "--light-color"],
  ["primary button", "--light-color", "--primary-color"],
  ["primary button hover", "--light-color", "--primary-color-dark"],
  ["secondary button", "--light-color", "--secondary-color"],
  ["secondary button hover", "--light-color", "--secondary-color-dark"],
  ["danger button", "--light-color", "--danger-color"],
  ["danger button hover", "--light-color", "--danger-color-dark"],
  ["navigation accent", "--primary-on-dark", "--dark-color"],
  ["navigation text", "--light-color", "--dark-color"],
];

let failures = 0;
for (const [name, foreground, background] of pairs) {
  const first = colors.get(foreground);
  const second = colors.get(background);
  if (!first || !second) {
    throw new Error(
      `Missing color token for ${name}: ${foreground}, ${background}`,
    );
  }
  const value = contrast(first, second);
  const result = value >= 4.5 ? "PASS" : "FAIL";
  if (result === "FAIL") failures += 1;
  console.log(`${result} ${name}: ${value.toFixed(2)}:1`);
}

if (failures) process.exitCode = 1;
