<?php
// api/register.php

require 'db.php';

// Decode the JSON input from the frontend
$data = json_decode(file_get_contents('php://input'), true);

// Basic validation to ensure no fields are empty
if (empty($data['username']) || empty($data['email']) || empty($data['password'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit;
}

// Sanitize inputs
$username = trim($data['username']);
$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
$password = $data['password'];

// More validation
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email format.']);
    exit;
}
if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters long.']);
    exit;
}

// Hash the password for secure storage
$password_hash = password_hash($password, PASSWORD_DEFAULT);

try {
    // Prepare an SQL statement to prevent SQL injection
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)");
    
    // Execute the statement with the user's data
    $stmt->execute([$username, $email, $password_hash]);

    echo json_encode(['success' => true, 'message' => 'Registration successful! You can now log in.']);

} catch (PDOException $e) {
    // Check for a duplicate entry error (error code 23000)
    if ($e->getCode() == 23000) {
        http_response_code(409); // Conflict
        echo json_encode(['success' => false, 'message' => 'Username or email already exists.']);
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode(['success' => false, 'message' => 'An error occurred during registration.']);
    }
}