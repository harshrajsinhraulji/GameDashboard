<?php
session_start();
require_once "config.php";

$gameId = isset($_GET["game_id"]) ? (int)$_GET["game_id"] : 0;
if (!$gameId) {
    die("Game not specified.");
}

// Fetch game name
$stmt = $pdo->prepare("SELECT name FROM games WHERE id = :gid");
$stmt->execute([":gid" => $gameId]);
$game = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$game) {
    die("Invalid game.");
}

// Fetch top 10 scores for this game
$lbStmt = $pdo->prepare("
    SELECT u.username, s.score, s.played_at
    FROM scores s
    JOIN users u ON s.user_id = u.id
    WHERE s.game_id = :gid
    ORDER BY s.score DESC, s.played_at ASC
    LIMIT 10
");
$lbStmt->execute([":gid" => $gameId]);
$leaderboard = $lbStmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Leaderboard - <?= htmlspecialchars($game["name"]) ?></title>
  <style>
    body { background:#1e1e2f; color:#fff; font-family:Arial,sans-serif; padding:30px; }
    h1 { margin-bottom:20px; }
    a { color:#3b82f6; text-decoration:none; }
    table { width:100%; border-collapse:collapse; background:#2f2f44; border-radius:8px; overflow:hidden; }
    th, td { padding:12px; text-align:left; border-bottom:1px solid #3b3b5a; }
    th { background:#3b3b5a; }
    tr:hover td { background:#3b3b5a; }
  </style>
</head>
<body>
  <h1>🏆 Leaderboard: <?= htmlspecialchars($game["name"]) ?></h1>
  <p><a href="index.php">← Back to Dashboard</a></p>

  <?php if ($leaderboard): ?>
    <table>
      <tr><th>Rank</th><th>Username</th><th>Score</th><th>Date</th></tr>
      <?php foreach ($leaderboard as $i => $row): ?>
        <tr>
          <td><?= $i + 1 ?></td>
          <td><?= htmlspecialchars($row["username"]) ?></td>
          <td><?= htmlspecialchars($row["score"]) ?></td>
          <td><?= htmlspecialchars($row["played_at"]) ?></td>
        </tr>
      <?php endforeach; ?>
    </table>
  <?php else: ?>
    <p>No scores yet for this game.</p>
  <?php endif; ?>
</body>
</html>
