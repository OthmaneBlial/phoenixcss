# Screenshot provenance

The first six unedited PNGs were captured from the actual staged site and examples in the [successful GitHub Actions run 35445800733](https://github.com/OthmaneBlial/phoenixcss/actions/runs/35445800733) for commit `26a6c6e` on 19 September 2026. The two host fixture PNGs came from the [successful run 35446956140](https://github.com/OthmaneBlial/phoenixcss/actions/runs/35446956140) for commit `1b4d152`; the five full-page landing captures came from the [successful run 35447229930](https://github.com/OthmaneBlial/phoenixcss/actions/runs/35447229930) for commit `694d523`; the two palette captures came from the [successful run 35447876286](https://github.com/OthmaneBlial/phoenixcss/actions/runs/35447876286) for commit `14466bb` on the same day. The nine later copies have SHA-256 hashes matching their downloaded artifacts. These browser jobs used Ubuntu 24.04.5 LTS, Playwright 1.63.0, and Chromium 153.0.8010.12 for screenshots. The test code is in [`tests/browser/journeys.spec.mjs`](../../tests/browser/journeys.spec.mjs), and the originals are in each run's `browser-report` artifact.

| File                       | Actual state                                                                        | Pixels      |
| -------------------------- | ----------------------------------------------------------------------------------- | ----------- |
| `docs-1440.png`            | Documentation hero on desktop                                                       | 1440 × 820  |
| `docs-375.png`             | Documentation hero with narrow menu                                                 | 375 × 820   |
| `guide-before.png`         | The same guide after its real button disabled the built core CSS                    | 1280 × 720  |
| `guide-after.png`          | The guide after its real button enabled the built core CSS                          | 1280 × 720  |
| `form.png`                 | Slate form after local validation succeeded; no data was sent                       | 1280 × 1136 |
| `landing.png`              | Full CSS landing page at desktop width                                              | 1440 × 820  |
| `landing-320.png`          | Full landing page with stacked cards                                                | 320 × 1992  |
| `landing-600.png`          | Full landing page at the small breakpoint                                           | 600 × 1296  |
| `landing-768.png`          | Full landing page at the medium breakpoint                                          | 768 × 1147  |
| `landing-992.png`          | Full landing page at the large breakpoint                                           | 992 × 1095  |
| `landing-1200.png`         | Full landing page at the extra-large breakpoint                                     | 1200 × 1018 |
| `host-with-phoenix.png`    | Host fixture with the full CSS applied; host sidebar/footer retain their own styles | 1280 × 820  |
| `host-without-phoenix.png` | The same fixture after the real stylesheet was disabled                             | 1280 × 820  |
| `themed-slate.png`         | Article, form, and optional components with the slate CSS override                  | 1280 × 1245 |
| `themed-default.png`       | The same DOM after the slate stylesheet was disabled                                | 1280 × 1245 |

These show a source candidate. They do not prove a published release, external user experience, or screen-reader compatibility. Review or recapture against the final tag before making them final release evidence.
