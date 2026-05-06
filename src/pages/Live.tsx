import { useEffect } from 'react';
import {
  cacheOpenF1LiveMessages,
  connectOpenF1LiveWebSocket,
  type OpenF1LiveConnection,
  type OpenF1LiveMessage,
  type OpenF1LiveTopic,
} from '../api/websocket';
import {
  LivePageRow,
  StyledLivePage,
  LivePageCenter,
  LivePageColumn,
  LivePageGridColumn,
} from '../style/styles';
import { queryClient } from '../hooks/queryClient';
import Session from '../components/Session.tsx';
import {
  useFetchLatestSession,
  useFetchNextSession,
} from '../hooks/useFetchSession.ts';
import Spinner from '../ui/Spinner.tsx';
import SessionGrid from '../components/SessionGrid.tsx';
import RaceControl from '../components/RaceControl.tsx';
import Map from '../components/Map.tsx';
import { checkIfIsLiveSession, latestOpenF1Key } from '../utils/helpers.ts';
import { useFetchRaceControl } from '../hooks/useFetchRaceControl.ts';
import Timer from '../components/Timer.tsx';

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
  const { data: latestSession, isLoading: isLoadingLatestSession } =
    useFetchLatestSession();

  const isLive = latestSession
    ? checkIfIsLiveSession(latestSession.date_start, latestSession.date_end)
    : false;

  const { data: raceControl = [] } = useFetchRaceControl(
    isLive ? latestOpenF1Key : 0
  );

  const { data: nextSession } = useFetchNextSession();

  useEffect(() => {
    if (!isLive || !latestSession) return;

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
      meetingKey: latestSession.meeting_key,
      sessionKey: latestSession.session_key,
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
  }, [isLive, latestSession]);

  if (isLoadingLatestSession) return <Spinner />;
  if (!latestSession) return null;

  // TODO aggiungere visualizzazione di elementi vuoti nella griglia con solo i DriverTag popolati
  return (
    <StyledLivePage>
      <LivePageRow>
        <Session />
      </LivePageRow>
      {isLive ? (
        <LivePageRow>
          <LivePageCenter>
            <LivePageGridColumn>
              <SessionGrid
                session={latestSession}
                sessionKey={latestOpenF1Key}
              />
            </LivePageGridColumn>
            <LivePageColumn>
              <LivePageRow>
                <Map
                  sessionKey={latestOpenF1Key}
                  meetingKey={latestSession.meeting_key}
                />
              </LivePageRow>
              <LivePageRow>
                <RaceControl raceControl={raceControl} />
              </LivePageRow>
            </LivePageColumn>
          </LivePageCenter>
        </LivePageRow>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h1>Next event in</h1>
          <Timer dateEnd={nextSession?.date_start ?? ''} />
        </div>
      )}
    </StyledLivePage>
  );
}

export default Live;
