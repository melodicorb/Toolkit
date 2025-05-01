// Ultimate Student Toolkit - Study Calendar

document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // DOM Elements - Calendar
    const calendarGrid = document.getElementById('calendar-grid');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const currentMonthDisplay = document.getElementById('current-month');
    
    // DOM Elements - Event Management
    const createEventBtn = document.getElementById('create-event-btn');
    const eventModal = document.getElementById('event-modal');
    const closeEventModal = document.getElementById('close-event-modal');
    const eventForm = document.getElementById('event-form');
    const cancelEventBtn = document.getElementById('cancel-event-btn');
    const upcomingEventsContainer = document.getElementById('upcoming-events');
    const noEventsMessage = document.getElementById('no-events-message');
    
    // DOM Elements - Event Details
    const eventDetailsModal = document.getElementById('event-details-modal');
    const closeEventDetails = document.getElementById('close-event-details');
    const eventDetailsTitle = document.getElementById('event-details-title');
    const eventDetailsContent = document.getElementById('event-details-content');
    const deleteEventBtn = document.getElementById('delete-event-btn');
    const editEventBtn = document.getElementById('edit-event-btn');
    
    // DOM Elements - Statistics
    const totalEventsDisplay = document.getElementById('total-events');
    const eventsThisWeekDisplay = document.getElementById('events-this-week');
    const eventsThisMonthDisplay = document.getElementById('events-this-month');
    
    // Calendar State
    let events = [];
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let currentEventId = null;
    
    // Initialize with local storage data
    initializeCalendarData();
    
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
    
    // Event Listeners - Event Management
    createEventBtn.addEventListener('click', () => {
        document.getElementById('event-modal-title').textContent = 'Create Study Event';
        eventForm.reset();
        
        // Set default date to today
        const today = new Date();
        const formattedDate = formatDateForInput(today);
        document.getElementById('event-date').value = formattedDate;
        
        currentEventId = null;
        eventModal.classList.remove('hidden');
    });
    
    closeEventModal.addEventListener('click', () => {
        eventModal.classList.add('hidden');
    });
    
    cancelEventBtn.addEventListener('click', () => {
        eventModal.classList.add('hidden');
    });
    
    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const eventTitle = document.getElementById('event-title').value;
        const eventDate = document.getElementById('event-date').value;
        const eventStartTime = document.getElementById('event-start-time').value;
        const eventEndTime = document.getElementById('event-end-time').value;
        const eventType = document.getElementById('event-type').value;
        const eventColor = document.getElementById('event-color').value;
        const eventNotes = document.getElementById('event-notes').value;
        
        if (currentEventId === null) {
            // Create new event
            const newEvent = {
                id: Date.now(),
                title: eventTitle,
                date: eventDate,
                startTime: eventStartTime,
                endTime: eventEndTime,
                type: eventType,
                color: eventColor,
                notes: eventNotes,
                createdAt: new Date().toISOString()
            };
            
            events.push(newEvent);
        } else {
            // Edit existing event
            const eventIndex = events.findIndex(event => event.id === currentEventId);
            if (eventIndex !== -1) {
                events[eventIndex].title = eventTitle;
                events[eventIndex].date = eventDate;
                events[eventIndex].startTime = eventStartTime;
                events[eventIndex].endTime = eventEndTime;
                events[eventIndex].type = eventType;
                events[eventIndex].color = eventColor;
                events[eventIndex].notes = eventNotes;
            }
        }
        
        eventModal.classList.add('hidden');
        saveCalendarData();
        renderCalendar();
        renderUpcomingEvents();
        updateStatistics();
    });
    
    // Event Listeners - Event Details
    closeEventDetails.addEventListener('click', () => {
        eventDetailsModal.classList.add('hidden');
    });
    
    deleteEventBtn.addEventListener('click', () => {
        if (currentEventId === null) return;
        
        if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
            const eventIndex = events.findIndex(event => event.id === currentEventId);
            if (eventIndex !== -1) {
                events.splice(eventIndex, 1);
                eventDetailsModal.classList.add('hidden');
                saveCalendarData();
                renderCalendar();
                renderUpcomingEvents();
                updateStatistics();
            }
        }
    });
    
    editEventBtn.addEventListener('click', () => {
        if (currentEventId === null) return;
        
        const event = events.find(event => event.id === currentEventId);
        if (!event) return;
        
        document.getElementById('event-modal-title').textContent = 'Edit Study Event';
        document.getElementById('event-title').value = event.title;
        document.getElementById('event-date').value = event.date;
        document.getElementById('event-start-time').value = event.startTime;
        document.getElementById('event-end-time').value = event.endTime;
        document.getElementById('event-type').value = event.type;
        document.getElementById('event-color').value = event.color;
        document.getElementById('event-notes').value = event.notes || '';
        
        eventDetailsModal.classList.add('hidden');
        eventModal.classList.remove('hidden');
    });
    
    // Initialize calendar data from local storage
    function initializeCalendarData() {
        const savedEvents = localStorage.getItem('studyCalendarEvents');
        
        if (savedEvents) {
            events = JSON.parse(savedEvents);
        } else {
            // Optional: Add sample events for first-time users
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            events = [
                {
                    id: 1,
                    title: 'Math Study Session',
                    date: formatDateForInput(today),
                    startTime: '14:00',
                    endTime: '16:00',
                    type: 'study',
                    color: 'blue',
                    notes: 'Focus on calculus problems',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    title: 'Physics Exam',
                    date: formatDateForInput(tomorrow),
                    startTime: '10:00',
                    endTime: '12:00',
                    type: 'exam',
                    color: 'red',
                    notes: 'Chapters 5-8',
                    createdAt: new Date().toISOString()
                }
            ];
        }
        
        renderCalendar();
        renderUpcomingEvents();
        updateStatistics();
    }
    
    // Save calendar data to local storage
    function saveCalendarData() {
        localStorage.setItem('studyCalendarEvents', JSON.stringify(events));
    }
    
    // Render the calendar for the current month
    function renderCalendar() {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        // Update month display
        currentMonthDisplay.textContent = `${getMonthName(currentMonth)} ${currentYear}`;
        
        // Create calendar HTML
        let calendarHTML = `
            <div class="grid grid-cols-7 gap-1 text-center">
                <div class="text-sm font-medium text-gray-500 py-2">Sun</div>
                <div class="text-sm font-medium text-gray-500 py-2">Mon</div>
                <div class="text-sm font-medium text-gray-500 py-2">Tue</div>
                <div class="text-sm font-medium text-gray-500 py-2">Wed</div>
                <div class="text-sm font-medium text-gray-500 py-2">Thu</div>
                <div class="text-sm font-medium text-gray-500 py-2">Fri</div>
                <div class="text-sm font-medium text-gray-500 py-2">Sat</div>
        `;
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            calendarHTML += `<div class="p-2 bg-gray-50 rounded-lg"></div>`;
        }
        
        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const formattedDate = formatDateForInput(date);
            const dayEvents = events.filter(event => event.date === formattedDate);
            const isToday = isDateToday(date);
            
            calendarHTML += `
                <div class="${isToday ? 'bg-blue-50 border border-blue-200' : 'bg-white'} p-2 rounded-lg shadow-sm min-h-[80px] relative">
                    <div class="text-right ${isToday ? 'font-bold text-blue-600' : 'text-gray-700'}">${day}</div>
                    <div class="mt-1 space-y-1 max-h-[60px] overflow-y-auto">
            `;
            
            // Add event indicators
            dayEvents.forEach(event => {
                const eventColorClass = getEventColorClass(event.color);
                calendarHTML += `
                    <div class="${eventColorClass} text-white text-xs p-1 rounded truncate cursor-pointer event-item" 
                         data-event-id="${event.id}">
                        ${event.title}
                    </div>
                `;
            });
            
            calendarHTML += `
                    </div>
                </div>
            `;
        }
        
        // Add empty cells for days after the last day of the month to complete the grid
        const totalCells = startingDayOfWeek + daysInMonth;
        const remainingCells = 7 - (totalCells % 7);
        if (remainingCells < 7) {
            for (let i = 0; i < remainingCells; i++) {
                calendarHTML += `<div class="p-2 bg-gray-50 rounded-lg"></div>`;
            }
        }
        
        calendarHTML += `</div>`;
        calendarGrid.innerHTML = calendarHTML;
        
        // Add event listeners to event items
        document.querySelectorAll('.event-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const eventId = parseInt(e.currentTarget.getAttribute('data-event-id'));
                showEventDetails(eventId);
            });
        });
    }
    
    // Render upcoming events
    function renderUpcomingEvents() {
        // Sort events by date and time
        const sortedEvents = [...events].sort((a, b) => {
            if (a.date !== b.date) {
                return new Date(a.date) - new Date(b.date);
            }
            return a.startTime.localeCompare(b.startTime);
        });
        
        // Filter to only show future events
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const futureEvents = sortedEvents.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= today;
        });
        
        // Limit to next 5 events
        const upcomingEvents = futureEvents.slice(0, 5);
        
        if (upcomingEvents.length === 0) {
            noEventsMessage.classList.remove('hidden');
            upcomingEventsContainer.innerHTML = '';
        } else {
            noEventsMessage.classList.add('hidden');
            
            let eventsHTML = '';
            upcomingEvents.forEach(event => {
                const eventDate = new Date(event.date);
                const formattedDate = formatDateForDisplay(eventDate);
                const eventColorClass = getEventColorClass(event.color);
                const eventTypeIcon = getEventTypeIcon(event.type);
                
                eventsHTML += `
                    <div class="bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition duration-300 cursor-pointer upcoming-event" data-event-id="${event.id}">
                        <div class="flex items-start">
                            <div class="${eventColorClass} text-white p-2 rounded-lg mr-3">
                                <i class="${eventTypeIcon}"></i>
                            </div>
                            <div class="flex-1">
                                <h4 class="font-medium text-gray-800">${event.title}</h4>
                                <p class="text-sm text-gray-600">${formattedDate} • ${formatTime(event.startTime)} - ${formatTime(event.endTime)}</p>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            upcomingEventsContainer.innerHTML = eventsHTML;
            
            // Add event listeners to upcoming events
            document.querySelectorAll('.upcoming-event').forEach(item => {
                item.addEventListener('click', (e) => {
                    const eventId = parseInt(e.currentTarget.getAttribute('data-event-id'));
                    showEventDetails(eventId);
                });
            });
        }
    }
    
    // Show event details
    function showEventDetails(eventId) {
        const event = events.find(event => event.id === eventId);
        if (!event) return;
        
        currentEventId = eventId;
        eventDetailsTitle.textContent = event.title;
        
        const eventDate = new Date(event.date);
        const formattedDate = formatDateForDisplay(eventDate);
        const eventTypeIcon = getEventTypeIcon(event.type);
        const eventColorClass = getEventColorClass(event.color);
        
        let detailsHTML = `
            <div class="space-y-4">
                <div class="flex items-center">
                    <div class="${eventColorClass} text-white p-2 rounded-lg mr-3">
                        <i class="${eventTypeIcon}"></i>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600">${getEventTypeName(event.type)}</p>
                    </div>
                </div>
                
                <div class="flex items-center">
                    <div class="text-gray-500 mr-3">
                        <i class="fas fa-calendar-day"></i>
                    </div>
                    <p>${formattedDate}</p>
                </div>
                
                <div class="flex items-center">
                    <div class="text-gray-500 mr-3">
                        <i class="fas fa-clock"></i>
                    </div>
                    <p>${formatTime(event.startTime)} - ${formatTime(event.endTime)}</p>
                </div>
        `;
        
        if (event.notes && event.notes.trim() !== '') {
            detailsHTML += `
                <div class="mt-4">
                    <h4 class="font-medium text-gray-800 mb-2">Notes</h4>
                    <p class="text-gray-600 bg-gray-50 p-3 rounded-lg">${event.notes}</p>
                </div>
            `;
        }
        
        detailsHTML += `</div>`;
        eventDetailsContent.innerHTML = detailsHTML;
        eventDetailsModal.classList.remove('hidden');
    }
    
    // Update statistics
    function updateStatistics() {
        // Total events
        totalEventsDisplay.textContent = events.length;
        
        // Events this week
        const today = new Date();
        const startOfWeek = new Date(today);
        const dayOfWeek = today.getDay();
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when day is Sunday
        startOfWeek.setDate(diff);
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        
        const eventsThisWeek = events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= startOfWeek && eventDate <= endOfWeek;
        });
        
        eventsThisWeekDisplay.textContent = eventsThisWeek.length;
        
        // Events this month
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
        
        const eventsThisMonth = events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= startOfMonth && eventDate <= endOfMonth;
        });
        
        eventsThisMonthDisplay.textContent = eventsThisMonth.length;
    }
    
    // Helper Functions
    function formatDateForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    function formatDateForDisplay(date) {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
    
    function formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const period = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
        return `${formattedHour}:${minutes} ${period}`;
    }
    
    function getMonthName(monthIndex) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[monthIndex];
    }
    
    function isDateToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }
    
    function getEventColorClass(color) {
        const colorClasses = {
            'blue': 'bg-blue-500',
            'green': 'bg-green-500',
            'red': 'bg-red-500',
            'purple': 'bg-purple-500',
            'yellow': 'bg-yellow-500',
            'pink': 'bg-pink-500'
        };
        return colorClasses[color] || 'bg-blue-500';
    }
    
    function getEventTypeIcon(type) {
        const typeIcons = {
            'study': 'fas fa-book',
            'exam': 'fas fa-file-alt',
            'assignment': 'fas fa-tasks',
            'lecture': 'fas fa-chalkboard-teacher',
            'other': 'fas fa-calendar-day'
        };
        return typeIcons[type] || 'fas fa-calendar-day';
    }
    
    function getEventTypeName(type) {
        const typeNames = {
            'study': 'Study Session',
            'exam': 'Exam',
            'assignment': 'Assignment',
            'lecture': 'Lecture',
            'other': 'Other'
        };
        return typeNames[type] || 'Event';
    }
});