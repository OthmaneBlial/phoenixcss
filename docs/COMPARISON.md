# Comparison method and baseline

This page is a reproducible development baseline, not a claim that PhoenixCSS is faster, smaller for the same feature set, or more accessible than another project. The HTML fixture is [examples/semantic.html](../examples/semantic.html); it contains native elements and no library-specific classes.

## Reproduce

1. Install with **npm ci**.
2. Run **npm run measure:compare**. This builds PhoenixCSS, downloads the pinned npm archives listed below into a temporary directory, reports raw/gzip bytes and selector counts, and creates one page per stylesheet under the ignored **dist/comparison/** directory.
3. Serve **dist/** locally and open each generated page. Each page has byte-identical HTML; only its local **style.css** differs. Rendering and accessibility must be evaluated separately.
4. To inspect the selector inventory, run **node scripts/measure.mjs --selectors**. To consume structured numbers, pass **--json**.

The script requires Node, npm, tar, and a network connection only for **--compare**. It does not add competitor code to the repository. Gzip uses Node's zlib at level 9. A CSS rule and unique selector are counted by PostCSS; these counts are descriptive, not quality scores.

## Sources pinned for this baseline

| Sheet          | npm archive                                                                | CSS path inside archive        | Why selected                            |
| -------------- | -------------------------------------------------------------------------- | ------------------------------ | --------------------------------------- |
| Pico classless | [@picocss/pico 2.1.1](https://www.npmjs.com/package/@picocss/pico/v/2.1.1) | **css/pico.classless.min.css** | Semantic HTML without required classes. |
| Water          | [water.css 2.1.1](https://www.npmjs.com/package/water.css/v/2.1.1)         | **out/water.min.css**          | Drop-in styling for native elements.    |
| MVP            | [mvp.css 1.18.0](https://www.npmjs.com/package/mvp.css/v/1.18.0)           | **mvp.css**                    | Small classless stylesheet.             |

These sheets have different scopes, defaults, and build methods. Comparing their full package sizes would be misleading, so the table measures only the listed CSS files. The fixture shows comparable native HTML, not parity of components or theme APIs.

## Initial measurement

Measured on 19 September 2026 from the CSS at commit **da539a6**, using Node 25.9.0 and npm 11.12.1. The measuring script itself was added afterward. Build duration is one observed run, not a performance claim.

| Stylesheet       | Raw bytes | Gzip bytes | CSS rules | Unique selectors | Media queries | Inline source map |
| ---------------- | --------: | ---------: | --------: | ---------------: | ------------: | ----------------- |
| Phoenix full     |    34,061 |      5,318 |       412 |              385 |            28 | No                |
| Phoenix full min |    89,743 |     17,915 |       403 |              385 |            24 | Yes               |
| Pico classless   |    71,040 |     10,315 |       323 |              469 |            17 | No                |
| Water            |    22,668 |      3,557 |       196 |              123 |            69 | No                |
| MVP              |    10,264 |      2,656 |        89 |              116 |             4 | No                |

The measured build took about 3.0 seconds on this machine. The Phoenix minified file is larger because it contains an inline source map. Fixing that is a release requirement; its current size should not be used in marketing.

## Release budgets

The first release should meet these guardrails after the responsive and accessibility corrections:

- Core minified CSS: at most **8 KiB gzip**.
- Full minified CSS: at most **12 KiB gzip**.
- Each minified file must be smaller than its corresponding expanded file in raw bytes.
- No inline source map in a production CSS file.

These are engineering budgets, not competitive claims. If an accessibility fix requires more bytes, record the reason and revise the budget explicitly instead of dropping the fix. Re-run the measurements and browser fixture at the final release commit before publishing any size statement.
