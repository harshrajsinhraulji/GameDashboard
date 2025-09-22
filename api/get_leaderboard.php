<?php
// api/get_leaderboard.php

require 'db.php';

$game_name = isset($_GET['game']) ? trim($_GET['game']) : '';

if (empty($game_name)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Game name is required.']);
    exit;
}

try {
    // Determine the aggregate function and sort order based on the game
    $aggregator = ($game_name === 'Reaction') ? 'MIN' : 'MAX';
    $sort_order = ($game_name === 'Reaction') ? 'ASC' : 'DESC';

    // --- NEW SQL QUERY ---
    // This query now finds the single best score for each user before ranking them.
    $sql = "
        SELECT 
            u.username,
            {$aggregator}(s.score) AS best_score
        FROM scores s
        JOIN users u ON s.user_id = u.id
        JOIN games g ON s.game_id = g.id
        WHERE g.name = ?
        GROUP BY u.id, u.username
        ORDER BY best_score {$sort_order}
        LIMIT 10
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$game_name]);
    $leaderboard = $stmt->fetchAll();
    
    $unit = ($game_name === 'Reaction') ? 'ms' : '';

    echo json_encode(['success' => true, 'leaderboard' => $leaderboard, 'unit' => $unit]);

} catch (PDOException $e) {
    http_response_code(500);
    // For debugging: error_log($e->getMessage());
    echo json_encode(['success' => false, 'message' => 'A database error occurred.']);
}