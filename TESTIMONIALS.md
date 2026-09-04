# Testimonials Component

## Overview

The testimonials component has been implemented across HTML, JavaScript, and SCSS files.

## File Structure

```text
src/
├── script/
│   └── script.js
└── styles/
    └── components/
        ├── _carousel.scss

index.html
```

## Implementation

### HTML

The testimonials markup has been added to:

`index.html`

The HTML contains the structure for the site testimonials.

### JavaScript

The carousel functionality has been implemented in:

`src/script/script.js`

The JavaScript handles the interactive behavior of the testimonials the working of the carousel using the Embla carousel library.
I am using the Embla Carousel library underneth for the implementation of the carousel.

```bash
import EmblaCarousel from "embla-carousel";
```

For now the automatic slide changing is not added as not asked in the assignment.

### SCSS

The testimonial styles are separated and present in \_carousel.scss:

#### `_carousel.scss`

`src/styles/components/_carousel.scss`

Contains the styles responsible for the overall testimonial layout and appearance.

## Files Modified

| File                                   | Purpose                        |
| -------------------------------------- | ------------------------------ |
| `index.html`                           | Testimonial HTML structure     |
| `src/script/script.js`                 | Carousel interactions          |
| `src/styles/components/_carousel.scss` | Testimonial layout and styling |

## Notes

The testimonial follows the project's component-based SCSS architecture.
