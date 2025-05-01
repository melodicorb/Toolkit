// Ultimate Student Toolkit - Random Generator

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Random Number Generator
    const minNumberInput = document.getElementById('min-number');
    const maxNumberInput = document.getElementById('max-number');
    const quantityInput = document.getElementById('quantity');
    const uniqueNumbersCheckbox = document.getElementById('unique-numbers');
    const generateNumbersBtn = document.getElementById('generate-numbers-btn');
    const numberResults = document.getElementById('number-results');
    
    // DOM Elements - Name/Group Generator
    const nameListTextarea = document.getElementById('name-list');
    const groupCountInput = document.getElementById('group-count');
    const pickRandomBtn = document.getElementById('pick-random-btn');
    const createGroupsBtn = document.getElementById('create-groups-btn');
    const nameResults = document.getElementById('name-results');
    
    // DOM Elements - Dice Roller
    const diceTypeSelect = document.getElementById('dice-type');
    const diceCountInput = document.getElementById('dice-count');
    const rollDiceBtn = document.getElementById('roll-dice-btn');
    const diceResults = document.getElementById('dice-results');
    const diceDisplay = document.getElementById('dice-display');
    const diceTotal = document.getElementById('dice-total');
    
    // DOM Elements - Coin Flipper
    const coinCountInput = document.getElementById('coin-count');
    const flipCoinBtn = document.getElementById('flip-coin-btn');
    const coinResults = document.getElementById('coin-results');
    const coinDisplay = document.getElementById('coin-display');
    
    // Event Listeners
    generateNumbersBtn.addEventListener('click', generateRandomNumbers);
    pickRandomBtn.addEventListener('click', pickRandomName);
    createGroupsBtn.addEventListener('click', createRandomGroups);
    rollDiceBtn.addEventListener('click', rollDice);
    flipCoinBtn.addEventListener('click', flipCoins);
    
    // Random Number Generator
    function generateRandomNumbers() {
        const min = parseInt(minNumberInput.value);
        const max = parseInt(maxNumberInput.value);
        const quantity = parseInt(quantityInput.value);
        const uniqueOnly = uniqueNumbersCheckbox.checked;
        
        // Validate inputs
        if (isNaN(min) || isNaN(max) || isNaN(quantity) || min > max || quantity < 1) {
            numberResults.innerHTML = '<p class="text-red-500 text-center">Please enter valid values</p>';
            return;
        }
        
        // Check if unique numbers are possible
        if (uniqueOnly && (max - min + 1) < quantity) {
            numberResults.innerHTML = '<p class="text-red-500 text-center">Cannot generate enough unique numbers in the given range</p>';
            return;
        }
        
        let numbers = [];
        
        if (uniqueOnly) {
            // Generate unique numbers
            const availableNumbers = Array.from({ length: max - min + 1 }, (_, i) => min + i);
            
            // Fisher-Yates shuffle algorithm
            for (let i = availableNumbers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [availableNumbers[i], availableNumbers[j]] = [availableNumbers[j], availableNumbers[i]];
            }
            
            numbers = availableNumbers.slice(0, quantity);
        } else {
            // Generate random numbers (may contain duplicates)
            for (let i = 0; i < quantity; i++) {
                const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
                numbers.push(randomNumber);
            }
        }
        
        // Display results
        if (numbers.length === 1) {
            numberResults.innerHTML = `<p class="text-4xl font-bold text-center text-violet-600">${numbers[0]}</p>`;
        } else {
            numberResults.innerHTML = `
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    ${numbers.map(num => `<div class="bg-violet-100 p-2 rounded-lg text-center text-violet-800">${num}</div>`).join('')}
                </div>
            `;
        }
    }
    
    // Name/Group Generator
    function pickRandomName() {
        const names = getNameList();
        
        if (names.length === 0) {
            nameResults.innerHTML = '<p class="text-red-500 text-center">Please enter at least one name</p>';
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * names.length);
        const randomName = names[randomIndex];
        
        nameResults.innerHTML = `<p class="text-2xl font-bold text-center text-violet-600">${randomName}</p>`;
    }
    
    function createRandomGroups() {
        const names = getNameList();
        const groupCount = parseInt(groupCountInput.value);
        
        if (names.length === 0) {
            nameResults.innerHTML = '<p class="text-red-500 text-center">Please enter at least one name</p>';
            return;
        }
        
        if (isNaN(groupCount) || groupCount < 1) {
            nameResults.innerHTML = '<p class="text-red-500 text-center">Please enter a valid number of groups</p>';
            return;
        }
        
        if (groupCount > names.length) {
            nameResults.innerHTML = '<p class="text-red-500 text-center">Number of groups cannot exceed number of names</p>';
            return;
        }
        
        // Shuffle names
        const shuffledNames = [...names];
        for (let i = shuffledNames.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledNames[i], shuffledNames[j]] = [shuffledNames[j], shuffledNames[i]];
        }
        
        // Create groups
        const groups = Array.from({ length: groupCount }, () => []);
        shuffledNames.forEach((name, index) => {
            const groupIndex = index % groupCount;
            groups[groupIndex].push(name);
        });
        
        // Display results
        nameResults.innerHTML = `
            <div class="space-y-4">
                ${groups.map((group, index) => `
                    <div class="bg-violet-100 p-3 rounded-lg">
                        <h3 class="font-semibold text-violet-800 mb-2">Group ${index + 1}</h3>
                        <ul class="list-disc list-inside">
                            ${group.map(name => `<li>${name}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    function getNameList() {
        return nameListTextarea.value
            .split('\n')
            .map(name => name.trim())
            .filter(name => name !== '');
    }
    
    // Dice Roller
    function rollDice() {
        const diceType = parseInt(diceTypeSelect.value);
        const diceCount = parseInt(diceCountInput.value);
        
        if (isNaN(diceType) || isNaN(diceCount) || diceCount < 1 || diceCount > 10) {
            diceResults.innerHTML = '<p class="text-red-500 text-center">Please enter valid values</p>';
            return;
        }
        
        const results = [];
        let total = 0;
        
        for (let i = 0; i < diceCount; i++) {
            const roll = Math.floor(Math.random() * diceType) + 1;
            results.push(roll);
            total += roll;
        }
        
        // Display dice
        diceDisplay.innerHTML = results.map(roll => {
            return `<div class="w-12 h-12 bg-violet-600 text-white rounded-lg flex items-center justify-center font-bold text-xl">${roll}</div>`;
        }).join('');
        
        // Display total
        if (results.length > 1) {
            diceTotal.textContent = `Total: ${total}`;
        } else {
            diceTotal.textContent = '';
        }
    }
    
    // Coin Flipper
    function flipCoins() {
        const coinCount = parseInt(coinCountInput.value);
        
        if (isNaN(coinCount) || coinCount < 1 || coinCount > 10) {
            coinResults.innerHTML = '<p class="text-red-500 text-center">Please enter a valid number of coins (1-10)</p>';
            return;
        }
        
        const results = [];
        
        for (let i = 0; i < coinCount; i++) {
            const flip = Math.random() < 0.5 ? 'Heads' : 'Tails';
            results.push(flip);
        }
        
        // Display coins
        coinDisplay.innerHTML = results.map(result => {
            const isHeads = result === 'Heads';
            return `
                <div class="w-16 h-16 rounded-full flex items-center justify-center ${isHeads ? 'bg-yellow-400' : 'bg-yellow-600'}">
                    <span class="font-bold text-sm">${result}</span>
                </div>
            `;
        }).join('');
    }
});