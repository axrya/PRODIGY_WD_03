document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll('.cell');
    const statusText = document.getElementById('game-status');
    const resetButton = document.getElementById('reset-button');
    const gameModeSelect = document.getElementById('game-mode');

    let currentPlayer = 'X';
    let gameActive = true;
    let gameState = ["", "", "", "", "", "", "", "", ""];
    let gameMode = "human";

    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // Change game mode event
    gameModeSelect.addEventListener('change', (event) => {
        gameMode = event.target.value;
        resetGame();
    });

    // Handle cell click
    function handleCellClick(event) {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (gameState[clickedCellIndex] !== "" || !gameActive) {
            return;
        }

        handleMove(clickedCell, clickedCellIndex);

        if (gameMode === 'ai' && currentPlayer === 'O' && gameActive) {
            setTimeout(aiMove, 500);
        }
    }

    // Handle player move
    function handleMove(cell, index) {
        gameState[index] = currentPlayer;
        cell.textContent = currentPlayer;

        checkForWinner();
        if (gameActive) {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            statusText.textContent = `Player ${currentPlayer}'s Turn`;
        }
    }

    // AI Move (basic random move, can be replaced with minimax)
    function aiMove() {
        const bestMove = findBestMove();
        gameState[bestMove] = 'O';
        cells[bestMove].textContent = 'O';

        checkForWinner();
        if (gameActive) {
            currentPlayer = 'X';
            statusText.textContent = `Player ${currentPlayer}'s Turn`;
        }
    }

    // Find best move for AI
    function findBestMove() {
        return gameState.indexOf("");
    }

    // Check for winner
    function checkForWinner() {
        let roundWon = false;
        let winningCombo = [];

        for (let i = 0; i < winConditions.length; i++) {
            const [a, b, c] = winConditions[i];
            if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                roundWon = true;
                winningCombo = [a, b, c];
                break;
            }
        }

        if (roundWon) {
            statusText.textContent = `Player ${currentPlayer} Wins!`;
            highlightWinningCells(winningCombo);
            gameActive = false;
            return;
        }

        if (!gameState.includes("")) {
            statusText.textContent = `It's a Draw!`;
            gameActive = false;
            return;
        }
    }

    // Highlight winning cells
    function highlightWinningCells(combo) {
        combo.forEach(index => cells[index].classList.add('winning'));
    }

    // Reset game state
    function resetGame() {
        gameActive = true;
        currentPlayer = 'X';
        gameState = ["", "", "", "", "", "", "", "", ""];
        statusText.textContent = `Player X's Turn`;
        cells.forEach(cell => {
            cell.textContent = "";
            cell.classList.remove('winning');
        });
    }

    // Event Listeners
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', resetGame);
});
