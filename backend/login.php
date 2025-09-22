<?php
session_start();
require_once "config.php";

$message = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = trim($_POST["username"]);
    $password = $_POST["password"];

    if ($username && $password) {
        $stmt = $pdo->prepare("SELECT id, password_hash FROM users WHERE username = :username");
        $stmt->execute([":username" => $username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user["password_hash"])) {
            $_SESSION["user_id"] = $user["id"];
            $_SESSION["username"] = $username;
            header("Location: index.php");
            exit;
        } else {
            $message = "Invalid username or password.";
        }
    } else {
        $message = "All fields are required.";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Login</title>
  <style>
    body { background:#1e1e2f; color:#fff; font-family:Arial,sans-serif; display:flex; justify-content:center; align-items:center; height:100vh; }
    .form-container { background:#2f2f44; padding:30px; border-radius:12px; width:300px; }
    h2 { margin-top:0; text-align:center; }
    input { width:100%; padding:10px; margin:10px 0; border:none; border-radius:8px; }
    button { width:100%; padding:10px; background:#3b82f6; color:#fff; border:none; border-radius:8px; cursor:pointer; font-weight:bold; }
    button:hover { background:#2563eb; }
    .error { color:#f87171; text-align:center; }
  </style>
</head>
<body>
  <div class="form-container">
    <h2>Login</h2>
    <?php if ($message): ?><p class="error"><?= htmlspecialchars($message) ?></p><?php endif; ?>
    <form method="post">
      <input type="text" name="username" placeholder="Username" required>
      <input type="password" name="password" placeholder="Password" required>
      <button type="submit">Log In</button>
    </form>
    <?php if (isset($_GET['registered'])): ?>
      <p style="color:#4ade80; text-align:center;">Registration successful. Please log in.</p>
    <?php endif; ?>
  </div>
</body>
</html>
