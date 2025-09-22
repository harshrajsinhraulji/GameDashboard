<?php
session_start();
require_once __DIR__ . '/db.php';
$pdo = getPDO();
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="../frontend/css/styles.css">
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
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 28px;
      padding: 40px 20px 30px 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .game-card {
      background: #23233a;
      border-radius: 14px;
      box-shadow: 0 4px 16px rgba(59,130,246,0.08);
      padding: 32px 0 24px 0;
      min-width: 120px;
      min-height: 120px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      color: #fff;
      text-decoration: none;
      transition: transform 0.15s, box-shadow 0.15s, background 0.2s;
      position: relative;
      cursor: pointer;
    }
    .game-card .emoji {
      font-size: 2.5rem;
      margin-bottom: 10px;
    }
    .game-card:hover {
      background: #3b82f6;
      color: #fff;
      transform: translateY(-6px) scale(1.04);
      box-shadow: 0 8px 32px rgba(59,130,246,0.18);
    }
    .main-footer {
      background: #18182a;
      color: #b3b3d1;
      text-align: center;
      padding: 18px 0 10px 0;
      font-size: 1rem;
      letter-spacing: 0.5px;
      margin-top: auto;
    }
    @media (max-width: 700px) {
      .dashboard {
        gap: 12px;
        padding: 18px 2px 10px 2px;
      }
      .game-card {
        padding: 18px 0 10px 0;
        min-width: 90px;
        min-height: 90px;
        font-size: 0.95rem;
      }
      .game-card .emoji {
        font-size: 1.5rem;
      }
    }
  </style>
</head>
<body>
<header>
<header class="main-header">
  <h1>🎮 Game Dashboard</h1>
  <nav>
    <?php if ($loggedIn): ?>
      <a href="api/profile.php">Profile</a>
  <?php
  require_once __DIR__ . '/auth.php';
  $pdo = getPDO();
  $stmt = $pdo->query("SELECT * FROM games ORDER BY id ASC");
  $games = $stmt->fetchAll(PDO::FETCH_ASSOC);
  $user = getCurrentUser();
  $loggedIn = !!$user;
  ?>
      <a href="logout.php">Logout</a>
    <?php else: ?>
      <a href="login.php">Login</a>
      <a href="register.php">Register</a>
        <span style="margin-right:10px;">Welcome, <?= htmlspecialchars($user['username']) ?></span>
        <a href="api/profile.php">Profile</a>
        <a href="logout.php">Logout</a>
</header>

<main class="dashboard">
  <?php
    $icons = [
      'Snake' => '🐍',
      '2048' => '🔢',
      'Minesweeper' => '💣',
      'Memory' => '🧠',
      'Reaction' => '⚡',
    ];
    foreach ($games as $game):
      $icon = $icons[$game['name']] ?? '🎮';
      $gameFile = strtolower($game['name']) . '.html';
  ?>
    <div class="game-card" onclick="location.href='games/<?php echo $gameFile; ?>'">
      <span class="emoji"><?php echo $icon; ?></span>
      <span><?php echo htmlspecialchars($game['name']); ?></span>
    </div>
  <?php endforeach; ?>
</main>

<footer class="main-footer">
  <p>&copy; 2025 Game Dashboard. All rights reserved.</p>
</footer>
</body>
</html>
