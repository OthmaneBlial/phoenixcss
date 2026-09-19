# PhoenixCSS product contract

## Audience and problem

PhoenixCSS is for developers building documentation pages, articles with forms, and small marketing or product pages. Those developers want readable HTML before they choose a component system or JavaScript framework.

The first public release should make a semantic HTML page pleasant to read after adding one stylesheet. A small set of optional classes should then cover layout, buttons, cards, and navigation. The library should not require JavaScript at runtime. Interactive examples may include explicitly documented JavaScript or native browser elements.

This is a target for the first release, not a claim that the current checkout meets it. The measured gaps are in [ROADMAP.md](../ROADMAP.md).

## Three reference journeys

1. **Documentation page:** article headings, paragraphs, lists, code, links, tables, and a navigation area remain readable on a phone and at 200% zoom. No class is required for ordinary content.
2. **Article with a form:** native labels, inputs, select, radio, checkbox, textarea, validation message, and submit button work with keyboard and pointer. Optional classes may refine a control but must not be required for basic readability.
3. **Small landing page:** native headings and content are supplemented with an optional container, grid, card, and button. Columns stack on small screens. A navigation menu and modal, if shown, have a documented interaction contract.

The same three journeys are the acceptance fixtures for responsive behavior, theming, documentation, and the final demo.

## Scope for the first public release

- **Core stylesheet:** readable native HTML content and controls, focus indication, responsive media, design tokens, and a documented way to override them.
- **Full stylesheet:** the core plus optional layout utilities and components. The full build remains CSS; it does not promise a JavaScript component runtime.
- **Customization:** CSS custom properties are the stable user-facing path. Sass configuration is offered only after its entry points and compatibility are tested.
- **Themes:** light and dark are release goals only if both are complete and tested across all reference journeys. Until then, describe variable overrides as customization, not a theme switcher.
- **Distribution:** a downloadable CSS file and a package whose declared entry points exist in the tarball. Compiled CSS files, not operating-system executables, are the release artifacts.

## Current source surface and release decisions

| Area | Current source | Release decision |
| --- | --- | --- |
| Native HTML | Global reset, typography, forms, tables | Keep a small semantic base; restore recognizable links and lists, and avoid forcing every form into one layout. |
| Optional classes | Buttons, cards, grid, utilities, nav, modal, layout | Preserve the useful behavior, repair breakpoints and collisions, and document any class migration before release. |
| CSS variables | Unprefixed colors, fonts, spacing, breakpoints | Define semantic tokens and a stable override example. CSS variables must not be used as media query thresholds. |
| Interactions | Documentation-local menu and modal scripts | Make scripts clearly optional and complete, or use native elements. Never call CSS alone an accessible modal. |
| Build | One full CSS and one nominally minified CSS | Deliver reproducible core and full entry points and measured sizes without an inline source map. |

Class names in the current checkout are not a published compatibility promise. Changes to a working class should preserve its purpose and include a migration example. This choice lets the first real release fix the existing generic layout collisions without silently changing usage.

## Support and evidence policy

- **Target browsers:** current Chromium, Firefox, and WebKit engines, with desktop and mobile widths listed in the roadmap. This is a test target, not a verified support claim yet.
- **Accessibility target:** WCAG AA contrast for normal text and visible keyboard focus across the reference journeys. Automated checks are necessary but not sufficient; manual keyboard and screen-reader checks are required before release.
- **Performance target:** measure raw and gzip CSS bytes from built artifacts. Do not claim to be smaller or faster than another library without the same fixture, exact version, and method.
- **Non-goals for the first release:** a JavaScript application framework, a large component catalog, a visual builder, claims about search-engine ranking, and a promise of adoption or GitHub stars.

## Review gate

The product language and the three reference journeys should be tested with two developers who did not author the project. Record what they tried, where they hesitated, and whether they could select the correct entry point within two minutes. This external-reader gate remains open until that evidence exists.
