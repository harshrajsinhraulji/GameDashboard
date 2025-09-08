<?php
session_start();
header('Content-Type: application/json');
require 'db.php';
if (!isset($_SESSION['user_id'])) {
    http_response_code(401); echo json_encode(['ok'=>false,'msg'=>'Not authenticated']); exit;
}
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) { http_response_code(400); echo json_encode(['ok'=>false,'msg'=>'No input']); exit; }
$user_id = $_SESSION['user_id'];
$game = $input['game'] ?? '';
$score = (int)($input['score'] ?? 0);
if (!$game || $score < 0) { http_response_code(400); echo json_encode(['ok'=>false,'msg'=>'Invalid']); exit; }
// find game id
$stmt = $pdo->prepare("SELECT id FROM games WHERE LOWER(name) = LOWER(?) LIMIT 1");
$stmt->execute([$game]);
$gameRow = $stmt->fetch();
if (!$gameRow) { http_response_code(400); echo json_encode(['ok'=>false,'msg'=>'Unknown game']); exit; }
$game_id = $gameRow['id'];
$stmt = $pdo->prepare("INSERT INTO scores (user_id, game_id, score) VALUES (?,?,?)");
$stmt->execute([$user_id, $game_id, $score]);
echo json_encode(['ok'=>true,'msg'=>'Saved']);
