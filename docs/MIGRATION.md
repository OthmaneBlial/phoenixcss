# Class migration before the first public release

The manifest began at `1.0.0`, but no package or GitHub release had been verified when this work started. This table records source-level breaking changes before a credible public release. Existing sites using the earlier checkout should update their markup.

| Earlier selector                                                   | Current selector                                                                   | Reason                                                                                       |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `.header`, `.header__logo`, `.header__nav`                         | `.phx-header`, `.phx-header__logo`, `.phx-header__nav`                             | Avoid styling an unrelated site's header.                                                    |
| `.sidebar`, `.sidebar__title`, `.sidebar__nav`, `.sidebar--active` | `.phx-sidebar`, `.phx-sidebar__title`, `.phx-sidebar__nav`, `.phx-sidebar--active` | Avoid altering a host sidebar.                                                               |
| `.main-content`                                                    | `.phx-main`                                                                        | Avoid layout shifts in a host application.                                                   |
| `.footer`                                                          | `.phx-footer`                                                                      | Avoid styling an unrelated footer.                                                           |
| `.align-baseline` for `vertical-align`                             | `.vertical-baseline`                                                               | The former selector also set `align-items`; `.align-baseline` now only means flex alignment. |

For example:

```html
<aside class="phx-sidebar">
  <div class="phx-sidebar__title">On this page</div>
  <nav class="phx-sidebar__nav" aria-label="On this page">…</nav>
</aside>
<main class="phx-main">…</main>
<footer class="phx-footer">…</footer>
```

The `.nav`, `.btn`, `.card`, `.container`, `.row`, grid, and utility selectors are still generic. Test the full stylesheet inside an existing design system before adopting it; the planned core stylesheet offers a smaller native-HTML surface once built. No scoped or fully prefixed variant exists yet.
