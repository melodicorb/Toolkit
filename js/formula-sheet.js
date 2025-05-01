// Ultimate Student Toolkit - Formula Sheet

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const formulaSearch = document.getElementById('formula-search');
    const formulaCategories = document.getElementById('formula-categories');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const currentCategoryTitle = document.getElementById('current-category-title');
    const formulaContainer = document.getElementById('formula-container');
    const favoritesList = document.getElementById('favorites-list');
    const clearFavoritesBtn = document.getElementById('clear-favorites');
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // App State
    let currentCategory = 'all';
    let favorites = JSON.parse(localStorage.getItem('formulaSheetFavorites')) || [];
    
    // Formula Database
    const formulas = [
        // Algebra
        {
            id: 'quadratic',
            name: 'Quadratic Formula',
            latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
            description: 'Solves the quadratic equation ax² + bx + c = 0',
            category: 'algebra',
            variables: [
                { symbol: 'a', description: 'Coefficient of x²' },
                { symbol: 'b', description: 'Coefficient of x' },
                { symbol: 'c', description: 'Constant term' }
            ]
        },
        {
            id: 'binomial-expansion',
            name: 'Binomial Theorem',
            latex: '(x + y)^n = \\sum_{k=0}^{n} \\binom{n}{k} x^{n-k} y^k',
            description: 'Expands the power of a binomial expression',
            category: 'algebra',
            variables: [
                { symbol: 'n', description: 'Power of the binomial' },
                { symbol: 'k', description: 'Index of summation' },
                { symbol: '\\binom{n}{k}', description: 'Binomial coefficient' }
            ]
        },
        
        // Calculus
        {
            id: 'derivative',
            name: 'Derivative Definition',
            latex: 'f\'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}',
            description: 'The definition of the derivative of a function',
            category: 'calculus',
            variables: [
                { symbol: 'f(x)', description: 'Original function' },
                { symbol: 'f\'(x)', description: 'Derivative of function' },
                { symbol: 'h', description: 'Change in x approaching zero' }
            ]
        },
        {
            id: 'integral',
            name: 'Definite Integral',
            latex: '\\int_{a}^{b} f(x) \\, dx = F(b) - F(a)',
            description: 'The definite integral of a function from a to b',
            category: 'calculus',
            variables: [
                { symbol: 'f(x)', description: 'Function to integrate' },
                { symbol: 'F(x)', description: 'Antiderivative of f(x)' },
                { symbol: 'a, b', description: 'Lower and upper bounds' }
            ]
        },
        {
            id: 'chain-rule',
            name: 'Chain Rule',
            latex: '\\frac{d}{dx}[f(g(x))] = f\'(g(x)) \\cdot g\'(x)',
            description: 'Rule for differentiating composite functions',
            category: 'calculus',
            variables: [
                { symbol: 'f(g(x))', description: 'Composite function' },
                { symbol: 'f\'(g(x))', description: 'Derivative of outer function' },
                { symbol: 'g\'(x)', description: 'Derivative of inner function' }
            ]
        },
        
        // Geometry & Trigonometry
        {
            id: 'pythagorean',
            name: 'Pythagorean Theorem',
            latex: 'a^2 + b^2 = c^2',
            description: 'Relates the sides of a right triangle',
            category: 'geometry',
            variables: [
                { symbol: 'a, b', description: 'Lengths of the legs' },
                { symbol: 'c', description: 'Length of the hypotenuse' }
            ]
        },
        {
            id: 'circle-area',
            name: 'Circle Area',
            latex: 'A = \\pi r^2',
            description: 'Area of a circle with radius r',
            category: 'geometry',
            variables: [
                { symbol: 'A', description: 'Area of the circle' },
                { symbol: 'r', description: 'Radius of the circle' },
                { symbol: '\\pi', description: 'Pi (approximately 3.14159)' }
            ]
        },
        {
            id: 'sin-law',
            name: 'Law of Sines',
            latex: '\\frac{\\sin A}{a} = \\frac{\\sin B}{b} = \\frac{\\sin C}{c}',
            description: 'Relates sides and angles in any triangle',
            category: 'geometry',
            variables: [
                { symbol: 'a, b, c', description: 'Lengths of the sides' },
                { symbol: 'A, B, C', description: 'Angles opposite to sides a, b, c' }
            ]
        },
        {
            id: 'cos-law',
            name: 'Law of Cosines',
            latex: 'c^2 = a^2 + b^2 - 2ab\\cos C',
            description: 'Generalizes the Pythagorean theorem to any triangle',
            category: 'geometry',
            variables: [
                { symbol: 'a, b, c', description: 'Lengths of the sides' },
                { symbol: 'C', description: 'Angle opposite to side c' }
            ]
        },
        
        // Physics
        {
            id: 'newton-second',
            name: 'Newton\'s Second Law',
            latex: 'F = ma',
            description: 'Force equals mass times acceleration',
            category: 'physics',
            variables: [
                { symbol: 'F', description: 'Force (in Newtons)' },
                { symbol: 'm', description: 'Mass (in kilograms)' },
                { symbol: 'a', description: 'Acceleration (in m/s²)' }
            ]
        },
        {
            id: 'kinetic-energy',
            name: 'Kinetic Energy',
            latex: 'E_k = \\frac{1}{2}mv^2',
            description: 'Energy of an object due to its motion',
            category: 'physics',
            variables: [
                { symbol: 'E_k', description: 'Kinetic energy (in Joules)' },
                { symbol: 'm', description: 'Mass (in kilograms)' },
                { symbol: 'v', description: 'Velocity (in m/s)' }
            ]
        },
        {
            id: 'gravitational-potential',
            name: 'Gravitational Potential Energy',
            latex: 'E_p = mgh',
            description: 'Energy due to position in a gravitational field',
            category: 'physics',
            variables: [
                { symbol: 'E_p', description: 'Potential energy (in Joules)' },
                { symbol: 'm', description: 'Mass (in kilograms)' },
                { symbol: 'g', description: 'Gravitational acceleration (9.8 m/s²)' },
                { symbol: 'h', description: 'Height (in meters)' }
            ]
        },
        {
            id: 'special-relativity',
            name: 'Mass-Energy Equivalence',
            latex: 'E = mc^2',
            description: 'Einstein\'s famous equation relating mass and energy',
            category: 'physics',
            variables: [
                { symbol: 'E', description: 'Energy (in Joules)' },
                { symbol: 'm', description: 'Mass (in kilograms)' },
                { symbol: 'c', description: 'Speed of light (3×10⁸ m/s)' }
            ]
        },
        
        // Chemistry
        {
            id: 'ideal-gas',
            name: 'Ideal Gas Law',
            latex: 'PV = nRT',
            description: 'Relates pressure, volume, amount, and temperature of a gas',
            category: 'chemistry',
            variables: [
                { symbol: 'P', description: 'Pressure' },
                { symbol: 'V', description: 'Volume' },
                { symbol: 'n', description: 'Number of moles' },
                { symbol: 'R', description: 'Gas constant' },
                { symbol: 'T', description: 'Temperature (in Kelvin)' }
            ]
        },
        {
            id: 'ph-equation',
            name: 'pH Definition',
            latex: 'pH = -\\log_{10}[H^+]',
            description: 'Measures the acidity or basicity of a solution',
            category: 'chemistry',
            variables: [
                { symbol: 'pH', description: 'Potential of hydrogen' },
                { symbol: '[H^+]', description: 'Hydrogen ion concentration (in mol/L)' }
            ]
        },
        {
            id: 'gibbs-free-energy',
            name: 'Gibbs Free Energy',
            latex: '\\Delta G = \\Delta H - T\\Delta S',
            description: 'Determines the spontaneity of a chemical reaction',
            category: 'chemistry',
            variables: [
                { symbol: '\\Delta G', description: 'Change in Gibbs free energy' },
                { symbol: '\\Delta H', description: 'Change in enthalpy' },
                { symbol: 'T', description: 'Temperature (in Kelvin)' },
                { symbol: '\\Delta S', description: 'Change in entropy' }
            ]
        },
        
        // Statistics & Probability
        {
            id: 'standard-deviation',
            name: 'Standard Deviation',
            latex: '\\sigma = \\sqrt{\\frac{1}{N}\\sum_{i=1}^{N}(x_i - \\mu)^2}',
            description: 'Measures the amount of variation in a dataset',
            category: 'statistics',
            variables: [
                { symbol: '\\sigma', description: 'Standard deviation' },
                { symbol: 'N', description: 'Number of data points' },
                { symbol: 'x_i', description: 'Each data point' },
                { symbol: '\\mu', description: 'Mean of the dataset' }
            ]
        },
        {
            id: 'normal-distribution',
            name: 'Normal Distribution',
            latex: 'f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-\\frac{1}{2}(\\frac{x-\\mu}{\\sigma})^2}',
            description: 'Probability density function of the normal distribution',
            category: 'statistics',
            variables: [
                { symbol: 'f(x)', description: 'Probability density function' },
                { symbol: '\\mu', description: 'Mean of the distribution' },
                { symbol: '\\sigma', description: 'Standard deviation' },
                { symbol: 'e', description: 'Euler\'s number (≈ 2.71828)' }
            ]
        },
        {
            id: 'bayes-theorem',
            name: 'Bayes\' Theorem',
            latex: 'P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}',
            description: 'Calculates conditional probability',
            category: 'statistics',
            variables: [
                { symbol: 'P(A|B)', description: 'Probability of A given B' },
                { symbol: 'P(B|A)', description: 'Probability of B given A' },
                { symbol: 'P(A)', description: 'Prior probability of A' },
                { symbol: 'P(B)', description: 'Prior probability of B' }
            ]
        }
    ];
    
    // Initialize
    function init() {
        // Set up event listeners
        formulaSearch.addEventListener('input', filterFormulas);
        clearFavoritesBtn.addEventListener('click', clearFavorites);
        
        // Set up category buttons
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active category
                categoryButtons.forEach(btn => {
                    btn.classList.remove('bg-gradient-to-r', 'from-indigo-500', 'to-blue-600', 'text-white');
                    btn.classList.add('hover:bg-gray-100');
                });
                
                button.classList.remove('hover:bg-gray-100');
                button.classList.add('bg-gradient-to-r', 'from-indigo-500', 'to-blue-600', 'text-white');
                
                // Update current category
                currentCategory = button.dataset.category;
                currentCategoryTitle.textContent = button.textContent.trim();
                
                // Display formulas for the selected category
                displayFormulas();
            });
        });
        
        // Display all formulas initially
        displayFormulas();
        
        // Display favorites
        displayFavorites();
    }
    
    // Display formulas based on current category and search
    function displayFormulas() {
        // Clear the container
        formulaContainer.innerHTML = '';
        
        // Filter formulas by category and search term
        const searchTerm = formulaSearch.value.toLowerCase();
        const filteredFormulas = formulas.filter(formula => {
            const matchesCategory = currentCategory === 'all' || formula.category === currentCategory;
            const matchesSearch = formula.name.toLowerCase().includes(searchTerm) || 
                                 formula.description.toLowerCase().includes(searchTerm);
            return matchesCategory && matchesSearch;
        });
        
        // Display message if no formulas found
        if (filteredFormulas.length === 0) {
            formulaContainer.innerHTML = `
                <div class="text-center py-8">
                    <div class="text-gray-400 text-5xl mb-4">
                        <i class="fas fa-search"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-700 mb-2">No formulas found</h3>
                    <p class="text-gray-500">Try a different search term or category</p>
                </div>
            `;
            return;
        }
        
        // Create and append formula cards
        filteredFormulas.forEach(formula => {
            const isFavorite = favorites.includes(formula.id);
            const formulaCard = createFormulaCard(formula, isFavorite);
            formulaContainer.appendChild(formulaCard);
        });
        
        // Trigger MathJax to render the formulas
        if (window.MathJax) {
            MathJax.typesetPromise();
        }
    }
    
    // Create a formula card element
    function createFormulaCard(formula, isFavorite) {
        const card = document.createElement('div');
        card.className = 'bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md';
        card.id = `formula-${formula.id}`;
        
        const favoriteIconClass = isFavorite ? 'fas text-yellow-500' : 'far text-gray-400';
        
        card.innerHTML = `
            <div class="p-5">
                <div class="flex justify-between items-start mb-3">
                    <h3 class="text-xl font-semibold text-gray-800">${formula.name}</h3>
                    <button class="favorite-btn p-2 rounded-full hover:bg-gray-100 transition duration-300" data-id="${formula.id}">
                        <i class="${favoriteIconClass} fa-star"></i>
                    </button>
                </div>
                <div class="formula-display bg-gray-50 p-4 rounded-lg mb-3 overflow-x-auto">
                    <div class="text-center">\\[${formula.latex}\\]</div>
                </div>
                <p class="text-gray-600 mb-3">${formula.description}</p>
                <div class="mt-4">
                    <h4 class="text-sm font-semibold text-gray-700 mb-2">Variables:</h4>
                    <ul class="text-sm text-gray-600 space-y-1">
                        ${formula.variables.map(v => `<li><span class="font-medium">${v.symbol}</span>: ${v.description}</li>`).join('')}
                    </ul>
                </div>
                <div class="mt-3 text-xs text-gray-500 flex items-center">
                    <span class="px-2 py-1 bg-gray-100 rounded-full">${formula.category}</span>
                </div>
            </div>
        `;
        
        // Add event listener to favorite button
        const favoriteBtn = card.querySelector('.favorite-btn');
        favoriteBtn.addEventListener('click', () => {
            toggleFavorite(formula.id);
        });
        
        return card;
    }
    
    // Filter formulas based on search input
    function filterFormulas() {
        displayFormulas();
    }
    
    // Toggle favorite status of a formula
    function toggleFavorite(formulaId) {
        const index = favorites.indexOf(formulaId);
        
        if (index === -1) {
            // Add to favorites
            favorites.push(formulaId);
            const formulaCard = document.getElementById(`formula-${formulaId}`);
            if (formulaCard) {
                const starIcon = formulaCard.querySelector('.favorite-btn i');
                starIcon.className = 'fas fa-star text-yellow-500';
            }
        } else {
            // Remove from favorites
            favorites.splice(index, 1);
            const formulaCard = document.getElementById(`formula-${formulaId}`);
            if (formulaCard) {
                const starIcon = formulaCard.querySelector('.favorite-btn i');
                starIcon.className = 'far fa-star text-gray-400';
            }
        }
        
        // Save to localStorage
        localStorage.setItem('formulaSheetFavorites', JSON.stringify(favorites));
        
        // Update favorites display
        displayFavorites();
    }
    
    // Display favorite formulas
    function displayFavorites() {
        // Clear the favorites list
        favoritesList.innerHTML = '';
        
        // Display message if no favorites
        if (favorites.length === 0) {
            favoritesList.innerHTML = '<div class="text-center text-gray-500 py-2">No favorites yet</div>';
            return;
        }
        
        // Create and append favorite items
        favorites.forEach(favoriteId => {
            const formula = formulas.find(f => f.id === favoriteId);
            if (formula) {
                const favoriteItem = document.createElement('div');
                favoriteItem.className = 'p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition duration-300';
                favoriteItem.innerHTML = `
                    <div class="flex justify-between items-center">
                        <span class="font-medium text-gray-800">${formula.name}</span>
                        <button class="remove-favorite-btn text-gray-400 hover:text-red-500 transition duration-300" data-id="${formula.id}">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <p class="text-xs text-gray-500">${formula.category}</p>
                `;
                
                // Add event listener to remove button
                const removeBtn = favoriteItem.querySelector('.remove-favorite-btn');
                removeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleFavorite(formula.id);
                });
                
                // Add event listener to favorite item to scroll to formula
                favoriteItem.addEventListener('click', () => {
                    // Find the formula card
                    const formulaCard = document.getElementById(`formula-${formula.id}`);
                    if (formulaCard) {
                        // If formula is not in current category, switch to 'all'
                        if (currentCategory !== 'all' && formula.category !== currentCategory) {
                            const allCategoryBtn = document.querySelector('[data-category="all"]');
                            allCategoryBtn.click();
                        }
                        
                        // Scroll to the formula card
                        formulaCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        
                        // Highlight the card briefly
                        formulaCard.classList.add('ring-2', 'ring-indigo-500');
                        setTimeout(() => {
                            formulaCard.classList.remove('ring-2', 'ring-indigo-500');
                        }, 1500);
                    }
                });
                
                favoritesList.appendChild(favoriteItem);
            }
        });
    }
    
    // Clear all favorites
    function clearFavorites() {
        if (confirm('Are you sure you want to clear all favorites?')) {
            favorites = [];
            localStorage.setItem('formulaSheetFavorites', JSON.stringify(favorites));
            displayFavorites();
            displayFormulas(); // Update the main display to reflect favorite status
        }
    }
    
    // Initialize the app
    init();
});