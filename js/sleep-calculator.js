// Ultimate Student Toolkit - Sleep Calculator

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Sleep Calculator
    const wakeUpTab = document.getElementById('wake-up-tab');
    const fallAsleepTab = document.getElementById('fall-asleep-tab');
    const wakeUpSection = document.getElementById('wake-up-section');
    const fallAsleepSection = document.getElementById('fall-asleep-section');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsSection = document.getElementById('results-section');
    const fallAsleepTimeInput = document.getElementById('fall-asleep-time');
    
    // DOM Elements - Time Selectors
    const wakeHourSelect = document.getElementById('wake-hour');
    const wakeMinuteSelect = document.getElementById('wake-minute');
    const wakeAmPmSelect = document.getElementById('wake-ampm');
    const sleepHourSelect = document.getElementById('sleep-hour');
    const sleepMinuteSelect = document.getElementById('sleep-minute');
    const sleepAmPmSelect = document.getElementById('sleep-ampm');
    
    // DOM Elements - Results
    const resultElements = [
        document.getElementById('result-1'),
        document.getElementById('result-2'),
        document.getElementById('result-3'),
        document.getElementById('result-4')
    ];
    
    // DOM Elements - Sleep Tracker
    const sleepDateInput = document.getElementById('sleep-date');
    const bedtimeInput = document.getElementById('bedtime');
    const waketimeInput = document.getElementById('waketime');
    const sleepQualityStars = document.querySelectorAll('#sleep-quality i');
    const sleepNotesInput = document.getElementById('sleep-notes');
    const saveSleepBtn = document.getElementById('save-sleep-btn');
    const sleepHistory = document.getElementById('sleep-history');
    const sleepHistoryEntries = document.getElementById('sleep-history-entries');
    
    // Variables
    let currentMode = 'wake-up'; // 'wake-up' or 'fall-asleep'
    let sleepQualityRating = 0;
    let sleepData = [];
    
    // Initialize the calculator
    initializeCalculator();
    
    // Initialize the sleep tracker
    initializeSleepTracker();
    
    // Event Listeners
    wakeUpTab.addEventListener('click', () => switchMode('wake-up'));
    fallAsleepTab.addEventListener('click', () => switchMode('fall-asleep'));
    calculateBtn.addEventListener('click', calculateSleepTimes);
    saveSleepBtn.addEventListener('click', saveSleepEntry);
    
    // Initialize time selectors
    function initializeCalculator() {
        // Populate hour selectors
        for (let i = 1; i <= 12; i++) {
            const hourOption = document.createElement('option');
            hourOption.value = i;
            hourOption.textContent = i;
            wakeHourSelect.appendChild(hourOption);
            
            const sleepHourOption = document.createElement('option');
            sleepHourOption.value = i;
            sleepHourOption.textContent = i;
            sleepHourSelect.appendChild(sleepHourOption);
        }
        
        // Populate minute selectors
        for (let i = 0; i < 60; i += 5) {
            const minuteOption = document.createElement('option');
            minuteOption.value = i;
            minuteOption.textContent = i.toString().padStart(2, '0');
            wakeMinuteSelect.appendChild(minuteOption);
            
            const sleepMinuteOption = document.createElement('option');
            sleepMinuteOption.value = i;
            sleepMinuteOption.textContent = i.toString().padStart(2, '0');
            sleepMinuteSelect.appendChild(sleepMinuteOption);
        }
        
        // Set default values
        const now = new Date();
        wakeHourSelect.value = now.getHours() % 12 || 12;
        wakeMinuteSelect.value = Math.floor(now.getMinutes() / 5) * 5;
        wakeAmPmSelect.value = now.getHours() >= 12 ? 'PM' : 'AM';
        
        sleepHourSelect.value = (now.getHours() - 8) % 12 || 12;
        sleepMinuteSelect.value = Math.floor(now.getMinutes() / 5) * 5;
        sleepAmPmSelect.value = (now.getHours() - 8) >= 12 ? 'PM' : 'AM';
    }
    
    // Initialize sleep tracker
    function initializeSleepTracker() {
        // Set today's date as default
        const today = new Date();
        sleepDateInput.valueAsDate = today;
        
        // Set default bedtime and wake time
        bedtimeInput.value = '22:30';
        waketimeInput.value = '07:00';
        
        // Add event listeners to stars for rating
        sleepQualityStars.forEach((star, index) => {
            star.addEventListener('click', () => {
                setSleepQuality(index + 1);
            });
            
            star.addEventListener('mouseover', () => {
                highlightStars(index + 1);
            });
            
            star.addEventListener('mouseout', () => {
                highlightStars(sleepQualityRating);
            });
        });
        
        // Load sleep data from local storage
        loadSleepData();
    }
    
    // Switch between wake-up and fall-asleep modes
    function switchMode(mode) {
        currentMode = mode;
        
        if (mode === 'wake-up') {
            wakeUpTab.classList.add('bg-purple-600', 'text-white');
            wakeUpTab.classList.remove('bg-white', 'text-gray-700', 'border', 'border-gray-300');
            
            fallAsleepTab.classList.remove('bg-purple-600', 'text-white');
            fallAsleepTab.classList.add('bg-white', 'text-gray-700', 'border', 'border-gray-300');
            
            wakeUpSection.classList.remove('hidden');
            fallAsleepSection.classList.add('hidden');
        } else {
            fallAsleepTab.classList.add('bg-purple-600', 'text-white');
            fallAsleepTab.classList.remove('bg-white', 'text-gray-700', 'border', 'border-gray-300');
            
            wakeUpTab.classList.remove('bg-purple-600', 'text-white');
            wakeUpTab.classList.add('bg-white', 'text-gray-700', 'border', 'border-gray-300');
            
            fallAsleepSection.classList.remove('hidden');
            wakeUpSection.classList.add('hidden');
        }
        
        // Hide results when switching modes
        resultsSection.classList.add('hidden');
    }
    
    // Calculate sleep times based on wake-up or fall-asleep time
    function calculateSleepTimes() {
        const fallAsleepMinutes = parseInt(fallAsleepTimeInput.value) || 14; // Default 14 minutes to fall asleep
        
        let targetTime;
        
        if (currentMode === 'wake-up') {
            // Calculate from wake-up time
            const hour = parseInt(wakeHourSelect.value);
            const minute = parseInt(wakeMinuteSelect.value);
            const ampm = wakeAmPmSelect.value;
            
            targetTime = convertToDate(hour, minute, ampm);
            calculateBedtimes(targetTime, fallAsleepMinutes);
        } else {
            // Calculate from fall-asleep time
            const hour = parseInt(sleepHourSelect.value);
            const minute = parseInt(sleepMinuteSelect.value);
            const ampm = sleepAmPmSelect.value;
            
            targetTime = convertToDate(hour, minute, ampm);
            calculateWakeUpTimes(targetTime, fallAsleepMinutes);
        }
        
        // Show results section
        resultsSection.classList.remove('hidden');
    }
    
    // Calculate bedtimes based on wake-up time
    function calculateBedtimes(wakeUpTime, fallAsleepMinutes) {
        const cycleLength = 90; // 90 minutes per sleep cycle
        const results = [];
        
        // Calculate for 3, 4, 5, and 6 sleep cycles
        for (let cycles = 6; cycles >= 3; cycles--) {
            const sleepDuration = cycles * cycleLength;
            const bedtime = new Date(wakeUpTime);
            
            // Subtract sleep duration and time to fall asleep
            bedtime.setMinutes(bedtime.getMinutes() - sleepDuration - fallAsleepMinutes);
            
            results.push({
                time: formatTime(bedtime),
                cycles: cycles,
                duration: (sleepDuration / 60).toFixed(1)
            });
        }
        
        // Update result elements
        updateResultElements(results, true);
    }
    
    // Calculate wake-up times based on bedtime
    function calculateWakeUpTimes(bedtime, fallAsleepMinutes) {
        const cycleLength = 90; // 90 minutes per sleep cycle
        const results = [];
        
        // Add time to fall asleep
        const fallAsleepTime = new Date(bedtime);
        fallAsleepTime.setMinutes(fallAsleepTime.getMinutes() + fallAsleepMinutes);
        
        // Calculate for 3, 4, 5, and 6 sleep cycles
        for (let cycles = 3; cycles <= 6; cycles++) {
            const sleepDuration = cycles * cycleLength;
            const wakeUpTime = new Date(fallAsleepTime);
            
            // Add sleep duration
            wakeUpTime.setMinutes(wakeUpTime.getMinutes() + sleepDuration);
            
            results.push({
                time: formatTime(wakeUpTime),
                cycles: cycles,
                duration: (sleepDuration / 60).toFixed(1)
            });
        }
        
        // Update result elements
        updateResultElements(results, false);
    }
    
    // Update the result elements with calculated times
    function updateResultElements(results, isBedtime) {
        resultElements.forEach((element, index) => {
            const result = results[index];
            const timeSpan = element.querySelector('span:first-child');
            const cyclesSpan = element.querySelector('span:last-child');
            
            timeSpan.textContent = result.time;
            cyclesSpan.textContent = `${result.cycles} cycles (${result.duration}h)`;
            
            // Highlight the recommended sleep duration (5-6 cycles)
            if (result.cycles >= 5) {
                element.classList.add('bg-purple-100', 'border-purple-300');
                timeSpan.classList.add('text-purple-800');
            } else {
                element.classList.remove('bg-purple-100', 'border-purple-300');
                element.classList.add('bg-purple-50', 'border-purple-200');
                timeSpan.classList.remove('text-purple-800');
                timeSpan.classList.add('text-purple-700');
            }
        });
    }
    
    // Set sleep quality rating
    function setSleepQuality(rating) {
        sleepQualityRating = rating;
        highlightStars(rating);
    }
    
    // Highlight stars for sleep quality rating
    function highlightStars(count) {
        sleepQualityStars.forEach((star, index) => {
            if (index < count) {
                star.classList.remove('far');
                star.classList.add('fas');
                star.classList.add('text-yellow-400');
                star.classList.remove('text-gray-300');
            } else {
                star.classList.add('far');
                star.classList.remove('fas');
                star.classList.remove('text-yellow-400');
                star.classList.add('text-gray-300');
            }
        });
    }
    
    // Save sleep entry to local storage
    function saveSleepEntry() {
        const date = sleepDateInput.value;
        const bedtime = bedtimeInput.value;
        const waketime = waketimeInput.value;
        const quality = sleepQualityRating;
        const notes = sleepNotesInput.value;
        
        if (!date || !bedtime || !waketime) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Calculate sleep duration
        const bedtimeDate = new Date(`${date}T${bedtime}:00`);
        const waketimeDate = new Date(`${date}T${waketime}:00`);
        
        // Handle case where wake time is on the next day
        if (waketimeDate < bedtimeDate) {
            waketimeDate.setDate(waketimeDate.getDate() + 1);
        }
        
        const durationMs = waketimeDate - bedtimeDate;
        const durationHours = (durationMs / (1000 * 60 * 60)).toFixed(1);
        
        // Create sleep entry
        const sleepEntry = {
            id: Date.now(),
            date,
            bedtime,
            waketime,
            quality,
            notes,
            duration: durationHours
        };
        
        // Add to sleep data array
        sleepData.push(sleepEntry);
        
        // Sort by date (newest first)
        sleepData.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Save to local storage
        saveSleepData();
        
        // Update UI
        updateSleepHistory();
        
        // Reset form
        resetSleepTrackerForm();
        
        // Show success notification
        showNotification('Sleep entry saved successfully!');
        
        // Show sleep history if it was hidden
        sleepHistory.classList.remove('hidden');
    }
    
    // Reset sleep tracker form
    function resetSleepTrackerForm() {
        // Keep the date, reset other fields
        bedtimeInput.value = '22:30';
        waketimeInput.value = '07:00';
        setSleepQuality(0);
        sleepNotesInput.value = '';
    }
    
    // Load sleep data from local storage
    function loadSleepData() {
        const storedData = localStorage.getItem('sleepData');
        if (storedData) {
            sleepData = JSON.parse(storedData);
            updateSleepHistory();
            
            // Show sleep history if there's data
            if (sleepData.length > 0) {
                sleepHistory.classList.remove('hidden');
            }
        }
    }
    
    // Save sleep data to local storage
    function saveSleepData() {
        localStorage.setItem('sleepData', JSON.stringify(sleepData));
    }
    
    // Update sleep history display
    function updateSleepHistory() {
        if (sleepData.length === 0) {
            sleepHistoryEntries.innerHTML = '<p class="text-gray-500 text-center">No sleep data recorded yet. Start tracking your sleep above!</p>';
            return;
        }
        
        // Clear existing entries
        sleepHistoryEntries.innerHTML = '';
        
        // Show the most recent 7 entries
        const recentEntries = sleepData.slice(0, 7);
        
        recentEntries.forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.className = 'p-3 bg-white rounded-lg border border-gray-200 shadow-sm';
            
            const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
            
            const stars = '★'.repeat(entry.quality) + '☆'.repeat(5 - entry.quality);
            
            entryElement.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="font-medium text-gray-800">${formattedDate}</h4>
                        <p class="text-sm text-gray-600">${entry.bedtime} - ${entry.waketime} (${entry.duration}h)</p>
                    </div>
                    <div class="text-yellow-400 text-sm">${stars}</div>
                </div>
                ${entry.notes ? `<p class="text-sm text-gray-600 mt-1">${entry.notes}</p>` : ''}
                <button class="delete-entry-btn text-xs text-red-500 mt-2" data-id="${entry.id}">
                    <i class="fas fa-trash-alt mr-1"></i>Delete
                </button>
            `;
            
            sleepHistoryEntries.appendChild(entryElement);
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-entry-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                deleteSleepEntry(id);
            });
        });
    }
    
    // Delete sleep entry
    function deleteSleepEntry(id) {
        // Filter out the entry with the given id
        sleepData = sleepData.filter(entry => entry.id !== id);
        
        // Save updated data
        saveSleepData();
        
        // Update UI
        updateSleepHistory();
        
        // Hide sleep history if there's no data
        if (sleepData.length === 0) {
            sleepHistory.classList.add('hidden');
        }
        
        // Show notification
        showNotification('Sleep entry deleted');
    }
    
    // Helper function to convert hour, minute, and AM/PM to a Date object
    function convertToDate(hour, minute, ampm) {
        const date = new Date();
        
        // Convert hour to 24-hour format
        let hour24 = hour;
        if (ampm === 'PM' && hour !== 12) {
            hour24 += 12;
        } else if (ampm === 'AM' && hour === 12) {
            hour24 = 0;
        }
        
        date.setHours(hour24, minute, 0, 0);
        return date;
    }
    
    // Helper function to format time as HH:MM AM/PM
    function formatTime(date) {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        // Convert to 12-hour format
        hours = hours % 12 || 12;
        
        // Format as HH:MM AM/PM
        return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }
    
    // Show notification
    function showNotification(message, type = 'success') {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            notification.className = 'fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-y-20 opacity-0 z-50';
            document.body.appendChild(notification);
        }
        
        // Set notification style based on type
        if (type === 'success') {
            notification.className = notification.className.replace(/bg-\w+-\d+/g, '');
            notification.classList.add('bg-green-500', 'text-white');
        } else if (type === 'error') {
            notification.className = notification.className.replace(/bg-\w+-\d+/g, '');
            notification.classList.add('bg-red-500', 'text-white');
        }
        
        // Set notification message
        notification.textContent = message;
        
        // Show notification
        setTimeout(() => {
            notification.classList.remove('translate-y-20', 'opacity-0');
        }, 10);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.add('translate-y-20', 'opacity-0');
        }, 3000);
    }
});