// File: assets/js/main.js
// Description: Main script for handling UI, authentication, modals, and game events.

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

/**
 * Updates the navigation links based on the user's login status.
 * @param {boolean} loggedIn - Whether the user is logged in.
 * @param {string} [username] - The user's username if logged in.
 */
function updateNav(loggedIn, username) {
    if (!navLinksContainer) return;
    navLinksContainer.innerHTML = ''; // Clear existing links

    if (loggedIn) {
        navLinksContainer.innerHTML = `
            <a href="/profile.html">Profile (${username})</a>
            <button id="logout-btn">Logout</button>
        `;
        document.getElementById('logout-btn').addEventListener('click', handleLogout);
    } else {
        navLinksContainer.innerHTML = `
            <a href="/login.html">Login</a>
            <a href="/register.html">Register</a>
        `;
    }
}

/**
 * Displays a message on authentication forms.
 * @param {string} message - The message to display.
 * @param {boolean} isSuccess - Determines the message styling (success or error).
 */
function showFormMessage(message, isSuccess) {
    const messageEl = document.getElementById('form-message');
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = isSuccess ? 'success' : 'error';
        messageEl.style.display = 'block';
    }
}

/**
 * Handles game over events by saving the score.
 * @param {string} gameName - The name of the game (e.g., 'Snake').
 * @param {number} score - The final score.
 */
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
// Make handleGameOver globally accessible for iframes
window.handleGameOver = handleGameOver;


// --- Modal Logic ---

function openModal() {
    if (modal) modal.style.display = 'flex';
}

function closeModal() {
    if (modal) {
        modal.style.display = 'none';
        modalTitle.textContent = '';
        modalBody.innerHTML = ''; // Clear content to stop games
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

/**
 * Opens a specific game in the modal.
 * @param {string} gameFolder - The folder name of the game.
 * @param {string} gameName - The display name of the game.
 */
function launchGame(gameFolder, gameName) {
    modalTitle.textContent = gameName;
    modalBody.innerHTML = `<iframe src="/games/${gameFolder}/index.html"></iframe>`;
    openModal();
}

/**
 * Fetches and displays the leaderboard for a game in the modal.
 * @param {string} gameName - The name of the game.
 */
async function showLeaderboard(gameName) {
    modalTitle.textContent = `${gameName} - Top 10 Leaderboard`;
    modalBody.innerHTML = '<p>Loading...</p>';
    openModal();

    try {
        const data = await getLeaderboard(gameName);
        if (data.success) {
            if (data.leaderboard.length > 0) {
                let tableHTML = '<table><thead><tr><th>Rank</th><th>Player</th><th>Score</th><th>Date</th></tr></thead><tbody>';
                data.leaderboard.forEach((entry, index) => {
                    tableHTML += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${entry.username}</td>
                            <td>${entry.score}</td>
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
            modalBody.innerHTML = `<p>Error: ${data.message}</p>`;
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
            window.location.href = '/'; // Redirect to dashboard
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
                window.location.href = '/login.html'; // Redirect to login page
            }, 2000);
        }
    } catch (error) {
        showFormMessage(error.message, false);
    }
}

async function handleLogout() {
    try {
        await logoutUser();
        window.location.href = '/login.html'; // Redirect to login
    } catch (error) {
        alert('Logout failed. Please try again.');
    }
}

// --- Page-specific Initializers ---

/**
 * Initializes the main dashboard page.
 */
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
                    <button class="btn btn-primary play-btn" data-folder="${game.folder}" data-name="${game.name}">Play</button>
                    <button class="btn btn-secondary leaderboard-btn" data-name="${game.name}">Leaderboard</button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to the new buttons
    gameGrid.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('play-btn')) {
            launchGame(target.dataset.folder, target.dataset.name);
        }
        if (target.classList.contains('leaderboard-btn')) {
            showLeaderboard(target.dataset.name);
        }
    });
}

/**
 * Initializes the profile page.
 */
async function initProfilePage() {
    try {
        const profile = await getProfileData();
        if (profile.success) {
            const { username, high_scores, history } = profile.data;
            
            document.getElementById('profile-username').textContent = `Welcome, ${username}`;

            // Populate high scores
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

            // Populate game history
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
         document.getElementById('profile-container').innerHTML = `<h1>Error</h1><p>Could not load your profile. You may need to <a href="/login.html">log in</a> again.</p>`;
    }
}

/**
 * Initializes authentication forms.
 */
function initAuthForms() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

// --- Main Execution ---
    
// This is the corrected, more reliable page detection logic.
// Instead of checking the URL, we check for an element unique to each page.
document.addEventListener('DOMContentLoaded', () => {
    // This script needs the api.js script to be loaded first,
    // so we include a check for the functions it provides.
    if (typeof checkSession !== 'function') {
        console.error("api.js is not loaded or loaded after main.js. Aborting initialization.");
        return;
    }

    checkSession().then(({ loggedIn, username }) => {
        updateNav(loggedIn, username);

        // --- Page Routing Logic ---
        if (document.getElementById('game-grid')) {
            // We are on the dashboard page
            initDashboard();
        } else if (document.getElementById('profile-container')) {
            // We are on the profile page
            if (!loggedIn) {
                window.location.href = '/login.html';
                return;
            }
            initProfilePage();
        } else if (document.getElementById('login-form') || document.getElementById('register-form')) {
            // We are on a login or register page
            if (loggedIn) {
                window.location.href = '/';
                return;
            }
            initAuthForms();
        }
        
    }).catch(error => {
        console.error("Session check failed:", error);
        updateNav(false); // Assume logged out if session check fails
        // Still try to initialize forms if we are on those pages
        if (document.getElementById('login-form') || document.getElementById('register-form')) {
            initAuthForms();
        }
    });
});