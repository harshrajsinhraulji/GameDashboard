// games/reaction/reaction.js
document.addEventListener('DOMContentLoaded', () => {
    const testArea = document.getElementById('test-area');
    const content = document.getElementById('content');
    let state = 'initial'; // initial, waiting, ready, result
    let startTime, timeoutId;

    function render() {
        let html = '';
        switch (state) {
            case 'waiting':
                testArea.className = 'state-wait';
                html = `<h1>Wait for green...</h1>`;
                break;
            case 'ready':
                testArea.className = 'state-ready';
                html = `<h1>Click NOW!</h1>`;
                startTime = new Date().getTime();
                break;
            case 'result':
                const reactionTime = new Date().getTime() - startTime;
                testArea.className = 'state-initial';
                html = `
                    <h2>Your time:</h2>
                    <p class="result-time">${reactionTime} ms</p>
                    <button id="retryButton" class="game-btn">Try Again</button>
                    <button id="back-btn" class="game-btn">Back to Dash</button>
                `;
                // Save score
                if (window.parent && typeof window.parent.handleGameOver === 'function') {
                    window.parent.handleGameOver('Reaction', reactionTime);
                }
                break;
            case 'initial':
            default:
                testArea.className = 'state-initial';
                html = `
                    <h1>Reaction Time Test</h1>
                    <p>Click anywhere to begin when the box turns green.</p>
                    <button id="startButton" class="game-btn">Start</button>
                `;
                break;
        }
        content.innerHTML = html;
        attachButtonListeners();
    }
    
    function attachButtonListeners() {
        const startButton = document.getElementById('startButton');
        const retryButton = document.getElementById('retryButton');
        const backBtn = document.getElementById('back-btn');

        if (startButton) startButton.addEventListener('click', startTest);
        if (retryButton) retryButton.addEventListener('click', startTest);
        if (backBtn) backBtn.addEventListener('click', () => {
             if (window.parent && typeof window.parent.closeGameModal === 'function') {
                window.parent.closeGameModal();
            }
        });
    }

    function startTest(e) {
        if (e) e.stopPropagation(); // Prevent the click from registering on the test area
        state = 'waiting';
        render();

        const delay = Math.random() * 4000 + 1000; // 1-5 seconds
        timeoutId = setTimeout(() => {
            state = 'ready';
            render();
        }, delay);
    }

    function handleTestClick() {
        if (state === 'waiting') {
            clearTimeout(timeoutId);
            content.innerHTML = `<h1>Too soon!</h1>`;
            setTimeout(() => {
                state = 'initial';
                render();
            }, 1500);
        } else if (state === 'ready') {
            state = 'result';
            render();
        }
    }
    
    testArea.addEventListener('click', handleTestClick);

    // Initial render
    render();
});