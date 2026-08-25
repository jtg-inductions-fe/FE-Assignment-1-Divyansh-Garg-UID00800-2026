const STORAGE_KEY = 'travlogUnlockedDeals';
const SPIN_DURATION_MS = 6500;

const DEALS_URL =
    'https://gist.githubusercontent.com/ameer-wajid-ali/1f29ebee4295cede36f8d74b45e576df/raw/122966c9a123861249f173911d8d93a76dc06d7a/';

// structuring the data accorind to the raw data we are using in starting
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

// fetching the deals data from the url provided
async function fetchData() {
    try {
        const response = await fetch(DEALS_URL);
        if (!response.ok) {
            return [];
        }
        const data = await response.json();
        return formatDealMeta(data);
    } catch {
        return [];
    }
}

const DEAL_META = await fetchData();

function initSpinner() {
    const modal = document.getElementById('spinModal');

    // the navlink for triggering the spinner
    const openTrigger = document.querySelector('.spinner__link');
    const overlay = modal.querySelector('.overlay');

    const titleEl = document.getElementById('spinModalTitle');
    const subtitleEl = document.getElementById('spinModalSubtitle');
    const closeBtn = modal.querySelector('.spin-modal__close');

    const viewWheel = document.getElementById('spinViewWheel');
    const viewList = document.getElementById('spinViewList');

    const wheelWrap = modal.querySelector('.spin-wheel');
    const loadingEl = document.getElementById('spinLoading');
    const wheelEl = document.getElementById('spinWheel'); // rotating disc
    const spinBtn = document.getElementById('spinButton');
    const segmentEls = Array.from(
        wheelEl.querySelectorAll('.spin-wheel__segment'),
    );

    const resultBanner = document.getElementById('spinResult');
    const resultName = document.getElementById('spinResultName');
    const resultExpiry = document.getElementById('spinResultExpiry');
    const resultCode = document.getElementById('spinResultCode');

    const emptyState = document.getElementById('spinEmpty');

    const dealsButton = modal.querySelector('.spin-modal__deals-button');
    const dealsCount = document.getElementById('dealsCount');
    const backButton = modal.querySelector('.spin-modal__back-button');

    const dealList = document.getElementById('spinDealList');
    const listEmpty = document.getElementById('spinListEmpty');

    const toast = document.getElementById('spinToast');

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

    function saveUnlocked() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(unlocked));
        } catch {
            return {};
        }
    }

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
                el: segmentEls[index],
                color: colors[index % 4],
                codePrefix: dealData.codePrefix || 'DEAL',
                validityDays: dealData.validityDays || 7,
            };
        });
    }

    function getExpiryInfo(deal) {
        const expiresAt = deal.wonAt + deal.validityDays * 24 * 60 * 60 * 1000;
        const msLeft = expiresAt - Date.now();

        if (msLeft <= 0) return { expired: true, text: 'Deal expired' };

        const daysLeft = Math.floor(msLeft / (24 * 60 * 60 * 1000));
        if (daysLeft >= 1)
            return { expired: false, text: `Expires in ${daysLeft}d` };

        const hoursLeft = Math.max(1, Math.ceil(msLeft / (60 * 60 * 1000)));
        return { expired: false, text: `Expires in ${hoursLeft}h` };
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

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
        available.forEach((_, i) => {
            const divider = document.createElement('div');
            divider.className = 'spin-wheel-divider';
            divider.style.transform = `rotate(${i * segAngle}deg)`;
            wheelEl.appendChild(divider);
        });

        available.forEach((deal, i) => {
            deal.el.hidden = false;
            const midAngle = i * segAngle + segAngle / 2;
            const textEl = deal.el.querySelector('.spin-wheel__text');
            textEl.style.transform = `rotate(${midAngle - 180}deg)`;
            textEl.textContent = deal.label;
        });
    }

    function pickWinnerIndex(count) {
        return Math.floor(Math.random() * count);
    }

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

    function showResult(won) {
        const { text } = getExpiryInfo(won);
        resultName.textContent = won.label;
        resultExpiry.textContent = text;
        resultCode.textContent = won.code;
        resultBanner.hidden = false;
    }

    function renderDealList() {
        dealList.innerHTML = '';

        if (unlocked.length === 0) {
            listEmpty.hidden = false;
            return;
        }
        listEmpty.hidden = true;

        const sorted = [...unlocked].sort((a, b) => b.wonAt - a.wonAt);

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

    function updateBadge() {
        const count = unlocked.length;
        dealsCount.textContent = String(count);
        dealsCount.hidden = count === 0;
        dealsCount.setAttribute(
            'aria-label',
            `${count} unlocked deal${count === 1 ? '' : 's'}`,
        );
    }

    let timer = 0;

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

    modal.addEventListener('click', (e) => {
        const btn = e.target.closest('.spin-modal__copy');
        if (!btn) return;
        const codeEl = btn.parentElement.querySelector(
            '.spin-modal__code-text',
        );
        const text = codeEl ? codeEl.textContent.trim() : '';
        if (text) copyCode(text);
    });

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

    function showListView() {
        renderDealList();
        viewWheel.hidden = true;
        viewList.hidden = false;
        dealsButton.hidden = true;
        backButton.hidden = false;
        titleEl.textContent = 'Unlocked Deals';
        subtitleEl.textContent = "All the deals you've unlocked yet!";
    }

    function openModal() {
        modal.classList.remove('site-spin-modal--hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.add('site-spin-modal--hidden');
        document.body.style.overflow = '';
    }

    if (openTrigger) {
        openTrigger.addEventListener('click', (e) => {
            openModal(e);
        });
    }

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (
            e.key === 'Escape' &&
            !modal.classList.contains('site-spin-modal--hidden')
        ) {
            closeModal();
        }
    });

    spinBtn.addEventListener('click', spinWheel);

    dealsButton.addEventListener('click', showListView);
    backButton.addEventListener('click', showWheelView);

    updateBadge();
    renderDealList();

    window.setTimeout(() => {
        loadingEl.hidden = true;
        renderWheel();
    }, 1600);
}

initSpinner();
