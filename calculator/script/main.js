// global vars

var num1 = '';
var num2 = '';
var operator = '';

/*


    Infix
    
    
*/
//to judge which number sbould input
var flag = 0;
//check whether the operator click or not
var opFlag = 0;

var result = '';
var roundedResult = '';

//initial
$('#rpn').hide();
//function 

//switch calculator
$('#switch').click(function () {
    $('#infix').toggle();
    $('#rpn').toggle();
    num1 = '';
    num2 = '';
    operator = '';
    display.innerHTML = '';
    rpnDisplay.innerHTML = '';
});

/*
Infix calculator
*/
var display = document.getElementById('display');
//set number
function setValue(number) {
    if (flag === 0) {
        num1 += number;
        display.innerHTML += number;
    } else {
        num2 += number;
        display.innerHTML += number;
    }
}

//operator click
function oppClick(numericCode) {
    if (opFlag === 0) {
        operator = numericCode;
        var oppString = '';
        flag = 1;
        opFlag = 1;
        if (operator === 4) {
            display.innerHTML += '/';
            oppString = '/';
        } else if (operator === 3) {
            display.innerHTML += '*';
            oppString = '*';
        } else if (operator === 2) {
            display.innerHTML += '-';
            oppString = '-';
        } else {
            display.innerHTML += '+';
            oppString = '+';
        }
        //restrict the number of operator
        if (flag === 1) {
            display.innerHTML = num1 + oppString;
        }
    } else {
        equalClick();
        flag = 1;
        opFlag = 0;
        num1 = parseFloat(roundedResult);
        num2 = null;
        oppClick(numericCode);
    }
}

function equalClick() {
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);

    switch (true) {
        case (operator === 1):
            result = num1 + num2;
            break;
        case (operator === 2):
            result = num1 - num2;
            break;
        case (operator === 3):
            result = num1 * num2;
            break;
        case (operator === 4):
            result = num1 / num2;
            break;
    }
    //fix in 4
    roundedResult = result.toFixed(4);
    display.innerHTML = roundedResult;
}

// set decimal
function setDecimal() {
    if (flag === 0) {
        //little than 1
        if (num1 === "") {
            num1 = '0.';
            display.innerHTML = num1;
        }

        //greater than 1
        if (num1.indexOf('.') === -1) {
            num1 += '.';
            display.innerHTML = num1;
        }
    }

    if (flag === 1) {
        if (num2 === '') {
            num2 = '0.';
            display.innerHTML += num2;
        }

        if (num2.indexOf('.') === -1) {
            num2 += '.';

            setOppString();
        }
    }
}

// function setOppString
function setOppString() {
    if (operator === 4) {
        display.innerHTML = num1 + '/' + num2;
    } else if (operator === 3) {
        display.innerHTML = num1 + '*' + num2;
    } else if (operator === 2) {
        display.innerHTML = num1 + '-' + num2;
    } else {
        display.innerHTML = num1 + '+' + num2;
    }
}

/*


RPN calculator


*/


//properties
var enterFlag = 0;
var resultFlag = 0;
var rpnDisplay = document.getElementById('display2');
//functions
function setValue2(number) {
    if (resultFlag === 1) {
        console.log(result, num1, num2);
        num1 = roundedResult;
        num2 = null;
        resultFlag = 0;
        rpnDisplay.innerHTML += '  ';
        setValue2(number);
    } else {
        if (enterFlag === 0) {
            num1 += number;
            rpnDisplay.innerHTML += number;
        } else {
            num2 += number;
            rpnDisplay.innerHTML += number;
        }
    }
}

function enterClick() {
    rpnDisplay.innerHTML += '  ';
    enterFlag = 1;
}

function setDecimal2() {
    if (enterFlag === 0) {
        //little than 1
        if (num1 === "") {
            num1 = '0.';
            rpnDisplay.innerHTML = num1;
        }
        //greater than 1
        if (num1.indexOf('.') === -1) {
            num1 += '.';
            rpnDisplay.innerHTML = num1;
        }
    }
    if (enterFlag === 1) {
        if (num2 === '') {
            num2 = '0.';
            rpnDisplay.innerHTML += num2;
        }
        if (num2.indexOf('.') === -1) {
            num2 += '.';

            rpnDisplay.innerHTML = num1 + '  ' + num2;
        }
    }
}

function oppClick2(numericCode) {
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);
    operator = numericCode;

    switch (true) {
        case (operator === 1):
            result = num1 + num2;
            break;
        case (operator === 2):
            result = num1 - num2;
            break;
        case (operator === 3):
            result = num1 * num2;
            break;
        case (operator === 4):
            result = num1 / num2;
            break;
    }
    //si she wu ru
    roundedResult = result.toFixed(4);
    rpnDisplay.innerHTML = roundedResult;
    resultFlag = 1;
}
