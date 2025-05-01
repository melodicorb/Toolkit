document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // DOM Elements - Note Management
    const notesList = document.getElementById('notes-list');
    const createNoteBtn = document.getElementById('create-note-btn');
    const welcomeCreateNoteBtn = document.getElementById('welcome-create-note-btn');
    const saveNoteBtn = document.getElementById('save-note-btn');
    const deleteNoteBtn = document.getElementById('delete-note-btn');
    const searchInput = document.getElementById('search-notes');
    
    // DOM Elements - Note Editor
    const noteEditor = document.getElementById('note-editor');
    const welcomeScreen = document.getElementById('welcome-screen');
    const noteTitleInput = document.getElementById('note-title');
    const noteCategoryInput = document.getElementById('note-category');
    const noteContentInput = document.getElementById('note-content');
    const wordCountDisplay = document.getElementById('word-count');
    const charCountDisplay = document.getElementById('char-count');
    const lastUpdatedDisplay = document.getElementById('last-updated');
    const categorySuggestions = document.getElementById('category-suggestions');
    
    // DOM Elements - Categories
    const categoriesList = document.getElementById('categories-list');
    const totalNotesDisplay = document.getElementById('total-notes');
    const totalCategoriesDisplay = document.getElementById('total-categories');
    
    // Quick Notes State
    let notes = [];
    let categories = ['Uncategorized'];
    let currentNoteId = null;
    let currentFilter = 'all';
    
    // Initialize with local storage data
    initializeNotesData();
    
    // Event Listeners - Note Management
    createNoteBtn.addEventListener('click', createNewNote);
    welcomeCreateNoteBtn.addEventListener('click', createNewNote);
    saveNoteBtn.addEventListener('click', saveCurrentNote);
    deleteNoteBtn.addEventListener('click', deleteCurrentNote);
    searchInput.addEventListener('input', filterNotes);
    
    // Event Listeners - Note Editor
    noteContentInput.addEventListener('input', () => {
        updateWordAndCharCount();
    });
    
    // Event Listeners - Categories
    noteCategoryInput.addEventListener('input', showCategorySuggestions);
    noteCategoryInput.addEventListener('blur', () => {
        // Hide suggestions after a short delay to allow for clicks
        setTimeout(() => {
            categorySuggestions.classList.add('hidden');
        }, 200);
    });
    
    // Initialize notes data from local storage
    function initializeNotesData() {
        const savedNotes = localStorage.getItem('quickNotesData');
        const savedCategories = localStorage.getItem('quickNotesCategories');
        
        if (savedNotes) {
            notes = JSON.parse(savedNotes);
        } else {
            // Optional: Add a sample note for first-time users
            const sampleNote = {
                id: generateId(),
                title: 'Welcome to Quick Notes',
                content: 'This is a sample note to help you get started. You can edit or delete this note, or create new ones using the "New Note" button.\n\nFeatures:\n- Create multiple notes\n- Organize with categories\n- Search through your notes\n- Track word and character count',
                category: 'Getting Started',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            notes.push(sampleNote);
        }
        
        if (savedCategories) {
            categories = JSON.parse(savedCategories);
        } else if (notes.length > 0) {
            // Extract categories from existing notes
            const uniqueCategories = new Set(['Uncategorized']);
            notes.forEach(note => {
                if (note.category) {
                    uniqueCategories.add(note.category);
                }
            });
            categories = Array.from(uniqueCategories);
        }
        
        renderNotesList();
        renderCategories();
        updateStatistics();
        
        // Show welcome screen if no notes or no note is selected
        if (notes.length === 0 || currentNoteId === null) {
            showWelcomeScreen();
        }
    }
    
    // Save notes data to local storage
    function saveNotesData() {
        localStorage.setItem('quickNotesData', JSON.stringify(notes));
        localStorage.setItem('quickNotesCategories', JSON.stringify(categories));
    }
    
    // Create a new note
    function createNewNote() {
        const newNote = {
            id: generateId(),
            title: '',
            content: '',
            category: 'Uncategorized',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        notes.push(newNote);
        currentNoteId = newNote.id;
        
        renderNotesList();
        loadNoteToEditor(newNote);
        saveNotesData();
        updateStatistics();
    }
    
    // Save the current note
    function saveCurrentNote() {
        if (currentNoteId === null) return;
        
        const noteIndex = notes.findIndex(note => note.id === currentNoteId);
        if (noteIndex === -1) return;
        
        const title = noteTitleInput.value.trim() || 'Untitled Note';
        const content = noteContentInput.value;
        const category = noteCategoryInput.value.trim() || 'Uncategorized';
        
        notes[noteIndex].title = title;
        notes[noteIndex].content = content;
        notes[noteIndex].category = category;
        notes[noteIndex].updatedAt = new Date().toISOString();
        
        // Update categories if needed
        if (!categories.includes(category)) {
            categories.push(category);
            renderCategories();
        }
        
        renderNotesList();
        saveNotesData();
        updateStatistics();
        updateLastUpdated(notes[noteIndex].updatedAt);
        
        // Show a brief save confirmation
        const originalText = saveNoteBtn.innerHTML;
        saveNoteBtn.innerHTML = '<i class="fas fa-check mr-1"></i>Saved';
        setTimeout(() => {
            saveNoteBtn.innerHTML = originalText;
        }, 1500);
    }
    
    // Delete the current note
    function deleteCurrentNote() {
        if (currentNoteId === null) return;
        
        if (confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
            const noteIndex = notes.findIndex(note => note.id === currentNoteId);
            if (noteIndex === -1) return;
            
            notes.splice(noteIndex, 1);
            currentNoteId = null;
            
            renderNotesList();
            saveNotesData();
            updateStatistics();
            
            // Recalculate categories
            updateCategories();
            
            // Show welcome screen if no notes left
            if (notes.length === 0) {
                showWelcomeScreen();
            } else if (notes.length > 0) {
                // Load the first note
                currentNoteId = notes[0].id;
                loadNoteToEditor(notes[0]);
            }
        }
    }
    
    // Load a note into the editor
    function loadNoteToEditor(note) {
        noteTitleInput.value = note.title;
        noteContentInput.value = note.content;
        noteCategoryInput.value = note.category || 'Uncategorized';
        
        updateWordAndCharCount();
        updateLastUpdated(note.updatedAt);
        
        // Show the editor, hide welcome screen
        welcomeScreen.classList.add('hidden');
        noteEditor.classList.remove('hidden');
        
        // Highlight the selected note in the list
        const noteElements = document.querySelectorAll('.note-item');
        noteElements.forEach(el => {
            if (el.dataset.id === note.id) {
                el.classList.add('bg-indigo-50');
            } else {
                el.classList.remove('bg-indigo-50');
            }
        });
    }
    
    // Show welcome screen
    function showWelcomeScreen() {
        welcomeScreen.classList.remove('hidden');
        noteEditor.classList.add('hidden');
        currentNoteId = null;
    }
    
    // Render the list of notes
    function renderNotesList() {
        notesList.innerHTML = '';
        
        if (notes.length === 0) {
            notesList.innerHTML = `
                <div class="empty-state text-center py-8">
                    <div class="text-4xl text-indigo-200 mb-2"><i class="fas fa-sticky-note"></i></div>
                    <p class="text-gray-500">No notes yet</p>
                    <p class="text-gray-500 text-sm">Click the New Note button to get started</p>
                </div>
            `;
            return;
        }
        
        // Filter notes based on search and category
        let filteredNotes = notes;
        
        // Apply category filter
        if (currentFilter !== 'all') {
            filteredNotes = filteredNotes.filter(note => note.category === currentFilter);
        }
        
        // Apply search filter
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filteredNotes = filteredNotes.filter(note => 
                note.title.toLowerCase().includes(searchTerm) || 
                note.content.toLowerCase().includes(searchTerm) ||
                note.category.toLowerCase().includes(searchTerm)
            );
        }
        
        if (filteredNotes.length === 0) {
            notesList.innerHTML = `
                <div class="text-center py-4">
                    <p class="text-gray-500">No matching notes found</p>
                </div>
            `;
            return;
        }
        
        // Sort notes by updated date (newest first)
        filteredNotes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        
        filteredNotes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.className = `note-item p-3 rounded-md hover:bg-indigo-50 cursor-pointer transition duration-300 ${note.id === currentNoteId ? 'bg-indigo-50' : ''}`;
            noteElement.dataset.id = note.id;
            
            // Format the date
            const updatedDate = new Date(note.updatedAt);
            const formattedDate = updatedDate.toLocaleDateString(undefined, { 
                month: 'short', 
                day: 'numeric', 
                year: updatedDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined 
            });
            
            // Get a preview of the content (first 60 characters)
            const contentPreview = note.content.length > 60 
                ? note.content.substring(0, 60) + '...' 
                : note.content;
            
            noteElement.innerHTML = `
                <div class="flex justify-between items-start">
                    <h4 class="font-medium text-gray-800">${note.title || 'Untitled Note'}</h4>
                    <span class="text-xs text-gray-500">${formattedDate}</span>
                </div>
                <p class="text-sm text-gray-600 mt-1 line-clamp-2">${contentPreview}</p>
                <div class="flex items-center mt-2">
                    <span class="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">${note.category || 'Uncategorized'}</span>
                </div>
            `;
            
            noteElement.addEventListener('click', () => {
                currentNoteId = note.id;
                loadNoteToEditor(note);
            });
            
            notesList.appendChild(noteElement);
        });
    }
    
    // Render categories
    function renderCategories() {
        // Keep the "All Notes" button and clear the rest
        const allNotesBtn = categoriesList.querySelector('[data-category="all"]');
        categoriesList.innerHTML = '';
        categoriesList.appendChild(allNotesBtn);
        
        // Add event listener to "All Notes" button
        allNotesBtn.addEventListener('click', () => {
            currentFilter = 'all';
            updateCategorySelection('all');
            renderNotesList();
        });
        
        // Add each category
        categories.forEach(category => {
            if (category === 'all') return; // Skip 'all' as it's already added
            
            const categoryBtn = document.createElement('button');
            categoryBtn.className = `category-btn w-full text-left px-3 py-1.5 rounded-md hover:bg-indigo-100 transition duration-300 ${currentFilter === category ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-gray-700'}`;
            categoryBtn.dataset.category = category;
            categoryBtn.textContent = category;
            
            categoryBtn.addEventListener('click', () => {
                currentFilter = category;
                updateCategorySelection(category);
                renderNotesList();
            });
            
            categoriesList.appendChild(categoryBtn);
        });
        
        // Update category suggestions
        updateCategorySuggestions();
    }
    
    // Update category selection highlighting
    function updateCategorySelection(selectedCategory) {
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(btn => {
            if (btn.dataset.category === selectedCategory) {
                btn.classList.add('bg-indigo-100', 'text-indigo-700', 'font-medium');
            } else {
                btn.classList.remove('bg-indigo-100', 'text-indigo-700', 'font-medium');
            }
        });
    }
    
    // Update categories based on notes
    function updateCategories() {
        const uniqueCategories = new Set(['Uncategorized']);
        notes.forEach(note => {
            if (note.category) {
                uniqueCategories.add(note.category);
            }
        });
        
        categories = Array.from(uniqueCategories);
        renderCategories();
        saveNotesData();
        updateStatistics();
    }
    
    // Show category suggestions
    function showCategorySuggestions() {
        const input = noteCategoryInput.value.toLowerCase();
        
        if (!input) {
            categorySuggestions.classList.add('hidden');
            return;
        }
        
        const matchingCategories = categories.filter(category => 
            category.toLowerCase().includes(input)
        );
        
        if (matchingCategories.length === 0) {
            categorySuggestions.classList.add('hidden');
            return;
        }
        
        categorySuggestions.innerHTML = '';
        matchingCategories.forEach(category => {
            const suggestion = document.createElement('div');
            suggestion.className = 'px-3 py-2 hover:bg-indigo-50 cursor-pointer';
            suggestion.textContent = category;
            
            suggestion.addEventListener('click', () => {
                noteCategoryInput.value = category;
                categorySuggestions.classList.add('hidden');
            });
            
            categorySuggestions.appendChild(suggestion);
        });
        
        categorySuggestions.classList.remove('hidden');
    }
    
    // Update category suggestions list
    function updateCategorySuggestions() {
        // This will be called when categories change
        if (noteCategoryInput.value) {
            showCategorySuggestions();
        }
    }
    
    // Filter notes based on search input
    function filterNotes() {
        renderNotesList();
    }
    
    // Update word and character count
    function updateWordAndCharCount() {
        const content = noteContentInput.value;
        const charCount = content.length;
        
        // Count words (split by whitespace and filter out empty strings)
        const wordCount = content
            .split(/\s+/)
            .filter(word => word.length > 0)
            .length;
        
        wordCountDisplay.textContent = `${wordCount} word${wordCount !== 1 ? 's' : ''}`;
        charCountDisplay.textContent = `${charCount} character${charCount !== 1 ? 's' : ''}`;
    }
    
    // Update last updated timestamp
    function updateLastUpdated(timestamp) {
        if (!timestamp) {
            lastUpdatedDisplay.textContent = 'Last updated: Never';
            return;
        }
        
        const date = new Date(timestamp);
        const formattedDate = date.toLocaleDateString(undefined, { 
            month: 'short', 
            day: 'numeric', 
            year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
            hour: '2-digit',
            minute: '2-digit'
        });
        
        lastUpdatedDisplay.textContent = `Last updated: ${formattedDate}`;
    }
    
    // Update statistics
    function updateStatistics() {
        totalNotesDisplay.textContent = notes.length;
        totalCategoriesDisplay.textContent = categories.length;
    }
    
    // Generate a unique ID
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
});