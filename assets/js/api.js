// File: assets/js/api.js
// Description: A module for handling all API communication with the backend.

const API_BASE_URL = 'api'; // Relative path to your API folder

/**
 * A generic function to handle Fetch API requests.
 * @param {string} endpoint - The API endpoint to call (e.g., '/login.php').
 * @param {object} options - The options object for the fetch call (method, headers, body).
 * @returns {Promise<object>} - The JSON response from the server.
 */
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// --- API Functions ---

function registerUser(username, email, password) {
    return apiRequest('register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
    });
}

function loginUser(username, password) {
    return apiRequest('login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
}

function logoutUser() {
    return apiRequest('logout.php', { method: 'POST' });
}

function checkSession() {
    return apiRequest('check_session.php');
}

function saveScore(game_name, score) {
    return apiRequest('save_score.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game_name, score }),
    });
}

function getLeaderboard(gameName) {
    return apiRequest(`get_leaderboard.php?game=${encodeURIComponent(gameName)}`);
}

function getProfileData() {
    return apiRequest('get_profile.php');
}