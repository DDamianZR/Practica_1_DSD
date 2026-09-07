import { useEffect, useRef } from 'react';
import { useSimStore } from '../store/simulation';

export function useClock() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoClockEnabled = useSimStore((s) => s.autoClockEnabled);
  const autoClockFrequency = useSimStore((s) => s.autoClockFrequency);
  const doClock = useSimStore((s) => s.doClock);
  const isLoadingWord = useSimStore((s) => s.isLoadingWord);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (autoClockEnabled && !isLoadingWord) {
      const ms = 1000 / autoClockFrequency;
      intervalRef.current = setInterval(doClock, ms);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoClockEnabled, autoClockFrequency, doClock, isLoadingWord]);
}
