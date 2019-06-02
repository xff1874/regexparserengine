let stateCount = -1;
/**
 *
 * @param {*} isEnd
 * @param {*} transition symbol
 * @param {*} epsilonTransistions when union, epsilon gets two path
 */

function createState(isEnd) {
    stateCount++;
    return {
        isEnd,
        transition: {},
        epsilonTransistions: [],
        name: `q${stateCount}`,
    };
}

function addTransition(start, end, symbol) {
    start.transition[symbol] = end;
}

function addEpsilonTransitions(start, end) {
    start.epsilonTransistions.push(end);
}

function createSymbolNfa(symbol) {
    let start = createState(false);
    let end = createState(true);
    addTransition(start, end, symbol);
    return { start, end };
}

function createEpsilonNfa() {
    let start = createState(false);
    let end = createState(true);
    addEpsilonTransitions(start, end);
    return { start, end };
}

/**
 * induction concat
 * @param {} postExp
 */

function concat(s, t) {
    addEpsilonTransitions(s.end, t.start);
    s.end.isEnd = false;
    return {
        start: s.start,
        end: t.end,
    };
}

/**union */
function union(s, t) {
    let start = createState(false);
    addEpsilonTransitions(start, s.start);
    addEpsilonTransitions(start, t.start);

    let end = createState(true);
    addEpsilonTransitions(s.end, end);
    addEpsilonTransitions(t.end, end);
    s.end.isEnd = false;
    t.end.isEnd = false;

    return { start, end };
}

/**
 * match S*
 * @param {closure} s
 */
function closure(s) {
    let start = createState(false);
    let end = createState(true);

    //start -> epslison->end
    addEpsilonTransitions(start, end);
    //start ->epsilion->nfa(s)
    addEpsilonTransitions(start, s.start);
    //nfa(s)->epsilion->end
    addEpsilonTransitions(s.end, end);
    s.end.isEnd = false;
    //nfa(s)->epsilion->nfa(s)
    addEpsilonTransitions(s.end, s.start);
    return { start, end };
}

function nfa(postExp) {
    if (postExp == '') {
        return createEpsilonNfa();
    }

    //stack hold the nfa node;
    let stack = [];

    for (const token of postExp) {
        if (token == '*') {
            stack.push(closure(stack.pop()));
        } else if (token == '|') {
            let end = stack.pop();
            let start = stack.pop();
            stack.push(union(start, end));
        } else if (token == '.') {
            let end = stack.pop();
            let start = stack.pop();
            stack.push(concat(start, end));
        } else {
            stack.push(createSymbolNfa(token));
        }
    }

    return stack.pop();
}

module.exports = nfa;
