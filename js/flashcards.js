// Ultimate Student Toolkit - Flashcards

document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // DOM Elements - Deck Management
    const deckList = document.getElementById('deck-list');
    const createDeckBtn = document.getElementById('create-deck-btn');
    const deckModal = document.getElementById('deck-modal');
    const closeDeckModal = document.getElementById('close-deck-modal');
    const deckForm = document.getElementById('deck-form');
    const cancelDeckBtn = document.getElementById('cancel-deck-btn');
    
    // DOM Elements - Flashcard Area
    const flashcardArea = document.getElementById('flashcard-area');
    const backToDecksBtn = document.getElementById('back-to-decks');
    const editDeckBtn = document.getElementById('edit-deck-btn');
    const addCardBtn = document.getElementById('add-card-btn');
    const studyCardsBtn = document.getElementById('study-cards-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    
    // DOM Elements - Study Mode
    const studyMode = document.getElementById('study-mode');
    const cardCounter = document.getElementById('card-counter');
    const flashcardDisplay = document.getElementById('flashcard-display');
    const cardContent = document.getElementById('card-content');
    const cardText = document.getElementById('card-text');
    const prevCardBtn = document.getElementById('prev-card-btn');
    const nextCardBtn = document.getElementById('next-card-btn');
    const flipCardBtn = document.getElementById('flip-card-btn');
    const endStudyBtn = document.getElementById('end-study-btn');
    
    // DOM Elements - Card Modal
    const cardModal = document.getElementById('card-modal');
    const closeCardModal = document.getElementById('close-card-modal');
    const cardForm = document.getElementById('card-form');
    const cancelCardBtn = document.getElementById('cancel-card-btn');
    
    // Flashcard State
    let flashcardDecks = [];
    let currentDeckIndex = -1;
    let currentCardIndex = -1;
    let isShowingFront = true;
    
    // Initialize with local storage data or sample data
    initializeFlashcardData();
    
    // Event Listeners - Deck Management
    createDeckBtn.addEventListener('click', () => {
        document.getElementById('deck-modal-title').textContent = 'Create New Deck';
        deckForm.reset();
        deckModal.classList.remove('hidden');
    });
    
    closeDeckModal.addEventListener('click', () => {
        deckModal.classList.add('hidden');
    });
    
    cancelDeckBtn.addEventListener('click', () => {
        deckModal.classList.add('hidden');
    });
    
    deckForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const deckName = document.getElementById('deck-name').value;
        const deckDescription = document.getElementById('deck-description').value;
        const deckCategory = document.getElementById('deck-category').value;
        
        if (document.getElementById('deck-modal-title').textContent === 'Create New Deck') {
            // Create new deck
            const newDeck = {
                id: Date.now(),
                name: deckName,
                description: deckDescription,
                category: deckCategory,
                cards: [],
                dateCreated: new Date()
            };
            
            flashcardDecks.push(newDeck);
        } else {
            // Edit existing deck
            flashcardDecks[currentDeckIndex].name = deckName;
            flashcardDecks[currentDeckIndex].description = deckDescription;
            flashcardDecks[currentDeckIndex].category = deckCategory;
        }
        
        deckModal.classList.add('hidden');
        renderDeckList();
        saveFlashcardData();
    });
    
    // Event Listeners - Flashcard Area
    backToDecksBtn.addEventListener('click', () => {
        flashcardArea.classList.add('hidden');
        studyMode.classList.add('hidden');
        currentDeckIndex = -1;
    });
    
    editDeckBtn.addEventListener('click', () => {
        document.getElementById('deck-modal-title').textContent = 'Edit Deck';
        document.getElementById('deck-name').value = flashcardDecks[currentDeckIndex].name;
        document.getElementById('deck-description').value = flashcardDecks[currentDeckIndex].description;
        document.getElementById('deck-category').value = flashcardDecks[currentDeckIndex].category;
        deckModal.classList.remove('hidden');
    });
    
    addCardBtn.addEventListener('click', () => {
        document.getElementById('card-modal-title').textContent = 'Add New Flashcard';
        cardForm.reset();
        cardForm.removeAttribute('data-card-id');
        cardModal.classList.remove('hidden');
    });
    
    studyCardsBtn.addEventListener('click', () => {
        if (flashcardDecks[currentDeckIndex].cards.length === 0) {
            alert('This deck has no flashcards. Add some cards first!');
            return;
        }
        
        startStudyMode();
    });
    
    shuffleBtn.addEventListener('click', () => {
        if (flashcardDecks[currentDeckIndex].cards.length === 0) {
            alert('This deck has no flashcards to shuffle. Add some cards first!');
            return;
        }
        
        // Shuffle the cards
        flashcardDecks[currentDeckIndex].cards.sort(() => Math.random() - 0.5);
        renderCardsList();
    });
    
    // Event Listeners - Study Mode
    prevCardBtn.addEventListener('click', () => {
        if (currentCardIndex > 0) {
            currentCardIndex--;
            isShowingFront = true;
            updateCardDisplay();
        }
    });
    
    nextCardBtn.addEventListener('click', () => {
        if (currentCardIndex < flashcardDecks[currentDeckIndex].cards.length - 1) {
            currentCardIndex++;
            isShowingFront = true;
            updateCardDisplay();
        }
    });
    
    flipCardBtn.addEventListener('click', () => {
        isShowingFront = !isShowingFront;
        updateCardDisplay();
    });
    
    endStudyBtn.addEventListener('click', () => {
        studyMode.classList.add('hidden');
    });
    
    // Event Listeners - Card Modal
    closeCardModal.addEventListener('click', () => {
        cardModal.classList.add('hidden');
    });
    
    cancelCardBtn.addEventListener('click', () => {
        cardModal.classList.add('hidden');
    });
    
    cardForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const cardFront = document.getElementById('card-front').value;
        const cardBack = document.getElementById('card-back').value;
        
        if (!cardForm.hasAttribute('data-card-id')) {
            // Add new card
            const newCard = {
                id: Date.now(),
                front: cardFront,
                back: cardBack,
                dateCreated: new Date()
            };
            
            flashcardDecks[currentDeckIndex].cards.push(newCard);
        } else {
            // Edit existing card
            const cardId = parseInt(cardForm.getAttribute('data-card-id'));
            const cardIndex = flashcardDecks[currentDeckIndex].cards.findIndex(card => card.id === cardId);
            
            if (cardIndex !== -1) {
                flashcardDecks[currentDeckIndex].cards[cardIndex].front = cardFront;
                flashcardDecks[currentDeckIndex].cards[cardIndex].back = cardBack;
            }
        }
        
        cardModal.classList.add('hidden');
        renderCardsList();
        saveFlashcardData();
    });
    
    // Initialize flashcard data
    function initializeFlashcardData() {
        const storedDecks = localStorage.getItem('flashcardDecks');
        
        if (storedDecks) {
            flashcardDecks = JSON.parse(storedDecks);
        } else {
            // Sample data for first-time users
            flashcardDecks = [
                {
                    id: 1,
                    name: 'Sample Vocabulary',
                    description: 'Basic vocabulary flashcards',
                    category: 'language',
                    cards: [
                        {
                            id: 101,
                            front: 'Ubiquitous',
                            back: 'Present, appearing, or found everywhere',
                            dateCreated: new Date()
                        },
                        {
                            id: 102,
                            front: 'Ephemeral',
                            back: 'Lasting for a very short time',
                            dateCreated: new Date()
                        },
                        {
                            id: 103,
                            front: 'Pragmatic',
                            back: 'Dealing with things sensibly and realistically',
                            dateCreated: new Date()
                        }
                    ],
                    dateCreated: new Date()
                }
            ];
        }
        
        renderDeckList();
    }
    
    // Save flashcard data to local storage
    function saveFlashcardData() {
        localStorage.setItem('flashcardDecks', JSON.stringify(flashcardDecks));
    }
    
    // Render the list of decks
    function renderDeckList() {
        deckList.innerHTML = '';
        
        if (flashcardDecks.length === 0) {
            deckList.innerHTML = `
                <div class="empty-state text-center py-8 col-span-full">
                    <div class="text-4xl text-amber-200 mb-2"><i class="fas fa-clone"></i></div>
                    <p class="text-gray-500">No flashcard decks yet</p>
                    <p class="text-gray-500 text-sm">Click the Create New Deck button to get started</p>
                </div>
            `;
            return;
        }
        
        flashcardDecks.forEach((deck, index) => {
            const deckElement = document.createElement('div');
            deckElement.className = 'bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden';
            deckElement.innerHTML = `
                <div class="p-5">
                    <div class="flex justify-between items-start">
                        <h4 class="text-lg font-semibold text-gray-800 mb-1">${deck.name}</h4>
                        <div class="dropdown relative">
                            <button class="text-gray-500 hover:text-gray-700 transition duration-300 dropdown-toggle">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <div class="dropdown-menu hidden absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
                                <button class="edit-deck-btn w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-index="${index}">
                                    <i class="fas fa-edit mr-2"></i>Edit
                                </button>
                                <button class="delete-deck-btn w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100" data-index="${index}">
                                    <i class="fas fa-trash-alt mr-2"></i>Delete
                                </button>
                            </div>
                        </div>
                    </div>
                    <p class="text-gray-600 text-sm mb-3">${deck.description || 'No description'}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-xs text-gray-500">
                            <i class="fas fa-clone mr-1"></i>${deck.cards.length} cards
                        </span>
                        <span class="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">${deck.category}</span>
                    </div>
                </div>
                <button class="open-deck-btn w-full py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 transition duration-300" data-index="${index}">
                    <i class="fas fa-book-open mr-2"></i>Open Deck
                </button>
            `;
            
            deckList.appendChild(deckElement);
            
            // Add event listeners for dropdown toggle
            const dropdownToggle = deckElement.querySelector('.dropdown-toggle');
            const dropdownMenu = deckElement.querySelector('.dropdown-menu');
            
            dropdownToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownMenu.classList.toggle('hidden');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                dropdownMenu.classList.add('hidden');
            });
            
            // Edit deck button
            const editDeckButton = deckElement.querySelector('.edit-deck-btn');
            editDeckButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const deckIndex = parseInt(editDeckButton.getAttribute('data-index'));
                currentDeckIndex = deckIndex;
                
                document.getElementById('deck-modal-title').textContent = 'Edit Deck';
                document.getElementById('deck-name').value = flashcardDecks[deckIndex].name;
                document.getElementById('deck-description').value = flashcardDecks[deckIndex].description;
                document.getElementById('deck-category').value = flashcardDecks[deckIndex].category;
                
                deckModal.classList.remove('hidden');
            });
            
            // Delete deck button
            const deleteDeckButton = deckElement.querySelector('.delete-deck-btn');
            deleteDeckButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const deckIndex = parseInt(deleteDeckButton.getAttribute('data-index'));
                
                if (confirm(`Are you sure you want to delete the deck "${flashcardDecks[deckIndex].name}"? This action cannot be undone.`)) {
                    flashcardDecks.splice(deckIndex, 1);
                    renderDeckList();
                    saveFlashcardData();
                }
            });
            
            // Open deck button
            const openDeckButton = deckElement.querySelector('.open-deck-btn');
            openDeckButton.addEventListener('click', () => {
                const deckIndex = parseInt(openDeckButton.getAttribute('data-index'));
                openDeck(deckIndex);
            });
        });
    }
    
    // Open a deck for editing/studying
    function openDeck(deckIndex) {
        currentDeckIndex = deckIndex;
        const deck = flashcardDecks[deckIndex];
        
        // Update deck info
        document.getElementById('flashcard-deck-name').textContent = deck.name;
        document.getElementById('flashcard-deck-description').textContent = deck.description || 'No description';
        
        // Show flashcard area
        flashcardArea.classList.remove('hidden');
        studyMode.classList.add('hidden');
        
        // Render cards list
        renderCardsList();
    }
    
    // Render the list of cards in the current deck
    function renderCardsList() {
        const cardsList = document.getElementById('cards-list');
        cardsList.innerHTML = '';
        
        const deck = flashcardDecks[currentDeckIndex];
        
        if (deck.cards.length === 0) {
            cardsList.innerHTML = `
                <div class="empty-state text-center py-8">
                    <div class="text-4xl text-amber-200 mb-2"><i class="fas fa-clone"></i></div>
                    <p class="text-gray-500">No flashcards in this deck yet</p>
                    <p class="text-gray-500 text-sm">Click the Add Card button to create your first flashcard</p>
                </div>
            `;
            return;
        }
        
        deck.cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden';
            cardElement.innerHTML = `
                <div class="p-5">
                    <div class="flex justify-between items-start mb-3">
                        <h4 class="text-lg font-semibold text-gray-800">Card ${index + 1}</h4>
                        <div class="flex space-x-2">
                            <button class="edit-card-btn text-gray-500 hover:text-gray-700 transition duration-300" data-id="${card.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="delete-card-btn text-gray-500 hover:text-red-600 transition duration-300" data-id="${card.id}">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="bg-amber-50 p-3 rounded-md">
                            <div class="text-xs text-amber-600 mb-1">Front</div>
                            <p class="text-gray-800">${card.front}</p>
                        </div>
                        <div class="bg-orange-50 p-3 rounded-md">
                            <div class="text-xs text-orange-600 mb-1">Back</div>
                            <p class="text-gray-800">${card.back}</p>
                        </div>
                    </div>
                </div>
            `;
            
            cardsList.appendChild(cardElement);
            
            // Edit card button
            const editCardButton = cardElement.querySelector('.edit-card-btn');
            editCardButton.addEventListener('click', () => {
                const cardId = parseInt(editCardButton.getAttribute('data-id'));
                const cardObj = deck.cards.find(c => c.id === cardId);
                
                if (cardObj) {
                    document.getElementById('card-modal-title').textContent = 'Edit Flashcard';
                    document.getElementById('card-front').value = cardObj.front;
                    document.getElementById('card-back').value = cardObj.back;
                    cardForm.setAttribute('data-card-id', cardId);
                    cardModal.classList.remove('hidden');
                }
            });
            
            // Delete card button
            const deleteCardButton = cardElement.querySelector('.delete-card-btn');
            deleteCardButton.addEventListener('click', () => {
                const cardId = parseInt(deleteCardButton.getAttribute('data-id'));
                
                if (confirm('Are you sure you want to delete this flashcard? This action cannot be undone.')) {
                    const cardIndex = deck.cards.findIndex(c => c.id === cardId);
                    if (cardIndex !== -1) {
                        deck.cards.splice(cardIndex, 1);
                        renderCardsList();
                        saveFlashcardData();
                    }
                }
            });
        });
    }
    
    // Start study mode
    function startStudyMode() {
        currentCardIndex = 0;
        isShowingFront = true;
        studyMode.classList.remove('hidden');
        updateCardDisplay();
    }
    
    // Update the flashcard display in study mode
    function updateCardDisplay() {
        const deck = flashcardDecks[currentDeckIndex];
        const card = deck.cards[currentCardIndex];
        
        // Update card counter
        cardCounter.textContent = `Card ${currentCardIndex + 1} of ${deck.cards.length}`;
        
        // Update card content
        if (isShowingFront) {
            cardText.textContent = card.front;
            flashcardDisplay.classList.remove('bg-orange-50');
            flashcardDisplay.classList.add('bg-white');
        } else {
            cardText.textContent = card.back;
            flashcardDisplay.classList.remove('bg-white');
            flashcardDisplay.classList.add('bg-orange-50');
        }
        
        // Update button states
        prevCardBtn.disabled = currentCardIndex === 0;
        prevCardBtn.classList.toggle('opacity-50', currentCardIndex === 0);
        nextCardBtn.disabled = currentCardIndex === deck.cards.length - 1;
        nextCardBtn.classList.toggle('opacity-50', currentCardIndex === deck.cards.length - 1);
    }
});