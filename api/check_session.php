<?php
// api/check_session.php

// This starts the session and sets the JSON header
require 'db.php';

// Check if the session variables for a logged-in user exist
if (isset($_SESSION['user_id']) && isset($_SESSION['username'])) {
    // If they exist, the user is logged in
    echo json_encode([
        'success' => true,
        'loggedIn' => true,
        'username' => $_SESSION['username'],
        'userId' => $_SESSION['user_id']
    ]);
} else {
    // Otherwise, the user is a guest
    echo json_encode(['success' => true, 'loggedIn' => false]);
}