let coins = 0;
let autoClickerCount = 0;
let multiplier = 1;
const coinCountElement = document.getElementById('coinCount');
const bunnyElement = document.getElementById('bunny');
const autoClickerUpgradeElement = document.getElementById('autoClickerUpgrade');
const multiplierUpgradeElement = document.getElementById('multiplierUpgrade');

// Load saved data
function loadGame() {
    const savedData = localStorage.getItem('bunnyCoinsGame');
    if (savedData) {
        const data = JSON.parse(savedData);
        coins = data.coins;
        autoClickerCount = data.autoClickerCount;
        multiplier = data.multiplier;
        updateDisplay();
    }
}

// Save game data
function saveGame() {
    const gameData = {
        coins: coins,
        autoClickerCount: autoClickerCount,
        multiplier: multiplier
    };
    localStorage.setItem('bunnyCoinsGame', JSON.stringify(gameData));
}

// Update display
function updateDisplay() {
    coinCountElement.textContent = Math.floor(coins);
    autoClickerUpgradeElement.textContent = `Buy Auto Clicker (Cost: ${10 * Math.pow(2, autoClickerCount)} coins)`;
    multiplierUpgradeElement.textContent = `Buy Multiplier (Cost: ${50 * Math.pow(2, multiplier - 1)} coins)`;
}

// Click bunny
bunnyElement.addEventListener('click', () => {
    coins += multiplier;
    updateDisplay();
    saveGame();
});

// Buy auto clicker
autoClickerUpgradeElement.addEventListener('click', () => {
    const cost = 10 * Math.pow(2, autoClickerCount);
    if (coins >= cost) {
        coins -= cost;
        autoClickerCount++;
        updateDisplay();
        saveGame();
    }
});

// Buy multiplier
multiplierUpgradeElement.addEventListener('click', () => {
    const cost = 50 * Math.pow(2, multiplier - 1);
    if (coins >= cost) {
        coins -= cost;
        multiplier++;
        updateDisplay();
        saveGame();
    }
});

// Auto clicker function
setInterval(() => {
    coins += autoClickerCount * multiplier;
    updateDisplay();
    saveGame();
}, 1000);

// Initialize game
loadGame();
updateDisplay();

// Telegram Mini App integration
if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
} else {
    console.log('Telegram WebApp is not available. Running in standalone mode.');
}
