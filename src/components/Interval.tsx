import type { intervalType } from '../utils/types.ts';

function Interval({ intervals }: { intervals: intervalType[] }) {
  if (!intervals || intervals.length < 1) return;

  const lastInterval = intervals[intervals.length - 1];

  if (!lastInterval) return;
  return (
    <div>
      <div>
        <h5>
          ldr: {lastInterval.gap_to_leader ? lastInterval.gap_to_leader : '-'}
        </h5>
      </div>
      <div>
        <h5>nxt: {lastInterval.interval}</h5>
      </div>
    </div>
  );
}

export default Interval;
