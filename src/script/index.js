/**
 * @typedef MediaQueryList
 * @type {object}
 */

/**
 * @typedef NavigationLink
 * @type {HTMLElement}
 */

/**
 * @typedef CarouselSlide
 * @type {HTMLElement}
 */

/**
 * @typedef DotNode
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
 * function which is responsible for applying throttle to function passed
 * @returns {Function}
 * */
function handleScrollThrottle(fn, delay = 200) {
    let scrolling = false;

    window.addEventListener('scroll', () => {
        if (!scrolling) {
            scrolling = true;

            setTimeout(() => {
                scrolling = false;
                fn();
            }, delay);
        }
    });
}

/**
 * function which is responsible for changing the navbar style according to the scroll value
 * @returns {void}
 * */
function handleScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-shorter');
        menu.classList.add('navbar__menu-shorter');
    } else {
        navbar.classList.remove('navbar-shorter');
        menu.classList.remove('navbar__menu-shorter');
    }
}

/**
 * calling the throttle function with scroll callback function to handle scrolling with throttle applied
 * @param {Function}
 * */
handleScrollThrottle(handleScroll);

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
 * funciton which helps in dynamically updating the navbar components order according to the viewport
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
 * event listener which is reponsible for the toggling of the menu items
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
function addAuthActionButtons(e) {
    if (e.matches) menu.append(actions);
}

/**
 * calling the function initially so that the chanages could be applied at the time of page loading only
 * @event change
 * @param {MediaQueryList}
 * @returns {void}
 */
addAuthActionButtons(mobileQuery);

/**
 * calling the function when the mediaquery get changes
 * @event change
 * @param {MediaQueryList}
 * @returns {void}
 */
mobileQuery.addEventListener('change', addAuthActionButtons);

/**
 * Adding the event to each navigation link which is used for toggle the status of the active link
 * and making all the other links inactive by looping on them
 * @type {NodeListOf<HTMLElement>}
 * @param {NavigationLink}
 * @event click
 * */
menu.addEventListener('click', (e) => {
    const link = e.target.closest('.navbar__link');
    if (!link) return;
    menu.querySelector('.navbar__link-active-link').classList.remove(
        'navbar__link-active-link',
    );

    link.classList.add('navbar__link-active-link');

    menu.classList.remove('navbar__menu--is-open');
    toggle.classList.remove('navbar__menu--is-open');

        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation menu');
    });
});

/**
 * adding the embla carousel libraray for implementation of the carousel
 * used the naming convention of the elements getting used in the carousel according to the documentation
 * */
import EmblaCarousel from 'embla-carousel';

/**
 * the main shell element which is used for wrapping the whole carousel
 * @type {HTMLElement}
 */
const wrapperNode = document.querySelector('.embla');

/**
 * the viewport which is working as as slide in the carousel
 * @type {HTMLElement}
 */
const viewportNode = wrapperNode.querySelector('.embla__viewport');

/**
 * prev button elenent which is getting used for moving backward
 * @type {HTMLElement}
 */
const prevButtonNode = wrapperNode.querySelector('.embla__prev');

/**
 * next button elenent which is getting used for moving forward
 * @type {HTMLElement}
 */
const nextButtonNode = wrapperNode.querySelector('.embla__next');

/**
 * it is the element which is holding all the dot elements required for the movement of the carousel
 * @type {HTMLElement}
 */
const dotsNode = wrapperNode.querySelector('.testimonials__dots');

/**
 * a node array which has all the dot elements reponsible for the moving of carousel and getting to a spefic slide directly
 * @type {NodeListOf<HTMLElement>}
 * */
const dotNodes = dotsNode.querySelectorAll('.testimonials__dot');

/**
 * Instantiated API instance controlling slide engine executions.
 * Used for the movement of slides and for adding the more functionality
 * allowing the slides to loop and not getting ended in one direction
 * @type {Object}
 */
const emblaApi = EmblaCarousel(viewportNode, {
    loop: true,
});

/**
 * listener on the prev btn element for moving to the previous slide using the instantiated APi
 * @event click
 * @return {CarouselSlide}
 */
prevButtonNode.addEventListener('click', () => {
    emblaApi.scrollPrev();
});

/**
 * listener on the next btn element for moving to the next slide using the instantiated APi
 * @event click
 * @return {CarouselSlide}
 */
nextButtonNode.addEventListener('click', () => {
    emblaApi.scrollNext();
});

/**
 * listener on each dot element element for moving to the spefic slide using the instantiated APi
 * @event click
 * @return {DotNode}
 */
dotNodes.forEach((dotNode, index) => {
    dotNode.addEventListener('click', () => {
        emblaApi.scrollTo(index);
    });
});

/**
 * Used for synchornization of the dots and making the current dot active and other in-active
 * by adding the specific class and looping on each dot
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

/**
 * calling the function intially so that the chanages could be applied at the time of page loading only
 * @event change
 * @returns {void}
 */
updateActiveDot(emblaApi);
emblaApi.on('select', updateActiveDot);

/**
 * toggles which are responsible for mobile media for toggling the state of navigation links
 * @type {NodeListOf<HTMLElement>}
 * */
const toggles = document.querySelectorAll('.footer__section-toggle');

/**
 * specific toggle element which is responsible for the toggling of the clicked navigation
 * and toggling the state of other navigation too
 * @type {HTMLElement}
 * */
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
