// games/snake/snake.js
document.addEventListener('DOMContentLoaded', () => {
    // --- Canvas & Context ---
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // --- UI Elements ---
    const scoreEl = document.getElementById('score');
    const finalScoreEl = document.getElementById('finalScore');
    const startScreen = document.getElementById('startScreen');
    const gameOverScreen = document.getElementById('gameOverScreen');
    
    // --- Buttons ---
    const startButton = document.getElementById('startButton');
    const restartButton = document.getElementById('restartButton');
    const backButton = document.getElementById('back-btn');

    // --- Game State ---
    const gridSize = 20;
    let snake, food, direction, score, isGameOver, gameLoop;

    // --- Game Functions ---
    function initGame() {
        snake = [{ x: 10, y: 10 }];
        food = {};
        direction = 'right';
        score = 0;
        isGameOver = false;
        scoreEl.textContent = score;
        generateFood();
        draw(); // Draw initial state
    }

    function startGame() {
        startScreen.classList.add('hidden');
        gameOverScreen.classList.add('hidden');
        initGame();
        // Start the game loop
        gameLoop = setInterval(update, 100);
    }

    function generateFood() {
        food = {
            x: Math.floor(Math.random() * (canvas.width / gridSize)),
            y: Math.floor(Math.random() * (canvas.height / gridSize))
        };
    }

    function draw() {
        // Draw background
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

        const head = { ...snake[0] }; // Clone the head
        switch (direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // Check for wall collision
        if (head.x < 0 || head.x * gridSize >= canvas.width || head.y < 0 || head.y * gridSize >= canvas.height) {
            gameOver(); return;
        }
        // Check for self collision
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver(); return;
            }
        }

        snake.unshift(head); // Add new head

        // Check for food collision
        if (head.x === food.x && head.y === food.y) {
            score++;
            scoreEl.textContent = score;
            generateFood();
        } else {
            snake.pop(); // Remove tail
        }

        draw();
    }

    function gameOver() {
        isGameOver = true;
        clearInterval(gameLoop);
        finalScoreEl.textContent = score;
        gameOverScreen.classList.remove('hidden');
        
        // Use the global function from the parent window to handle score saving
        if (window.parent && typeof window.parent.handleGameOver === 'function') {
            window.parent.handleGameOver('Snake', score);
        }
    }
    
    // --- Event Listeners ---
    document.addEventListener('keydown', e => {
        if (isGameOver || startScreen.classList.contains('hidden') === false) return; // Don't move if game hasn't started
        switch (e.key) {
            case 'ArrowUp': if (direction !== 'down') direction = 'up'; break;
            case 'ArrowDown': if (direction !== 'up') direction = 'down'; break;
            case 'ArrowLeft': if (direction !== 'right') direction = 'left'; break;
            case 'ArrowRight': if (direction !== 'left') direction = 'right'; break;
        }
    });

    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);
    backButton.addEventListener('click', () => {
        // Use the global function from the parent window to close the modal
        if (window.parent && typeof window.parent.closeGameModal === 'function') {
            window.parent.closeGameModal();
        }
    });

    // --- Initial Setup ---
    // Prepare the game board but don't start the loop yet
    initGame();
});