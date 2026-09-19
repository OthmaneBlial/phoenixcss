# PhoenixCSS

**PhoenixCSS** is an early-stage Sass/CSS project for semantic HTML pages with optional layout and component classes. The source builds, but the package, responsive behavior, accessibility, and documentation are being brought to a verified first release.

## Current source

- Sass modules for base HTML, forms, a 12-column grid, utility classes, and components.
- CSS custom properties for colors, fonts, spacing, and other values.
- A [light palette override example](docs/THEMING.md) with measured color pairs.
- A local documentation page with examples.

These are source capabilities, not a claim that all breakpoints, themes, accessibility paths, or distribution flows are validated. See the [product contract](docs/PRODUCT.md) and [roadmap](ROADMAP.md).

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/OthmaneBlial/phoenixcss.git
cd phoenixcss
```

### 2. Install Dependencies

```bash
npm install
```

## Usage

### 1. Build the CSS

```bash
npm run build
```

This command:

- Compiles SASS to CSS
- Minifies the CSS for production

### 2. Development Mode

```bash
npm run dev
```

This command watches SASS files and recompiles them automatically during development.

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

The [local documentation source](docs/index.html) contains examples. Run the build before opening it locally so its relative CSS path resolves. A public documentation URL will be added after deployment is verified.
