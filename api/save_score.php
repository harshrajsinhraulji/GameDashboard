<?php
// api/save_score.php

require 'db.php';

// Only logged-in users are allowed to save scores
if (!isset($_SESSION['user_id'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(['success' => false, 'message' => 'You must be logged in to save a score.']);
    exit;
}

// Get the posted data from the frontend
$data = json_decode(file_get_contents('php://input'), true);

// Validate that the required data was sent
if (empty($data['game_name']) || !isset($data['score'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Game name and score are required.']);
    exit;
}

$user_id = $_SESSION['user_id'];
$game_name = $data['game_name'];
$score = filter_var($data['score'], FILTER_VALIDATE_INT);

// Final validation
if ($score === false) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid score format.']);
    exit;
}

try {
    // Step 1: Find the game's ID from its name
    $stmt = $pdo->prepare("SELECT id FROM games WHERE name = ?");
    $stmt->execute([$game_name]);
    $game = $stmt->fetch();

    if (!$game) {
        http_response_code(404); // Not Found
        echo json_encode(['success' => false, 'message' => 'Game not found in the database.']);
        exit;
    }
    $game_id = $game['id'];

    // Step 2: Insert the score into the scores table
    $stmt = $pdo->prepare("INSERT INTO scores (user_id, game_id, score) VALUES (?, ?, ?)");
    $stmt->execute([$user_id, $game_id, $score]);

    echo json_encode(['success' => true, 'message' => 'Score saved successfully!']);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'A database error occurred while saving the score.']);
}