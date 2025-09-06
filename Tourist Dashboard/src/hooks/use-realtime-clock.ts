'use client';

import { useState, useEffect } from 'react';

export function useRealtimeClock(interval: number = 1000) {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set initial time on mount (client-side)
    setTime(new Date());

    const timerId = setInterval(() => {
      setTime(new Date());
    }, interval);

    return () => clearInterval(timerId);
  }, [interval]);

  return time;
}
