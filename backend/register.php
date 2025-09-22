<?php
session_start();
require_once "config.php";

$message = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = trim($_POST["username"]);
    $email = trim($_POST["email"]);
    $password = $_POST["password"];

    if ($username && $email && $password) {
        // Check if username/email already exist
        $stmt = $pdo->prepare("SELECT id FROM users WHERE username = :username OR email = :email");
        $stmt->execute([":username" => $username, ":email" => $email]);
        if ($stmt->fetch()) {
            $message = "Username or email already taken.";
        } else {
            // Insert new user
            $hash = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("INSERT INTO users (username, email, password_hash) VALUES (:username, :email, :hash)");
            $stmt->execute([
                ":username" => $username,
                ":email" => $email,
                ":hash" => $hash
            ]);
            header("Location: login.php?registered=1");
            exit;
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
  <title>Register</title>
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
    <h2>Register</h2>
    <?php if ($message): ?><p class="error"><?= htmlspecialchars($message) ?></p><?php endif; ?>
    <form method="post">
      <input type="text" name="username" placeholder="Username" required>
      <input type="email" name="email" placeholder="Email" required>
      <input type="password" name="password" placeholder="Password" required>
      <button type="submit">Sign Up</button>
    </form>
  </div>
</body>
</html>
