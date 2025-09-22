<?php
// auth.php - session + user helpers

session_start();
require_once __DIR__ . '/db.php';

function currentUser() {
    return isset($_SESSION['user']) ? $_SESSION['user'] : null;
}

function requireLogin() {
    if (!currentUser()) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
}
