// games/minesweeper/minesweeper.js
document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const minesLeftDisplay = document.getElementById('mines-left');
    const restartBtn = document.getElementById('restart-btn');
    const backBtn = document.getElementById('back-btn');
    
    const rows = 10;
    const cols = 10;
    const mineCount = 10;
    let board = [];
    let gameOver = false;
    let firstClick = true;
    let flags = 0;

    function createBoard() {
        gameBoard.innerHTML = '';
        board = [];
        gameOver = false;
        firstClick = true;
        flags = 0;
        minesLeftDisplay.textContent = mineCount;

        for (let r = 0; r < rows; r++) {
            board[r] = [];
            for (let c = 0; c < cols; c++) {
                const tile = document.createElement('div');
                tile.classList.add('tile');
                tile.dataset.row = r;
                tile.dataset.col = c;
                tile.addEventListener('click', handleTileClick);
                tile.addEventListener('contextmenu', handleRightClick);
                gameBoard.appendChild(tile);
                board[r][c] = {
                    element: tile, isMine: false, isRevealed: false,
                    isFlagged: false, adjacentMines: 0
                };
            }
        }
    }

    function placeMines(startR, startC) {
        let placedMines = 0;
        while (placedMines < mineCount) {
            const r = Math.floor(Math.random() * rows);
            const c = Math.floor(Math.random() * cols);
            if (!board[r][c].isMine && (r !== startR || c !== startC)) {
                board[r][c].isMine = true;
                placedMines++;
            }
        }
        // Calculate adjacent mines
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (board[r][c].isMine) continue;
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = r + dr;
                        const nc = c + dc;
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].isMine) {
                            board[r][c].adjacentMines++;
                        }
                    }
                }
            }
        }
    }

    function handleTileClick(e) {
        if (gameOver) return;
        const tileData = board[e.target.dataset.row][e.target.dataset.col];
        if (tileData.isFlagged || tileData.isRevealed) return;

        if (firstClick) {
            placeMines(parseInt(e.target.dataset.row), parseInt(e.target.dataset.col));
            firstClick = false;
        }

        if (tileData.isMine) {
            tileData.element.classList.add('mine-hit');
            endGame(false);
            return;
        }
        revealTile(tileData.element.dataset.row, tileData.element.dataset.col);
        checkWin();
    }
    
    function handleRightClick(e) {
        e.preventDefault();
        if (gameOver) return;
        const tileData = board[e.target.dataset.row][e.target.dataset.col];
        if (tileData.isRevealed) return;
        
        tileData.isFlagged = !tileData.isFlagged;
        tileData.element.classList.toggle('flagged', tileData.isFlagged);
        flags += tileData.isFlagged ? 1 : -1;
        minesLeftDisplay.textContent = mineCount - flags;
    }

    function revealTile(r, c) {
        r = parseInt(r); c = parseInt(c);
        const cell = board[r][c];
        if (cell.isRevealed || cell.isFlagged) return;
        cell.isRevealed = true;
        cell.element.classList.add('revealed');

        if (cell.adjacentMines > 0) {
            cell.element.textContent = cell.adjacentMines;
            cell.element.dataset.mines = cell.adjacentMines;
        } else { // Flood fill for empty cells
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                        revealTile(nr, nc);
                    }
                }
            }
        }
    }

    function checkWin() {
        let revealedCount = 0;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (board[r][c].isRevealed) revealedCount++;
            }
        }
        if (revealedCount === rows * cols - mineCount) {
            endGame(true);
        }
    }

    function endGame(isWin) {
        gameOver = true;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (board[r][c].isMine) {
                    board[r][c].element.classList.add('mine');
                    board[r][c].element.classList.remove('flagged');
                }
            }
        }

        setTimeout(() => {
            let score = 0;
            if (isWin) {
                alert('Congratulations! You Win!');
                score = 1000; // Example win score
            } else {
                alert('Game Over! You hit a mine.');
                score = 0;
            }
            if (window.parent && typeof window.parent.handleGameOver === 'function') {
                window.parent.handleGameOver('Minesweeper', score);
            }
        }, 500);
    }

    restartBtn.addEventListener('click', createBoard);
    backBtn.addEventListener('click', () => {
        if (window.parent && typeof window.parent.closeGameModal === 'function') {
            window.parent.closeGameModal();
        }
    });

    createBoard();
});