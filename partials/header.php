<?php
require_once __DIR__ . '/../config.php';
$current_page = basename($_SERVER['PHP_SELF']);
$logged_in = isset($_SESSION['user_id']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Game Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="bg-slate-900 text-white font-sans">
    <nav class="bg-slate-800 shadow-lg">
        <div class="container mx-auto px-6 py-3">
            <div class="flex justify-between items-center">
                <a href="dashboard.php" class="text-2xl font-bold font-display text-cyan-400">GAME HUB</a>
                <div>
                    <?php if ($logged_in): ?>
                        <a href="dashboard.php" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700">Dashboard</a>
                        <a href="leaderboard.php" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700">Leaderboard</a>
                        <a href="profile.php" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700">Profile</a>
                        <a href="logout.php" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700">Logout</a>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </nav>
    <main class="container mx-auto px-6 py-8">
