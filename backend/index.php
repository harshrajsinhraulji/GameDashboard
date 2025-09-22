<?php
session_start();
require_once "config.php";

// Fetch games dynamically from DB
$stmt = $pdo->query("SELECT * FROM games ORDER BY id ASC");
$games = $stmt->fetchAll(PDO::FETCH_ASSOC);

$loggedIn = isset($_SESSION['user_id']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Game Dashboard</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: linear-gradient(135deg, #1e1e2f, #2a2a40);
      color: #fff;
    }
    header {
      padding: 20px;
      background: #12121c;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    header h1 {
      margin: 0;
      font-size: 24px;
    }
    header nav a {
      margin-left: 15px;
      color: #fff;
      text-decoration: none;
      font-weight: bold;
    }
    .dashboard {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 20px;
      padding: 30px;
    }
    .game-card {
      background: #2f2f44;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      transition: transform 0.2s, background 0.3s;
      cursor: pointer;
    }
    .game-card:hover {
      background: #3b3b5a;
      transform: translateY(-5px);
    }
    .game-card h2 {
      margin: 10px 0 0;
      font-size: 18px;
    }
  </style>
</head>
<body>
<header>
  <h1>🎮 Game Dashboard</h1>
  <nav>
    <?php if ($loggedIn): ?>
      <a href="profile.php">Profile</a>
      <a href="logout.php">Logout</a>
    <?php else: ?>
      <a href="login.php">Login</a>
      <a href="register.php">Register</a>
    <?php endif; ?>
  </nav>
</header>

<main class="dashboard">
  <?php foreach ($games as $game): ?>
    <div class="game-card" onclick="location.href='games/<?php echo strtolower($game['name']); ?>.html'">
      <h2><?php echo htmlspecialchars($game['name']); ?></h2>
    </div>
  <?php endforeach; ?>
</main>
</body>
</html>
