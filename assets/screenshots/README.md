# Screenshot provenance

These six unedited PNGs were captured from the actual staged site and examples in the [successful GitHub Actions run 35445800733](https://github.com/OthmaneBlial/phoenixcss/actions/runs/35445800733) for commit `26a6c6e` on 19 September 2026. The browser job used Ubuntu 24.04.5 LTS, Playwright 1.63.0, and Chromium 153.0.8010.12. The test code is in [`tests/browser/journeys.spec.mjs`](../../tests/browser/journeys.spec.mjs), and the original files are in that run's `browser-report` artifact.

| File               | Actual state                                                     | Pixels      |
| ------------------ | ---------------------------------------------------------------- | ----------- |
| `docs-1440.png`    | Documentation hero on desktop                                    | 1440 × 820  |
| `docs-375.png`     | Documentation hero with narrow menu                              | 375 × 820   |
| `guide-before.png` | The same guide after its real button disabled the built core CSS | 1280 × 720  |
| `guide-after.png`  | The guide after its real button enabled the built core CSS       | 1280 × 720  |
| `form.png`         | Slate form after local validation succeeded; no data was sent    | 1280 × 1136 |
| `landing.png`      | Full CSS landing page at desktop width                           | 1440 × 820  |

These show a source candidate. They do not prove a published release, external user experience, or screen-reader compatibility. Review or recapture against the final tag before making them final release evidence.
