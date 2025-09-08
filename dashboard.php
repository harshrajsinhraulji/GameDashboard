<?php
session_start();
if (!isset($_SESSION['user_id'])) { header('Location: index.php'); exit; }
require 'db.php';
$user = $_SESSION['username'];
// load games
$stmt = $pdo->query("SELECT * FROM games ORDER BY id");
$games = $stmt->fetchAll();
?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Dashboard - Game Dashboard</title>
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<header>
  <div class="container">
    <h1>Game Dashboard</h1>
    <div class="nav">
      <span>Welcome, <?=htmlspecialchars($user)?></span>
      <a href="leaderboard.php">Leaderboard</a>
      <a href="logout.php">Logout</a>
    </div>
  </div>
</header>
<main class="container">
  <h2>Select a game</h2>
  <div class="game-grid">
    <?php foreach($games as $g): ?>
      <a class="game-card" href="games/<?=strtolower($g['name'])?>.html">
        <h3><?=htmlspecialchars($g['name'])?></h3>
        <p>Play <?=htmlspecialchars($g['name'])?></p>
      </a>
    <?php endforeach; ?>
  </div>
</main>
</body>
</html>
