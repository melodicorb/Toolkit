// Ultimate Student Toolkit - Habit Tracker

document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // DOM Elements - Habit Management
    const habitList = document.getElementById('habit-list');
    const createHabitBtn = document.getElementById('create-habit-btn');
    const habitModal = document.getElementById('habit-modal');
    const closeHabitModal = document.getElementById('close-habit-modal');
    const habitForm = document.getElementById('habit-form');
    const cancelHabitBtn = document.getElementById('cancel-habit-btn');
    
    // DOM Elements - Calendar
    const calendarView = document.getElementById('calendar-view');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const currentMonthDisplay = document.getElementById('current-month');
    
    // DOM Elements - Statistics
    const currentStreakDisplay = document.getElementById('current-streak');
    const longestStreakDisplay = document.getElementById('longest-streak');
    const completionRateDisplay = document.getElementById('completion-rate');
    
    // DOM Elements - Check-in Modal
    const checkinModal = document.getElementById('checkin-modal');
    const closeCheckinModal = document.getElementById('close-checkin-modal');
    const checkinForm = document.getElementById('checkin-form');
    const cancelCheckinBtn = document.getElementById('cancel-checkin-btn');
    
    // Habit Tracker State
    let habits = [];
    let currentHabitIndex = -1;
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    // Initialize with local storage data or sample data
    initializeHabitData();
    
    // Event Listeners - Habit Management
    createHabitBtn.addEventListener('click', () => {
        document.getElementById('habit-modal-title').textContent = 'Create New Habit';
        habitForm.reset();
        habitModal.classList.remove('hidden');
    });
    
    closeHabitModal.addEventListener('click', () => {
        habitModal.classList.add('hidden');
    });
    
    cancelHabitBtn.addEventListener('click', () => {
        habitModal.classList.add('hidden');
    });
    
    habitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const habitName = document.getElementById('habit-name').value;
        const habitDescription = document.getElementById('habit-description').value;
        const habitFrequency = document.getElementById('habit-frequency').value;
        const habitColor = document.getElementById('habit-color').value;
        
        if (document.getElementById('habit-modal-title').textContent === 'Create New Habit') {
            // Create new habit
            const newHabit = {
                id: Date.now(),
                name: habitName,
                description: habitDescription,
                frequency: habitFrequency,
                color: habitColor,
                checkins: [],
                dateCreated: new Date()
            };
            
            habits.push(newHabit);
        } else {
            // Edit existing habit
            habits[currentHabitIndex].name = habitName;
            habits[currentHabitIndex].description = habitDescription;
            habits[currentHabitIndex].frequency = habitFrequency;
            habits[currentHabitIndex].color = habitColor;
        }
        
        habitModal.classList.add('hidden');
        renderHabitList();
        saveHabitData();
        updateStatistics();
    });
    
    // Event Listeners - Calendar Navigation
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });
    
    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });
    
    // Event Listeners - Check-in Modal
    closeCheckinModal.addEventListener('click', () => {
        checkinModal.classList.add('hidden');
    });
    
    cancelCheckinBtn.addEventListener('click', () => {
        checkinModal.classList.add('hidden');
    });
    
    checkinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const checkinDate = document.getElementById('checkin-date').value;
        const checkinNotes = document.getElementById('checkin-notes').value;
        
        // Add check-in to the habit
        const checkin = {
            date: checkinDate,
            notes: checkinNotes,
            timestamp: new Date().toISOString()
        };
        
        // Check if this date already has a check-in
        const existingCheckinIndex = habits[currentHabitIndex].checkins.findIndex(
            c => c.date === checkinDate
        );
        
        if (existingCheckinIndex >= 0) {
            // Update existing check-in
            habits[currentHabitIndex].checkins[existingCheckinIndex] = checkin;
        } else {
            // Add new check-in
            habits[currentHabitIndex].checkins.push(checkin);
        }
        
        checkinModal.classList.add('hidden');
        saveHabitData();
        renderCalendar();
        renderHabitList();
        updateStatistics();
    });
    
    // Initialize habit data from local storage or create sample data
    function initializeHabitData() {
        const savedHabits = localStorage.getItem('habitTrackerData');
        
        if (savedHabits) {
            habits = JSON.parse(savedHabits);
        } else {
            // Optional: Add sample habits for first-time users
            habits = [
                {
                    id: 1,
                    name: 'Study Mathematics',
                    description: '30 minutes of focused study',
                    frequency: 'daily',
                    color: 'blue',
                    checkins: [],
                    dateCreated: new Date()
                },
                {
                    id: 2,
                    name: 'Read Course Material',
                    description: 'Read assigned chapters',
                    frequency: 'weekdays',
                    color: 'purple',
                    checkins: [],
                    dateCreated: new Date()
                }
            ];
        }
        
        renderHabitList();
        renderCalendar();
        updateStatistics();
    }
    
    // Save habit data to local storage
    function saveHabitData() {
        localStorage.setItem('habitTrackerData', JSON.stringify(habits));
    }
    
    // Render the list of habits
    function renderHabitList() {
        habitList.innerHTML = '';
        
        if (habits.length === 0) {
            habitList.innerHTML = `
                <div class="empty-state text-center py-8">
                    <div class="text-4xl text-green-200 mb-2"><i class="fas fa-chart-line"></i></div>
                    <p class="text-gray-500">No habits tracked yet</p>
                    <p class="text-gray-500 text-sm">Click the Create New Habit button to get started</p>
                </div>
            `;
            return;
        }
        
        habits.forEach((habit, index) => {
            const habitElement = document.createElement('div');
            habitElement.className = `bg-white border rounded-lg shadow-sm p-4 transition duration-300 hover:shadow-md`;
            
            // Calculate streak for this habit
            const streak = calculateCurrentStreak(habit);
            
            // Get today's date in YYYY-MM-DD format for comparison
            const today = new Date().toISOString().split('T')[0];
            
            // Check if habit is completed today
            const completedToday = habit.checkins.some(checkin => checkin.date === today);
            
            habitElement.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="text-lg font-semibold text-gray-800">${habit.name}</h4>
                        <p class="text-sm text-gray-600 mt-1">${habit.description || 'No description'}</p>
                        <div class="flex items-center mt-2">
                            <span class="text-xs font-medium px-2 py-1 rounded-full bg-${habit.color}-100 text-${habit.color}-800 mr-2">
                                ${habit.frequency}
                            </span>
                            <span class="text-xs text-gray-500">
                                <i class="fas fa-fire text-orange-500 mr-1"></i> ${streak} day streak
                            </span>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button class="check-in-btn p-2 rounded-full ${completedToday ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'} hover:bg-green-200 transition duration-300" data-index="${index}">
                            <i class="fas ${completedToday ? 'fa-check-circle' : 'fa-circle'}"></i>
                        </button>
                        <button class="edit-habit-btn p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition duration-300" data-index="${index}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-habit-btn p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition duration-300" data-index="${index}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            
            habitList.appendChild(habitElement);
        });
        
        // Add event listeners to the buttons
        document.querySelectorAll('.check-in-btn').forEach(button => {
            button.addEventListener('click', () => {
                currentHabitIndex = parseInt(button.dataset.index);
                openCheckinModal();
            });
        });
        
        document.querySelectorAll('.edit-habit-btn').forEach(button => {
            button.addEventListener('click', () => {
                currentHabitIndex = parseInt(button.dataset.index);
                openEditHabitModal();
            });
        });
        
        document.querySelectorAll('.delete-habit-btn').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.dataset.index);
                if (confirm(`Are you sure you want to delete "${habits[index].name}"?`)) {
                    habits.splice(index, 1);
                    saveHabitData();
                    renderHabitList();
                    renderCalendar();
                    updateStatistics();
                }
            });
        });
    }
    
    // Open the check-in modal
    function openCheckinModal() {
        document.getElementById('checkin-modal-title').textContent = `Check-in: ${habits[currentHabitIndex].name}`;
        
        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('checkin-date').value = today;
        document.getElementById('checkin-notes').value = '';
        
        // Check if there's already a check-in for today
        const todayCheckin = habits[currentHabitIndex].checkins.find(c => c.date === today);
        if (todayCheckin) {
            document.getElementById('checkin-notes').value = todayCheckin.notes || '';
        }
        
        checkinModal.classList.remove('hidden');
    }
    
    // Open the edit habit modal
    function openEditHabitModal() {
        document.getElementById('habit-modal-title').textContent = 'Edit Habit';
        
        const habit = habits[currentHabitIndex];
        document.getElementById('habit-name').value = habit.name;
        document.getElementById('habit-description').value = habit.description || '';
        document.getElementById('habit-frequency').value = habit.frequency;
        document.getElementById('habit-color').value = habit.color;
        
        habitModal.classList.remove('hidden');
    }
    
    // Render the calendar
    function renderCalendar() {
        // Update month display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        currentMonthDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        
        // Get the grid container and clear previous days
        const calendarGrid = calendarView.querySelector('.grid');
        
        // Keep the day headers
        const dayHeaders = Array.from(calendarGrid.children).slice(0, 7);
        calendarGrid.innerHTML = '';
        
        // Add back the day headers
        dayHeaders.forEach(header => {
            calendarGrid.appendChild(header);
        });
        
        // Get first day of the month and total days
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'h-10 border border-gray-100 rounded-md bg-gray-50';
            calendarGrid.appendChild(emptyCell);
        }
        
        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayCell = document.createElement('div');
            dayCell.className = 'relative h-10 border border-gray-100 rounded-md flex items-center justify-center hover:bg-gray-50 transition duration-300';
            
            // Check if any habits have check-ins for this date
            const habitsForDay = habits.filter(habit => 
                habit.checkins.some(checkin => checkin.date === dateString)
            );
            
            // Style for today
            const isToday = day === new Date().getDate() && 
                          currentMonth === new Date().getMonth() && 
                          currentYear === new Date().getFullYear();
            
            if (isToday) {
                dayCell.classList.add('bg-green-50', 'border-green-200');
            }
            
            // Add day number
            dayCell.innerHTML = `<span class="${isToday ? 'font-bold text-green-600' : 'text-gray-700'}">${day}</span>`;
            
            // Add habit indicators if there are check-ins for this day
            if (habitsForDay.length > 0) {
                const indicatorContainer = document.createElement('div');
                indicatorContainer.className = 'absolute bottom-1 flex justify-center space-x-1';
                
                // Limit to showing 3 indicators max
                const displayHabits = habitsForDay.slice(0, 3);
                displayHabits.forEach(habit => {
                    const indicator = document.createElement('div');
                    indicator.className = `w-1.5 h-1.5 rounded-full bg-${habit.color}-500`;
                    indicatorContainer.appendChild(indicator);
                });
                
                // Add a '+' indicator if there are more than 3 habits
                if (habitsForDay.length > 3) {
                    const moreIndicator = document.createElement('div');
                    moreIndicator.className = 'w-1.5 h-1.5 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs';
                    moreIndicator.textContent = '+';
                    indicatorContainer.appendChild(moreIndicator);
                }
                
                dayCell.appendChild(indicatorContainer);
            }
            
            calendarGrid.appendChild(dayCell);
        }
    }
    
    // Update statistics displays
    function updateStatistics() {
        if (habits.length === 0) {
            currentStreakDisplay.textContent = '0 days';
            longestStreakDisplay.textContent = '0 days';
            completionRateDisplay.textContent = '0%';
            return;
        }
        
        // Calculate overall statistics across all habits
        let totalCurrentStreak = 0;
        let totalLongestStreak = 0;
        let totalCompletionRate = 0;
        
        habits.forEach(habit => {
            const currentStreak = calculateCurrentStreak(habit);
            const longestStreak = calculateLongestStreak(habit);
            const completionRate = calculateCompletionRate(habit);
            
            totalCurrentStreak += currentStreak;
            totalLongestStreak = Math.max(totalLongestStreak, longestStreak);
            totalCompletionRate += completionRate;
        });
        
        // Average current streak and completion rate across habits
        const avgCurrentStreak = Math.round(totalCurrentStreak / habits.length);
        const avgCompletionRate = Math.round(totalCompletionRate / habits.length);
        
        // Update displays
        currentStreakDisplay.textContent = `${avgCurrentStreak} days`;
        longestStreakDisplay.textContent = `${totalLongestStreak} days`;
        completionRateDisplay.textContent = `${avgCompletionRate}%`;
    }
    
    // Calculate current streak for a habit
    function calculateCurrentStreak(habit) {
        if (habit.checkins.length === 0) return 0;
        
        // Sort check-ins by date
        const sortedCheckins = [...habit.checkins].sort((a, b) => 
            new Date(a.date) - new Date(b.date)
        );
        
        // Get today and yesterday dates
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // Check if the most recent check-in is from today or yesterday
        const mostRecentDate = new Date(sortedCheckins[sortedCheckins.length - 1].date);
        if (mostRecentDate < yesterday) {
            // Streak is broken if most recent check-in is older than yesterday
            return 0;
        }
        
        // Count consecutive days backward from the most recent check-in
        let streak = 1; // Start with 1 for the most recent check-in
        let currentDate = new Date(mostRecentDate);
        currentDate.setDate(currentDate.getDate() - 1); // Start checking from the day before
        
        for (let i = sortedCheckins.length - 2; i >= 0; i--) {
            const checkinDate = new Date(sortedCheckins[i].date);
            
            // Check if this check-in is from the expected date in the streak
            if (checkinDate.toDateString() === currentDate.toDateString()) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else if (checkinDate < currentDate) {
                // If we find an older check-in, continue looking
                continue;
            } else {
                // If there's a gap, the streak is broken
                break;
            }
        }
        
        return streak;
    }
    
    // Calculate longest streak for a habit
    function calculateLongestStreak(habit) {
        if (habit.checkins.length === 0) return 0;
        
        // Sort check-ins by date
        const sortedCheckins = [...habit.checkins].sort((a, b) => 
            new Date(a.date) - new Date(b.date)
        );
        
        let longestStreak = 1;
        let currentStreak = 1;
        
        for (let i = 1; i < sortedCheckins.length; i++) {
            const currentDate = new Date(sortedCheckins[i].date);
            const prevDate = new Date(sortedCheckins[i-1].date);
            
            // Calculate difference in days
            const diffTime = currentDate - prevDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                // Consecutive day
                currentStreak++;
                longestStreak = Math.max(longestStreak, currentStreak);
            } else if (diffDays > 1) {
                // Streak broken
                currentStreak = 1;
            }
        }
        
        return longestStreak;
    }
    
    // Calculate completion rate for a habit
    function calculateCompletionRate(habit) {
        if (habit.checkins.length === 0) return 0;
        
        // Calculate days since habit creation
        const creationDate = new Date(habit.dateCreated);
        const today = new Date();
        const diffTime = today - creationDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 100; // Created today
        
        // Adjust expected days based on frequency
        let expectedDays = diffDays;
        if (habit.frequency === 'weekdays') {
            // Count only weekdays
            expectedDays = 0;
            for (let d = new Date(creationDate); d <= today; d.setDate(d.getDate() + 1)) {
                const day = d.getDay();
                if (day > 0 && day < 6) expectedDays++; // Monday to Friday
            }
        } else if (habit.frequency === 'weekends') {
            // Count only weekends
            expectedDays = 0;
            for (let d = new Date(creationDate); d <= today; d.setDate(d.getDate() + 1)) {
                const day = d.getDay();
                if (day === 0 || day === 6) expectedDays++; // Saturday and Sunday
            }
        } else if (habit.frequency === 'weekly') {
            // Count only one day per week
            expectedDays = Math.ceil(diffDays / 7);
        }
        
        if (expectedDays === 0) return 100; // No expected days yet
        
        // Calculate completion rate
        const completionRate = Math.min(100, Math.round((habit.checkins.length / expectedDays) * 100));
        return completionRate;
    }
});