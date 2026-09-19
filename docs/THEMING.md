# Color customization

PhoenixCSS exposes CSS custom properties for its light palette. Place overrides after the PhoenixCSS stylesheet. The [slate palette](../examples/slate.css) is a complete working example; [the themed page](../examples/themed.html) uses it with native content, a form, layout, and optional components.

```html
<html data-phx-theme="slate">
  <head>
    <link rel="stylesheet" href="path/to/phoenix.min.css" />
    <link rel="stylesheet" href="path/to/slate.css" />
  </head>
  <body>
    …
  </body>
</html>
```

The second file is an example override from this repository, not a separately published package artifact yet.

## Supported color roles

| Role            | Variables                                                                                                                   |
| --------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Content         | `--phx-surface`, `--phx-surface-muted`, `--phx-text`, `--phx-link`, `--phx-border`, `--phx-placeholder`                     |
| Focus           | `--phx-focus`                                                                                                               |
| Actions         | `--phx-action`, `--phx-action-hover`, `--phx-action-active`, `--phx-action-text`                                            |
| Status actions  | `--phx-success`, `--phx-success-hover`, `--phx-success-active`, `--phx-danger`, `--phx-danger-hover`, `--phx-danger-active` |
| Dark navigation | `--phx-nav-surface`, `--phx-nav-text`, `--phx-nav-accent`                                                                   |
| Controls        | `--phx-disabled-surface`, `--phx-disabled-border`, `--phx-select-arrow`                                                     |

The earlier `--primary-color`, `--secondary-color`, `--danger-color`, `--light-color`, and `--dark-color` tokens still feed the default roles. Override the `--phx-*` roles when creating a palette. Font and spacing variables remain available as before. Sass module variables are not a public configuration API.

The built-in palette and slate example are both light palettes. A complete dark theme and a JavaScript theme switcher are not shipped. Customizing colors requires checking normal text, form states, focus, navigation, buttons, and the select arrow against the chosen surfaces. Run `npm run build && npm run check:contrast` to check the included palettes; the script does not certify arbitrary third-party overrides.
