// games/2048/2048.js
document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    const finalScoreDisplay = document.getElementById('final-score');
    const gameOverOverlay = document.getElementById('game-over-overlay');
    const restartBtn = document.getElementById('restart-btn');
    const backBtn = document.getElementById('back-btn');
    
    const gridSize = 4;
    let grid = [];
    let score = 0;
    let isGameOver = false;

    function initGame() {
        grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
        score = 0;
        isGameOver = false;
        gameOverOverlay.classList.add('hidden');
        updateScore();
        addRandomTile();
        addRandomTile();
        drawBoard();
    }

    function drawBoard() {
        gameBoard.innerHTML = '';
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                const value = grid[r][c];
                if (value > 0) {
                    tile.textContent = value;
                    tile.dataset.value = value;
                }
                gameBoard.appendChild(tile);
            }
        }
    }

    function addRandomTile() {
        const emptyTiles = [];
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                if (grid[r][c] === 0) emptyTiles.push({ r, c });
            }
        }
        if (emptyTiles.length > 0) {
            const { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            grid[r][c] = Math.random() < 0.9 ? 2 : 4;
        }
    }
    
    // --- Core Game Logic Functions ---
    function slide(row) { return row.filter(val => val).concat(Array(gridSize - row.filter(val => val).length).fill(0)); }
    function combine(row) {
        for (let i = 0; i < gridSize - 1; i++) {
            if (row[i] !== 0 && row[i] === row[i + 1]) {
                row[i] *= 2;
                score += row[i];
                row[i + 1] = 0;
            }
        }
        return row;
    }
    function operate(row) {
        row = slide(row);
        row = combine(row);
        row = slide(row);
        return row;
    }

    // --- Movement Handlers ---
    function moveLeft() { grid.forEach((row, i) => grid[i] = operate(row)); }
    function moveRight() { grid.forEach((row, i) => grid[i] = operate(row.reverse()).reverse()); }
    function transpose() {
        const newGrid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) { newGrid[c][r] = grid[r][c]; }
        }
        grid = newGrid;
    }
    // FIX: Up and Down logic is now correct
    function moveUp() { transpose(); moveLeft(); transpose(); }
    function moveDown() { transpose(); moveRight(); transpose(); }

    function handleMove(direction) {
        if (isGameOver) return;
        const originalGrid = JSON.stringify(grid);
        switch (direction) {
            case 'ArrowUp': moveUp(); break;
            case 'ArrowDown': moveDown(); break;
            case 'ArrowLeft': moveLeft(); break;
            case 'ArrowRight': moveRight(); break;
        }
        const newGrid = JSON.stringify(grid);

        if (originalGrid !== newGrid) {
            addRandomTile();
            drawBoard();
            updateScore();
            checkGameOver();
        }
    }
    
    function updateScore() { scoreDisplay.textContent = score; }

    function checkGameOver() {
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                if (grid[r][c] === 0) return; // Found an empty tile
                if (c < gridSize - 1 && grid[r][c] === grid[r][c + 1]) return; // Found a horizontal match
                if (r < gridSize - 1 && grid[r][c] === grid[r + 1][c]) return; // Found a vertical match
            }
        }
        isGameOver = true;
        finalScoreDisplay.textContent = score;
        gameOverOverlay.classList.remove('hidden');
        if (window.parent && typeof window.parent.handleGameOver === 'function') {
            window.parent.handleGameOver('2048', score);
        }
    }
    
    // --- Event Listeners ---
    document.addEventListener('keydown', e => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault(); // Prevent page scrolling
            handleMove(e.key);
        }
    });

    restartBtn.addEventListener('click', initGame);
    backBtn.addEventListener('click', () => {
        if (window.parent && typeof window.parent.closeGameModal === 'function') {
            window.parent.closeGameModal();
        }
    });

    initGame();
});