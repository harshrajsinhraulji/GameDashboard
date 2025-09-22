document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const minesLeftDisplay = document.getElementById('mines-left');
    const restartBtn = document.getElementById('restart-btn');
    
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
                    element: tile,
                    isMine: false,
                    isRevealed: false,
                    isFlagged: false,
                    adjacentMines: 0
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

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (board[r][c].isMine) continue;
                let count = 0;
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = r + dr;
                        const nc = c + dc;
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].isMine) {
                            count++;
                        }
                    }
                }
                board[r][c].adjacentMines = count;
            }
        }
    }

    function handleTileClick(e) {
        if (gameOver) return;
        const tile = e.target;
        const r = parseInt(tile.dataset.row);
        const c = parseInt(tile.dataset.col);
        const cell = board[r][c];

        if (cell.isFlagged || cell.isRevealed) return;

        if (firstClick) {
            placeMines(r, c);
            firstClick = false;
        }

        if (cell.isMine) {
            endGame(false);
            return;
        }

        revealTile(r, c);
        checkWin();
    }
    
    function handleRightClick(e) {
        e.preventDefault();
        if (gameOver) return;
        const tile = e.target;
        const r = parseInt(tile.dataset.row);
        const c = parseInt(tile.dataset.col);
        const cell = board[r][c];
        
        if (cell.isRevealed) return;
        
        cell.isFlagged = !cell.isFlagged;
        cell.element.classList.toggle('flagged', cell.isFlagged);
        flags += cell.isFlagged ? 1 : -1;
        minesLeftDisplay.textContent = mineCount - flags;
    }

    function revealTile(r, c) {
        const cell = board[r][c];
        if (cell.isRevealed || cell.isFlagged) return;
        cell.isRevealed = true;
        cell.element.classList.add('revealed');

        if (cell.adjacentMines > 0) {
            cell.element.textContent = cell.adjacentMines;
            cell.element.dataset.mines = cell.adjacentMines;
        } else {
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
                }
            }
        }

        setTimeout(() => {
            let score = 0;
            if (isWin) {
                alert('You Win!');
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
    createBoard();
});