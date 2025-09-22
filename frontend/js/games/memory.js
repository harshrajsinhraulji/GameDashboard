// Memory Game
// Score = number of moves (lower is better)

import { sendScore } from '../shared/scoreSender.js';

const boardEl = document.getElementById("board");
const resultEl = document.getElementById("result");
const movesEl = document.getElementById("moves");
const newBtn = document.getElementById("newGameBtn");

let firstCard = null;
let lock = false;
let moves = 0;
let matchedPairs = 0;
const totalPairs = 8;
const symbols = ["🍎","🍌","🍇","🍉","🍓","🥝","🍍","🥥"];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function setupBoard() {
  const cards = [...symbols, ...symbols];
  shuffle(cards);
  boardEl.innerHTML = "";
  moves = 0;
  matchedPairs = 0;
  movesEl.textContent = "Moves: 0";
  resultEl.textContent = "";
  firstCard = null;
  lock = false;

  for (let i = 0; i < cards.length; i++) {
    const card = document.createElement("div");
    card.className = "memory-card";
    card.dataset.symbol = cards[i];
    card.innerHTML = `<span class="front"></span><span class="back">${cards[i]}</span>`;
    card.onclick = () => flipCard(card);
    boardEl.appendChild(card);
  }
}

function flipCard(card) {
  if (lock || card.classList.contains("flipped")) return;
  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  moves++;
  movesEl.textContent = `Moves: ${moves}`;

  if (card.dataset.symbol === firstCard.dataset.symbol) {
    matchedPairs++;
    firstCard = null;
    if (matchedPairs === totalPairs) {
      gameOver();
    }
  } else {
    lock = true;
    setTimeout(() => {
      card.classList.remove("flipped");
      firstCard.classList.remove("flipped");
      firstCard = null;
      lock = false;
    }, 1000);
  }
}

function gameOver() {
  resultEl.textContent = "You matched all pairs!";
  sendScore(4, moves); // Game ID = 4
}

newBtn.onclick = setupBoard;
window.onload = setupBoard;

    function flipCard(card) {
      if (lock || card.classList.contains("flipped")) return;
      card.classList.add("flipped");

      if (!firstCard) {
        firstCard = card;
        return;
      }

      moves++;
      movesEl.textContent = `Moves: ${moves}`;

      if (card.dataset.symbol === firstCard.dataset.symbol) {
        matchedPairs++;
        firstCard = null;
        if (matchedPairs === totalPairs) {
          gameOver();
        }
      } else {
        lock = true;
        setTimeout(() => {
          card.classList.remove("flipped");
          firstCard.classList.remove("flipped");
          firstCard = null;
          lock = false;
        }, 1000);
      }
    }

    function gameOver() {
      resultEl.textContent = "You matched all pairs!";
      sendScore(4, moves); // Game ID = 4
    }

    newBtn.onclick = setupBoard;
window.onload = setupBoard;
