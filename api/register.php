<?php
// File: api/register.php
// Description: Handles user registration requests.

require 'db.php';

// Get the posted data.
$data = json_decode(file_get_contents('php://input'), true);

// Basic validation
if (empty($data['username']) || empty($data['email']) || empty($data['password'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Please fill in all fields.']);
    exit;
}

$username = $data['username'];
$email = $data['email'];
$password = $data['password'];

// Hash the password securely
$password_hash = password_hash($password, PASSWORD_DEFAULT);

try {
    // Prepare SQL statement to prevent SQL injection
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)");
    $stmt->execute([$username, $email, $password_hash]);

    echo json_encode(['success' => true, 'message' => 'Registration successful! You can now log in.']);

} catch (PDOException $e) {
    http_response_code(409); // Conflict (e.g., username or email already exists)
    // Check for duplicate entry error code
    if ($e->getCode() == 23000) {
        echo json_encode(['success' => false, 'message' => 'Username or email already exists.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'An error occurred: ' . $e->getMessage()]);
    }
}