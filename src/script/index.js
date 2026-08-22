/**
 * @typedef MediaQueryList
 * @type {number}
 */

/**
 * @typedef NavigationLink
 * @type {HTMLElement}
 */

/**
 * media query value which is used for handling the layout of the navbar on different screen sizes
 * @type {MediaQueryList}
 */
const mobileQuery = window.matchMedia('(max-width: 430px)');

/** @type {MediaQueryList} */
const tabletQuery = window.matchMedia(
    '(min-width: 431px) and (max-width: 1024px)',
);

/** @type {MediaQueryList} */
const desktopQuery = window.matchMedia('(min-width: 1025px)');

/**
 * the main container of the navbar
 * @type {HTMLElement}
 */
const navbar = document.querySelector('.navbar');

/**
 * menu list element which is used for showing the list in mobile view with hamburger function.
 * @type {HTMLElement}
 */
const menu = navbar.querySelector('.navbar__menu');

/**
 * listens for the height changes in the y direction
 * applying specific styling to the navbar in the scrolled view
 * @type {HTMLDocument}
 * @event scroll
 * */
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-shorter');
        menu.classList.add('navbar__menu-shorter');
    } else {
        navbar.classList.remove('navbar-shorter');
        menu.classList.remove('navbar__menu-shorter');
    }
});

/**
 * logo of the site for placing according to the media query
 * @type {HTMLElement}
 * */
const logo = navbar.querySelector('.navbar__logo');

/**
 * action btn element which is getting used for hiding and showing the element according to the media query
 * @type {HTMLElement}
 * */
const actions = navbar.querySelector('.navbar__actions');

/**
 * mobile hamburger button getting used for toggling the expanded view of navbar, specially menu items and actions
 * @type {HTMLElement}
 * */
const toggle = navbar.querySelector('.navbar__toggle');

/**
 * funciton which helps in dynamically aligning the navbar components according to the media query
 * @param {number} viewportSize
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

/**
 * calling the function initially so that the changes could be load at the time of page loading only
 * @event change
 * @param {MediaQueryList}
 * @returns {void}
 */
updateNavbarOrder();

/**
 * calling the function when the mediaquery get changes
 * @event change
 * @param {MediaQueryList}
 * @returns {void}
 */
mobileQuery.addEventListener('change', updateNavbarOrder);
tabletQuery.addEventListener('change', updateNavbarOrder);
desktopQuery.addEventListener('change', updateNavbarOrder);

/**
 * event listner which is reponsible for the toggling of the hamburger and expanding and compressing of the navbar
 * @return {void}
 * @event click
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
 * Handles the collapse of the mobile menu when it is already open.
 * Using the Escape key for closing the expanded navbar helping in the accessibility
 * @event keydown
 * @return {void}
 */
document.addEventListener('keydown', (e) => {
    if (
        e.key === 'Escape' &&
        menu.classList.contains('navbar__menu--is-open')
    ) {
        menu.classList.remove('navbar__menu--is-open');
        toggle.setAttribute('aria-expanded', false);
        toggle.setAttribute('aria-label', 'Open navigation menu');
    }
});

/**
 * Function for adding the actions element into the menu items automatically when mobile media query is find
 * @event change
 * @param {MediaQueryList}
 * @returns {void}
 */
function addingActions(e) {
    if (e.matches) menu.append(actions);
}

/**
 * calling the function intially so that the chanages could be applied at the time of page loading only
 * @event change
 * @param {MediaQueryList}
 * @returns {void}
 */
addingActions(mobileQuery);

/**
 * calling the function when the mediaquery get changes
 * @event change
 * @param {MediaQueryList}
 * @returns {void}
 */
mobileQuery.addEventListener('change', addingActions);

/**
 * each navigation items which is getting used for changing the current view of the page and also the active link status.
 * @type {NodeListOf<HTMLElement>}
 * */
const navLinks = document.querySelectorAll('.navbar__link');

/**
 * Adding the event to each navigation link which is used for toggle the status of the active link
 * and making all the other links inactive by looping on them
 * @type {NodeListOf<HTMLElement>}
 * @param {NavigationLink}
 * @event click
 * */
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

import EmblaCarousel from 'embla-carousel';

const wrapperNode = document.querySelector('.embla');

const viewportNode = wrapperNode.querySelector('.embla__viewport');
const prevButtonNode = wrapperNode.querySelector('.embla__prev');
const nextButtonNode = wrapperNode.querySelector('.embla__next');
const dotsNode = wrapperNode.querySelector('.testimonials__dots');
const dotNodes = dotsNode.querySelectorAll('.testimonials__dot');

const emblaApi = EmblaCarousel(viewportNode, {
    loop: false,
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

const updateActiveDot = (emblaApi) => {
    const selectedIndex = emblaApi.selectedScrollSnap();

    dotNodes.forEach((dotNode, index) => {
        const isActive = index === selectedIndex;

        dotNode.classList.toggle('testimonials__dot--active', isActive);

        dotNode.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
};

updateActiveDot(emblaApi);

emblaApi.on('select', updateActiveDot);

const toggles = document.querySelectorAll('.footer__section-toggle');

toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
        const section = toggle.closest('.footer__section');
        const contentId = toggle.getAttribute('aria-controls');
        const content = document.getElementById(contentId);

        const isOpen = toggle.getAttribute('aria-expanded') === 'true';

        toggles.forEach((toggleAgain) => {
            if (toggleAgain !== toggle) {
                const otherSection = toggleAgain.closest('.footer__section');

                const otherContentId =
                    toggleAgain.getAttribute('aria-controls');

                const otherContent = document.getElementById(otherContentId);

                toggleAgain.setAttribute('aria-expanded', 'false');
                otherContent.hidden = true;

                otherSection.classList.remove('footer__section--open');
            }
        });

        toggle.setAttribute('aria-expanded', !isOpen);
        content.hidden = isOpen;

        section.classList.toggle('footer__section--open', !isOpen);
    });
});
