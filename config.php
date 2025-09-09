<?php
// config.php
// Database configuration
$db_host = 'localhost';
$db_user = 'root'; // Your DB username
$db_pass = '';     // Your DB password
$db_name = 'game_dashboard'; // Your DB name

// Create a new MySQLi object
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

// Check for connection errors
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Start the session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
