# Building PhoenixCSS

Use Node.js 24.21.0 (see [`.node-version`](../.node-version)) and npm. From a clean checkout:

```bash
npm ci
npm run build
npm run lint
npm test
```

The build emits four ignored local artifacts:

| File                            | Source                 | Contents                                                                    |
| ------------------------------- | ---------------------- | --------------------------------------------------------------------------- |
| `dist/css/phoenix.core.css`     | `src/sass/core.scss`   | Expanded native HTML styles and CSS variables.                              |
| `dist/css/phoenix.core.min.css` | `src/sass/core.scss`   | Minified core for a page.                                                   |
| `dist/css/phoenix.css`          | `src/sass/_index.scss` | Expanded core plus optional forms, grid, utilities, components, and layout. |
| `dist/css/phoenix.min.css`      | `src/sass/_index.scss` | Minified full stylesheet for a page.                                        |

The build cleans `dist/` once, compiles both Sass entries, and minifies them through PostCSS/cssnano with source maps disabled. It does not install a runtime dependency into a consumer page. `npm run lint` checks Sass/CSS/HTML/JavaScript formatting and validates the source HTML with HTML-validate. `npm test` rebuilds CSS and the site, then checks their structure, contrast, references, package contents and installation, and CSS contract tests. The [core fixture](../examples/core.html) and [full fixture](../examples/themed.html) exercise the separate outputs.

`npm run watch:css` updates the two expanded files while editing Sass. Run `npm run build` again before validating or distributing minified files. `npm run measure` reports raw and gzip sizes. The build checks enforce the [release budgets](COMPARISON.md) and reject optional selectors inside core.

`npm run test:browser` builds the site and runs six browser journeys in Chromium, Firefox, and WebKit. The browser binaries must be installed separately (for example, `npx playwright install --with-deps` on a CI runner). The CI run for commit `dd3398f` passed all 18 journeys; rerun after later changes.

`npm pack` runs the build and checks, then includes the four CSS files, Sass sources, README, license, and package manifest. `npm run check:package` installs that tarball offline in a temporary project and compiles the installed Sass entry. The tarball is locally installable; registry publication and a downloadable GitHub Release remain separate gates in [ROADMAP.md](../ROADMAP.md). Node 24 is required for building this checkout, not for consuming the generated CSS.

## Build the standalone documentation site

```bash
npm run site
npm run check:site
python3 -m http.server 8766 --directory site
```

Open `http://127.0.0.1:8766/`. The ignored `site/` directory contains the documentation page, local CSS/JavaScript, and [three runnable journeys](EXAMPLES.md) alongside the source fixtures. All paths are relative, so the same output can be served under a project subpath. `check:site` verifies local references, including iframe sources, and compares staged CSS bytes with the build. A public deployment still requires its own verification.
