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

/**
 * 如下
 * https://juejin.im/post/5c738dd5e51d457fcb40aaaa
 * 如果遇到字母，将其输出
 * 如果遇到左括号，将其入栈
 * 如果遇到右括号，将栈元素弹出并输出直到遇到左括号为止。左括号只弹出不输出
 * 如果遇到限定符，依次弹出栈顶优先级大于或等于该限定符的限定符，然后将其入栈
 * 如果读到了输入的末尾，则将栈中所有元素依次弹出
 *
 * @param {规则} exp
 */

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
    // let postExp = convertInfix2Post('(a|b)*·c'); //ab|*c·
    let postExp = convertInfix2Post(concatExp); //ab|*c·

    console.log(
        `exp is ${exp} and concatExp is ${concatExp} and postExp is ${postExp}`
    );
    return postExp;
}

module.exports = in2post;
