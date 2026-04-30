import { useSelector } from 'react-redux';
import { queryClient } from '../hooks/queryClient';
import type { RootState } from '../store/store';
import {
  SessionData,
  SessionNationAndDate,
  StyledSession,
} from '../style/styles';
import { checkIfIsLiveSession, formatDate } from '../utils/helpers';
import type { meetingType, sessionType } from '../utils/types';
import Flag from './Flag';
import Timer from './Timer';
import Weather from '../pages/Weather';
import { Select } from '../ui/Select.tsx';

function Session({
  selectedLap,
  maxNumberOfLaps,
  setSelectedLap = () => {},
}: {
  selectedLap?: number;
  maxNumberOfLaps?: number;
  setSelectedLap?: (lap: number) => void;
}) {
  const selectedMeetingKey = useSelector(
    (store: RootState) => store.meeting.selectedMeetingKey
  );
  const selectedSessionKey = useSelector(
    (store: RootState) => store.session.selectedSessionKey
  );

  const session = queryClient
    .getQueryData<sessionType[]>(['sessions', selectedMeetingKey])
    ?.find((session) => session.session_key === selectedSessionKey);

  const meeting = queryClient
    .getQueryData<meetingType[]>(['meetings', new Date().getFullYear()])
    ?.find((meeting) => meeting.meeting_key === selectedMeetingKey);

  if (!session) return null;
  const islive = checkIfIsLiveSession(session.date_start, session.date_end);

  return (
    <StyledSession $islive={islive}>
      <SessionNationAndDate>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1>{session.circuit_short_name}</h1>
          <img
            src={meeting ? meeting.country_flag : ''}
            alt="country flag"
            width={25}
          />
        </div>
        <h4>{formatDate(session.date_start)}</h4>
      </SessionNationAndDate>
      <SessionData>
        <h2>{session.session_name}</h2>
        {maxNumberOfLaps && selectedLap ? (
          <h3>
            Giro{' '}
            <Select
              selectedLap={selectedLap}
              max={maxNumberOfLaps}
              onSelect={setSelectedLap}
            />
          </h3>
        ) : null}{' '}
      </SessionData>
      {islive ? (
        <>
          <div>
            <Timer
              dateStart={new Date().toString()}
              dateEnd={session.date_end}
            />
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
  );
}

export default Session;
