import { useState, useEffect } from 'react';
import { formatTime } from '../utils/helpers';

function Timer({ dateStart, dateEnd }: { dateStart: string; dateEnd: string }) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  useEffect(() => {
    const startDate = new Date(dateStart);
    const endDate = new Date(dateEnd);
    const duration = (endDate.getTime() - startDate.getTime()) / 1000;
    // no cascading renders because dateStart and dateEnd never change
    setTimeLeft(duration); // eslint-disable-line

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [dateStart, dateEnd]);

  return (
    <div>
      <h1>{formatTime(timeLeft)}</h1>
      {!isRunning && <p>Tempo scaduto!</p>}
    </div>
  );
}

export default Timer;
