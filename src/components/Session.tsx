import { useSelector } from 'react-redux';
import { queryClient } from '../hooks/queryClient';
import type { RootState } from '../store/store';
import {
  SessionHeader,
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
import { useFetchNextMeeting } from '../hooks/useFetchMeetings.ts';
import { useFetchRaceControl } from '../hooks/useFetchRaceControl.ts';

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
  const selectedMeetingKey = useSelector(
    (store: RootState) => store.meeting.selectedMeetingKey
  );
  const selectedSessionKey = useSelector(
    (store: RootState) => store.session.selectedSessionKey
  );

  const selectedSession =
    session ??
    queryClient
      .getQueryData<sessionType[]>(['sessions', selectedMeetingKey])
      ?.find((session) => session.session_key === selectedSessionKey);

  const meetings =
    queryClient.getQueryData<meetingType[]>([
      'meetings',
      new Date().getFullYear(),
    ]) ?? [];

  const selectedMeeting =
    meeting ??
    meetings.find((meeting) => meeting.meeting_key === selectedMeetingKey);

  const { data: nextMeeting } = useFetchNextMeeting(
    selectedMeeting?.date_end ?? ''
  );

  const sessionMeeting =
    meeting ??
    meetings.find(
      (meeting) => meeting.meeting_key === selectedSession?.meeting_key
    ) ??
    (nextMeeting?.meeting_key === selectedSession?.meeting_key
      ? nextMeeting
      : undefined) ??
    selectedMeeting;

  const sessionKey = selectedSession?.session_key ?? 0;
  const { data: raceControl = [] } = useFetchRaceControl(sessionKey);

  if (!selectedSession) return null;

  const isLive = checkIfIsLiveSession(
    selectedSession.date_start,
    selectedSession.date_end
  );

  return (
    <StyledSession $islive={isLive}>
      <SessionNationAndDate>
        <SessionHeader>
          <h1>{selectedSession.circuit_short_name}</h1>
          <img
            src={sessionMeeting?.country_flag}
            alt="country flag"
            width={25}
          />
        </SessionHeader>
        <h4>{formatDate(selectedSession.date_start)}</h4>
      </SessionNationAndDate>
      <SessionData>
        <h2>{selectedSession.session_name}</h2>
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
      {isLive ? (
        <>
          <div>
            <Timer dateEnd={selectedSession.date_end} />
          </div>
          <div>
            <Weather />
          </div>
          <div>
            <Flag race_control={raceControl[raceControl.length - 1] ?? {}} />
          </div>
        </>
      ) : null}
    </StyledSession>
  );
}

export default Session;
