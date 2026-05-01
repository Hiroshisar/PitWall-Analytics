import { useFetchRaceControl } from '../hooks/useFetchRaceControl.ts';

function RaceControl({ sessionKey }: { sessionKey: number }) {
  const { data: raceControl } = useFetchRaceControl(sessionKey);

  if (!raceControl) return;
  raceControl.sort(
    (a, b) => new Date(b.date).getSeconds() - new Date(a.date).getSeconds()
  );

  return (
    <div>
      <h1>RACE CONTROL</h1>
      <div>
        {raceControl.map((rc) => (
          <div>
            <h3>
              {rc.message}{' '}
              {`${new Date(rc.date).getHours()}:${new Date(rc.date).getMinutes()}:${new Date(rc.date).getSeconds()}`}{' '}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RaceControl;
