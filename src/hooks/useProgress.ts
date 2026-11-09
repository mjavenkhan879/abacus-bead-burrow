import { useCallback, useState } from 'react';

export type ProgressState = {
  carrots: number;
  stars: number;
  mastered: number[];
  best: number;
  sessions: number;
};

export function useProgress() {
  const [carrots, setCarrots] = useState(0);
  const [stars, setStars] = useState(0);
  const [mastered, setMastered] = useState<number[]>([]);
  const [best, setBest] = useState(0);
  const [sessions, setSessions] = useState(0);

  const addCarrots = useCallback((n: number) => {
    setCarrots(prev => prev + n);
  }, []);

  const addStar = useCallback(() => {
    setStars(prev => prev + 1);
  }, []);

  const markMastered = useCallback((n: number) => {
    setMastered(prev => (prev.indexOf(n) >= 0 ? prev : [...prev, n]));
  }, []);

  const reportStreak = useCallback((streak: number) => {
    setBest(prev => (streak > prev ? streak : prev));
  }, []);

  const finishSession = useCallback(() => {
    setSessions(prev => prev + 1);
  }, []);

  return {
    carrots,
    stars,
    mastered,
    best,
    sessions,
    addCarrots,
    addStar,
    markMastered,
    reportStreak,
    finishSession,
  };
}

export default useProgress;
