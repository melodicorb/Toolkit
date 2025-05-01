// Ultimate Student Toolkit - Scientific Calculator

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const calcDisplay = document.getElementById('calc-display');
    const calcHistory = document.getElementById('calc-history');
    const clearBtn = document.getElementById('clear-btn');
    const equalsBtn = document.getElementById('equals-btn');
    const numberBtns = document.querySelectorAll('.number-btn');
    const operatorBtns = document.querySelectorAll('.operator-btn');
    const functionBtns = document.querySelectorAll('.function-btn');
    const memoryBtns = document.querySelectorAll('.memory-btn');
    
    // Calculator State
    let displayValue = '0';
    let pendingValue = '';
    let lastOperation = '';
    let calculationHistory = '';
    let memoryValue = 0;
    let expectingOperand = false;
    let decimalAdded = false;
    let bracketOpen = 0;
    
    // Initialize Calculator
    updateDisplay();
    
    // Event Listeners
    numberBtns.forEach(button => {
        button.addEventListener('click', () => {
            inputNumber(button.textContent);
        });
    });
    
    operatorBtns.forEach(button => {
        button.addEventListener('click', () => {
            inputOperator(button.textContent);
        });
    });
    
    functionBtns.forEach(button => {
        button.addEventListener('click', () => {
            inputFunction(button.textContent);
        });
    });
    
    memoryBtns.forEach(button => {
        button.addEventListener('click', () => {
            handleMemory(button.textContent);
        });
    });
    
    clearBtn.addEventListener('click', clearCalculator);
    equalsBtn.addEventListener('click', calculateResult);
    
    // Add keyboard support
    document.addEventListener('keydown', handleKeyboardInput);
    
    // Calculator Functions
    function inputNumber(number) {
        if (expectingOperand) {
            displayValue = '';
            expectingOperand = false;
            decimalAdded = false;
        }
        
        // Handle decimal point
        if (number === '.') {
            if (!decimalAdded) {
                decimalAdded = true;
                if (displayValue === '0' || displayValue === '') {
                    displayValue = '0.';
                } else {
                    displayValue += '.';
                }
            }
        } else {
            // Handle numbers
            if (displayValue === '0') {
                displayValue = number;
            } else {
                displayValue += number;
            }
        }
        
        updateDisplay();
    }
    
    function inputOperator(operator) {
        // Convert display operators to calculation operators
        const operatorMap = {
            '×': '*',
            '÷': '/',
            '+': '+',
            '-': '-'
        };
        
        // If there's a pending operation, calculate it first
        if (pendingValue && lastOperation && !expectingOperand) {
            calculateResult();
        }
        
        pendingValue = displayValue;
        lastOperation = operatorMap[operator];
        expectingOperand = true;
        
        // Update history display
        calculationHistory = pendingValue + ' ' + operator + ' ';
        calcHistory.textContent = calculationHistory;
    }
    
    function inputFunction(func) {
        switch(func) {
            case 'sin':
                applyTrigFunction(Math.sin);
                break;
            case 'cos':
                applyTrigFunction(Math.cos);
                break;
            case 'tan':
                applyTrigFunction(Math.tan);
                break;
            case 'log':
                applyMathFunction(Math.log10);
                break;
            case 'ln':
                applyMathFunction(Math.log);
                break;
            case '√':
                applyMathFunction(Math.sqrt);
                break;
            case '^':
                inputOperator('^');
                break;
            case '()':
                handleBrackets();
                break;
            case 'π':
                insertConstant(Math.PI);
                break;
            case 'e':
                insertConstant(Math.E);
                break;
            case '|x|':
                applyMathFunction(Math.abs);
                break;
            case 'x!':
                calculateFactorial();
                break;
        }
    }
    
    function applyTrigFunction(func) {
        try {
            // Convert to radians if needed
            const value = parseFloat(displayValue);
            const result = func(value);
            displayValue = formatResult(result);
            expectingOperand = true;
            updateDisplay();
        } catch (error) {
            displayError();
        }
    }
    
    function applyMathFunction(func) {
        try {
            const value = parseFloat(displayValue);
            const result = func(value);
            
            if (isNaN(result) || !isFinite(result)) {
                displayError();
                return;
            }
            
            displayValue = formatResult(result);
            expectingOperand = true;
            updateDisplay();
        } catch (error) {
            displayError();
        }
    }
    
    function insertConstant(value) {
        displayValue = value.toString();
        expectingOperand = true;
        updateDisplay();
    }
    
    function handleBrackets() {
        // Simple bracket handling - toggle open/close
        if (bracketOpen > 0) {
            displayValue += ')';
            bracketOpen--;
        } else {
            if (displayValue === '0') {
                displayValue = '(';
            } else {
                displayValue += '(';
            }
            bracketOpen++;
        }
        updateDisplay();
    }
    
    function calculateFactorial() {
        try {
            const num = parseInt(displayValue);
            if (num < 0) {
                displayError();
                return;
            }
            
            let result = 1;
            for (let i = 2; i <= num; i++) {
                result *= i;
            }
            
            displayValue = formatResult(result);
            expectingOperand = true;
            updateDisplay();
        } catch (error) {
            displayError();
        }
    }
    
    function handleMemory(action) {
        switch(action) {
            case 'MC': // Memory Clear
                memoryValue = 0;
                break;
            case 'MR': // Memory Recall
                displayValue = memoryValue.toString();
                expectingOperand = true;
                updateDisplay();
                break;
            case 'M+': // Memory Add
                try {
                    memoryValue += parseFloat(displayValue);
                    expectingOperand = true;
                } catch (error) {
                    // Handle error silently
                }
                break;
        }
    }
    
    function calculateResult() {
        if (!pendingValue || expectingOperand) return;
        
        try {
            let result;
            const current = parseFloat(displayValue);
            const previous = parseFloat(pendingValue);
            
            switch(lastOperation) {
                case '+':
                    result = previous + current;
                    break;
                case '-':
                    result = previous - current;
                    break;
                case '*':
                    result = previous * current;
                    break;
                case '/':
                    if (current === 0) {
                        displayError();
                        return;
                    }
                    result = previous / current;
                    break;
                case '^':
                    result = Math.pow(previous, current);
                    break;
                default:
                    return;
            }
            
            // Update history
            calculationHistory += displayValue + ' = ';
            calcHistory.textContent = calculationHistory;
            
            // Update display with result
            displayValue = formatResult(result);
            pendingValue = '';
            lastOperation = '';
            expectingOperand = true;
            updateDisplay();
        } catch (error) {
            displayError();
        }
    }
    
    function clearCalculator() {
        displayValue = '0';
        pendingValue = '';
        lastOperation = '';
        calculationHistory = '';
        expectingOperand = false;
        decimalAdded = false;
        bracketOpen = 0;
        updateDisplay();
        calcHistory.textContent = '';
    }
    
    function displayError() {
        displayValue = 'Error';
        expectingOperand = true;
        updateDisplay();
    }
    
    function formatResult(result) {
        // Format the result to avoid extremely long numbers
        if (Math.abs(result) < 1e-10) return '0';
        
        // Check if it's a whole number
        if (Number.isInteger(result)) return result.toString();
        
        // Otherwise format with appropriate precision
        return result.toPrecision(10).replace(/\.?0+$/, '');
    }
    
    function updateDisplay() {
        calcDisplay.textContent = displayValue;
    }
    
    function handleKeyboardInput(event) {
        const key = event.key;
        
        // Prevent default behavior for calculator keys
        if (/[0-9\.\+\-\*\/\(\)=]/.test(key)) {
            event.preventDefault();
        }
        
        // Handle number keys
        if (/[0-9\.]/.test(key)) {
            inputNumber(key);
        }
        
        // Handle operator keys
        switch(key) {
            case '+':
            case '-':
                inputOperator(key);
                break;
            case '*':
                inputOperator('×');
                break;
            case '/':
                inputOperator('÷');
                break;
            case 'Enter':
            case '=':
                calculateResult();
                break;
            case 'Escape':
            case 'Delete':
            case 'Backspace':
                clearCalculator();
                break;
            case '(':
            case ')':
                handleBrackets();
                break;
        }
    }
});