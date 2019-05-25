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

function in2post(exp) {
    let concatExp = insertConcatSign(exp);
    console.log(concatExp);
}

module.exports = in2post;
