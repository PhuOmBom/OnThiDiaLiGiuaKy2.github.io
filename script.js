// DOM Elements
const questionsPart1 = document.getElementById('questions-part1');
const questionsPart2 = document.getElementById('questions-part2');
const questionsPart3 = document.getElementById('questions-part3');

const scorePart1 = document.getElementById('score-part1');
const totalPart1 = document.getElementById('total-part1');
const progressPart1 = document.getElementById('progress-part1');

const scorePart2 = document.getElementById('score-part2');
const totalPart2 = document.getElementById('total-part2');
const progressPart2 = document.getElementById('progress-part2');

const scorePart3 = document.getElementById('score-part3');
const totalPart3 = document.getElementById('total-part3');
const progressPart3 = document.getElementById('progress-part3');

// State
let state = {
    part1: { correct: 0, total: part1Data.length, answered: 0 },
    part2: { score: 0, total: 0, answered: 0 }, // Total set dynamically
    part3: { correct: 0, total: part3Data.length, answered: 0 }
};

// Calculate total points for Part 2 (each sub-question is a point)
let part2TotalItems = 0;
part2Data.forEach(q => part2TotalItems += q.items.length);
state.part2.total = part2TotalItems;

// Initialize
function init() {
    renderPart1();
    renderPart2();
    renderPart3();
    updateUI();
}

function updateUI() {
    scorePart1.textContent = state.part1.correct;
    totalPart1.textContent = state.part1.total;
    progressPart1.style.width = `${(state.part1.answered / state.part1.total) * 100}%`;

    scorePart2.textContent = state.part2.score;
    totalPart2.textContent = state.part2.total;
    progressPart2.style.width = `${(state.part2.answered / state.part2.total) * 100}%`;

    scorePart3.textContent = state.part3.correct;
    totalPart3.textContent = state.part3.total;
    progressPart3.style.width = `${(state.part3.answered / state.part3.total) * 100}%`;
}

// Tab Switching
window.openTab = function (tabName) {
    const contents = document.getElementsByClassName('tab-content');
    const btns = document.getElementsByClassName('tab-btn');

    for (let content of contents) {
        content.classList.remove('active');
    }
    for (let btn of btns) {
        btn.classList.remove('active');
    }

    document.getElementById(tabName).classList.add('active');
    // Find the button calling this logic (approximate)
    const activeBtn = Array.from(btns).find(b => b.onclick.toString().includes(tabName));
    if (activeBtn) activeBtn.classList.add('active');
}

// Render Part 1
function renderPart1() {
    questionsPart1.innerHTML = part1Data.map((q, index) => `
        <div class="question-card" id="q1-${q.id}">
            <div class="question-text">Câu ${q.id}. ${q.q}</div>
            <div class="options-grid">
                ${q.opts.map((opt, i) => {
        const letter = String.fromCharCode(65 + i); // A, B, C, D
        return `<button class="option-btn" onclick="checkPart1(${q.id}, '${letter}', this)">${opt}</button>`;
    }).join('')}
            </div>
        </div>
    `).join('');
}

window.checkPart1 = function (id, selected, btn) {
    const qIndex = part1Data.findIndex(q => q.id === id);
    const q = part1Data[qIndex];
    const parent = btn.parentElement;

    // Prevent re-answering
    if (parent.dataset.answered) return;
    parent.dataset.answered = "true";

    const buttons = parent.getElementsByClassName('option-btn');

    if (selected === q.a) {
        btn.classList.add('correct');
        state.part1.correct++;
        showToast("Chính xác!", "success");
    } else {
        btn.classList.add('incorrect');
        // Highlight correct
        const correctBtnIndex = q.a.charCodeAt(0) - 65;
        if (buttons[correctBtnIndex]) buttons[correctBtnIndex].classList.add('correct');
        showToast(`Sai rồi. Đáp án đúng là ${q.a}`, "error");
    }
    state.part1.answered++;
    updateUI();
}

// Render Part 2
function renderPart2() {
    questionsPart2.innerHTML = part2Data.map(q => `
        <div class="question-card">
            <div class="question-text"><strong>${q.title}</strong></div>
            <p>${q.text}</p>
            <div class="tf-container">
                ${q.items.map(item => `
                    <div class="tf-row" id="p2-item-${q.id}-${item.id}" data-ans="${item.ans}">
                        <div class="tf-statement">${item.text}</div>
                        <div class="tf-options">
                            <button class="tf-btn" onclick="checkPart2('${q.id}', '${item.id}', true, this)">Đúng</button>
                            <button class="tf-btn" onclick="checkPart2('${q.id}', '${item.id}', false, this)">Sai</button>
                        </div>
                        <div class="tf-result"></div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

window.checkPart2 = function (qId, itemId, userAns, btn) {
    // Find the item
    const q = part2Data.find(x => x.id == qId);
    const item = q.items.find(x => x.id == itemId);
    const row = document.getElementById(`p2-item-${qId}-${itemId}`);

    if (row.dataset.answered) return;
    row.dataset.answered = "true";

    const btns = row.getElementsByClassName('tf-btn');

    // Visual selection
    if (userAns) btn.classList.add('selected-true');
    else btn.classList.add('selected-false');

    const resultDiv = row.querySelector('.tf-result');

    if (userAns === item.ans) {
        state.part2.score++;
        resultDiv.innerHTML = '<span class="correct-text">✓</span>';
        // Green highlight
        btn.style.borderColor = 'var(--primary-color)';
        btn.style.borderWidth = '2px';
    } else {
        resultDiv.innerHTML = '<span class="wrong-text">✕</span>';
        // Show correct by highlighting the other button
        const otherBtn = userAns ? btns[1] : btns[0];
        otherBtn.style.border = '2px solid var(--primary-color)';
        otherBtn.style.color = 'var(--primary-color)';
        otherBtn.style.fontWeight = 'bold';
    }

    state.part2.answered++;
    updateUI();
}

// Render Part 3
function renderPart3() {
    questionsPart3.innerHTML = part3Data.map(q => `
        <div class="question-card">
            <div class="question-text">${q.q}</div>
            <div style="display: flex; align-items: center; flex-wrap: wrap;">
                <input type="text" class="input-answer" placeholder="Nhập đáp án..." id="input-p3-${q.id}">
                <button class="check-btn" onclick="checkPart3(${q.id})">Kiểm tra</button>
            </div>
            <div class="feedback-text" id="feedback-p3-${q.id}"></div>
        </div>
    `).join('');
}

window.checkPart3 = function (id) {
    const q = part3Data.find(x => x.id === id);
    const input = document.getElementById(`input-p3-${id}`);
    const feedback = document.getElementById(`feedback-p3-${id}`);
    const val = input.value.trim();

    if (!val) {
        showToast("Vui lòng nhập đáp án", "error");
        return;
    }

    if (input.disabled) return;

    // Normalize logic: replace ',' with '.' for decimals if user types 0,5
    const normalizedVal = val.replace(',', '.');
    const normalizedAns = String(q.a).replace(',', '.');

    if (parseFloat(normalizedVal) === parseFloat(normalizedAns)) {
        input.style.borderColor = "var(--primary-color)";
        input.style.backgroundColor = "#e8f5e9";
        feedback.innerHTML = `<span class="correct-text">Chính xác! Đáp án: ${q.a}</span>`;
        state.part3.correct++;
    } else {
        input.style.borderColor = "#ef5350";
        input.style.backgroundColor = "#ffebee";
        feedback.innerHTML = `<span class="wrong-text">Sai rồi. Đáp án đúng: ${q.a}</span>`;
    }

    input.disabled = true;
    state.part3.answered++;
    updateUI();
}

function showToast(message, type) {
    const x = document.getElementById("toast");
    x.innerText = message;
    x.className = "toast show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}

// Start
init();
