let coins = 0;
let autoClickerCount = 0;
let multiplier = 1;
let autoClickerCost = 10;
let multiplierCost = 50;
let level = 1;
let username = "Player";

const coinCountElement = document.getElementById('coinCount');
const bunnyElement = document.getElementById('bunny');
const autoClickerUpgradeElement = document.getElementById('autoClickerUpgrade');
const multiplierUpgradeElement = document.getElementById('multiplierUpgrade');
const autoClickerCostElement = document.getElementById('autoClickerCost');
const multiplierCostElement = document.getElementById('multiplierCost');
const autoClickerCountElement = document.getElementById('autoClickerCount');
const multiplierValueElement = document.getElementById('multiplierValue');
const clickFeedbackElement = document.getElementById('click-feedback');
const levelElement = document.getElementById('level');
const usernameElement = document.getElementById('username');
const showLeaderboardButton = document.getElementById('showLeaderboard');
const closeLeaderboardButton = document.getElementById('closeLeaderboard');
const leaderboardModal = document.getElementById('leaderboard');
const leaderboardList = document.getElementById('leaderboardList');

function loadGame() {
    const savedData = localStorage.getItem('bunnyCoinsGame');
    if (savedData) {
        const data = JSON.parse(savedData);
        coins = data.coins;
        autoClickerCount = data.autoClickerCount;
        multiplier = data.multiplier;
        autoClickerCost = data.autoClickerCost;
        multiplierCost = data.multiplierCost;
        level = data.level;
        updateDisplay();
    }
}

function saveGame() {
    const gameData = {
        coins: coins,
        autoClickerCount: autoClickerCount,
        multiplier: multiplier,
        autoClickerCost: autoClickerCost,
        multiplierCost: multiplierCost,
        level: level
    };
    localStorage.setItem('bunnyCoinsGame', JSON.stringify(gameData));
}

function updateDisplay() {
    coinCountElement.textContent = Math.floor(coins);
    autoClickerCostElement.textContent = autoClickerCost;
    multiplierCostElement.textContent = multiplierCost;
    autoClickerCountElement.textContent = autoClickerCount;
    multiplierValueElement.textContent = multiplier;
    levelElement.textContent = `Level: ${level}`;
    autoClickerUpgradeElement.disabled = coins < autoClickerCost;
    multiplierUpgradeElement.disabled = coins < multiplierCost;
}

function createClickFeedback(amount) {
    const feedback = document.createElement('div');
    feedback.textContent = `+${amount}`;
    feedback.className = 'click-feedback';
    feedback.style.left = `${Math.random() * 100}%`;
    clickFeedbackElement.appendChild(feedback);
    setTimeout(() => clickFeedbackElement.removeChild(feedback), 1000);
}

function levelUp() {
    const levelUpCost = Math.pow(10, level);
    if (coins >= levelUpCost) {
        coins -= levelUpCost;
        level++;
        updateDisplay();
        saveGame();
        alert(`Congratulations! You've reached level ${level}!`);
    }
}

bunnyElement.addEventListener('click', () => {
    const earned = multiplier;
    coins += earned;
    createClickFeedback(earned);
    updateDisplay();
    saveGame();
    levelUp();
});

autoClickerUpgradeElement.addEventListener('click', () => {
    if (coins >= autoClickerCost) {
        coins -= autoClickerCost;
        autoClickerCount++;
        autoClickerCost = Math.ceil(autoClickerCost * 1.15);
        updateDisplay();
        saveGame();
    }
});

multiplierUpgradeElement.addEventListener('click', () => {
    if (coins >= multiplierCost) {
        coins -= multiplierCost;
        multiplier++;
        multiplierCost = Math.ceil(multiplierCost * 1.3);
        updateDisplay();
        saveGame();
    }
});

setInterval(() => {
    const earned = autoClickerCount * multiplier;
    if (earned > 0) {
        coins += earned;
        createClickFeedback(earned);
        updateDisplay();
        saveGame();
        levelUp();
    }
}, 1000);

// Leaderboard functionality
function updateLeaderboard() {
    // In a real application, you would fetch this data from a server
    const leaderboardData = [
        { name: "Alice", score: 1000 },
        { name: "Bob", score: 900 },
        { name: "Charlie", score: 800 },
        { name: "David", score: 700 },
        { name: "Eve", score: 600 }
    ];

    leaderboardList.innerHTML = '';
    leaderboardData.forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${entry.name}: ${entry.score}`;
        leaderboardList.appendChild(li);
    });
}

showLeaderboardButton.addEventListener('click', () => {
    updateLeaderboard();
    leaderboardModal.style.display = 'block';
});

closeLeaderboardButton.addEventListener('click', () => {
    leaderboardModal.style.display = 'none';
});

// Telegram Mini App integration
if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();

    // Get user's Telegram name
    if (window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
        username = window.Telegram.WebApp.initDataUnsafe.user.first_name;
        usernameElement.textContent = username;
    }
} else {
    console.log('Telegram WebApp is not available. Running in standalone mode.');
}

loadGame();
updateDisplay();
