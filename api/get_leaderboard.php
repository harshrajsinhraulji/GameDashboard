<?php
// File: api/get_leaderboard.php
// Description: Fetches top 10 scores, with special sorting for the Reaction game.

require 'db.php';

$game_name = isset($_GET['game']) ? $_GET['game'] : '';

if (empty($game_name)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Game name is required.']);
    exit;
}

try {
    // Determine the sort order based on the game
    // For Reaction, lower scores are better (ASC). For others, higher is better (DESC).
    $sort_order = ($game_name === 'Reaction') ? 'ASC' : 'DESC';

    // SQL query to get top 10 scores with usernames
    $sql = "
        SELECT u.username, s.score, s.played_at
        FROM scores s
        JOIN users u ON s.user_id = u.id
        JOIN games g ON s.game_id = g.id
        WHERE g.name = ?
        ORDER BY s.score {$sort_order}
        LIMIT 10
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$game_name]);
    $leaderboard = $stmt->fetchAll();
    
    // Add a suffix for the score unit
    $unit = ($game_name === 'Reaction') ? 'ms' : '';

    echo json_encode(['success' => true, 'leaderboard' => $leaderboard, 'unit' => $unit]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}