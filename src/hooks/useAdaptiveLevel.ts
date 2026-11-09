import { useCallback, useRef, useState } from 'react';
import { STREAK_UP, STRUGGLE_DOWN } from '../constants/config';
import { MAX_LEVEL, MIN_LEVEL, rangeForLevel } from '../game/levels';

/**
 * Streak / struggle bookkeeping. Live counters live in refs so the round
 * callbacks never read a stale closure.
 */
export function useAdaptiveLevel(start = MIN_LEVEL) {
  const [level, setLevel] = useState(start);
  const streak = useRef(0);
  const struggle = useRef(0);
  const [easier, setEasier] = useState(false);

  const onCorrect = useCallback((firstTry: boolean) => {
    if (firstTry) {
      streak.current += 1;
      struggle.current = 0;
      if (streak.current >= STREAK_UP) {
        streak.current = 0;
        setLevel(prev => Math.min(prev + 1, MAX_LEVEL));
      }
      setEasier(false);
    } else {
      streak.current = 0;
    }
  }, []);

  const onRecount = useCallback(() => {
    streak.current = 0;
    struggle.current += 1;
    if (struggle.current >= STRUGGLE_DOWN) {
      struggle.current = 0;
      setLevel(prev => Math.max(prev - 1, MIN_LEVEL));
      setEasier(true);
    }
  }, []);

  const reset = useCallback(() => {
    streak.current = 0;
    struggle.current = 0;
    setEasier(false);
    setLevel(start);
  }, [start]);

  return {
    level,
    range: rangeForLevel(level),
    easier,
    streakRef: streak,
    onCorrect,
    onRecount,
    reset,
  };
}

export default useAdaptiveLevel;
