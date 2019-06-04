const in2post = require('./in2post');
const nfa = require('./nfa');

const search = require('./search');

let posExp = in2post('ab*|def');
let nfaobj = nfa(posExp);
// console.log(nfaobj);

let isFind = search(nfaobj, 'def');

// 正则表达式一〉后缀树一〉NFA一〉DFA

console.log(isFind);
