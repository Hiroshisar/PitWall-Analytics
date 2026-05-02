import styled from 'styled-components';
import { useFetchRaceControl } from '../hooks/useFetchRaceControl.ts';
import Spinner from '../ui/Spinner.tsx';

const StyledRaceControlContainer = styled.div`
  padding: 1rem;
  margin: 0.5rem;

  width: 50%;
  max-height: max(0px, calc(100dvh - 64rem));

  overflow-y: auto;
`;

const StyledRaceControlCard = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: fit-content;

  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 1rem;
  padding-bottom: 1rem;

  text-align: start;

  border: 1px solid var(--color-grey-600);
  border-radius: var(--border-radius-3xl);
`;

const StyledRaceControlTitle = styled.h1`
  padding-left: 4rem;
`;

const StyledRaceControlMessage = styled.h5`
  padding-left: 1rem;
`;

const StyledRaceControlMessageTime = styled.h5`
  padding-left: 2.5rem;
`;

function RaceControl({ sessionKey }: { sessionKey: number }) {
  const { data: raceControl, isLoading } = useFetchRaceControl(sessionKey);

  if (!raceControl) return null;
  raceControl.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  console.log('race control', raceControl);
  return (
    <>
      {isLoading ? <Spinner /> : null}
      <StyledRaceControlContainer>
        <StyledRaceControlTitle>RACE CONTROL</StyledRaceControlTitle>
        <>
          {raceControl.map((rc) => {
            const hrs = String(new Date(rc.date).getHours()).padStart(2, '0');
            const min = String(new Date(rc.date).getMinutes()).padStart(2, '0');
            const sec = String(new Date(rc.date).getSeconds()).padStart(2, '0');
            return (
              <StyledRaceControlCard>
                <StyledRaceControlMessage>
                  {rc.message}
                </StyledRaceControlMessage>
                <StyledRaceControlMessageTime>
                  {`${hrs}:${min}:${sec}`}
                </StyledRaceControlMessageTime>
              </StyledRaceControlCard>
            );
          })}
        </>
      </StyledRaceControlContainer>
    </>
  );
}

export default RaceControl;
