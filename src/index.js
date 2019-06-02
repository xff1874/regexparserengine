const in2post = require('./in2post');
const nfa = require('./nfa');

let posExp = in2post('(a|b)*abb');
let re = nfa(posExp);
