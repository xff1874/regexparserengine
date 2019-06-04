function getEpsilionClosure(state, nextStates, visited) {
    if (state.epsilonTransistions.length) {
        for (const se of state.epsilonTransistions) {
            if (!visited.find(vs => vs === se)) {
                visited.push(se);
                getEpsilionClosure(se, nextStates, visited);
            }
        }
    } else {
        nextStates.push(state);
    }
}

function search(nfa, word) {
    let currentStates = [];
    getEpsilionClosure(nfa.start, currentStates, []);

    for (const c of word) {
        let temp = [];
        for (const cs of currentStates) {
            let nextState = cs.transition[c];
            if (nextState) {
                getEpsilionClosure(nextState, temp, []);
            }
        }
        currentStates = temp;
    }

    return currentStates.find(cs => cs.isEnd) ? true : false;
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
