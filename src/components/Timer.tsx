import { useState, useEffect } from 'react';
import { formatNextSessionTime } from '../utils/helpers';
import type { TimerProps } from '../utils/types.ts';

function Timer({ dateEnd }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(() =>
    getRemainingSeconds(dateEnd)
  );
  const isRunning = timeLeft > 0;

  useEffect(() => {
    const syncTimer = window.setTimeout(() => {
      setTimeLeft(getRemainingSeconds(dateEnd));
    }, 0);

    const timer = setInterval(() => {
      const remainingSeconds = getRemainingSeconds(dateEnd);
      setTimeLeft(remainingSeconds);

      if (remainingSeconds <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => {
      window.clearTimeout(syncTimer);
      clearInterval(timer);
    };
  }, [dateEnd]);

  return (
    <div>
      <h1>{formatNextSessionTime(timeLeft)}</h1>
      {!isRunning && <p>Tempo scaduto!</p>}
    </div>
  );
}

export default Timer;

function getRemainingSeconds(dateEnd: string) {
  const endTime = new Date(dateEnd).getTime();

  if (!Number.isFinite(endTime)) return 0;

  return Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
}
