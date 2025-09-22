<?php
// File: api/logout.php
// Description: Logs the user out by destroying the session.

// We need to start the session to access and destroy it.
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Unset all session variables
$_SESSION = array();

// If it's desired to kill the session, also delete the session cookie.
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Finally, destroy the session.
session_destroy();

header('Content-Type: application/json');
echo json_encode(['success' => true, 'message' => 'You have been logged out.']);