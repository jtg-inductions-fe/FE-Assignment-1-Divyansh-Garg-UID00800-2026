# Base Styling Setup

## Description

Added the initial SCSS foundation and reusable styling components for the project.

## Added

- **Functions** – Reusable SCSS functions for common calculations.
- **Variables** – Centralized colors, spacing, dimensions, and other design values.
- **Mixins** – Reusable styling patterns for consistent development.
- **Reset** – Global CSS reset for consistent browser styling.
- **Typography** – Base font, size, weight, and line-height styles.
- **Button Component** – Reusable button styles with Login and Sign Up variants.
- **IcoMoon** – Integrated IcoMoon styles and icon definitions.

## Files

```text
src/styles/
├── abstracts/
│   ├── _functions.scss
│   ├── _mixins.scss
│   └── _variables.scss
├── base/
│   ├── _reset.scss
│   └── _typography.scss
├── components/
│   └── _buttons.scss
└── vendors/
    └── _icomoon.scss
