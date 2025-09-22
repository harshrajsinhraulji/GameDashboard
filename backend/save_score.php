<?php
session_start();
require_once "config.php";

// Expect JSON request
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data["game_id"]) || !isset($data["score"])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid input"]);
    exit;
}

$gameId = (int)$data["game_id"];
$score = (int)$data["score"];

if (isset($_SESSION["user_id"])) {
    $userId = $_SESSION["user_id"];

    $stmt = $pdo->prepare("INSERT INTO scores (user_id, game_id, score) VALUES (:uid, :gid, :score)");
    $stmt->execute([":uid" => $userId, ":gid" => $gameId, ":score" => $score]);

    echo json_encode(["success" => true, "message" => "Score saved"]);
} else {
    // Guests → score not saved
    echo json_encode(["success" => false, "message" => "Login required to save scores"]);
}
