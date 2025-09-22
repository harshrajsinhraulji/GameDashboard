// assets/js/main.js

// --- State & Configuration ---
const games = [
    { name: "Snake", folder: "snake", desc: "The classic arcade game. Use arrow keys to grow your snake.", image: "assets/images/snake.png" },
    { name: "2048", folder: "2048", desc: "Slide and combine tiles to reach the 2048 tile.", image: "assets/images/2048.png" },
    { name: "Minesweeper", folder: "minesweeper", desc: "Clear the board without detonating any hidden mines.", image: "assets/images/minesweeper.png" },
    { name: "Memory", folder: "memory", desc: "Flip cards and test your memory by matching pairs.", image: "assets/images/memory.png" },
    { name: "Reaction", folder: "reaction", desc: "Test your reflexes. Click when the screen turns green!", image: "assets/images/reaction.png" },
];

// --- UI Elements ---
const navLinksContainer = document.querySelector('.nav-links');
const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const closeModalButton = document.getElementById('close-modal-btn');
const playAllBtn = document.getElementById('play-all-btn'); // New: Play All button
const leaderboardsBtn = document.getElementById('leaderboards-btn'); // New: Leaderboards button


// --- Global Functions (accessible by game iframes) ---
window.closeGameModal = closeModal;
window.handleGameOver = async function(gameName, score) {
    console.log(`Game Over: ${gameName}, Score: ${score}`);
    closeModal();
    try {
        const session = await checkSession();
        if (session.loggedIn) {
            await saveScore(gameName, score);
            setTimeout(() => alert(`Score of ${score} saved for ${gameName}!`), 100);
        } else {
            setTimeout(() => alert(`You finished ${gameName} with a score of ${score}. Log in to save your scores!`), 100);
        }
    } catch (error) {
        console.error('Failed to save score:', error);
        setTimeout(() => alert('Could not save your score. Please try again later.'), 100);
    }
};

// --- Modal Logic ---
function openModal() {
    if (modalOverlay) modalOverlay.classList.remove('hidden');
}
function closeModal() {
    if (modalOverlay) {
        modalOverlay.classList.add('hidden');
        modalTitle.textContent = '';
        modalBody.innerHTML = ''; // Important: stops game from running in background
    }
}

// --- Game & Leaderboard Launchers ---
function launchGame(gameFolder, gameName) {
    modalTitle.textContent = gameName;
    modalBody.innerHTML = `<iframe src="games/${gameFolder}/index.html"></iframe>`;
    const iframe = modalBody.querySelector('iframe');
    // Auto-focus the iframe for keyboard controls
    iframe.onload = () => iframe.contentWindow.focus(); 
    openModal();
}

async function showLeaderboard(gameName) {
    modalTitle.textContent = `${gameName} - All-Time Top Players`;
    modalBody.innerHTML = '<p>Loading...</p>';
    openModal();
    try {
        const { success, leaderboard, unit, message } = await getLeaderboard(gameName);
        if (success) {
            if (leaderboard.length > 0) {
                let tableHTML = '<div class="table-container"><table><thead><tr><th>Rank</th><th>Player</th><th>Best Score</th></tr></thead><tbody>';
                leaderboard.forEach((entry, index) => {
                    tableHTML += `<tr><td>${index + 1}</td><td>${entry.username}</td><td>${entry.best_score}${unit || ''}</td></tr>`;
                });
                tableHTML += '</tbody></table></div>';
                modalBody.innerHTML = tableHTML;
            } else {
                modalBody.innerHTML = '<p>No scores recorded for this game yet. Be the first!</p>';
            }
        } else {
            modalBody.innerHTML = `<p>Error: ${message}</p>`;
        }
    } catch (error) {
        modalBody.innerHTML = `<p>Could not fetch leaderboard. Please try again later.</p>`;
    }
}


// --- Auth Event Handlers ---
async function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const username = form.username.value;
    const password = form.password.value;
    try {
        const data = await loginUser(username, password);
        if (data.success) {
            window.location.href = 'index.html';
        }
    } catch (error) {
        showFormMessage(error.message, false);
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const form = event.target;
    const username = form.username.value;
    const email = form.email.value;
    const password = form.password.value;
    try {
        const data = await registerUser(username, email, password);
        if (data.success) {
            showFormMessage(data.message, true);
            setTimeout(() => {
                // FIX: Corrected path for register.html redirect
                window.location.href = 'login.html';
            }, 2000);
        }
    } catch (error) {
        showFormMessage(error.message, false);
    }
}

async function handleLogout() {
    try {
        await logoutUser();
        window.location.href = 'login.html';
    } catch (error) {
        alert('Logout failed. Please try again.');
    }
}

// --- UI & Page Initializers ---
function updateNav(loggedIn, username) {
    if (!navLinksContainer) return;
    navLinksContainer.innerHTML = '';
    if (loggedIn) {
        navLinksContainer.innerHTML = `
            <a href="profile.html">Profile (${username})</a>
            <button id="logout-btn">Logout</button>
        `;
        document.getElementById('logout-btn').addEventListener('click', handleLogout);
    } else {
        navLinksContainer.innerHTML = `
            <a href="login.html">Login</a>
            <a href="register.html">Register</a>
        `;
    }
}

function showFormMessage(message, isSuccess) {
    const messageEl = document.getElementById('form-message');
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = isSuccess ? 'success' : 'error';
        messageEl.style.display = 'block';
    }
}

function initDashboard() {
    const gameGrid = document.getElementById('game-grid');
    if (!gameGrid) return;
    gameGrid.innerHTML = games.map(game => `
        <div class="game-card" data-folder="${game.folder}" data-name="${game.name}">
            <div class="game-card-image">
                <img src="${game.image}" alt="${game.name} Icon">
            </div>
            <div class="game-card-content">
                <h3>${game.name}</h3>
                <p>${game.desc}</p>
                <div class="game-card-actions">
                    <button class="btn btn-primary play-btn">Play</button>
                    <button class="btn btn-secondary leaderboard-btn">Leaderboard</button>
                </div>
            </div>
        </div>`).join('');
    
    // Use event delegation on the grid for better performance
    gameGrid.addEventListener('click', (event) => {
        const gameCard = event.target.closest('.game-card');
        const targetBtn = event.target.closest('button');

        if (!gameCard || !targetBtn) return; // Clicked outside a card or button

        const gameFolder = gameCard.dataset.folder;
        const gameName = gameCard.dataset.name;

        if (targetBtn.classList.contains('play-btn')) {
            launchGame(gameFolder, gameName);
        } else if (targetBtn.classList.contains('leaderboard-btn')) {
            showLeaderboard(gameName);
        }
    });

    // Add event listeners for the "Play All" and "Leaderboards" buttons
    if (playAllBtn) {
        playAllBtn.addEventListener('click', () => {
            alert('Play All functionality is not yet implemented.');
            // Implement logic to cycle through games or show a game selection menu
        });
    }
    if (leaderboardsBtn) {
        leaderboardsBtn.addEventListener('click', () => {
            alert('Global Leaderboards functionality is not yet implemented.');
            // Implement logic to show a combined leaderboard or a leaderboard selection
        });
    }
}

async function initProfilePage() {
    try {
        const { success, data } = await getProfileData();
        if (success) {
            const { username, high_scores, history } = data;
            document.getElementById('profile-username').textContent = `Welcome, ${username}`;
            const highScoresTable = document.getElementById('high-scores-table');
            const historyTable = document.getElementById('history-table');
            
            // Build High Scores Table
            if (high_scores.length > 0) {
                let tableHTML = '<table><thead><tr><th>Game</th><th>Best Score</th></tr></thead><tbody>';
                high_scores.forEach(s => {
                    const unit = s.name === 'Reaction' ? ' ms' : '';
                    tableHTML += `<tr><td>${s.name}</td><td>${s.high_score}${unit}</td></tr>`;
                });
                tableHTML += '</tbody></table>';
                highScoresTable.innerHTML = tableHTML;
            } else { highScoresTable.innerHTML = '<p>Play some games to set a high score!</p>'; }

            // Build History Table
            if (history.length > 0) {
                let tableHTML = '<table><thead><tr><th>Game</th><th>Score</th><th>Date</th></tr></thead><tbody>';
                history.forEach(h => {
                    const unit = h.name === 'Reaction' ? ' ms' : '';
                    tableHTML += `<tr><td>${h.name}</td><td>${h.score}${unit}</td><td>${new Date(h.played_at).toLocaleString()}</td></tr>`;
                });
                tableHTML += '</tbody></table>';
                historyTable.innerHTML = tableHTML;
            } else { historyTable.innerHTML = '<p>No games played yet.</p>'; }
        }
    } catch (error) { document.getElementById('profile-container').innerHTML = `<h1>Error</h1><p>Could not load profile. Please log in again.</p>`; }
}

function initAuthForms() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    const registerForm = document.getElementById('register-form');
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
}

// --- Main Execution Logic ---
document.addEventListener('DOMContentLoaded', () => {
    if (closeModalButton) closeModalButton.addEventListener('click', closeModal);
    
    if (typeof checkSession !== 'function') {
        console.error("api.js not loaded before main.js. Aborting.");
        return;
    }
    
    checkSession().then(({ loggedIn, username }) => {
        updateNav(loggedIn, username);
        // Page-specific initializers
        if (document.getElementById('game-grid')) {
            initDashboard();
        } else if (document.getElementById('profile-container')) {
            if (!loggedIn) window.location.href = 'login.html'; else initProfilePage();
        } else if (document.getElementById('login-form') || document.getElementById('register-form')) {
            if (loggedIn) window.location.href = 'index.html'; else initAuthForms();
        }
    }).catch(error => {
        console.error("Session check failed:", error);
        updateNav(false);
        if (document.getElementById('login-form') || document.getElementById('register-form')) {
            initAuthForms();
        }
    });
});