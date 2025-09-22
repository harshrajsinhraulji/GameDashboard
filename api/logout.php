<?php
// api/logout.php

// A session must be started before it can be destroyed
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Unset all of the session variables
$_SESSION = [];

// Delete the session cookie from the browser
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Finally, destroy the session on the server
session_destroy();

// Set the header and send a success response
header('Content-Type: application/json');
echo json_encode(['success' => true, 'message' => 'You have been logged out.']);