document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('button');
    let firstOperand = null;
    let operator = null;
    let waitingForSecondOperand = false;

    function calculate(first, second, operator) {
        first = parseFloat(first);
        second = parseFloat(second);
        
        if (isNaN(first) || isNaN(second)) {
            throw new Error('Invalid number');
        }
        
        switch(operator) {
            case '+':
                return first + second;
            case '-':
                return first - second;
            case '*':
                return first * second;
            case '/':
                if (second === 0) {
                    throw new Error('Division by zero');
                }
                return first / second;
            default:
                return second;
        }
    }

    function handleNumber(value) {
        if (waitingForSecondOperand) {
            display.value = value;
            waitingForSecondOperand = false;
        } else {
            display.value = display.value === '0' ? value : display.value + value;
        }
    }

    function handleOperator(nextOperator) {
        const inputValue = display.value;

        if (operator && waitingForSecondOperand) {
            operator = nextOperator;
            return;
        }

        if (firstOperand === null && !isNaN(inputValue)) {
            firstOperand = inputValue;
        } else if (operator) {
            const result = calculate(firstOperand, inputValue, operator);
            display.value = `${parseFloat(result.toFixed(7))}`;
            firstOperand = display.value;
        }

        waitingForSecondOperand = true;
        operator = nextOperator;
    }

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const value = this.value;
            
            if (value === 'AC') {
                display.value = '0';
                firstOperand = null;
                operator = null;
                waitingForSecondOperand = false;
            } else if (value === 'DEL') {
                display.value = display.value.slice(0, -1);
                if (display.value === '') {
                    display.value = '0';
                }
            } else if (value === '+/-') {
                display.value = parseFloat(display.value) * -1;
            } else if ('+-*/'.includes(value)) {
                handleOperator(value);
            } else if (value === '=') {
                if (operator && firstOperand !== null) {
                    try {
                        const result = calculate(firstOperand, display.value, operator);
                        if (isNaN(result)) {
                            display.value = 'Error';
                        } else {
                            display.value = `${parseFloat(result.toFixed(7))}`;
                        }
                        firstOperand = null;
                        operator = null;
                        waitingForSecondOperand = false;
                    } catch (error) {
                        display.value = 'Error';
                        firstOperand = null;
                        operator = null;
                        waitingForSecondOperand = false;
                    }
                }
            } else {
                handleNumber(value);
            }
        });
    });
});
