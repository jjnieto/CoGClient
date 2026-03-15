import { useState, useEffect } from 'react';
import { computeCurrentVitality } from '../lib/vitality';

export function useVitality(storedVitality: number, lastVitalityUpdate: number) {
  const [vitality, setVitality] = useState(() =>
    computeCurrentVitality(storedVitality, lastVitalityUpdate),
  );

  useEffect(() => {
    setVitality(computeCurrentVitality(storedVitality, lastVitalityUpdate));

    const interval = setInterval(() => {
      setVitality(computeCurrentVitality(storedVitality, lastVitalityUpdate));
    }, 1000);

    return () => clearInterval(interval);
  }, [storedVitality, lastVitalityUpdate]);

  return vitality;
}
