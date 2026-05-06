import { useMemo } from 'react';
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
import { useAppDispatch } from '../store/hooks.ts';
import { setSelectedSessionKey } from '../store/sessionSlice.ts';
import { setSelectedMeetingKey } from '../store/meetingSlice.ts';
import { useLocation } from 'react-router-dom';
import { useFetchNextSession } from '../hooks/useFetchSession.ts';

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
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const isTelemetryPage = pathname === '/telemetry';
  const currentDateIso = useMemo(() => new Date().toISOString(), []);
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

  const sessions =
    queryClient.getQueryData<sessionType[]>(['sessions', selectedMeetingKey]) ??
    [];

  const selectedMeeting =
    meeting ??
    meetings.find((meeting) => meeting.meeting_key === selectedMeetingKey);

  const { data: nextMeeting } = useFetchNextMeeting(currentDateIso);
  const selectedSessionIsLive = selectedSession
    ? checkIfIsLiveSession(selectedSession.date_start, selectedSession.date_end)
    : false;
  const shouldFetchNextSession =
    !isTelemetryPage && !session && !selectedSessionIsLive;
  const { data: nextSession } = useFetchNextSession(shouldFetchNextSession);
  const displaySession =
    isTelemetryPage || selectedSessionIsLive
      ? selectedSession
      : (session ?? nextSession ?? selectedSession);

  const cachedSessionMeeting = meetings.find(
    (meeting) => meeting.meeting_key === displaySession?.meeting_key
  );
  const nextSessionMeeting =
    nextMeeting?.meeting_key === displaySession?.meeting_key
      ? nextMeeting
      : undefined;
  const selectedSessionMeeting =
    selectedMeeting?.meeting_key === displaySession?.meeting_key
      ? selectedMeeting
      : undefined;

  const sessionMeeting =
    meeting ??
    cachedSessionMeeting ??
    nextSessionMeeting ??
    selectedSessionMeeting;

  const isLive = displaySession
    ? checkIfIsLiveSession(displaySession.date_start, displaySession.date_end)
    : false;
  const sessionKey = isLive ? (displaySession?.session_key ?? 0) : 0;
  const { data: raceControl = [] } = useFetchRaceControl(sessionKey);

  if (!displaySession) return null;

  const handleMeetingSelection = (key: number) => {
    dispatch(setSelectedMeetingKey(key));
  };

  const handleSessionSelection = (key: number) => {
    dispatch(setSelectedSessionKey(key));
  };

  return (
    <StyledSession $islive={isLive}>
      <SessionNationAndDate>
        <SessionHeader>
          {isTelemetryPage ? (
            <Select
              value={selectedMeetingKey ?? 0}
              meetings={meetings}
              onSelect={handleMeetingSelection}
            />
          ) : (
            <h1>{displaySession.circuit_short_name}</h1>
          )}
          <img
            src={sessionMeeting?.country_flag ?? ''}
            alt={sessionMeeting?.country_name ?? ''}
            width={45}
          />
        </SessionHeader>
        <h4>{formatDate(displaySession.date_start)}</h4>
      </SessionNationAndDate>
      <SessionData>
        {isTelemetryPage ? (
          <>
            <Select
              value={selectedSessionKey ?? 0}
              sessions={sessions}
              onSelect={handleSessionSelection}
            ></Select>
            {maxNumberOfLaps && selectedLap !== undefined ? (
              <Select
                value={selectedLap}
                max={maxNumberOfLaps}
                onSelect={setSelectedLap}
              />
            ) : null}{' '}
          </>
        ) : (
          <h2>{displaySession.session_name}</h2>
        )}
      </SessionData>
      {isLive ? (
        <>
          <div>
            <Timer dateEnd={displaySession.date_end} />
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
