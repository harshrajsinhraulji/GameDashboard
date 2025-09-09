<?php
require_once 'config.php';
if (!isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit;
}

$page_title = 'Leaderboard';
include 'partials/header.php';
?>

<div class="text-center mb-10">
    <h1 class="text-4xl font-bold font-display">Leaderboard</h1>
    <p class="text-slate-300">See the top players across all games</p>
</div>

<div class="max-w-4xl mx-auto bg-slate-800 p-8 rounded-lg shadow-xl">
    <div class="flex justify-end mb-6">
        <select id="game-filter" class="bg-slate-700 border-slate-600 rounded-md shadow-sm p-2 focus:ring-cyan-500 focus:border-cyan-500">
            <option value="all">All Games</option>
            <option value="2048">2048</option>
            <option value="snake">Snake</option>
            <option value="flappy">Flappy</option>
            <option value="memory">Memory</option>
        </select>
    </div>
    
    <div class="overflow-x-auto">
        <table class="min-w-full">
            <thead class="bg-slate-700">
                <tr>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Rank</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Player</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Game</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Score</th>
                    <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Date</th>
                </tr>
            </thead>
            <tbody id="leaderboard-body" class="text-slate-300">
                <!-- Data will be loaded here by JavaScript -->
                <tr><td colspan="5" class="text-center p-8">Loading...</td></tr>
            </tbody>
        </table>
    </div>
</div>

<script src="js/leaderboard.js"></script>

<?php include 'partials/footer.php'; ?>
