// Handles game launching, score submission, and game switching
// Portfolio-ready: loads game logic modules and manages UI

import { initFlappy } from './game-logic/flappy.js';
// import { init2048 } from './game-logic/2048.js';
// import { initSnake } from './game-logic/snake.js';
// import { initMemory } from './game-logic/memory.js';

const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score-display');
const gameOverModal = document.getElementById('game-over-modal');
const finalScoreEl = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-button');

function showGameOver(score) {
    finalScoreEl.textContent = score;
    scoreDisplay.textContent = score;
    gameOverModal.classList.remove('hidden');
}
function hideGameOver() {
    gameOverModal.classList.add('hidden');
}
function submitScore(game, score) {
    fetch('api.php', {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: `action=submit_score&game=${encodeURIComponent(game)}&score=${score}`
    });
}
function startGame(game) {
    hideGameOver();
    scoreDisplay.textContent = 0;
    if (game === 'flappy') {
        initFlappy(gameContainer, score => {
            showGameOver(score);
            submitScore('flappy', score);
        });
    }
    // else if (game === '2048') { ... }
    // else if (game === 'snake') { ... }
    // else if (game === 'memory') { ... }
}
if (window.GAME_NAME) {
    startGame(window.GAME_NAME);
}
if (restartBtn) {
    restartBtn.onclick = () => startGame(window.GAME_NAME);
}
