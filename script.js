let coins = 0;
let autoClickerCount = 0;
let multiplier = 1;
let autoClickerCost = 10;
let multiplierCost = 50;

const coinCountElement = document.getElementById('coinCount');
const bunnyElement = document.getElementById('bunny');
const autoClickerUpgradeElement = document.getElementById('autoClickerUpgrade');
const multiplierUpgradeElement = document.getElementById('multiplierUpgrade');
const autoClickerCostElement = document.getElementById('autoClickerCost');
const multiplierCostElement = document.getElementById('multiplierCost');
const autoClickerCountElement = document.getElementById('autoClickerCount');
const multiplierValueElement = document.getElementById('multiplierValue');
const clickFeedbackElement = document.getElementById('click-feedback');

function loadGame() {
    const savedData = localStorage.getItem('bunnyCoinsGame');
    if (savedData) {
        const data = JSON.parse(savedData);
        coins = data.coins;
        autoClickerCount = data.autoClickerCount;
        multiplier = data.multiplier;
        autoClickerCost = data.autoClickerCost;
        multiplierCost = data.multiplierCost;
        updateDisplay();
    }
}

function saveGame() {
    const gameData = {
        coins: coins,
        autoClickerCount: autoClickerCount,
        multiplier: multiplier,
        autoClickerCost: autoClickerCost,
        multiplierCost: multiplierCost
    };
    localStorage.setItem('bunnyCoinsGame', JSON.stringify(gameData));
}

function updateDisplay() {
    coinCountElement.textContent = Math.floor(coins);
    autoClickerCostElement.textContent = autoClickerCost;
    multiplierCostElement.textContent = multiplierCost;
    autoClickerCountElement.textContent = autoClickerCount;
    multiplierValueElement.textContent = multiplier;
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

bunnyElement.addEventListener('click', () => {
    const earned = multiplier;
    coins += earned;
    createClickFeedback(earned);
    updateDisplay();
    saveGame();
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
    }
}, 1000);

loadGame();
updateDisplay();

// Telegram Mini App integration
if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
} else {
    console.log('Telegram WebApp is not available. Running in standalone mode.');
}
