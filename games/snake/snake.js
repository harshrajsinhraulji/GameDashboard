document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    
    // Screens
    const startScreen = document.getElementById('startScreen');
    const gameOverScreen = document.getElementById('gameOverScreen');
    
    // Buttons
    const startButton = document.getElementById('startButton');
    const restartButton = document.getElementById('restartButton');
    
    // Score Displays
    const finalScoreEl = document.getElementById('finalScore');

    const gridSize = 20;
    let snake, food, direction, score, isGameOver, gameLoop;

    function initGame() {
        snake = [{ x: 10, y: 10 }];
        food = {};
        direction = 'right';
        score = 0;
        isGameOver = false;
        scoreEl.textContent = score;
        generateFood();
        draw(); // Initial draw
    }

    function startGame() {
        startScreen.classList.add('hidden');
        gameOverScreen.classList.add('hidden');
        initGame();
        gameLoop = setInterval(update, 100);
    }

    function generateFood() {
        food = {
            x: Math.floor(Math.random() * (canvas.width / gridSize)),
            y: Math.floor(Math.random() * (canvas.height / gridSize))
        };
    }

    function draw() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'lime';
        snake.forEach(segment => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
        });
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

        if (head.x < 0 || head.x * gridSize >= canvas.width || head.y < 0 || head.y * gridSize >= canvas.height) {
            gameOver(); return;
        }
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver(); return;
            }
        }
        snake.unshift(head);
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
        if (window.parent && typeof window.parent.handleGameOver === 'function') {
            window.parent.handleGameOver('Snake', score);
        }
    }

    document.addEventListener('keydown', e => {
        if (isGameOver) return;
        switch (e.key) {
            case 'ArrowUp': if (direction !== 'down') direction = 'up'; break;
            case 'ArrowDown': if (direction !== 'up') direction = 'down'; break;
            case 'ArrowLeft': if (direction !== 'right') direction = 'left'; break;
            case 'ArrowRight': if (direction !== 'left') direction = 'right'; break;
        }
    });
    
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);

    // Initial setup
    initGame();
});