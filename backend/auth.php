<?php
// auth.php - robust session + user helpers
if (session_status() === PHP_SESSION_NONE) session_start();
require_once __DIR__ . '/db.php';

function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

function getCurrentUser() {
    if (!isLoggedIn()) return null;
    if (!isset($_SESSION['user'])) {
        $pdo = getPDO();
        $stmt = $pdo->prepare('SELECT id, username, email FROM users WHERE id = ?');
        $stmt->execute([$_SESSION['user_id']]);
        $_SESSION['user'] = $stmt->fetch(PDO::FETCH_ASSOC);
    }
    return $_SESSION['user'];
}

function requireLogin($redirect = null) {
    if (!isLoggedIn()) {
        if ($redirect) {
            header('Location: ' . $redirect);
            exit;
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            exit;
        }
    }
}

function login($userId) {
    $_SESSION['user_id'] = $userId;
    unset($_SESSION['user']);
}

function logout() {
    session_unset();
    session_destroy();
    setcookie(session_name(), '', time() - 3600, '/');
}
