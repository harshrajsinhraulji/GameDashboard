document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const movesDisplay = document.getElementById('moves');

    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
    let cards = [...emojis, ...emojis];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let canFlip = true;

    function shuffle(array) {
        array.sort(() => Math.random() - 0.5);
    }

    function createBoard() {
        shuffle(cards);
        gameBoard.innerHTML = '';
        matchedPairs = 0;
        moves = 0;
        movesDisplay.textContent = moves;

        for (let i = 0; i < cards.length; i++) {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.emoji = cards[i];
            
            const cardFront = document.createElement('div');
            cardFront.classList.add('card-face', 'card-front');

            const cardBack = document.createElement('div');
            cardBack.classList.add('card-face', 'card-back');
            cardBack.textContent = cards[i];

            card.appendChild(cardFront);
            card.appendChild(cardBack);
            card.addEventListener('click', handleCardClick);
            gameBoard.appendChild(card);
        }
    }

    function handleCardClick(e) {
        if (!canFlip) return;
        const clickedCard = e.currentTarget;
        if (clickedCard.classList.contains('flipped') || flippedCards.includes(clickedCard)) return;

        clickedCard.classList.add('flipped');
        flippedCards.push(clickedCard);

        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = moves;
            canFlip = false;
            checkForMatch();
        }
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;
        if (card1.dataset.emoji === card2.dataset.emoji) {
            matchedPairs++;
            flippedCards = [];
            canFlip = true;
            if (matchedPairs === emojis.length) {
                endGame();
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
                canFlip = true;
            }, 1000);
        }
    }

    function endGame() {
        setTimeout(() => {
            alert(`You won in ${moves} moves!`);
            // Score can be inverse of moves
            const score = 1000 - (moves * 10);
            if (window.parent && typeof window.parent.handleGameOver === 'function') {
                window.parent.handleGameOver('Memory', score > 0 ? score : 0);
            }
        }, 500);
    }

    createBoard();
});