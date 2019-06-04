function addNextState(state, nextStates, visited) {
    if (state.epsilonTransistions.length) {
        for (const st of state.epsilonTransistions) {
            if (!visited.find(vs => vs === st)) {
                visited.push(st);
                addNextState(st, nextStates, visited);
            }
        }
    } else {
        nextStates.push(state);
    }
}

function search(nfa, word) {
    let currentStates = [];
    addNextState(nfa.start, currentStates, []);

    for (const c of word) {
        const temp = [];
        for (const cs of currentStates) {
            let ns = cs.transition[c];
            if (ns) {
                addNextState(ns, temp, []);
            }
        }
        currentStates = temp;
    }

    return currentStates.find(s => s.isEnd) ? true : false;
}

function getEpsilionClousre(state, nextStates, visited) {
    // let visited = [state];
    if (state.epsilonTransistions.length) {
        for (const st of state.epsilonTransistions) {
            if (!visited.find(vs => vs === st)) {
                visited.push(st);
                getEpsilionClousre(st, nextStates, visited);
            }
        }
    } else {
        nextStates.push(state);
    }
}

module.exports = search;
