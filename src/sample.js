/*
  Thompson NFA Construction and Search.
*/

/*
  A state in Thompson's NFA can either have
   - a single symbol transition to a state
    or
   - up to two epsilon transitions to another states
  but not both.
*/

let statecount = -1;
function createState(isEnd) {
    statecount++;
    return {
        isEnd,
        transition: {},
        epsilonTransitions: [],
        name: `p${statecount}`,
    };
}

function addEpsilonTransition(from, to) {
    from.epsilonTransitions.push(to);
}

/*
  Thompson's NFA state can have only one transition to another state for a given symbol.
*/
function addTransition(from, to, symbol) {
    from.transition[symbol] = to;
}

/*
  Construct an NFA that recognizes only the empty string.
*/
function fromEpsilon() {
    const start = createState(false);
    const end = createState(true);
    addEpsilonTransition(start, end);

    return { start, end };
}

/*
   Construct an NFA that recognizes only a single character stirng.
*/
function fromSymbol(symbol) {
    const start = createState(false);
    const end = createState(true);
    addTransition(start, end, symbol);

    return { start, end };
}

/*
   Concatenates two NFAs.
*/
function concat(first, second) {
    addEpsilonTransition(first.end, second.start);
    first.end.isEnd = false;

    return { start: first.start, end: second.end };
}

/*
   Unions two NFAs.
*/
function union(first, second) {
    const start = createState(false);
    addEpsilonTransition(start, first.start);
    addEpsilonTransition(start, second.start);

    const end = createState(true);

    addEpsilonTransition(first.end, end);
    first.end.isEnd = false;
    addEpsilonTransition(second.end, end);
    second.end.isEnd = false;

    return { start, end };
}

/*
   Apply Closure (Kleene's Star) on an NFA.
*/
function closure(nfa) {
    const start = createState(false);
    const end = createState(true);

    addEpsilonTransition(start, end);
    addEpsilonTransition(start, nfa.start);

    addEpsilonTransition(nfa.end, end);
    addEpsilonTransition(nfa.end, nfa.start);
    nfa.end.isEnd = false;

    return { start, end };
}

/*
  Converts a postfix regular expression into a Thompson NFA.
*/
function toNFA(postfixExp) {
    if (postfixExp === '') {
        return fromEpsilon();
    }

    const stack = [];

    for (const token of postfixExp) {
        if (token === '*') {
            stack.push(closure(stack.pop()));
        } else if (token === '|') {
            const right = stack.pop();
            const left = stack.pop();
            stack.push(union(left, right));
        } else if (token === '.') {
            const right = stack.pop();
            const left = stack.pop();
            stack.push(concat(left, right));
        } else {
            stack.push(fromSymbol(token));
        }
    }

    return stack.pop();
}

/*
  Process a string through an NFA by recurisively (depth-first) traversing all the possible paths until finding a matching one.

  The NFA has N states, from each state it can go to at most N possible states, yet there might be at most 2^N possible paths,
  therefore, worst case it'll end up going through all of them until it finds a match (or not), resulting in very slow runtimes.
*/
function recursiveBacktrackingSearch(state, visited, input, position) {
    if (visited.includes(state)) {
        return false;
    }

    visited.push(state);

    if (position === input.length) {
        if (state.isEnd) {
            return true;
        }

        if (
            state.epsilonTransitions.some(s =>
                recursiveBacktrackingSearch(s, visited, input, position)
            )
        ) {
            return true;
        }
    } else {
        const nextState = state.transition[input[position]];

        if (nextState) {
            if (
                recursiveBacktrackingSearch(nextState, [], input, position + 1)
            ) {
                return true;
            }
        } else {
            if (
                state.epsilonTransitions.some(s =>
                    recursiveBacktrackingSearch(s, visited, input, position)
                )
            ) {
                return true;
            }
        }

        return false;
    }
}

/*
   Follows through the epsilon transitions of a state until reaching
   a state with a symbol transition which gets added to the set of next states.
*/
function addNextState(state, nextStates, visited) {
    if (state.epsilonTransitions.length) {
        for (const st of state.epsilonTransitions) {
            if (!visited.find(vs => vs === st)) {
                visited.push(st);
                addNextState(st, nextStates, visited);
            }
        }
    } else {
        nextStates.push(state);
    }
}

/*
  Process a string through an NFA. For each input symbol it transitions into in multiple states at the same time.
  The string is matched if after reading the last symbol, is has transitioned into at least one end state.
  For an NFA with N states in can be at at most N states at a time. This algorighm finds a match by processing the input word once.
*/
function search(nfa, word) {
    let currentStates = [];
    /* The initial set of current states is either the start state or
       the set of states reachable by epsilon transitions from the start state */
    addNextState(nfa.start, currentStates, []);

    for (const symbol of word) {
        const nextStates = [];

        for (const state of currentStates) {
            const nextState = state.transition[symbol];
            if (nextState) {
                addNextState(nextState, nextStates, []);
            }
        }

        currentStates = nextStates;
    }

    return currentStates.find(s => s.isEnd) ? true : false;
}

function recognize(nfa, word) {
    // return recursiveBacktrackingSearch(nfa.start, [], word, 0);
    return search(nfa, word);
}

function insertExplicitConcatOperator(exp) {
    let output = '';

    for (let i = 0; i < exp.length; i++) {
        const token = exp[i];
        output += token;

        if (token === '(' || token === '|') {
            continue;
        }

        if (i < exp.length - 1) {
            const lookahead = exp[i + 1];

            if (lookahead === '*' || lookahead === '|' || lookahead === ')') {
                continue;
            }

            output += '.';
        }
    }

    return output;
}

function peek(stack) {
    return stack.length && stack[stack.length - 1];
}

const operatorPrecedence = {
    '|': 0,
    '.': 1,
    '*': 2,
};

function toPostfix(exp) {
    let output = '';
    const operatorStack = [];

    for (const token of exp) {
        if (token === '.' || token === '|' || token === '*') {
            while (
                operatorStack.length &&
                peek(operatorStack) !== '(' &&
                operatorPrecedence[peek(operatorStack)] >=
                    operatorPrecedence[token]
            ) {
                output += operatorStack.pop();
            }

            operatorStack.push(token);
        } else if (token === '(' || token === ')') {
            if (token === '(') {
                operatorStack.push(token);
            } else {
                while (peek(operatorStack) !== '(') {
                    output += operatorStack.pop();
                }
                operatorStack.pop();
            }
        } else {
            output += token;
        }
    }

    while (operatorStack.length) {
        output += operatorStack.pop();
    }

    return output;
}

const postfixExp = toPostfix(insertExplicitConcatOperator('abc|def'));
const nfa = toNFA(postfixExp);

let re = search(nfa, 'def');
console.log(re);
