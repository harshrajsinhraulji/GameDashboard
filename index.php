<?php
session_start();
require 'db.php';
if (isset($_SESSION['user_id'])) {
    header('Location: dashboard.php'); exit;
}
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $pass  = $_POST['password'] ?? '';
    if (!$email || !$pass) $error = 'Fill all fields';
    else {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        if ($user && password_verify($pass, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            header('Location: dashboard.php'); exit;
        } else $error = 'Invalid credentials';
    }
}
?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Login - Game Dashboard</title>
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<div class="auth-card">
  <h1>Login</h1>
  <?php if($error):?><div class="error"><?=$error?></div><?php endif;?>
  <form method="post" action="">
    <label>Email</label><input type="email" name="email" required>
    <label>Password</label><input type="password" name="password" required>
    <button type="submit">Login</button>
  </form>
  <p>Don't have account? <a href="signup.php">Sign up</a></p>
</div>
</body>
</html>
