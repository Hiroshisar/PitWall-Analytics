import { StyledOption, StyledSelect, StyledSession } from '../style/styles';
import { checkIfIsLiveSession, formatDate } from '../utils/helpers';
import type { sessionType } from '../utils/types';
import Flag from './Flag';
import Timer from './Timer';
import Weather from './Weather';

function Session({
  session,
  selectedLap,
  maxNumberOfLaps,
  setSelectedLap,
}: {
  session: sessionType;
  selectedLap: number;
  maxNumberOfLaps: number;
  setSelectedLap: (lap: number) => void;
}) {
  if (!session) return null;

  const isLive = checkIfIsLiveSession(session.date_start, session.date_end);

  return (
    <>
      <StyledSession isLive={isLive}>
        <div>
          <div>
            <h2>{session.circuit_short_name}</h2>
            <h3>{session.country_name}</h3>
            <h5>{formatDate(session.date_start)}</h5>
          </div>
          <div>
            <h3>{session.session_name}</h3>
            {maxNumberOfLaps ? (
              <h3>
                Giro{' '}
                <StyledSelect
                  value={selectedLap ?? '0'}
                  onChange={(e) => setSelectedLap(Number(e.target.value))}
                >
                  <StyledOption value="0" disabled>
                    ---
                  </StyledOption>
                  {Array.from(
                    {
                      length: maxNumberOfLaps ?? 0,
                    },
                    (_, index) => (
                      <StyledOption key={index} value={index + 1}>
                        {index + 1}
                      </StyledOption>
                    )
                  )}
                </StyledSelect>
              </h3>
            ) : null}
          </div>
        </div>
        {isLive ? (
          <>
            <div>
              <Timer />
            </div>
            <div>
              <Weather />
            </div>
            <div>
              <Flag />
            </div>
          </>
        ) : null}
      </StyledSession>
    </>
  );
}

export default Session;
