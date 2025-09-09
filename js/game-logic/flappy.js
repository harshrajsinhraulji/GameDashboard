// Flappy Bird game logic
// Portfolio-ready, minimal playable version

export function initFlappy(container, scoreCallback) {
    container.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 500;
    canvas.style.background = '#222';
    canvas.style.display = 'block';
    canvas.style.margin = '0 auto';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // Game variables
    let birdY = 200, birdV = 0, gravity = 0.5, jump = -7;
    let pipes = [], pipeGap = 120, pipeWidth = 60, pipeSpeed = 2;
    let score = 0, running = true;

    function reset() {
        birdY = 200; birdV = 0; score = 0; running = true;
        pipes = [{x:400, h:Math.random()*200+80}];
    }

    function draw() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        // Bird
        ctx.fillStyle = '#0ff';
        ctx.beginPath();
        ctx.arc(80, birdY, 18, 0, Math.PI*2); ctx.fill();
        // Pipes
        ctx.fillStyle = '#0a0';
        pipes.forEach(p => {
            ctx.fillRect(p.x, 0, pipeWidth, p.h);
            ctx.fillRect(p.x, p.h+pipeGap, pipeWidth, canvas.height-p.h-pipeGap);
        });
        // Score
        ctx.fillStyle = '#fff';
        ctx.font = '24px Inter';
        ctx.fillText('Score: '+score, 10, 30);
    }

    function update() {
        birdV += gravity;
        birdY += birdV;
        // Move pipes
        pipes.forEach(p => p.x -= pipeSpeed);
        // Add new pipe
        if (pipes[pipes.length-1].x < 200) {
            pipes.push({x:400, h:Math.random()*200+80});
        }
        // Remove off-screen pipes
        if (pipes[0].x < -pipeWidth) pipes.shift();
        // Collision
        for (let p of pipes) {
            if (p.x < 98 && p.x+pipeWidth > 62) {
                if (birdY < p.h || birdY > p.h+pipeGap) running = false;
            }
        }
        if (birdY < 0 || birdY > canvas.height) running = false;
        // Score
        pipes.forEach(p => {
            if (p.x+pipeWidth === 80) score++;
        });
    }

    function loop() {
        if (!running) {
            scoreCallback(score);
            return;
        }
        update();
        draw();
        requestAnimationFrame(loop);
    }

    canvas.onclick = () => { if (running) birdV = jump; };
    document.addEventListener('keydown', e => {
        if (e.code === 'Space' && running) birdV = jump;
    });
    reset();
    loop();
}
