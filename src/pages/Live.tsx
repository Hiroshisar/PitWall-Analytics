import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  cacheOpenF1LiveMessages,
  connectOpenF1LiveWebSocket,
  type OpenF1LiveConnection,
  type OpenF1LiveMessage,
  type OpenF1LiveTopic,
} from '../api/websocket';
import type { RootState } from '../store/store';
import type { sessionType } from '../utils/types';
import {
  LiveCountdownPanel,
  LivePageRow,
  StyledLivePage,
  LivePageCenter,
  LivePageColumn,
  LivePageGridColumn,
} from '../style/styles';
import { queryClient } from '../hooks/queryClient';
import Session from '../components/Session.tsx';
import Timer from '../components/Timer.tsx';
import { useFetchNextSession } from '../hooks/useFetchSession.ts';
import Spinner from '../ui/Spinner.tsx';
import SessionGrid from '../components/SessionGrid.tsx';
import RaceControl from '../components/RaceControl.tsx';
import Map from '../components/Map.tsx';
import { checkIfIsLiveSession } from '../utils/helpers.ts';
import { useFetchRaceControl } from '../hooks/useFetchRaceControl.ts';

const LIVE_PAGE_TOPICS: readonly OpenF1LiveTopic[] = [
  'v1/intervals',
  'v1/laps',
  'v1/location',
  'v1/pit',
  'v1/position',
  'v1/race_control',
  'v1/stints',
];

const LIVE_CACHE_FLUSH_INTERVAL_MS = 100;

function Live() {
  const meetingData = useSelector((store: RootState) => store.meeting);
  const sessionData = useSelector((store: RootState) => store.session);

  const { selectedMeetingKey } = meetingData;
  const { selectedSessionKey } = sessionData;

  const sessions = queryClient.getQueryData<sessionType[]>([
    'sessions',
    selectedMeetingKey,
  ]);

  const selectedSession = sessions?.find(
    (s) => s.session_key === selectedSessionKey
  );

  const isLive = selectedSession
    ? checkIfIsLiveSession(selectedSession.date_start, selectedSession.date_end)
    : false;
  const liveMeetingKey = selectedSession?.meeting_key ?? null;

  const { data: nextSession, isLoading: isLoadingNextSession } =
    useFetchNextSession(!isLive);

  const { data: raceControl = [] } = useFetchRaceControl(
    isLive ? (selectedSessionKey ?? 0) : 0
  );

  useEffect(() => {
    if (!isLive || !liveMeetingKey || !selectedSessionKey) return;

    let isCancelled = false;
    let liveConnection: OpenF1LiveConnection | null = null;
    let flushTimer: number | null = null;
    const pendingMessages: OpenF1LiveMessage[] = [];

    const flushMessages = () => {
      flushTimer = null;
      if (pendingMessages.length === 0) return;

      const messages = pendingMessages.splice(0, pendingMessages.length);
      cacheOpenF1LiveMessages(queryClient, messages);
    };

    const scheduleFlush = () => {
      if (flushTimer) return;

      flushTimer = window.setTimeout(
        flushMessages,
        LIVE_CACHE_FLUSH_INTERVAL_MS
      );
    };

    connectOpenF1LiveWebSocket({
      topics: LIVE_PAGE_TOPICS,
      meetingKey: liveMeetingKey,
      sessionKey: selectedSessionKey,
      onMessage: (message) => {
        pendingMessages.push(message);
        scheduleFlush();
      },
      onError: (error) => {
        console.error('OpenF1 live stream error:', error);
      },
    })
      .then((connection) => {
        if (isCancelled) {
          connection.close();
          return;
        }

        liveConnection = connection;
      })
      .catch((error: unknown) => {
        console.error('Unable to start OpenF1 live stream:', error);
      });

    return () => {
      isCancelled = true;
      pendingMessages.splice(0, pendingMessages.length);
      if (flushTimer) window.clearTimeout(flushTimer);
      liveConnection?.close();
    };
  }, [isLive, liveMeetingKey, selectedSessionKey]);

  if (!selectedSession) return;

  if (isLoadingNextSession) return <Spinner />;

  return (
    <>
      {isLive ? (
        <StyledLivePage>
          <LivePageRow>
            <Session />
          </LivePageRow>
          <LivePageRow>
            <LivePageCenter>
              <LivePageGridColumn>
                <SessionGrid session={selectedSession} />
              </LivePageGridColumn>
              <LivePageColumn>
                <LivePageRow>
                  <Map
                    key={selectedSessionKey ?? 0}
                    sessionKey={selectedSessionKey ?? 0}
                    meetingKey={selectedSession.meeting_key}
                  />
                </LivePageRow>
                <LivePageRow>
                  <RaceControl raceControl={raceControl} />
                </LivePageRow>
              </LivePageColumn>
            </LivePageCenter>
          </LivePageRow>
        </StyledLivePage>
      ) : (
        <StyledLivePage>
          <LivePageRow>
            <Session session={nextSession ? nextSession : undefined} />
          </LivePageRow>
          <LivePageRow>
            <LiveCountdownPanel>
              <h1>Next session in</h1>
              <Timer dateEnd={nextSession?.date_start ?? ''} />
            </LiveCountdownPanel>
          </LivePageRow>
        </StyledLivePage>
      )}
    </>
  );
}

export default Live;
