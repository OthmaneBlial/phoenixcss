import { mkdirSync } from "node:fs";
import { expect, test } from "@playwright/test";

async function captureShowcase(page, testInfo, name, options = {}) {
  if (testInfo.project.name !== "chromium") return;
  mkdirSync("test-results/showcase", { recursive: true });
  await page.screenshot({
    path: `test-results/showcase/${name}.png`,
    animations: "disabled",
    ...options,
  });
}

test("documentation fits phone and desktop widths without page errors", async ({
  page,
  browser,
}, testInfo) => {
  console.log(`${testInfo.project.name}: browser ${browser.version()}`);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 820 });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Start with the HTML.",
    );
    const dimensions = await page.evaluate(() => ({
      viewport: innerWidth,
      document: document.documentElement.scrollWidth,
    }));
    expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport);
    if (width === 375 || width === 1440) {
      await captureShowcase(page, testInfo, `docs-${width}`);
    }
  }
  expect(errors).toEqual([]);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
});

test("the narrow documentation menu closes after following an anchor", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 820 });
  await page.goto("/");
  const toggle = page.getByRole("button", {
    name: "Toggle documentation navigation",
  });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.locator('#sidebar a[href="#choose"]').click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page).toHaveURL(/#choose$/);
  await expect(page.locator("#sidebar")).toHaveAttribute("inert", "");
});

test("the native dialog closes on Escape and restores focus", async ({
  page,
}) => {
  await page.goto("/#full");
  const opener = page.getByRole("button", { name: "Open dialog" });
  await opener.click();
  const dialog = page.getByRole("dialog", { name: "A native dialog" });
  await expect(dialog).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Close dialog" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
});

test("the guide toggles the built core CSS on the same page", async ({
  page,
}, testInfo) => {
  await page.goto("/examples/guide.html");
  const heading = page.getByRole("heading", {
    name: "A small guide to a readable page",
  });
  await expect(heading).toBeVisible();
  await page.getByRole("button", { name: "Remove PhoenixCSS" }).click();
  await expect(page.locator("#phoenix-stylesheet")).toHaveJSProperty(
    "disabled",
    true,
  );
  await captureShowcase(page, testInfo, "guide-before");
  await page.getByRole("button", { name: "Apply PhoenixCSS" }).click();
  await expect(page.locator("#phoenix-stylesheet")).toHaveJSProperty(
    "disabled",
    false,
  );
  await expect(heading).toBeVisible();
  await captureShowcase(page, testInfo, "guide-after");
});

test("the slate form reports an error and validates without navigation", async ({
  page,
}, testInfo) => {
  await page.goto("/examples/form.html");
  const email = page.getByRole("textbox", { name: /Email/ });
  await page.getByRole("button", { name: "Check this form" }).click();
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await expect(
    page.getByText("Enter a valid email address before continuing."),
  ).toBeVisible();
  await expect(email).toBeFocused();

  await email.fill("reader@example.test");
  await page.getByRole("button", { name: "Check this form" }).click();
  await expect(page.getByRole("status")).toHaveText(
    "Valid sample. Nothing was sent or stored.",
  );
  await expect(page).toHaveURL(/\/examples\/form\.html$/);
  await captureShowcase(page, testInfo, "form", { fullPage: true });
});

test("the full-build cards stack before the small breakpoint", async ({
  page,
}, testInfo) => {
  await page.goto("/examples/landing.html");
  const cards = page.locator(".row > .col-6");
  await expect(cards).toHaveCount(2);

  await page.setViewportSize({ width: 320, height: 820 });
  const narrow = await cards.evaluateAll((elements) =>
    elements.map((element) => element.getBoundingClientRect().left),
  );
  expect(narrow[0]).toBe(narrow[1]);

  await page.setViewportSize({ width: 768, height: 820 });
  const wide = await cards.evaluateAll((elements) =>
    elements.map((element) => element.getBoundingClientRect().left),
  );
  expect(wide[1]).toBeGreaterThan(wide[0]);
  await page.setViewportSize({ width: 1440, height: 820 });
  await captureShowcase(page, testInfo, "landing");

  await page.setContent(`
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/assets/phoenix.min.css">
    <div class="container">
      <div class="row" id="columns">
        <div class="col-4" id="col-sm">Small</div>
        <div class="col-md-6" id="col-md">Medium</div>
        <div class="col-lg-3" id="col-lg">Large</div>
        <div class="col-xl-2" id="col-xl">Extra large</div>
      </div>
      <div class="row" id="offset-row"><div class="col-4 offset-1" id="offset">Offset</div></div>
    </div>
  `);
  await expect(page.locator("#columns")).toHaveCSS("display", "flex");

  for (const width of [320, 600, 768, 992, 1200]) {
    await page.setViewportSize({ width, height: 820 });
    const size = await page.evaluate(() => {
      const measure = (selector) =>
        document.querySelector(selector).getBoundingClientRect().width;
      return {
        row: measure("#columns"),
        sm: measure("#col-sm"),
        md: measure("#col-md"),
        lg: measure("#col-lg"),
        xl: measure("#col-xl"),
        offsetRow: measure("#offset-row"),
        offset: Number.parseFloat(
          getComputedStyle(document.querySelector("#offset")).marginLeft,
        ),
        document: document.documentElement.scrollWidth,
        viewport: innerWidth,
      };
    });
    expect(
      Math.abs(size.sm - size.row * (width >= 600 ? 4 / 12 : 1)),
    ).toBeLessThan(2);
    expect(
      Math.abs(size.md - size.row * (width >= 768 ? 6 / 12 : 1)),
    ).toBeLessThan(2);
    expect(
      Math.abs(size.lg - size.row * (width >= 992 ? 3 / 12 : 1)),
    ).toBeLessThan(2);
    expect(
      Math.abs(size.xl - size.row * (width >= 1200 ? 2 / 12 : 1)),
    ).toBeLessThan(2);
    expect(
      Math.abs(size.offset - size.offsetRow * (width >= 600 ? 1 / 12 : 0)),
    ).toBeLessThan(2);
    expect(size.document).toBeLessThanOrEqual(size.viewport);
  }
});
