<?php
session_start();
require 'db.php';
if (isset($_SESSION['user_id'])) { header('Location: dashboard.php'); exit; }
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $pass = $_POST['password'] ?? '';
    $pass2 = $_POST['password2'] ?? '';
    if (!$username || !$email || !$pass) $error = 'Fill all fields';
    elseif ($pass !== $pass2) $error = 'Passwords do not match';
    else {
        // check uniqueness
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? OR username = ?");
        $stmt->execute([$email, $username]);
        if ($stmt->fetch()) $error = 'Email or username already taken';
        else {
            $hash = password_hash($pass, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("INSERT INTO users (username,email,password) VALUES (?,?,?)");
            $stmt->execute([$username, $email, $hash]);
            // auto login
            $id = $pdo->lastInsertId();
            $_SESSION['user_id'] = $id;
            $_SESSION['username'] = $username;
            header('Location: dashboard.php'); exit;
        }
    }
}
?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Sign Up - Game Dashboard</title>
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<div class="auth-card">
  <h1>Sign Up</h1>
  <?php if($error):?><div class="error"><?=$error?></div><?php endif;?>
  <form method="post" action="">
    <label>Username</label><input name="username" required>
    <label>Email</label><input type="email" name="email" required>
    <label>Password</label><input type="password" name="password" required>
    <label>Confirm Password</label><input type="password" name="password2" required>
    <button type="submit">Create Account</button>
  </form>
  <p>Have account? <a href="index.php">Login</a></p>
</div>
</body>
</html>
