// File: assets/js/main.js
// Description: Main script for handling UI, authentication, modals, and game events.
// Add this at the top of assets/js/main.js

/**
 * Plays a sound effect.
 * @param {string} soundName - The name of the sound file (e.g., 'score.mp3').
 */
function playSound(soundName) {
    try {
        const audio = new Audio(`../assets/sounds/${soundName}`);
        audio.play();
    } catch (e) {
        console.warn("Could not play sound", e);
    }
}
// --- State & Configuration ---
const games = [
    { name: "Snake", folder: "snake", desc: "A modern take on the classic arcade game." },
    { name: "2048", folder: "2048", desc: "Slide tiles to combine them and reach 2048." },
    { name: "Minesweeper", folder: "minesweeper", desc: "Clear the board without detonating any mines." },
    { name: "Memory", folder: "memory", desc: "Test your memory by matching pairs of cards." },
    { name: "Reaction", folder: "reaction", desc: "Test your reaction time. Click when it turns green!" },
];

// --- UI Elements ---
const navLinksContainer = document.querySelector('.nav-links');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const closeModalButton = document.querySelector('.close-button');

// --- Core Functions ---
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

async function handleGameOver(gameName, score) {
    console.log(`Game Over: ${gameName}, Score: ${score}`);
    closeModal();
    try {
        const session = await checkSession();
        if (session.loggedIn) {
            await saveScore(gameName, score);
            alert(`Score of ${score} saved for ${gameName}!`);
        } else {
            alert(`You finished ${gameName} with a score of ${score}. Log in to save your scores!`);
        }
    } catch (error) {
        console.error('Failed to save score:', error);
        alert('Could not save your score. Please try again later.');
    }
}
window.handleGameOver = handleGameOver;

// --- Modal Logic ---
function openModal() {
    if (modal) modal.style.display = 'flex';
}

function closeModal() {
    if (modal) {
        modal.style.display = 'none';
        modalTitle.textContent = '';
        modalBody.innerHTML = '';
    }
}

if (closeModalButton) {
    closeModalButton.addEventListener('click', closeModal);
}
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

// THIS IS THE CORRECTED FUNCTION
// In assets/js/main.js

function launchGame(gameFolder, gameName) {
    modalTitle.textContent = gameName;
    modalBody.innerHTML = `<iframe src="games/${gameFolder}/index.html"></iframe>`;
    
    // Add this line to automatically focus the game
    modalBody.querySelector('iframe').onload = function() { this.contentWindow.focus(); };

    openModal();
}

// In assets/js/main.js

async function showLeaderboard(gameName) {
    modalTitle.textContent = `${gameName} - Top 10 Leaderboard`;
    modalBody.innerHTML = '<p>Loading...</p>';
    openModal();

    try {
        // The API now returns the data and a 'unit' (like 'ms')
        const { success, leaderboard, unit, message } = await getLeaderboard(gameName);
        if (success) {
            if (leaderboard.length > 0) {
                let tableHTML = '<table><thead><tr><th>Rank</th><th>Player</th><th>Score</th><th>Date</th></tr></thead><tbody>';
                leaderboard.forEach((entry, index) => {
                    tableHTML += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${entry.username}</td>
                            <td>${entry.score}${unit}</td>
                            <td>${new Date(entry.played_at).toLocaleDateString()}</td>
                        </tr>
                    `;
                });
                tableHTML += '</tbody></table>';
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

// --- Event Handlers ---
async function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const username = form.username.value;
    const password = form.password.value;
    try {
        const data = await loginUser(username, password);
        if (data.success) {
            window.location.href = 'index.html'; // Corrected path
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
                window.location.href = 'login.html'; // Corrected path
            }, 2000);
        }
    } catch (error) {
        showFormMessage(error.message, false);
    }
}

async function handleLogout() {
    try {
        await logoutUser();
        window.location.href = 'login.html'; // Corrected path
    } catch (error) {
        alert('Logout failed. Please try again.');
    }
}

// --- Page-specific Initializers ---
// In assets/js/main.js

function initDashboard() {
    const gameGrid = document.getElementById('game-grid');
    if (!gameGrid) return;
    
    gameGrid.innerHTML = games.map(game => `
        <div class="game-card">
            <div class="game-card-image">${game.name}</div>
            <div class="game-card-content">
                <h3>${game.name}</h3>
                <p>${game.desc}</p>
                <div class="game-card-actions">
                    <a href="games/${game.folder}/index.html" target="_blank" class="btn btn-primary">Play</a>
                    <button class="btn btn-secondary leaderboard-btn" data-name="${game.name}">Leaderboard</button>
                </div>
            </div>
        </div>
    `).join('');
    
    // The event listener no longer needs to handle "play" clicks
    gameGrid.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('leaderboard-btn')) {
            showLeaderboard(target.dataset.name);
        }
    });
}

async function initProfilePage() {
    try {
        const profile = await getProfileData();
        if (profile.success) {
            const { username, high_scores, history } = profile.data;
            document.getElementById('profile-username').textContent = `Welcome, ${username}`;
            const highScoresTable = document.getElementById('high-scores-table');
            if (high_scores.length > 0) {
                let tableHTML = '<table><thead><tr><th>Game</th><th>High Score</th></tr></thead><tbody>';
                high_scores.forEach(s => {
                    tableHTML += `<tr><td>${s.name}</td><td>${s.high_score}</td></tr>`;
                });
                tableHTML += '</tbody></table>';
                highScoresTable.innerHTML = tableHTML;
            } else {
                highScoresTable.innerHTML = '<p>You haven\'t set any high scores yet. Go play some games!</p>';
            }
            const historyTable = document.getElementById('history-table');
            if (history.length > 0) {
                 let tableHTML = '<table><thead><tr><th>Game</th><th>Score</th><th>Date</th></tr></thead><tbody>';
                history.forEach(h => {
                    tableHTML += `<tr><td>${h.name}</td><td>${h.score}</td><td>${new Date(h.played_at).toLocaleString()}</td></tr>`;
                });
                tableHTML += '</tbody></table>';
                historyTable.innerHTML = tableHTML;
            } else {
                 historyTable.innerHTML = '<p>No games played yet.</p>';
            }
        }
    } catch (error) {
         document.getElementById('profile-container').innerHTML = `<h1>Error</h1><p>Could not load your profile. You may need to <a href="login.html">log in</a> again.</p>`;
    }
}

function initAuthForms() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
}

// --- Main Execution ---
document.addEventListener('DOMContentLoaded', () => {
    if (typeof checkSession !== 'function') {
        console.error("api.js is not loaded or loaded after main.js. Aborting initialization.");
        return;
    }
    checkSession().then(({ loggedIn, username }) => {
        updateNav(loggedIn, username);
        if (document.getElementById('game-grid')) {
            initDashboard();
        } else if (document.getElementById('profile-container')) {
            if (!loggedIn) {
                window.location.href = 'login.html'; // Corrected path
                return;
            }
            initProfilePage();
        } else if (document.getElementById('login-form') || document.getElementById('register-form')) {
            if (loggedIn) {
                window.location.href = 'index.html'; // Corrected path
                return;
            }
            initAuthForms();
        }
    }).catch(error => {
        console.error("Session check failed:", error);
        updateNav(false);
        if (document.getElementById('login-form') || document.getElementById('register-form')) {
            initAuthForms();
        }
    });
});