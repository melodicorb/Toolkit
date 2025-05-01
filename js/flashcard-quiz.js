// Ultimate Student Toolkit - Flashcard Quiz

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
    
    // DOM Elements - Quiz Area
    const quizArea = document.getElementById('quiz-area');
    const backToDecksBtn = document.getElementById('back-to-decks');
    const editDeckBtn = document.getElementById('edit-deck-btn');
    const addQuestionBtn = document.getElementById('add-question-btn');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    
    // DOM Elements - Quiz Display
    const quizDisplay = document.getElementById('quiz-display');
    const questionsList = document.getElementById('questions-list');
    const questionCounter = document.getElementById('question-counter');
    const quizScore = document.getElementById('quiz-score');
    const questionCard = document.getElementById('question-card');
    const questionText = document.getElementById('question-text');
    const answerOptions = document.getElementById('answer-options');
    const prevQuestionBtn = document.getElementById('prev-question-btn');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const checkAnswerBtn = document.getElementById('check-answer-btn');
    const endQuizBtn = document.getElementById('end-quiz-btn');
    
    // DOM Elements - Quiz Results
    const quizResults = document.getElementById('quiz-results');
    const finalScore = document.getElementById('final-score');
    const scoreBreakdown = document.getElementById('score-breakdown');
    const retryQuizBtn = document.getElementById('retry-quiz-btn');
    const reviewAnswersBtn = document.getElementById('review-answers-btn');
    
    // DOM Elements - Question Modal
    const questionModal = document.getElementById('question-modal');
    const closeQuestionModal = document.getElementById('close-question-modal');
    const questionForm = document.getElementById('question-form');
    const cancelQuestionBtn = document.getElementById('cancel-question-btn');
    
    // Quiz State
    let quizDecks = [];
    let currentDeckIndex = -1;
    let currentQuestionIndex = -1;
    let quizInProgress = false;
    let userAnswers = [];
    let selectedAnswer = null;
    
    // Initialize with local storage data or sample data
    initializeQuizData();
    
    // Event Listeners - Deck Management
    createDeckBtn.addEventListener('click', () => {
        document.getElementById('deck-modal-title').textContent = 'Create New Quiz';
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
        
        if (document.getElementById('deck-modal-title').textContent === 'Create New Quiz') {
            // Create new deck
            const newDeck = {
                id: Date.now(),
                name: deckName,
                description: deckDescription,
                category: deckCategory,
                questions: [],
                dateCreated: new Date()
            };
            
            quizDecks.push(newDeck);
        } else {
            // Edit existing deck
            quizDecks[currentDeckIndex].name = deckName;
            quizDecks[currentDeckIndex].description = deckDescription;
            quizDecks[currentDeckIndex].category = deckCategory;
        }
        
        deckModal.classList.add('hidden');
        renderDeckList();
        saveQuizData();
    });
    
    // Event Listeners - Quiz Area
    backToDecksBtn.addEventListener('click', () => {
        quizArea.classList.add('hidden');
        quizDisplay.classList.add('hidden');
        quizResults.classList.add('hidden');
        currentDeckIndex = -1;
    });
    
    editDeckBtn.addEventListener('click', () => {
        document.getElementById('deck-modal-title').textContent = 'Edit Quiz';
        document.getElementById('deck-name').value = quizDecks[currentDeckIndex].name;
        document.getElementById('deck-description').value = quizDecks[currentDeckIndex].description;
        document.getElementById('deck-category').value = quizDecks[currentDeckIndex].category;
        deckModal.classList.remove('hidden');
    });
    
    addQuestionBtn.addEventListener('click', () => {
        document.getElementById('question-modal-title').textContent = 'Add New Question';
        questionForm.reset();
        questionForm.removeAttribute('data-question-id');
        questionModal.classList.remove('hidden');
    });
    
    startQuizBtn.addEventListener('click', () => {
        if (quizDecks[currentDeckIndex].questions.length === 0) {
            alert('This quiz has no questions. Add some questions first!');
            return;
        }
        
        startQuiz();
    });
    
    shuffleBtn.addEventListener('click', () => {
        if (quizDecks[currentDeckIndex].questions.length === 0) {
            alert('This quiz has no questions to shuffle. Add some questions first!');
            return;
        }
        
        // Shuffle the questions
        quizDecks[currentDeckIndex].questions.sort(() => Math.random() - 0.5);
        renderQuestionsList();
    });
    
    // Event Listeners - Quiz Display
    prevQuestionBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            saveUserAnswer();
            currentQuestionIndex--;
            updateQuestionDisplay();
        }
    });
    
    nextQuestionBtn.addEventListener('click', () => {
        if (currentQuestionIndex < quizDecks[currentDeckIndex].questions.length - 1) {
            saveUserAnswer();
            currentQuestionIndex++;
            updateQuestionDisplay();
        } else {
            // Last question, show results
            showQuizResults();
        }
    });
    
    checkAnswerBtn.addEventListener('click', () => {
        if (!selectedAnswer && selectedAnswer !== 0) {
            alert('Please select an answer first!');
            return;
        }
        
        const currentQuestion = quizDecks[currentDeckIndex].questions[currentQuestionIndex];
        const correctAnswerIndex = currentQuestion.correctAnswer;
        
        // Save user's answer
        saveUserAnswer();
        
        // Disable answer selection
        const optionElements = answerOptions.querySelectorAll('.answer-option');
        optionElements.forEach(option => {
            option.classList.add('pointer-events-none');
        });
        
        // Show correct/incorrect feedback
        optionElements.forEach((option, index) => {
            if (index === correctAnswerIndex) {
                option.classList.add('bg-green-100', 'border-green-300');
            } else if (index === selectedAnswer) {
                option.classList.add('bg-red-100', 'border-red-300');
            }
        });
        
        // Show explanation if available
        if (currentQuestion.explanation) {
            const explanationDiv = document.createElement('div');
            explanationDiv.className = 'mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md';
            explanationDiv.innerHTML = `
                <p class="text-sm font-medium text-blue-800">Explanation:</p>
                <p class="text-sm text-blue-700">${currentQuestion.explanation}</p>
            `;
            questionCard.querySelector('#question-content').appendChild(explanationDiv);
        }
        
        // Change button to "Next Question"
        checkAnswerBtn.innerHTML = '<i class="fas fa-arrow-right mr-2"></i>Next Question';
        checkAnswerBtn.removeEventListener('click', checkAnswerBtn.clickHandler);
        
        checkAnswerBtn.clickHandler = () => {
            if (currentQuestionIndex < quizDecks[currentDeckIndex].questions.length - 1) {
                currentQuestionIndex++;
                updateQuestionDisplay();
            } else {
                showQuizResults();
            }
        };
        
        checkAnswerBtn.addEventListener('click', checkAnswerBtn.clickHandler);
    });
    
    endQuizBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to end the quiz? Your progress will be saved.')) {
            showQuizResults();
        }
    });
    
    // Event Listeners - Quiz Results
    retryQuizBtn.addEventListener('click', () => {
        startQuiz();
    });
    
    reviewAnswersBtn.addEventListener('click', () => {
        quizResults.classList.add('hidden');
        currentQuestionIndex = 0;
        quizInProgress = false;
        updateQuestionDisplay(true); // true = review mode
    });
    
    // Event Listeners - Question Modal
    closeQuestionModal.addEventListener('click', () => {
        questionModal.classList.add('hidden');
    });
    
    cancelQuestionBtn.addEventListener('click', () => {
        questionModal.classList.add('hidden');
    });
    
    questionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const questionText = document.getElementById('question-text-input').value;
        const explanation = document.getElementById('explanation').value;
        
        // Get answer options
        const options = [];
        for (let i = 1; i <= 4; i++) {
            options.push(document.getElementById(`option-${i}`).value);
        }
        
        // Get correct answer
        const correctAnswer = parseInt(document.querySelector('input[name="correct-answer"]:checked').value);
        
        if (document.getElementById('question-modal-title').textContent === 'Add New Question') {
            // Add new question
            const newQuestion = {
                id: Date.now(),
                question: questionText,
                options: options,
                correctAnswer: correctAnswer,
                explanation: explanation,
                dateCreated: new Date()
            };
            
            quizDecks[currentDeckIndex].questions.push(newQuestion);
        } else {
            // Edit existing question
            const questionId = parseInt(questionForm.dataset.questionId);
            const questionIndex = quizDecks[currentDeckIndex].questions.findIndex(q => q.id === questionId);
            
            quizDecks[currentDeckIndex].questions[questionIndex].question = questionText;
            quizDecks[currentDeckIndex].questions[questionIndex].options = options;
            quizDecks[currentDeckIndex].questions[questionIndex].correctAnswer = correctAnswer;
            quizDecks[currentDeckIndex].questions[questionIndex].explanation = explanation;
        }
        
        questionModal.classList.add('hidden');
        renderQuestionsList();
        saveQuizData();
    });
    
    // Functions
    function initializeQuizData() {
        // Try to load from localStorage
        const savedQuizData = localStorage.getItem('flashcardQuizData');
        
        if (savedQuizData) {
            quizDecks = JSON.parse(savedQuizData);
        } else {
            // Initialize with sample data
            quizDecks = [
                {
                    id: 1,
                    name: 'Basic Science Quiz',
                    description: 'Test your knowledge of basic science concepts',
                    category: 'science',
                    questions: [
                        {
                            id: 101,
                            question: 'What is the chemical symbol for water?',
                            options: ['H2O', 'CO2', 'O2', 'NaCl'],
                            correctAnswer: 0,
                            explanation: 'Water is composed of two hydrogen atoms and one oxygen atom, represented as H2O.',
                            dateCreated: new Date()
                        },
                        {
                            id: 102,
                            question: 'Which planet is known as the Red Planet?',
                            options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
                            correctAnswer: 1,
                            explanation: 'Mars appears reddish because of iron oxide (rust) on its surface.',
                            dateCreated: new Date()
                        },
                        {
                            id: 103,
                            question: 'What is the largest organ in the human body?',
                            options: ['Heart', 'Liver', 'Skin', 'Brain'],
                            correctAnswer: 2,
                            explanation: 'The skin is the largest organ, covering about 20 square feet in adults.',
                            dateCreated: new Date()
                        }
                    ],
                    dateCreated: new Date()
                }
            ];
        }
        
        renderDeckList();
    }
    
    function saveQuizData() {
        localStorage.setItem('flashcardQuizData', JSON.stringify(quizDecks));
    }
    
    function renderDeckList() {
        if (quizDecks.length === 0) {
            deckList.innerHTML = `
                <div class="empty-state text-center py-8 col-span-full">
                    <div class="text-4xl text-purple-200 mb-2"><i class="fas fa-question-circle"></i></div>
                    <p class="text-gray-500">No quiz decks yet</p>
                    <p class="text-gray-500 text-sm">Click the Create New Quiz button to get started</p>
                </div>
            `;
            return;
        }
        
        deckList.innerHTML = '';
        
        quizDecks.forEach((deck, index) => {
            const deckCard = document.createElement('div');
            deckCard.className = 'bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300';
            
            const questionCount = deck.questions.length;
            const categoryColor = getCategoryColor(deck.category);
            
            deckCard.innerHTML = `
                <div class="p-6">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="text-lg font-semibold text-gray-800">${deck.name}</h3>
                        <span class="px-2 py-1 text-xs rounded-full ${categoryColor}">${deck.category}</span>
                    </div>
                    <p class="text-gray-600 text-sm mb-3">${deck.description || 'No description'}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-500">
                            <i class="fas fa-question-circle mr-1"></i>${questionCount} question${questionCount !== 1 ? 's' : ''}
                        </span>
                        <div class="flex space-x-1">
                            <button class="edit-deck-btn px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition duration-300">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="delete-deck-btn px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition duration-300">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <button class="open-deck-btn w-full py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 transition duration-300">
                    <i class="fas fa-play mr-2"></i>Open Quiz
                </button>
            `;
            
            deckList.appendChild(deckCard);
            
            // Add event listeners to deck buttons
            deckCard.querySelector('.open-deck-btn').addEventListener('click', () => {
                openDeck(index);
            });
            
            deckCard.querySelector('.edit-deck-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                editDeck(index);
            });
            
            deckCard.querySelector('.delete-deck-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteDeck(index);
            });
        });
    }
    
    function getCategoryColor(category) {
        const colors = {
            'general': 'bg-gray-100 text-gray-800',
            'science': 'bg-blue-100 text-blue-800',
            'math': 'bg-green-100 text-green-800',
            'language': 'bg-yellow-100 text-yellow-800',
            'history': 'bg-red-100 text-red-800',
            'arts': 'bg-pink-100 text-pink-800',
            'other': 'bg-purple-100 text-purple-800'
        };
        
        return colors[category] || colors['other'];
    }
    
    function openDeck(index) {
        currentDeckIndex = index;
        const deck = quizDecks[currentDeckIndex];
        
        // Update deck info
        document.getElementById('quiz-deck-name').textContent = deck.name;
        document.getElementById('quiz-deck-description').textContent = deck.description || 'No description';
        
        // Show quiz area
        quizArea.classList.remove('hidden');
        quizDisplay.classList.add('hidden');
        quizResults.classList.add('hidden');
        
        // Render questions list
        renderQuestionsList();
    }
    
    function editDeck(index) {
        currentDeckIndex = index;
        document.getElementById('deck-modal-title').textContent = 'Edit Quiz';
        document.getElementById('deck-name').value = quizDecks[index].name;
        document.getElementById('deck-description').value = quizDecks[index].description || '';
        document.getElementById('deck-category').value = quizDecks[index].category;
        deckModal.classList.remove('hidden');
    }
    
    function deleteDeck(index) {
        if (confirm(`Are you sure you want to delete the quiz "${quizDecks[index].name}"? This cannot be undone.`)) {
            quizDecks.splice(index, 1);
            renderDeckList();
            saveQuizData();
        }
    }
    
    function renderQuestionsList() {
        const questions = quizDecks[currentDeckIndex].questions;
        
        if (questions.length === 0) {
            questionsList.innerHTML = `
                <div class="empty-state text-center py-8">
                    <div class="text-4xl text-purple-200 mb-2"><i class="fas fa-question-circle"></i></div>
                    <p class="text-gray-500">No questions in this quiz yet</p>
                    <p class="text-gray-500 text-sm">Click the Add Question button to create your first question</p>
                </div>
            `;
            return;
        }
        
        questionsList.innerHTML = '';
        
        questions.forEach((question, index) => {
            const questionCard = document.createElement('div');
            questionCard.className = 'bg-white rounded-xl shadow-md overflow-hidden';
            
            questionCard.innerHTML = `
                <div class="p-6">
                    <div class="flex justify-between items-start mb-3">
                        <h3 class="text-lg font-medium text-gray-800">${index + 1}. ${question.question}</h3>
                        <div class="flex space-x-1">
                            <button class="edit-question-btn px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition duration-300">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="delete-question-btn px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition duration-300">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                    <div class="space-y-2 mb-3">
                        ${question.options.map((option, i) => `
                            <div class="flex items-center">
                                <span class="inline-block w-6 h-6 rounded-full ${i === question.correctAnswer ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'} flex items-center justify-center text-xs font-medium mr-2">${String.fromCharCode(65 + i)}</span>
                                <span class="text-gray-700">${option}</span>
                                ${i === question.correctAnswer ? '<span class="ml-2 text-green-500 text-xs"><i class="fas fa-check"></i> Correct</span>' : ''}
                            </div>
                        `).join('')}
                    </div>
                    ${question.explanation ? `
                        <div class="text-sm text-gray-600 border-t border-gray-100 pt-2">
                            <span class="font-medium">Explanation:</span> ${question.explanation}
                        </div>
                    ` : ''}
                </div>
            `;
            
            questionsList.appendChild(questionCard);
            
            // Add event listeners to question buttons
            questionCard.querySelector('.edit-question-btn').addEventListener('click', () => {
                editQuestion(question.id);
            });
            
            questionCard.querySelector('.delete-question-btn').addEventListener('click', () => {
                deleteQuestion(question.id);
            });
        });
    }
    
    function editQuestion(questionId) {
        const questionIndex = quizDecks[currentDeckIndex].questions.findIndex(q => q.id === questionId);
        const question = quizDecks[currentDeckIndex].questions[questionIndex];
        
        document.getElementById('question-modal-title').textContent = 'Edit Question';
        document.getElementById('question-text-input').value = question.question;
        document.getElementById('explanation').value = question.explanation || '';
        
        // Set answer options
        for (let i = 1; i <= 4; i++) {
            document.getElementById(`option-${i}`).value = question.options[i-1] || '';
        }
        
        // Set correct answer
        document.getElementById(`option-${question.correctAnswer + 1}-correct`).checked = true;
        
        // Set question ID for form submission
        questionForm.dataset.questionId = questionId;
        
        questionModal.classList.remove('hidden');
    }
    
    function deleteQuestion(questionId) {
        const questionIndex = quizDecks[currentDeckIndex].questions.findIndex(q => q.id === questionId);
        const question = quizDecks[currentDeckIndex].questions[questionIndex];
        
        if (confirm(`Are you sure you want to delete this question? This cannot be undone.`)) {
            quizDecks[currentDeckIndex].questions.splice(questionIndex, 1);
            renderQuestionsList();
            saveQuizData();
        }
    }
    
    function startQuiz() {
        // Reset quiz state
        currentQuestionIndex = 0;
        quizInProgress = true;
        userAnswers = new Array(quizDecks[currentDeckIndex].questions.length).fill(null);
        selectedAnswer = null;
        
        // Show quiz display
        quizDisplay.classList.remove('hidden');
        quizResults.classList.add('hidden');
        questionsList.classList.add('hidden');
        
        // Update display
        updateQuestionDisplay();
    }
    
    function updateQuestionDisplay(reviewMode = false) {
        const questions = quizDecks[currentDeckIndex].questions;
        const currentQuestion = questions[currentQuestionIndex];
        
        // Update question counter
        questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
        
        // Update score display
        const answeredCount = userAnswers.filter(a => a !== null).length;
        const correctCount = userAnswers.reduce((count, answer, index) => {
            if (answer === questions[index].correctAnswer) {
                return count + 1;
            }
            return count;
        }, 0);
        
        quizScore.textContent = `Score: ${correctCount}/${answeredCount}`;
        
        // Update question text
        questionText.textContent = currentQuestion.question;
        
        // Clear previous answer options
        answerOptions.innerHTML = '';
        
        // Add answer options
        currentQuestion.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'answer-option p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition duration-200';
            
            // In review mode, show correct/incorrect indicators
            if (reviewMode) {
                if (index === currentQuestion.correctAnswer) {
                    optionDiv.classList.add('bg-green-100', 'border-green-300');
                } else if (index === userAnswers[currentQuestionIndex] && userAnswers[currentQuestionIndex] !== currentQuestion.correctAnswer) {
                    optionDiv.classList.add('bg-red-100', 'border-red-300');
                }
                optionDiv.classList.add('pointer-events-none');
            }
            
            // If user already answered this question, select their answer
            if (userAnswers[currentQuestionIndex] === index && !reviewMode) {
                optionDiv.classList.add('bg-indigo-50', 'border-indigo-300');
                selectedAnswer = index;
            }
            
            optionDiv.innerHTML = `
                <div class="flex items-center">
                    <span class="inline-block w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-medium mr-3">${String.fromCharCode(65 + index)}</span>
                    <span>${option}</span>
                </div>
            `;
            
            answerOptions.appendChild(optionDiv);
            
            // Add click event for selecting answer (not in review mode)
            if (!reviewMode) {
                optionDiv.addEventListener('click', () => {
                    // Remove selection from all options
                    answerOptions.querySelectorAll('.answer-option').forEach(opt => {
                        opt.classList.remove('bg-indigo-50', 'border-indigo-300');
                    });
                    
                    // Add selection to clicked option
                    optionDiv.classList.add('bg-indigo-50', 'border-indigo-300');
                    selectedAnswer = index;
                });
            }
        });
        
        // In review mode, show explanation
        if (reviewMode && currentQuestion.explanation) {
            const explanationDiv = document.createElement('div');
            explanationDiv.className = 'mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md';
            explanationDiv.innerHTML = `
                <p class="text-sm font-medium text-blue-800">Explanation:</p>
                <p class="text-sm text-blue-700">${currentQuestion.explanation}</p>
            `;
            questionCard.querySelector('#question-content').appendChild(explanationDiv);
        }
        
        // Update button states
        prevQuestionBtn.disabled = currentQuestionIndex === 0;
        prevQuestionBtn.classList.toggle('opacity-50', currentQuestionIndex === 0);
        
        nextQuestionBtn.disabled = currentQuestionIndex === questions.length - 1;
        nextQuestionBtn.classList.toggle('opacity-50', currentQuestionIndex === questions.length - 1);
        
        // Reset check answer button
        if (!reviewMode) {
            checkAnswerBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Check Answer';
            if (checkAnswerBtn.clickHandler) {
                checkAnswerBtn.removeEventListener('click', checkAnswerBtn.clickHandler);
                delete checkAnswerBtn.clickHandler;
            }
        } else {
            // In review mode, hide check answer button
            checkAnswerBtn.classList.add('hidden');
        }
    }
    
    function saveUserAnswer() {
        if (selectedAnswer !== null) {
            userAnswers[currentQuestionIndex] = selectedAnswer;
            selectedAnswer = null;
        }
    }
    
    function showQuizResults() {
        // Save final answer if needed
        saveUserAnswer();
        
        // Calculate score
        const questions = quizDecks[currentDeckIndex].questions;
        const answeredCount = userAnswers.filter(a => a !== null).length;
        const correctCount = userAnswers.reduce((count, answer, index) => {
            if (answer === questions[index].correctAnswer) {
                return count + 1;
            }
            return count;
        }, 0);
        
        const scorePercentage = Math.round((correctCount / questions.length) * 100);
        
        // Update final score display
        finalScore.textContent = `Your score: ${correctCount}/${questions.length} (${scorePercentage}%)`;
        
        // Generate score breakdown
        let breakdownHTML = '<ul class="text-left space-y-2">';
        
        questions.forEach((question, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            const icon = isCorrect ? 
                '<i class="fas fa-check text-green-500 mr-2"></i>' : 
                '<i class="fas fa-times text-red-500 mr-2"></i>';
            
            breakdownHTML += `
                <li class="flex items-start">
                    <span class="mr-2">${index + 1}.</span>
                    <div>
                        <div class="flex items-center">
                            ${icon}
                            <span class="${isCorrect ? 'text-green-700' : 'text-red-700'} font-medium">
                                ${isCorrect ? 'Correct' : 'Incorrect'}
                            </span>
                        </div>
                        <p class="text-sm text-gray-600 mt-1">${question.question}</p>
                    </div>
                </li>
            `;
        });
        
        breakdownHTML += '</ul>';
        scoreBreakdown.innerHTML = breakdownHTML;
        
        // Show results
        quizDisplay.classList.add('hidden');
        quizResults.classList.remove('hidden');
        questionsList.classList.add('hidden');
        
        // End quiz
        quizInProgress = false;
    }
});    