document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // DOM Elements
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const resultsArea = document.getElementById('results-area');
    const initialState = document.getElementById('initial-state');
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const wordTitle = document.getElementById('word-title');
    const synonymsList = document.getElementById('synonyms-list');
    const antonymsList = document.getElementById('antonyms-list');
    const relatedList = document.getElementById('related-list');
    const synonymsContainer = document.getElementById('synonyms-container');
    const antonymsContainer = document.getElementById('antonyms-container');
    const relatedContainer = document.getElementById('related-container');
    const recentSearchesContainer = document.getElementById('recent-searches');
    const errorMessage = document.getElementById('error-message');
    
    // Recent searches
    let recentSearches = JSON.parse(localStorage.getItem('thesaurus-recent-searches')) || [];
    
    // Initialize recent searches
    renderRecentSearches();
    
    // Event Listeners
    searchBtn.addEventListener('click', searchWord);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchWord();
        }
    });
    
    // Search for a word
    function searchWord() {
        const word = searchInput.value.trim();
        
        if (!word) return;
        
        // Show loading state
        initialState.classList.add('hidden');
        resultsArea.classList.add('hidden');
        errorState.classList.add('hidden');
        loadingState.classList.remove('hidden');
        
        // Fetch word synonyms and antonyms from API
        fetch(`https://api.datamuse.com/words?rel_syn=${encodeURIComponent(word)}&max=10`)
            .then(response => response.json())
            .then(synonymsData => {
                // Fetch antonyms
                return fetch(`https://api.datamuse.com/words?rel_ant=${encodeURIComponent(word)}&max=10`)
                    .then(response => response.json())
                    .then(antonymsData => {
                        // Fetch related words
                        return fetch(`https://api.datamuse.com/words?ml=${encodeURIComponent(word)}&max=10`)
                            .then(response => response.json())
                            .then(relatedData => {
                                return {
                                    synonyms: synonymsData,
                                    antonyms: antonymsData,
                                    related: relatedData
                                };
                            });
                    });
            })
            .then(data => {
                // Process and display the results
                displayResults(word, data);
                
                // Add to recent searches
                addToRecentSearches(word);
            })
            .catch(error => {
                // Show error state
                loadingState.classList.add('hidden');
                errorState.classList.remove('hidden');
                errorMessage.textContent = `An error occurred while fetching data for "${word}". Please try again later.`;
                console.error('Error fetching thesaurus data:', error);
            });
    }
    
    // Display search results
    function displayResults(word, data) {
        // Hide loading state
        loadingState.classList.add('hidden');
        
        // Show results area
        resultsArea.classList.remove('hidden');
        
        // Set word title
        wordTitle.textContent = word;
        
        // Process synonyms
        if (data.synonyms && data.synonyms.length > 0) {
            synonymsContainer.classList.remove('hidden');
            synonymsList.innerHTML = '';
            
            data.synonyms.forEach(item => {
                const wordTag = createWordTag(item.word, 'indigo');
                synonymsList.appendChild(wordTag);
            });
        } else {
            synonymsContainer.classList.remove('hidden');
            synonymsList.innerHTML = '<span class="text-gray-500">No synonyms found</span>';
        }
        
        // Process antonyms
        if (data.antonyms && data.antonyms.length > 0) {
            antonymsContainer.classList.remove('hidden');
            antonymsList.innerHTML = '';
            
            data.antonyms.forEach(item => {
                const wordTag = createWordTag(item.word, 'violet');
                antonymsList.appendChild(wordTag);
            });
        } else {
            antonymsContainer.classList.remove('hidden');
            antonymsList.innerHTML = '<span class="text-gray-500">No antonyms found</span>';
        }
        
        // Process related words
        if (data.related && data.related.length > 0) {
            relatedContainer.classList.remove('hidden');
            relatedList.innerHTML = '';
            
            data.related.forEach(item => {
                // Filter out exact matches and synonyms to avoid duplication
                if (item.word.toLowerCase() !== word.toLowerCase() && 
                    !data.synonyms.some(syn => syn.word.toLowerCase() === item.word.toLowerCase())) {
                    const wordTag = createWordTag(item.word, 'purple');
                    relatedList.appendChild(wordTag);
                }
            });
            
            // If all related words were filtered out
            if (relatedList.children.length === 0) {
                relatedList.innerHTML = '<span class="text-gray-500">No additional related words found</span>';
            }
        } else {
            relatedContainer.classList.remove('hidden');
            relatedList.innerHTML = '<span class="text-gray-500">No related words found</span>';
        }
        
        // If no results found at all
        if (data.synonyms.length === 0 && data.antonyms.length === 0 && data.related.length === 0) {
            loadingState.classList.add('hidden');
            resultsArea.classList.add('hidden');
            errorState.classList.remove('hidden');
            errorMessage.textContent = `Sorry, we couldn't find any thesaurus data for "${word}". Please try another word.`;
        }
    }
    
    // Create a word tag element
    function createWordTag(word, color) {
        const wordTag = document.createElement('span');
        wordTag.className = `px-3 py-1 bg-${color}-50 text-${color}-700 rounded-full text-sm cursor-pointer hover:bg-${color}-100 transition duration-300`;
        wordTag.textContent = word;
        wordTag.addEventListener('click', () => {
            searchInput.value = word;
            searchWord();
        });
        return wordTag;
    }
    
    // Add to recent searches
    function addToRecentSearches(word) {
        // Remove if already exists
        recentSearches = recentSearches.filter(item => item.toLowerCase() !== word.toLowerCase());
        
        // Add to beginning of array
        recentSearches.unshift(word);
        
        // Keep only the last 5 searches
        if (recentSearches.length > 5) {
            recentSearches = recentSearches.slice(0, 5);
        }
        
        // Save to localStorage
        localStorage.setItem('thesaurus-recent-searches', JSON.stringify(recentSearches));
        
        // Update UI
        renderRecentSearches();
    }
    
    // Render recent searches
    function renderRecentSearches() {
        recentSearchesContainer.innerHTML = '';
        
        if (recentSearches.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'text-gray-500 text-sm';
            emptyMessage.textContent = 'Your recent searches will appear here';
            recentSearchesContainer.appendChild(emptyMessage);
            return;
        }
        
        recentSearches.forEach(word => {
            const searchTag = document.createElement('span');
            searchTag.className = 'px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm cursor-pointer hover:bg-gray-200 transition duration-300';
            searchTag.textContent = word;
            searchTag.addEventListener('click', () => {
                searchInput.value = word;
                searchWord();
            });
            recentSearchesContainer.appendChild(searchTag);
        });
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        
        // Set styles based on type
        let bgColor, borderColor, textColor, icon;
        
        switch (type) {
            case 'success':
                bgColor = 'bg-green-100';
                borderColor = 'border-green-500';
                textColor = 'text-green-700';
                icon = 'fas fa-check-circle';
                break;
            case 'warning':
                bgColor = 'bg-yellow-100';
                borderColor = 'border-yellow-500';
                textColor = 'text-yellow-700';
                icon = 'fas fa-exclamation-circle';
                break;
            case 'error':
                bgColor = 'bg-red-100';
                borderColor = 'border-red-500';
                textColor = 'text-red-700';
                icon = 'fas fa-times-circle';
                break;
            default: // info
                bgColor = 'bg-blue-100';
                borderColor = 'border-blue-500';
                textColor = 'text-blue-700';
                icon = 'fas fa-info-circle';
        }
        
        notification.className = `fixed bottom-4 right-4 ${bgColor} border-l-4 ${borderColor} ${textColor} p-4 rounded shadow-md z-50`;
        notification.innerHTML = `<div class="flex"><div class="py-1"><i class="${icon} mr-2"></i></div><div>${message}</div></div>`;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
});