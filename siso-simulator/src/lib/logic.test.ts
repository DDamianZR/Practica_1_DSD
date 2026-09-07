import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  clockPulse,
  reset,
  stepBack,
  setDataIn,
} from './logic';

describe('SISO Shift Register Simulation Engine', () => {
  it('creates initial state with all zeros', () => {
    const state = createInitialState();
    expect(state.flipFlops).toEqual([false, false, false, false]);
    expect(state.dataIn).toBe(false);
    expect(state.cycle).toBe(0);
    expect(state.serialOut).toBe(false);
    expect(state.droppedBits).toEqual([]);
    expect(state.history).toHaveLength(1);
  });

  it('reset returns all zeros', () => {
    let state = createInitialState();
    state = setDataIn(state, true);
    state = clockPulse(state);
    state = clockPulse(state);
    const resetState = reset(state);
    expect(resetState.flipFlops).toEqual([false, false, false, false]);
    expect(resetState.cycle).toBe(0);
    expect(resetState.serialOut).toBe(false);
    expect(resetState.droppedBits).toEqual([]);
  });

  it('one pulse with D=1 sets Q0=1', () => {
    let state = createInitialState();
    state = setDataIn(state, true);
    state = clockPulse(state);
    expect(state.flipFlops[0]).toBe(true);
    expect(state.flipFlops[1]).toBe(false);
    expect(state.flipFlops[2]).toBe(false);
    expect(state.flipFlops[3]).toBe(false);
  });

  it('4 pulses with D=1 fills all FFs', () => {
    let state = createInitialState();
    state = setDataIn(state, true);
    for (let i = 0; i < 4; i++) {
      state = clockPulse(state);
    }
    expect(state.flipFlops).toEqual([true, true, true, true]);
  });

  it('first bit exits as serialOut after 4 pulses (FIFO)', () => {
    let state = createInitialState();
    state = setDataIn(state, true);
    state = clockPulse(state); // Q: [1,0,0,0]
    state = setDataIn(state, false);
    state = clockPulse(state); // Q: [0,1,0,0]
    state = clockPulse(state); // Q: [0,0,1,0]
    state = clockPulse(state); // Q: [0,0,0,1]
    expect(state.serialOut).toBe(false); // the 0 from q3
    state = clockPulse(state); // Q: [0,0,0,0], serialOut = 1 (the original 1 exits)
    expect(state.serialOut).toBe(true);
    expect(state.droppedBits).toContain(true);
  });

  it('shifts a pattern through correctly (1010)', () => {
    let state = createInitialState();
    const pattern = [true, false, true, false]; // input order
    for (const bit of pattern) {
      state = setDataIn(state, bit);
      state = clockPulse(state);
    }
    // After entering 1,0,1,0: Q = [0, 1, 0, 1] (last entered is Q0)
    expect(state.flipFlops).toEqual([false, true, false, true]);
  });

  it('step back restores previous state', () => {
    let state = createInitialState();
    state = setDataIn(state, true);
    state = clockPulse(state);
    const afterFirstPulse = { ...state };
    state = clockPulse(state);
    expect(state.cycle).toBe(2);
    state = stepBack(state);
    expect(state.cycle).toBe(afterFirstPulse.cycle);
    expect(state.flipFlops).toEqual(afterFirstPulse.flipFlops);
  });

  it('step back does nothing at cycle 0', () => {
    const state = createInitialState();
    const result = stepBack(state);
    expect(result.cycle).toBe(0);
    expect(result.flipFlops).toEqual([false, false, false, false]);
  });

  it('history tracks all entries', () => {
    let state = createInitialState();
    state = setDataIn(state, true);
    state = clockPulse(state);
    state = setDataIn(state, false);
    state = clockPulse(state);
    state = clockPulse(state);
    expect(state.history).toHaveLength(4); // initial + 3 pulses
    expect(state.history[1].dataIn).toBe(true);
    expect(state.history[2].dataIn).toBe(false);
  });

  it('serialOut captures Q3 before shift', () => {
    let state = createInitialState();
    state = setDataIn(state, true);
    // Fill register: 4 pulses with D=1
    for (let i = 0; i < 4; i++) state = clockPulse(state);
    // Now Q=[1,1,1,1], next pulse pushes Q3=1 out
    state = setDataIn(state, false);
    state = clockPulse(state);
    expect(state.serialOut).toBe(true);
    expect(state.flipFlops).toEqual([false, true, true, true]);
  });
});
