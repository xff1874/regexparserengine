function addNextState(state, nextStates) {
    if (state.epsilonTransistions.length) {
        for (const st of state.epsilonTransistions) {
            addNextState(st, nextStates);
        }
    } else {
        nextStates.push(state);
    }
}

function search(nfa, word) {
    let currentStates = [];
    addNextState(nfa.start, currentStates);

    for (const symbol of word) {
        const nextStates = [];
        for (const state of currentStates) {
            const nextState = state.transition[symbol];
            if (nextState) {
                addNextState(nextState, nextStates);
            }
            currentStates = nextStates;
        }
    }

    return currentStates.find(s => s.isEnd) ? true : false;
}

module.exports = search;
