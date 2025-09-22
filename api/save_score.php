<?php
// File: api/save_score.php
// Description: Saves a game score for the currently logged-in user.

require 'db.php';

// Only logged-in users can save scores
if (!isset($_SESSION['user_id'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(['success' => false, 'message' => 'You must be logged in to save a score.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['game_name']) || !isset($data['score'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Game name and score are required.']);
    exit;
}

$user_id = $_SESSION['user_id'];
$game_name = $data['game_name'];
$score = $data['score'];

try {
    // 1. Get the game ID from the game name
    $stmt = $pdo->prepare("SELECT id FROM games WHERE name = ?");
    $stmt->execute([$game_name]);
    $game = $stmt->fetch();

    if (!$game) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Game not found.']);
        exit;
    }
    $game_id = $game['id'];

    // 2. Insert the score
    $stmt = $pdo->prepare("INSERT INTO scores (user_id, game_id, score) VALUES (?, ?, ?)");
    $stmt->execute([$user_id, $game_id, $score]);

    echo json_encode(['success' => true, 'message' => 'Score saved successfully!']);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}