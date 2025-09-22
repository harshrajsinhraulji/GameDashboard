
// Deprecated: Use api/score.php instead
http_response_code(410);
echo json_encode(["success" => false, "message" => "Deprecated. Use /api/score.php"]);
