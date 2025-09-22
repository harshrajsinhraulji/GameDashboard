// File: games/snake/snake.js
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    const gameOverScreen = document.getElementById('gameOverScreen');
    const finalScoreEl = document.getElementById('finalScore');
    const restartButton = document.getElementById('restartButton');

    const gridSize = 20;
    let snake = [{ x: 10, y: 10 }];
    let food = {};
    let direction = 'right';
    let score = 0;
    let isGameOver = false;
    let gameLoop;

    function generateFood() {
        food = {
            x: Math.floor(Math.random() * (canvas.width / gridSize)),
            y: Math.floor(Math.random() * (canvas.height / gridSize))
        };
    }

    function draw() {
        // Clear canvas
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw snake
        ctx.fillStyle = 'lime';
        snake.forEach(segment => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
        });

        // Draw food
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    }

    function update() {
        if (isGameOver) return;

        const head = { ...snake[0] };
        switch (direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // Check for collision with walls
        if (head.x < 0 || head.x * gridSize >= canvas.width || head.y < 0 || head.y * gridSize >= canvas.height) {
            gameOver();
            return;
        }

        // Check for collision with self
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver();
                return;
            }
        }

        snake.unshift(head);

        // Check for food collision
        if (head.x === food.x && head.y === food.y) {
            score++;
            scoreEl.textContent = score;
            generateFood();
        } else {
            snake.pop();
        }

        draw();
    }

    function gameOver() {
        isGameOver = true;
        clearInterval(gameLoop);
        
        finalScoreEl.textContent = score;
        gameOverScreen.classList.remove('hidden');

        // IMPORTANT: Communicate score back to the parent window (dashboard)
        if (window.parent && typeof window.parent.handleGameOver === 'function') {
            window.parent.handleGameOver('Snake', score);
        } else {
            // Fallback for standalone play
            console.log('Game Over. Final Score:', score);
        }
    }

    function resetGame() {
        snake = [{ x: 10, y: 10 }];
        direction = 'right';
        score = 0;
        isGameOver = false;
        scoreEl.textContent = score;
        gameOverScreen.classList.add('hidden');
        generateFood();
        gameLoop = setInterval(update, 100);
    }

    document.addEventListener('keydown', e => {
        switch (e.key) {
            case 'ArrowUp': if (direction !== 'down') direction = 'up'; break;
            case 'ArrowDown': if (direction !== 'up') direction = 'down'; break;
            case 'ArrowLeft': if (direction !== 'right') direction = 'left'; break;
            case 'ArrowRight': if (direction !== 'left') direction = 'right'; break;
        }
    });
    
    // The restart button inside the game only restarts the game, it doesn't close the modal.
    // The main dashboard's close button handles closing.
    restartButton.addEventListener('click', resetGame);
    
    // Start the game
    resetGame();
});