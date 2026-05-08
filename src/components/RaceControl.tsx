import { useMemo } from 'react';
import type { RaceControlProps } from '../utils/types.ts';
import {
  RaceControlCard,
  RaceControlContainer,
  RaceControlMessage,
  RaceControlMessageTime,
  RaceControlTitle,
} from '../style/styles.ts';

const MAX_VISIBLE_RACE_CONTROL_MESSAGES = 50;

function RaceControl({ raceControl }: RaceControlProps) {
  const visibleRaceControl = useMemo(
    () =>
      (raceControl ?? [])
        .slice()
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, MAX_VISIBLE_RACE_CONTROL_MESSAGES),
    [raceControl]
  );

  return (
    <RaceControlContainer>
      <RaceControlTitle>RACE CONTROL</RaceControlTitle>
      {visibleRaceControl.map((rc, index) => {
        const date = new Date(rc.date);
        const hrs = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        const sec = String(date.getSeconds()).padStart(2, '0');

        return (
          <RaceControlCard key={`${rc.date}-${rc.category}-${index}`}>
            <RaceControlMessage>{rc.message}</RaceControlMessage>
            <RaceControlMessageTime>
              {`${hrs}:${min}:${sec}`}
            </RaceControlMessageTime>
          </RaceControlCard>
        );
      })}
    </RaceControlContainer>
  );
}

export default RaceControl;
