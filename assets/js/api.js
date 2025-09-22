// assets/js/api.js

// CORRECTED: Relative path to your API folder
const API_BASE_URL = 'api';

/**
 * A generic function to handle Fetch API requests.
 * @param {string} endpoint - The API endpoint to call (e.g., 'login.php').
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

        // Handle cases with no JSON body, e.g., a 204 No Content response
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return await response.json();
        }
        return {}; // Return empty object for non-json responses

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