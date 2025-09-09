<?php
require_once 'config.php';
if (!isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit;
}

$page_title = 'Dashboard';
include 'partials/header.php';

$username = htmlspecialchars($_SESSION['username']);
$games = [
    ['name' => '2048', 'url' => 'game.php?name=2048', 'img' => 'https://placehold.co/400x300/1e293b/94a3b8?text=2048', 'desc' => 'Slide tiles to merge them and reach 2048.'],
    ['name' => 'Snake', 'url' => 'game.php?name=snake', 'img' => 'https://placehold.co/400x300/1e293b/94a3b8?text=Snake', 'desc' => 'Grow your snake by eating apples, but don\'t hit the walls!'],
    ['name' => 'Flappy', 'url' => 'game.php?name=flappy', 'img' => 'https://placehold.co/400x300/1e293b/94a3b8?text=Flappy', 'desc' => 'Flap through the pipes and try to get a high score.'],
    ['name' => 'Memory', 'url' => 'game.php?name=memory', 'img' => 'https://placehold.co/400x300/1e293b/94a3b8?text=Memory', 'desc' => 'Match pairs of cards in this classic memory game.'],
];
?>

<div class="text-center">
    <h1 class="text-4xl font-bold font-display mb-4">Welcome, <span class="text-cyan-400"><?php echo $username; ?></span>!</h1>
    <p class="text-xl text-slate-300 mb-10">Choose a game to play</p>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
    <?php foreach ($games as $game): ?>
        <div class="bg-slate-800 rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <img src="<?php echo $game['img']; ?>" alt="<?php echo $game['name']; ?> Game" class="w-full h-48 object-cover">
            <div class="p-6">
                <h3 class="text-2xl font-bold font-display text-cyan-400 mb-2"><?php echo $game['name']; ?></h3>
                <p class="text-slate-400 mb-4"><?php echo $game['desc']; ?></p>
                <a href="<?php echo $game['url']; ?>" class="block w-full text-center bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-md transition duration-300">
                    Play Now
                </a>
            </div>
        </div>
    <?php endforeach; ?>
</div>

<?php include 'partials/footer.php'; ?>
