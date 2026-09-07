export type FlipFlopState = [boolean, boolean, boolean, boolean];

export type HistoryEntry = {
  cycle: number;
  dataIn: boolean;
  q: FlipFlopState;
  serialOut: boolean;
  timestamp: number;
};

export type SimulationState = {
  flipFlops: FlipFlopState;
  dataIn: boolean;
  cycle: number;
  history: HistoryEntry[];
  serialOut: boolean;
  droppedBits: boolean[];
};

export function createInitialState(): SimulationState {
  return {
    flipFlops: [false, false, false, false],
    dataIn: false,
    cycle: 0,
    history: [
      {
        cycle: 0,
        dataIn: false,
        q: [false, false, false, false],
        serialOut: false,
        timestamp: Date.now(),
      },
    ],
    serialOut: false,
    droppedBits: [],
  };
}

export function clockPulse(state: SimulationState): SimulationState {
  const [q0, q1, q2, q3] = state.flipFlops;
  const newFlipFlops: FlipFlopState = [state.dataIn, q0, q1, q2];
  const newCycle = state.cycle + 1;
  const newSerialOut = q3;

  const entry: HistoryEntry = {
    cycle: newCycle,
    dataIn: state.dataIn,
    q: newFlipFlops,
    serialOut: newSerialOut,
    timestamp: Date.now(),
  };

  return {
    ...state,
    flipFlops: newFlipFlops,
    serialOut: newSerialOut,
    cycle: newCycle,
    droppedBits: [...state.droppedBits, newSerialOut],
    history: [...state.history, entry],
  };
}

export function reset(_state: SimulationState): SimulationState {
  return createInitialState();
}

export function stepBack(state: SimulationState): SimulationState {
  if (state.history.length <= 1) return state;

  const newHistory = state.history.slice(0, -1);
  const prevEntry = newHistory[newHistory.length - 1];

  return {
    ...state,
    flipFlops: [...prevEntry.q] as FlipFlopState,
    serialOut: prevEntry.serialOut,
    cycle: prevEntry.cycle,
    history: newHistory,
    droppedBits: state.droppedBits.slice(0, -1),
  };
}

export function setDataIn(
  state: SimulationState,
  value: boolean
): SimulationState {
  return { ...state, dataIn: value };
}
