# PhoenixCSS

**PhoenixCSS** is an early-stage Sass/CSS project for semantic HTML pages with optional layout and component classes. The source builds, but the package, responsive behavior, accessibility, and documentation are being brought to a verified first release.

## Current source

- Sass modules for base HTML, forms, a 12-column grid, utility classes, and components.
- CSS custom properties for colors, fonts, spacing, and other values.
- A [light palette override example](docs/THEMING.md) with measured color pairs.
- A local documentation page with examples.

These are source capabilities, not a claim that all breakpoints, themes, accessibility paths, or distribution flows are validated. See the [product contract](docs/PRODUCT.md) and [roadmap](ROADMAP.md).

## Installation

Use Node.js 24 (the version in [`.node-version`](.node-version)) and npm. See the [build guide](docs/BUILD.md) for the supported entry points and checks.

### 1. Clone the Repository

```bash
git clone https://github.com/OthmaneBlial/phoenixcss.git
cd phoenixcss
```

### 2. Install Dependencies

```bash
npm ci
```

## Usage

### 1. Build the CSS

```bash
npm run build
```

This command compiles Sass and emits two variants:

| File                            | Contents                                                                |
| ------------------------------- | ----------------------------------------------------------------------- |
| `dist/css/phoenix.core.min.css` | Native HTML styles and design tokens.                                   |
| `dist/css/phoenix.min.css`      | Core plus optional classes for components, grid, utilities, and layout. |

Expanded files with the same names minus `.min` are also generated. The [core example](examples/core.html) and [full example](examples/themed.html) can be opened after the build.

### 2. Development Mode

```bash
npm run dev
```

This command watches Sass files and updates the expanded files. Run `npm run build` to refresh the minified files.

### 3. Include in Your Project

After building, add the generated stylesheet to a page at a path that matches where you copied it:

```html
<link rel="stylesheet" href="path/to/phoenix.min.css" />
```

The generated CSS is currently a local build artifact. A verified installable package and downloadable release are planned in the [roadmap](ROADMAP.md).

## Contributing

Contributions are welcome. The contributor guide is a roadmap task and is not available yet.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Documentation

The [local documentation source](docs/index.html) contains examples. Run `npm run site` and serve `site/` to preview the standalone output; see the [build guide](docs/BUILD.md). A public documentation URL will be added after deployment is verified.
