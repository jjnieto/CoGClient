import { useState, useEffect } from 'react';

export function useTimeLock(timeLock: number) {
  const [secondsRemaining, setSecondsRemaining] = useState(() => {
    const now = Math.trunc(Date.now() / 1000);
    return Math.max(0, timeLock - now);
  });

  useEffect(() => {
    const now = Math.trunc(Date.now() / 1000);
    setSecondsRemaining(Math.max(0, timeLock - now));

    if (timeLock <= now) return;

    const interval = setInterval(() => {
      const current = Math.trunc(Date.now() / 1000);
      const remaining = Math.max(0, timeLock - current);
      setSecondsRemaining(remaining);
      if (remaining === 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLock]);

  return {
    secondsRemaining,
    isLocked: secondsRemaining > 0,
  };
}
