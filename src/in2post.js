/*
 * '(a|b)*abb' should be (a|b)*·a·b·b
 * 规则查看https://juejin.im/post/5c738dd5e51d457fcb40aaaa
 */
function insertConcatSign(exp) {
    let re = '';

    for (let i = 0; i < exp.length; i++) {
        let token = exp[i];
        re += token;
        if (token === '(' || token == '|') continue;

        if (i < exp.length - 1) {
            let lookahead = exp[i + 1];
            if (lookahead == '*' || lookahead == ')' || lookahead == '|')
                continue;

            re += '.';
        }
    }

    return re;
}

/**
 * use the stack stocking the operator.
 * rule is http://csis.pace.edu/~wolf/CS122/infix-postfix.htm
 * order | > * > .
 * @param {} exp
 * (a|b)*·c should be  ab|*c·
 */

const operatorOrder = function(operator) {
    switch (operator) {
        case '|':
            return 3;
        case '*':
            return 2;
        case '·':
            return 1;
        default:
            return 0;
    }
};

function convertInfix2Post(exp) {
    let re = '';
    let stack = [];
    for (let i = 0; i < exp.length; i++) {
        let token = exp[i];
        if (token == '(') {
            stack.push(token);
        } else if (token == ')') {
            while (stack[stack.length - 1] != '(') {
                re += stack.pop();
            }
            stack.pop();
        } else if (token == '|' || token == '*' || token == '·') {
            while (
                stack[stack.length - 1] &&
                operatorOrder(stack[stack.length - 1]) >= operatorOrder(token)
            ) {
                re += stack.pop();
            }
            stack.push(token);
        } else {
            re += token;
        }
    }

    while (stack.length) {
        re += stack.pop();
    }
    return re;
}

function in2post(exp) {
    let concatExp = insertConcatSign(exp);
    let postExp = convertInfix2Post('(a|b)*·c'); //ab|*c·
    console.log(postExp);
}

module.exports = in2post;
