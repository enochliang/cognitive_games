// --- DOM Element Selection ---
// Get references to all the interactive HTML elements.
const gameIconEl = document.getElementById('game-icon');
const gameNameEl = document.getElementById('game-name');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const startBtn = document.getElementById('start-btn');
const hostName = window.location.origin 

// --- Data Structure ---
// An array of objects to store game information.
// This structure is easily extendable with new properties or more games.
//const games = [
//    {
//        id: 'shooter',
//        gameName: 'Shooting Game',
//        icon: '🎮'
//    },
//    {
//        id: 'puzzle',
//        gameName: 'Puzzle Game',
//        icon: '🧩'
//    },
//    {
//        id: 'racing',
//        gameName: 'Racing Game',
//        icon: '🏎️'
//    }
//];
const games = [
    //{
    //    id: 'click_highlight_blocks',
    //    gameName: 'Click Highlight Blocks',
    //    icon: '🎮'
    //},
    {
        id: 'sequence_sprint',
        gameName: 'Sequence Sprint',
        icon: '🧩'
    }
];

// --- State Management ---
// A variable to keep track of the currently displayed game.
let currentGameIndex = 0;

// --- Functions ---
/**
 * Updates the UI to display the game at the current index.
 * It sets the icon and name in the display window.
 */
function updateDisplay() {
    const currentGame = games[currentGameIndex];
    gameIconEl.textContent = currentGame.icon;
    gameNameEl.textContent = currentGame.gameName;
}

// --- Event Listeners ---
/**
 * Event listener for the "Next" button.
 * It increments the game index and wraps around if it reaches the end of the array.
 */
nextBtn.addEventListener('click', () => {
    currentGameIndex = (currentGameIndex + 1) % games.length;
    updateDisplay();
});

/**
 * Event listener for the "Previous" button.
 * It decrements the game index and wraps around to the end if it goes below zero.
 */
prevBtn.addEventListener('click', () => {
    currentGameIndex = (currentGameIndex - 1 + games.length) % games.length;
    updateDisplay();
});

/**
 * Event listener for the "Start Game" button.
 * It gets the current game's data and logs a message to the console,
 * simulating the start of the game.
 */
startBtn.addEventListener('click', () => {
    const selectedGame = games[currentGameIndex];
    console.log(`Starting ${selectedGame.gameName}...`);
    // In a real application, this would redirect the user:
    window.location.href = `/games/${selectedGame.id}/index.html?mainpage_url=${hostName}`;
});

// --- Initial Load ---
// Call updateDisplay once when the script loads to show the first game.
updateDisplay();