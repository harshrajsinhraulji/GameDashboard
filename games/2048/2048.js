document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    const gridSize = 4;
    let grid = [];
    let score = 0;

    function initGame() {
        grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
        score = 0;
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
        let emptyTiles = [];
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                if (grid[r][c] === 0) {
                    emptyTiles.push({ r, c });
                }
            }
        }
        if (emptyTiles.length > 0) {
            const { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            grid[r][c] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    function slide(row) {
        let arr = row.filter(val => val);
        let missing = gridSize - arr.length;
        let zeros = Array(missing).fill(0);
        return arr.concat(zeros);
    }

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
    
    function rotateGrid(grid) {
        let newGrid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                newGrid[c][gridSize - 1 - r] = grid[r][c];
            }
        }
        return newGrid;
    }

    function move(direction) {
        let moved = false;
        let originalGrid = JSON.parse(JSON.stringify(grid));

        if (direction === 'ArrowUp' || direction === 'ArrowDown') {
            grid = rotateGrid(grid);
        }
        if (direction === 'ArrowRight' || direction === 'ArrowDown') {
            grid.forEach(row => row.reverse());
        }

        for (let r = 0; r < gridSize; r++) {
            grid[r] = operate(grid[r]);
        }
        
        if (direction === 'ArrowRight' || direction === 'ArrowDown') {
            grid.forEach(row => row.reverse());
        }
        if (direction === 'ArrowUp' || direction === 'ArrowDown') {
            grid = rotateGrid(grid);
            grid = rotateGrid(grid);
            grid = rotateGrid(grid);
        }

        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                if (originalGrid[r][c] !== grid[r][c]) {
                    moved = true;
                    break;
                }
            }
        }
        return moved;
    }

    function updateScore() {
        scoreDisplay.textContent = score;
    }
    
    function isGameOver() {
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                if (grid[r][c] === 0) return false; // Empty cell
                if (r < gridSize - 1 && grid[r][c] === grid[r + 1][c]) return false; // Can merge down
                if (c < gridSize - 1 && grid[r][c] === grid[r][c + 1]) return false; // Can merge right
            }
        }
        return true;
    }
    
    document.addEventListener('keydown', (e) => {
        const directions = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        if (directions.includes(e.key)) {
            e.preventDefault();
            if (move(e.key)) {
                addRandomTile();
                drawBoard();
                updateScore();
                if (isGameOver()) {
                    setTimeout(() => {
                        alert(`Game Over! Final Score: ${score}`);
                        if (window.parent && typeof window.parent.handleGameOver === 'function') {
                            window.parent.handleGameOver('2048', score);
                        }
                    }, 500);
                }
            }
        }
    });

    initGame();
});