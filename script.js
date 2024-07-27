let coins = 0;
let autoClickerCount = 0;
let multiplier = 1;
let autoClickerCost = 10;
let multiplierCost = 50;
let level = 1;
let username = "Player";
let prestigePoints = 0;
let prestigeMultiplier = 1;

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
const achievementsElement = document.getElementById('achievements');
const prestigeButton = document.getElementById('prestigeButton');
const prestigePointsElement = document.getElementById('prestigePoints');
const prestigeMultiplierElement = document.getElementById('prestigeMultiplier');

let achievements = [];

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
        achievements = data.achievements || [];
        prestigePoints = data.prestigePoints || 0;
        prestigeMultiplier = data.prestigeMultiplier || 1;
        updateDisplay();
        updateAchievements();
    }
}

function saveGame() {
    const gameData = {
        coins: coins,
        autoClickerCount: autoClickerCount,
        multiplier: multiplier,
        autoClickerCost: autoClickerCost,
        multiplierCost: multiplierCost,
        level: level,
        achievements: achievements,
        prestigePoints: prestigePoints,
        prestigeMultiplier: prestigeMultiplier
    };
    localStorage.setItem('bunnyCoinsGame', JSON.stringify(gameData));
    updateLeaderboard();
}

function updateDisplay() {
    coinCountElement.textContent = Math.floor(coins).toLocaleString();
    autoClickerCostElement.textContent = autoClickerCost.toLocaleString();
    multiplierCostElement.textContent = multiplierCost.toLocaleString();
    autoClickerCountElement.textContent = autoClickerCount.toLocaleString();
    multiplierValueElement.textContent = multiplier.toLocaleString();
    levelElement.textContent = `Level: ${level}`;
    autoClickerUpgradeElement.disabled = coins < autoClickerCost;
    multiplierUpgradeElement.disabled = coins < multiplierCost;
    prestigePointsElement.textContent = prestigePoints.toLocaleString();
    prestigeMultiplierElement.textContent = prestigeMultiplier.toFixed(2);
    updatePrestigeButton();
    
    updateButtonStyles(autoClickerUpgradeElement, coins >= autoClickerCost);
    updateButtonStyles(multiplierUpgradeElement, coins >= multiplierCost);
}

function updateButtonStyles(button, canAfford) {
    if (canAfford) {
        button.classList.remove('opacity-50', 'cursor-not-allowed');
        button.classList.add('hover:bg-opacity-80');
    } else {
        button.classList.add('opacity-50', 'cursor-not-allowed');
        button.classList.remove('hover:bg-opacity-80');
    }
}

function updatePrestigeButton() {
    const requiredLevel = 20;
    prestigeButton.disabled = level < requiredLevel;
    prestigeButton.textContent = level < requiredLevel 
        ? `Prestige (Requires Level ${requiredLevel})` 
        : `Prestige (Gain ${calculatePrestigePointsGain()} Points)`;
    updateButtonStyles(prestigeButton, level >= requiredLevel);
}

function calculatePrestigePointsGain() {
    return Math.floor(Math.sqrt(coins / 1e12));
}

function createClickFeedback(amount) {
    const feedback = document.createElement('div');
    feedback.textContent = `+${amount.toLocaleString()}`;
    feedback.className = 'absolute text-yellow-300 font-bold text-2xl pointer-events-none';
    feedback.style.left = `${Math.random() * 80 + 10}%`;
    feedback.style.top = `${Math.random() * 80 + 10}%`;
    feedback.style.transform = 'translate(-50%, -50%)';
    feedback.style.animation = 'float-up 1s ease-out';
    clickFeedbackElement.appendChild(feedback);
    setTimeout(() => clickFeedbackElement.removeChild(feedback), 1000);
}

function checkAchievements() {
    const newAchievements = [
        { id: 'coins100', name: '100 Coins', condition: () => coins >= 100, icon: '💰' },
        { id: 'coins1000', name: '1,000 Coins', condition: () => coins >= 1000, icon: '🏆' },
        { id: 'clickers10', name: '10 Auto Clickers', condition: () => autoClickerCount >= 10, icon: '🤖' },
        { id: 'multiplier5', name: '5x Multiplier', condition: () => multiplier >= 5, icon: '✨' },
        { id: 'level5', name: 'Reach Level 5', condition: () => level >= 5, icon: '🎖️' },
        { id: 'prestige1', name: 'First Prestige', condition: () => prestigePoints >= 1, icon: '🌟' }
    ];

    newAchievements.forEach(achievement => {
        if (!achievements.includes(achievement.id) && achievement.condition()) {
            achievements.push(achievement.id);
            displayAchievementNotification(achievement);
        }
    });

    updateAchievements();
    saveGame();
}

function displayAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg';
    notification.innerHTML = `${achievement.icon} Achievement Unlocked: ${achievement.name}`;
    document.body.appendChild(notification);
    setTimeout(() => document.body.removeChild(notification), 3000);
}

function updateAchievements() {
    achievementsElement.innerHTML = '';
    achievements.forEach(id => {
        const achievement = [
            { id: 'coins100', name: '100 Coins', icon: '💰' },
            { id: 'coins1000', name: '1,000 Coins', icon: '🏆' },
            { id: 'clickers10', name: '10 Auto Clickers', icon: '🤖' },
            { id: 'multiplier5', name: '5x Multiplier', icon: '✨' },
            { id: 'level5', name: 'Reach Level 5', icon: '🎖️' },
            { id: 'prestige1', name: 'First Prestige', icon: '🌟' }
        ].find(a => a.id === id);

        if (achievement) {
            const achievementElement = document.createElement('div');
            achievementElement.className = 'bg-gray-700 rounded p-2 text-sm flex items-center';
            achievementElement.innerHTML = `${achievement.icon} <span class="ml-1">${achievement.name}</span>`;
            achievementsElement.appendChild(achievementElement);
        }
    });
}

function levelUp() {
    const levelUpCost = Math.pow(10, level);
    if (coins >= levelUpCost) {
        coins -= levelUpCost;
        level++;
        updateDisplay();
        saveGame();
        checkAchievements();
        alert(`Congratulations! You've reached level ${level}!`);
    }
}

function prestige() {
    const pointsGain = calculatePrestigePointsGain();
    if (pointsGain > 0) {
        prestigePoints += pointsGain;
        prestigeMultiplier = 1 + prestigePoints * 0.1;  // 10% increase per prestige point
        coins = 0;
        autoClickerCount = 0;
        multiplier = 1;
        autoClickerCost = 10;
        multiplierCost = 50;
        level = 1;
        updateDisplay();
        saveGame();
        checkAchievements();
        alert(`You've prestiged and gained ${pointsGain} Prestige Points!`);
    }
}

bunnyElement.addEventListener('click', () => {
    const earned = multiplier * prestigeMultiplier;
    coins += earned;
    createClickFeedback(earned);
    bunnyElement.classList.add('scale-110');
    setTimeout(() => bunnyElement.classList.remove('scale-110'), 100);
    updateDisplay();
    saveGame();
    levelUp();
    checkAchievements();
});

autoClickerUpgradeElement.addEventListener('click', () => {
    if (coins >= autoClickerCost) {
        coins -= autoClickerCost;
        autoClickerCount++;
        autoClickerCost = Math.ceil(autoClickerCost * 1.15);
        updateDisplay();
        saveGame();
        checkAchievements();
    }
});

multiplierUpgradeElement.addEventListener('click', () => {
    if (coins >= multiplierCost) {
        coins -= multiplierCost;
        multiplier++;
        multiplierCost = Math.ceil(multiplierCost * 1.3);
        updateDisplay();
        saveGame();
        checkAchievements();
    }
});

prestigeButton.addEventListener('click', prestige);

setInterval(() => {
    const earned = autoClickerCount * multiplier * prestigeMultiplier;
    if (earned > 0) {
        coins += earned;
        createClickFeedback(earned);
        updateDisplay();
        saveGame();
        levelUp();
        checkAchievements();
    }
}, 1000);

function updateLeaderboard() {
    const leaderboardData = JSON.parse(localStorage.getItem('bunnyCoinsLeaderboard')) || [];
    const currentScore = Math.floor(coins);
    
    // Update the current user's score
    const userIndex = leaderboardData.findIndex(entry => entry.name === username);
    if (userIndex !== -1) {
        leaderboardData[userIndex].score = Math.max(leaderboardData[userIndex].score, currentScore);
    } else {
        leaderboardData.push({ name: username, score: currentScore });
    }
    
    // Sort leaderboard and keep top 5
    leaderboardData.sort((a, b) => b.score - a.score);
    const top5 = leaderboardData.slice(0, 5);
    
    localStorage.setItem('bunnyCoinsLeaderboard', JSON.stringify(top5));
    
    leaderboardList.innerHTML = '';
    top5.forEach((entry, index) => {
        const li = document.createElement('li');
        li.className = 'mb-2 p-2 bg-gray-700 rounded flex justify-between items-center';
        li.innerHTML = `
            <span class="font-bold">${index + 1}. ${entry.name}</span>
            <span class="text-yellow-300">${entry.score.toLocaleString()} coins</span>
        `;
        leaderboardList.appendChild(li);
    });
}

showLeaderboardButton.addEventListener('click', () => {
    updateLeaderboard();
    leaderboardModal.classList.remove('hidden');
});

closeLeaderboardButton.addEventListener('click', () => {
    leaderboardModal.classList.add('hidden');
});

// Function to restart user's progression
function resetGame() {
    if (confirm("Are you sure you want to reset your game progress? This action cannot be undone.")) {
        coins = 0;
        autoClickerCount = 0;
        multiplier = 1;
        autoClickerCost = 10;
        multiplierCost = 50;
        level = 1;
        prestigePoints = 0;
        prestigeMultiplier = 1;
        achievements = [];
        
        updateDisplay();
        updateAchievements();
        saveGame();
        alert("Your game progress has been reset.");
    }
}

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
updateAchievements();
