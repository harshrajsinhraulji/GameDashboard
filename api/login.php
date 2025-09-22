<?php
// api/login.php

require 'db.php';

// Decode the JSON input from the frontend
$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['username']) || empty($data['password'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Username and password are required.']);
    exit;
}

$username = $data['username'];
$password = $data['password'];

try {
    // Find the user in the database by their username
    $stmt = $pdo->prepare("SELECT id, username, password_hash FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    // Verify that the user exists AND the password is correct
    if ($user && password_verify($password, $user['password_hash'])) {
        // Credentials are valid, so create a new session
        session_regenerate_id(true); // Prevent session fixation attacks
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];

        echo json_encode(['success' => true, 'message' => 'Login successful!', 'username' => $user['username']]);
    } else {
        // Invalid credentials
        http_response_code(401); // Unauthorized
        echo json_encode(['success' => false, 'message' => 'Invalid username or password.']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'A database error occurred.']);
}