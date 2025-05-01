// Ultimate Student Toolkit - Water Reminder

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const waterLevel = document.getElementById('water-level');
    const intakeDisplay = document.getElementById('intake-display');
    const nextReminderDisplay = document.getElementById('next-reminder');
    const dailyGoalInput = document.getElementById('daily-goal');
    const reminderIntervalInput = document.getElementById('reminder-interval');
    const reminderStartSelect = document.getElementById('reminder-start');
    const soundEnabledCheckbox = document.getElementById('sound-enabled');
    const desktopNotificationsCheckbox = document.getElementById('desktop-notifications');
    const historyContainer = document.getElementById('history-container');
    const startRemindersBtn = document.getElementById('start-reminders');
    const stopRemindersBtn = document.getElementById('stop-reminders');
    const resetTrackingBtn = document.getElementById('reset-tracking');
    
    // Quick add buttons
    const add100mlBtn = document.getElementById('add-100ml');
    const add200mlBtn = document.getElementById('add-200ml');
    const add300mlBtn = document.getElementById('add-300ml');
    const add500mlBtn = document.getElementById('add-500ml');
    const addCustomBtn = document.getElementById('add-custom');
    const customAmountInput = document.getElementById('custom-amount');
    
    // Water tracking variables
    let currentIntake = 0;
    let dailyGoal = 2000; // Default 2000ml (2 liters)
    let reminderInterval = 30; // Default 30 minutes
    let reminderTimer;
    let nextReminderTime;
    let isReminderActive = false;
    let soundEnabled = true;
    let desktopNotificationsEnabled = true;
    
    // Create notification sound
    const notificationSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-water-droplet-1317.mp3');
    
    // Initialize from localStorage if available
    initializeFromStorage();
    
    // Event listeners for quick add buttons
    add100mlBtn.addEventListener('click', () => addWater(100));
    add200mlBtn.addEventListener('click', () => addWater(200));
    add300mlBtn.addEventListener('click', () => addWater(300));
    add500mlBtn.addEventListener('click', () => addWater(500));
    
    // Event listener for custom add
    addCustomBtn.addEventListener('click', () => {
        const amount = parseInt(customAmountInput.value);
        if (amount && amount > 0 && amount <= 2000) {
            addWater(amount);
            customAmountInput.value = '';
        } else {
            showNotification('Please enter a valid amount between 1-2000ml');
        }
    });
    
    // Event listeners for reminder controls
    startRemindersBtn.addEventListener('click', startReminders);
    stopRemindersBtn.addEventListener('click', stopReminders);
    resetTrackingBtn.addEventListener('click', resetTracking);
    
    // Function to add water intake
    function addWater(amount) {
        currentIntake += amount;
        updateWaterDisplay();
        addToHistory(`Added ${amount}ml of water`);
        saveToStorage();
        
        // Show encouraging message based on progress
        const percentComplete = (currentIntake / dailyGoal) * 100;
        if (percentComplete >= 100 && percentComplete < 110) {
            showNotification('Congratulations! You reached your daily water goal! 🎉');
        } else if (percentComplete >= 50 && percentComplete < 60) {
            showNotification('Halfway to your goal! Keep it up! 💧');
        } else if (percentComplete >= 25 && percentComplete < 35) {
            showNotification('Good start! 25% of your daily goal complete! 💦');
        } else {
            showNotification(`Added ${amount}ml of water to your daily intake`);
        }
    }
    
    // Update the water level display
    function updateWaterDisplay() {
        // Update the intake numbers
        intakeDisplay.textContent = `${currentIntake} / ${dailyGoal}`;
        
        // Calculate percentage (cap at 100% for display purposes)
        const percentage = Math.min((currentIntake / dailyGoal) * 100, 100);
        
        // Update the water level visual
        waterLevel.style.height = `${percentage}%`;
        
        // Change color based on progress
        if (percentage < 25) {
            waterLevel.className = 'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-300 to-blue-200 transition-all duration-1000';
        } else if (percentage < 50) {
            waterLevel.className = 'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-400 to-blue-300 transition-all duration-1000';
        } else if (percentage < 75) {
            waterLevel.className = 'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-blue-400 transition-all duration-1000';
        } else {
            waterLevel.className = 'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-blue-500 transition-all duration-1000';
        }
    }
    
    // Start water reminders
    function startReminders() {
        // Get values from inputs
        dailyGoal = parseInt(dailyGoalInput.value);
        reminderInterval = parseInt(reminderIntervalInput.value);
        soundEnabled = soundEnabledCheckbox.checked;
        desktopNotificationsEnabled = desktopNotificationsCheckbox.checked;
        
        // Validate inputs
        if (!dailyGoal || dailyGoal < 500 || dailyGoal > 5000) {
            showNotification('Please set a valid daily goal between 500-5000ml');
            return;
        }
        
        if (!reminderInterval || reminderInterval < 15 || reminderInterval > 120) {
            showNotification('Please set a valid reminder interval between 15-120 minutes');
            return;
        }
        
        // Calculate when to start reminders
        let delayInMinutes = 0;
        switch (reminderStartSelect.value) {
            case '5min':
                delayInMinutes = 5;
                break;
            case '10min':
                delayInMinutes = 10;
                break;
            case '15min':
                delayInMinutes = 15;
                break;
            default: // 'now'
                delayInMinutes = 0;
        }
        
        // Set next reminder time
        const now = new Date();
        nextReminderTime = new Date(now.getTime() + (delayInMinutes * 60 * 1000));
        updateNextReminderDisplay();
        
        // Start the reminder timer
        if (reminderTimer) {
            clearTimeout(reminderTimer);
        }
        
        reminderTimer = setTimeout(() => {
            showWaterReminder();
            // Schedule recurring reminders
            reminderTimer = setInterval(showWaterReminder, reminderInterval * 60 * 1000);
        }, delayInMinutes * 60 * 1000);
        
        // Update UI
        isReminderActive = true;
        startRemindersBtn.disabled = true;
        stopRemindersBtn.disabled = false;
        
        // Save settings
        saveToStorage();
        
        // Show confirmation
        if (delayInMinutes > 0) {
            showNotification(`Reminders will start in ${delayInMinutes} minutes`);
        } else {
            showNotification('Reminders activated! First reminder will appear shortly.');
        }
        
        // Add to history
        addToHistory(`Started water reminders every ${reminderInterval} minutes`);
    }
    
    // Stop water reminders
    function stopReminders() {
        if (reminderTimer) {
            clearTimeout(reminderTimer);
            clearInterval(reminderTimer);
            reminderTimer = null;
        }
        
        isReminderActive = false;
        nextReminderTime = null;
        nextReminderDisplay.textContent = 'Not set';
        
        startRemindersBtn.disabled = false;
        stopRemindersBtn.disabled = true;
        
        saveToStorage();
        showNotification('Reminders stopped');
        addToHistory('Stopped water reminders');
    }
    
    // Reset water tracking
    function resetTracking() {
        if (confirm('Are you sure you want to reset your water tracking? This will clear your current intake.')) {
            currentIntake = 0;
            updateWaterDisplay();
            
            // Clear history
            historyContainer.innerHTML = '<p class="text-gray-500 text-center py-4">No water intake recorded yet</p>';
            
            saveToStorage();
            showNotification('Water tracking has been reset');
        }
    }
    
    // Show water reminder notification
    function showWaterReminder() {
        playNotificationSound();
        
        // Calculate how much more water is needed to reach the goal
        const remaining = dailyGoal - currentIntake;
        let message = '';
        
        if (remaining <= 0) {
            message = 'Great job! You\'ve reached your water goal. Consider drinking more for optimal hydration.';
        } else {
            message = `Time to drink some water! You still need ${remaining}ml to reach your daily goal.`;
        }
        
        // Show browser notification if enabled
        if (desktopNotificationsEnabled && 'Notification' in window) {
            if (Notification.permission === 'granted') {
                new Notification('Water Reminder', {
                    body: message,
                    icon: '../favicon.ico'
                });
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        new Notification('Water Reminder', {
                            body: message,
                            icon: '../favicon.ico'
                        });
                    }
                });
            }
        }
        
        // Show in-app notification
        showNotification(message);
        
        // Add to history
        addToHistory('Water reminder notification');
        
        // Update next reminder time
        nextReminderTime = new Date(new Date().getTime() + (reminderInterval * 60 * 1000));
        updateNextReminderDisplay();
    }
    
    // Update the next reminder display
    function updateNextReminderDisplay() {
        if (nextReminderTime) {
            const timeString = nextReminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            nextReminderDisplay.textContent = timeString;
        } else {
            nextReminderDisplay.textContent = 'Not set';
        }
    }
    
    // Play notification sound
    function playNotificationSound() {
        if (soundEnabled) {
            notificationSound.play();
        }
    }
    
    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50 animate-fade-in';
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-glass-water text-blue-600 mr-2"></i>
                <p class="text-gray-800">${message}</p>
            </div>
        `;
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
    
    // Add entry to hydration history
    function addToHistory(text) {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateString = now.toLocaleDateString();
        
        // Remove placeholder if it exists
        const placeholder = historyContainer.querySelector('p');
        if (placeholder) {
            historyContainer.removeChild(placeholder);
        }
        
        // Create history entry
        const entry = document.createElement('div');
        entry.className = 'border-b border-gray-200 py-2';
        entry.innerHTML = `
            <div class="flex justify-between items-center">
                <span class="text-gray-800">${text}</span>
                <span class="text-sm text-gray-500">${timeString}, ${dateString}</span>
            </div>
        `;
        
        // Add to history container
        historyContainer.insertBefore(entry, historyContainer.firstChild);
    }
    
    // Save data to localStorage
    function saveToStorage() {
        const data = {
            currentIntake,
            dailyGoal,
            reminderInterval,
            isReminderActive,
            soundEnabled,
            desktopNotificationsEnabled,
            nextReminderTime: nextReminderTime ? nextReminderTime.getTime() : null,
            lastUpdated: new Date().toDateString()
        };
        
        localStorage.setItem('waterReminderData', JSON.stringify(data));
    }
    
    // Initialize from localStorage
    function initializeFromStorage() {
        const storedData = localStorage.getItem('waterReminderData');
        
        if (storedData) {
            const data = JSON.parse(storedData);
            
            // Check if data is from today
            if (data.lastUpdated === new Date().toDateString()) {
                currentIntake = data.currentIntake;
                dailyGoal = data.dailyGoal;
                reminderInterval = data.reminderInterval;
                soundEnabled = data.soundEnabled;
                desktopNotificationsEnabled = data.desktopNotificationsEnabled;
                
                // Update input fields
                dailyGoalInput.value = dailyGoal;
                reminderIntervalInput.value = reminderInterval;
                soundEnabledCheckbox.checked = soundEnabled;
                desktopNotificationsCheckbox.checked = desktopNotificationsEnabled;
                
                // Update display
                updateWaterDisplay();
                
                // Restore reminder if it was active
                if (data.isReminderActive && data.nextReminderTime) {
                    const now = new Date().getTime();
                    const nextTime = data.nextReminderTime;
                    
                    if (nextTime > now) {
                        // There's still time until the next reminder
                        nextReminderTime = new Date(nextTime);
                        updateNextReminderDisplay();
                        
                        // Calculate remaining time
                        const timeUntilReminder = nextTime - now;
                        
                        // Set up the timer
                        reminderTimer = setTimeout(() => {
                            showWaterReminder();
                            // Schedule recurring reminders
                            reminderTimer = setInterval(showWaterReminder, reminderInterval * 60 * 1000);
                        }, timeUntilReminder);
                        
                        isReminderActive = true;
                        startRemindersBtn.disabled = true;
                        stopRemindersBtn.disabled = false;
                    } else {
                        // The reminder time has passed, start a new one
                        nextReminderTime = new Date(now + (reminderInterval * 60 * 1000));
                        updateNextReminderDisplay();
                        
                        reminderTimer = setTimeout(() => {
                            showWaterReminder();
                            // Schedule recurring reminders
                            reminderTimer = setInterval(showWaterReminder, reminderInterval * 60 * 1000);
                        }, reminderInterval * 60 * 1000);
                        
                        isReminderActive = true;
                        startRemindersBtn.disabled = true;
                        stopRemindersBtn.disabled = false;
                    }
                }
                
                // Add initial history entry
                if (currentIntake > 0) {
                    addToHistory(`Restored previous water intake of ${currentIntake}ml`);
                }
            } else {
                // It's a new day, reset tracking but keep settings
                dailyGoal = data.dailyGoal;
                reminderInterval = data.reminderInterval;
                soundEnabled = data.soundEnabled;
                desktopNotificationsEnabled = data.desktopNotificationsEnabled;
                
                // Update input fields
                dailyGoalInput.value = dailyGoal;
                reminderIntervalInput.value = reminderInterval;
                soundEnabledCheckbox.checked = soundEnabled;
                desktopNotificationsCheckbox.checked = desktopNotificationsEnabled;
                
                // Reset intake for the new day
                currentIntake = 0;
                updateWaterDisplay();
                addToHistory('Started new day of water tracking');
            }
        }
    }
    
    // Initialize the display
    updateWaterDisplay();
});