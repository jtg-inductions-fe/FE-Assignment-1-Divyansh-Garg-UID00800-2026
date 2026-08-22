# Footer Component

## Overview

The footer component has been implemented across HTML, JavaScript, and SCSS files.

## File Structure

```text
src/
├── script/
│   └── script.js
└── styles/
    └── components/
        ├── _site-links.scss
    |__layout/
        |── _footer.scss

index.html
```

## Implementation

### HTML

The footer markup has been added to:

`index.html`

The HTML contains the structure for the site testimonials.

### JavaScript

The the accordion functionality has been implemented in:

`src/script/script.js`

The JavaScript handles the interactive behavior of the the drop down of the footer sections links.

For now the transitiion is not been set to the drop down.

### SCSS

The footer styles are separated and are present in the two seperate files.

#### `_site-links.scss`

`src/styles/components/_site-links.scss`

Contains the styles responsible for the overall footer layout and appearance including the use of the grid for internal links.

#### `_footer.scss`

`src/styles/layout/_footer.scss`

Contains the styles responsible for the site-links section and also the static image which we are setting in the bottom of the page.

## Files Modified

| File                                     | Purpose                       |
| ---------------------------------------- | ----------------------------- |
| `index.html`                             | Footer HTML structure         |
| `src/script/script.js`                   | Accordion interactions        |
| `src/styles/components/_site-links.scss` | Site links layout and styling |
| `src/styles/layout/_footer.scss`         | Footer layout and styling     |

## Notes

The footer follows the project's component-based SCSS architecture.
