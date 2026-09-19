import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("reference pages and interactive states have no detected WCAG A/AA violations", async ({
  page,
}) => {
  test.setTimeout(90_000);
  const found = [];

  async function audit(label) {
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    found.push(
      ...results.violations.map((violation) => ({
        page: label,
        rule: violation.id,
        impact: violation.impact,
        targets: violation.nodes.map((node) => node.target.join(" ")),
      })),
    );
  }

  await page.goto("/");
  await audit("documentation");
  await page.getByRole("button", { name: "Open dialog" }).click();
  await audit("open dialog");

  await page.goto("/examples/guide.html");
  await audit("guide");

  await page.goto("/examples/form.html");
  await audit("form");
  await page.getByRole("button", { name: "Check this form" }).click();
  await audit("form error");

  await page.goto("/examples/landing.html");
  await audit("landing");

  await page.goto("/examples/themed.html");
  await audit("slate full build");

  await page.goto("/examples/host-collision.html");
  await audit("host layout fixture");

  expect(
    found,
    "axe-core WCAG A/AA violations across reference states",
  ).toEqual([]);
});
