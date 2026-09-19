# PhoenixCSS

**Readable HTML first. Optional layout classes when the page needs them.** PhoenixCSS is a CSS-only foundation for documentation, articles with forms, and small landing pages. Start with a stylesheet for native HTML; use the full build for a 12-column grid, cards, buttons, and navigation.

The source builds locally. The npm package, GitHub Release, public documentation site, and final screenshots are being prepared and are **not yet verified as published**. See the [roadmap](ROADMAP.md) for the remaining gates.

## Try it from source

Use Node.js **24** (the version in [`.node-version`](.node-version)) and npm:

```bash
git clone https://github.com/OthmaneBlial/phoenixcss.git
cd phoenixcss
npm ci
npm run build
python3 -m http.server 8765
```

Open `http://127.0.0.1:8765/examples/guide.html`. Its **Remove PhoenixCSS** button disables the actual built CSS on the same HTML, then **Apply PhoenixCSS** turns it back on. The [native form](examples/form.html) demonstrates a light slate token override and, with its example script, local validation without a backend; the [small landing page](examples/landing.html) uses the full build and a responsive card grid. [What each example proves](docs/EXAMPLES.md).

For the complete local documentation site, run:

```bash
npm run site
npm run check:site
python3 -m http.server 8766 --directory site
```

Then open `http://127.0.0.1:8766/`. The site contains the built CSS and examples and also works under a relative subpath; this is a local validation, not a public deployment claim.

## Choose a CSS file

| Output                          | Use it for                                                                    | Local size after the Node 24 build |
| ------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------- |
| `dist/css/phoenix.core.min.css` | Native headings, links, lists, code, tables, forms, focus, and CSS variables. | 5,392 bytes raw / 1,833 gzip       |
| `dist/css/phoenix.min.css`      | Core plus optional grid, cards, buttons, navigation, layouts, and utilities.  | 27,119 bytes raw / 5,092 gzip      |

These numbers are from the current local build and are checked by `npm run check:css`; they are not a comparison or a download size guarantee for a future release. Expanded `.css` variants are also generated. The [build guide](docs/BUILD.md) lists all four outputs and their source entries.

Copy the chosen built file into your own site's assets directory, then link it using the path where you placed it:

```html
<link rel="stylesheet" href="./phoenix.core.min.css" />
<main>
  <h1>A readable page</h1>
  <p>Begin with <a href="#details">ordinary HTML</a>.</p>
  <h2 id="details">Details</h2>
</main>
```

Choose `phoenix.min.css` instead if you use optional classes such as `row`, `col-6`, `card`, or `btn`. Both files have **no JavaScript runtime dependency**. A styled dialog or collapsible navigation still needs native browser APIs or your own behavior code; the [documentation script](docs/demo.js) is an example, not a shipped component runtime.

## What is included

- **Core:** readable semantic content and native controls, keyboard focus styles, responsive tables, and the documented [`--phx-*` roles](docs/THEMING.md).
- **Full:** core plus [mobile-first grid classes](docs/GRID.md), buttons, cards, navigation styling, utilities, and prefixed page layout classes.
- **Customization:** a default light palette and a [light slate override](examples/slate.css). A complete dark theme or switcher is not shipped.
- **Source examples:** the [guide](examples/guide.html), [form](examples/form.html), [landing page](examples/landing.html), and smaller [fixtures](examples/) build from the real CSS outputs.

The [product contract](docs/PRODUCT.md) states the target use cases and boundaries. The [class migration guide](docs/MIGRATION.md) records source-level changes made before the first verified release. The [measurements](docs/COMPARISON.md) include the reproducible method and comparison scope; PhoenixCSS does not claim to be faster or smaller than the alternatives.

## Current verification

`npm run build`, `npm run check:css`, `npm run check:contrast`, `npm run site`, and `npm run check:site` pass locally on Node 24. The examples and documentation have been inspected in Safari and Chrome; the three example pages had no document overflow at 320, 375, 768, and 1440 px in Chrome. Full Firefox, screen-reader, release-installation, and public-site checks remain open. The exact status is tracked in [ROADMAP.md](ROADMAP.md).

## Contributing and license

The contributor guide, CI, issue templates, installable package, and release artifacts are roadmap tasks. Use the [security policy](SECURITY.md) to report vulnerabilities privately, the [roadmap](ROADMAP.md) for open work, and the [build guide](docs/BUILD.md) for local commands.

PhoenixCSS is available under the [MIT License](LICENSE).
