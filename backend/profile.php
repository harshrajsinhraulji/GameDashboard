<?php
session_start();
require_once "config.php";

if (!isset($_SESSION["user_id"])) {
    header("Location: login.php");
    exit;
}

$userId = $_SESSION["user_id"];

// Fetch high scores (best score per game)
$highStmt = $pdo->prepare("
    SELECT g.name AS game_name, MAX(s.score) AS highscore
    FROM scores s
    JOIN games g ON s.game_id = g.id
    WHERE s.user_id = :uid
    GROUP BY g.id
    ORDER BY g.name
");
$highStmt->execute([":uid" => $userId]);
$highScores = $highStmt->fetchAll(PDO::FETCH_ASSOC);

// Fetch game history
$histStmt = $pdo->prepare("
    SELECT g.name AS game_name, s.score, s.played_at
    FROM scores s
    JOIN games g ON s.game_id = g.id
    WHERE s.user_id = :uid
    ORDER BY s.played_at DESC
    LIMIT 20
");
$histStmt->execute([":uid" => $userId]);
$history = $histStmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Profile - <?= htmlspecialchars($_SESSION["username"]) ?></title>
  <style>
    body { background:#1e1e2f; color:#fff; font-family:Arial,sans-serif; padding:30px; }
    h1, h2 { margin:0 0 15px; }
    a { color:#3b82f6; text-decoration:none; }
    .section { margin-bottom:30px; }
    table { width:100%; border-collapse:collapse; background:#2f2f44; border-radius:8px; overflow:hidden; }
    th, td { padding:12px; text-align:left; border-bottom:1px solid #3b3b5a; }
    th { background:#3b3b5a; }
    tr:hover td { background:#3b3b5a; }
  </style>
</head>
<body>
  <h1>👤 Profile: <?= htmlspecialchars($_SESSION["username"]) ?></h1>
  <p><a href="index.php">← Back to Dashboard</a></p>

  <div class="section">
    <h2>High Scores</h2>
    <?php if ($highScores): ?>
      <table>
        <tr><th>Game</th><th>Highscore</th></tr>
        <?php foreach ($highScores as $row): ?>
          <tr>
            <td><?= htmlspecialchars($row["game_name"]) ?></td>
            <td><?= htmlspecialchars($row["highscore"]) ?></td>
          </tr>
        <?php endforeach; ?>
      </table>
    <?php else: ?>
      <p>No scores yet. Play some games!</p>
    <?php endif; ?>
  </div>

  <div class="section">
    <h2>Recent Game History</h2>
    <?php if ($history): ?>
      <table>
        <tr><th>Game</th><th>Score</th><th>Played At</th></tr>
        <?php foreach ($history as $row): ?>
          <tr>
            <td><?= htmlspecialchars($row["game_name"]) ?></td>
            <td><?= htmlspecialchars($row["score"]) ?></td>
            <td><?= htmlspecialchars($row["played_at"]) ?></td>
          </tr>
        <?php endforeach; ?>
      </table>
    <?php else: ?>
      <p>No game history yet.</p>
    <?php endif; ?>
  </div>
</body>
</html>
