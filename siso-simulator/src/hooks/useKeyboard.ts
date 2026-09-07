import { useEffect } from 'react';
import { useSimStore } from '../store/simulation';

export function useKeyboard() {
  const {
    toggleDataIn,
    doClock,
    toggleAutoClock,
    doReset,
    doStepBack,
    setActiveTab,
    toggleTheme,
    toggleSound,
    toggleEducation,
    autoClockEnabled,
    isLoadingWord,
  } = useSimStore();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          toggleDataIn();
          break;
        case 'Enter':
          e.preventDefault();
          if (!autoClockEnabled && !isLoadingWord) doClock();
          break;
        case 'a':
        case 'A':
          toggleAutoClock();
          break;
        case 'r':
        case 'R':
          doReset();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          doStepBack();
          break;
        case '1':
          setActiveTab('schematic');
          break;
        case '2':
          setActiveTab('breadboard');
          break;
        case '3':
          setActiveTab('timing');
          break;
        case '4':
          setActiveTab('table');
          break;
        case 't':
        case 'T':
          toggleTheme();
          break;
        case 'm':
        case 'M':
          toggleSound();
          break;
        case '?':
          toggleEducation();
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    toggleDataIn,
    doClock,
    toggleAutoClock,
    doReset,
    doStepBack,
    setActiveTab,
    toggleTheme,
    toggleSound,
    toggleEducation,
    autoClockEnabled,
    isLoadingWord,
  ]);
}
