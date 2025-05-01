// Ultimate Student Toolkit - Meditation Timer

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const timerDisplay = document.getElementById('timer');
    const timerLabel = document.getElementById('timer-label');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const applySettingsBtn = document.getElementById('apply-settings');
    const meditationTimeInput = document.getElementById('meditation-time');
    const intervalBellsSelect = document.getElementById('interval-bells');
    const breathingPatternSelect = document.getElementById('breathing-pattern');
    const ambientSoundSelect = document.getElementById('ambient-sound');
    const volumeInput = document.getElementById('volume');
    const endingBellCheckbox = document.getElementById('ending-bell');
    const historyContainer = document.getElementById('history-container');
    const breathingGuide = document.getElementById('breathing-guide');
    const breathingInstruction = document.getElementById('breathing-instruction');
    const breathingCount = document.getElementById('breathing-count');
    const breathingCircle = document.getElementById('breathing-circle');
    
    // Timer variables
    let timer;
    let timeLeft;
    let isRunning = false;
    let isPaused = false;
    let intervalTimer;
    let breathingTimer;
    let currentBreathingPhase = 0;
    let sessionStartTime;
    
    // Settings
    let meditationTime = 10 * 60; // 10 minutes in seconds
    let intervalBells = 5; // Every 5 minutes
    let breathingPattern = '4-4-4-4'; // Box breathing
    let ambientSound = 'nature';
    let volume = 50;
    let playEndingBell = true;
    
    // Audio elements
    const bellSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-meditation-bell-595.mp3');
    const ambientSounds = {
        nature: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3'),
        rain: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-light-rain-ambience-1252.mp3'),
        waves: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-ocean-waves-ambience-1189.mp3'),
        'white-noise': new Audio('https://assets.mixkit.co/sfx/preview/mixkit-white-noise-ambience-1236.mp3')
    };
    
    // Set audio to loop
    Object.values(ambientSounds).forEach(sound => {
        sound.loop = true;
    });
    
    // Initialize timer
    timeLeft = meditationTime;
    updateTimerDisplay();
    
    // Event listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    applySettingsBtn.addEventListener('click', applySettings);
    volumeInput.addEventListener('input', updateVolume);
    
    // Apply settings from inputs
    function applySettings() {
        meditationTime = parseInt(meditationTimeInput.value) * 60;
        intervalBells = parseInt(intervalBellsSelect.value);
        breathingPattern = breathingPatternSelect.value;
        ambientSound = ambientSoundSelect.value;
        volume = volumeInput.value;
        playEndingBell = endingBellCheckbox.checked;
        
        // Reset timer with new settings
        resetTimer();
        
        // Show confirmation message
        showNotification('Settings applied successfully!');
    }
    
    // Update volume for all sounds
    function updateVolume() {
        const volumeLevel = volumeInput.value / 100;
        bellSound.volume = volumeLevel;
        Object.values(ambientSounds).forEach(sound => {
            sound.volume = volumeLevel;
        });
    }
    
    // Start timer
    function startTimer() {
        if (isPaused) {
            isPaused = false;
        } else if (!isRunning) {
            isRunning = true;
            sessionStartTime = new Date();
            
            // Start ambient sound if selected
            if (ambientSound !== 'none') {
                stopAllAmbientSounds();
                ambientSounds[ambientSound].play();
            }
            
            // Start breathing guide if pattern is selected
            if (breathingPattern !== 'none') {
                breathingGuide.classList.remove('hidden');
                startBreathingGuide();
            }
            
            // Add session start to history
            addToHistory(`Meditation session started`);
        }
        
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        
        // Start the main timer
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            
            // Check for interval bells
            if (intervalBells > 0 && timeLeft > 0 && timeLeft % (intervalBells * 60) === 0) {
                playBellSound();
            }
            
            if (timeLeft <= 0) {
                completeSession();
            }
        }, 1000);
    }
    
    // Pause timer
    function pauseTimer() {
        clearInterval(timer);
        isPaused = true;
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        
        // Pause ambient sound
        if (ambientSound !== 'none') {
            ambientSounds[ambientSound].pause();
        }
        
        // Pause breathing guide
        if (breathingPattern !== 'none') {
            clearTimeout(breathingTimer);
        }
        
        addToHistory('Meditation paused');
    }
    
    // Reset timer
    function resetTimer() {
        clearInterval(timer);
        clearTimeout(breathingTimer);
        isRunning = false;
        isPaused = false;
        timeLeft = meditationTime;
        updateTimerDisplay();
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        
        // Stop ambient sounds
        stopAllAmbientSounds();
        
        // Hide breathing guide
        breathingGuide.classList.add('hidden');
        
        // Reset breathing circle animation
        breathingCircle.style.transform = 'scale(1)';
        breathingCircle.style.opacity = '0.7';
    }
    
    // Complete meditation session
    function completeSession() {
        clearInterval(timer);
        clearTimeout(breathingTimer);
        isRunning = false;
        
        // Play ending bell if enabled
        if (playEndingBell) {
            playBellSound();
        }
        
        // Stop ambient sounds
        stopAllAmbientSounds();
        
        // Hide breathing guide
        breathingGuide.classList.add('hidden');
        
        // Reset UI
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        
        // Calculate session duration
        const sessionDuration = calculateSessionDuration();
        
        // Add completion to history
        addToHistory(`Meditation completed (${sessionDuration})`);
        
        // Show completion notification
        showNotification(`Meditation session completed! You meditated for ${sessionDuration}.`);
        
        // Reset timer for next session
        timeLeft = meditationTime;
        updateTimerDisplay();
    }
    
    // Calculate session duration
    function calculateSessionDuration() {
        if (!sessionStartTime) return '0 minutes';
        
        const endTime = new Date();
        const durationMs = endTime - sessionStartTime;
        const durationMinutes = Math.floor(durationMs / 60000);
        const durationSeconds = Math.floor((durationMs % 60000) / 1000);
        
        if (durationMinutes === 0) {
            return `${durationSeconds} seconds`;
        } else if (durationSeconds === 0) {
            return `${durationMinutes} minutes`;
        } else {
            return `${durationMinutes} minutes, ${durationSeconds} seconds`;
        }
    }
    
    // Update timer display
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Play bell sound
    function playBellSound() {
        bellSound.currentTime = 0;
        bellSound.play();
    }
    
    // Stop all ambient sounds
    function stopAllAmbientSounds() {
        Object.values(ambientSounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }
    
    // Start breathing guide
    function startBreathingGuide() {
        // Parse breathing pattern
        let phases = [];
        
        if (breathingPattern === '4-4-4-4') {
            // Box breathing: inhale, hold, exhale, hold
            phases = [
                { instruction: 'Inhale', duration: 4, scale: 1.3, opacity: 0.9 },
                { instruction: 'Hold', duration: 4, scale: 1.3, opacity: 0.9 },
                { instruction: 'Exhale', duration: 4, scale: 1.0, opacity: 0.7 },
                { instruction: 'Hold', duration: 4, scale: 1.0, opacity: 0.7 }
            ];
        } else if (breathingPattern === '4-7-8') {
            // 4-7-8 breathing: inhale for 4, hold for 7, exhale for 8
            phases = [
                { instruction: 'Inhale', duration: 4, scale: 1.3, opacity: 0.9 },
                { instruction: 'Hold', duration: 7, scale: 1.3, opacity: 0.9 },
                { instruction: 'Exhale', duration: 8, scale: 1.0, opacity: 0.7 }
            ];
        } else if (breathingPattern === '5-5') {
            // 5-5 breathing: inhale for 5, exhale for 5
            phases = [
                { instruction: 'Inhale', duration: 5, scale: 1.3, opacity: 0.9 },
                { instruction: 'Exhale', duration: 5, scale: 1.0, opacity: 0.7 }
            ];
        }
        
        // Start the breathing cycle
        runBreathingPhase(phases, 0);
    }
    
    // Run a single breathing phase
    function runBreathingPhase(phases, phaseIndex) {
        if (!isRunning) return;
        
        const phase = phases[phaseIndex];
        let countdown = phase.duration;
        
        // Update UI for this phase
        breathingInstruction.textContent = phase.instruction;
        breathingCount.textContent = countdown;
        
        // Apply animation to breathing circle
        breathingCircle.style.transition = `transform ${phase.duration}s ease-in-out, opacity ${phase.duration}s ease-in-out`;
        breathingCircle.style.transform = `scale(${phase.scale})`;
        breathingCircle.style.opacity = phase.opacity;
        
        // Update countdown every second
        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown <= 0) {
                clearInterval(countdownInterval);
            } else {
                breathingCount.textContent = countdown;
            }
        }, 1000);
        
        // Schedule next phase
        breathingTimer = setTimeout(() => {
            clearInterval(countdownInterval);
            // Move to next phase, or back to first phase if at the end
            const nextPhaseIndex = (phaseIndex + 1) % phases.length;
            runBreathingPhase(phases, nextPhaseIndex);
        }, phase.duration * 1000);
    }
    
    // Add entry to history
    function addToHistory(text) {
        // Clear placeholder if it exists
        const placeholder = historyContainer.querySelector('p.text-gray-500');
        if (placeholder) {
            historyContainer.removeChild(placeholder);
        }
        
        // Create timestamp
        const now = new Date();
        const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Create history entry
        const entry = document.createElement('div');
        entry.className = 'py-2 border-b border-gray-100 last:border-0';
        entry.innerHTML = `
            <div class="flex justify-between items-center">
                <span class="text-gray-800">${text}</span>
                <span class="text-sm text-gray-500">${timestamp}</span>
            </div>
        `;
        
        // Add to container (at the top)
        historyContainer.insertBefore(entry, historyContainer.firstChild);
        
        // Save to localStorage
        saveToStorage();
    }
    
    // Show notification
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-md transform transition-all duration-500 translate-y-20 opacity-0';
        notification.innerHTML = `
            <div class="flex items-center">
                <div class="flex-shrink-0 text-purple-500">
                    <i class="fas fa-bell text-xl"></i>
                </div>
                <div class="ml-3">
                    <p class="text-sm font-medium text-gray-800">${message}</p>
                </div>
                <button class="ml-4 text-gray-400 hover:text-gray-500 focus:outline-none">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-y-20', 'opacity-0');
        }, 10);
        
        // Add close button functionality
        const closeBtn = notification.querySelector('button');
        closeBtn.addEventListener('click', () => {
            notification.classList.add('translate-y-20', 'opacity-0');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.classList.add('translate-y-20', 'opacity-0');
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 500);
            }
        }, 5000);
    }
    
    // Save to localStorage
    function saveToStorage() {
        const historyEntries = Array.from(historyContainer.children)
            .filter(child => child.className.includes('py-2'))
            .map(entry => {
                const text = entry.querySelector('.text-gray-800').textContent;
                const timestamp = entry.querySelector('.text-sm').textContent;
                return { text, timestamp };
            });
        
        const settings = {
            meditationTime,
            intervalBells,
            breathingPattern,
            ambientSound,
            volume,
            playEndingBell
        };
        
        localStorage.setItem('meditationHistory', JSON.stringify(historyEntries));
        localStorage.setItem('meditationSettings', JSON.stringify(settings));
    }
    
    // Load from localStorage
    function loadFromStorage() {
        try {
            // Load settings
            const savedSettings = JSON.parse(localStorage.getItem('meditationSettings'));
            if (savedSettings) {
                meditationTime = savedSettings.meditationTime || 10 * 60;
                intervalBells = savedSettings.intervalBells || 5;
                breathingPattern = savedSettings.breathingPattern || '4-4-4-4';
                ambientSound = savedSettings.ambientSound || 'nature';
                volume = savedSettings.volume || 50;
                playEndingBell = savedSettings.playEndingBell !== undefined ? savedSettings.playEndingBell : true;
                
                // Update UI with loaded settings
                meditationTimeInput.value = meditationTime / 60;
                intervalBellsSelect.value = intervalBells;
                breathingPatternSelect.value = breathingPattern;
                ambientSoundSelect.value = ambientSound;
                volumeInput.value = volume;
                endingBellCheckbox.checked = playEndingBell;
                
                // Update timer display
                timeLeft = meditationTime;
                updateTimerDisplay();
                updateVolume();
            }
            
            // Load history
            const savedHistory = JSON.parse(localStorage.getItem('meditationHistory'));
            if (savedHistory && savedHistory.length > 0) {
                // Clear placeholder
                historyContainer.innerHTML = '';
                
                // Add saved entries
                savedHistory.forEach(entry => {
                    const entryElement = document.createElement('div');
                    entryElement.className = 'py-2 border-b border-gray-100 last:border-0';
                    entryElement.innerHTML = `
                        <div class="flex justify-between items-center">
                            <span class="text-gray-800">${entry.text}</span>
                            <span class="text-sm text-gray-500">${entry.timestamp}</span>
                        </div>
                    `;
                    historyContainer.appendChild(entryElement);
                });
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
    }
    
    // Initialize from localStorage
    loadFromStorage();
});