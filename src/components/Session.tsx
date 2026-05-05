import { useSelector } from 'react-redux';
import { queryClient } from '../hooks/queryClient';
import type { RootState } from '../store/store';
import {
  SessionData,
  SessionNationAndDate,
  StyledSession,
} from '../style/styles';
import { formatDate } from '../utils/helpers';
import type { meetingType, sessionType } from '../utils/types';
import Flag from './Flag';
import Timer from './Timer';
import Weather from '../pages/Weather';
import { Select } from '../ui/Select.tsx';
import { useFetchNextMeeting } from '../hooks/useFetchMeetings.ts';
import { useLocation } from 'react-router-dom';

function Session({
  selectedLap,
  maxNumberOfLaps,
  session,
  meeting,
  setSelectedLap = () => {},
}: {
  selectedLap?: number;
  maxNumberOfLaps?: number;
  session?: sessionType;
  meeting?: meetingType;
  setSelectedLap?: (lap: number) => void;
}) {
  const { pathname } = useLocation();
  const selectedMeetingKey = useSelector(
    (store: RootState) => store.meeting.selectedMeetingKey
  );
  const selectedSessionKey = useSelector(
    (store: RootState) => store.session.selectedSessionKey
  );
  if (!session)
    session = queryClient
      .getQueryData<sessionType[]>(['sessions', selectedMeetingKey])
      ?.find((session) => session.session_key === selectedSessionKey);

  if (!meeting)
    meeting = queryClient
      .getQueryData<meetingType[]>(['meetings', new Date().getFullYear()])
      ?.find((meeting) => meeting.meeting_key === selectedMeetingKey);

  const { data: nextMeeting } = useFetchNextMeeting(
    meeting ? meeting.date_end : ''
  );

  if (!session) return null;
  const islive = true; //checkIfIsLiveSession(session.date_start, session.date_end);

  return (
    <StyledSession $islive={islive}>
      <SessionNationAndDate>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1>{session.circuit_short_name}</h1>
          <img
            src={
              pathname === '/telemetry'
                ? meeting?.country_flag
                : nextMeeting?.country_flag
            }
            alt="country flag"
            width={25}
          />
        </div>
        <h4>{formatDate(session.date_start)}</h4>
      </SessionNationAndDate>
      <SessionData>
        <h2>{session.session_name}</h2>
        {maxNumberOfLaps && selectedLap !== undefined ? (
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
