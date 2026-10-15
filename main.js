// ===== 1) جلب العناصر =====
const numbers = document.querySelectorAll('.number, .zero');
const operations = document.querySelectorAll('.operation');
const clearBtn = document.querySelector('.clear');
const deleteBtn = document.querySelector('.delete');
const decimalBtn = document.querySelector('.decimal');
const equalBtn = document.querySelector('.equal');
const expressionDisplay = document.querySelector('.expression');
const currentDisplay = document.querySelector('.current');
// ===== 2) المتغيرات (حالة الحاسبة) =====
let currentInput = '0';   // الرقم اللي على الشاشة
let previousInput = '';   // الرقم الأول قبل العملية
let operator = null;      // العملية المختارة (+ - × ÷)
let shouldReset = false;  // لو true، الرقم الجاي يمسح الشاشة

// ===== 3) الدوال =====
function updateDisplay() {
    currentDisplay.textContent = currentInput;

    if (operator) {
        expressionDisplay.textContent = previousInput + ' ' + operator;
    } else {
        expressionDisplay.textContent = '';
    }
}

function appendNumber(num) {
    if (currentInput === '0' || shouldReset) {
        currentInput = num;
        shouldReset = false;
    } else if (currentInput.length < 12) {
        currentInput += num;
    }
    updateDisplay();
}

function appendDecimal() {
    if (shouldReset) {
        currentInput = '0.';
        shouldReset = false;
    } else if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}

function chooseOperator(op) {
    // لو في عملية قبل كده (مثلاً 5 + 3 ثم +) احسبها الأول
    if (operator && !shouldReset) {
        calculate();
    }
    previousInput = currentInput;
    operator = op;
    shouldReset = true;
    updateDisplay();
}

function calculate() {
    if (operator === null || shouldReset) return;

    const a = parseFloat(previousInput);
    const b = parseFloat(currentInput);
    let result;

    switch (operator) {
        case '+':
            result = a + b;
            break;
        case '-':
            result = a - b;
            break;
        case '×':
            result = a * b;
            break;
        case '÷':
            if (b === 0) {
                currentInput = 'Error';
                operator = null;
                previousInput = '';
                shouldReset = true;
                updateDisplay();
                return;
            }
            result = a / b;
            break;
    }

    // تقريب عشان 0.1 + 0.2 ما تطلعش 0.30000000000000004
    currentInput = String(Math.round(result * 1e8) / 1e8);
    operator = null;
    previousInput = '';
    shouldReset = true;
    updateDisplay();
}

function percent() {
    currentInput = String(parseFloat(currentInput) / 100);
    updateDisplay();
}

function clearAll() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    shouldReset = false;
    updateDisplay();
}

function deleteLast() {
    if (shouldReset) return;
    currentInput = currentInput.slice(0, -1);
    if (currentInput === '' || currentInput === '-') {
        currentInput = '0';
    }
    updateDisplay();
}

// ===== 4) ربط الأزرار بالدوال =====
numbers.forEach(function (button) {
    button.addEventListener('click', function () {
        appendNumber(button.textContent);
    });
});

operations.forEach(function (button) {
    button.addEventListener('click', function () {
        if (button.textContent === '%') {
            percent();
        } else {
            chooseOperator(button.textContent);
        }
    });
});

decimalBtn.addEventListener('click', appendDecimal);
equalBtn.addEventListener('click', calculate);
clearBtn.addEventListener('click', clearAll);
deleteBtn.addEventListener('click', deleteLast);