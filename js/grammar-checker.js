document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // DOM Elements
    const textInput = document.getElementById('text-input');
    const checkGrammarBtn = document.getElementById('check-grammar');
    const clearTextBtn = document.getElementById('clear-text');
    const copyTextBtn = document.getElementById('copy-text');
    const sampleTextBtn = document.getElementById('sample-text');
    const resultsContainer = document.getElementById('results-container');
    const grammarIssues = document.getElementById('grammar-issues');
    const spellingIssues = document.getElementById('spelling-issues');
    const punctuationIssues = document.getElementById('punctuation-issues');
    const writingScore = document.getElementById('writing-score');
    const issuesList = document.getElementById('issues-list');
    const correctedText = document.getElementById('corrected-text');
    const applyCorrectionsBtn = document.getElementById('apply-corrections');
    
    // Event Listeners
    checkGrammarBtn.addEventListener('click', checkGrammar);
    clearTextBtn.addEventListener('click', clearText);
    copyTextBtn.addEventListener('click', copyText);
    sampleTextBtn.addEventListener('click', insertSampleText);
    applyCorrectionsBtn.addEventListener('click', applyCorrections);
    
    // Common grammar issues for demonstration
    const commonGrammarIssues = [
        { type: 'grammar', pattern: /\b(is|are|was|were)\s+(at|in)\s+the\s+(process|act)\s+of\s+/gi, replacement: '$1 ', message: 'Wordy phrase. Use a simpler verb tense.' },
        { type: 'grammar', pattern: /\b(irregardless)\b/gi, replacement: 'regardless', message: '"Irregardless" is not standard. Use "regardless" instead.' },
        { type: 'grammar', pattern: /\b(could|would|should|might|must)\s+of\b/gi, replacement: '$1 have', message: 'Use "$1 have" instead of "$1 of".' },
        { type: 'grammar', pattern: /\b(less)\s+(\w+s)\b(?!\s+than)/gi, replacement: 'fewer $2', message: 'Use "fewer" with countable nouns.' },
        { type: 'grammar', pattern: /\b(me|him|her|them|us)\s+and\s+(\w+)\s+(\w+)/gi, replacement: '$2 and $1 $3', message: 'Put yourself last in a list of people.' },
        { type: 'grammar', pattern: /\b(I|we|they)\s+(is)\b/gi, replacement: '$1 are', message: 'Subject-verb agreement error.' },
        { type: 'grammar', pattern: /\b(he|she|it)\s+(are)\b/gi, replacement: '$1 is', message: 'Subject-verb agreement error.' },
        
        // Spelling issues
        { type: 'spelling', pattern: /\b(definately)\b/gi, replacement: 'definitely', message: 'Spelling error: "definitely"' },
        { type: 'spelling', pattern: /\b(seperate)\b/gi, replacement: 'separate', message: 'Spelling error: "separate"' },
        { type: 'spelling', pattern: /\b(recieve)\b/gi, replacement: 'receive', message: 'Spelling error: "receive"' },
        { type: 'spelling', pattern: /\b(accomodate)\b/gi, replacement: 'accommodate', message: 'Spelling error: "accommodate"' },
        { type: 'spelling', pattern: /\b(occured)\b/gi, replacement: 'occurred', message: 'Spelling error: "occurred"' },
        { type: 'spelling', pattern: /\b(goverment)\b/gi, replacement: 'government', message: 'Spelling error: "government"' },
        { type: 'spelling', pattern: /\b(concious)\b/gi, replacement: 'conscious', message: 'Spelling error: "conscious"' },
        
        // Punctuation issues
        { type: 'punctuation', pattern: /\s+,/g, replacement: ',', message: 'No space before comma.' },
        { type: 'punctuation', pattern: /\s+\./g, replacement: '.', message: 'No space before period.' },
        { type: 'punctuation', pattern: /\s+\?/g, replacement: '?', message: 'No space before question mark.' },
        { type: 'punctuation', pattern: /\s+!/g, replacement: '!', message: 'No space before exclamation point.' },
        { type: 'punctuation', pattern: /,(?!\s)/g, replacement: ', ', message: 'Add space after comma.' },
        { type: 'punctuation', pattern: /\.(?!\s|$|\d)/g, replacement: '. ', message: 'Add space after period.' },
        { type: 'punctuation', pattern: /\?(?!\s|$)/g, replacement: '? ', message: 'Add space after question mark.' },
        { type: 'punctuation', pattern: /!(?!\s|$)/g, replacement: '! ', message: 'Add space after exclamation point.' },
        { type: 'punctuation', pattern: /\b(i)\b/g, replacement: 'I', message: 'Capitalize the pronoun "I".' },
    ];
    
    // Functions
    function checkGrammar() {
        const text = textInput.value;
        
        if (!text.trim()) {
            showNotification('Please enter some text to check.', 'warning');
            return;
        }
        
        // Reset results
        issuesList.innerHTML = '';
        let grammarCount = 0;
        let spellingCount = 0;
        let punctuationCount = 0;
        let correctedTextContent = text;
        let issues = [];
        
        // Check for issues
        commonGrammarIssues.forEach(issue => {
            const matches = text.match(issue.pattern);
            if (matches) {
                const count = matches.length;
                
                if (issue.type === 'grammar') grammarCount += count;
                if (issue.type === 'spelling') spellingCount += count;
                if (issue.type === 'punctuation') punctuationCount += count;
                
                // Add to issues list
                issues.push({
                    type: issue.type,
                    message: issue.message,
                    original: matches[0],
                    replacement: matches[0].replace(issue.pattern, issue.replacement),
                    count: count
                });
                
                // Apply correction to the corrected text
                correctedTextContent = correctedTextContent.replace(issue.pattern, issue.replacement);
            }
        });
        
        // Update counts
        grammarIssues.textContent = grammarCount;
        spellingIssues.textContent = spellingCount;
        punctuationIssues.textContent = punctuationCount;
        
        // Calculate writing score (simple algorithm for demonstration)
        const totalIssues = grammarCount + spellingCount + punctuationCount;
        const textLength = text.length;
        let score = 100;
        
        if (textLength > 0) {
            // Deduct points based on issues per 100 characters
            const issueRate = (totalIssues / textLength) * 100;
            score = Math.max(0, Math.round(100 - (issueRate * 10)));
        }
        
        writingScore.textContent = score;
        
        // Display issues
        if (issues.length > 0) {
            const issuesHTML = issues.map(issue => {
                let iconClass = '';
                let colorClass = '';
                
                switch (issue.type) {
                    case 'grammar':
                        iconClass = 'fas fa-check-circle';
                        colorClass = 'text-teal-600';
                        break;
                    case 'spelling':
                        iconClass = 'fas fa-spell-check';
                        colorClass = 'text-cyan-600';
                        break;
                    case 'punctuation':
                        iconClass = 'fas fa-exclamation-circle';
                        colorClass = 'text-sky-600';
                        break;
                }
                
                return `
                <div class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div class="flex items-start">
                        <div class="flex-shrink-0 w-8 h-8 rounded-full bg-${issue.type === 'grammar' ? 'teal' : issue.type === 'spelling' ? 'cyan' : 'sky'}-100 flex items-center justify-center mr-3">
                            <i class="${iconClass} ${colorClass}"></i>
                        </div>
                        <div class="flex-1">
                            <h4 class="font-semibold text-gray-800 capitalize">${issue.type} Issue</h4>
                            <p class="text-gray-600 mb-2">${issue.message}</p>
                            <div class="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                                <div class="bg-red-50 text-red-700 px-2 py-1 rounded">${issue.original}</div>
                                <div class="hidden sm:block"><i class="fas fa-arrow-right text-gray-400"></i></div>
                                <div class="block sm:hidden"><i class="fas fa-arrow-down text-gray-400"></i></div>
                                <div class="bg-green-50 text-green-700 px-2 py-1 rounded">${issue.replacement}</div>
                            </div>
                        </div>
                    </div>
                </div>
                `;
            }).join('');
            
            issuesList.innerHTML = issuesHTML;
        } else {
            issuesList.innerHTML = '<div class="text-center text-gray-500 py-8">No issues found in your text!</div>';
        }
        
        // Display corrected text
        correctedText.textContent = correctedTextContent;
        
        // Show results
        resultsContainer.classList.remove('hidden');
        
        // Scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    function applyCorrections() {
        const correctedContent = correctedText.textContent;
        textInput.value = correctedContent;
        showNotification('All corrections applied!', 'success');
    }
    
    function clearText() {
        textInput.value = '';
        resultsContainer.classList.add('hidden');
        textInput.focus();
    }
    
    function copyText() {
        textInput.select();
        document.execCommand('copy');
        showNotification('Text copied to clipboard!', 'success');
    }
    
    function insertSampleText() {
        textInput.value = `The student should of studied harder for there exam. Irregardless of the difficulty, they definately could of done better if they would of spent less time watching TV.

Me and him are going to the library to study. The teacher were very strict about the assignment, she don't accept late work.

The goverment is in the process of implementing new education policies. I recieved an email about the changes that occured last week.

The student accomodate there schedule to fit in more study time . They became more concious of there study habits.`;
        
        resultsContainer.classList.add('hidden');
    }
    
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