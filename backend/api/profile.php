
require_once __DIR__ . '/../auth.php';
$pdo = getPDO();
requireLogin('../login.php');
$user = getCurrentUser();
$userId = $user['id'];

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
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="../../frontend/css/styles.css">
  <style>
    body { background:#1e1e2f; color:#fff; font-family:'Segoe UI',Arial,sans-serif; padding:30px; }
    h1 { margin-bottom: 18px; font-size: 2rem; }
    h2 { margin: 0 0 12px; font-size: 1.2rem; color: #3b82f6; }
    a { color:#3b82f6; text-decoration:none; }
    .section { margin-bottom:32px; }
    table { width:100%; border-collapse:collapse; background:#23233a; border-radius:10px; overflow:hidden; margin-bottom: 10px; }
    th, td { padding:12px; text-align:left; border-bottom:1px solid #3b3b5a; }
    th { background:#3b3b5a; font-weight:600; }
    tr:hover td { background:#2a2a40; }
    @media (max-width: 700px) {
      body { padding: 8px; }
      table, th, td { font-size: 0.95rem; }
      h1 { font-size: 1.2rem; }
    }
  </style>
</head>
<body>
  <h1>👤 Profile: <?= htmlspecialchars($_SESSION["username"]) ?></h1>
  <p><a href="../index.php">← Back to Dashboard</a></p>

  <div class="section">
    <h2>High Scores</h2>
    <?php if ($highScores): ?>
      <table>
        <tr><th>Game</th><th>High Score</th></tr>
        <?php foreach ($highScores as $row): ?>
          <tr>
            <td><?= htmlspecialchars($row["game_name"]) ?></td>
            <td><?= htmlspecialchars($row["highscore"]) ?></td>
          </tr>
        <?php endforeach; ?>
      </table>
    <?php else: ?>
      <p>No scores yet.</p>
    <?php endif; ?>
  </div>

  <div class="section">
    <h2>Recent Game History</h2>
    <?php if ($history): ?>
      <table>
        <tr><th>Game</th><th>Score</th><th>Date</th></tr>
        <?php foreach ($history as $row): ?>
          <tr>
            <td><?= htmlspecialchars($row["game_name"]) ?></td>
            <td><?= htmlspecialchars($row["score"]) ?></td>
            <td><?= htmlspecialchars($row["played_at"]) ?></td>
          </tr>
        <?php endforeach; ?>
      </table>
    <?php else: ?>
      <p>No recent games played.</p>
    <?php endif; ?>
  </div>
</body>
</html>
