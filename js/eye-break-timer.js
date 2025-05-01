// Ultimate Student Toolkit - Eye Break Timer

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const timerDisplay = document.getElementById('timer');
    const timerLabel = document.getElementById('timer-label');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const applySettingsBtn = document.getElementById('apply-settings');
    const screenTimeInput = document.getElementById('screen-time');
    const breakTimeInput = document.getElementById('break-time');
    const eyeExercisesSelect = document.getElementById('eye-exercises');
    const soundEnabledCheckbox = document.getElementById('sound-enabled');
    const desktopNotificationsCheckbox = document.getElementById('desktop-notifications');
    const historyContainer = document.getElementById('history-container');
    const exerciseContainer = document.getElementById('exercise-container');
    
    // Timer variables
    let timer;
    let timeLeft;
    let isRunning = false;
    let isPaused = false;
    let isScreenTime = true;
    let totalBreaks = 0;
    
    // Settings
    let screenTime = 20 * 60; // 20 minutes in seconds (20-20-20 rule)
    let breakTime = 1 * 60;   // 1 minute in seconds
    let exerciseLevel = 'basic';
    let soundEnabled = true;
    let desktopNotificationsEnabled = true;
    
    // Initialize timer
    timeLeft = screenTime;
    updateTimerDisplay();
    
    // Create notification sound
    const notificationSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-alert-notification-256.mp3');
    
    // Event listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    applySettingsBtn.addEventListener('click', applySettings);
    
    // Apply settings from inputs
    function applySettings() {
        screenTime = parseInt(screenTimeInput.value) * 60;
        breakTime = parseInt(breakTimeInput.value) * 60;
        exerciseLevel = eyeExercisesSelect.value;
        soundEnabled = soundEnabledCheckbox.checked;
        desktopNotificationsEnabled = desktopNotificationsCheckbox.checked;
        
        // Reset timer with new settings
        resetTimer();
        
        // Show confirmation message
        showNotification('Settings applied successfully!');
    }
    
    // Start timer
    function startTimer() {
        if (isPaused) {
            isPaused = false;
        } else if (!isRunning) {
            isRunning = true;
            
            // Add session start to history if starting screen time
            if (isScreenTime && timeLeft === screenTime) {
                addToHistory(`Screen time started`);
            }
        }
        
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                playNotificationSound();
                
                if (isScreenTime) {
                    // Screen time completed
                    totalBreaks++;
                    isScreenTime = false;
                    timeLeft = breakTime;
                    timerLabel.textContent = 'Eye Break';
                    addToHistory(`Eye break #${totalBreaks} started`);
                    showExerciseNotification();
                } else {
                    // Break completed
                    isScreenTime = true;
                    timeLeft = screenTime;
                    timerLabel.textContent = 'Screen Time';
                    addToHistory(`Eye break #${totalBreaks} completed`);
                    showNotification('Break over! Remember to take regular breaks for your eye health.');
                }
                
                updateTimerDisplay();
                startTimer(); // Automatically start the next session
            }
        }, 1000);
    }
    
    // Pause timer
    function pauseTimer() {
        clearInterval(timer);
        isPaused = true;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }
    
    // Reset timer
    function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        isPaused = false;
        isScreenTime = true;
        timeLeft = screenTime;
        timerLabel.textContent = 'Screen Time';
        updateTimerDisplay();
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }
    
    // Update timer display
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update document title
        document.title = `${timerDisplay.textContent} - ${timerLabel.textContent} - Eye Break Timer`;
    }
    
    // Play notification sound
    function playNotificationSound() {
        if (soundEnabled) {
            notificationSound.play();
        }
    }
    
    // Show notification
    function showNotification(message) {
        // Browser notification
        if (desktopNotificationsEnabled && 'Notification' in window) {
            if (Notification.permission === 'granted') {
                new Notification('Eye Break Timer', {
                    body: message,
                    icon: '../favicon.ico'
                });
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        new Notification('Eye Break Timer', {
                            body: message,
                            icon: '../favicon.ico'
                        });
                    }
                });
            }
        }
        
        // In-app notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50 animate-fade-in';
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-eye text-teal-600 mr-2"></i>
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
    
    // Show exercise notification based on selected level
    function showExerciseNotification() {
        let exerciseMessage = '';
        
        switch(exerciseLevel) {
            case 'basic':
                exerciseMessage = 'Time for a break! Look at something 20 feet away for 20 seconds.';
                break;
            case 'intermediate':
                exerciseMessage = 'Eye break time! Look at something 20 feet away and blink rapidly for 15 seconds.';
                break;
            case 'advanced':
                exerciseMessage = 'Complete eye workout time! Do focus shifting, eye rolling, and palming exercises.';
                break;
            default:
                exerciseMessage = 'Time to rest your eyes!';
        }
        
        showNotification(exerciseMessage);
    }
    
    // Add entry to break history
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
    
    // Request notification permission on page load
    if ('Notification' in window && desktopNotificationsEnabled) {
        if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
    }
    
    // Initialize settings from inputs
    soundEnabledCheckbox.checked = soundEnabled;
    desktopNotificationsCheckbox.checked = desktopNotificationsEnabled;
});