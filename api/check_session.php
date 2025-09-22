<?php
// File: api/check_session.php
// Description: Checks if a user is currently logged in and returns session data.

require 'db.php'; // This starts the session via db.php

if (isset($_SESSION['user_id']) && isset($_SESSION['username'])) {
    // User is logged in
    echo json_encode([
        'loggedIn' => true,
        'username' => $_SESSION['username'],
        'userId' => $_SESSION['user_id']
    ]);
} else {
    // User is not logged in
    echo json_encode(['loggedIn' => false]);
}