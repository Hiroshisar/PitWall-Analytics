import type { intervalType } from '../utils/types.ts';

function Interval({ intervals }: { intervals: intervalType[] }) {
  if (!intervals || intervals.length < 1) return;

  const lastInterval = intervals[intervals.length - 1];

  const isLeader = lastInterval.interval <= 0;

  if (!lastInterval) return;
  return (
    <div>
      <h5>{isLeader ? '-' : `+ ${lastInterval.interval}`}</h5>
    </div>
  );
}

export default Interval;
