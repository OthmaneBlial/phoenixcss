# Accessibility contract in progress

The first public release targets readable semantic HTML, visible keyboard focus, text contrast of at least 4.5:1, and controls that remain usable at narrow widths and 200% zoom. These are release criteria, not a claim that an accessibility audit is complete.

## Current behavior

- Native links keep their underline; lists keep markers; table headers remain in the table structure when the table scrolls horizontally.
- Text and form controls use a visible `:focus-visible` outline. Navigation on a dark background uses a lighter outline token.
- The default and slate palette pairs tested by `npm run check:contrast` meet 4.5:1 for text and 3:1 for the listed control borders and focus outlines. That script checks the listed pairs; it does not test every page or state.
- Reduced motion turns off smooth page scrolling and shortens CSS animations and transitions.

## Errors need a message

An error border uses a dashed line so color is not its only signal. Set `aria-invalid="true"` on the control and connect it to a visible message with `aria-describedby`. Start the message with a word such as “Error” that conveys the state without color.

```html
<label for="email">Email</label>
<input
  id="email"
  name="email"
  type="email"
  aria-invalid="true"
  aria-describedby="email-error"
/>
<p class="form-error" id="email-error">Error: enter a valid email address.</p>
```

Use the same pattern for `.input--error`, `.select--error`, `.textarea--error`, `.checkbox--error`, and `.radio--error`. An error class alone cannot explain the problem to a person using a screen reader.

## Validation and remaining work

The [CI browser run for commit `14466bb`](https://github.com/OthmaneBlial/phoenixcss/actions/runs/35447876286) passed 27 tests across Chromium, Firefox, and WebKit. The journeys check the documentation's menu and native dialog, the guide's CSS toggle, form feedback, grid breakpoints, reduced-motion scrolling, narrow-page overflow, host-style coexistence, both light palettes on the same DOM, and console errors. An axe-core 4.13.0 audit found no detected WCAG A/AA violations on eight states: documentation, open dialog, guide, form, form error, landing page, slate theme, and host fixture. The earlier audit exposed a serious footer text contrast defect; it was corrected before this green run. These are automated results, not a screen-reader pass or a full accessibility audit.

The [roadmap](../ROADMAP.md) still requires manual keyboard and screen-reader sessions, 200% zoom and reduced-motion checks across the support matrix, and review of theme and control states. Record browser and assistive-technology versions with each manual result.
