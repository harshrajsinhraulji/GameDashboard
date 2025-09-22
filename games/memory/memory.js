// games/memory/memory.js
document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const movesDisplay = document.getElementById('moves');
    const finalMovesDisplay = document.getElementById('final-moves');
    const winOverlay = document.getElementById('win-overlay');
    const restartBtn = document.getElementById('restart-btn');
    const backBtn = document.getElementById('back-btn');

    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let canFlip = true;

    function shuffle(array) {
        array.sort(() => Math.random() - 0.5);
    }

    function initGame() {
        cards = [...emojis, ...emojis];
        shuffle(cards);
        gameBoard.innerHTML = '';
        winOverlay.classList.add('hidden');
        matchedPairs = 0;
        moves = 0;
        canFlip = true;
        movesDisplay.textContent = moves;

        for (let i = 0; i < cards.length; i++) {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.emoji = cards[i];
            
            card.innerHTML = `
                <div class="card-face card-front"></div>
                <div class="card-face card-back">${cards[i]}</div>
            `;
            card.addEventListener('click', handleCardClick);
            gameBoard.appendChild(card);
        }
    }

    function handleCardClick(e) {
        if (!canFlip) return;
        const clickedCard = e.currentTarget;
        // Ignore clicks on already flipped or matched cards
        if (clickedCard.classList.contains('flipped')) return;

        clickedCard.classList.add('flipped');
        flippedCards.push(clickedCard);

        if (flippedCards.length === 2) {
            canFlip = false; // Prevent more flips while checking
            incrementMoves();
            checkForMatch();
        }
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;
        if (card1.dataset.emoji === card2.dataset.emoji) {
            // It's a match!
            matchedPairs++;
            flippedCards = [];
            canFlip = true;
            if (matchedPairs === emojis.length) {
                endGame();
            }
        } else {
            // Not a match, flip back after a delay
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
                canFlip = true;
            }, 1000);
        }
    }
    
    function incrementMoves() {
        moves++;
        movesDisplay.textContent = moves;
    }

    function endGame() {
        finalMovesDisplay.textContent = moves;
        winOverlay.classList.remove('hidden');

        // Score is higher for fewer moves.
        const score = Math.max(1000 - (moves * 10), 0); // Ensure score is not negative
        if (window.parent && typeof window.parent.handleGameOver === 'function') {
            window.parent.handleGameOver('Memory', score);
        }
    }

    restartBtn.addEventListener('click', initGame);
    backBtn.addEventListener('click', () => {
        if (window.parent && typeof window.parent.closeGameModal === 'function') {
            window.parent.closeGameModal();
        }
    });

    initGame();
});