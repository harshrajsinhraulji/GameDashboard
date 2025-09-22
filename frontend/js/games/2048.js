// 2048 Game (modular, emits score)
import { sendScore } from '../shared/scoreSender.js';

const board = document.getElementById('board');
let grid = Array(4).fill().map(() => Array(4).fill(0));
let score = 0;

function updateBoard() {
	board.innerHTML = '';
	grid.forEach(row => {
		row.forEach(v => {
			const tile = document.createElement('div');
			tile.className = 'tile';
			tile.textContent = v ? v : '';
			tile.style.background = v ? `hsl(${Math.log2(v) * 30}, 70%, 60%)` : '#2f2f44';
			board.appendChild(tile);
		});
	});
	document.getElementById('score').innerText = 'Score: ' + score;
}

function addRandomTile() {
	let empty = [];
	grid.forEach((row, y) => row.forEach((v, x) => { if (!v) empty.push({ x, y }); }));
	if (empty.length) {
		let { x, y } = empty[Math.floor(Math.random() * empty.length)];
		grid[y][x] = Math.random() < 0.9 ? 2 : 4;
	}
}

function slide(row) {
	row = row.filter(v => v);
	for (let i = 0; i < row.length - 1; i++) {
		if (row[i] === row[i + 1]) {
			row[i] *= 2;
			score += row[i];
			row[i + 1] = 0;
		}
	}
	row = row.filter(v => v);
	while (row.length < 4) row.push(0);
	return row;
}

function rotateGrid(times = 1) {
	for (let t = 0; t < times; t++) {
		grid = grid[0].map((_, i) => grid.map(row => row[i]).reverse());
	}
}

function move(dir) {
	let old = JSON.stringify(grid);
	if (dir === 'left') {
		grid = grid.map(slide);
	} else if (dir === 'right') {
		grid = grid.map(row => slide(row.reverse()).reverse());
	} else if (dir === 'up') {
		rotateGrid(1);
		grid = grid.map(slide);
		rotateGrid(3);
	} else if (dir === 'down') {
		rotateGrid(1);
		grid = grid.map(row => slide(row.reverse()).reverse());
		rotateGrid(3);
	}
	if (JSON.stringify(grid) !== old) {
		addRandomTile();
		updateBoard();
		if (isGameOver()) {
			sendScore(2, score); // Game ID = 2
		}
	}
}

function isGameOver() {
	for (let y = 0; y < 4; y++) {
		for (let x = 0; x < 4; x++) {
			if (!grid[y][x]) return false;
			if (x < 3 && grid[y][x] === grid[y][x + 1]) return false;
			if (y < 3 && grid[y][x] === grid[y + 1][x]) return false;
		}
	}
	return true;
}

document.addEventListener('keydown', e => {
	if (e.key === 'ArrowLeft') move('left');
	if (e.key === 'ArrowUp') move('up');
	if (e.key === 'ArrowRight') move('right');
	if (e.key === 'ArrowDown') move('down');
});

addRandomTile();
addRandomTile();
updateBoard();
