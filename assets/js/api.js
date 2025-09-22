// File: assets/js/api.js
// Description: A module for handling all API communication with the backend.

const API_BASE_URL = '/api'; // Relative path to your API folder

/**
 * A generic function to handle Fetch API requests.
 * @param {string} endpoint - The API endpoint to call (e.g., '/login.php').
 * @param {object} options - The options object for the fetch call (method, headers, body).
 * @returns {Promise<object>} - The JSON response from the server.
 */
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        // If the server response is not OK, throw an error with the status text.
        if (!response.ok) {
            // Try to parse the error message from the server, otherwise use default text.
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        // If the response is OK, parse and return the JSON body.
        return await response.json();
    } catch (error) {
        console.error('API Request Error:', error);
        // Re-throw the error so it can be caught by the calling function.
        throw error;
    }
}

// --- API Functions ---

/**
 * Registers a new user.
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>}
 */
function registerUser(username, email, password) {
    return apiRequest('/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
    });
}

/**
 * Logs in a user.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<object>}
 */
function loginUser(username, password) {
    return apiRequest('/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
}

/**
 * Logs out the current user.
 * @returns {Promise<object>}
 */
function logoutUser() {
    return apiRequest('/logout.php', { method: 'POST' });
}

/**
 * Checks the current user's session status.
 * @returns {Promise<object>}
 */
function checkSession() {
    return apiRequest('/check_session.php');
}

/**
 * Saves a game score for the logged-in user.
 * @param {string} game_name
 * @param {number} score
 * @returns {Promise<object>}
 */
function saveScore(game_name, score) {
    return apiRequest('/save_score.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game_name, score }),
    });
}

/**
 * Fetches the leaderboard for a specific game.
 * @param {string} gameName
 * @returns {Promise<object>}
 */
function getLeaderboard(gameName) {
    return apiRequest(`/get_leaderboard.php?game=${encodeURIComponent(gameName)}`);
}

/**
 * Fetches the profile data for the logged-in user.
 * @returns {Promise<object>}
 */
function getProfileData() {
    return apiRequest('/get_profile.php');
}