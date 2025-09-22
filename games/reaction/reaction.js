document.addEventListener('DOMContentLoaded', () => {
    const testArea = document.getElementById('test-area');
    const instructions = document.getElementById('instructions');
    const result = document.getElementById('result');
    const timeDisplay = document.getElementById('time');
    const startButton = document.getElementById('startButton');
    const retryButton = document.getElementById('retryButton');

    let startTime, endTime, timeoutId;

    function startTest() {
        instructions.classList.add('hidden');
        result.classList.add('hidden');
        testArea.className = 'state-wait';
        instructions.querySelector('h1').textContent = 'Wait for green...';
        instructions.classList.remove('hidden');

        const delay = Math.random() * 4000 + 1000; // 1-5 seconds
        timeoutId = setTimeout(() => {
            testArea.className = 'state-ready';
            startTime = new Date().getTime();
        }, delay);
    }

    function handleTestClick() {
        if (testArea.classList.contains('state-wait')) {
            clearTimeout(timeoutId);
            instructions.querySelector('h1').textContent = 'Too soon!';
            setTimeout(startTest, 1500);
        } else if (testArea.classList.contains('state-ready')) {
            endTime = new Date().getTime();
            const reactionTime = endTime - startTime;
            
            showResult(reactionTime);
            
            if (window.parent && typeof window.parent.handleGameOver === 'function') {
                // Score is inverse of time, lower is better. We send time as score.
                window.parent.handleGameOver('Reaction', reactionTime);
            }
        }
    }
    
    function showResult(time) {
        testArea.className = 'state-initial';
        instructions.classList.add('hidden');
        timeDisplay.textContent = time;
        result.classList.remove('hidden');
    }

    startButton.addEventListener('click', (e) => {
        e.stopPropagation();
        startTest();
    });
    retryButton.addEventListener('click', (e) => {
        e.stopPropagation();
        startTest();
    });

    testArea.addEventListener('click', handleTestClick);

    // Initial State
    testArea.className = 'state-initial';
});