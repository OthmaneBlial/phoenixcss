# Building PhoenixCSS

Use Node.js 24.21.0 (see [`.node-version`](../.node-version)) and npm. From a clean checkout:

```bash
npm ci
npm run build
npm run check:css
npm run check:contrast
```

The build emits four ignored local artifacts:

| File                            | Source                 | Contents                                                                    |
| ------------------------------- | ---------------------- | --------------------------------------------------------------------------- |
| `dist/css/phoenix.core.css`     | `src/sass/core.scss`   | Expanded native HTML styles and CSS variables.                              |
| `dist/css/phoenix.core.min.css` | `src/sass/core.scss`   | Minified core for a page.                                                   |
| `dist/css/phoenix.css`          | `src/sass/_index.scss` | Expanded core plus optional forms, grid, utilities, components, and layout. |
| `dist/css/phoenix.min.css`      | `src/sass/_index.scss` | Minified full stylesheet for a page.                                        |

The build cleans `dist/` once, compiles both Sass entries, and minifies them through PostCSS/cssnano with source maps disabled. It does not install a runtime dependency into a consumer page. The [core fixture](../examples/core.html) and [full fixture](../examples/themed.html) exercise the separate outputs.

`npm run watch:css` updates the two expanded files while editing Sass. Run `npm run build` again before validating or distributing minified files. `npm run measure` reports raw and gzip sizes. The build checks enforce the [release budgets](COMPARISON.md) and reject optional selectors inside core.

These local outputs are not yet an npm package or a downloadable release. The packaging and public release gates remain in [ROADMAP.md](../ROADMAP.md).
