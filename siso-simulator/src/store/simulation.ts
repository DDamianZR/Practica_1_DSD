import { create } from 'zustand';
import {
  type SimulationState,
  type FlipFlopState,
  createInitialState,
  clockPulse as engineClockPulse,
  reset as engineReset,
  stepBack as engineStepBack,
  setDataIn as engineSetDataIn,
} from '../lib/logic';
import { playClockTick, playBitEnter, playReset } from '../lib/audio';

export type ViewTab = 'schematic' | 'breadboard' | 'timing' | 'table';

type AnimationState = {
  clockPulseActive: boolean;
  bitTraveling: boolean;
  resetWave: boolean;
  changedFlipFlops: boolean[];
  previousFlipFlops: FlipFlopState;
};

type AppState = SimulationState & {
  activeTab: ViewTab;
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  animationsEnabled: boolean;
  animationSpeed: number;
  autoClockEnabled: boolean;
  autoClockFrequency: number;
  isLoadingWord: boolean;
  loadingWordProgress: number;
  loadingWordTotal: number;
  showEducation: boolean;
  animation: AnimationState;

  setActiveTab: (tab: ViewTab) => void;
  toggleTheme: () => void;
  toggleSound: () => void;
  toggleAnimations: () => void;
  setAnimationSpeed: (speed: number) => void;
  setAutoClockFrequency: (freq: number) => void;
  toggleAutoClock: () => void;
  toggleDataIn: () => void;
  setDataIn: (value: boolean) => void;
  doClock: () => void;
  doReset: () => void;
  doStepBack: () => void;
  loadWord: (word: string) => Promise<void>;
  toggleEducation: () => void;
  clearAnimationState: () => void;
};

export const useSimStore = create<AppState>((set, get) => ({
  ...createInitialState(),

  activeTab: 'schematic',
  theme: 'dark',
  soundEnabled: false,
  animationsEnabled: true,
  animationSpeed: 1,
  autoClockEnabled: false,
  autoClockFrequency: 2,
  isLoadingWord: false,
  loadingWordProgress: 0,
  loadingWordTotal: 0,
  showEducation: false,
  animation: {
    clockPulseActive: false,
    bitTraveling: false,
    resetWave: false,
    changedFlipFlops: [false, false, false, false],
    previousFlipFlops: [false, false, false, false],
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  toggleTheme: () => {
    const newTheme = get().theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('light', newTheme === 'light');
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    set({ theme: newTheme });
  },

  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  toggleAnimations: () => set((s) => ({ animationsEnabled: !s.animationsEnabled })),
  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
  setAutoClockFrequency: (freq) => set({ autoClockFrequency: freq }),

  toggleAutoClock: () => set((s) => ({ autoClockEnabled: !s.autoClockEnabled })),

  toggleDataIn: () => {
    const state = get();
    const newVal = !state.dataIn;
    const updated = engineSetDataIn(state, newVal);
    if (state.soundEnabled) playBitEnter();
    set({ dataIn: updated.dataIn });
  },

  setDataIn: (value) => {
    const state = get();
    const updated = engineSetDataIn(state, value);
    set({ dataIn: updated.dataIn });
  },

  doClock: () => {
    const state = get();
    const previousFlipFlops: FlipFlopState = [...state.flipFlops];
    const newState = engineClockPulse(state);
    const changedFlipFlops = newState.flipFlops.map(
      (v, i) => v !== previousFlipFlops[i]
    );

    if (state.soundEnabled) playClockTick();

    set({
      flipFlops: newState.flipFlops,
      serialOut: newState.serialOut,
      cycle: newState.cycle,
      droppedBits: newState.droppedBits,
      history: newState.history,
      animation: {
        clockPulseActive: true,
        bitTraveling: true,
        resetWave: false,
        changedFlipFlops,
        previousFlipFlops,
      },
    });

    const duration = 600 / state.animationSpeed;
    setTimeout(() => {
      set((s) => ({
        animation: { ...s.animation, clockPulseActive: false, bitTraveling: false },
      }));
    }, duration);
  },

  doReset: () => {
    const state = get();
    if (state.soundEnabled) playReset();
    const newState = engineReset(state);
    set({
      ...newState,
      autoClockEnabled: false,
      isLoadingWord: false,
      animation: {
        clockPulseActive: false,
        bitTraveling: false,
        resetWave: true,
        changedFlipFlops: [true, true, true, true],
        previousFlipFlops: state.flipFlops,
      },
    });
    setTimeout(() => {
      set((s) => ({
        animation: { ...s.animation, resetWave: false },
      }));
    }, 800);
  },

  doStepBack: () => {
    const state = get();
    const newState = engineStepBack(state);
    set({
      flipFlops: newState.flipFlops,
      serialOut: newState.serialOut,
      cycle: newState.cycle,
      droppedBits: newState.droppedBits,
      history: newState.history,
    });
  },

  loadWord: async (word: string) => {
    const bits = word.split('').filter((c) => c === '0' || c === '1');
    if (bits.length === 0) return;
    set({ isLoadingWord: true, loadingWordProgress: 0, loadingWordTotal: bits.length });

    for (let i = 0; i < bits.length; i++) {
      const state = get();
      if (!state.isLoadingWord) break;
      set({ loadingWordProgress: i + 1 });
      get().setDataIn(bits[i] === '1');
      await new Promise((r) => setTimeout(r, 100));
      get().doClock();
      await new Promise((r) => setTimeout(r, 400 / state.animationSpeed));
    }

    set({ isLoadingWord: false, loadingWordProgress: 0, loadingWordTotal: 0 });
  },

  toggleEducation: () => set((s) => ({ showEducation: !s.showEducation })),

  clearAnimationState: () =>
    set({
      animation: {
        clockPulseActive: false,
        bitTraveling: false,
        resetWave: false,
        changedFlipFlops: [false, false, false, false],
        previousFlipFlops: [false, false, false, false],
      },
    }),
}));
