# Header Component

## Overview

The header component has been implemented across HTML, JavaScript, and SCSS files.

## File Structure

```text
src/
├── script/
│   └── script.js
└── styles/
    └── components/
        ├── _header.scss
        └── _navbar.scss

index.html
```

## Implementation

### HTML

The header markup has been added to:

`index.html`

The HTML contains the structure for the site header, including the navigation area, branding, navigation links, and action buttons.

### JavaScript

The header functionality has been implemented in:

`src/script/script.js`

The JavaScript handles the interactive behavior of the header/navigation.

### SCSS

The header styles are separated into two component files:

#### `_header.scss`

`src/styles/components/_header.scss`

Contains the styles responsible for the overall header layout and appearance.

#### `_navbar.scss`

`src/styles/components/_navbar.scss`

Contains the navigation-specific styles, including navigation links and navbar elements.

## Component Structure

```text
Header
│
├── Logo / Branding
│
├── Navigation
│   ├── Navigation Links
│   └── Navigation Items
│
└── Actions
    ├── Login
    └── Sign Up
```

## Files Modified

| File                                 | Purpose                        |
| ------------------------------------ | ------------------------------ |
| `index.html`                         | Header HTML structure          |
| `src/script/script.js`               | Header/navigation interactions |
| `src/styles/components/_header.scss` | Header layout and styling      |
| `src/styles/components/_navbar.scss` | Navbar and navigation styling  |

## Notes

The header follows the project's component-based SCSS architecture. Header and navbar styles are kept separate to make the code easier to maintain and reuse.
