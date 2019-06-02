const in2post = require('./in2post');
const nfa = require('./nfa');

const search = require('./search');

let posExp = in2post('abc|def');
let nfaobj = nfa(posExp);
// console.log(nfaobj);

let isFind = search(nfaobj, 'def');

console.log(isFind);
