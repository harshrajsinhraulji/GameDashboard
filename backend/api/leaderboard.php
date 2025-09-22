
require_once __DIR__ . '/../auth.php';
$pdo = getPDO();
$user = getCurrentUser();

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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../../frontend/css/styles.css">
");
      body { background:#1e1e2f; color:#fff; font-family:'Segoe UI',Arial,sans-serif; padding:30px; }
      h1 { margin-bottom: 18px; font-size: 2rem; }
      a { color:#3b82f6; text-decoration:none; }
      table { width:100%; border-collapse:collapse; background:#23233a; border-radius:10px; overflow:hidden; margin-bottom: 10px; }
      th, td { padding:12px; text-align:left; border-bottom:1px solid #3b3b5a; }
      th { background:#3b3b5a; font-weight:600; }
      tr:hover td { background:#2a2a40; }
      @media (max-width: 700px) {
        body { padding: 8px; }
        table, th, td { font-size: 0.95rem; }
        h1 { font-size: 1.2rem; }
      }
  <title>Leaderboard - <?= htmlspecialchars($game["name"]) ?></title>
  <style>
    body { background:#1e1e2f; color:#fff; font-family:Arial,sans-serif; padding:30px; }
    <h1>🏆 Leaderboard: <?= htmlspecialchars($game["name"]) ?></h1>
    <p><a href="../index.php">← Back to Dashboard</a></p>

    <?php if ($leaderboard): ?>
      <table>
        <tr><th>Rank</th><th>Username</th><th>Score</th><th>Date</th></tr>
        <?php foreach ($leaderboard as $i => $row): ?>
          <tr>
            <td><?= $i+1 ?></td>
            <td><?= htmlspecialchars($row["username"]) ?></td>
            <td><?= htmlspecialchars($row["score"]) ?></td>
            <td><?= htmlspecialchars($row["played_at"]) ?></td>
          </tr>
        <?php endforeach; ?>
      </table>
    <?php else: ?>
      <p>No scores yet for this game.</p>
    <?php endif; ?>
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
