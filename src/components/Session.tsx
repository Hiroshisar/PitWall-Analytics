import { useLocation } from 'react-router-dom';
import {
  SessionHeader,
  SessionData,
  SessionNationAndDate,
  StyledSession,
} from '../style/styles';
import {
  checkIfIsLiveSession,
  formatDate,
  latestOpenF1Key,
} from '../utils/helpers';
import type { SessionProps } from '../utils/types';
import Flag from './Flag';
import Timer from './Timer';
import Weather from '../pages/Weather';
import { Select } from '../ui/Select.tsx';
import {
  useFetchLatestMeeting,
  useFetchNextMeeting,
} from '../hooks/useFetchMeetings.ts';
import { useFetchRaceControl } from '../hooks/useFetchRaceControl.ts';
import {
  useFetchLatestSession,
  useFetchNextSession,
} from '../hooks/useFetchSession.ts';

function Session({
  selectedLap,
  maxNumberOfLaps,
  session,
  meeting,
  meetings = [],
  sessions = [],
  selectedMeetingKey,
  selectedSessionKey,
  setSelectedLap = () => {},
  onMeetingSelect,
  onSessionSelect,
}: SessionProps) {
  const { pathname } = useLocation();
  const isTelemetryPage = pathname === '/telemetry';
  const { data: latestSession, isFetched: isLatestSessionFetched } =
    useFetchLatestSession(!isTelemetryPage && !session);
  const latestSessionIsLive = latestSession
    ? checkIfIsLiveSession(latestSession.date_start, latestSession.date_end)
    : false;
  const shouldFetchNextSession =
    !isTelemetryPage &&
    !session &&
    isLatestSessionFetched &&
    !latestSessionIsLive;
  const { data: nextSession } = useFetchNextSession(shouldFetchNextSession);
  const { data: latestMeeting } = useFetchLatestMeeting(
    !isTelemetryPage && !meeting && latestSessionIsLive
  );
  const { data: nextMeeting } = useFetchNextMeeting(
    !isTelemetryPage &&
      !meeting &&
      isLatestSessionFetched &&
      !latestSessionIsLive
  );

  const selectedMeeting =
    meeting ??
    meetings.find((meeting) => meeting.meeting_key === selectedMeetingKey);

  const selectedSession =
    session ??
    sessions.find((session) => session.session_key === selectedSessionKey);

  const displaySession = isTelemetryPage
    ? selectedSession
    : (session ??
      (latestSessionIsLive
        ? latestSession
        : isLatestSessionFetched
          ? nextSession
          : undefined) ??
      selectedSession);

  const cachedSessionMeeting = meetings.find(
    (meeting) => meeting.meeting_key === displaySession?.meeting_key
  );
  const latestSessionMeeting =
    latestMeeting?.meeting_key === displaySession?.meeting_key
      ? latestMeeting
      : undefined;
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
    latestSessionMeeting ??
    nextSessionMeeting ??
    selectedSessionMeeting;

  const isLive = displaySession
    ? checkIfIsLiveSession(displaySession.date_start, displaySession.date_end)
    : false;
  const sessionKey = isLive ? latestOpenF1Key : 0;
  const { data: raceControl = [] } = useFetchRaceControl(sessionKey);

  if (!displaySession) return null;

  const handleMeetingSelection = (key: number) => {
    onMeetingSelect?.(key);
  };

  const handleSessionSelection = (key: number) => {
    onSessionSelect?.(key);
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
