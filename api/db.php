<?php
// api/db.php

// --- Database Configuration ---
// Replace these with your actual WAMP MySQL credentials.
define('DB_HOST', 'localhost');
define('DB_USER', 'root');     // Default WAMP username
define('DB_PASS', '');         // Default WAMP password is empty
define('DB_NAME', 'game_dashboard');

// --- Create a PDO instance for database connection ---
try {
    // DSN (Data Source Name)
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";

    // PDO Options for error handling and fetch mode
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Throw exceptions on errors
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Fetch associative arrays
        PDO::ATTR_EMULATE_PREPARES   => false,                  // Use native prepared statements for security
    ];

    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
} catch (PDOException $e) {
    // If connection fails, stop the script and return a generic error.
    // In a real production environment, you would log this error instead of displaying it.
    http_response_code(500); // Internal Server Error
    die(json_encode(['success' => false, 'message' => 'Database connection failed.']));
}

// --- Session & Header Management ---

// Set the content type to JSON for all API responses
header('Content-Type: application/json');

// Start a session if one isn't already active
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}