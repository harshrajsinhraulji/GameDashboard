import { sendScore } from '../shared/scoreSender.js';

// Minesweeper game
// Score = time survived in seconds

const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const timerEl = document.getElementById("timer");
const resultEl = document.getElementById("result");
const difficultySelect = document.getElementById("difficulty");
const newBtn = document.getElementById("newGameBtn");

let cols, rows, mines;
let grid = [];
let started = false;
let timer = 0;
let timerInterval = null;
let cellsLeft = 0;

function parseDifficulty(val) {
  const [c, r, m] = val.split("|").map(Number);
  return { cols: c, rows: r, mines: m };
}

function resetGame() {
  const cfg = parseDifficulty(difficultySelect.value);
  cols = cfg.cols;
  rows = cfg.rows;
  mines = cfg.mines;
  grid = [];
  started = false;
  clearInterval(timerInterval);
  timer = 0;
  timerEl.textContent = "Time: 0s";
  resultEl.textContent = "";

  boardEl.style.gridTemplateColumns = `repeat(${cols}, auto)`;
  boardEl.innerHTML = "";

  for (let y = 0; y < rows; y++) {
    grid[y] = [];
    for (let x = 0; x < cols; x++) {
      const cell = {
        x,
        y,
        mine: false,
        adj: 0,
        revealed: false,
        flagged: false,
        el: null,
      };
      const el = document.createElement("div");
      el.className = "cell";
      el.oncontextmenu = (e) => {
        e.preventDefault();
        toggleFlag(x, y);
      };
      el.onclick = () => clickCell(x, y);
      cell.el = el;
      grid[y][x] = cell;
      boardEl.appendChild(el);
    }
  }
  cellsLeft = cols * rows - mines;
  statusEl.textContent = "Click a cell to start. Right-click to flag.";
}

function placeMines(firstX, firstY) {
  const exclude = new Set();
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const nx = firstX + dx,
        ny = firstY + dy;
      if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
        exclude.add(`${nx},${ny}`);
      }
    }
  }
  let placed = 0;
  while (placed < mines) {
    const x = Math.floor(Math.random() * cols);
    const y = Math.floor(Math.random() * rows);
    if (exclude.has(`${x},${y}`)) continue;
    if (grid[y][x].mine) continue;
    grid[y][x].mine = true;
    placed++;
  }
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let adj = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx,
            ny = y + dy;
          if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
            if (grid[ny][nx].mine) adj++;
          }
        }
      }
      grid[y][x].adj = adj;
    }
  }
}

function clickCell(x, y) {
  const cell = grid[y][x];
  if (cell.revealed || cell.flagged) return;
  if (!started) {
    placeMines(x, y);
    started = true;
    timerInterval = setInterval(() => {
      timer++;
      timerEl.textContent = `Time: ${timer}s`;
    }, 1000);
  }
  reveal(x, y);
}

function reveal(x, y) {
  const cell = grid[y][x];
  if (cell.revealed || cell.flagged) return;
  cell.revealed = true;
  cell.el.classList.add("revealed");
  if (cell.mine) {
    cell.el.textContent = "💣";
    gameOver(false);
    return;
  }
  cellsLeft--;
  if (cell.adj > 0) {
    cell.el.textContent = cell.adj;
  } else {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx,
          ny = y + dy;
        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
          reveal(nx, ny);
        }
      }
    }
  }
  if (cellsLeft === 0) {
    gameOver(true);
  }
}

function toggleFlag(x, y) {
  const cell = grid[y][x];
  if (cell.revealed) return;
  cell.flagged = !cell.flagged;
  cell.el.textContent = cell.flagged ? "🚩" : "";
}

function gameOver(win) {
  clearInterval(timerInterval);
  for (let row of grid) {
    for (let c of row) {
      if (c.mine && !c.revealed) {
        c.el.textContent = "💣";
        c.el.classList.add("revealed");
      }
    }
  }
  resultEl.textContent = win ? "You Win!" : "Game Over!";
  sendScore(3, timer); // Game ID = 3
}

newBtn.onclick = resetGame;
window.onload = resetGame;
