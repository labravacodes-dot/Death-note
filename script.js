let currentPage = 0;
let notebookOwner = "";
let entries = [];
let inactivityTimer = null; // Timer for Ryuk's eerie peer pressure

function goToPage(pageNumber) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    const targetPage = document.getElementById(`page-${pageNumber}`);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageNumber;
    }

    // Clear any existing Ryuk inactivity timer when switching pages
    if (inactivityTimer) {
        clearTimeout(inactivityTimer);
        inactivityTimer = null;
    }

    const speech = document.getElementById('ryukSpeech');

    // If on Page 16 (Execution Entry), Ryuk stays silent initially, then tempts if you stall
    if (pageNumber === 16) {
        if (speech) speech.textContent = `"..."`;

        inactivityTimer = setTimeout(() => {
            if (currentPage === 16) {
                const temptations = [
                    "Hesitating? It's just a name... go on, write it.",
                    "What's the matter? Afraid of what happens next?",
                    "You brought it to the human world. Might as well use it.",
                    "So quiet... Are you regretting picking it up already?"
                ];
                const randomWhisper = temptations[Math.floor(Math.random() * temptations.length)];
                if (speech) speech.textContent = `"${randomWhisper}"`;
            }
        }, 15000); // 15 seconds of silence before he whispers
    } else {
        // Default idle quote on other pages
        if (speech) speech.textContent = `"Humans... are so interesting."`;
    }

    if (pageNumber >= 17) {
        renderLedger();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const claimBtn = document.getElementById('claimOwnershipBtn');
    if (claimBtn) {
        claimBtn.addEventListener('click', claimOwnership);
    }

    const writeNameBtn = document.getElementById('writeNameBtn');
    if (writeNameBtn) {
        writeNameBtn.addEventListener('click', writeName);
    }
});

function claimOwnership() {
    const ownerInput = document.getElementById('ownerName');
    const statusDiv = document.getElementById('ownershipStatus');
    const name = ownerInput.value.trim();

    if (!name) {
        statusDiv.style.color = "var(--accent-red)";
        statusDiv.textContent = "You must inscribe a valid name to claim ownership!";
        return;
    }

    notebookOwner = name;
    statusDiv.style.color = "#2e7d32";
    statusDiv.textContent = `Ownership Bound! Welcome, ${notebookOwner}. The Shinigami realm acknowledges you.`;

    const footerDisplay = document.getElementById('displayOwner');
    if (footerDisplay) {
        footerDisplay.textContent = `Owner: ${notebookOwner}`;
    }

    const speech = document.getElementById('ryukSpeech');
    if (speech) {
        speech.textContent = `"${notebookOwner}, huh? Let's see what kind of chaos you wreak."`;
    }

    setTimeout(() => {
        goToPage(3);
    }, 1200);
}

function writeName() {
    if (!notebookOwner) {
        alert("You must first claim ownership on Page 2 before writing names in the ledger!");
        goToPage(2);
        return;
    }

    const nameInput = document.getElementById('targetName');
    const causeInput = document.getElementById('causeOfDeath');

    const name = nameInput.value.trim();
    let cause = causeInput.value.trim();

    if (!name) {
        alert("You must write a valid target name!");
        return;
    }

    // React intelligently according to Death Note laws
    let effectStatus = "active";
    let timer = 40;
    let lawMessage = "Execution in progress (40s countdown)";

    if (!cause) {
        cause = "Heart Attack (Default)";
        lawMessage = "No cause specified — defaulting to sudden cardiac arrest.";
    } else if (cause.toLowerCase().includes("suicide")) {
        lawMessage = "Suicide condition accepted under Realm Rule VI.";
    } else if (cause.toLowerCase().includes("mars") || cause.toLowerCase().includes("impossible")) {
        cause = "Heart Attack (Impossible Cause Override)";
        lawMessage = "Cause physically impossible — defaulted to heart attack under Rule VII.";
    } else {
        lawMessage = `Custom execution: ${cause}`;
    }

    entries.push({
        id: Date.now(),
        name: name,
        cause: cause,
        lawMessage: lawMessage,
        timer: timer,
        status: effectStatus
    });

    nameInput.value = '';
    causeInput.value = '';

    const speech = document.getElementById('ryukSpeech');
    if (speech) {
        speech.textContent = `"Oho! Another name added to the ledger. The countdown has begun!"`;
    }

    // Automatically navigate to Page 17 (Ledger)
    goToPage(17);
}

function renderLedger() {
    const tbody = document.getElementById('ledgerTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (entries.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: #777; font-style: italic;">No names recorded yet. The pages remain blank.</td></tr>`;
        return;
    }

    entries.forEach(entry => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${escapeHtml(entry.name)}</strong></td>
            <td>
                ${escapeHtml(entry.cause)}<br>
                <small style="color: #666; font-style: italic;">${escapeHtml(entry.lawMessage)}</small>
            </td>
            <td>
                ${entry.status === 'active' 
                    ? `<span class="status-badge status-active">Executing (${entry.timer}s)</span>` 
                    : `<span class="status-badge status-expired">Deceased (Executed)</span>`}
            </td>
        `;
        tbody.appendChild(tr);
    });

    checkDynamicBookExpansion();
}

function checkDynamicBookExpansion() {
    if (entries.length > 5 && !document.getElementById('page-20')) {
        const wrapper = document.querySelector('.notebook-wrapper');
        for (let p = 18; p <= 22; p++) {
            if (!document.getElementById(`page-${p}`)) {
                const newPage = document.createElement('div');
                newPage.id = `page-${p}`;
                newPage.className = 'page interior-page';
                newPage.innerHTML = `
                    <div class="page-header">
                        <span>ARCHIVAL LEDGER EXTENSION</span>
                        <span class="page-num">PAGE ${p}</span>
                    </div>
                    <div class="lore-box">
                        <h2>Shinigami Realm Expansion (Page ${p})</h2>
                        <p>As entries fill the parchment, the notebook itself expands infinitely to accommodate the judgment of the human world.</p>
                        <p>Total recorded judgments: ${entries.length}</p>
                    </div>
                    <div class="nav-controls">
                        <button class="btn-nav" onclick="goToPage(${p-1})">← Page ${p-1}</button>
                        <button class="btn-nav" onclick="goToPage(${p < 22 ? p+1 : 16})">${p < 22 ? `Page ${p+1} →` : 'Back to Entry (Page 16) ↺'}</button>
                    </div>
                `;
                wrapper.appendChild(newPage);
            }
        }
    }
}

function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, m => map[m]);
}

setInterval(() => {
    let updated = false;
    entries.forEach(entry => {
        if (entry.status === 'active' && entry.timer > 0) {
            entry.timer--;
            if (entry.timer === 0) {
                entry.status = 'expired';
                const speech = document.getElementById('ryukSpeech');
                if (speech) {
                    speech.textContent = `"*Crunch*... And just like that, ${entry.name} is gone."`;
                }
            }
            updated = true;
        }
    });
    if (updated && currentPage >= 17) {
        renderLedger();
    }
}, 1000);

function ryukReact() {
    const speech = document.getElementById('ryukSpeech');
    const ryukQuotes = [
        "Humans are so interesting...",
        "Got an apple handy? No? Typical.",
        "Remember, the 40-second rule is absolute!",
        "Whoever's name you write... they're as good as gone.",
        "Writing causes of death is fun, isn't it?",
        "That human world sure is full of chaos."
    ];
    const randomQuote = ryukQuotes[Math.floor(Math.random() * ryukQuotes.length)];
    if (speech) speech.textContent = `"${randomQuote}"`;
}
// ... [rest of your script.js above] ...

function ryukReact() {
    const speech = document.getElementById('ryukSpeech');
    const ryukQuotes = [
        "Humans are so interesting...",
        "Got an apple handy? No? Typical.",
        "Remember, the 40-second rule is absolute!",
        "Whoever's name you write... they're as good as gone.",
        "Writing causes of death is fun, isn't it?",
        "That human world sure is full of chaos."
    ];
    const randomQuote = ryukQuotes[Math.floor(Math.random() * ryukQuotes.length)];
    if (speech) speech.textContent = `"${randomQuote}"`;
}

// BGM Toggle Function
function toggleBGM() {
    const audio = document.getElementById('bgmAudio');
    const btn = document.getElementById('musicToggleBtn');
    
    if (audio.paused) {
        audio.play().then(() => {
            btn.textContent = "❚❚ Pause Opening Theme";
        }).catch(err => {
            console.log("Audio playback prevented or file missing:", err);
            alert("Make sure 'deathnote.mp3' is saved in your project folder!");
        });
    } else {
        audio.pause();
        btn.textContent = "♫ Play Opening Theme";
    }
}