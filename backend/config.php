<?php
// config.php - Database connection using PDO

$host = "localhost";   // WAMP default
$db   = "game_dashboard"; // Change to your DB name
$user = "root";        // Default WAMP username
$pass = "";            // Default WAMP password

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>
