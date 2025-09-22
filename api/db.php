<?php
// File: api/db.php
// Description: Establishes a connection to the MySQL database using PDO.

// --- Database Configuration ---
// Replace these with your actual WAMP MySQL credentials.
define('DB_HOST', 'localhost');
define('DB_USER', 'root'); // Default WAMP username
define('DB_PASS', '');     // Default WAMP password is empty
define('DB_NAME', 'game_dashboard');

// --- Create a PDO instance ---
try {
    // DSN (Data Source Name)
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";

    // PDO Options
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Throw exceptions on errors
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Fetch associative arrays
        PDO::ATTR_EMULATE_PREPARES   => false,                  // Use native prepared statements
    ];

    // Create the PDO object
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
} catch (PDOException $e) {
    // If connection fails, stop the script and show an error.
    // In a production environment, you would log this error instead of showing it to the user.
    http_response_code(500); // Internal Server Error
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
}

// Set header to return JSON content type
header('Content-Type: application/json');

// Start session management
// This is needed for any script that deals with user login state.
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}