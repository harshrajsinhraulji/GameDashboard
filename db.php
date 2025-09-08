<?php
// db.php - PDO connection
$host = '127.0.0.1';
$db   = 'game_dashboard';
$user = 'root';
$pass = ''; // change if you set a password for MySQL root
$charset = 'utf8mb4';
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];
try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // Do NOT show credentials or stack in prod.
    exit('Database connection failed: '.$e->getMessage());
}
