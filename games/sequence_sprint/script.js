document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const endScreen = document.getElementById('end-screen');

    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');

    const levelDisplay = document.getElementById('level-display');
    const scoreDisplay = document.getElementById('score-display');
    const timerDisplay = document.getElementById('timer-display');
    const finalScoreDisplay = document.getElementById('final-score');
    const gameGrid = document.getElementById('game-grid');
    const messageArea = document.getElementById('message-area');

    // Game Constants
    const TOTAL_CELLS = 30;
    const TOTAL_GAME_TIME = 60; // in seconds

    // Game State Variables
    let difficulty = 1;
    let score = 0;
    let remainingTime = TOTAL_GAME_TIME;
    let timerInterval = null;
    let currentSequence = [];
    let playerInputIndex = 0;
    let isPlayerTurn = false;
    let cells = [];

    // --- Game Flow Functions ---

    function initGame() {
        // Reset state
        difficulty = 1;
        score = 0;
        remainingTime = TOTAL_GAME_TIME;
        
        // Update UI
        scoreDisplay.textContent = score;
        levelDisplay.textContent = difficulty;
        updateTimerDisplay();

        // Switch screens
        startScreen.classList.remove('active');
        endScreen.classList.remove('active');
        gameScreen.classList.add('active');

        // Setup
        createGrid();
        startGameTimer();
        startRound();
    }

    function endGame() {
        clearInterval(timerInterval);
        finalScoreDisplay.textContent = score;
        gameScreen.classList.remove('active');
        endScreen.classList.add('active');
    }
    
    function startRound() {
        isPlayerTurn = false;
        playerInputIndex = 0;
        messageArea.textContent = '';
        
        // Reset cell styles and content
        cells.forEach(cell => {
            cell.className = 'cell';
            cell.textContent = ''; // <--- 新增這一行
        });

        // Determine number of cells to select based on difficulty
        const cellsToSelect = Math.min(4 + difficulty, TOTAL_CELLS);
        
        // Generate a random sequence of unique cell indices
        const availableIndices = Array.from({ length: TOTAL_CELLS }, (_, i) => i);
        currentSequence = [];
        for (let i = 0; i < cellsToSelect; i++) {
            const randomIndex = Math.floor(Math.random() * availableIndices.length);
            currentSequence.push(availableIndices.splice(randomIndex, 1)[0]);
        }

        displaySequence();
    }

    // --- Core Mechanics Functions ---

    async function displaySequence() {
        // Short delay before sequence starts
        await sleep(1000); 

        for (let i = 0; i < currentSequence.length; i++) {
            const cellIndex = currentSequence[i];
            const cell = cells[cellIndex];

            // Show number
            cell.textContent = i + 1;
            cell.classList.add('showing-number');
            
            await sleep(500); // Display number for 0.5s

            // Hide number and keep highlighted
            cell.textContent = '';
            cell.classList.remove('showing-number');
            cell.classList.add('selected');
        }

        // After sequence is shown, it's player's turn
        isPlayerTurn = true;
        cells.forEach(cell => cell.classList.add('clickable'));
        messageArea.textContent = 'Your turn!';
    }
    
    function handleCellClick(event) {
        if (!isPlayerTurn) return;

        const clickedCell = event.target;
        const clickedIndex = parseInt(clickedCell.dataset.index);

        // Check if the clicked cell is part of the sequence
        if (!currentSequence.includes(clickedIndex)) return;

        // Check if it's the correct cell in the sequence order
        if (clickedIndex === currentSequence[playerInputIndex]) {
            // Correct click
            clickedCell.classList.add('correct');
            playerInputIndex++;
            
            // Check if round is complete
            if (playerInputIndex === currentSequence.length) {
                roundSuccess();
            }
        } else {
            // Incorrect click
            clickedCell.classList.add('incorrect');
            roundFailure();
        }
    }

    function roundSuccess() {
        isPlayerTurn = false;
        score += difficulty * 10;
        difficulty++;
        
        scoreDisplay.textContent = score;
        levelDisplay.textContent = difficulty;
        messageArea.textContent = 'Success!';

        setTimeout(startRound, 1500);
    }
    
    function roundFailure() {
        isPlayerTurn = false;
        if (difficulty > 1) {
            difficulty--;
        }
        levelDisplay.textContent = difficulty;
        messageArea.textContent = 'Try Again!';

        // Show the correct sequence
        for (let i = 0; i < currentSequence.length; i++) {
            cells[currentSequence[i]].textContent = i + 1;
        }

        setTimeout(startRound, 2000);
    }

    // --- Helper & UI Functions ---

    function createGrid() {
        gameGrid.innerHTML = '';
        cells = [];
        for (let i = 0; i < TOTAL_CELLS; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.addEventListener('click', handleCellClick);
            gameGrid.appendChild(cell);
            cells.push(cell);
        }
    }
    
    function startGameTimer() {
        timerInterval = setInterval(() => {
            remainingTime--;
            updateTimerDisplay();
            if (remainingTime <= 0) {
                endGame();
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(remainingTime / 60).toString().padStart(2, '0');
        const seconds = (remainingTime % 60).toString().padStart(2, '0');
        timerDisplay.textContent = `${minutes}:${seconds}`;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // --- Event Listeners ---
    startBtn.addEventListener('click', initGame);
    restartBtn.addEventListener('click', initGame);

    const mainpageBtn1 = document.getElementById('mainpage-btn-1');
    const mainpageBtn2 = document.getElementById('mainpage-btn-2');

    // Handle main page URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const mainpageUrl = urlParams.get('mainpage_url');

    if (mainpageUrl) {
        mainpageBtn1.addEventListener('click', () => {
            window.location.href = mainpageUrl;
        });
        mainpageBtn2.addEventListener('click', () => {
            window.location.href = mainpageUrl;
        });
    } else {
        mainpageBtn1.style.display = 'none';
        mainpageBtn2.style.display = 'none';
    }
});