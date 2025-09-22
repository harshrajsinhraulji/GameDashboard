<?php
// api/score.php - Save or fetch scores via AJAX

require_once __DIR__ . '/../auth.php';
$pdo = getPDO();
$method = $_SERVER['REQUEST_METHOD'];
header('Content-Type: application/json');

if ($method === 'POST') {
	// Save a score (user must be logged in)
	$data = json_decode(file_get_contents('php://input'), true);
	if (!$data || !isset($data['game_id']) || !isset($data['score'])) {
		http_response_code(400);
		echo json_encode(['success' => false, 'message' => 'Invalid input']);
		exit;
	}
	requireLogin();
	$user = getCurrentUser();
	$gameId = (int)$data['game_id'];
	$score = (int)$data['score'];
	$userId = (int)$user['id'];
	$stmt = $pdo->prepare('INSERT INTO scores (user_id, game_id, score) VALUES (:uid, :gid, :score)');
	$stmt->execute([':uid' => $userId, ':gid' => $gameId, ':score' => $score]);
	echo json_encode(['success' => true, 'message' => 'Score saved']);
	exit;
}

if ($method === 'GET') {
	// Fetch scores (by user or game)
	$userId = isset($_GET['user_id']) ? (int)$_GET['user_id'] : null;
	$gameId = isset($_GET['game_id']) ? (int)$_GET['game_id'] : null;
	$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
	$limit = max(1, min($limit, 100));

	if ($userId && $gameId) {
		// Scores for a user in a game
		$stmt = $pdo->prepare('SELECT s.id, s.score, s.played_at FROM scores s WHERE s.user_id = :uid AND s.game_id = :gid ORDER BY s.played_at DESC LIMIT :lim');
		$stmt->bindValue(':uid', $userId, PDO::PARAM_INT);
		$stmt->bindValue(':gid', $gameId, PDO::PARAM_INT);
		$stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
		$stmt->execute();
		$scores = $stmt->fetchAll();
		echo json_encode(['scores' => $scores]);
		exit;
	} elseif ($userId) {
		// All scores for a user
		$stmt = $pdo->prepare('SELECT s.id, s.game_id, s.score, s.played_at FROM scores s WHERE s.user_id = :uid ORDER BY s.played_at DESC LIMIT :lim');
		$stmt->bindValue(':uid', $userId, PDO::PARAM_INT);
		$stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
		$stmt->execute();
		$scores = $stmt->fetchAll();
		echo json_encode(['scores' => $scores]);
		exit;
	} elseif ($gameId) {
		// All scores for a game
		$stmt = $pdo->prepare('SELECT s.id, s.user_id, u.username, s.score, s.played_at FROM scores s JOIN users u ON s.user_id = u.id WHERE s.game_id = :gid ORDER BY s.score DESC, s.played_at ASC LIMIT :lim');
		$stmt->bindValue(':gid', $gameId, PDO::PARAM_INT);
		$stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
		$stmt->execute();
		$scores = $stmt->fetchAll();
		echo json_encode(['scores' => $scores]);
		exit;
	} else {
		// All scores (admin/debug)
		$stmt = $pdo->prepare('SELECT * FROM scores ORDER BY played_at DESC LIMIT :lim');
		$stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
		$stmt->execute();
		$scores = $stmt->fetchAll();
		echo json_encode(['scores' => $scores]);
		exit;
	}
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);
