// Ultimate Student Toolkit - Citation Generator

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const citationOutput = document.getElementById('citation-output');
    const generateCitationBtn = document.getElementById('generate-citation');
    const generateWebsiteCitationBtn = document.getElementById('generate-website-citation');
    const copyCitationBtn = document.getElementById('copy-citation');
    const saveCitationBtn = document.getElementById('save-citation');
    const addAuthorBtn = document.getElementById('add-author');
    const addWebsiteAuthorBtn = document.getElementById('add-website-author');
    const citationStyleBtns = document.querySelectorAll('.citation-style-btn');
    const sourceTypeBtns = document.querySelectorAll('.source-type-btn');
    const bookForm = document.getElementById('book-form');
    const websiteForm = document.getElementById('website-form');
    const currentStyleSpan = document.getElementById('current-style');
    const currentTypeSpan = document.getElementById('current-type');
    
    // Citation Generator State
    let currentCitationStyle = 'apa';
    let currentSourceType = 'book';
    let savedCitations = [];
    
    // Initialize Citation Generator
    initializeCitationGenerator();
    
    // Event Listeners
    citationStyleBtns.forEach(button => {
        button.addEventListener('click', () => {
            setActiveCitationStyle(button);
        });
    });
    
    sourceTypeBtns.forEach(button => {
        button.addEventListener('click', () => {
            setActiveSourceType(button);
        });
    });
    
    addAuthorBtn.addEventListener('click', () => {
        addAuthorField('authors-container');
    });
    
    addWebsiteAuthorBtn.addEventListener('click', () => {
        addAuthorField('website-authors-container');
    });
    
    generateCitationBtn.addEventListener('click', () => {
        generateBookCitation();
    });
    
    generateWebsiteCitationBtn.addEventListener('click', () => {
        generateWebsiteCitation();
    });
    
    copyCitationBtn.addEventListener('click', () => {
        copyCitation();
    });
    
    saveCitationBtn.addEventListener('click', () => {
        saveCitation();
    });
    
    // Citation Generator Functions
    function initializeCitationGenerator() {
        // Set default date for website accessed field to today
        const today = new Date().toISOString().split('T')[0];
        if (document.getElementById('website-date-accessed')) {
            document.getElementById('website-date-accessed').value = today;
        }
        
        // Add event listeners to remove author buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.remove-author')) {
                const authorEntry = e.target.closest('.author-entry');
                authorEntry.remove();
            }
        });
    }
    
    function setActiveCitationStyle(button) {
        // Remove active class from all style buttons
        citationStyleBtns.forEach(btn => {
            btn.classList.remove('bg-gradient-to-r', 'from-purple-500', 'to-indigo-600', 'text-white');
            btn.classList.add('bg-white', 'text-gray-700', 'border', 'border-gray-300');
        });
        
        // Add active class to selected button
        button.classList.remove('bg-white', 'text-gray-700', 'border', 'border-gray-300');
        button.classList.add('bg-gradient-to-r', 'from-purple-500', 'to-indigo-600', 'text-white');
        
        // Update current style
        currentCitationStyle = button.dataset.style;
        
        // Update style display
        updateStyleDisplay();
    }
    
    function setActiveSourceType(button) {
        // Remove active class from all type buttons
        sourceTypeBtns.forEach(btn => {
            btn.classList.remove('bg-gradient-to-r', 'from-purple-500', 'to-indigo-600', 'text-white');
            btn.classList.add('bg-white', 'text-gray-700', 'border', 'border-gray-300');
        });
        
        // Add active class to selected button
        button.classList.remove('bg-white', 'text-gray-700', 'border', 'border-gray-300');
        button.classList.add('bg-gradient-to-r', 'from-purple-500', 'to-indigo-600', 'text-white');
        
        // Update current type
        currentSourceType = button.dataset.type;
        
        // Show appropriate form
        showSourceForm(currentSourceType);
        
        // Update type display
        updateTypeDisplay();
    }
    
    function showSourceForm(sourceType) {
        // Hide all forms
        bookForm.classList.add('hidden');
        websiteForm.classList.add('hidden');
        
        // Show selected form
        switch(sourceType) {
            case 'book':
                bookForm.classList.remove('hidden');
                break;
            case 'website':
                websiteForm.classList.remove('hidden');
                break;
            case 'journal':
                // For now, show book form as fallback
                bookForm.classList.remove('hidden');
                break;
            case 'more':
                // For now, show book form as fallback
                bookForm.classList.remove('hidden');
                break;
        }
    }
    
    function updateStyleDisplay() {
        const styleMap = {
            'apa': 'APA 7th Edition',
            'mla': 'MLA 9th Edition',
            'chicago': 'Chicago 17th Edition',
            'harvard': 'Harvard 2021 Edition'
        };
        
        currentStyleSpan.textContent = styleMap[currentCitationStyle];
    }
    
    function updateTypeDisplay() {
        const typeMap = {
            'book': 'Book',
            'website': 'Website',
            'journal': 'Journal',
            'more': 'Other Source'
        };
        
        currentTypeSpan.textContent = typeMap[currentSourceType];
    }
    
    function addAuthorField(containerId) {
        const container = document.getElementById(containerId);
        const authorEntries = container.querySelectorAll('.author-entry');
        
        // Clone the first author entry
        const newAuthorEntry = authorEntries[0].cloneNode(true);
        
        // Clear input values
        newAuthorEntry.querySelectorAll('input').forEach(input => {
            input.value = '';
        });
        
        // Show remove button
        const removeBtn = newAuthorEntry.querySelector('.remove-author');
        if (removeBtn) {
            removeBtn.classList.remove('hidden');
        }
        
        // Add to container
        container.appendChild(newAuthorEntry);
    }
    
    function getAuthors(containerId) {
        const container = document.getElementById(containerId);
        const authorEntries = container.querySelectorAll('.author-entry');
        const authors = [];
        
        authorEntries.forEach(entry => {
            const firstName = entry.querySelector('.author-first').value.trim();
            const middleName = entry.querySelector('.author-middle').value.trim();
            const lastName = entry.querySelector('.author-last').value.trim();
            
            if (firstName || lastName) {
                authors.push({
                    firstName,
                    middleName,
                    lastName
                });
            }
        });
        
        return authors;
    }
    
    function generateBookCitation() {
        // Get form values
        const title = document.getElementById('book-title').value.trim();
        const subtitle = document.getElementById('book-subtitle').value.trim();
        const year = document.getElementById('book-year').value.trim();
        const publisher = document.getElementById('book-publisher').value.trim();
        const location = document.getElementById('book-location').value.trim();
        const edition = document.getElementById('book-edition').value.trim();
        const doi = document.getElementById('book-doi').value.trim();
        const authors = getAuthors('authors-container');
        
        // Validate required fields
        if (!title || !year || !publisher || authors.length === 0) {
            citationOutput.innerHTML = '<p class="text-red-500">Please fill in all required fields marked with *</p>';
            return;
        }
        
        // Generate citation based on style
        let citation = '';
        
        switch(currentCitationStyle) {
            case 'apa':
                citation = generateAPABookCitation(authors, year, title, subtitle, publisher, location, edition, doi);
                break;
            case 'mla':
                citation = generateMLABookCitation(authors, title, subtitle, publisher, location, year, edition);
                break;
            case 'chicago':
                citation = generateChicagoBookCitation(authors, title, subtitle, publisher, location, year, edition);
                break;
            case 'harvard':
                citation = generateHarvardBookCitation(authors, year, title, subtitle, edition, publisher, location);
                break;
        }
        
        // Display citation
        citationOutput.innerHTML = `<p class="citation">${citation}</p>`;
    }
    
    function generateWebsiteCitation() {
        // Get form values
        const pageTitle = document.getElementById('website-title').value.trim();
        const websiteName = document.getElementById('website-name').value.trim();
        const url = document.getElementById('website-url').value.trim();
        const datePublished = document.getElementById('website-date-published').value;
        const dateAccessed = document.getElementById('website-date-accessed').value;
        const authors = getAuthors('website-authors-container');
        
        // Validate required fields
        if (!pageTitle || !websiteName || !url || !dateAccessed) {
            citationOutput.innerHTML = '<p class="text-red-500">Please fill in all required fields marked with *</p>';
            return;
        }
        
        // Format dates
        const publishedDate = datePublished ? new Date(datePublished) : null;
        const accessedDate = new Date(dateAccessed);
        
        // Generate citation based on style
        let citation = '';
        
        switch(currentCitationStyle) {
            case 'apa':
                citation = generateAPAWebsiteCitation(authors, publishedDate, pageTitle, websiteName, url, accessedDate);
                break;
            case 'mla':
                citation = generateMLAWebsiteCitation(authors, pageTitle, websiteName, publishedDate, url, accessedDate);
                break;
            case 'chicago':
                citation = generateChicagoWebsiteCitation(authors, pageTitle, websiteName, publishedDate, url, accessedDate);
                break;
            case 'harvard':
                citation = generateHarvardWebsiteCitation(authors, publishedDate, pageTitle, websiteName, url, accessedDate);
                break;
        }
        
        // Display citation
        citationOutput.innerHTML = `<p class="citation">${citation}</p>`;
    }
    
    // Citation Style Generators - APA
    function generateAPABookCitation(authors, year, title, subtitle, publisher, location, edition, doi) {
        // Format authors
        let authorText = formatAPAAuthors(authors);
        
        // Format title (italicized)
        let titleText = title;
        if (subtitle) {
            titleText += `: ${subtitle}`;
        }
        
        // Format edition
        let editionText = edition ? ` (${edition}).` : '.';
        
        // Format publisher location
        let publisherLocation = location ? `${location}: ` : '';
        
        // Format DOI
        let doiText = doi ? ` https://doi.org/${doi.replace(/^https?:\/\/doi\.org\//i, '')}` : '';
        
        // Construct citation
        return `${authorText} (${year}). <em>${titleText}</em>${editionText} ${publisherLocation}${publisher}${doiText}`;
    }
    
    function generateAPAWebsiteCitation(authors, publishedDate, pageTitle, websiteName, url, accessedDate) {
        // Format authors
        let authorText = authors.length > 0 ? formatAPAAuthors(authors) : websiteName + '.';
        
        // Format date
        let dateText = publishedDate ? `(${publishedDate.getFullYear()}, ${formatMonth(publishedDate.getMonth())} ${publishedDate.getDate()}).` : '(n.d.).';
        
        // Format title
        let titleText = pageTitle + '.';
        
        // Format website name (italicized)
        let websiteText = authors.length > 0 ? `<em>${websiteName}</em>.` : '';
        
        // Format accessed date
        let accessedText = `Retrieved ${formatMonth(accessedDate.getMonth())} ${accessedDate.getDate()}, ${accessedDate.getFullYear()}, from ${url}`;
        
        // Construct citation
        return `${authorText} ${dateText} ${titleText} ${websiteText} ${accessedText}`;
    }
    
    // Citation Style Generators - MLA
    function generateMLABookCitation(authors, title, subtitle, publisher, location, year, edition) {
        // Format authors
        let authorText = formatMLAAuthors(authors);
        
        // Format title (italicized)
        let titleText = title;
        if (subtitle) {
            titleText += `: ${subtitle}`;
        }
        
        // Format edition
        let editionText = edition ? `, ${edition},` : ',';
        
        // Format publisher location
        let publisherLocation = location ? ` ${location},` : '';
        
        // Construct citation
        return `${authorText}. <em>${titleText}</em>${editionText}${publisherLocation} ${publisher}, ${year}.`;
    }
    
    function generateMLAWebsiteCitation(authors, pageTitle, websiteName, publishedDate, url, accessedDate) {
        // Format authors
        let authorText = authors.length > 0 ? formatMLAAuthors(authors) : `"${pageTitle}."` ;
        
        // Format title
        let titleText = authors.length > 0 ? `"${pageTitle}."` : '';
        
        // Format website name (italicized)
        let websiteText = `<em>${websiteName}</em>,`;
        
        // Format date
        let dateText = publishedDate ? 
            `${publishedDate.getDate()} ${formatMonth(publishedDate.getMonth())} ${publishedDate.getFullYear()},` : 
            '';
        
        // Format accessed date
        let accessedText = `Accessed ${accessedDate.getDate()} ${formatMonth(accessedDate.getMonth())} ${accessedDate.getFullYear()}.`;
        
        // Format URL
        let urlText = url + '.';
        
        // Construct citation
        return `${authorText} ${titleText} ${websiteText} ${dateText} ${urlText} ${accessedText}`;
    }
    
    // Citation Style Generators - Chicago
    function generateChicagoBookCitation(authors, title, subtitle, publisher, location, year, edition) {
        // Format authors
        let authorText = formatChicagoAuthors(authors);
        
        // Format title (italicized)
        let titleText = title;
        if (subtitle) {
            titleText += `: ${subtitle}`;
        }
        
        // Format edition
        let editionText = edition ? ` ${edition}.` : '.';
        
        // Format publisher location
        let publisherLocation = location ? `${location}: ` : '';
        
        // Construct citation
        return `${authorText}. <em>${titleText}</em>${editionText} ${publisherLocation}${publisher}, ${year}.`;
    }
    
    function generateChicagoWebsiteCitation(authors, pageTitle, websiteName, publishedDate, url, accessedDate) {
        // Format authors
        let authorText = authors.length > 0 ? formatChicagoAuthors(authors) : '';
        
        // Format title
        let titleText = `"${pageTitle},"`;
        
        // Format website name (italicized)
        let websiteText = `<em>${websiteName}</em>,`;
        
        // Format date
        let dateText = publishedDate ? 
            `published ${formatMonth(publishedDate.getMonth())} ${publishedDate.getDate()}, ${publishedDate.getFullYear()},` : 
            '';
        
        // Format accessed date
        let accessedText = `accessed ${formatMonth(accessedDate.getMonth())} ${accessedDate.getDate()}, ${accessedDate.getFullYear()},`;
        
        // Format URL
        let urlText = url + '.';
        
        // Construct citation
        return `${authorText ? authorText + '. ' : ''}${titleText} ${websiteText} ${dateText} ${accessedText} ${urlText}`;
    }
    
    // Citation Style Generators - Harvard
    function generateHarvardBookCitation(authors, year, title, subtitle, edition, publisher, location) {
        // Format authors
        let authorText = formatHarvardAuthors(authors);
        
        // Format year
        let yearText = `(${year})`;
        
        // Format title (italicized)
        let titleText = title;
        if (subtitle) {
            titleText += `: ${subtitle}`;
        }
        
        // Format edition
        let editionText = edition ? ` ${edition}` : '';
        
        // Format publisher location
        let publisherLocation = location ? `${location}: ` : '';
        
        // Construct citation
        return `${authorText} ${yearText}. <em>${titleText}</em>${editionText}. ${publisherLocation}${publisher}.`;
    }
    
    function generateHarvardWebsiteCitation(authors, publishedDate, pageTitle, websiteName, url, accessedDate) {
        // Format authors
        let authorText = authors.length > 0 ? formatHarvardAuthors(authors) : websiteName;
        
        // Format date
        let dateText = publishedDate ? 
            `(${publishedDate.getFullYear()})` : 
            '(n.d.)';
        
        // Format title
        let titleText = pageTitle;
        
        // Format website name (italicized)
        let websiteText = authors.length > 0 ? `<em>${websiteName}</em>` : '';
        
        // Format accessed date
        let accessedText = `Available at: ${url} (Accessed: ${accessedDate.getDate()} ${formatMonth(accessedDate.getMonth())} ${accessedDate.getFullYear()}).`;
        
        // Construct citation
        return `${authorText} ${dateText}. ${titleText}. ${websiteText}. ${accessedText}`;
    }
    
    // Helper Functions
    function formatAPAAuthors(authors) {
        if (authors.length === 0) return '';
        
        if (authors.length === 1) {
            const author = authors[0];
            return `${author.lastName}, ${author.firstName.charAt(0)}.${author.middleName ? ' ' + author.middleName.charAt(0) + '.' : ''}`;
        }
        
        if (authors.length === 2) {
            const author1 = authors[0];
            const author2 = authors[1];
            return `${author1.lastName}, ${author1.firstName.charAt(0)}.${author1.middleName ? ' ' + author1.middleName.charAt(0) + '.' : ''}, & ${author2.lastName}, ${author2.firstName.charAt(0)}.${author2.middleName ? ' ' + author2.middleName.charAt(0) + '.' : ''}`;
        }
        
        const lastAuthor = authors[authors.length - 1];
        let authorText = '';
        
        for (let i = 0; i < authors.length - 1; i++) {
            const author = authors[i];
            authorText += `${author.lastName}, ${author.firstName.charAt(0)}.${author.middleName ? ' ' + author.middleName.charAt(0) + '.' : ''}, `;
        }
        
        authorText += `& ${lastAuthor.lastName}, ${lastAuthor.firstName.charAt(0)}.${lastAuthor.middleName ? ' ' + lastAuthor.middleName.charAt(0) + '.' : ''}`;
        
        return authorText;
    }
    
    function formatMLAAuthors(authors) {
        if (authors.length === 0) return '';
        
        if (authors.length === 1) {
            const author = authors[0];
            return `${author.lastName}, ${author.firstName}${author.middleName ? ' ' + author.middleName : ''}`;
        }
        
        if (authors.length === 2) {
            const author1 = authors[0];
            const author2 = authors[1];
            return `${author1.lastName}, ${author1.firstName}${author1.middleName ? ' ' + author1.middleName : ''}, and ${author2.firstName}${author2.middleName ? ' ' + author2.middleName : ''} ${author2.lastName}`;
        }
        
        const firstAuthor = authors[0];
        return `${firstAuthor.lastName}, ${firstAuthor.firstName}${firstAuthor.middleName ? ' ' + firstAuthor.middleName : ''}, et al`;
    }
    
    function formatChicagoAuthors(authors) {
        if (authors.length === 0) return '';
        
        if (authors.length === 1) {
            const author = authors[0];
            return `${author.lastName}, ${author.firstName}${author.middleName ? ' ' + author.middleName : ''}`;
        }
        
        if (authors.length === 2) {
            const author1 = authors[0];
            const author2 = authors[1];
            return `${author1.lastName}, ${author1.firstName}${author1.middleName ? ' ' + author1.middleName : ''}, and ${author2.firstName}${author2.middleName ? ' ' + author2.middleName : ''} ${author2.lastName}`;
        }
        
        if (authors.length === 3) {
            const author1 = authors[0];
            const author2 = authors[1];
            const author3 = authors[2];
            return `${author1.lastName}, ${author1.firstName}${author1.middleName ? ' ' + author1.middleName : ''}, ${author2.firstName}${author2.middleName ? ' ' + author2.middleName : ''} ${author2.lastName}, and ${author3.firstName}${author3.middleName ? ' ' + author3.middleName : ''} ${author3.lastName}`;
        }
        
        const firstAuthor = authors[0];
        return `${firstAuthor.lastName}, ${firstAuthor.firstName}${firstAuthor.middleName ? ' ' + firstAuthor.middleName : ''}, et al`;
    }
    
    function formatHarvardAuthors(authors) {
        if (authors.length === 0) return '';
        
        if (authors.length === 1) {
            const author = authors[0];
            return `${author.lastName}, ${author.firstName.charAt(0)}.${author.middleName ? author.middleName.charAt(0) + '.' : ''}`;
        }
        
        if (authors.length === 2) {
            const author1 = authors[0];
            const author2 = authors[1];
            return `${author1.lastName}, ${author1.firstName.charAt(0)}.${author1.middleName ? author1.middleName.charAt(0) + '.' : ''} and ${author2.lastName}, ${author2.firstName.charAt(0)}.${author2.middleName ? author2.middleName.charAt(0) + '.' : ''}`;
        }
        
        if (authors.length === 3) {
            const author1 = authors[0];
            const author2 = authors[1];
            const author3 = authors[2];
            return `${author1.lastName}, ${author1.firstName.charAt(0)}.${author1.middleName ? author1.middleName.charAt(0) + '.' : ''}, ${author2.lastName}, ${author2.firstName.charAt(0)}.${author2.middleName ? author2.middleName.charAt(0) + '.' : ''} and ${author3.lastName}, ${author3.firstName.charAt(0)}.${author3.middleName ? author3.middleName.charAt(0) + '.' : ''}`;
        }
        
        const firstAuthor = authors[0];
        return `${firstAuthor.lastName}, ${firstAuthor.firstName.charAt(0)}.${firstAuthor.middleName ? firstAuthor.middleName.charAt(0) + '.' : ''} et al.`;
    }
    
    function formatMonth(monthIndex) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[monthIndex];
    }
    
    function copyCitation() {
        const citation = citationOutput.querySelector('.citation');
        
        if (!citation) {
            alert('No citation to copy!');
            return;
        }
        
        // Create a temporary textarea to copy from
        const textarea = document.createElement('textarea');
        textarea.value = citation.textContent;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        // Show success message
        const originalText = copyCitationBtn.innerHTML;
        copyCitationBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Copied!';
        
        setTimeout(() => {
            copyCitationBtn.innerHTML = originalText;
        }, 2000);
    }
    
    function saveCitation() {
        const citation = citationOutput.querySelector('.citation');
        
        if (!citation) {
            alert('No citation to save!');
            return;
        }
        
        // Add to saved citations
        savedCitations.push({
            text: citation.innerHTML,
            style: currentCitationStyle,
            type: currentSourceType,
            date: new Date().toISOString()
        });
        
        // Save to localStorage
        localStorage.setItem('savedCitations', JSON.stringify(savedCitations));
        
        // Show success message
        const originalText = saveCitationBtn.innerHTML;
        saveCitationBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Saved!';
        
        setTimeout(() => {
            saveCitationBtn.innerHTML = originalText;
        }, 2000);
    }
});