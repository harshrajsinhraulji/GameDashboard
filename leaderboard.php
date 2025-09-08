<?php
session_start();
require 'db.php';
$game_filter = $_GET['game'] ?? '';
// get top 50 scores, optionally filter by game name
if ($game_filter) {
    $stmt = $pdo->prepare("SELECT s.score, s.created_at, u.username, g.name as game FROM scores s JOIN users u ON s.user_id=u.id JOIN games g ON s.game_id=g.id WHERE LOWER(g.name)=LOWER(?) ORDER BY s.score DESC LIMIT 50");
    $stmt->execute([$game_filter]);
} else {
    $stmt = $pdo->query("SELECT s.score, s.created_at, u.username, g.name as game FROM scores s JOIN users u ON s.user_id=u.id JOIN games g ON s.game_id=g.id ORDER BY s.score DESC LIMIT 100");
}
$rows = $stmt->fetchAll();
?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Leaderboard</title>
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<header class="container">
  <h1>Leaderboard</h1>
  <div class="nav">
    <?php if(isset($_SESSION['username'])): ?>
      <span><?=htmlspecialchars($_SESSION['username'])?></span> | <a href="dashboard.php">Dashboard</a> | <a href="logout.php">Logout</a>
    <?php else: ?>
      <a href="index.php">Login</a>
    <?php endif; ?>
  </div>
</header>
<main class="container">
  <form method="get">
    <label>Filter by game name:</label>
    <input name="game" value="<?=htmlspecialchars($game_filter)?>">
    <button>Filter</button>
    <a href="leaderboard.php">Clear</a>
  </form>
  <table class="leaderboard">
    <thead><tr><th>#</th><th>Username</th><th>Game</th><th>Score</th><th>Date</th></tr></thead>
    <tbody>
      <?php $i=1; foreach($rows as $r): ?>
        <tr>
          <td><?=$i++?></td>
          <td><?=htmlspecialchars($r['username'])?></td>
          <td><?=htmlspecialchars($r['game'])?></td>
          <td><?=htmlspecialchars($r['score'])?></td>
          <td><?=htmlspecialchars($r['created_at'])?></td>
        </tr>
      <?php endforeach; if (!$rows): ?>
        <tr><td colspan="5">No scores yet.</td></tr>
      <?php endif; ?>
    </tbody>
  </table>
</main>
</body>
</html>
