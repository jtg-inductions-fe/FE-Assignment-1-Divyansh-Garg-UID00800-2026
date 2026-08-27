const STORAGE_KEY = 'travlogUnlockedDeals';
const SPIN_DURATION_MS = 6500;

/**
 * the navbar link which is used for opening the modal
 * @type {HTMLElement}
 * */
const openTrigger = document.querySelector('.spinner__link');

/**
 * the main element which is showing as modal
 * @type {HTMLElement}
 * */
const modal = document.getElementById('spinModal');

/**
 * a variabale containg the url of the deals data
 * @var {string}
 * */
const DEALS_URL =
    'https://gist.githubusercontent.com/ameer-wajid-ali/1f29ebee4295cede36f8d74b45e576df/raw/122966c9a123861249f173911d8d93a76dc06d7a/';

/**
 * loading element which will be shown at the time to api fetch
 * @type {HTMLElement}
 * */
const loadingEl = document.getElementById('spinLoading');

let DEAL_META = {};

function initSpinner() {
    /**
     * the div element which is used for displaying in the background of the modal
     * @type {HTMLElement}
     * */
    const overlay = modal.querySelector('.overlay');

    /**
     * title and subtitle for the modal which is getting changed dynamically by js
     * @type {HTMLElement}
     * */
    const titleEl = document.getElementById('spinModalTitle');
    const subtitleEl = document.getElementById('spinModalSubtitle');

    /**
     * close button which is placed absolute to the header and is used for closing the modal from any state
     * @type {HTMLElement}
     * */
    const closeBtn = modal.querySelector('.spin-modal__close');

    /**
     * element showing deals to user which he can win and the winning result
     * @type {HTMLElement}
     * */
    const viewWheel = document.getElementById('spinViewWheel');

    /**
     * element showing deals to user which he has already one.. or
     * @type {HTMLElement}
     * */
    const viewList = document.getElementById('spinViewList');

    /**
     * element containing the whole wheel and all the components
     * @type {HTMLElement}
     * */
    const wheelWrap = modal.querySelector('.spin-wheel');

    /**
     * the actual element which will be having the rotation efect
     * @type {HTMLElement}
     * */
    const wheelEl = document.getElementById('spinWheel'); // rotating disc

    /**
     * element which is reponsible for the rotation of the wheel
     * @type {HTMLElement}
     * */
    const spinBtn = document.getElementById('spinButton');

    /**
     * segments which contain the text element of the deals placed dynamically
     * @type {HTMLElement}
     * */
    const segmentEls = Array.from(
        wheelEl.querySelectorAll('.spin-wheel__segment'),
    );

    /**
     * elements which will be shown to user when he won a deal containing name, expiry, code and banner
     * @type {HTMLElement}
     * */
    const resultBanner = document.getElementById('spinResult');
    const resultName = document.getElementById('spinResultName');
    const resultExpiry = document.getElementById('spinResultExpiry');
    const resultCode = document.getElementById('spinResultCode');

    /**
     * element that will be shown when no deal is present to take
     * @type {HTMLElement}
     * */
    const emptyState = document.getElementById('spinEmpty');

    /**
     * element containing the flow to the deal list and also the deals count which the use has won
     * @type {HTMLElement}
     * */
    const dealsButton = modal.querySelector('.spin-modal__deals-button');
    const dealsCount = document.getElementById('dealsCount');

    /**
     * element responsible for returning back to the spin wheel section
     * @type {HTMLElement}
     * */
    const backButton = modal.querySelector('.spin-modal__back-button');

    /**
     * element containing all the lists of deals which the user has won
     * @type {HTMLElement}
     * */
    const dealList = document.getElementById('spinDealList');

    /**
     * element shown when no deal is won
     * @type {HTMLElement}
     * */
    const listEmpty = document.getElementById('spinListEmpty');

    /**
     * element which will be shown when the user copied any deal code
     * @type {HTMLElement}
     * */
    const toast = document.getElementById('spinToast');

    /**
     * function responsible for loading of all the deals which are won by the user previously
     * by getting deals from the localstorage
     * @return {[]} - array of all the unlocked deals
     * */
    function loadUnlocked() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    let unlocked = loadUnlocked();
    let currentRotation = 0;
    let isSpinning = false;

    /**
     * function responsible for saving all the deals which user won to localstorgae
     * @return {}
     * */
    function saveUnlocked() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(unlocked));
        } catch {
            return {};
        }
    }

    /**
     * function responsible for fetching all the deals which are avaiable for the user to win
     * by getting deals from the localstorage and comparing them by the help of the unlocked deals id
     * and will return a list that contain the structured data
     * will return only top 4 entries if more than 4 are present
     * @type {HTMLElement}
     * @return {[]} - array of all the unlocked deals
     * */
    function getAvailableDeals() {
        const colors = ['#F4436C', '#7C3AED', '#FBBF24', '#06B6D4'];

        // id of the unlocked deals
        const wonIds = new Set(unlocked.map((d) => d.id));

        // getting the deals which are locked by comapring with the unlocked deals id
        const lockedDealsData = Object.keys(DEAL_META)
            .filter((id) => !wonIds.has(id))
            .map((id) => ({ id, ...DEAL_META[id] }));

        // returning only 4 at max
        return lockedDealsData.slice(0, 4).map((dealData, index) => {
            return {
                id: dealData.id,
                label: dealData.label || '',
                el: segmentEls[index % 4],
                color: colors[index % 4],
                codePrefix: dealData.codePrefix || 'DEAL',
                validityDays: dealData.validityDays || 7,
            };
        });
    }

    /**
     * @typedef DEALS
     * @type {object}
     */

    /**
     * function responsible for getting the expiry info of the deals by comparing with the won time ms
     * by getting deals from the localstorage
     * @param {object}
     * @type {DEALS}
     * @return {[]} - array of all the unlocked deals
     * */
    function getExpiryInfo(deal) {
        const expiresAt = deal.wonAt + deal.validityDays * 24 * 60 * 60 * 1000;
        const msLeft = expiresAt - Date.now();

        if (msLeft <= 0) return { expired: true, text: 'Deal expired' };

        const daysLeft = Math.ceil(msLeft / (24 * 60 * 60 * 1000));
        if (daysLeft >= 1)
            return { expired: false, text: `Expires in ${daysLeft}d` };

        const hoursLeft = Math.max(1, Math.ceil(msLeft / (60 * 60 * 1000)));
        return { expired: false, text: `Expires in ${hoursLeft}h` };
    }

    /**
     * function which is returning an HTML element
     * @param {string}
     * @return {HTMLElement}
     * */
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /** function responsbile for showing the wheel on the modal
     * will check the availabel and then show wheel dynamically
     * by making the wheel using hte segAngle calculated with the help of the size of the avaiable deals max 4
     * and showing the deal text using the elements and the seperation in betwen them expect for 1 deal left
     * */
    function renderWheel() {
        const available = getAvailableDeals();

        wheelEl.style.transition = 'none';
        wheelEl.style.transform = 'rotate(0deg)';
        spinBtn.style.transition = 'none';
        spinBtn.style.transform = 'rotate(0deg)';

        // this force browser to apply the chage immediately
        void wheelEl.offsetHeight;
        void spinBtn.offsetHeight;

        wheelEl.style.transition = '';
        spinBtn.style.transition = '';
        currentRotation = 0;

        if (available.length === 0) {
            wheelWrap.hidden = true;
            emptyState.hidden = false;
            subtitleEl.textContent = "You've unlocked every deal";
            return;
        }

        emptyState.hidden = true;
        wheelWrap.hidden = false;
        wheelEl.hidden = false;
        spinBtn.hidden = false;
        subtitleEl.textContent = 'Tap the center of the wheel to spin';

        // this we are using for the partion in the conic-gradient so that each color or part would get equal partition
        const segAngle = 360 / available.length;

        // the number of partitions
        const stops = available
            .map(
                (deal, i) =>
                    `${deal.color} ${i * segAngle}deg ${(i + 1) * segAngle}deg`,
            )
            .join(', ');

        // this apply the conic gradient
        wheelEl.style.background = `conic-gradient(${stops})`;

        wheelEl
            .querySelectorAll('.spin-wheel-divider')
            .forEach((el) => el.remove());

        // for adding the white line in between
        if (available.length > 1) {
            available.forEach((_, i) => {
                const divider = document.createElement('div');
                divider.className = 'spin-wheel-divider';
                divider.style.transform = `rotate(${i * segAngle}deg)`;
                wheelEl.appendChild(divider);
            });
        }

        available.forEach((deal, i) => {
            deal.el.hidden = false;
            const midAngle = i * segAngle + segAngle / 2;
            const textEl = deal.el.querySelector('.spin-wheel__text');
            textEl.style.transform = `rotate(${midAngle - 180}deg)`;
            textEl.textContent = deal.label;
        });
    }

    /**
     * function for generating the index of the deal which the user will won
     * @param {number}
     * @return {number}
     * */
    function pickWinnerIndex(count) {
        return Math.floor(Math.random() * count);
    }

    /**
     * function responsible for showing the spin effect of the wheel
     * @return {}
     * */
    function spinWheel() {
        if (isSpinning) return;

        const available = getAvailableDeals();
        if (available.length === 0) return;

        isSpinning = true;
        spinBtn.disabled = true;
        resultBanner.hidden = true;

        const segAngle = 360 / available.length;
        const winnerIndex = pickWinnerIndex(available.length);
        const winnerDeal = available[winnerIndex];

        // this will mave wheel to move a little extra or less (25%)
        const jitter = (Math.random() - 0.5) * (segAngle * 0.5);
        const targetCenter = winnerIndex * segAngle + segAngle / 2 + jitter;

        const extraTurns = 6;
        const rotationNeeded = 360 - targetCenter;
        currentRotation += extraTurns * 360 + rotationNeeded;

        wheelEl.style.transform = `rotate(${currentRotation}deg)`;
        spinBtn.style.transform = `rotate(${currentRotation}deg)`;

        window.setTimeout(() => handleSpinResult(winnerDeal), SPIN_DURATION_MS);
    }

    /**
     * this function generate the won result and then call different function to show them up on screen
     * @param {object}
     * @return {}
     * */
    function handleSpinResult(deal) {
        const won = {
            id: deal.id,
            label: deal.label,
            code: deal.codePrefix,
            wonAt: Date.now(),
            validityDays: deal.validityDays,
        };

        unlocked = [...unlocked, won];
        saveUnlocked();

        showResult(won);
        updateBadge();

        isSpinning = false;
        spinBtn.disabled = false;

        renderWheel();
    }

    /**
     * function responsible for showing result on screen
     * @return {object}
     * */
    function showResult(won) {
        const { text } = getExpiryInfo(won);
        resultName.textContent = won.label;
        resultExpiry.textContent = text;
        resultCode.textContent = won.code;
        resultBanner.hidden = false;
    }

    /**
     * function responsible for showing all the deals which the user has won
     * and also no deal and the empty deal list element if no deal has been won by the user
     * @return {}
     * */
    function renderDealList() {
        dealList.innerHTML = '';

        if (unlocked.length === 0) {
            listEmpty.hidden = false;
            return;
        }
        listEmpty.hidden = true;

        const sorted = [...unlocked].sort(
            (a, b) => b.validityDays - a.validityDays,
        );

        sorted.forEach((deal) => {
            const { expired, text } = getExpiryInfo(deal);

            const row = document.createElement('div');
            row.className =
                'spin-modal__deal-row' +
                (expired ? ' spin-modal__deal-row--expired' : '');
            row.innerHTML = `
      <div class="spin-modal__deal-info">
        <p class="spin-modal__deal-name">${escapeHtml(deal.label)}</p>
        <p class="spin-modal__deal-expiry${expired ? ' spin-modal__deal-expiry--expired' : ''}">${text}</p>
      </div>
      <div class="spin-modal__result-code">
        <div class="spin-modal__code">
          <span class="spin-modal__code-text">${escapeHtml(deal.code)}</span>
        </div>
        <button class="spin-modal__copy" type="button" aria-label="Copy code">
          <span class="icon" aria-hidden="true">&#xf010;</span>
        </button>
      </div>
    `;
            dealList.appendChild(row);
        });
    }

    /**
     * function responsible for showing the deal count to the user which he has already won
     * @return {}
     * */
    function updateBadge() {
        const count = unlocked.length;
        dealsCount.textContent = String(count);
        dealsCount.hidden = count === 0;
        dealsCount.setAttribute(
            'aria-label',
            `${count} unlocked deal${count === 1 ? '' : 's'}`,
        );
    }

    /**
     * a variable which is used for creating a timer for the toaster
     * @var {number}
     * */
    let timer = 0;

    /**
     * function responsible for copying the code and showing toaster and creating a timer for it
     * @return {}
     * */
    function copyCode(text) {
        const finish = () => {
            toast.classList.add('spin-modal__toast--is-visible');
            window.clearTimeout(timer);
            timer = window.setTimeout(
                () => toast.classList.remove('spin-modal__toast--is-visible'),
                1600,
            );
        };

        navigator.clipboard.writeText(text).then(finish).catch(finish);
    }

    /**
     * function handling the click event of the modal for copying code
     * and is using the event delegation allowing not targeting each btn seperately
     * @event click
     * @return {}
     * */
    modal.addEventListener('click', (e) => {
        const btn = e.target.closest('.spin-modal__copy');
        if (!btn) return;
        const codeEl = btn.parentElement.querySelector(
            '.spin-modal__code-text',
        );
        const text = codeEl ? codeEl.textContent.trim() : '';
        if (text) copyCode(text);
    });

    /**
     * function which is showing hte wheel component and making the list hide
     * @return {}
     * */
    function showWheelView() {
        viewList.hidden = true;
        viewWheel.hidden = false;
        dealsButton.hidden = false;
        backButton.hidden = true;
        titleEl.textContent = 'Spin & Win!';
        subtitleEl.textContent = getAvailableDeals().length
            ? 'Tap the center of the wheel to spin'
            : "You've unlocked every deal";
    }

    /**
     * function responsible for showing the list view that contain the deals which user has won
     * @return {}
     * */
    function showListView() {
        renderDealList();
        viewWheel.hidden = true;
        viewList.hidden = false;
        dealsButton.hidden = true;
        backButton.hidden = false;
        titleEl.textContent = 'Unlocked Deals';
        subtitleEl.textContent = "All the deals you've unlocked yet!";
    }

    /**
     * function which is used for closing the modal
     * */
    function closeModal() {
        modal.classList.add('site-spin-modal--hidden');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    /**
     * Handles the closing of the modal
     * Using the Escape key for closing the modal is helping in the accessibility
     * @event keydown
     * @return {void}
     */
    document.addEventListener('keydown', (e) => {
        if (
            e.key === 'Escape' &&
            !modal.classList.contains('site-spin-modal--hidden')
        ) {
            closeModal();
        }
    });

    /**
     * Handles the spinning of the wheel
     * @event click
     * @type {HTMLElement}
     */
    spinBtn.addEventListener('click', spinWheel);

    dealsButton.addEventListener('click', showListView);
    backButton.addEventListener('click', showWheelView);

    updateBadge();
    renderDealList();
    renderWheel();
}

/**
 * function which is formatting the data to work with the wheel requirements
 * @type {HTMLElement}
 * */
function formatDealMeta(rawData) {
    if (!Array.isArray(rawData)) return {};

    return rawData.reduce((accumulator, item, index) => {
        const key = `${index + 1}`;
        accumulator[key] = {
            label: item.label,
            codePrefix: item.promoCode,
            validityDays:
                item.validFor !== null && item.validFor !== undefined
                    ? item.validFor
                    : 7,
        };
        return accumulator;
    }, {});
}

/**
 * fetching the deals data from the url provided
 * added the cache using the local storage with validity of 1 day
 * */
async function fetchData() {
    try {
        loadingEl.hidden = false;
        const lockedDeals = localStorage.getItem('travlogLockedDeals');
        if (lockedDeals) {
            if (
                Date.now() - localStorage.getItem('dateIssued') <
                24 * 60 * 60 * 1000
            ) {
                return JSON.parse(lockedDeals);
            }
        }
        const response = await fetch(DEALS_URL);
        if (!response.ok) {
            return [];
        }
        const data = await response.json();
        localStorage.setItem(
            'travlogLockedDeals',
            JSON.stringify(formatDealMeta(data)),
        );
        localStorage.setItem('dateIssued', Date.now());
        loadingEl.hidden = true;
        return formatDealMeta(data);
    } catch {
        return [];
    }
}

/**
 * function which is used for opening the modal
 * */
function openModal() {
    modal.classList.remove('site-spin-modal--hidden');
    document.body.style.overflow = 'hidden';
}

/**
 * condition for opeining the modal by clicking on the html element
 * @type {HTMLElement}
 * @event click
 * */
openTrigger.addEventListener('click', async (e) => {
    openModal(e);
    DEAL_META = await fetchData();
    initSpinner();
});
