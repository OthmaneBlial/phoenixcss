# Responsive layout contract

PhoenixCSS uses four compile-time Sass breakpoints: **sm 600 px**, **md 768 px**, **lg 992 px**, and **xl 1200 px**. They are minimum widths. CSS custom properties cannot change media query thresholds at runtime.

## Columns

Use a **.container** around a **.row**. Direct children whose class starts with **col-**, or includes a **col-** class, receive the grid gutter and fill the row below 600 px.

- **.col-4** fills the row below 600 px and uses 4 of 12 columns from 600 px upward.
- **.col-md-6** fills the row below 768 px and uses 6 of 12 columns from 768 px upward.
- **.col** fills the row below 600 px, then shares the remaining row space equally with other plain **.col** children.
- **.offset-1** through **.offset-11** add an offset from 600 px upward; there is no mobile offset.
- **.gutter-0** through **.gutter-3** change the row gutter without changing the column fractions.

For example, three direct **.col-4** children stack at 320 px and form three equal columns at 600 px. Pair **.col-12** with **.col-md-6** when a column should remain full width through the small breakpoint and split at 768 px.

## Display utilities

Unqualified display classes such as **.d-none** apply at every width. The qualified classes **.d-sm-block**, **.d-md-flex**, **.d-lg-grid**, and **.d-xl-none** apply from their breakpoint upward. Later breakpoints override earlier classes when both are present. To show an element only below 768 px, combine **.d-block** and **.d-md-none**.

The old source used irregular, partly invalid ranges for display utilities. If a page relied on those ranges, replace its classes with the minimum-width convention above.

## Navigation and sidebar

The base **.nav** wraps links instead of hiding them without a toggle. The **.phx-sidebar** remains in document flow. The documentation demo adds a JavaScript toggle on narrow screens; without that script, its links remain visible. See [MIGRATION.md](MIGRATION.md) for the renamed structural layout classes.

These rules are compiled and covered by the [browser journeys](../tests/browser/journeys.spec.mjs) in Chromium, Firefox, and WebKit CI. The landing grid was also measured in Chrome at 320, 375, 600, 768, 992, 1200, and 1440 px; it stacks below 600 px without document overflow. Offset variants and assistive-technology behavior still need the manual review in task 1.1 of [ROADMAP.md](../ROADMAP.md).
