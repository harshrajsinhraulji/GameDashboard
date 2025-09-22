import { sendScore } from '../shared/scoreSender.js';

let startBtn = document.getElementById("startBtn");
let box = document.getElementById("box");
let result = document.getElementById("result");

let startTime, endTime, timer;

startBtn.addEventListener("click", () => {
  result.textContent = "";
  startBtn.style.display = "none";

  timer = setTimeout(() => {
    box.style.display = "block";
    box.style.background = "limegreen";
    startTime = new Date().getTime();
  }, Math.random() * 3000 + 1000); // Random delay between 1-4s
});

box.addEventListener("click", () => {
  endTime = new Date().getTime();
  let reactionTime = (endTime - startTime) / 1000;

  result.textContent = `Your reaction time: ${reactionTime.toFixed(3)} seconds`;
  box.style.display = "none";
  startBtn.style.display = "inline-block";

  // Send score to backend (lower is better, so send ms)
  sendScore(5, Math.round(reactionTime * 1000)); // Game ID = 5
});
