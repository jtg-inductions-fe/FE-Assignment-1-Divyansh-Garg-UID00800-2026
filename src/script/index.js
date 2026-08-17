const navbar = document.querySelector('.navbar');

const logo = navbar.querySelector('.navbar__logo');
const menu = navbar.querySelector('.navbar__menu');
const actions = navbar.querySelector('.navbar__actions');
const toggle = navbar.querySelector('.navbar__toggle');

const mobileQuery = window.matchMedia('(max-width: 430px)');
const tabletQuery = window.matchMedia(
    '(min-width: 431px) and (max-width: 1024px)',
);
const desktopQuery = window.matchMedia('(min-width: 1025px)');

function updateNavbarOrder() {
    if (mobileQuery.matches) {
        navbar.append(logo, toggle, menu);
    } else if (tabletQuery.matches) {
        navbar.append(toggle, logo, actions);
    } else if (desktopQuery.matches) {
        navbar.append(logo, menu, actions);
    }
}

updateNavbarOrder();

mobileQuery.addEventListener('change', updateNavbarOrder);
tabletQuery.addEventListener('change', updateNavbarOrder);
desktopQuery.addEventListener('change', updateNavbarOrder);

const navbarToggle = document.querySelector('.navbar__toggle');
const navbarMenu = document.querySelector('.navbar__menu');

navbarToggle.addEventListener('click', () => {
    const isOpen = navbarMenu.classList.toggle('is-open');

    navbarToggle.classList.toggle('is-open', isOpen);

    navbarToggle.setAttribute('aria-expanded', isOpen);

    navbarToggle.setAttribute(
        'aria-label',
        isOpen ? 'Close navigation menu' : 'Open navigation menu',
    );
});

const navLinks = document.querySelectorAll('.navbar__link');

navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        document
            .querySelector('.navbar__link.active-link')
            ?.classList.remove('active-link');

        link.classList.add('active-link');

        navbarMenu.classList.remove('is-open');
        navbarToggle.classList.remove('is-open');

        navbarToggle.setAttribute('aria-expanded', 'false');

        navbarToggle.setAttribute('aria-label', 'Open navigation menu');
    });
});
