// Ultimate Student Toolkit - Idea Generator

document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // DOM Elements
    const academicBtn = document.getElementById('academic-btn');
    const essayBtn = document.getElementById('essay-btn');
    const creativeBtn = document.getElementById('creative-btn');
    const subcategoryContainer = document.getElementById('subcategory-container');
    const subcategoryOptions = document.getElementById('subcategory-options');
    const optionsPanel = document.getElementById('options-panel');
    const generateContainer = document.getElementById('generate-container');
    const generateBtn = document.getElementById('generate-btn');
    const resultsContainer = document.getElementById('results-container');
    const ideasList = document.getElementById('ideas-list');
    const regenerateBtn = document.getElementById('regenerate-btn');
    const saveIdeasBtn = document.getElementById('save-ideas-btn');
    const copyIdeasBtn = document.getElementById('copy-ideas-btn');
    const newIdeasBtn = document.getElementById('new-ideas-btn');
    const initialInstructions = document.getElementById('initial-instructions');
    const ideaCount = document.getElementById('idea-count');
    const complexity = document.getElementById('complexity');
    
    // State variables
    let currentCategory = null;
    let currentSubcategory = null;
    let generatedIdeas = [];
    
    // Category data
    const categories = {
        academic: {
            name: 'Academic Projects',
            icon: 'graduation-cap',
            color: 'fuchsia',
            subcategories: [
                { id: 'science', name: 'Science' },
                { id: 'history', name: 'History' },
                { id: 'literature', name: 'Literature' },
                { id: 'mathematics', name: 'Mathematics' },
                { id: 'psychology', name: 'Psychology' },
                { id: 'sociology', name: 'Sociology' },
                { id: 'economics', name: 'Economics' },
                { id: 'computer-science', name: 'Computer Science' }
            ]
        },
        essay: {
            name: 'Essay Topics',
            icon: 'pen-fancy',
            color: 'purple',
            subcategories: [
                { id: 'argumentative', name: 'Argumentative' },
                { id: 'persuasive', name: 'Persuasive' },
                { id: 'narrative', name: 'Narrative' },
                { id: 'descriptive', name: 'Descriptive' },
                { id: 'expository', name: 'Expository' },
                { id: 'compare-contrast', name: 'Compare & Contrast' },
                { id: 'cause-effect', name: 'Cause & Effect' },
                { id: 'research', name: 'Research Paper' }
            ]
        },
        creative: {
            name: 'Creative Writing',
            icon: 'lightbulb',
            color: 'indigo',
            subcategories: [
                { id: 'short-story', name: 'Short Story' },
                { id: 'poetry', name: 'Poetry' },
                { id: 'screenplay', name: 'Screenplay' },
                { id: 'novel', name: 'Novel Concept' },
                { id: 'character', name: 'Character Development' },
                { id: 'setting', name: 'Setting Creation' },
                { id: 'dialogue', name: 'Dialogue Exercise' },
                { id: 'plot-twist', name: 'Plot Twist' }
            ]
        }
    };
    
    // Event Listeners for Category Buttons
    academicBtn.addEventListener('click', () => selectCategory('academic'));
    essayBtn.addEventListener('click', () => selectCategory('essay'));
    creativeBtn.addEventListener('click', () => selectCategory('creative'));
    
    // Event Listener for Generate Button
    generateBtn.addEventListener('click', generateIdeas);
    
    // Event Listeners for Result Actions
    regenerateBtn.addEventListener('click', generateIdeas);
    saveIdeasBtn.addEventListener('click', saveIdeasAsText);
    copyIdeasBtn.addEventListener('click', copyIdeasToClipboard);
    newIdeasBtn.addEventListener('click', resetGenerator);
    
    // Function to select a category
    function selectCategory(category) {
        // Reset any previous selections
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('border-fuchsia-500', 'border-purple-500', 'border-indigo-500');
            btn.classList.remove('bg-fuchsia-50', 'bg-purple-50', 'bg-indigo-50');
            btn.classList.add('border-fuchsia-200', 'border-purple-200', 'border-indigo-200');
        });
        
        // Highlight selected category
        const categoryData = categories[category];
        const btn = document.getElementById(`${category}-btn`);
        btn.classList.remove(`border-${categoryData.color}-200`);
        btn.classList.add(`border-${categoryData.color}-500`, `bg-${categoryData.color}-50`);
        
        // Update state
        currentCategory = category;
        currentSubcategory = null;
        
        // Show subcategories
        showSubcategories(category);
        
        // Hide results if visible
        resultsContainer.classList.add('hidden');
        
        // Hide initial instructions
        initialInstructions.classList.add('hidden');
    }
    
    // Function to display subcategories
    function showSubcategories(category) {
        // Clear previous subcategories
        subcategoryOptions.innerHTML = '';
        
        // Get subcategories for selected category
        const subcategories = categories[category].subcategories;
        
        // Create subcategory buttons
        subcategories.forEach(sub => {
            const button = document.createElement('button');
            button.className = `subcategory-btn p-2 rounded-lg border border-gray-200 hover:border-${categories[category].color}-400 hover:bg-${categories[category].color}-50 transition duration-300`;
            button.textContent = sub.name;
            button.dataset.id = sub.id;
            
            // Add click event
            button.addEventListener('click', () => selectSubcategory(sub.id));
            
            subcategoryOptions.appendChild(button);
        });
        
        // Show subcategory container
        subcategoryContainer.classList.remove('hidden');
        
        // Hide options panel and generate button until subcategory is selected
        optionsPanel.classList.add('hidden');
        generateContainer.classList.add('hidden');
    }
    
    // Function to select a subcategory
    function selectSubcategory(subcategoryId) {
        // Reset previous selection
        document.querySelectorAll('.subcategory-btn').forEach(btn => {
            btn.classList.remove(`border-${categories[currentCategory].color}-400`, `bg-${categories[currentCategory].color}-50`);
            btn.classList.add('border-gray-200');
        });
        
        // Highlight selected subcategory
        const selectedBtn = document.querySelector(`.subcategory-btn[data-id="${subcategoryId}"]`);
        selectedBtn.classList.remove('border-gray-200');
        selectedBtn.classList.add(`border-${categories[currentCategory].color}-400`, `bg-${categories[currentCategory].color}-50`);
        
        // Update state
        currentSubcategory = subcategoryId;
        
        // Show options panel and generate button
        optionsPanel.classList.remove('hidden');
        generateContainer.classList.remove('hidden');
    }
    
    // Function to generate ideas
    function generateIdeas() {
        if (!currentCategory || !currentSubcategory) return;
        
        // Get idea bank for selected category and subcategory
        const ideas = getIdeasForSubcategory(currentCategory, currentSubcategory);
        
        // Get number of ideas to generate
        const count = parseInt(ideaCount.value);
        
        // Get complexity level
        const complexityLevel = complexity.value;
        
        // Generate random ideas
        generatedIdeas = getRandomIdeas(ideas, count);
        
        // Enhance ideas based on complexity
        if (complexityLevel !== 'basic') {
            generatedIdeas = enhanceIdeas(generatedIdeas, complexityLevel);
        }
        
        // Display ideas
        displayIdeas(generatedIdeas);
        
        // Show results container
        resultsContainer.classList.remove('hidden');
        
        // Scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Function to get ideas for a specific subcategory
    function getIdeasForSubcategory(category, subcategoryId) {
        // Create a default set of ideas in case the specific category/subcategory isn't found
        const defaultIdeas = [
            "Explore the impact of technology on modern education",
            "Analyze the effects of social media on interpersonal relationships",
            "Investigate sustainable solutions for urban development",
            "Research the influence of art on social movements",
            "Study the psychological effects of nature exposure on mental health"
        ];
        
        // Try to get ideas from the idea banks
        try {
            const categoryBank = ideaBanks[category];
            if (categoryBank && categoryBank[subcategoryId] && categoryBank[subcategoryId].length > 0) {
                return categoryBank[subcategoryId];
            }
            return defaultIdeas;
        } catch (error) {
            console.error('Error getting ideas:', error);
            return defaultIdeas;
        }
    }
    
    // Function to get random ideas from an array
    function getRandomIdeas(ideasArray, count) {
        // Make a copy of the array to avoid modifying the original
        const ideas = [...ideasArray];
        const result = [];
        
        // If we need more ideas than available, just return all available ideas
        if (count >= ideas.length) {
            return ideas;
        }
        
        // Get random ideas
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * ideas.length);
            result.push(ideas[randomIndex]);
            ideas.splice(randomIndex, 1); // Remove selected idea to avoid duplicates
        }
        
        return result;
    }
    
    // Function to enhance ideas based on complexity
    function enhanceIdeas(ideas, complexityLevel) {
        return ideas.map(idea => {
            // For intermediate complexity, add a suggestion
            if (complexityLevel === 'intermediate') {
                const suggestions = [
                    "Consider exploring different perspectives on this topic.",
                    "You might want to include real-world examples in your approach.",
                    "Think about the ethical implications of this idea.",
                    "Consider how this could be applied in different contexts.",
                    "Research recent developments related to this topic."
                ];
                const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
                return `${idea} — ${randomSuggestion}`;
            }
            // For advanced complexity, add a suggestion and a question
            else if (complexityLevel === 'advanced') {
                const suggestions = [
                    "Consider exploring different perspectives on this topic.",
                    "You might want to include real-world examples in your approach.",
                    "Think about the ethical implications of this idea.",
                    "Consider how this could be applied in different contexts.",
                    "Research recent developments related to this topic."
                ];
                const questions = [
                    "How might this change in the next decade?",
                    "What are the potential counterarguments?",
                    "How does this relate to broader societal trends?",
                    "What interdisciplinary approaches could enhance this idea?",
                    "What are the underlying assumptions that should be examined?"
                ];
                const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
                const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
                return `${idea} — ${randomSuggestion} ${randomQuestion}`;
            }
            return idea;
        });
    }
    
    // Function to display generated ideas
    function displayIdeas(ideas) {
        // Clear previous ideas
        ideasList.innerHTML = '';
        
        // Create idea elements
        ideas.forEach((idea, index) => {
            const ideaElement = document.createElement('div');
            ideaElement.className = 'p-4 bg-white rounded-lg shadow-sm border border-gray-200';
            
            const ideaNumber = document.createElement('div');
            ideaNumber.className = 'w-8 h-8 rounded-full bg-fuchsia-100 flex items-center justify-center mb-2';
            ideaNumber.innerHTML = `<span class="font-bold text-fuchsia-600">${index + 1}</span>`;
            
            const ideaText = document.createElement('p');
            ideaText.className = 'text-gray-800';
            ideaText.textContent = idea;
            
            ideaElement.appendChild(ideaNumber);
            ideaElement.appendChild(ideaText);
            ideasList.appendChild(ideaElement);
        });
    }
    
    // Function to save ideas as text file
    function saveIdeasAsText() {
        if (generatedIdeas.length === 0) return;
        
        // Create text content
        const categoryName = categories[currentCategory].name;
        const subcategoryName = categories[currentCategory].subcategories.find(sub => sub.id === currentSubcategory).name;
        
        let textContent = `${categoryName} - ${subcategoryName} Ideas\n\n`;
        generatedIdeas.forEach((idea, index) => {
            textContent += `${index + 1}. ${idea}\n`;
        });
        textContent += `\nGenerated with Ultimate Student Toolkit - ${new Date().toLocaleDateString()}`;
        
        // Create blob and download link
        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${categoryName}-${subcategoryName}-Ideas.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    
    // Function to copy ideas to clipboard
    function copyIdeasToClipboard() {
        if (generatedIdeas.length === 0) return;
        
        // Create text content
        const categoryName = categories[currentCategory].name;
        const subcategoryName = categories[currentCategory].subcategories.find(sub => sub.id === currentSubcategory).name;
        
        let textContent = `${categoryName} - ${subcategoryName} Ideas\n\n`;
        generatedIdeas.forEach((idea, index) => {
            textContent += `${index + 1}. ${idea}\n`;
        });
        
        // Copy to clipboard
        navigator.clipboard.writeText(textContent)
            .then(() => {
                // Show success message
                const copyBtn = document.getElementById('copy-ideas-btn');
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Copied!';
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    }
    
    // Function to reset the generator
    function resetGenerator() {
        // Clear state
        currentCategory = null;
        currentSubcategory = null;
        generatedIdeas = [];
        
        // Reset UI
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('border-fuchsia-500', 'border-purple-500', 'border-indigo-500');
            btn.classList.remove('bg-fuchsia-50', 'bg-purple-50', 'bg-indigo-50');
            btn.classList.add('border-fuchsia-200', 'border-purple-200', 'border-indigo-200');
        });
        
        // Hide subcategories, options, and results
        subcategoryContainer.classList.add('hidden');
        optionsPanel.classList.add('hidden');
        generateContainer.classList.add('hidden');
        resultsContainer.classList.add('hidden');
        
        // Show initial instructions
        initialInstructions.classList.remove('hidden');
        
        // Reset form values
        ideaCount.value = '5';
        complexity.value = 'intermediate';
    }
});