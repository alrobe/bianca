/**
 * Carta Interactiva con Google Sheets
 * Fechas en formato DD/MM/YYYY
 * Mensaje nuevo en cada OPEN
 */

// =====================
// GOOGLE SHEETS SETUP
// =====================
google.charts.load('current', { packages: ['corechart'] });

const SHEET_ID = '1t9WezE2NhiJ_AK2cPklX8YOL_xKWlYzm62a2h5frC2U';
const SHEET_NAME = 'Sheet1';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${SHEET_NAME}`;

// =====================
// DOM
// =====================
const elements = {
    flap: document.getElementById('flap'),
    letter: document.getElementById('letter'),
    openBtn: document.getElementById('openBtn'),
    resetBtn: document.getElementById('resetBtn'),
    floatingHearts: document.getElementById('floatingHearts'),
    letterText: document.getElementById('letterText')
};

// =====================
// STATE
// =====================
let isOpen = false;
let PASSWORD = '';
let todayMessage = null;
let randomMessages = [];

// =====================
// UTILS
// =====================
function todayISO() {
    return new Date().toISOString().split('T')[0];
}

function formatDateFromSheet(value) {
    if (!value) return null;

    // Google Sheets envía Date real
    if (Object.prototype.toString.call(value) === '[object Date]') {
        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, '0');
        const day = String(value.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Si viene como texto DD/MM/YYYY
    if (typeof value === 'string') {
        const parts = value.split('/');
        if (parts.length !== 3) return null;

        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    return null;
}

// =====================
// LOAD DATA FROM SHEET
// =====================
function loadFromSheet() {
    const query = new google.visualization.Query(SHEET_URL);

    query.send(response => {
        if (response.isError()) {
            console.error(response.getMessage());
            elements.letterText.innerHTML = `<p>Error cargando el mensaje 😢</p>`;
            return;
        }

        const data = response.getDataTable();
        const rows = data.getNumberOfRows();

        // Contraseña desde D1
        PASSWORD = data.getValue(0, 3);

        todayMessage = null;
        randomMessages = [];

        const today = todayISO();

        for (let i = 1; i < rows; i++) {
            const rawDate = data.getValue(i, 0);
            const date = formatDateFromSheet(rawDate);

            const msgB = data.getValue(i, 1);
            const msgC = data.getValue(i, 2);
            console.log(`Row ${i}: Date=${date}, MsgB=${msgB}, MsgC=${msgC}, Today=${today}`);
            if (date === today && msgB) {
                todayMessage = msgB;
            }

            if (msgC) {
                randomMessages.push(msgC);
            }
        }

        // Mensaje inicial
        chooseMessage();
    });
}

// =====================
// MESSAGE SELECTOR
// =====================
function chooseMessage() {
    const message = todayMessage
        ? todayMessage
        : randomMessages[Math.floor(Math.random() * randomMessages.length)];

    elements.letterText.innerHTML = `<p>${message}</p>`;
}

// =====================
// FLOATING HEARTS
// =====================
function createFloatingHearts() {
    elements.floatingHearts.innerHTML = '';

    for (let i = 0; i < 50; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = '✨';
        heart.style.left = `${30 + Math.random() * 40}%`;
        heart.style.top = `${40 + Math.random() * 20}%`;
        heart.style.fontSize = `${20 + Math.random() * 15}px`;
        heart.style.animationDelay = `${i * 0.05}s`;

        elements.floatingHearts.appendChild(heart);
        setTimeout(() => heart.remove(), 4000);
    }
}

// =====================
// ENVELOPE LOGIC
// =====================
function openEnvelope() {
    if (isOpen) return;

    const input = prompt('Ingresa la contraseña 😉');

    if (input !== PASSWORD) {
        alert('Solo Bianca puede abrir este mensaje!!! 😠');
        return;
    }

    // Mensaje nuevo en cada OPEN
    chooseMessage();

    isOpen = true;
    elements.flap.classList.add('open');

    setTimeout(createFloatingHearts, 200);
    setTimeout(() => elements.letter.classList.add('revealed'), 300);

    elements.openBtn.disabled = true;
    elements.resetBtn.disabled = false;
}

function resetEnvelope() {
    isOpen = false;
    elements.letter.classList.remove('revealed');
    elements.flap.classList.remove('open');
    elements.floatingHearts.innerHTML = '';

    elements.openBtn.disabled = false;
    elements.resetBtn.disabled = true;
}

// =====================
// INIT
// =====================
google.charts.setOnLoadCallback(() => {
    loadFromSheet();

    elements.openBtn.addEventListener('click', openEnvelope);
    elements.resetBtn.addEventListener('click', resetEnvelope);
    elements.resetBtn.disabled = true;
});
