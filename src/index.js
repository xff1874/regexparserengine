const in2post = require('./in2post');
const nfa = require('./nfa');

const search = require('./search');

let posExp = in2post('a*b');
let nfaobj = nfa(posExp);

let isFind = search(nfaobj, 'b');

console.log(isFind);
