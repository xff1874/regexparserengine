const in2post = require('./in2post');
const nfa = require('./nfa');

const search = require('./search');

let posExp = in2post('abc|def');
let nfaobj = nfa(posExp);
// console.log(nfaobj);

let isFind = search(nfaobj, 'deff');

// 正则表达式一〉后缀树一〉NFA一〉DFA

console.log(isFind);
