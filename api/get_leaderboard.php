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
    // --- FIX: Determine the sort order based on the game ---
    // For Reaction, lower scores (times) are better (ASC). For all others, higher is better (DESC).
    $sort_order = ($game_name === 'Reaction') ? 'ASC' : 'DESC';

    // The SQL query uses the dynamic sort order
    $sql = "
        SELECT u.username, s.score
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
    
    // Also send back the unit for the score (e.g., 'ms' for Reaction)
    $unit = ($game_name === 'Reaction') ? 'ms' : '';

    echo json_encode(['success' => true, 'leaderboard' => $leaderboard, 'unit' => $unit]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'A database error occurred.']);
}