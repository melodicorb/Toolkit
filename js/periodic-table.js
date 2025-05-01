// Ultimate Student Toolkit - Periodic Table

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const elementSearch = document.getElementById('element-search');
    const elementCategories = document.getElementById('element-categories');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const propertySelector = document.getElementById('property-selector');
    const periodicTableContainer = document.getElementById('periodic-table-container');
    const elementDetails = document.getElementById('element-details');
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // App State
    let currentCategory = 'all';
    let currentProperty = 'atomic-number';
    let selectedElement = null;
    
    // Element Database
    const elements = [
        // Row 1
        {
            symbol: 'H',
            name: 'Hydrogen',
            atomicNumber: 1,
            atomicMass: 1.008,
            category: 'nonmetals',
            electronegativity: 2.20,
            electronConfig: '1s¹',
            meltingPoint: -259.16,
            boilingPoint: -252.87,
            position: { row: 1, col: 1 },
            description: 'Hydrogen is the lightest element and the most abundant chemical substance in the universe, constituting roughly 75% of all normal matter.'
        },
        {
            symbol: 'He',
            name: 'Helium',
            atomicNumber: 2,
            atomicMass: 4.0026,
            category: 'noble-gases',
            electronegativity: null,
            electronConfig: '1s²',
            meltingPoint: -272.2,
            boilingPoint: -268.9,
            position: { row: 1, col: 18 },
            description: 'Helium is a colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas group in the periodic table.'
        },
        
        // Row 2
        {
            symbol: 'Li',
            name: 'Lithium',
            atomicNumber: 3,
            atomicMass: 6.94,
            category: 'alkali-metals',
            electronegativity: 0.98,
            electronConfig: '[He] 2s¹',
            meltingPoint: 180.54,
            boilingPoint: 1342,
            position: { row: 2, col: 1 },
            description: 'Lithium is a soft, silvery-white alkali metal. Under standard conditions, it is the lightest metal and the lightest solid element.'
        },
        {
            symbol: 'Be',
            name: 'Beryllium',
            atomicNumber: 4,
            atomicMass: 9.0122,
            category: 'alkaline-earth-metals',
            electronegativity: 1.57,
            electronConfig: '[He] 2s²',
            meltingPoint: 1287,
            boilingPoint: 2470,
            position: { row: 2, col: 2 },
            description: 'Beryllium is a relatively rare element in the universe, usually occurring as a product of the spallation of larger atomic nuclei.'
        },
        {
            symbol: 'B',
            name: 'Boron',
            atomicNumber: 5,
            atomicMass: 10.81,
            category: 'metalloids',
            electronegativity: 2.04,
            electronConfig: '[He] 2s² 2p¹',
            meltingPoint: 2076,
            boilingPoint: 3927,
            position: { row: 2, col: 13 },
            description: 'Boron is a chemical element with symbol B and atomic number 5. Produced entirely by cosmic ray spallation and supernovae.'
        },
        {
            symbol: 'C',
            name: 'Carbon',
            atomicNumber: 6,
            atomicMass: 12.011,
            category: 'nonmetals',
            electronegativity: 2.55,
            electronConfig: '[He] 2s² 2p²',
            meltingPoint: 3550,
            boilingPoint: 4027,
            position: { row: 2, col: 14 },
            description: 'Carbon is a chemical element with symbol C and atomic number 6. It is nonmetallic and tetravalent—making four electrons available to form covalent chemical bonds.'
        },
        {
            symbol: 'N',
            name: 'Nitrogen',
            atomicNumber: 7,
            atomicMass: 14.007,
            category: 'nonmetals',
            electronegativity: 3.04,
            electronConfig: '[He] 2s² 2p³',
            meltingPoint: -210.1,
            boilingPoint: -195.8,
            position: { row: 2, col: 15 },
            description: 'Nitrogen is a chemical element with symbol N and atomic number 7. It was first discovered and isolated by Scottish physician Daniel Rutherford in 1772.'
        },
        {
            symbol: 'O',
            name: 'Oxygen',
            atomicNumber: 8,
            atomicMass: 15.999,
            category: 'nonmetals',
            electronegativity: 3.44,
            electronConfig: '[He] 2s² 2p⁴',
            meltingPoint: -218.3,
            boilingPoint: -183.0,
            position: { row: 2, col: 16 },
            description: 'Oxygen is a chemical element with symbol O and atomic number 8. It is a member of the chalcogen group on the periodic table, a highly reactive nonmetal.'
        },
        {
            symbol: 'F',
            name: 'Fluorine',
            atomicNumber: 9,
            atomicMass: 18.998,
            category: 'halogens',
            electronegativity: 3.98,
            electronConfig: '[He] 2s² 2p⁵',
            meltingPoint: -219.6,
            boilingPoint: -188.1,
            position: { row: 2, col: 17 },
            description: 'Fluorine is a chemical element with symbol F and atomic number 9. It is the lightest halogen and exists as a highly toxic pale yellow diatomic gas at standard conditions.'
        },
        {
            symbol: 'Ne',
            name: 'Neon',
            atomicNumber: 10,
            atomicMass: 20.180,
            category: 'noble-gases',
            electronegativity: null,
            electronConfig: '[He] 2s² 2p⁶',
            meltingPoint: -248.6,
            boilingPoint: -246.1,
            position: { row: 2, col: 18 },
            description: 'Neon is a chemical element with symbol Ne and atomic number 10. It is a noble gas. Neon is a colorless, odorless, inert monatomic gas under standard conditions.'
        },
        
        // Row 3 (partial)
        {
            symbol: 'Na',
            name: 'Sodium',
            atomicNumber: 11,
            atomicMass: 22.990,
            category: 'alkali-metals',
            electronegativity: 0.93,
            electronConfig: '[Ne] 3s¹',
            meltingPoint: 97.72,
            boilingPoint: 883,
            position: { row: 3, col: 1 },
            description: 'Sodium is a chemical element with symbol Na and atomic number 11. It is a soft, silvery-white, highly reactive metal.'
        },
        {
            symbol: 'Mg',
            name: 'Magnesium',
            atomicNumber: 12,
            atomicMass: 24.305,
            category: 'alkaline-earth-metals',
            electronegativity: 1.31,
            electronConfig: '[Ne] 3s²',
            meltingPoint: 650,
            boilingPoint: 1090,
            position: { row: 3, col: 2 },
            description: 'Magnesium is a chemical element with symbol Mg and atomic number 12. It is a shiny gray solid which bears a close physical resemblance to the other five elements in the second column of the periodic table.'
        },
        {
            symbol: 'Al',
            name: 'Aluminum',
            atomicNumber: 13,
            atomicMass: 26.982,
            category: 'post-transition-metals',
            electronegativity: 1.61,
            electronConfig: '[Ne] 3s² 3p¹',
            meltingPoint: 660.32,
            boilingPoint: 2519,
            position: { row: 3, col: 13 },
            description: 'Aluminum is a chemical element with symbol Al and atomic number 13. It is a silvery-white, soft, nonmagnetic, ductile metal in the boron group.'
        },
        {
            symbol: 'Si',
            name: 'Silicon',
            atomicNumber: 14,
            atomicMass: 28.085,
            category: 'metalloids',
            electronegativity: 1.90,
            electronConfig: '[Ne] 3s² 3p²',
            meltingPoint: 1414,
            boilingPoint: 3265,
            position: { row: 3, col: 14 },
            description: 'Silicon is a chemical element with symbol Si and atomic number 14. It is a hard and brittle crystalline solid with a blue-grey metallic lustre.'
        },
        {
            symbol: 'P',
            name: 'Phosphorus',
            atomicNumber: 15,
            atomicMass: 30.974,
            category: 'nonmetals',
            electronegativity: 2.19,
            electronConfig: '[Ne] 3s² 3p³',
            meltingPoint: 44.15,
            boilingPoint: 280.5,
            position: { row: 3, col: 15 },
            description: 'Phosphorus is a chemical element with symbol P and atomic number 15. As an element, phosphorus exists in two major forms—white phosphorus and red phosphorus.'
        },
        {
            symbol: 'S',
            name: 'Sulfur',
            atomicNumber: 16,
            atomicMass: 32.06,
            category: 'nonmetals',
            electronegativity: 2.58,
            electronConfig: '[Ne] 3s² 3p⁴',
            meltingPoint: 115.21,
            boilingPoint: 444.6,
            position: { row: 3, col: 16 },
            description: 'Sulfur is a chemical element with symbol S and atomic number 16. It is abundant, multivalent, and nonmetallic.'
        },
        {
            symbol: 'Cl',
            name: 'Chlorine',
            atomicNumber: 17,
            atomicMass: 35.45,
            category: 'halogens',
            electronegativity: 3.16,
            electronConfig: '[Ne] 3s² 3p⁵',
            meltingPoint: -101.5,
            boilingPoint: -34.04,
            position: { row: 3, col: 17 },
            description: 'Chlorine is a chemical element with symbol Cl and atomic number 17. The second-lightest of the halogens, it appears between fluorine and bromine in the periodic table.'
        },
        {
            symbol: 'Ar',
            name: 'Argon',
            atomicNumber: 18,
            atomicMass: 39.948,
            category: 'noble-gases',
            electronegativity: null,
            electronConfig: '[Ne] 3s² 3p⁶',
            meltingPoint: -189.3,
            boilingPoint: -185.8,
            position: { row: 3, col: 18 },
            description: 'Argon is a chemical element with symbol Ar and atomic number 18. It is in group 18 of the periodic table and is a noble gas.'
        }
        // Additional elements would be added here
    ];
    
    // Category colors mapping
    const categoryColors = {
        'alkali-metals': 'bg-red-400',
        'alkaline-earth-metals': 'bg-orange-400',
        'transition-metals': 'bg-yellow-400',
        'post-transition-metals': 'bg-green-400',
        'metalloids': 'bg-teal-400',
        'nonmetals': 'bg-blue-400',
        'halogens': 'bg-indigo-400',
        'noble-gases': 'bg-purple-400',
        'lanthanides': 'bg-pink-400',
        'actinides': 'bg-rose-400'
    };
    
    // Initialize the periodic table
    function initPeriodicTable() {
        generatePeriodicTable();
        setupEventListeners();
    }
    
    // Generate the periodic table grid
    function generatePeriodicTable() {
        // Create table structure
        const table = document.createElement('table');
        table.className = 'w-full border-collapse';
        
        // Create rows for the periodic table (9 rows including lanthanides/actinides)
        for (let row = 1; row <= 7; row++) {
            const tr = document.createElement('tr');
            
            // Create cells for each column (18 columns)
            for (let col = 1; col <= 18; col++) {
                const td = document.createElement('td');
                td.className = 'p-1';
                
                // Find element at this position
                const element = elements.find(e => e.position.row === row && e.position.col === col);
                
                if (element) {
                    // Create element cell
                    const elementCell = createElementCell(element);
                    td.appendChild(elementCell);
                }
                
                tr.appendChild(td);
            }
            
            table.appendChild(tr);
        }
        
        // Add table to container
        periodicTableContainer.innerHTML = '';
        periodicTableContainer.appendChild(table);
    }
    
    // Create an individual element cell
    function createElementCell(element) {
        const cell = document.createElement('div');
        cell.className = `element-cell cursor-pointer p-1 border rounded-md ${categoryColors[element.category]} hover:shadow-lg transition duration-300 text-center`;
        cell.dataset.element = element.symbol;
        
        // Element symbol
        const symbolDiv = document.createElement('div');
        symbolDiv.className = 'text-lg font-bold';
        symbolDiv.textContent = element.symbol;
        cell.appendChild(symbolDiv);
        
        // Element atomic number
        const atomicNumberDiv = document.createElement('div');
        atomicNumberDiv.className = 'text-xs';
        atomicNumberDiv.textContent = element.atomicNumber;
        cell.appendChild(atomicNumberDiv);
        
        // Element name (small text)
        const nameDiv = document.createElement('div');
        nameDiv.className = 'text-xs truncate';
        nameDiv.textContent = element.name;
        cell.appendChild(nameDiv);
        
        // Add property display based on current selection
        const propertyDiv = document.createElement('div');
        propertyDiv.className = 'text-xs mt-1 property-value';
        propertyDiv.textContent = getPropertyValue(element, currentProperty);
        cell.appendChild(propertyDiv);
        
        return cell;
    }
    
    // Get formatted property value for display
    function getPropertyValue(element, property) {
        switch (property) {
            case 'atomic-number':
                return element.atomicNumber;
            case 'atomic-mass':
                return element.atomicMass.toFixed(2);
            case 'electronegativity':
                return element.electronegativity ? element.electronegativity.toFixed(2) : '-';
            case 'electron-configuration':
                return element.electronConfig;
            case 'melting-point':
                return `${element.meltingPoint} °C`;
            case 'boiling-point':
                return `${element.boilingPoint} °C`;
            default:
                return '';
        }
    }
    
    // Show element details
    function showElementDetails(element) {
        // Set selected element
        selectedElement = element;
        
        // Update element details panel
        document.getElementById('element-symbol').textContent = element.symbol;
        document.getElementById('element-symbol').className = `w-16 h-16 flex items-center justify-center text-3xl font-bold rounded-lg mr-4 ${categoryColors[element.category]}`;
        document.getElementById('element-name').textContent = element.name;
        document.getElementById('element-category').textContent = formatCategoryName(element.category);
        document.getElementById('element-atomic-number').textContent = element.atomicNumber;
        document.getElementById('element-atomic-mass').textContent = `${element.atomicMass.toFixed(4)} u`;
        document.getElementById('element-electron-config').textContent = element.electronConfig;
        document.getElementById('element-electronegativity').textContent = element.electronegativity ? element.electronegativity.toFixed(2) : 'N/A';
        document.getElementById('element-melting-point').textContent = `${element.meltingPoint} °C`;
        document.getElementById('element-boiling-point').textContent = `${element.boilingPoint} °C`;
        document.getElementById('element-description').textContent = element.description;
        
        // Show the details panel
        elementDetails.classList.remove('hidden');
    }
    
    // Format category name for display
    function formatCategoryName(category) {
        return category
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    
    // Filter elements by category
    function filterElementsByCategory(category) {
        currentCategory = category;
        
        // Update active category button
        categoryButtons.forEach(button => {
            if (button.dataset.category === category) {
                button.classList.add('bg-gradient-to-r', 'from-blue-500', 'to-indigo-600', 'text-white');
                button.classList.remove('hover:bg-gray-100');
            } else {
                button.classList.remove('bg-gradient-to-r', 'from-blue-500', 'to-indigo-600', 'text-white');
                button.classList.add('hover:bg-gray-100');
            }
        });
        
        // Filter elements
        const elementCells = document.querySelectorAll('.element-cell');
        elementCells.forEach(cell => {
            const symbol = cell.dataset.element;
            const element = elements.find(e => e.symbol === symbol);
            
            if (category === 'all' || element.category === category) {
                cell.parentElement.classList.remove('hidden');
            } else {
                cell.parentElement.classList.add('hidden');
            }
        });
    }
    
    // Search elements by name or symbol
    function searchElements(query) {
        const searchQuery = query.toLowerCase();
        
        const elementCells = document.querySelectorAll('.element-cell');
        elementCells.forEach(cell => {
            const symbol = cell.dataset.element;
            const element = elements.find(e => e.symbol === symbol);
            
            // Check if element matches search query and category filter
            const matchesSearch = element.name.toLowerCase().includes(searchQuery) || 
                                element.symbol.toLowerCase().includes(searchQuery) ||
                                element.atomicNumber.toString().includes(searchQuery);
            
            const matchesCategory = currentCategory === 'all' || element.category === currentCategory;
            
            if (matchesSearch && matchesCategory) {
                cell.parentElement.classList.remove('hidden');
            } else {
                cell.parentElement.classList.add('hidden');
            }
        });
    }
    
    // Update property display
    function updatePropertyDisplay(property) {
        currentProperty = property;
        
        const propertyValues = document.querySelectorAll('.property-value');
        propertyValues.forEach(div => {
            const cell = div.closest('.element-cell');
            const symbol = cell.dataset.element;
            const element = elements.find(e => e.symbol === symbol);
            
            div.textContent = getPropertyValue(element, property);
        });
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Element click event
        periodicTableContainer.addEventListener('click', (e) => {
            const elementCell = e.target.closest('.element-cell');
            if (elementCell) {
                const symbol = elementCell.dataset.element;
                const element = elements.find(e => e.symbol === symbol);
                showElementDetails(element);
            }
        });
        
        // Category filter buttons
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;
                filterElementsByCategory(category);
            });
        });
        
        // Search input
        elementSearch.addEventListener('input', (e) => {
            searchElements(e.target.value);
        });
        
        // Property selector
        propertySelector.addEventListener('change', (e) => {
            updatePropertyDisplay(e.target.value);
        });
    }
    
    // Initialize the app
    initPeriodicTable();
});