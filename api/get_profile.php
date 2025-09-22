<?php
// api/get_profile.php

require 'db.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'You must be logged in to view your profile.']);
    exit;
}

$user_id = $_SESSION['user_id'];

try {
    // Get user's best scores
    $high_scores_sql = "
        SELECT 
            g.name,
            CASE 
                WHEN g.name = 'Reaction' THEN MIN(s.score)
                ELSE MAX(s.score)
            END AS high_score
        FROM scores s
        JOIN games g ON s.game_id = g.id
        WHERE s.user_id = ?
        GROUP BY g.name
        ORDER BY g.name
    ";
    $stmt_high = $pdo->prepare($high_scores_sql);
    $stmt_high->execute([$user_id]);
    $high_scores = $stmt_high->fetchAll();

    // Get user's full game history
    $history_sql = "
        SELECT 
            g.name, 
            s.score, 
            -- FIX: Format the timestamp into a standard ISO 8601 format
            DATE_FORMAT(s.played_at, '%Y-%m-%dT%H:%i:%s') AS played_at
        FROM scores s
        JOIN games g ON s.game_id = g.id
        WHERE s.user_id = ?
        ORDER BY s.played_at DESC
    ";
    $stmt_history = $pdo->prepare($history_sql);
    $stmt_history->execute([$user_id]);
    $history = $stmt_history->fetchAll();

    $profile_data = [
        'username' => $_SESSION['username'],
        'high_scores' => $high_scores,
        'history' => $history
    ];

    echo json_encode(['success' => true, 'data' => $profile_data]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'A database error occurred.']);
}