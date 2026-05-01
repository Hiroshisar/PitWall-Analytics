import { useState, useEffect } from 'react';

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

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <h1>{formatTime(timeLeft)}</h1>
      {!isRunning && <p>Tempo scaduto!</p>}
    </div>
  );
}

export default Timer;
