<?php
require_once 'config.php';
if (!isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit;
}

$game_name = $_GET['name'] ?? '2048'; // Default to 2048 if not set
$valid_games = ['2048', 'snake', 'flappy', 'memory'];

if (!in_array($game_name, $valid_games)) {
    // Redirect to dashboard if game is not valid
    header('Location: dashboard.php');
    exit;
}

$page_title = 'Playing ' . ucfirst($game_name);
include 'partials/header.php';
?>

<div class="bg-slate-800 p-8 rounded-lg shadow-xl max-w-4xl mx-auto">
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold font-display text-cyan-400" id="game-title">
            <?php echo ucfirst($game_name); ?>
        </h1>
        <div class="text-2xl font-bold">
            Score: <span id="score-display" class="text-cyan-400">0</span>
        </div>
    </div>
    
    <!-- Game Canvas/Container -->
    <div id="game-container" class="bg-slate-900 rounded-lg flex items-center justify-center" style="min-height: 500px;">
        <!-- Game content will be injected here by JavaScript -->
    </div>
    
    <!-- Game Over Modal -->
    <div id="game-over-modal" class="hidden fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div class="bg-slate-800 p-8 rounded-lg shadow-2xl text-center">
            <h2 class="text-4xl font-bold font-display text-red-500 mb-4">Game Over</h2>
            <p class="text-xl mb-2">Your final score is:</p>
            <p id="final-score" class="text-5xl font-bold text-cyan-400 mb-8">0</p>
            <div class="flex gap-4 justify-center">
                 <button id="restart-button" class="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-md transition duration-300">
                    Play Again
                </button>
                <a href="dashboard.php" class="bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-md transition duration-300">
                    Back to Dashboard
                </a>
            </div>
        </div>
    </div>
</div>

<script>
    // Pass game name to JavaScript
    const GAME_NAME = '<?php echo $game_name; ?>';
</script>
<script src="js/game-handler.js" type="module"></script>

<?php include 'partials/footer.php'; ?>
