# Base Setup

## 1. Node & NVM Setup

Installed and configured **NVM (Node Version Manager)**.

Installed the required Node.js version using NVM.

Verified the Node.js and npm installations:

```bash
nvm --version
node --version
npm --version
```

## 2. Project Structure

Created the project using the 7-1 Sass architecture.

```bash
src/
├── script/
│   └── index.js
└── styles/
    ├── abstracts/
    │   ├── _functions.scss
    │   ├── _mixins.scss
    │   └── _variables.scss
    ├── base/
    │   ├── _base.scss
    │   ├── _reset.scss
    │   └── _typography.scss
    ├── components/
    │   ├── _buttons.scss
    │   ├── _cards.scss
    │   └── _navbar.scss
    ├── layout/
    │   ├── _container.scss
    │   ├── _footer.scss
    │   └── _header.scss
    ├── pages/
    ├── themes/
    │   └── _default.scss
    ├── vendors/
    │   └── _icomoon.scss
    └── main.scss
```

## 3. Public Assets

Created the public folder for static assets.

```bash
public/
├── fonts/
├── images/
└── svg/
```

# Fonts

Added project fonts inside:

```bash
public/fonts/
```

# Images

Added project images inside:

```bash
public/images/
```

# SVG

Created a dedicated folder for SVG assets:

```bash
public/svg/
```

## 4. SCSS Functions

Added a reusable rem() function for converting pixel values to rem.

Location:

```bash
src/abstracts/_functions.scss

This allows values such as:

font-size: rem(16px);
margin: rem(32px);
padding: rem(24px);
```

instead of manually calculating rem values.

## 5. SCSS Mixins

Created reusable SCSS mixins for common styling patterns.

Location:

```bash
src/abstracts/_mixins.scss
```

These mixins are imported into components and layouts where required.

## 6. Variables

Created a centralized variables file for project-wide values.

Location:

```bash
src/abstracts/_variables.scss
```

Variables include reusable values such as:

Colors
Spacing
Component dimensions
Layout values

## 7. CSS Reset

Added a global SCSS reset to normalize browser default styles.

Location:

```bash
src/base/_reset.scss
```

The reset provides a consistent starting point across browsers.

## 8. Typography

Created the typography configuration inside:

```bash
src/base/_typography.scss
```

This contains the project's:

Font families
Font sizes
Font weights
Line heights
Related typography styles

## 9. IcoMoon Setup

Added the generated IcoMoon stylesheet to the vendors directory:

```bash
src/vendors/_icomoon.scss
```

The IcoMoon font and generated glyph definitions are available for use throughout the project.

Icons can be used through the generated icon classes or code points.

Example:

<span class="icon">&#xf009;</span>

## 10. IcoMoon SVG Generation

Generated the required SVG/icon assets using IcoMoon.

The generated SVG assets were added to:

```bash
public/svg/
```

The generated IcoMoon font files and stylesheet were also integrated into the project.

## 11. Main SCSS Entry Point

All required SCSS modules are imported through:

```bash
src/styles/main.scss
```

This acts as the main stylesheet entry point for the project.

Setup Summary
The setup now provides:

NVM/Node environment
7-1 SCSS architecture
Centralized variables
Reusable SCSS functions
Reusable mixins
CSS reset
Typography setup
Public asset organization
Custom fonts
IcoMoon integration
Generated SVG assets
Main SCSS entry point
