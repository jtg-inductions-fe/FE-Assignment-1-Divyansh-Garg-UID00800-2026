/**
 * Media query objects to handle dynamic responsive layout changes.
 * @type {MediaQueryList}
 */
const mobileQuery = window.matchMedia('(max-width: 430px)');

/** @type {MediaQueryList} */
const tabletQuery = window.matchMedia(
    '(min-width: 431px) and (max-width: 1024px)',
);

/** @type {MediaQueryList} */
const desktopQuery = window.matchMedia('(min-width: 1025px)');

/* ==========================================================================
   NAVBAR LOGIC
   ========================================================================== */

/** @type {HTMLElement} The main navigation bar container. */
const navbar = document.querySelector('.navbar');

/** @type {HTMLElement} The navigation menu container containing links. */
const menu = navbar.querySelector('.navbar__menu');

/**
 * Listens for scroll events to shrink the navbar after passing a specific threshold.
 * Adds or removes styling modifiers based on the vertical scroll position.
 */
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-shorter');
        menu.classList.add('navbar__menu-shorter');
    } else {
        navbar.classList.remove('navbar-shorter');
        menu.classList.remove('navbar__menu-shorter');
    }
});

/** @type {HTMLElement} The site branding logo element. */
const logo = navbar.querySelector('.navbar__logo');

/** @type {HTMLElement} Action elements like buttons. */
const actions = navbar.querySelector('.navbar__actions');

/** @type {HTMLElement} The mobile hamburger toggle button. */
const toggle = navbar.querySelector('.navbar__toggle');

/**
 * Dynamically reorders structural navbar components inside the DOM
 * based on current active media query breakpoints.
 *
 * @returns {void}
 */
function updateNavbarOrder() {
    if (mobileQuery.matches) {
        navbar.append(logo, toggle);
    } else if (tabletQuery.matches) {
        navbar.append(toggle, logo, actions);
    } else if (desktopQuery.matches) {
        navbar.append(logo, menu, actions);
    }
}

// Initial arrangement and binding listeners for viewport updates
updateNavbarOrder();
mobileQuery.addEventListener('change', updateNavbarOrder);
tabletQuery.addEventListener('change', updateNavbarOrder);
desktopQuery.addEventListener('change', updateNavbarOrder);

/**
 * Handles clicks on the mobile toggle button to expand or collapse
 * the responsive mobile navigation menu while maintaining accessible attributes.
 */
toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('navbar__menu--is-open');

    toggle.classList.toggle('navbar__menu--is-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
    toggle.setAttribute(
        'aria-label',
        isOpen ? 'Close navigation menu' : 'Open navigation menu',
    );
});

/**
 * Automatically appends the user actions section into the main menu container
 * specifically when the mobile screen query condition matches.
 *
 * @param {MediaQueryList | MediaQueryListEvent} e - The query match status context object.
 * @returns {void}
 */
function addingActions(e) {
    if (e.matches) menu.append(actions);
}

// Handle positioning adjustments for action clusters
addingActions(mobileQuery);
mobileQuery.addEventListener('change', addingActions);

/** @type {NodeListOf<HTMLElement>} Individual navigational anchor items. */
const navLinks = document.querySelectorAll('.navbar__link');

/**
 * Attaches pointer interactions to navigation links.
 * Clears prior active styling states and forces the mobile drawer shut on click.
 */
navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        document
            .querySelector('.navbar__link-active-link')
            ?.classList.remove('navbar__link-active-link');

        link.classList.add('navbar__link-active-link');

        menu.classList.remove('navbar__menu--is-open');
        toggle.classList.remove('navbar__menu--is-open');

        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation menu');
    });
});

/* ==========================================================================
   TESTIMONIAL CAROUSEL LOGIC
   ========================================================================== */

import EmblaCarousel from 'embla-carousel';

/** @type {HTMLElement} Core shell element containing the carousel. */
const wrapperNode = document.querySelector('.embla');

/** @type {HTMLElement} Mask view panel for the slider tracks. */
const viewportNode = wrapperNode.querySelector('.embla__viewport');

/** @type {HTMLElement} Carousel backwards step controller button. */
const prevButtonNode = wrapperNode.querySelector('.embla__prev');

/** @type {HTMLElement} Carousel forwards step controller button. */
const nextButtonNode = wrapperNode.querySelector('.embla__next');

/** @type {HTMLElement} Node wrapper housing individual dots trackers. */
const dotsNode = wrapperNode.querySelector('.testimonials__dots');

/** @type {NodeListOf<HTMLElement>} Node array grouping individual visual indicator elements. */
const dotNodes = dotsNode.querySelectorAll('.testimonials__dot');

/**
 * Instantiated API instance controlling slide engine executions.
 * @type {Object}
 */
const emblaApi = EmblaCarousel(viewportNode, {
    loop: true,
});

prevButtonNode.addEventListener('click', () => {
    emblaApi.scrollPrev();
});

nextButtonNode.addEventListener('click', () => {
    emblaApi.scrollNext();
});

dotNodes.forEach((dotNode, index) => {
    dotNode.addEventListener('click', () => {
        emblaApi.scrollTo(index);
    });
});

/**
 * Synchronizes the visual active states and accessibility indicators
 * across the navigation dot cluster matching the current active index.
 *
 * @param {Object} emblaApi - The active instance controlling carousel interactions.
 * @returns {void}
 */
const updateActiveDot = (emblaApi) => {
    const selectedIndex = emblaApi.selectedScrollSnap();

    dotNodes.forEach((dotNode, index) => {
        const isActive = index === selectedIndex;

        dotNode.classList.toggle('testimonials__dot--active', isActive);
        dotNode.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
};

// Sync dot trackers instantly and hook slide navigation updates
updateActiveDot(emblaApi);
emblaApi.on('select', updateActiveDot);

/* ==========================================================================
   FOOTER SECTION LOGIC
   ========================================================================== */

/** @type {NodeListOf<HTMLElement>} Mobile breakdown toggle selectors inside the layout footer. */
const toggles = document.querySelectorAll('.footer__section-toggle');

/**
 * Manages click parameters across footer column drawers.
 * Displays hidden sublist areas and forces closing other rows to emulate accordion panels.
 */
toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
        const section = toggle.closest('.footer__section');
        const contentId = toggle.getAttribute('aria-controls');
        const content = document.getElementById(contentId);

        const isOpen = toggle.getAttribute('aria-expanded') === 'true';

        // Standard close loop for remaining accordion sections
        toggles.forEach((toggleAgain) => {
            if (toggleAgain !== toggle) {
                const otherSection = toggleAgain.closest('.footer__section');
                const otherContentId =
                    toggleAgain.getAttribute('aria-controls');
                const otherContent = document.getElementById(otherContentId);

                toggleAgain.setAttribute('aria-expanded', 'false');
                otherContent.classList.add('footer__section-list-hidden');
                otherSection.classList.remove('footer__section--open');
            }
        });

        // Toggle state indicators for current target section
        toggle.setAttribute('aria-expanded', !isOpen);
        content.classList.toggle('footer__section-list-hidden');
        section.classList.toggle('footer__section--open', !isOpen);
    });
});
