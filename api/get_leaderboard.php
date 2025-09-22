<?php
// File: api/get_leaderboard.php
// Description: Fetches the top 10 scores for a specific game.

require 'db.php';

// Get game name from query parameter (e.g., ?game=Snake)
$game_name = isset($_GET['game']) ? $_GET['game'] : '';

if (empty($game_name)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Game name is required.']);
    exit;
}

try {
    // SQL query to get top 10 scores with usernames
    $sql = "
        SELECT u.username, s.score, s.played_at
        FROM scores s
        JOIN users u ON s.user_id = u.id
        JOIN games g ON s.game_id = g.id
        WHERE g.name = ?
        ORDER BY s.score DESC
        LIMIT 10
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$game_name]);
    $leaderboard = $stmt->fetchAll();

    echo json_encode(['success' => true, 'leaderboard' => $leaderboard]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}