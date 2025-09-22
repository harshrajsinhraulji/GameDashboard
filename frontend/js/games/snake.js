// Snake Game (modular, emits score)
import { sendScore } from '../shared/scoreSender.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let direction = 'RIGHT';
let food = {
	x: Math.floor(Math.random() * 19) * box,
	y: Math.floor(Math.random() * 19) * box
};
let score = 0;
let game;

document.addEventListener('keydown', e => {
	if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
	else if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
	else if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
	else if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
});

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (let i = 0; i < snake.length; i++) {
		ctx.fillStyle = i === 0 ? '#3b82f6' : '#fff';
		ctx.fillRect(snake[i].x, snake[i].y, box, box);
	}
	ctx.fillStyle = 'red';
	ctx.fillRect(food.x, food.y, box, box);
	let headX = snake[0].x;
	let headY = snake[0].y;
	if (direction === 'LEFT') headX -= box;
	if (direction === 'UP') headY -= box;
	if (direction === 'RIGHT') headX += box;
	if (direction === 'DOWN') headY += box;
	if (headX < 0 || headX >= 400 || headY < 0 || headY >= 400 || snake.some(s => s.x === headX && s.y === headY)) {
		clearInterval(game);
		sendScore(1, score); // Game ID = 1
		return;
	}
	if (headX === food.x && headY === food.y) {
		score++;
		document.getElementById('score').innerText = 'Score: ' + score;
		food = {
			x: Math.floor(Math.random() * 19) * box,
			y: Math.floor(Math.random() * 19) * box
		};
	} else {
		snake.pop();
	}
	snake.unshift({ x: headX, y: headY });
}

game = setInterval(draw, 100);
