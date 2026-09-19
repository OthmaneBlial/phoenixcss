# Runnable example pages

Build once with Node 24 and serve the checkout:

```bash
npm ci
npm run build
python3 -m http.server 8765
```

Open these pages from `http://127.0.0.1:8765/examples/`:

| Page                                       | Stylesheet                                               | What to try                                                                                                                                                                          |
| ------------------------------------------ | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`guide.html`](../examples/guide.html)     | Built core CSS                                           | Use **Remove PhoenixCSS** and **Apply PhoenixCSS**. The same HTML stays in place while the actual stylesheet is disabled or enabled. Follow the article links and inspect the table. |
| [`form.html`](../examples/form.html)       | Built core CSS plus [`slate.css`](../examples/slate.css) | Submit an empty form, observe the text error and focus, enter a valid email, then submit again. The example validates locally and sends nothing.                                     |
| [`landing.html`](../examples/landing.html) | Built full CSS                                           | Follow real links to the other two pages. Resize from desktop to narrow mobile width to see the two cards stack. The navigation is made of ordinary links and needs no script.       |

The optional JavaScript embedded in the guide and form pages only powers the comparison toggle and local validation feedback. PhoenixCSS itself is CSS only. None of these pages represents a backend, hosted form, package registry installation, or public release.

`npm run site` also copies these pages into the standalone `site/examples/` directory with paths rewritten to the exact staged CSS bytes. Run `npm run check:site` before sharing that output.

Screenshots should be captured only after the browser matrix and visual states in phases 3 and 4 of the [roadmap](../ROADMAP.md) are complete. Record the commit, browser version, viewport, and state alongside each screenshot; keep the source pages runnable so a reader can reproduce every image.
