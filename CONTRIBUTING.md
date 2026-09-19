# Contributing to PhoenixCSS

PhoenixCSS is a small CSS foundation for semantic content and optional layout. Read the [product contract](docs/PRODUCT.md) and [roadmap](ROADMAP.md) before proposing a feature. Open an issue for a change to the public CSS contract or a new component, so the use case and compatibility cost are clear.

If you are evaluating the project for the first time, use the [independent onboarding review](docs/ONBOARDING_REVIEW.md) before reading the source. It gives maintainers comparable feedback instead of relying on memory or informal explanations.

## Start from a clean checkout

Use Node.js 24.21.0 (`.node-version`) and npm:

```bash
git clone https://github.com/OthmaneBlial/phoenixcss.git
cd phoenixcss
npm ci
npm run lint
npm test
```

To inspect the rendered docs and examples, run `npm run site` and `python3 -m http.server 8766 --directory site`, then open `http://127.0.0.1:8766/`. The CI additionally runs `npx playwright test` in Chromium, Firefox, and WebKit after installing their browser binaries. The [build guide](docs/BUILD.md) lists every check and output.

## Find the right source

- `src/sass/core.scss` compiles the classless base: helpers, reset, native content, forms, and tables.
- `src/sass/_index.scss` adds optional components, grid, utilities, and layout. Keep component and layout selectors out of core.
- `src/sass/helpers/_variables.scss` defines the defaults behind the documented `--phx-*` color roles. Breakpoints are Sass values compiled into media queries.
- `examples/` holds real consumer pages. `docs/` holds the site source; `npm run site` stages both in ignored `site/`.
- `scripts/` builds and checks CSS, site links, contrast, package contents, and measurements. `tests/` checks the CSS contract and browser journeys.

## Make a focused change

1. Reproduce a bug on one of the three [reference journeys](docs/PRODUCT.md) or add a small, runnable example that shows it. For layout and focus changes, record browser, width, and input method.
2. Edit the Sass source, not ignored `dist/` or `site/`. Use existing `--phx-*` roles for colors. Keep native HTML readable without optional classes. Give new layout classes a `phx-` prefix; document any other global class name and collision risk.
3. Update the related guide or migration note when a selector, token, or behavior changes. Add a targeted contract or browser test when it can detect a real regression.
4. Run `npm run lint && npm test`. For visual or interaction changes, run the docs locally and check the affected page at 320, 375, 768, and 1440 px, at 200% zoom, and by keyboard. If browser binaries are installed, run `npm run test:browser` too.
5. Open a pull request with the change, reproduction, checks run, browser results, and a real screenshot when appearance changes. State what remains unverified.

Do not commit generated directories, personal data, credentials, or fabricated screenshots. Report security issues through the [private reporting channel](SECURITY.md). CI evidence is useful, but a contributor should describe manual observations separately.

The [code of conduct](CODE_OF_CONDUCT.md) applies to project discussions and contributions. Maintainers may ask for a smaller scope or more evidence before merging.
